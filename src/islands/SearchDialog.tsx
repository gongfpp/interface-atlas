import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearch, type SearchDoc } from '@/lib/use-search';
import { groupResults, indexById, SEARCH_SUGGESTIONS, TYPE_LABEL } from '@/lib/search-meta';
import { localePath } from '@/lib/i18n';

export default function SearchDialog({ locale, autoOpen = false }: { locale: 'zh' | 'en'; autoOpen?: boolean }) {
  // /search?q=xxx 落地页：初始即打开并预填
  // SSR 预渲染无 window，守卫后回退到默认值
  const initialQuery =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : null;
  const [open, setOpen] = useState(() => autoOpen || Boolean(initialQuery));
  const { query, setQuery, results, active, setActive, loadingModel, loadingIndex, ensureIndex } = useSearch(initialQuery ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  // 首次打开时懒加载索引
  useEffect(() => {
    if (open) ensureIndex();
  }, [open, ensureIndex]);

  useEffect(() => {
    const onOpen = () => {
      ensureIndex();
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ensureIndex();
        setOpen((v) => !v);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('ia:search-open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('ia:search-open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [ensureIndex]);

  const grouped = useMemo(() => groupResults(results), [results]);
  const indexMap = useMemo(() => indexById(results), [results]);

  const go = (doc: SearchDoc) => {
    window.location.href = localePath(`/${doc.type}/${doc.id}`, locale);
  };

  if (!open) return null;

  const empty = !loadingIndex && !loadingModel && results.length === 0 && Boolean(query);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0))); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === 'Enter' && results[active]) go(results[active].doc);
          }}
          placeholder={locale === 'zh'
            ? '搜索组件、页面、设计风格、交互效果……'
            : 'Search components, pages, styles, interactions…'}
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-base outline-none placeholder:text-ink-3"
          autoFocus
        />
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loadingIndex && (
            <p className="px-3 py-3 text-sm text-ink-3">
              {locale === 'zh' ? '正在加载搜索索引…' : 'Loading search index…'}
            </p>
          )}
          {loadingModel && !loadingIndex && (
            <p className="px-3 py-2 text-xs text-ink-3">
              {locale === 'zh' ? '正在加载语义检索模型…' : 'Loading semantic model…'}
            </p>
          )}
          {empty && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-ink-3">
                {locale === 'zh' ? '没有找到，换个说法试试' : 'Nothing found — try rephrasing'}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {SEARCH_SUGGESTIONS[locale].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink-2 hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {grouped.map(([type, items]) => (
            <div key={type} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-ink-3">
                {TYPE_LABEL[type]?.[locale] ?? type}
              </p>
              {items.map((r) => {
                const i = indexMap.get(r.doc.id) ?? 0;
                return (
                  <button
                    key={r.doc.id}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      i === active ? 'bg-accent-soft text-accent' : 'hover:bg-code-bg'
                    }`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.doc)}
                  >
                    <span className="font-medium">{r.doc.name[locale]}</span>
                    <span className="ml-3 truncate text-xs text-ink-3">{r.doc.name.en}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="border-t border-line px-4 py-2 text-[11px] text-ink-3">
          ↑↓ {locale === 'zh' ? '选择' : 'navigate'} · ↵ {locale === 'zh' ? '打开' : 'open'} · esc {locale === 'zh' ? '关闭' : 'close'}
        </div>
      </div>
    </div>
  );
}
