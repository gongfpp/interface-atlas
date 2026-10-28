const ENDPOINT = 'https://stats.gongfpp.icu/api/journey/v1/public-counts/';
const SITES = Object.freeze({ kurumi: 'https://fx.gongfpp.icu', atlas: 'https://atlas.gongfpp.icu' });
const mounted = new WeakMap();

/** 只展示已采集的匿名汇总；不读取身份、存储、tracker或任何游戏数据。 */
export function visitorCounts(payload, site) {
  if (payload?.version !== 1 || payload.site !== site || payload.timezone !== 'Asia/Taipei'
    || payload.onlineWindowSeconds !== 300 || payload.freshness !== 'fresh'
    || !['observed', 'partial'].includes(payload.coverage)
    || !Number.isFinite(Date.parse(payload.asOf))) return null;
  return Object.fromEntries(['total', 'today', 'online'].map(key => [key,
    Number.isSafeInteger(payload[key]) && payload[key] >= 0 ? payload[key] : null,
  ]));
}

/** 唯一轮询owner：只在两个正式origin读取；隐藏、离页和销毁时取消请求与定时器。 */
export function mountVisitorCounts({ document = globalThis.document, window = globalThis.window,
  location = globalThis.location, fetch: fetcher = globalThis.fetch?.bind(globalThis) } = {}) {
  const root = document?.querySelector('[data-visitor-counts]');
  const site = root?.dataset.visitorCounts;
  if (!root || !SITES[site] || location?.origin !== SITES[site] || !fetcher) return null;
  if (mounted.has(root)) return mounted.get(root);
  root.hidden = false;
  const english = document.documentElement.lang.startsWith('en');
  const format = new Intl.NumberFormat(english ? 'en-US' : 'zh-CN');
  const text = english ? {
    loading: 'Loading visitor counts', unavailable: 'Visitor counts unavailable',
    partial: 'Only recorded valid anonymous IDs are included; counts are a known lower bound',
    total: 'Anonymous visitors since collection began', today: 'Anonymous visitors today (UTC+8)',
    online: 'Anonymous visitors with activity in the last 5 minutes; not a live connection count',
  } : {
    loading: '访问统计加载中', unavailable: '访问统计暂不可用',
    partial: '仅计入已记录的有效匿名编号，为已知下界',
    total: '开始采集以来的同站匿名访客数', today: '今日同站匿名访客数（UTC+8 日界线）',
    online: '近5分钟有访问或活动迹象的匿名访客数，非实时连接数',
  };
  const fields = ['total', 'today', 'online'].map(key => [key, root.querySelector(`[data-visitor-count="${key}"]`)]);
  let lifecycle = 'active', timer = null, request = null;
  function render(counts, state, coverage) {
    root.dataset.state = state;
    root.setAttribute('aria-busy', String(state === 'loading'));
    for (const [key, node] of fields) {
      if (!node) continue;
      const value = counts?.[key];
      node.textContent = value === null || value === undefined ? '—' : format.format(value);
      const status = value === null || value === undefined ? text[state === 'loading' ? 'loading' : 'unavailable'] : node.textContent;
      const description = text[key] + (coverage === 'partial' && value !== null && value !== undefined ? `; ${text.partial}` : '');
      node.setAttribute('aria-label', `${description}: ${status}`);
      node.title = description;
    }
  }
  function pause() {
    window.clearTimeout(timer); timer = null;
    if (request) { window.clearTimeout(request.timeout); request.controller.abort(); request = null; }
  }
  async function refresh() {
    if (lifecycle !== 'active' || document.visibilityState !== 'visible' || request) return;
    render(null, 'loading');
    const current = { controller: new globalThis.AbortController(), timeout: null };
    request = current;
    current.timeout = window.setTimeout(() => current.controller.abort(), 8000);
    try {
      const response = await fetcher(`${ENDPOINT}${site}`, {
        method: 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
        signal: current.controller.signal,
      });
      if (!response.ok) throw new Error('public-counts-http');
      const payload = await response.json();
      const counts = visitorCounts(payload, site);
      if (request !== current || current.controller.signal.aborted) return;
      render(counts, counts ? 'ready' : 'unavailable', payload.coverage);
    } catch {
      if (request === current) render(null, 'unavailable');
    } finally {
      window.clearTimeout(current.timeout);
      if (request === current) {
        request = null;
        if (lifecycle === 'active' && document.visibilityState === 'visible') timer = window.setTimeout(refresh, 60000);
      }
    }
  }
  const visibility = () => { pause(); if (document.visibilityState === 'visible') refresh(); };
  const leave = () => { lifecycle = 'suspended'; pause(); };
  const restore = event => { if (event.persisted) { lifecycle = 'active'; refresh(); } };
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', leave);
  window.addEventListener('pageshow', restore);
  const handle = { destroy() {
    lifecycle = 'destroyed'; pause();
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('pagehide', leave);
    window.removeEventListener('pageshow', restore);
    mounted.delete(root);
  } };
  mounted.set(root, handle);
  refresh();
  return handle;
}

if (globalThis.document) mountVisitorCounts();
