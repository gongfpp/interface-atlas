import test from 'node:test';
import assert from 'node:assert/strict';

const draft = {
  conceptId: 'input', conceptType: 'components', name: '输入框', locale: 'zh',
  styleId: 'minimalism', styleName: '极简主义', mode: 'default', modeName: '默认',
  variant: 'filled', variantName: '填充', requirements: ['不新增依赖'],
  prompt: '实现当前输入框方案', group: '个人网站', note: '首页表单',
  url: 'https://atlas.example/components/input?style=minimalism&form=filled',
};
let sequence = 0;
async function setup() {
  const disk = new Map(); let full = true;
  globalThis.window = {
    location: { origin: 'https://atlas.example' },
    localStorage: { getItem: key => disk.get(key) ?? null, setItem(key, value) { if (full) throw new Error('quota'); disk.set(key, value); } },
  };
  const store = await import(`../../src/lib/solutions.ts?save=${sequence++}`);
  return { store, disk, recover() { full = false; } };
}
test.afterEach(() => { delete globalThis.window; });

test('同一方案连续失败后重试成功，内存与磁盘始终只有一条，创建时间不变', async () => {
  const { store, disk, recover } = await setup();
  let attempt = store.saveSolutionDraft(draft, null);
  const id = attempt.id, createdAt = attempt.createdAt;
  for (let i = 0; i < 3; i++) {
    assert.equal(attempt.persisted, false);
    assert.equal(store.getSolutionsSnapshot().length, 1);
    attempt = store.saveSolutionDraft(draft, attempt);
    assert.equal(attempt.id, id); assert.equal(attempt.createdAt, createdAt);
  }
  assert.equal(disk.size, 0);
  recover(); attempt = store.saveSolutionDraft(draft, attempt);
  assert.equal(attempt.persisted, true); assert.equal(attempt.id, id);
  const saved = JSON.parse(disk.get('ia-solutions-v1'));
  assert.equal(saved.length, 1); assert.deepEqual(saved[0], { ...draft, id, createdAt });
  const reopened = await import(`../../src/lib/solutions.ts?save=${sequence++}`);
  assert.deepEqual(reopened.getSolutionsSnapshot(), saved);
  assert.equal(reopened.exportSolutionsMarkdown(saved, 'zh').match(/### 输入框/g).length, 1);
});

test('不同方案或项目仍能新增，重试不会覆盖之前的选择', async () => {
  const { store, recover } = await setup();
  const first = store.saveSolutionDraft(draft, null);
  const changed = { ...draft, group: '后台', prompt: '另一套交互与验收要求' };
  let second = store.saveSolutionDraft(changed, first);
  assert.notEqual(second.id, first.id); assert.equal(store.getSolutionsSnapshot().length, 2);
  recover(); second = store.saveSolutionDraft(changed, second);
  assert.equal(second.persisted, true); assert.equal(store.getSolutionsSnapshot().length, 2);
  assert.equal(store.getSolutionsSnapshot().find(item => item.id === first.id).prompt, draft.prompt);
});

test('签名覆盖配置与要求，分组和理由边缘空白不制造副本', async () => {
  const { store, recover } = await setup(); recover();
  const first = store.saveSolutionDraft(draft, null);
  const trimmed = store.saveSolutionDraft({ ...draft, group: ' 个人网站 ', note: ' 首页表单 ' }, first);
  assert.equal(trimmed.id, first.id); assert.equal(store.getSolutionsSnapshot().length, 1);
  for (const patch of [{mode:'dark'}, {styleId:'glassmorphism'}, {variant:'outline'}, {requirements:[]}, {url:draft.url+'&width=360'}, {locale:'en'}]) {
    assert.notEqual(store.solutionDraftSignature({ ...draft, ...patch }), first.signature);
  }
});
