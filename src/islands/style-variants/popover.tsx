import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('popover', 'flat-design', { zh: "纯色块与清晰圆角分区；打开关联说明并用 Esc 关闭。", en: "Solid blocks and clear rounded sections; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；打开关联说明并用 Esc 关闭。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'editorial', { zh: "衬线标题、期号书眉与发丝横线；打开关联说明并用 Esc 关闭。", en: "Serif headings, issue mastheads and hairline rules; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'minimalism', { zh: "直角细线与留白层级；打开关联说明并用 Esc 关闭。", en: "Square edges, thin rules and spacious hierarchy; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；打开关联说明并用 Esc 关闭。", en: "Indexed grids, two rule weights and strong type scale; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；打开关联说明并用 Esc 关闭。", en: "Heavy black outlines, hard shadows and solid press states; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；打开关联说明并用 Esc 关闭。", en: "Bright-edged frosted layers and blur over a dark colourful ground; open contextual information and dismiss with Escape." }),
  feedbackVariant('popover', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；打开关联说明并用 Esc 关闭。", en: "Monospace terminal type, neon edges and high-contrast state bars; open contextual information and dismiss with Escape." }),
];

export default styleVariants;
