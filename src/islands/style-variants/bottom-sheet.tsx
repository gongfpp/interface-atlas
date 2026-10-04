import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('bottom-sheet', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；底部面板中确认与取消演示选项。", en: "Bright-edged frosted layers and blur over a dark colourful ground; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；底部面板中确认与取消演示选项。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；底部面板中确认与取消演示选项。", en: "Indexed grids, two rule weights and strong type scale; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'minimalism', { zh: "直角细线与留白层级；底部面板中确认与取消演示选项。", en: "Square edges, thin rules and spacious hierarchy; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'flat-design', { zh: "纯色块与清晰圆角分区；底部面板中确认与取消演示选项。", en: "Solid blocks and clear rounded sections; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；底部面板中确认与取消演示选项。", en: "Heavy black outlines, hard shadows and solid press states; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；底部面板中确认与取消演示选项。", en: "Monospace terminal type, neon edges and high-contrast state bars; confirm and cancel a choice in the bottom sheet." }),
  feedbackVariant('bottom-sheet', 'hand-drawn', { zh: "不对称圆角、虚线与手写感衬线；底部面板中确认与取消演示选项。", en: "Uneven corners, dashed strokes and handwritten serif rhythm; confirm and cancel a choice in the bottom sheet." }),
];

export default styleVariants;
