import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearch, type SearchDoc } from '@/lib/use-search';
import { groupResults, indexById, SEARCH_SUGGESTIONS, TYPE_LABEL } from '@/lib/search-meta';
import { localePath } from '@/lib/i18n';
import { trackSearchResult } from '@/lib/track';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function SearchDialog({ locale, autoOpen = false }: { locale: 'zh' | 'en'; autoOpen?: boolean }) {
  // /search?q=xxx 落地页：初始即打开并预填
  // SSR 预渲染无 window，守卫后回退到默认值
  const initialQuery =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : null;
  const [open, setOpen] = useState(() => autoOpen || Boolean(initialQuery));
  const { query, setQuery, results, active, setActive, loadingIndex, loadError, ensureIndex } = useSearch(initialQuery ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const en = locale === 'en';
  const close = useCallback(() => {
    setOpen(false);
    const trigger = document.getElementById('search-open');
    if (trigger instanceof HTMLElement) trigger.focus();
  }, []);

  // 首次打开时懒加载索引
  useEffect(() => {
    if (open) ensureIndex();
  }, [open, ensureIndex]);

  useEffect(() => {
    const onOpen = () => {
      delete document.documentElement.dataset.searchRequested;
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
      if (e.key === 'Escape' && open) close();
    };
    window.addEventListener('ia:search-open', onOpen);
    if (document.documentElement.dataset.searchRequested === 'true') onOpen();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('ia:search-open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [ensureIndex, close, open]);

  // 模态打开时锁定页面滚动，并在卸载时恢复
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const grouped = useMemo(() => groupResults(results), [results]);
  const indexMap = useMemo(() => indexById(results), [results]);

  const go = (doc: SearchDoc) => {
    trackSearchResult(doc.type, doc.id, (indexMap.get(`${doc.type}/${doc.id}`) ?? 0) + 1, 'search-dialog');
    window.location.href = localePath(`/${doc.type}/${doc.id}`, locale);
  };

  // Tab 焦点陷阱：把焦点限制在对话框内（aria-modal 的前提）
  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey && activeEl === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const empty = !loadingIndex && !loadError && results.length === 0 && Boolean(query);
  const statusText = loadingIndex
    ? en
      ? 'Loading search index…'
      : '正在加载搜索索引…'
    : empty
      ? en
        ? 'Nothing found — try rephrasing'
        : '没有找到，换个说法试试'
      : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      onKeyDown={onDialogKeyDown}
      ref={dialogRef}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="search-dialog-title" className="sr-only">
          {en ? 'Search the atlas' : '搜索界面图谱'}
        </h2>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0))); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === 'Enter' && results[active]) go(results[active].doc);
          }}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={results[active] ? `search-option-${active}` : undefined}
          aria-label={en ? 'Search components, pages, styles, interactions' : '搜索组件、页面、设计风格、交互效果'}
          placeholder={locale === 'zh'
            ? '搜索组件、页面、设计风格、交互效果……'
            : 'Search components, pages, styles, interactions…'}
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-base outline-none placeholder:text-ink-3"
          autoFocus
        />
        <p role="status" aria-live="polite" className={statusText ? 'px-4 py-2 text-sm text-ink-3' : 'sr-only'}>
          {statusText}
        </p>
        <div id="search-listbox" role="listbox" aria-label={en ? 'Search results' : '搜索结果'} className="max-h-[50vh] overflow-y-auto p-2">
          {loadError && !loadingIndex && (
            <div className="px-3 py-6 text-center" role="alert">
              <p className="text-sm text-ink-3">
                {en ? 'Could not load the search index. Check your connection and retry.' : '搜索索引加载失败，请检查网络后重试。'}
              </p>
              <button
                type="button"
                onClick={() => ensureIndex()}
                className="mt-3 rounded-full border border-line px-3 py-1 text-xs text-ink-2 hover:border-accent hover:text-accent"
              >
                {en ? 'Retry' : '重试'}
              </button>
            </div>
          )}
          {empty && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-ink-3">
                {en ? 'Nothing found — try rephrasing' : '没有找到，换个说法试试'}
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
            <div key={type} role="group" aria-label={TYPE_LABEL[type]?.[locale] ?? type} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-ink-3">
                {TYPE_LABEL[type]?.[locale] ?? type}
              </p>
              {items.map((r) => {
                const i = indexMap.get(`${r.doc.type}/${r.doc.id}`) ?? 0;
                return (
                  <button
                    key={r.doc.id}
                    id={`search-option-${i}`}
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
        </div>
        <div className="border-t border-line px-4 py-2 text-[11px] text-ink-3">
          ↑↓ {locale === 'zh' ? '选择' : 'navigate'} · ↵ {locale === 'zh' ? '打开' : 'open'} · esc {locale === 'zh' ? '关闭' : 'close'}
        </div>
      </div>
    </div>
  );
}
