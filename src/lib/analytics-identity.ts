export interface AnalyticsVisitor { id: string; bornAt: number }

/** 正式增强只允许已明确配置的 Atlas EdgeOne；stats 独立 QA 必须显式标注。 */
export function analyticsUpgradeEnabled() {
  return window.location.origin === 'https://atlas.gongfpp.icu' && document.documentElement.dataset.analyticsUpgrade === 'true'
    || window.location.origin === 'https://stats.gongfpp.icu' && document.documentElement.dataset.analyticsQa === 'true'
      && window.location.pathname.startsWith('/_qa/analytics-20261027/');
}

declare global {
  interface Window {
    iaAnalyticsVisitor?: () => AnalyticsVisitor | undefined;
    iaAnalyticsResetVisitor?: () => void;
  }
}

/** 自包含函数也在 head 同步执行，确保自动首个 pageview 和自定义事件共用身份。 */
export function installAnalyticsIdentity() {
  const enabled = window.location.origin === 'https://atlas.gongfpp.icu' && document.documentElement.dataset.analyticsUpgrade === 'true'
    || window.location.origin === 'https://stats.gongfpp.icu' && document.documentElement.dataset.analyticsQa === 'true'
      && window.location.pathname.startsWith('/_qa/analytics-20261027/');
  if (!enabled) return;
  const key = 'ia:analytics:visitor:v1';
  const lifetime = 90 * 24 * 60 * 60 * 1000;
  const validId = (value: unknown) => typeof value === 'string'
    && /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/.test(value);
  function forget() {
    try { localStorage.removeItem(key); } catch { /* 存储不可用时不复用内存身份 */ }
  }
  function visitor(): AnalyticsVisitor | undefined {
    const privacyNavigator = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string | number };
    const privacyWindow = window as Window & { doNotTrack?: string | number };
    try {
      if (document.documentElement.dataset.analyticsPreview === 'true'
        || privacyNavigator.globalPrivacyControl === true
        || [navigator.doNotTrack, privacyWindow.doNotTrack, privacyNavigator.msDoNotTrack].some(value => value === '1' || value === 'yes' || value === 1)) {
        forget();
        return;
      }
    } catch { forget(); return; }
    try {
      if (localStorage.getItem('umami.disabled') === '1') { forget(); return; }
      const now = Date.now();
      let stored: AnalyticsVisitor | undefined;
      try { stored = JSON.parse(localStorage.getItem(key) || 'null'); } catch { /* 仅替换损坏的本站统计身份 */ }
      if (!stored || !validId(stored.id) || !Number.isSafeInteger(stored.bornAt)
        || stored.bornAt < 0 || now < stored.bornAt || now - stored.bornAt >= lifetime) {
        stored = { id: crypto.randomUUID(), bornAt: now };
        const text = JSON.stringify(stored);
        localStorage.setItem(key, text);
        if (localStorage.getItem(key) !== text) return;
      }
      return Object.freeze({ id: stored.id, bornAt: stored.bornAt });
    } catch { /* 读写不可用：不创建可上报的长期身份，不降级为指纹或内存身份 */ }
  }
  window.iaAnalyticsVisitor = visitor;
  window.iaAnalyticsResetVisitor = forget;
  visitor();
}

// Astro 在构建期取得已转译函数文本，作为同步 inline 脚本；不使用运行时 eval。
export const analyticsIdentityScript = `(${installAnalyticsIdentity.toString()})();`;

export function analyticsVisitor() {
  if (!analyticsUpgradeEnabled()) return;
  if (!window.umami && !document.querySelector('script[data-website-id]')) return;
  if (!window.iaAnalyticsVisitor) installAnalyticsIdentity();
  return window.iaAnalyticsVisitor?.();
}

export function resetAnalyticsVisitor() {
  if (window.iaAnalyticsResetVisitor) window.iaAnalyticsResetVisitor();
  else { try { localStorage.removeItem('ia:analytics:visitor:v1'); } catch { /* 无可用身份 */ } }
}
