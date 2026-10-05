import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('progress-bar', 'minimalism', { zh: "直角细线与留白层级；手动推进、退回与重置演示进度。", en: "Square edges, thin rules and spacious hierarchy; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'bauhaus', { zh: "红色几何圆、黑框网格与原色操作；手动推进、退回与重置演示进度。", en: "Red geometric circles, black grid outlines and primary-colour actions; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'pixel-art', { zh: "4px 方角边、阶梯硬投影与像素等宽字；手动推进、退回与重置演示进度。", en: "Square 4px borders, stepped hard shadows and pixel-like monospace type; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'flat-design', { zh: "纯色块与清晰圆角分区；手动推进、退回与重置演示进度。", en: "Solid blocks and clear rounded sections; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；手动推进、退回与重置演示进度。", en: "Indexed grids, two rule weights and strong type scale; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；手动推进、退回与重置演示进度。", en: "Heavy black outlines, hard shadows and solid press states; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；手动推进、退回与重置演示进度。", en: "Bright-edged frosted layers and blur over a dark colourful ground; advance, reverse and reset demo progress." }),
  feedbackVariant('progress-bar', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；手动推进、退回与重置演示进度。", en: "Monospace terminal type, neon edges and high-contrast state bars; advance, reverse and reset demo progress." }),
];

export default styleVariants;
