import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('command-palette', 'aurora', { zh: "深色底上叠蓝紫柔焦渐变与亮边圆角面；检索、方向键选命令、执行反馈与重置。", en: "Soft blue-purple light gradients and bright-edged rounded surfaces over a dark ground; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；检索、方向键选命令、执行反馈与重置。", en: "Bright-edged frosted layers and blur over a dark colourful ground; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'flat-design', { zh: "纯色块与清晰圆角分区；检索、方向键选命令、执行反馈与重置。", en: "Solid blocks and clear rounded sections; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'minimalism', { zh: "直角细线与留白层级；检索、方向键选命令、执行反馈与重置。", en: "Square edges, thin rules and spacious hierarchy; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；检索、方向键选命令、执行反馈与重置。", en: "Indexed grids, two rule weights and strong type scale; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；检索、方向键选命令、执行反馈与重置。", en: "Heavy black outlines, hard shadows and solid press states; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；检索、方向键选命令、执行反馈与重置。", en: "Monospace terminal type, neon edges and high-contrast state bars; search commands, choose with arrows, show local results and reset." }),
  feedbackVariant('command-palette', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；检索、方向键选命令、执行反馈与重置。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; search commands, choose with arrows, show local results and reset." }),
];

export default styleVariants;
