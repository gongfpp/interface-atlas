import { getCollection } from 'astro:content';
import type { StylePreviewData } from '@/content.config';
import type { Locale } from '@/lib/i18n';

/** 两张参考图的展示顺序；独立于组件实验室的八套变体。 */
export const REFERENCE_STYLE_SLUGS: string[] = [
  'minimalism', 'swiss-style', 'editorial', 'glassmorphism', 'bento-grid',
  'neumorphism', 'skeuomorphism', 'brutalism', 'neobrutalism', 'retro-web',
];

/** 缩略图 renderer 的输入：Style 预览规格 + 从条目派生的标识与名称。 */
export type StyleThumbSpec = StylePreviewData & {
  slug: string;
  nameEn: string;
  nameZh: string;
};

/** 在渲染边界统一选取文案语言；标题与导航也必须由内容 schema 提供双语值。 */
export function localizeStylePreview(spec: StyleThumbSpec, locale: Locale) {
  return {
    ...spec,
    nav: spec.nav.map((item) => item[locale]),
    navExt: spec.navExt?.map((item) => item[locale]),
    heroTitle: spec.heroTitle[locale],
    heroTitle2: spec.heroTitle2?.[locale],
    heroSub: spec.heroSub[locale],
    cta: spec.cta[locale],
    heroCaption: spec.heroCaption?.[locale],
    features: spec.features?.map((feature) => ({ t: feature.t[locale], s: feature.s[locale] })),
  };
}

/** 读取全部已发布 Style 的预览规格，按 YAML `preview.order` 排序。 */
export async function getStylePreviews(): Promise<StyleThumbSpec[]> {
  const entries = await getCollection('styles');
  const previews: StyleThumbSpec[] = [];
  for (const entry of entries) {
    if (entry.data.status !== 'published') continue;
    const preview = entry.data.preview;
    if (!preview) continue;
    previews.push({
      slug: entry.id,
      nameEn: entry.data.name.en,
      nameZh: entry.data.name.zh,
      ...preview,
    });
  }
  return previews.sort((a, b) => a.order - b.order);
}
