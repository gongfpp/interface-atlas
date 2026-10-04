import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('dropdown', 'neumorphism', { zh: "同色双阴影与凹凸几何，实线控件边界仍清晰；展开操作、选择反馈与撤销。", en: "Paired same-surface shadows and inset relief retain solid control boundaries; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'y2k', { zh: "铬色垂直渐变、白色泡状高光与胶囊字形；展开操作、选择反馈与撤销。", en: "Chrome vertical gradients, white bubble highlights and capsule typography; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'hand-drawn', { zh: "不对称圆角、虚线与手写感衬线；展开操作、选择反馈与撤销。", en: "Uneven corners, dashed strokes and handwritten serif rhythm; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'minimalism', { zh: "直角细线与留白层级；展开操作、选择反馈与撤销。", en: "Square edges, thin rules and spacious hierarchy; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'flat-design', { zh: "纯色块与清晰圆角分区；展开操作、选择反馈与撤销。", en: "Solid blocks and clear rounded sections; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；展开操作、选择反馈与撤销。", en: "Indexed grids, two rule weights and strong type scale; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；展开操作、选择反馈与撤销。", en: "Heavy black outlines, hard shadows and solid press states; expand actions, show selection feedback and undo." }),
  feedbackVariant('dropdown', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；展开操作、选择反馈与撤销。", en: "Bright-edged frosted layers and blur over a dark colourful ground; expand actions, show selection feedback and undo." }),
];

export default styleVariants;
