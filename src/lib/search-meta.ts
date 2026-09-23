import type { SearchHit } from '@/lib/use-search';

export const TYPE_ORDER = [
  'styles',
  'components',
  'patterns',
  'motion',
  'pages',
  'foundation',
  'a11y',
  'gallery',
];

export const TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  styles: { zh: '风格', en: 'Styles' },
  components: { zh: '组件', en: 'Components' },
  patterns: { zh: '交互模式', en: 'Patterns' },
  motion: { zh: '动效', en: 'Motion' },
  pages: { zh: '页面', en: 'Pages' },
  foundation: { zh: '基础', en: 'Foundation' },
  a11y: { zh: '无障碍', en: 'Accessibility' },
  gallery: { zh: '灵感图库', en: 'Gallery' },
};

/** 搜索结果按类型分组展示（PRD §9），组顺序固定为 TYPE_ORDER */
export function groupResults(results: SearchHit[]): Array<[string, SearchHit[]]> {
  const groups = new Map<string, SearchHit[]>();
  for (const r of results) {
    const list = groups.get(r.doc.type) ?? [];
    list.push(r);
    groups.set(r.doc.type, list);
  }
  return [...groups.entries()].sort(
    (a, b) => TYPE_ORDER.indexOf(a[0]) - TYPE_ORDER.indexOf(b[0]),
  );
}

/** id → 在扁平结果中的下标（键盘上下键的顺序基准） */
export function indexById(results: SearchHit[]): Map<string, number> {
  const map = new Map<string, number>();
  results.forEach((r, i) => map.set(r.doc.id, i));
  return map;
}

/** 空结果引导示例（PRD §9 口语化查询） */
export const SEARCH_SUGGESTIONS: Record<'zh' | 'en', string[]> = {
  zh: ['加载灰色一闪一闪', 'Mac 那种快捷搜索框', '卡片鼠标放上去浮起来', '左边有菜单的后台', '毛玻璃'],
  en: ['grey shimmering while loading', 'Mac-style quick search', 'card lifts on hover', 'admin menu on the left', 'frosted glass'],
};
