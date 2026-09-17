import { useMemo, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Item = { name: string; tags: string[] };

const LIBRARY: Item[] = [
  { name: 'Button 按钮', tags: ['action', '操作'] },
  { name: 'Modal 弹窗', tags: ['overlay', '对话框'] },
  { name: 'Toast 轻提示', tags: ['feedback', '提示'] },
  { name: 'Table 表格', tags: ['data', '数据'] },
  { name: 'Tabs 标签页', tags: ['navigation', '导航'] },
  { name: 'Slider 滑块', tags: ['input', '表单'] },
  { name: 'Badge 徽标', tags: ['display', '状态'] },
  { name: 'Dropdown 下拉', tags: ['overlay', '导航'] },
];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: (string | { hit: string })[] = [];
  let rest = text;
  let lowerRest = lower;
  let idx = lowerRest.indexOf(q);
  while (idx !== -1 && q) {
    parts.push(rest.slice(0, idx), { hit: rest.slice(idx, idx + q.length) });
    rest = rest.slice(idx + q.length);
    lowerRest = lowerRest.slice(idx + q.length);
    idx = lowerRest.indexOf(q);
  }
  parts.push(rest);
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <mark key={i} className="rounded-sm bg-accent-soft px-0.5 text-accent">
            {p.hit}
          </mark>
        ),
      )}
    </>
  );
}

function FilterList() {
  const [query, setQuery] = useState('');

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LIBRARY;
    return LIBRARY.filter(
      (it) => it.name.toLowerCase().includes(q) || it.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="w-full">
      <div data-anatomy="1" className="flex items-center gap-2 rounded-md border border-line bg-raised px-2.5 py-2 transition-colors focus-within:border-accent">
        <span aria-hidden="true" className="text-[11px] text-ink-3">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          aria-label="搜索组件 · Search components"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入名称或标签，如 modal、导航…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-ink-3"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="清除 · Clear"
            className="shrink-0 text-[10px] text-ink-3 hover:text-accent"
          >
            ✕
          </button>
        )}
      </div>
      <p data-anatomy="2" aria-live="polite" className="mt-1.5 text-[10px] text-ink-3">
        {query ? `命中 ${hits.length} / ${LIBRARY.length} 条 · ${hits.length} matches` : `共 ${LIBRARY.length} 个组件 · ${LIBRARY.length} components`}
      </p>
      <div data-anatomy="3" className="mt-2 h-40 space-y-1 overflow-y-auto rounded-md border border-line bg-code-bg p-1.5">
        {hits.map((it) => (
          <div
            key={it.name}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors hover:bg-accent-soft/60"
            style={{ animation: `sf-fade calc(0.25s * var(--demo-speed, 1)) ease-out both` }}
          >
            <Highlight text={it.name} query={query.trim()} />
            <span className="ml-auto font-mono text-[9px] text-ink-3">{it.tags.join(' · ')}</span>
          </div>
        ))}
        {hits.length === 0 && (
          <div data-anatomy="4" className="flex h-full flex-col items-center justify-center gap-1.5 py-6 text-center">
            <span className="text-[11px] text-ink-3">没有匹配「{query}」的组件 · No matches</span>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded border border-line bg-raised px-2 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              清除搜索 · Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const SearchFilteringDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'instant', zh: '即时过滤', en: 'Instant', note: '输入即过滤，无提交按钮' },
          { id: 'chip', zh: '标签筛选', en: 'Filter chips', note: '点标签按类目过滤，可与搜索叠加' },
          { id: 'highlight', zh: '命中高亮', en: 'Highlight', note: '匹配片段标亮，帮助确认为什么命中' },
        ].map((v) => (
          <div key={v.id} className="rounded-md border border-line bg-raised p-3">
            <div className="font-mono text-[10px] text-accent">{v.id}</div>
            <div className="mt-1 text-xs font-medium">{v.zh}</div>
            <div className="text-[10px] text-ink-3">{v.en}</div>
            <p className="mt-2 leading-relaxed">{v.note}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <FilterList />
      <style>{`@keyframes sf-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
};

export default SearchFilteringDemo;
