import { stripBase, withBase } from '@/lib/i18n';

export type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: TrackProps) => void | Promise<unknown>;
    };
  }
}

/** 是否启用查询/复制落库（CF Pages Functions + KV）。GH Pages 等无后端部署设 PUBLIC_LOG_API=off。 */
export const LOG_ENABLED = import.meta.env.PUBLIC_LOG_API !== 'off';

const pending: Array<{ event: string; data: TrackProps }> = [];
let retry: ReturnType<typeof setTimeout> | undefined;
let attempts = 0;

const SESSION_KEY = 'ia:analytics:session:v2';
const SESSION_IDLE = 30 * 60 * 1000;
interface JourneySession {
  id: string;
  started: number;
  last: number;
  pages: number;
  events: number;
  entry: string;
  source: string;
}
let session: JourneySession | undefined;
let pageStep = 0;
let visitId = '';
let visitSequence = 0;

function readSession(): JourneySession | undefined {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (value && /^[\da-f-]{36}$/.test(value.id)
      && ['started', 'last', 'pages', 'events'].every(key => Number.isFinite(value[key]))
      && typeof value.entry === 'string' && typeof value.source === 'string') return value;
  } catch { /* 存储受限时本页仍可统计 */ }
}

function saveSession() {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* 回退到内存 */ }
}

/** 匿名会话跨页面保留；无操作 30 分钟后轮换，不记录跨会话身份。 */
function ensureSession() {
  const now = Date.now();
  const stored = readSession();
  if (!session && stored && now - stored.last < SESSION_IDLE && now >= stored.last) session = stored;
  if (!session) {
    let source = 'direct';
    try { source = new URL(document.referrer).hostname; } catch { /* 直接访问 */ }
    session = { id: crypto.randomUUID(), started: now, last: now, pages: 0, events: 0, entry: analyticsPath(), source };
    pageStep = 0;
    visitId = '';
  } else if (stored?.id === session.id) {
    session.pages = Math.max(session.pages, stored.pages);
    session.events = Math.max(session.events, stored.events);
  }
  if (!visitId) {
    visitId = crypto.randomUUID();
    pageStep = ++session.pages;
    visitSequence = 0;
  }
  session.last = now;
  saveSession();
  return session;
}

/** BFCache 恢复算一次新的页面访问，会话仍连续。 */
export function beginAnalyticsVisit(reset = false) {
  if (reset) visitId = '';
  return analyticsContext(false).visit_id as string;
}

export function analyticsContext(advance = true): TrackProps {
  const current = ensureSession();
  if (advance) current.events += 1;
  saveSession();
  return {
    session_id: current.id,
    visit_id: visitId,
    page_step: pageStep,
    sequence: advance ? ++visitSequence : visitSequence,
    session_sequence: current.events,
    event_time: Date.now(),
    session_started: current.started,
    entry_page: current.entry,
    entry_source: current.source,
    embedded: window.self !== window.top,
  };
}

/** 统一路由维度，去掉部署前缀、查询参数及 hash。 */
export function analyticsPath(pathname = window.location.pathname) {
  return stripBase(pathname).replace(/\/+$/, '') || '/';
}

export function analyticsAllowed() {
  return document.documentElement.dataset.analyticsPreview !== 'true'
    && navigator.doNotTrack !== '1'
    && localStorageOptOut() !== '1';
}

function localStorageOptOut() {
  try { return localStorage.getItem('umami.disabled'); } catch { return null; }
}

function send(event: string, data: TrackProps) {
  try {
    const result = window.umami?.track(event, data);
    if (result instanceof Promise) void result.catch(() => {});
  } catch { /* 统计服务不可用时不影响交互 */ }
}

/** 脚本晚加载时保留最早的访问与操作；队列和等待都有上限。 */
export function flushTracking() {
  if (!window.umami || !analyticsAllowed()) return;
  if (retry) clearTimeout(retry);
  retry = undefined;
  while (pending.length) {
    const item = pending.shift()!;
    send(item.event, item.data);
  }
}

/**
 * 可选自定义事件埋点（PRD §27a）：配置了 Umami 时上报，未配置或失败时静默。
 * 约定：不要上报查询原文等可能含 PII 的字段；查询原文只走 /api/log-search（双端清洗 + TTL）。
 */
export function track(event: string, data?: TrackProps) {
  if (typeof window === 'undefined' || !analyticsAllowed()) return;
  const page = analyticsPath();
  const payload = {
    ...data,
    ...analyticsContext(),
    page,
    locale: document.documentElement.lang.startsWith('en') ? 'en' : 'zh',
    page_type: page.replace(/^\/en(?=\/|$)/, '').split('/')[1] || 'home',
    schema: 2,
  };
  if (window.umami) {
    flushTracking();
    send(event, payload);
  } else if (document.querySelector('script[data-website-id]') && attempts < 120) {
    if (pending.length < 100) pending.push({ event, data: payload });
    if (!retry) {
      const poll = () => {
        retry = undefined;
        attempts += 1;
        if (window.umami) flushTracking();
        else if (attempts < 120) retry = setTimeout(poll, 250);
        else pending.length = 0;
      };
      retry = setTimeout(poll, 250);
    }
  }
}

/** 搜索的鼠标和键盘路径共用，不记录查询原文。 */
export function trackSearchResult(type: string, id: string, rank: number, source: string) {
  const destination = `${document.documentElement.lang.startsWith('en') ? '/en' : ''}/${type}/${id}`;
  track('search-result', { destination, rank, source });
  trackNavigation(destination, source);
}

/** 程序触发的跳转（普通链接由全局监听器覆盖）。 */
export function trackNavigation(destination: string, source: string) {
  track('page-navigation', { destination, source, kind: 'internal', new_tab: false });
  if (['/', '/en'].includes(analyticsPath())) {
    track('home-navigation', { destination, source, kind: 'internal', new_tab: false });
  }
}

/** 尽力上报到后端日志端点（未启用或失败时静默）；path 会自动带上部署 base。 */
export function beacon(path: string, data: TrackProps) {
  if (!LOG_ENABLED || !analyticsAllowed()) return;
  try {
    navigator.sendBeacon?.(withBase(path), JSON.stringify({ ...data, t: Date.now() }));
  } catch {
    /* 埋点失败不影响功能 */
  }
}
