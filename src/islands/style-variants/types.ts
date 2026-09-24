import type { ComponentType } from 'react';

/** 组件在某一具体风格下的手工变体（不是换皮，而是按该风格重新设计）。 */
export interface StyleVariant {
  /** 风格条目 id（src/content/styles/<id>），用于展示与追溯 */
  style: string;
  name: { zh: string; en: string };
  /** 一句话说明这种风格把这个组件改成了什么样 */
  note: { zh: string; en: string };
  /** 小 Demo 组件，可含本地交互状态 */
  Demo: ComponentType;
}

export type StyleVariantSet = StyleVariant[];
