import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 五大 Design Object Collection（PRD §6 / §33）。
 * 内容为 YAML，双语字段全部必填（PRD §7a）。
 */

const bilingualText = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
});

const bilingualList = z.array(bilingualText);

/**
 * 概念关系类型（PRD §24 内容关系模型）：
 * - alternative_to 同类可替代（compare 组内互为替代）
 * - similar_to     同类相近
 * - used_with      跨类搭配使用
 * - contains       页面包含组件
 * - uses           页面使用交互模式
 * - affects        风格影响组件
 * - applies_to     动效应用于组件
 */
const relationType = z.enum([
  'alternative_to',
  'similar_to',
  'used_with',
  'contains',
  'uses',
  'affects',
  'applies_to',
]);

export type Relation = ReturnType<typeof relationType.parse>;

export const RELATION_TYPES = relationType.options;

/**
 * Style 缩略预览规格（PRD §21，审计改进：YAML 为唯一事实源，组件只做 renderer）。
 * 仅 styles collection 使用；`order` 决定列表页与首页风格墙的展示顺序。
 */
const stylePreview = z.object({
  order: z.number(),
  keywords: bilingualText,
  url: z.string(),
  scene: z.enum(['lumo', 'vertex', 'paper', 'aurora', 'tasko', 'generic']),
  brand: z.string(),
  nav: z.array(z.string()),
  navExt: z.array(z.string()).optional(),
  heroTitle: z.string(),
  heroTitle2: z.string().optional(),
  heroSub: z.string(),
  cta: z.string(),
  heroCaption: z.string().optional(),
  features: z
    .array(
      z.object({
        t: z.string(),
        s: z.string(),
      }),
    )
    .optional(),
  panel: z.enum(['device', 'photo', 'mountain', 'shapes', 'chart', 'screen']).optional(),
  tokens: z.object({
    bg: z.string(),
    fg: z.string(),
    sub: z.string(),
    accent: z.string(),
    accentFg: z.string(),
    card: z.string(),
    cardBorder: z.string(),
    radius: z.string(),
    shadow: z.string().optional(),
    font: z.string(),
    blur: z.string().optional(),
    upper: z.boolean().optional(),
    italic: z.boolean().optional(),
    triCards: z.tuple([z.string(), z.string(), z.string()]).optional(),
    heroSize: z.string().optional(),
  }),
});

export type StylePreviewData = ReturnType<typeof stylePreview.parse>;

const baseSchema = z
  .object({
    status: z.enum(['draft', 'published']).default('draft'),

    name: bilingualText,

    /** 口语描述自由收录，服务搜索（PRD §42.2） */
    aliases: z.array(z.string()).default([]),

    category: z.array(z.string()).default([]),

    description: bilingualText,

    use_when: bilingualList.min(1),
    avoid_when: bilingualList.min(1),

    tags: z.array(z.string()).default([]),

    variants: z
      .array(
        z.object({
          id: z.string(),
          name: bilingualText,
          note: bilingualText.optional(),
        }),
      )
      .min(1),

    anatomy: z.array(z.string()).default([]),
    playground: z.object({ task: bilingualText, checks: bilingualList.min(2) }).optional(),

    /** 竞品改进 #1：对应 Web 平台 API 符号（元素 / ARIA role / 关键属性），仅适用条目填写 */
    api: z.array(z.string()).default([]),

    /** 竞品改进：多框架命名对照（NameThatUI「In code」），组件类建议给 */
    framework_names: z
      .array(
        z.object({
          framework: z.string().min(1),
          name: z.string().min(1),
          url: z.string().url().optional(),
          note: bilingualText.optional(),
        }),
      )
      .default([]),

    /** 一名两义辨析（uiterms Stepper 模式）：这个词还可能指什么 */
    disambiguation: bilingualText.optional(),

    /** 易混淆概念：id + 一句辨析 */
    confusable: z
      .array(
        z.object({
          id: z.string(),
          note: bilingualText,
        }),
      )
      .default([]),

    applicable_styles: z.array(z.string()).default([]),
    applicable_components: z.array(z.string()).default([]),
    applicable_pages: z.array(z.string()).default([]),

    related: z
      .array(
        z.object({
          id: z.string(),
          relation: relationType,
        }),
      )
      .default([]),

    compare: z
      .object({
        group: z.string(),
        dimensions: z.record(z.string(), bilingualText),
      })
      .optional(),

    demo: z
      .object({
        /** Demo 岛在注册表中的键（src/islands/demos） */
        component: z.string(),
        modes: z.array(z.enum(['default', 'dark', 'loading', 'variants'])).default(['default']),
        /**
         * 仅 motion 条目：播放器只展示对这些 demo 真实有效的控件，
         * 避免出现点了没反应的按钮。缺省 = 全部（play/replay/slow/compare）。
         */
        motionControls: z.array(z.enum(['play', 'replay', 'slow', 'compare'])).optional(),
      })
      .optional(),

    sources: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url(),
        }),
      )
      .min(1),

    /** PRD §18：CSS Concept + 实现要点 */
    implementation: z
      .object({
        css: z.array(z.string()).min(1),
        notes: bilingualText,
      })
      .optional(),

    /** PRD §21：Style 条目的开发规格（仅 styles 使用） */
    style_spec: z
      .object({
        typography: bilingualText,
        color: bilingualText,
        border: bilingualText,
        shadow: bilingualText,
        spacing: bilingualText,
      })
      .optional(),

    /** PRD §21：Style 缩略预览规格（仅 styles 使用） */
    preview: stylePreview.optional(),

    /** PRD §20：Page 结构拆解（部件 + 说明，仅 pages 使用） */
    structure: z
      .array(
        z.object({
          part: bilingualText,
          note: bilingualText,
        }),
      )
      .optional(),

    prompts: z.object({
      basic: bilingualText,
      design: bilingualText,
      implementation: bilingualText,
      agent: bilingualText,
    }),
  })
  .superRefine((entry, ctx) => {
    // PRD §26：published 条目必须内容齐全（CI 另有脚本做全量校验）
    if (entry.status !== 'published') return;
    const required: Array<[string, unknown]> = [
      ['description', entry.description],
      ['use_when', entry.use_when],
      ['avoid_when', entry.avoid_when],
      ['variants', entry.variants],
      ['prompts', entry.prompts],
      ['sources', entry.sources],
    ];
    for (const [field, value] of required) {
      if (value == null || (Array.isArray(value) && value.length === 0)) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `published 条目缺少必填字段: ${field}`,
        });
      }
    }
  });

export const collections = {
  components: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/components' }),
    schema: baseSchema,
  }),
  patterns: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/patterns' }),
    schema: baseSchema,
  }),
  styles: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/styles' }),
    schema: baseSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/pages' }),
    schema: baseSchema,
  }),
  motion: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/motion' }),
    schema: baseSchema,
  }),
  foundation: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/foundation' }),
    schema: baseSchema,
  }),
  a11y: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/a11y' }),
    schema: baseSchema,
  }),
  /**
   * 灵感图库（PRD §43）：AI 生成的组件设计参考图集 + 可复现的生图 Prompt。
   */
  gallery: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/gallery' }),
    schema: z.object({
      status: z.enum(['draft', 'published']).default('published'),
      name: bilingualText,
      description: bilingualText,
      related_component: z.string().optional(),
      images: z
        .array(
          z.object({
            file: z.string(),
            title: bilingualText,
          }),
        )
        .min(1),
      /** 生图 Prompt（skill）：可直接复制到即梦 / Midjourney / DALL-E 等 */
      prompt: bilingualText,
      tips: bilingualList.default([]),
      aliases: z.array(z.string()).default([]),
    }),
  }),
};

export const CONCEPT_TYPES = [
  'components',
  'patterns',
  'styles',
  'pages',
  'motion',
  'foundation',
  'a11y',
] as const;
export type ConceptType = (typeof CONCEPT_TYPES)[number];
