import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('fab', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；展开浮动操作并撤销本地选择。", en: "Heavy black outlines, hard shadows and solid press states; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'liquid-glass', { zh: "高光亮边、透明胶囊与内高光折射感；展开浮动操作并撤销本地选择。", en: "Specular rims, translucent capsules and inset refractive highlights; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'claymorphism', { zh: "粉彩厚圆角、内凹高光与软糖底阴影；展开浮动操作并撤销本地选择。", en: "Pastel inflated corners, inset highlights and thick soft base shadows; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'minimalism', { zh: "直角细线与留白层级；展开浮动操作并撤销本地选择。", en: "Square edges, thin rules and spacious hierarchy; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'flat-design', { zh: "纯色块与清晰圆角分区；展开浮动操作并撤销本地选择。", en: "Solid blocks and clear rounded sections; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；展开浮动操作并撤销本地选择。", en: "Indexed grids, two rule weights and strong type scale; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；展开浮动操作并撤销本地选择。", en: "Bright-edged frosted layers and blur over a dark colourful ground; expand floating actions and undo a local selection." }),
  feedbackVariant('fab', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；展开浮动操作并撤销本地选择。", en: "Monospace terminal type, neon edges and high-contrast state bars; expand floating actions and undo a local selection." }),
];

export default styleVariants;
