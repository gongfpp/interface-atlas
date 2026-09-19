import { withBase } from '@/lib/i18n';

export type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: TrackProps) => void;
    };
  }
}

/** 是否启用查询/复制落库（CF Pages Functions + KV）。GH Pages 等无后端部署设 PUBLIC_LOG_API=off。 */
export const LOG_ENABLED = import.meta.env.PUBLIC_LOG_API !== 'off';

/**
 * 可选自定义事件埋点（PRD §27a）：配置了 Umami 时上报，未配置或失败时静默。
 * 约定：不要上报查询原文等可能含 PII 的字段；查询原文只走 /api/log-search（双端清洗 + TTL）。
 */
export function track(event: string, data?: TrackProps) {
  try {
    window.umami?.track(event, data);
  } catch {
    /* 埋点失败不影响功能 */
  }
}

/** 尽力上报到后端日志端点（未启用或失败时静默）；path 会自动带上部署 base。 */
export function beacon(path: string, data: TrackProps) {
  if (!LOG_ENABLED) return;
  try {
    navigator.sendBeacon?.(withBase(path), JSON.stringify({ ...data, t: Date.now() }));
  } catch {
    /* 埋点失败不影响功能 */
  }
}
