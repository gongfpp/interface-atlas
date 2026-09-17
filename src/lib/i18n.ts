export type Locale = 'zh' | 'en';
export const LOCALES: Locale[] = ['zh', 'en'];

/** zh 无前缀，en 加 /en 前缀（PRD §7a） */
export function localePath(path: string, locale: Locale): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return locale === 'zh' ? p : `/en${p === '/' ? '' : p}`;
}

export const TYPE_LABELS: Record<string, Record<Locale, string>> = {
  components: { zh: '组件', en: 'Components' },
  patterns: { zh: '模式', en: 'Patterns' },
  styles: { zh: '风格', en: 'Styles' },
  pages: { zh: '页面', en: 'Pages' },
  motion: { zh: '动效', en: 'Motion' },
};

export const UI = {
  tagline: { zh: '前端设计概念百科 · 可交互参考库 · Agent Prompt 库', en: 'Frontend design concept encyclopedia · interactive reference · agent prompt library' },
  heroTitle: { zh: '前端设计，不知道叫什么？', en: "Seen a design, but don't know its name?" },
  searchPlaceholder: { zh: '搜索组件、页面、设计风格、交互效果……', en: 'Search components, pages, styles, interactions…' },
  searchHint: { zh: '试试：「加载时候灰色一闪一闪」「Mac 那种快捷搜索框」', en: 'Try: "grey shimmering while loading" or "Mac-style quick search box"' },
  exploreByType: { zh: '按类型探索', en: 'Explore by type' },
  popularConcepts: { zh: '热门概念', en: 'Popular concepts' },
  random: { zh: '随便看看', en: 'Surprise me' },
  what: { zh: '这是什么', en: 'What' },
  demo: { zh: '可运行示例', en: 'Live demo' },
  anatomy: { zh: '结构拆解', en: 'Anatomy' },
  variants: { zh: '常见形式', en: 'Variants' },
  whenToUse: { zh: '适用场景', en: 'When to use' },
  whenNotToUse: { zh: '不适用场景', en: 'When not to use' },
  related: { zh: '相关概念', en: 'Related concepts' },
  compare: { zh: '横向对比', en: 'Compare' },
  sources: { zh: '参考来源', en: 'Sources' },
  prompts: { zh: '交给 AI', en: 'Agent prompts' },
  implementation: { zh: '实现要点', en: 'Implementation' },
  copyPrompt: { zh: '复制 Prompt', en: 'Copy prompt' },
  copied: { zh: '已复制', en: 'Copied' },
  notFoundTitle: { zh: '没有找到相关概念', en: 'No matching concepts' },
  notFoundBody: {
    zh: '换个说法试试，比如「卡片鼠标放上去浮起来」。',
    en: 'Try describing it differently, e.g. "card lifts on hover".',
  },
  play: { zh: '播放', en: 'Play' },
  replay: { zh: '重播', en: 'Replay' },
  slowMo: { zh: '慢速', en: 'Slow' },
  beforeAfter: { zh: '前后对比', en: 'Before / After' },
  viewAll: { zh: '查看全部', en: 'View all' },
  entriesCount: { zh: '个概念', en: 'concepts' },
  searchTitle: { zh: '搜索', en: 'Search' },
  descriptionLabel: { zh: '一句话理解', en: 'In one line' },
  aliasesLabel: { zh: '别名', en: 'Aliases' },
  categoryLabel: { zh: '分类', en: 'Category' },
  footerNote: {
    zh: '帮助你和 AI 精准谈论前端设计。',
    en: 'Helping you and your AI talk precisely about frontend design.',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export function t(key: keyof typeof UI, locale: Locale): string {
  return UI[key][locale];
}
