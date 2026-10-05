import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('modal', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；确认本地选项或取消并保持原值。", en: "Bright-edged frosted layers and blur over a dark colourful ground; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'claymorphism', { zh: "粉彩厚圆角、内凹高光与软糖底阴影；确认本地选项或取消并保持原值。", en: "Pastel inflated corners, inset highlights and thick soft base shadows; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'y2k', { zh: "铬色垂直渐变、白色泡状高光与胶囊字形；确认本地选项或取消并保持原值。", en: "Chrome vertical gradients, white bubble highlights and capsule typography; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'minimalism', { zh: "直角细线与留白层级；确认本地选项或取消并保持原值。", en: "Square edges, thin rules and spacious hierarchy; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'flat-design', { zh: "纯色块与清晰圆角分区；确认本地选项或取消并保持原值。", en: "Solid blocks and clear rounded sections; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；确认本地选项或取消并保持原值。", en: "Indexed grids, two rule weights and strong type scale; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；确认本地选项或取消并保持原值。", en: "Heavy black outlines, hard shadows and solid press states; confirm a local choice or cancel while preserving its value." }),
  feedbackVariant('modal', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；确认本地选项或取消并保持原值。", en: "Monospace terminal type, neon edges and high-contrast state bars; confirm a local choice or cancel while preserving its value." }),
];

export default styleVariants;
