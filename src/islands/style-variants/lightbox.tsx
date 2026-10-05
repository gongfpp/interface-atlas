import type { StyleVariantSet } from './types';
import { feedbackVariant } from '../shared/feedbackRecipes';

// 保留已有风格语言；所有皮肤使用相同的可逆本地交互与键盘契约。
const styleVariants: StyleVariantSet = [
  feedbackVariant('lightbox', 'art-deco', { zh: "对称金色双线、菱形徽记与衬线大写；放大色彩习作、前后切换与关闭。", en: "Symmetric gold double rules, a diamond marker and uppercase serif type; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'aurora', { zh: "深色底上叠蓝紫柔焦渐变与亮边圆角面；放大色彩习作、前后切换与关闭。", en: "Soft blue-purple light gradients and bright-edged rounded surfaces over a dark ground; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'pixel-art', { zh: "4px 方角边、阶梯硬投影与像素等宽字；放大色彩习作、前后切换与关闭。", en: "Square 4px borders, stepped hard shadows and pixel-like monospace type; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'minimalism', { zh: "直角细线与留白层级；放大色彩习作、前后切换与关闭。", en: "Square edges, thin rules and spacious hierarchy; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'flat-design', { zh: "纯色块与清晰圆角分区；放大色彩习作、前后切换与关闭。", en: "Solid blocks and clear rounded sections; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'swiss-style', { zh: "编号网格、粗细横线与字号跳跃；放大色彩习作、前后切换与关闭。", en: "Indexed grids, two rule weights and strong type scale; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'neobrutalism', { zh: "粗黑框、硬偏移投影与实体按压；放大色彩习作、前后切换与关闭。", en: "Heavy black outlines, hard shadows and solid press states; enlarge colour studies, navigate between them and close." }),
  feedbackVariant('lightbox', 'glassmorphism', { zh: "深色彩底上的亮边磨砂层与模糊材质；放大色彩习作、前后切换与关闭。", en: "Bright-edged frosted layers and blur over a dark colourful ground; enlarge colour studies, navigate between them and close." }),
];

export default styleVariants;
