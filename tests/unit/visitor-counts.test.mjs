import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { visitorCounts, mountVisitorCounts } from '../../src/lib/visitor-counts.js';

const payload = (site = 'kurumi', extra = {}) => ({ version: 1, site, total: 12345, today: 23, online: 4,
  timezone: 'Asia/Taipei', day: '2026-10-28', asOf: '2026-10-28T01:30:00.000Z',
  onlineWindowSeconds: 300, coverage: 'observed', coverageStart: '2026-10-27T00:00:00.000Z', freshness: 'fresh', ...extra });
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function fixture({ site = 'kurumi', origin = 'https://fx.gongfpp.icu', visible = true, responder } = {}) {
  const document = new EventTarget(), window = new EventTarget(), calls = [], timers = new Map();
  let clock = 0, next = 0;
  const fields = Object.fromEntries(['total', 'today', 'online'].map(key => [key, {
    textContent: '—', attrs: {}, setAttribute(k, v) { this.attrs[k] = v; },
  }]));
  const root = { hidden: true, dataset: { visitorCounts: site }, attrs: {},
    querySelector: q => fields[q.match(/="(.*?)"/)[1]], setAttribute(k, v) { this.attrs[k] = v; } };
  Object.assign(document, { documentElement: { lang: 'zh-CN' }, visibilityState: visible ? 'visible' : 'hidden', querySelector: () => root });
  window.setTimeout = (fn, ms) => { const id = ++next; timers.set(id, { fn, at: clock + ms }); return id; };
  window.clearTimeout = id => timers.delete(id);
  const options = { document, window, location: { origin }, fetch: async (url, options) => {
    calls.push({ url, ...options }); return responder ? responder(url, options) : { ok: true, json: async () => payload(site) };
  } };
  const tick = async ms => { clock += ms; for (const [id, t] of [...timers]) if (t.at <= clock) { timers.delete(id); t.fn(); } await settle(); };
  const dispatch = (target, type, props = {}) => { const event = new Event(type); Object.assign(event, props); target.dispatchEvent(event); };
  return { root, fields, document, window, calls, timers, options, tick, dispatch, mount: () => mountVisitorCounts(options) };
}

test('公开契约：真0保留，null与无效数字不转成0，错误范围及过期结果不可冒充新数据', () => {
  assert.deepEqual(visitorCounts(payload('kurumi', { total: 0, today: null, online: Number.MAX_SAFE_INTEGER }), 'kurumi'), { total: 0, today: null, online: Number.MAX_SAFE_INTEGER });
  for (const invalid of [-1, 1.5, '8', undefined, Number.MAX_SAFE_INTEGER + 1, NaN, Infinity]) {
    assert.equal(visitorCounts(payload('kurumi', { today: invalid }), 'kurumi').today, null);
  }
  for (const extra of [{ version: 2 }, { site: 'atlas' }, { timezone: 'UTC' }, { onlineWindowSeconds: 60 }, { freshness: 'stale' }, { coverage: 'unavailable' }, { coverage: 'unknown' }, { asOf: 'bad' }]) {
    assert.equal(visitorCounts(payload('kurumi', extra), 'kurumi'), null);
  }
});

test('正式两站读取同源公开汇总：无凭据、无referer、无业务上报，格式化数字及0正确', async () => {
  for (const [site, origin] of [['kurumi', 'https://fx.gongfpp.icu'], ['atlas', 'https://atlas.gongfpp.icu']]) {
    const r = fixture({ site, origin, responder: async () => ({ ok: true, json: async () => payload(site, { today: 0 }) }) });
    const handle = r.mount(); assert(handle); assert.equal(r.root.hidden, false);
    assert.equal(r.root.attrs['aria-busy'], 'true'); assert.equal(r.fields.today.textContent, '—');
    await settle(); assert.equal(r.fields.total.textContent, '12,345'); assert.equal(r.fields.today.textContent, '0');
    assert.equal(r.root.dataset.state, 'ready'); assert.equal(r.root.attrs['aria-busy'], 'false');
    assert.match(r.fields.online.attrs['aria-label'], /近5分钟.*非实时连接数/);
    assert.equal(r.calls[0].url, `https://stats.gongfpp.icu/api/journey/v1/public-counts/${site}`);
    assert.equal(r.calls[0].method, 'GET'); assert.equal(r.calls[0].credentials, 'omit');
    assert.equal(r.calls[0].cache, 'no-store'); assert.equal(r.calls[0].referrerPolicy, 'no-referrer');
    assert.equal(r.calls[0].body, undefined); assert.equal(r.calls[0].headers, undefined);
    assert.equal(r.mount(), handle); assert.equal(r.calls.length, 1); assert.equal(r.timers.size, 1);
    handle.destroy(); assert.equal(r.timers.size, 0);
  }
});

test('旧站、非正式来源、端口及跨站选择全部不显示、不请求', async () => {
  for (const origin of ['https://gongfpp.github.io', 'https://kurumi-fx.pages.dev', 'https://interface-atlas-9po.pages.dev', 'http://fx.gongfpp.icu', 'https://fx.gongfpp.icu:444', 'https://fx.gongfpp.icu.evil.test', 'https://atlas.gongfpp.icu']) {
    const r = fixture({ origin }); assert.equal(r.mount(), null); await settle();
    assert.equal(r.root.hidden, true); assert.equal(r.calls.length, 0); assert.equal(r.timers.size, 0);
  }
});

test('失败、无效JSON及过期汇总显示—而非0；恢复后正常刷新', async () => {
  let response = { ok: false };
  const r = fixture({ responder: async () => response }); const handle = r.mount();
  await settle(); assert.equal(r.root.dataset.state, 'unavailable'); assert.equal(r.fields.total.textContent, '—');
  response = { ok: true, json: async () => { throw new Error('invalid json'); } }; await r.tick(60000);
  assert.equal(r.fields.online.textContent, '—'); assert.equal(r.root.dataset.state, 'unavailable');
  response = { ok: true, json: async () => payload('kurumi', { freshness: 'stale' }) }; await r.tick(60000);
  assert.equal(r.fields.online.textContent, '—'); assert.equal(r.root.dataset.state, 'unavailable');
  response = { ok: true, json: async () => payload('kurumi', { coverage: 'partial', total: null, today: null, online: 0 }) }; await r.tick(60000);
  assert.equal(r.fields.total.textContent, '—'); assert.equal(r.fields.online.textContent, '0');
  assert.match(r.fields.online.title, /已知下界/); assert.match(r.fields.online.attrs['aria-label'], /已知下界/);
  assert.equal(r.root.dataset.state, 'ready'); handle.destroy();
});

test('超时取消请求并显示—；下一轮可恢复，不叠加并发', async () => {
  let blocked = true;
  const r = fixture({ responder: async (_url, { signal }) => blocked ? new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))) : { ok: true, json: async () => payload() } });
  const handle = r.mount(); await settle(); assert.equal(r.calls.length, 1);
  await r.tick(8000); assert.equal(r.calls[0].signal.aborted, true); assert.equal(r.root.dataset.state, 'unavailable');
  assert.equal(r.fields.total.textContent, '—'); assert.equal(r.timers.size, 1);
  blocked = false; await r.tick(60000); assert.equal(r.calls.length, 2); assert.equal(r.root.dataset.state, 'ready'); handle.destroy();
});

test('隐藏不轮询；隐藏/离页取消中的请求且忽略晚返回；BFCache只恢复一个轮询owner', async () => {
  let finish;
  const r = fixture({ visible: false, responder: async () => new Promise(resolve => { finish = resolve; }) });
  const handle = r.mount(); await r.tick(120000); assert.equal(r.calls.length, 0);
  r.document.visibilityState = 'visible'; r.dispatch(r.document, 'visibilitychange'); await settle(); assert.equal(r.calls.length, 1);
  r.document.visibilityState = 'hidden'; r.dispatch(r.document, 'visibilitychange'); assert.equal(r.calls[0].signal.aborted, true);
  finish({ ok: true, json: async () => payload('kurumi', { online: 999 }) }); await settle(); assert.equal(r.fields.online.textContent, '—');
  await r.tick(120000); assert.equal(r.calls.length, 1); assert.equal(r.timers.size, 0);
  r.document.visibilityState = 'visible'; r.dispatch(r.document, 'visibilitychange'); await settle(); assert.equal(r.calls.length, 2);
  r.dispatch(r.window, 'pagehide'); assert.equal(r.calls[1].signal.aborted, true);
  finish({ ok: true, json: async () => payload('kurumi', { online: 999 }) }); await settle();
  r.dispatch(r.window, 'pageshow', { persisted: true }); await settle(); assert.equal(r.calls.length, 3);
  finish({ ok: true, json: async () => payload() }); await settle(); assert.equal(r.fields.online.textContent, '4'); assert.equal(r.timers.size, 1);
  assert.equal(r.mount(), handle); assert.equal(r.calls.length, 3);
  handle.destroy(); r.dispatch(r.document, 'visibilitychange'); r.dispatch(r.window, 'pageshow', { persisted: true });
  await r.tick(120000); assert.equal(r.calls.length, 3); assert.equal(r.timers.size, 0);
});

// 实际页面合同：已有导航及隐私说明保留，反馈只连到已核实的公开项目Issues。
test('页脚问题与建议使用公开源码Issues，不替换既有隐私与导航', () => {
  const source = readFileSync(new URL('../../src/components/Footer.astro', import.meta.url), 'utf8');
  assert.match(source, /href="https:\/\/github\.com\/gongfpp\/interface-atlas\/issues" target="_blank" rel="noopener noreferrer"/);
  assert.match(source, /问题与建议/); assert.match(source, /Issues &amp; suggestions|Issues & suggestions/);
  assert.match(source, /本站使用 Umami 匿名统计访问路径、停留、点击与复制\/粘贴操作/);
  for (const path of ['/explore', '/compare', '/saved', '/gallery', '/board']) assert(source.includes(`localePath('${path}', locale)`));
});
