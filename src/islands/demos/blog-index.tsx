import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'card-grid', zh: '卡片网格', en: 'Card Grid' },
  { id: 'list', zh: '紧凑列表', en: 'List' },
  { id: 'featured-hero', zh: '头条英雄区', en: 'Featured Hero' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'card-grid' };

type Post = { zh: string; en: string; cat: string; zhDate: string; enDate: string };

const CATEGORIES = [
  { id: 'all', zh: '全部', en: 'All' },
  { id: 'design', zh: '设计', en: 'Design' },
  { id: 'dev', zh: '开发', en: 'Dev' },
  { id: 'product', zh: '产品', en: 'Product' },
] as const;

const POSTS: Post[] = [
  { zh: '设计系统的演进路径', en: 'How design systems evolve', cat: 'design', zhDate: '8月12日', enDate: 'Aug 12' },
  { zh: '用 CSS Grid 重写布局', en: 'Rewriting layout with CSS Grid', cat: 'dev', zhDate: '8月09日', enDate: 'Aug 09' },
  { zh: '从需求到原型的取舍', en: 'From brief to prototype', cat: 'product', zhDate: '8月05日', enDate: 'Aug 05' },
  { zh: '动效不该拖慢感知', en: 'Motion should not slow perception', cat: 'design', zhDate: '8月01日', enDate: 'Aug 01' },
  { zh: '可访问性的日常检查', en: 'Accessibility in daily review', cat: 'dev', zhDate: '7月28日', enDate: 'Jul 28' },
  { zh: '把指标讲成故事', en: 'Turning metrics into a story', cat: 'product', zhDate: '7月24日', enDate: 'Jul 24' },
];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const SCOPE_STYLE =
  '[data-demo-scope] [class*="transition"] { transition-duration: calc(150ms * var(--demo-speed, 1)); }';

const PostCard = ({ post, en }: { post: Post; en: boolean }) => (
  <div className="flex flex-col gap-1 rounded-md border border-line bg-raised p-1.5">
    <div className="aspect-[16/9] w-full rounded bg-ink-3/15" />
    <span className="text-[9px] font-medium leading-tight">{en ? post.en : post.zh}</span>
    <Bar w="w-3/4" h="h-1" />
    <span className="text-[8px] text-ink-3">{en ? post.enDate : post.zhDate}</span>
  </div>
);

function Wireframe({ variant, en }: { variant: VariantId; en: boolean }) {
  const [cat, setCat] = useState<string>('all');
  const [page, setPage] = useState(0);
  const posts = POSTS.filter((p) => cat === 'all' || p.cat === cat);

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <header className="flex h-7 shrink-0 items-center gap-3 border-b border-line bg-raised px-3" data-anatomy="1">
        <span className="h-3 w-3 rounded bg-accent" />
        <span className="font-serif text-[10px] font-semibold">{en ? 'Blog' : '博客'}</span>
        <div className="ml-1 flex gap-2">
          {[en ? 'Latest' : '最新', en ? 'Topics' : '主题', en ? 'Archive' : '归档'].map((t) => (
            <span key={t} className="text-[9px] text-ink-2">{t}</span>
          ))}
        </div>
        <span className="ml-auto rounded border border-line px-1.5 py-0.5 text-[9px] text-ink-3">⌕ {en ? 'Search' : '搜索'}</span>
      </header>

      {variant === 'featured-hero' ? (
        <div className="relative mx-3 mt-2 flex h-16 shrink-0 items-end rounded-md bg-accent/15 p-2" data-anatomy="2">
          <div className="absolute right-2 top-2 h-8 w-16 rounded bg-ink-3/15" />
          <div>
            <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[8px] text-accent">{en ? 'Featured' : '头条'}</span>
            <p className="mt-1 font-serif text-[11px] font-semibold">{posts[0] ? (en ? posts[0].en : posts[0].zh) : ''}</p>
          </div>
        </div>
      ) : (
        <div className="mx-3 mt-2 flex shrink-0 items-center gap-2 rounded-md border border-line bg-raised p-1.5" data-anatomy="2">
          <div className="h-9 w-14 shrink-0 rounded bg-accent/20" />
          <div className="flex-1">
            <p className="text-[9px] font-semibold">{posts[0] ? (en ? posts[0].en : posts[0].zh) : ''}</p>
            <Bar w="w-2/3" h="h-1" />
          </div>
          <span className="text-[8px] text-accent">{en ? 'Read' : '阅读'}</span>
        </div>
      )}

      <div className="flex shrink-0 flex-wrap gap-1 px-3 pt-2" data-anatomy="3">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => { setCat(c.id); setPage(0); }}
            className={`rounded-full border px-2 py-0.5 text-[9px] transition-colors ${
              cat === c.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {en ? c.en : c.zh}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3 pt-2" data-anatomy="4">
        {variant === 'list' ? (
          <div>
            {posts.slice(0, 3).map((p) => (
              <div key={p.en} className="flex items-center gap-2 border-t border-line py-1 first:border-t-0">
                <div className="h-6 w-10 shrink-0 rounded bg-ink-3/15" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-medium">{en ? p.en : p.zh}</p>
                  <Bar w="w-2/3" h="h-1" />
                </div>
                <span className="shrink-0 text-[8px] text-ink-3">{en ? p.enDate : p.zhDate}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {posts.slice(0, variant === 'featured-hero' ? 3 : 6).map((p) => (
              <PostCard key={p.en} post={p} en={en} />
            ))}
          </div>
        )}
      </div>

      <div className="flex h-6 shrink-0 items-center justify-center gap-1 border-t border-line px-3" data-anatomy="5">
        <button
          onClick={() => setPage((v) => Math.max(0, v - 1))}
          className="rounded px-1 text-[9px] text-ink-2 transition-colors hover:text-accent"
        >
          ‹
        </button>
        {[0, 1, 2].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`h-4 w-4 rounded text-[8px] transition-colors ${
              page === n ? 'bg-accent text-white' : 'text-ink-3 hover:text-accent'
            }`}
          >
            {n + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((v) => Math.min(2, v + 1))}
          className="rounded px-1 text-[9px] text-ink-2 transition-colors hover:text-accent"
        >
          ›
        </button>
      </div>

      <div className="flex h-8 shrink-0 items-center gap-2 bg-accent-soft px-3" data-anatomy="6">
        <span className="text-[9px] font-medium text-accent">{en ? 'Get new posts by email' : '订阅新文章'}</span>
        <span className="ml-auto rounded border border-accent/40 bg-paper px-1.5 py-0.5 text-[8px] text-ink-3">you@email.com</span>
        <span className="rounded bg-accent px-1.5 py-0.5 text-[8px] text-white">{en ? 'Join' : '订阅'}</span>
      </div>
    </div>
  );
}

const BlogIndexDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = usePreviewVariant<VariantId>('card-grid');

  if (mode === 'variants') {
    return (
      <div data-demo-scope className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <style>{SCOPE_STYLE}</style>
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} en={en} />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div data-demo-scope className="mx-auto flex max-w-md flex-col gap-3">
      <style>{SCOPE_STYLE}</style>
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            aria-pressed={variant === v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {en ? v.en : v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={`${variant}-${locale}`} variant={variant} en={en} />
      <p className="text-center text-[11px] text-ink-3">
        {en ? 'Click a category or page number to filter the list' : '点分类或页码筛选文章列表'}
      </p>
    </div>
  );
};

export default BlogIndexDemo;
