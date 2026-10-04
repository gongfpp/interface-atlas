import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('alert', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；重试、隐藏和重置状态通知。", en: "Indexed grids, two rule weights and strong type scale; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'brutalism', { zh: "粗等宽大字、黑底酸黄与未经修饰的硬边；重试、隐藏和重置状态通知。", en: "Oversized monospace type, acid yellow on black and raw hard edges; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'corporate-memphis', { zh: "几何圆形标记、友好圆角分区与胶囊操作；重试、隐藏和重置状态通知。", en: "Geometric circular markers, friendly rounded sections and pill actions; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'minimalism', { zh: "直角细线与留白层级；重试、隐藏和重置状态通知。", en: "Square edges, thin rules and spacious hierarchy; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'flat-design', { zh: "纯色块与清晰圆角分区；重试、隐藏和重置状态通知。", en: "Solid blocks and clear rounded sections; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；重试、隐藏和重置状态通知。", en: "Heavy black outlines, hard shadows and solid press states; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；重试、隐藏和重置状态通知。", en: "Bright-edged frosted layers and blur over a dark colourful ground; retry, hide and reset the status notice." }),
  feedbackVariant('alert', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；重试、隐藏和重置状态通知。", en: "Monospace terminal type, neon edges and high-contrast state bars; retry, hide and reset the status notice." }),
];

export default styleVariants;
