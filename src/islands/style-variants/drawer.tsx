import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('drawer', 'minimalism', { zh: "直角细线与留白层级；侧边抽屉中确认、取消并归还焦点。", en: "Square edges, thin rules and spacious hierarchy; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；侧边抽屉中确认、取消并归还焦点。", en: "Heavy black outlines, hard shadows and solid press states; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'art-deco', { zh: "对称金色双线、菱形徽记与衬线大写；侧边抽屉中确认、取消并归还焦点。", en: "Symmetric gold double rules, a diamond marker and uppercase serif type; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'flat-design', { zh: "纯色块与清晰圆角分区；侧边抽屉中确认、取消并归还焦点。", en: "Solid blocks and clear rounded sections; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；侧边抽屉中确认、取消并归还焦点。", en: "Indexed grids, two rule weights and strong type scale; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；侧边抽屉中确认、取消并归还焦点。", en: "Bright-edged frosted layers and blur over a dark colourful ground; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；侧边抽屉中确认、取消并归还焦点。", en: "Monospace terminal type, neon edges and high-contrast state bars; confirm or cancel in a side drawer and return focus." }),
  feedbackVariant('drawer', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；侧边抽屉中确认、取消并归还焦点。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; confirm or cancel in a side drawer and return focus." }),
];

export default styleVariants;
