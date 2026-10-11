import { analyticsAllowed, analyticsPath, beginAnalyticsVisit, flushTracking, track, type TrackProps } from '@/lib/track';

const ACTIVE_WINDOW = 30_000;
const HEARTBEAT = 30_000;

/** 用结构定位操作位置，不读取用户输入、参考册内容或页面正文。 */
function elementPath(element: Element) {
  const parts: string[] = [];
  let node: Element | null = element;
  while (node && parts.length < 5 && node !== document.body) {
    const index = node.parentElement
      ? Array.from(node.parentElement.children).filter(child => child.tagName === node!.tagName).indexOf(node) + 1
      : 1;
    parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${index})`);
    node = node.parentElement;
  }
  return parts.join('>');
}

function region(element: Element) {
  const marked = element.closest('[data-track-region]');
  if (marked) return marked.getAttribute('data-track-region') || 'main';
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  if (element.closest('[role="dialog"]')) return 'dialog';
  if (element.closest('.demo-workbench, .demo-content, [data-style-interactive]')) return 'demo';
  const section = element.closest('section');
  if (section) return section.id || elementPath(section);
  return element.closest('main') ? 'main' : 'body';
}

function targetProps(element: Element): TrackProps {
  return {
    region: region(element),
    target: elementPath(element),
    control: element.getAttribute('role') || element.tagName.toLowerCase(),
    // 只允许开发者明确标注的名称；不自动读取 textContent / aria-label。
    label: element.getAttribute('data-track-label') || '',
  };
}

export function startAnalytics() {
  if (!analyticsAllowed() || (!window.umami && !document.querySelector('script[data-website-id]'))) return;
  let started = performance.now();
  let lastTick = started;
  let lastActivity = started;
  let visibleMs = 0;
  let activeMs = 0;
  let sentVisible = 0;
  let sentActive = 0;
  let visible = document.visibilityState === 'visible';
  let ended = false;
  beginAnalyticsVisit();
  let clicks = 0;
  let maxScroll = 0;
  const milestones = new Set<number>();
  let fields = new WeakSet<Element>();
  let timer: ReturnType<typeof setInterval> | undefined;
  const viewed = new Set<Element>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!visible || ended || !entry.isIntersecting || viewed.has(entry.target)) continue;
      viewed.add(entry.target);
      emit('section-view', { region: region(entry.target), target: elementPath(entry.target) });
    }
  }, { threshold: 0, rootMargin: '-15% 0px -15% 0px' });

  function tick() {
    const now = performance.now();
    if (visible) {
      visibleMs += now - lastTick;
      activeMs += Math.max(0, Math.min(now, lastActivity + ACTIVE_WINDOW) - lastTick);
    }
    lastTick = now;
  }

  function emit(event: string, data: TrackProps = {}) {
    if (!ended) track(event, data);
  }

  function summary(): TrackProps {
    tick();
    return {
      elapsed_ms: Math.round(performance.now() - started),
      visible_ms: Math.round(visibleMs),
      active_ms: Math.round(activeMs),
      max_scroll: maxScroll,
      clicks,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };
  }

  function activity() {
    if (ended || !visible) return;
    tick();
    lastActivity = performance.now();
  }

  function scrollDepth() {
    if (ended || !visible) return;
    // 百分比表示正文底部被阅读到的位置；首次绘制仅记录，不假装发生过滚动。
    const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    maxScroll = Math.max(maxScroll, Math.min(100, Math.round((window.scrollY + window.innerHeight) / height * 100)));
  }

  function onScroll() {
    activity();
    scrollDepth();
    for (const depth of [25, 50, 75, 100]) {
      if (maxScroll >= depth && !milestones.has(depth)) {
        milestones.add(depth);
        emit('scroll-depth', { depth });
      }
    }
  }

  function heartbeat() {
    if (ended || !visible) return;
    const data = summary();
    emit('page-engagement', {
      ...data,
      visible_delta_ms: Math.round(visibleMs - sentVisible),
      active_delta_ms: Math.round(activeMs - sentActive),
    });
    sentVisible = visibleMs;
    sentActive = activeMs;
  }

  function onVisibility() {
    if (ended) return;
    const data = summary(); // 先按切换前的可见状态结算。
    visible = document.visibilityState === 'visible';
    if (visible) {
      lastActivity = performance.now();
      emit('page-resume');
    } else {
      emit('page-hidden', data);
      flushTracking();
    }
  }

  function onLeave(event: PageTransitionEvent) {
    if (ended) return;
    scrollDepth();
    emit('page-leave', { ...summary(), persisted: event.persisted });
    ended = true;
    if (timer) clearInterval(timer);
    flushTracking();
  }

  function arrival(restored = false) {
    let from = '';
    let referrerHost = '';
    try {
      const referrer = new URL(document.referrer);
      referrerHost = referrer.hostname;
      if (referrer.origin === location.origin) from = analyticsPath(referrer.pathname);
    } catch { /* 无 referrer 的直接访问 */ }
    emit('page-arrival', { from, referrer_host: referrerHost, restored, viewport_width: innerWidth, viewport_height: innerHeight });
    scrollDepth();
    timer = setInterval(heartbeat, HEARTBEAT);
  }

  function onRestore(event: PageTransitionEvent) {
    if (!event.persisted || !ended) return;
    started = lastTick = lastActivity = performance.now();
    visibleMs = activeMs = sentVisible = sentActive = clicks = maxScroll = 0;
    visible = document.visibilityState === 'visible';
    beginAnalyticsVisit(true);
    milestones.clear();
    fields = new WeakSet<Element>();
    viewed.clear();
    ended = false;
    arrival(true);
  }

  function onClick(event: MouseEvent) {
    if (ended || !(event.target instanceof Element)) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const raw = event.target;
    if (raw.closest('[data-track-ignore], [contenteditable="true"]')) return;
    activity();
    clicks += 1;
    const element = raw.closest('a, button, summary, input, select, textarea, [role="button"], [role="tab"], [role="option"]') || raw;
    const props = targetProps(element);
    const selected = element.getAttribute('aria-pressed') ?? element.getAttribute('aria-expanded') ?? element.getAttribute('aria-selected');
    emit('ui-click', {
      ...props,
      state_before: selected || '',
      pointer: event.detail === 0 ? 'keyboard' : 'pointer',
      x_pct: event.detail === 0 ? -1 : Math.round(event.clientX / Math.max(innerWidth, 1) * 100),
      y_pct: event.detail === 0 ? -1 : Math.round((event.clientY + scrollY) / Math.max(document.documentElement.scrollHeight, 1) * 100),
    });
    const link = element.closest('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.getAttribute('href')!, location.href);
      if (!['http:', 'https:'].includes(url.protocol)) return;
      const internal = url.origin === location.origin;
      const anchor = internal && url.pathname === location.pathname && (!!url.hash || link.getAttribute('href') === '#');
      const destination = internal ? analyticsPath(url.pathname) : url.hostname;
      const newTab = link.getAttribute('target') === '_blank' || event.ctrlKey || event.metaKey || event.button === 1;
      const data = { ...props, destination, kind: anchor ? 'anchor' : internal ? 'internal' : 'external', new_tab: newTab };
      emit('page-navigation', data);
      if (['/', '/en'].includes(analyticsPath()) && internal && !anchor) emit('home-navigation', data);
    } catch { /* 忽略无效链接 */ }
  }

  function onField(event: Event) {
    if (!(event.target instanceof Element) || event.target.closest('[data-track-ignore]')) return;
    const element = event.target;
    if (!element.matches('input, textarea, select') || fields.has(element)) return;
    fields.add(element);
    activity();
    emit('field-interaction', { ...targetProps(element), input_type: element.getAttribute('type') || element.tagName.toLowerCase() });
  }

  function onSubmit(event: Event) {
    if (!(event.target instanceof Element) || event.target.closest('[data-track-ignore]')) return;
    emit('form-submit', targetProps(event.target));
  }

  function onClipboard(event: ClipboardEvent) {
    const anchor = event.type === 'paste' ? null : window.getSelection()?.anchorNode;
    const selected = anchor instanceof Element ? anchor : anchor?.parentElement;
    const element = selected || (event.target instanceof Element ? event.target : document.activeElement) || document.body;
    if (element.closest('[data-track-ignore]')) return;
    activity();
    // 仅借助选区所在 DOM 定位，不读取选中文字、clipboardData 或输入值。
    emit(`clipboard-${event.type}`, targetProps(element));
  }

  function onChange(event: Event) {
    onField(event);
    if (!(event.target instanceof Element) || event.target.closest('[data-track-ignore]')) return;
    emit('control-change', targetProps(event.target));
  }

  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', onClick, true);
  document.addEventListener('input', onField, true);
  document.addEventListener('change', onChange, true);
  document.addEventListener('copy', onClipboard, true);
  document.addEventListener('cut', onClipboard, true);
  document.addEventListener('paste', onClipboard, true);
  document.addEventListener('submit', onSubmit, true);
  document.addEventListener('keydown', activity, { passive: true });
  document.addEventListener('pointerdown', activity, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pagehide', onLeave);
  window.addEventListener('pageshow', onRestore);
  window.addEventListener('ia:analytics-ready', flushTracking);
  arrival();
  document.querySelectorAll('main section, main [data-track-region]').forEach(section => observer.observe(section));

  // 由页面生命周期拥有监听器；BFCache 恢复时复用，调用方销毁时明确释放。
  return () => {
    if (timer) clearInterval(timer);
    observer.disconnect();
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('auxclick', onClick, true);
    document.removeEventListener('input', onField, true);
    document.removeEventListener('change', onChange, true);
    document.removeEventListener('copy', onClipboard, true);
    document.removeEventListener('cut', onClipboard, true);
    document.removeEventListener('paste', onClipboard, true);
    document.removeEventListener('submit', onSubmit, true);
    document.removeEventListener('keydown', activity);
    document.removeEventListener('pointerdown', activity);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pagehide', onLeave);
    window.removeEventListener('pageshow', onRestore);
    window.removeEventListener('ia:analytics-ready', flushTracking);
  };
}
