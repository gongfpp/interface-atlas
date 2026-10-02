import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'list', zh: '列表结果', en: 'List' },
  { id: 'grid', zh: '网格结果', en: 'Grid' },
  { id: 'instant', zh: '即时搜索', en: 'Instant' },
  { id: 'faceted', zh: '多面筛选', en: 'Faceted' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'list' };

const DATA = [
  { title: '设计系统入门指南', path: 'docs / 入门', body: '从零搭建一套设计系统：令牌、组件库与文档…' },
  { title: '组件命名规范', path: 'docs / 规范', body: '组件命名要可预测：名词优先，避免缩写…' },
  { title: '深色模式适配清单', path: 'docs / 主题', body: '适配深色模式的检查清单：色彩、阴影与图片…' },
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.indexOf(q);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-accent-soft px-0.5 text-accent">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function ResultItem({ item, q }: { item: (typeof DATA)[number]; q: string }) {
  return (
    <div className="space-y-1 rounded-md border border-line bg-raised p-2" data-anatomy="4">
      <p className="text-[11px] font-medium leading-tight">{highlight(item.title, q)}</p>
      <p className="text-[9px] leading-snug text-ink-2">{highlight(item.body, q)}</p>
      <p className="text-[8px] text-ink-3">{item.path}</p>
    </div>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [q, setQ] = useState('');
  const [types, setTypes] = useState<string[]>(['文档']);
  const results = DATA.filter(
    (d) => (!q || d.title.includes(q) || d.body.includes(q)) && types.length > 0,
  );

  const searchBox = (autoFocusHint = false) => (
    <div className="flex items-center gap-2 rounded-md border border-line bg-raised px-2 py-1.5" data-anatomy="1">
      <span className="text-[10px] text-ink-3">🔍</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索设计系统文档…"
        className="w-full bg-transparent text-[10px] outline-none placeholder:text-ink-3"
        aria-label="搜索"
      />
      {q && (
        <button onClick={() => setQ('')} className="text-[10px] text-ink-3 hover:text-ink" aria-label="清除">
          ✕
        </button>
      )}
      {autoFocusHint && <span className="text-[8px] text-ink-3">边输入边出结果</span>}
    </div>
  );

  const facets = (
    <div className="w-20 shrink-0 space-y-1.5 rounded-md border border-line bg-raised p-2" data-anatomy="2">
      <p className="text-[9px] font-medium text-ink-2">类型</p>
      {['文档', '博客', '更新'].map((t) => (
        <button
          key={t}
          onClick={() => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))}
          className="flex w-full items-center gap-1 text-left text-[9px] text-ink-2"
        >
          <span className={`flex h-2.5 w-2.5 items-center justify-center rounded-sm border ${types.includes(t) ? 'border-accent bg-accent text-[7px] text-white' : 'border-line'}`}>
            {types.includes(t) ? '✓' : ''}
          </span>
          {t}
        </button>
      ))}
    </div>
  );

  const list = results.length ? (
    <div className="space-y-1.5" data-anatomy="3">
      {results.map((r) => <ResultItem key={r.title} item={r} q={q} />)}
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line py-6 text-center">
      <p className="text-[10px] font-medium">没有找到「{q || '…'}」相关内容</p>
      <p className="text-[9px] text-ink-3">试试「设计」「组件」或清空筛选</p>
    </div>
  );

  const pager = (
    <div className="flex items-center justify-center gap-1.5 pt-1" data-anatomy="5">
      {[1, 2, 3].map((p) => (
        <span key={p} className={`rounded px-1.5 py-0.5 text-[9px] ${p === 1 ? 'bg-accent text-white' : 'text-ink-2'}`}>{p}</span>
      ))}
      <span className="text-[9px] text-ink-3">下一页 →</span>
    </div>
  );

  return (
    <div className="flex h-72 w-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 shrink-0 rounded bg-accent" />
        {searchBox(variant === 'instant')}
      </div>
      {variant === 'faceted' ? (
        <div className="flex flex-1 gap-2 overflow-hidden">
          {facets}
          <div className="flex flex-1 flex-col gap-1 overflow-hidden">
            <p className="text-[9px] text-ink-3">约 {results.length * 43} 条结果</p>
            {list}
          </div>
        </div>
      ) : variant === 'grid' ? (
        <div className="grid flex-1 grid-cols-3 content-start gap-1.5 overflow-hidden" data-anatomy="3">
          {results.map((r) => (
            <div key={r.title} className="space-y-1 rounded-md border border-line bg-raised p-1.5" data-anatomy="4">
              <div className="h-10 rounded bg-accent/25" />
              <p className="text-[9px] font-medium leading-tight">{highlight(r.title, q)}</p>
            </div>
          ))}
        </div>
      ) : variant === 'instant' ? (
        <div className="flex-1 overflow-hidden">{list}</div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <p className="mb-1 text-[9px] text-ink-3">约 {results.length * 43} 条结果</p>
          {list}
        </div>
      )}
      {variant !== 'grid' && pager}
    </div>
  );
}

const SearchDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = usePreviewVariant<VariantId>('list');

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} />
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
    <div className="mx-auto flex max-w-md flex-col gap-3">
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
            {v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={variant} variant={variant} />
      <p className="text-center text-[11px] text-ink-3">输入关键词（如「组件」「深色」）看结果与高亮；取消全部类型看空态</p>
    </div>
  );
};

export default SearchDemo;
