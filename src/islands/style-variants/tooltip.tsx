import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('tooltip', 'retro-futurism', { zh: "琥珀渐变按钮、等宽控制台与静态霓虹辉光；悬停、聚焦或点按显示，Esc 关闭。", en: "Amber gradient controls, monospace panels and static neon glow; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；悬停、聚焦或点按显示，Esc 关闭。", en: "Monospace terminal type, neon edges and high-contrast state bars; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'skeuomorphism', { zh: "奶油色斜面、内高光与实体按钮投影；悬停、聚焦或点按显示，Esc 关闭。", en: "Cream bevels, inset highlights and physical button shadows; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'minimalism', { zh: "直角细线与留白层级；悬停、聚焦或点按显示，Esc 关闭。", en: "Square edges, thin rules and spacious hierarchy; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'flat-design', { zh: "纯色块与清晰圆角分区；悬停、聚焦或点按显示，Esc 关闭。", en: "Solid blocks and clear rounded sections; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；悬停、聚焦或点按显示，Esc 关闭。", en: "Indexed grids, two rule weights and strong type scale; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；悬停、聚焦或点按显示，Esc 关闭。", en: "Heavy black outlines, hard shadows and solid press states; show on hover, focus or tap and dismiss with Escape." }),
  feedbackVariant('tooltip', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；悬停、聚焦或点按显示，Esc 关闭。", en: "Bright-edged frosted layers and blur over a dark colourful ground; show on hover, focus or tap and dismiss with Escape." }),
];

export default styleVariants;
