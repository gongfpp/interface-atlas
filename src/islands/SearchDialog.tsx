import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { search } from '@/lib/search-core.mjs';
import { localePath, withBase } from '@/lib/i18n';
import { beacon, track } from '@/lib/track';

export interface SearchDoc {
  id: string;
  type: string;
  name: { zh: string; en: string };
  aliases: string[];
  tags: string[];
  category: string[];
  text: { zh: string; en: string };
}

interface IndexPayload {
  docs: SearchDoc[];
  vectors: number[][] | null;
  model: string | null;
}

const TYPE_ORDER = ['styles', 'components', 'patterns', 'motion', 'pages', 'gallery'];
const TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  styles: { zh: '风格', en: 'Styles' },
  components: { zh: '组件', en: 'Components' },
  patterns: { zh: '交互模式', en: 'Patterns' },
  motion: { zh: '动效', en: 'Motion' },
  pages: { zh: '页面', en: 'Pages' },
  gallery: { zh: '灵感图库', en: 'Gallery' },
};

/** PII 清洗：去除邮箱、连续数字（手机号/单号等），截断到 120 字符 */
function scrubQuery(q: string) {
  return q
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
    .replace(/\d{6,}/g, '[digits]')
    .slice(0, 120);
}

function logSearch(q: string) {
  const cleaned = scrubQuery(q).trim();
  if (!cleaned) return;
  beacon('/api/log-search', { q: cleaned });
}

export default function SearchDialog({ locale }: { locale: 'zh' | 'en' }) {
  // /search?q=xxx 落地页：初始即打开并预填（lazy initializer，避免 effect 内同步 setState）
  // SSR 预渲染无 window，守卫后回退到默认值
  const initialQuery =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : null;
  const [open, setOpen] = useState(() => Boolean(initialQuery));
  const [query, setQuery] = useState(() => initialQuery ?? '');
  const [index, setIndex] = useState<IndexPayload | null>(null);
  const [results, setResults] = useState<Array<{ doc: SearchDoc; score: number; kw: number }>>([]);
  const [active, setActive] = useState(0);
  const [loadingModel, setLoadingModel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 首次打开时懒加载索引
  useEffect(() => {
    if (!open || index) return;
    fetch(withBase('/data/search-index.json'))
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex({ docs: [], vectors: null, model: null }));
  }, [open, index]);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
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
  }, []);

  const runSearch = useCallback(
    async (q: string, idx: IndexPayload) => {
      const kwScored = search(q, idx.docs, null, null);
      let scored = kwScored;

      // 关键词层弱命中时，懒加载本地模型做 embedding 重排（PRD §9 增强层）
      const weak = !kwScored[0] || kwScored[0].kw < 30;
      if (weak && idx.vectors && idx.model && q.trim().length >= 2) {
        try {
          setLoadingModel(true);
          const { pipeline } = await import('@huggingface/transformers');
          const extractor = await pipeline('feature-extraction', idx.model, { dtype: 'q8' });
          const out = await extractor(`query: ${q}`, { pooling: 'mean', normalize: true });
          const qv = Array.from(out.data as Float32Array);
          scored = search(q, idx.docs, idx.vectors, qv);
        } catch {
          scored = kwScored;
        } finally {
          setLoadingModel(false);
        }
      }
      setResults(scored.slice(0, 12));
      setActive(0);
    },
    [],
  );

  useEffect(() => {
    if (!index) return;
    // 延迟到下一个宏任务执行搜索，避免 effect 内同步 setState 触发级联渲染
    const t = setTimeout(() => runSearch(query, index), 0);
    return () => clearTimeout(t);
  }, [query, index, runSearch]);

  // 查询日志回流（PRD §9.3）：只记录无结果 / 弱命中查询，防止把强命中原文全部入库
  useEffect(() => {
    if (!query.trim() || loadingModel) return;
    const top = results[0];
    const weak = !top || top.kw < 30;
    if (!weak) return;
    track('search-miss', { results: results.length });
    if (logTimer.current) clearTimeout(logTimer.current);
    logTimer.current = setTimeout(() => logSearch(query), 900);
    return () => {
      if (logTimer.current) clearTimeout(logTimer.current);
    };
  }, [query, results, loadingModel]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Array<{ doc: SearchDoc; score: number; kw: number }>>();
    for (const r of results) {
      const list = groups.get(r.doc.type) ?? [];
      list.push(r);
      groups.set(r.doc.type, list);
    }
    return [...groups.entries()].sort(
      (a, b) => TYPE_ORDER.indexOf(a[0]) - TYPE_ORDER.indexOf(b[0]),
    );
  }, [results]);

  // 扁平列表 + id→全局下标映射（避免渲染期可变计数器）
  const { flat, indexById } = useMemo(() => {
    const flatItems: Array<{ doc: SearchDoc; score: number; kw: number }> = [];
    const idxMap = new Map<string, number>();
    for (const r of results) {
      idxMap.set(r.doc.id, flatItems.length);
      flatItems.push(r);
    }
    return { flat: flatItems, indexById: idxMap };
  }, [results]);

  const go = (doc: SearchDoc) => {
    window.location.href = localePath(`/${doc.type}/${doc.id}`, locale);
  };

  if (!open) return null;

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
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === 'Enter' && flat[active]) go(flat[active].doc);
          }}
          placeholder={locale === 'zh'
            ? '搜索组件、页面、设计风格、交互效果……'
            : 'Search components, pages, styles, interactions…'}
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-base outline-none placeholder:text-ink-3"
          autoFocus
        />
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loadingModel && (
            <p className="px-3 py-2 text-xs text-ink-3">
              {locale === 'zh' ? '正在加载语义检索模型…' : 'Loading semantic model…'}
            </p>
          )}
          {!loadingModel && flat.length === 0 && query && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-ink-3">
                {locale === 'zh' ? '没有找到，换个说法试试' : 'Nothing found — try rephrasing'}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {(locale === 'zh'
                  ? ['加载灰色一闪一闪', 'Mac 那种快捷搜索框', '卡片鼠标放上去浮起来', '左边有菜单的后台', '毛玻璃']
                  : ['grey shimmering while loading', 'Mac-style quick search', 'card lifts on hover', 'admin menu on the left', 'frosted glass']
                ).map((s) => (
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
                const i = indexById.get(r.doc.id) ?? 0;
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
