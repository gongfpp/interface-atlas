import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('split-button', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；主动作与展开动作共用可撤销反馈。", en: "Indexed grids, two rule weights and strong type scale; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'flat-design', { zh: "纯色块与清晰圆角分区；主动作与展开动作共用可撤销反馈。", en: "Solid blocks and clear rounded sections; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'claymorphism', { zh: "粉彩厚圆角、内凹高光与软糖底阴影；主动作与展开动作共用可撤销反馈。", en: "Pastel inflated corners, inset highlights and thick soft base shadows; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'minimalism', { zh: "直角细线与留白层级；主动作与展开动作共用可撤销反馈。", en: "Square edges, thin rules and spacious hierarchy; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；主动作与展开动作共用可撤销反馈。", en: "Heavy black outlines, hard shadows and solid press states; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；主动作与展开动作共用可撤销反馈。", en: "Bright-edged frosted layers and blur over a dark colourful ground; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'cyberpunk', { zh: "终端等宽字、霓虹边与高对比状态条；主动作与展开动作共用可撤销反馈。", en: "Monospace terminal type, neon edges and high-contrast state bars; share reversible feedback between primary and expanded actions." }),
  feedbackVariant('split-button', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；主动作与展开动作共用可撤销反馈。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; share reversible feedback between primary and expanded actions." }),
];

export default styleVariants;
