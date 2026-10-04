import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('toast', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；手动触发提示、撤销演示与关闭。", en: "Bright-edged frosted layers and blur over a dark colourful ground; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'pixel-art', { zh: "4px 方角边、阶梯硬投影与像素等宽字；手动触发提示、撤销演示与关闭。", en: "Square 4px borders, stepped hard shadows and pixel-like monospace type; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'claymorphism', { zh: "粉彩厚圆角、内凹高光与软糖底阴影；手动触发提示、撤销演示与关闭。", en: "Pastel inflated corners, inset highlights and thick soft base shadows; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'minimalism', { zh: "直角细线与留白层级；手动触发提示、撤销演示与关闭。", en: "Square edges, thin rules and spacious hierarchy; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'flat-design', { zh: "纯色块与清晰圆角分区；手动触发提示、撤销演示与关闭。", en: "Solid blocks and clear rounded sections; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；手动触发提示、撤销演示与关闭。", en: "Indexed grids, two rule weights and strong type scale; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；手动触发提示、撤销演示与关闭。", en: "Heavy black outlines, hard shadows and solid press states; trigger a toast, undo the demo action and dismiss." }),
  feedbackVariant('toast', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；手动触发提示、撤销演示与关闭。", en: "Monospace terminal type, neon edges and high-contrast state bars; trigger a toast, undo the demo action and dismiss." }),
];

export default styleVariants;
