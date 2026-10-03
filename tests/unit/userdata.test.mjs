import test from 'node:test';
import assert from 'node:assert/strict';

let sequence = 0;
async function harness(initial = {}) {
  const disk = new Map(Object.entries(initial));
  const blocked = new Set();
  const listeners = new Set();
  let unreadable = false;
  const localStorage = {
    getItem(key) { if (unreadable) throw new Error('blocked'); return disk.get(key) ?? null; },
    setItem(key, value) { if (blocked.has(key)) throw new Error('quota'); disk.set(key, value); },
  };
  globalThis.window = { localStorage, addEventListener(type, listener) { if (type === 'storage') listeners.add(listener); } };
  const data = await import(`../../src/lib/userdata.ts?case=${sequence++}`);
  return { data, disk, blocked, unreadable(value) { unreadable = value; }, event(key) { for (const fn of listeners) fn({ key }); } };
}
test.afterEach(() => { delete globalThis.window; });

test('收藏与浏览快照稳定，正常写入可恢复且历史去重并保留最近30项', async () => {
  const { data, disk } = await harness();
  assert.equal(data.toggleSaved('modal'), true);
  const saved = data.getSavedSnapshot();
  assert.deepEqual(saved, ['modal']); assert.equal(data.getSavedSnapshot(), saved);
  assert.deepEqual(JSON.parse(disk.get('ia-saved')), saved);
  for (let i = 0; i < 35; i++) data.pushHistory(String(i));
  data.pushHistory('32');
  assert.equal(data.getHistorySnapshot().length, 30); assert.equal(data.getHistorySnapshot()[0], '32');
  assert.equal(data.getHistorySnapshot().filter(id => id === '32').length, 1);
});

test('配额失败后可读的旧磁盘值不能覆盖本页收藏或删除', async () => {
  const { data, disk, blocked } = await harness({ 'ia-saved': '["modal"]' });
  blocked.add('ia-saved');
  assert.equal(data.toggleSaved('drawer'), true);
  assert.deepEqual(data.getSavedSnapshot(), ['drawer', 'modal']);
  data.removeSaved('modal');
  assert.deepEqual(data.getSavedSnapshot(), ['drawer']);
  assert.equal(disk.get('ia-saved'), '["modal"]');
  assert.equal(data.storageAvailable(), false);
});

test('另一个存储键写入成功不会掩盖尚未落盘的收藏，重试保存无需重新切换', async () => {
  const { data, disk, blocked } = await harness({ 'ia-saved': '["modal"]' });
  blocked.add('ia-saved'); data.toggleSaved('drawer'); data.pushHistory('drawer');
  assert.equal(data.storageAvailable(), false);
  assert.equal(data.retryUserdataStorage(), false);
  blocked.delete('ia-saved');
  assert.equal(data.retryUserdataStorage(), true);
  assert.deepEqual(JSON.parse(disk.get('ia-saved')), ['drawer', 'modal']);
  assert.equal(data.storageAvailable(), true);
});

test('历史写入失败仍可连续记录、去重并恢复', async () => {
  const { data, disk, blocked } = await harness({ 'ia-history': '["modal"]' });
  blocked.add('ia-history'); data.pushHistory('drawer'); data.pushHistory('modal');
  assert.deepEqual(data.getHistorySnapshot(), ['modal', 'drawer']);
  blocked.delete('ia-history'); assert.equal(data.retryUserdataStorage(), true);
  assert.deepEqual(JSON.parse(disk.get('ia-history')), ['modal', 'drawer']);
});

test('跨标签更新与清空同步正常快照，但不抹掉本页未保存的更改', async () => {
  const { data, disk, blocked, event } = await harness({ 'ia-saved': '["modal"]', 'ia-history': '["modal"]' });
  let updates = 0; const unsubscribe = data.subscribe(() => updates++);
  data.getSavedSnapshot(); data.getHistorySnapshot();
  disk.set('ia-saved', '["drawer"]'); event('ia-saved');
  assert.deepEqual(data.getSavedSnapshot(), ['drawer']);
  blocked.add('ia-saved'); data.toggleSaved('tabs');
  disk.clear(); event(null);
  assert.deepEqual(data.getSavedSnapshot(), ['tabs', 'drawer']);
  assert.deepEqual(data.getHistorySnapshot(), []); assert.equal(data.storageAvailable(), false);
  blocked.delete('ia-saved'); data.retryUserdataStorage();
  disk.clear(); event(null); assert.deepEqual(data.getSavedSnapshot(), []);
  const before = updates; unsubscribe(); event('ia-saved'); assert.equal(updates, before);
});

test('读取突然受限时保留最后成功快照，恢复后显示真实磁盘值', async () => {
  const { data, disk, unreadable } = await harness({ 'ia-saved': '["modal"]' });
  assert.deepEqual(data.getSavedSnapshot(), ['modal']);
  unreadable(true); assert.deepEqual(data.getSavedSnapshot(), ['modal']); assert.equal(data.storageAvailable(), false);
  unreadable(false); disk.set('ia-saved', '["drawer"]');
  assert.deepEqual(data.getSavedSnapshot(), ['drawer']); assert.equal(data.storageAvailable(), true);
});

test('受限 getter、损坏数据与服务端读取不阻止页面渲染', async () => {
  const { data } = await harness({ 'ia-saved': '{bad json', 'ia-history': '[1,"modal",null]' });
  assert.deepEqual(data.getSavedSnapshot(), []); assert.deepEqual(data.getHistorySnapshot(), ['modal']);
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('security'); } });
  assert.equal(data.toggleSaved('drawer'), true); assert.deepEqual(data.getSavedSnapshot(), ['drawer']);
  assert.equal(data.storageAvailable(), false);
  delete globalThis.window;
  assert.deepEqual(data.getSavedSnapshot(), []); assert.equal(data.getServerStorageSnapshot(), true);
});
