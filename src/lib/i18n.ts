export type Locale = 'zh' | 'en';
export const LOCALES: Locale[] = ['zh', 'en'];

/** 部署子路径（GitHub Pages 项目站点为 `/interface-atlas`，根部署为 `''`）。 */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** 给站内绝对路径加上部署 base。 */
export function withBase(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (p === '/') return `${BASE}/`;
  return `${BASE}${p}`;
}

/** 去掉部署 base，得到站内路由路径（用于语言切换等）。 */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) return pathname.slice(BASE.length) || '/';
  return pathname;
}

/** zh 无前缀，en 加 /en 前缀（PRD §7a），并带上部署 base。 */
export function localePath(path: string, locale: Locale): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return withBase(locale === 'zh' ? p : `/en${p === '/' ? '' : p}`);
}

export const TYPE_LABELS: Record<string, Record<Locale, string>> = {
  styles: { zh: '风格', en: 'Styles' },
  components: { zh: '组件', en: 'Components' },
  patterns: { zh: '交互模式', en: 'Patterns' },
  motion: { zh: '动效', en: 'Motion' },
  pages: { zh: '页面', en: 'Pages' },
};

/** related 边标签（PRD §24 内容关系模型） */
export const RELATION_LABELS: Record<string, Record<Locale, string>> = {
  alternative_to: { zh: '替代方案', en: 'Alternative' },
  similar_to: { zh: '相似概念', en: 'Similar' },
  used_with: { zh: '搭配使用', en: 'Used with' },
  contains: { zh: '包含组件', en: 'Contains' },
  uses: { zh: '使用模式', en: 'Uses pattern' },
  affects: { zh: '影响组件', en: 'Affects' },
  applies_to: { zh: '应用于', en: 'Applies to' },
};

/**
 * compare.dimensions 的 key 是中文维度名（内容即数据）；英文标签在此维护。
 * 新增 compare 维度时需同步补 en 标签，否则英文页回落为中文 key。
 */
export const DIMENSION_LABELS: Record<string, Record<Locale, string>> = {
  打断程度: { zh: '打断程度', en: 'Interruption' },
  持续性: { zh: '持续性', en: 'Persistence' },
  错误定位能力: { zh: '错误定位能力', en: 'Error pinpointing' },
  强度: { zh: '强度', en: 'Intensity' },
  移动端友好: { zh: '移动端友好', en: 'Mobile friendly' },
  适合元素: { zh: '适合元素', en: 'Best for' },
  信息密度: { zh: '信息密度', en: 'Information density' },
  可扫描性: { zh: '可扫描性', en: 'Scannability' },
  适合内容: { zh: '适合内容', en: 'Good for' },
  内容容量: { zh: '内容容量', en: 'Content capacity' },
  触发成本: { zh: '触发成本', en: 'Trigger cost' },
  空间占用: { zh: '空间占用', en: 'Space footprint' },
  层级容量: { zh: '层级容量', en: 'Layer capacity' },
  触发方式: { zh: '触发方式', en: 'Trigger' },
  数据控制: { zh: '数据控制', en: 'Data control' },
  适用内容: { zh: '适用内容', en: 'Suitable content' },
  信息量: { zh: '信息量', en: 'Information volume' },
  适用时长: { zh: '适用时长', en: 'Suitable duration' },
  与结果一致性: { zh: '与结果一致性', en: 'Result consistency' },
  用户状态: { zh: '用户状态', en: 'User state' },
  核心目标: { zh: '核心目标', en: 'Core goal' },
  安全要求: { zh: '安全要求', en: 'Safety requirement' },
};

export function dimensionLabel(key: string, locale: Locale): string {
  return DIMENSION_LABELS[key]?.[locale] ?? key;
}

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
