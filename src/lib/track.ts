export type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: TrackProps) => void;
    };
  }
}

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
