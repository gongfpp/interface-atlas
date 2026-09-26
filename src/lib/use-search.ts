import { useCallback, useEffect, useRef, useState } from 'react';
import { search } from '@/lib/search-core.mjs';
import { withBase } from '@/lib/i18n';
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

export interface SearchHit {
  doc: SearchDoc;
  kw: number;
}

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

// 关键词索引（~80KB）：首次交互即加载。
// 失败时释放缓存 Promise，让重试可以真正重新请求，而不是永久返回空结果。
let docsPromise: Promise<SearchDoc[]> | null = null;
function loadDocs() {
  if (!docsPromise) {
    docsPromise = fetch(withBase('/data/search-docs.json'))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((p: { docs?: SearchDoc[] }) => (Array.isArray(p?.docs) ? p.docs : []))
      .catch((err) => {
        docsPromise = null;
        throw err;
      });
  }
  return docsPromise;
}

/**
 * 搜索数据层（PRD §9）：关键词/别名加权匹配。
 * 只负责查询与结果状态，弹窗 / 内联两种展示形态各自管理自己的可见性。
 */
export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ensureIndex = useCallback(() => {
    return loadDocs()
      .then((d) => {
        setLoadError(false);
        setDocs((cur) => cur ?? d);
      })
      .catch(() => {
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    if (!docs) return;
    // 延迟到下一个宏任务执行搜索，避免 effect 内同步 setState 触发级联渲染
    const t = setTimeout(() => {
      // 只保留真正命中的条目，避免零分结果刷屏
      const scored = search(query, docs) as SearchHit[];
      setResults(scored.filter((h) => h.kw > 0).slice(0, 12));
      setActive(0);
    }, 0);
    return () => clearTimeout(t);
  }, [query, docs]);

  // 查询日志回流（PRD §9.3）：只记录无结果 / 弱命中查询，防止把强命中原文全部入库
  useEffect(() => {
    if (!query.trim() || !docs) return;
    const top = results[0];
    const weak = !top || top.kw < 30;
    if (!weak) return;
    track('search-miss', { results: results.length });
    if (logTimer.current) clearTimeout(logTimer.current);
    logTimer.current = setTimeout(() => logSearch(query), 900);
    return () => {
      if (logTimer.current) clearTimeout(logTimer.current);
    };
  }, [query, results, docs]);

  return { query, setQuery, results, active, setActive, loadingIndex: !docs && !loadError, loadError, ensureIndex };
}
