import type { ComponentType } from 'react';

/** 站点内已有的风格 id（与 src/content/styles 一一对应；类型化以防拼错/写不存在的风格）。 */
export type StyleId =
  | 'minimalism'
  | 'neobrutalism'
  | 'brutalism'
  | 'swiss-style'
  | 'bauhaus'
  | 'memphis'
  | 'corporate-memphis'
  | 'art-deco'
  | 'editorial'
  | 'y2k'
  | 'cyberpunk'
  | 'retro-futurism'
  | 'pixel-art'
  | 'vaporwave'
  | 'glassmorphism'
  | 'liquid-glass'
  | 'neumorphism'
  | 'skeuomorphism'
  | 'claymorphism'
  | 'flat-design'
  | 'aurora'
  | 'organic'
  | 'hand-drawn'
  | 'bento-grid';

/**
 * 实验室会话：跨风格共享的业务状态。
 * 键由组件自行约定（如 'value'、'open'、'active'），只存业务状态，不存纯装饰动画进度。
 */
export interface LabSession {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
}

/** 每个风格变体 Demo 都会收到 locale 与共享 session；忽略它们是允许的。 */
export interface VariantDemoProps {
  locale: 'zh' | 'en';
  session: LabSession;
}

export interface StyleVariant {
  /** 风格条目 id（src/content/styles/<id>），用于展示与追溯 */
  style: StyleId;
  name: { zh: string; en: string };
  /** 一句话说明这种风格把这个组件改成了什么样 */
  note: { zh: string; en: string };
  /** 小 Demo 组件；可读取 session 以在切换风格时保留状态 */
  Demo: ComponentType<VariantDemoProps>;
}

export type StyleVariantSet = StyleVariant[];
