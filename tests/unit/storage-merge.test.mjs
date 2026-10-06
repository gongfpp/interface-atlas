import test from 'node:test';
import assert from 'node:assert/strict';

const SOLUTIONS_KEY = 'ia-solutions-v1';
let sequence = 0;
const draft = {
  conceptId: 'input', conceptType: 'components', name: '输入框', locale: 'zh',
  styleId: 'minimalism', styleName: '极简主义', mode: 'default',
  variant: 'filled', requirements: [], prompt: '实现输入框', group: '网站', note: '表单',
  url: 'https://atlas.example/components/input/',
};
const solution = (id, patch = {}) => ({ ...draft, id, createdAt: 100, ...patch });

// Each import has independent module memory, while the tabs share actual disk data.
// Tab-local failures allow A to fail while B performs real successful store operations.
async function harness(module, initial = {}) {
  const disk = new Map(Object.entries(initial));
  const tabs = [];
  for (let index = 0; index < 2; index++) {
    const tab = { readsBlocked: false, writesBlocked: false, writes: 0 };
    tab.window = {
      location: { origin: 'https://atlas.example' },
      addEventListener() {},
      localStorage: {
        getItem(key) {
          if (tab.readsBlocked) throw new Error('security');
          return disk.get(key) ?? null;
        },
        setItem(key, value) {
          tab.writes++;
          if (tab.writesBlocked) throw new Error('quota');
          disk.set(key, value);
        },
      },
    };
    globalThis.window = tab.window;
    tab.store = await import(`../../src/lib/${module}.ts?merge=${sequence++}`);
    tab.run = callback => {
      globalThis.window = tab.window;
      return callback(tab.store);
    };
    tabs.push(tab);
  }
  return { disk, a: tabs[0], b: tabs[1], read: key => JSON.parse(disk.get(key) ?? '[]') };
}
test.afterEach(() => { delete globalThis.window; });

test('方案：失败保存重试保留另一页的新增与编辑，并且不复活它删除的其他条目', async () => {
  const { a, b, read } = await harness('solutions', {
    [SOLUTIONS_KEY]: JSON.stringify([solution('edited'), solution('deleted'), solution('untouched')]),
  });
  a.run(store => store.getSolutionsSnapshot());
  a.writesBlocked = true;
  assert.equal(a.run(store => store.saveSolution(solution('local'))), false);
  b.run(store => {
    assert.equal(store.saveSolution(solution('remote')), true);
    assert.equal(store.updateSolution('edited', { note: '另一页的新理由' }), true);
    assert.equal(store.removeSolution('deleted'), true);
  });
  const pendingView = a.run(store => store.getSolutionsSnapshot());
  assert.deepEqual(new Set(pendingView.map(item => item.id)), new Set(['local', 'remote', 'edited', 'untouched']));
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  const saved = read(SOLUTIONS_KEY);
  assert.deepEqual(new Set(saved.map(item => item.id)), new Set(['local', 'remote', 'edited', 'untouched']));
  assert.equal(saved.find(item => item.id === 'edited').note, '另一页的新理由');
  assert.deepEqual(saved.find(item => item.id === 'untouched'), solution('untouched'));
});

test('方案：同一条目仅重放本页改动的字段，保留另一页改动的理由', async () => {
  const { a, b, read } = await harness('solutions', { [SOLUTIONS_KEY]: JSON.stringify([solution('shared')]) });
  a.writesBlocked = true;
  assert.equal(a.run(store => store.updateSolution('shared', { group: '本页分组', note: draft.note })), false);
  b.run(store => store.updateSolution('shared', { note: '另一页理由' }));
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  assert.deepEqual(read(SOLUTIONS_KEY), [solution('shared', { group: '本页分组', note: '另一页理由' })]);
});

test('方案：失败编辑在另一页删除后不会复活条目，失败移除仍优先于另一页编辑', async () => {
  const { a, b, read } = await harness('solutions', {
    [SOLUTIONS_KEY]: JSON.stringify([solution('edit-then-delete'), solution('delete-then-edit')]),
  });
  a.writesBlocked = true;
  a.run(store => store.updateSolution('edit-then-delete', { note: '待保存编辑' }));
  a.run(store => store.removeSolution('delete-then-edit'));
  b.run(store => {
    store.removeSolution('edit-then-delete');
    store.updateSolution('delete-then-edit', { note: '另一页修改' });
    store.saveSolution(solution('remote'));
  });
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  assert.deepEqual(read(SOLUTIONS_KEY), [solution('remote')]);
});

test('方案：本页显式保存同 id 在重试时优先，并保留另一页新增', async () => {
  const { a, b, read } = await harness('solutions', { [SOLUTIONS_KEY]: JSON.stringify([solution('shared')]) });
  a.writesBlocked = true;
  a.run(store => store.saveSolution(solution('shared', { prompt: '本页显式保存', note: '本页理由' })));
  b.run(store => {
    store.updateSolution('shared', { note: '另一页理由' });
    store.saveSolution(solution('remote'));
  });
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  const saved = read(SOLUTIONS_KEY);
  assert.deepEqual(saved.find(item => item.id === 'shared'), solution('shared', { prompt: '本页显式保存', note: '本页理由' }));
  assert.deepEqual(saved.find(item => item.id === 'remote'), solution('remote'));
});

test('方案：连续保存失败跨页合并后沿用原 id 与创建时间，成功后重试不重复写入', async () => {
  const { a, b, read } = await harness('solutions');
  a.writesBlocked = true;
  let attempt = a.run(store => store.saveSolutionDraft(draft, null));
  const original = { id: attempt.id, createdAt: attempt.createdAt };
  b.run(store => store.saveSolution(solution('remote')));
  for (let i = 0; i < 3; i++) {
    attempt = a.run(store => store.saveSolutionDraft(draft, attempt));
    assert.equal(attempt.persisted, false);
    assert.equal(attempt.id, original.id);
    assert.equal(attempt.createdAt, original.createdAt);
  }
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  assert.equal(read(SOLUTIONS_KEY).length, 2);
  assert.deepEqual(read(SOLUTIONS_KEY).find(item => item.id === original.id), { ...draft, ...original });
  const writes = a.writes;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  assert.equal(a.writes, writes);
});

test('方案：磁盘不可读但可写时不盲写，读恢复后合并未见过的磁盘条目', async () => {
  const { a, b, read } = await harness('solutions', { [SOLUTIONS_KEY]: JSON.stringify([solution('unknown')]) });
  a.readsBlocked = true;
  assert.equal(a.run(store => store.saveSolution(solution('local'))), false);
  b.run(store => store.saveSolution(solution('remote')));
  assert.equal(a.run(store => store.retrySolutionsStorage()), false);
  assert.equal(a.writes, 0);
  assert.deepEqual(a.run(store => store.getSolutionsSnapshot()).map(item => item.id), ['local']);
  a.readsBlocked = false;
  assert.equal(a.run(store => store.retrySolutionsStorage()), true);
  assert.deepEqual(new Set(read(SOLUTIONS_KEY).map(item => item.id)), new Set(['local', 'remote', 'unknown']));
});

test('收藏：失败新增重试保留另一页新增、未改动项及删除结果', async () => {
  const { a, b, read } = await harness('userdata', { 'ia-saved': '["deleted","untouched"]' });
  a.run(store => store.getSavedSnapshot());
  a.writesBlocked = true;
  a.run(store => store.toggleSaved('local'));
  b.run(store => { store.toggleSaved('remote'); store.removeSaved('deleted'); });
  assert.deepEqual(a.run(store => store.getSavedSnapshot()), ['local', 'remote', 'untouched']);
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  assert.deepEqual(read('ia-saved'), ['local', 'remote', 'untouched']);
});

test('收藏：失败移除优先于另一页再次新增同项，保留另一页其他新增', async () => {
  const { a, b, read } = await harness('userdata', { 'ia-saved': '["shared","untouched"]' });
  a.writesBlocked = true;
  a.run(store => store.removeSaved('shared'));
  b.run(store => { store.removeSaved('shared'); store.toggleSaved('shared'); store.toggleSaved('remote'); });
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  assert.deepEqual(read('ia-saved'), ['remote', 'untouched']);
});

test('收藏：待保存新增重放时同 id 去重，重复重试不改变磁盘', async () => {
  const { a, b, read } = await harness('userdata');
  a.writesBlocked = true;
  a.run(store => store.toggleSaved('shared'));
  b.run(store => { store.toggleSaved('shared'); store.toggleSaved('remote'); });
  assert.equal(a.run(store => store.retryUserdataStorage()), false);
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  assert.deepEqual(read('ia-saved'), ['shared', 'remote']);
  const writes = a.writes;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  assert.equal(a.writes, writes);
});

test('收藏与历史：磁盘不可读但可写时保留操作，读恢复后不擦除未知磁盘值', async () => {
  const { a, b, read } = await harness('userdata', { 'ia-saved': '["unknown"]', 'ia-history': '["unknown"]' });
  a.readsBlocked = true;
  a.run(store => { store.toggleSaved('local'); store.pushHistory('local'); });
  b.run(store => { store.toggleSaved('remote'); store.pushHistory('remote'); });
  assert.equal(a.run(store => store.retryUserdataStorage()), false);
  assert.equal(a.writes, 0);
  assert.deepEqual(read('ia-saved'), ['remote', 'unknown']);
  assert.deepEqual(read('ia-history'), ['remote', 'unknown']);
  a.readsBlocked = false;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  assert.deepEqual(read('ia-saved'), ['local', 'remote', 'unknown']);
  assert.deepEqual(read('ia-history'), ['local', 'remote', 'unknown']);
});

test('历史：失败访问重试保留另一页访问顺序，去重并限制最近 30 项', async () => {
  const old = Array.from({ length: 30 }, (_, index) => `old-${index}`);
  const { a, b, read } = await harness('userdata', { 'ia-history': JSON.stringify(old) });
  a.writesBlocked = true;
  a.run(store => { store.pushHistory('local'); store.pushHistory('old-3'); });
  b.run(store => { store.pushHistory('remote'); store.pushHistory('old-5'); });
  a.writesBlocked = false;
  assert.equal(a.run(store => store.retryUserdataStorage()), true);
  const saved = read('ia-history');
  assert.deepEqual(saved.slice(0, 4), ['old-3', 'local', 'old-5', 'remote']);
  assert.equal(saved.length, 30);
  assert.equal(new Set(saved).size, saved.length);
  assert.ok(saved.includes('old-0'));
});
