import type { Locale } from './i18n';

type Copy = Record<Locale, string>;
export interface GalleryAnnotation {
  row: string;
  title: Copy;
  /** Percentages measured against the actual 1536 × 2048 reference image. */
  region: { x: number; y: number; width: number; height: number };
  observed: Copy;
  borrow: Copy;
  avoid: Copy;
}
export interface GalleryBreakdown {
  image: string;
  width: number;
  height: number;
  title: Copy;
  alt: Copy;
  annotations: GalleryAnnotation[];
}

/** Curated after visually inspecting the local reference, not inferred from the generation prompt. */
export const galleryBreakdowns: Record<string, GalleryBreakdown> = {
  input: {
    image: '/images/gallery/input/1.webp', width: 1536, height: 2048,
    title: { zh: '从这张图借用什么：三种标签位置', en: 'What to borrow: three label placements' },
    alt: { zh: '输入框基础视觉结构参考海报，依次展示描边、填充、下划线、浮动标签和内嵌标签。拆解标注对应原图第 01、04、05 行。', en: 'Input reference poster with outlined, filled, underlined, floating-label, and inset-label fields. The annotations examine original rows 01, 04, and 05.' },
    annotations: [
      {
        row: '01', title: { zh: '把标签、输入值和说明分开', en: 'Separate the label, value, and helper text' },
        region: { x: 28.1, y: 12.4, width: 67.9, height: 15.3 },
        observed: { zh: '原图第 01 行中，“工作邮箱”位于边框上方，邮箱值在白色输入区域内，“用于接收项目通知”在下方。三层文字靠近同一个字段，没有挤在一行。', en: 'In row 01, the work-email label sits above the outline, the email value is inside the white field, and the notification helper text is below. All three remain close to the same field.' },
        borrow: { zh: '适合资料、注册等需要反复核对的表单。保留常驻标签和紧邻字段的说明；实现时让标签与输入框关联，让辅助说明可被读屏读取。', en: 'Borrow the persistent label and nearby helper text for profile or sign-up forms that users need to review. Associate the label with the input and expose helper text to screen readers.' },
        avoid: { zh: '不要把海报里的浅灰文字和细边框当作已经合格的生产规格。它没有展示错误、必填或键盘焦点；这些状态需要在真实页面里补齐并检查。', en: 'Do not treat the faint text and thin outline as validated production specifications. Error, required, and keyboard-focus states are not shown; implement and check them in a real page.' },
      },
      {
        row: '04', title: { zh: '填写后，字段名称仍然在场', en: 'Keep the field name visible after entry' },
        region: { x: 28.1, y: 62.3, width: 67.9, height: 15.3 },
        observed: { zh: '原图第 04 行把“未填写”和“输入后”并排：左边“邮箱地址”在框内，右边标签移到上边框，输入值留在框内。箭头表示这两个静态状态的关系。', en: 'Row 04 pairs an empty and a filled state. The email label starts inside the left field; on the right it sits on the top outline while the value stays inside. An arrow relates these two static states.' },
        borrow: { zh: '可借用“填写后仍认得字段”的原则。若采用浮动标签，应覆盖自动填充、已有值、清空和聚焦状态；在放大文字和长标签下检查重叠。', en: 'Borrow the principle that a filled field remains identifiable. If using floating labels, cover autofill, prefilled values, clearing, and focus; check enlarged text and long labels for overlap.' },
        avoid: { zh: '不要仅放一个会消失的 placeholder 来模仿它。长标题、较大字号或高密度表单若放不下浮动标签，使用外置常驻标签更容易保持清晰。图里的箭头也不证明动画或焦点逻辑已实现。', en: 'Do not imitate this with a disappearing placeholder alone. Prefer a persistent external label when long names, large text, or dense forms leave insufficient space. The arrow does not demonstrate working animation or focus behavior.' },
      },
      {
        row: '05', title: { zh: '边框内也要保留文字层级', en: 'Preserve hierarchy inside the field' },
        region: { x: 28.1, y: 78.9, width: 67.9, height: 15.3 },
        observed: { zh: '原图第 05 行的同一描边容器里，小号“工作邮箱”在上，较大的邮箱值在下。标签没有占用输入值的位置，两者共用一个容器。', en: 'In row 05, a smaller work-email label sits above the larger email value within one outlined container. The label and the value occupy separate vertical space.' },
        borrow: { zh: '可借用“同一字段内分两层”的组织方式，让密集资料页仍能同时显示名称和值。为两层内容预留真实高度，标签仍应有明确的语义关联。', en: 'Borrow the two-level grouping for compact profile screens that need to show both field names and values. Reserve real height for both lines and keep the label semantically associated.' },
        avoid: { zh: '不要为了紧凑压成固定矮高度，也不要把标签当作用户可编辑内容。长邮箱、换行标签、200% 文字缩放或多语言页面都需要额外空间；海报没有证明这些情况可用。', en: 'Do not compress it into a fixed short height or make the label editable content. Long email addresses, wrapping labels, 200% text zoom, and multilingual pages need more room; this poster does not validate those cases.' },
      },
    ],
  },
};
