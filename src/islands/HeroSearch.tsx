import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useSearch, type SearchDoc } from '@/lib/use-search';
import { groupResults, indexById, SEARCH_SUGGESTIONS, TYPE_LABEL } from '@/lib/search-meta';
import { localePath, t } from '@/lib/i18n';

/**
 * 首页 Hero 内联搜索（PRD §8）：在输入框内直接打字，结果于下方就地展开，
 * 不弹出新窗口。⌘K 仍由 SearchDialog 的命令面板承接。
 */
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function HeroSearch({ locale }: { locale: 'zh' | 'en' }) {
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const { query, setQuery, results, active, setActive, loadingIndex, loadError, ensureIndex } = useSearch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 点击面板外部收起
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const grouped = useMemo(() => groupResults(results), [results]);
  const indexMap = useMemo(() => indexById(results), [results]);

  const go = (doc: SearchDoc) => {
    window.location.href = localePath(`/${doc.type}/${doc.id}`, locale);
  };

  const showPanel = open && query.trim().length > 0;
  const empty = showPanel && !loadingIndex && !loadError && results.length === 0;
  const activeId = showPanel && results[active] ? `hero-opt-${results[active].doc.id}` : undefined;

  return (
    <div ref={rootRef} className="relative mt-7 w-full max-w-xl">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-raised px-4 py-3 transition-colors ${
          showPanel ? 'border-line-strong' : 'border-line hover:border-line-strong'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" className="shrink-0 text-ink-3">
          <circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>
        </svg>
        <input
          ref={inputRef}
          disabled={!ready}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); ensureIndex(); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0))); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active].doc); }
            if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
          }}
          placeholder={t('searchPlaceholder', locale)}
          aria-label={t('searchPlaceholder', locale)}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? 'hero-search-results' : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
        />
        <kbd className="ml-auto shrink-0 rounded border border-line px-1.5 text-xs text-ink-3">⌘K</kbd>
      </div>

      {showPanel && (
        <div
          id="hero-search-results"
          role="listbox"
          aria-label={t('searchTitle', locale)}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-line bg-raised p-2 text-left shadow-2xl"
        >
          {loadingIndex && (
            <p className="px-3 py-3 text-sm text-ink-3" role="status" aria-live="polite">
              {locale === 'zh' ? '正在加载搜索索引…' : 'Loading search index…'}
            </p>
          )}
          {loadError && !loadingIndex && (
            <div className="px-3 py-4 text-center" role="alert">
              <p className="text-sm text-ink-3">
                {locale === 'zh' ? '搜索索引加载失败，请检查网络后重试' : 'Could not load the search index. Check your connection and retry.'}
              </p>
              <button
                type="button"
                onClick={() => { ensureIndex(); inputRef.current?.focus(); }}
                className="mt-3 rounded-full border border-line px-3 py-1 text-xs text-ink-2 hover:border-accent hover:text-accent"
              >
                {locale === 'zh' ? '重试' : 'Retry'}
              </button>
            </div>
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
                    type="button"
                    onClick={() => { setQuery(s); inputRef.current?.focus(); }}
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
                    type="button"
                    id={`hero-opt-${r.doc.id}`}
                    role="option"
                    aria-selected={i === active}
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
          {!loadingIndex && !empty && !loadError && (
            <div className="border-t border-line px-3 py-2 text-[11px] text-ink-3">
              ↑↓ {locale === 'zh' ? '选择' : 'navigate'} · ↵ {locale === 'zh' ? '打开' : 'open'} · esc {locale === 'zh' ? '关闭' : 'close'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
