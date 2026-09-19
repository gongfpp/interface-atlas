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
  score: number;
  kw: number;
}

interface IndexPayload {
  docs: SearchDoc[];
  vectors: number[][] | null;
  model: string | null;
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

// 索引懒加载并跨实例复用（顶部弹窗与首页内联搜索共享同一次 fetch）
let indexPromise: Promise<IndexPayload> | null = null;
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(withBase('/data/search-index.json'))
      .then((r) => r.json())
      .catch(() => ({ docs: [], vectors: null, model: null }));
  }
  return indexPromise;
}

/**
 * 搜索数据层（PRD §9）：关键词命中 + 弱命中时懒加载本地 embedding 重排。
 * 只负责查询与结果状态，弹窗 / 内联两种展示形态各自管理自己的可见性。
 */
export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<IndexPayload | null>(null);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [loadingModel, setLoadingModel] = useState(false);
  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 首次交互（打开弹窗 / 聚焦内联框）时才加载 832K 索引
  const ensureIndex = useCallback(() => {
    loadIndex().then((idx) => setIndex((cur) => cur ?? idx));
  }, []);

  const runSearch = useCallback(async (q: string, idx: IndexPayload) => {
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
  }, []);

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

  return { query, setQuery, results, active, setActive, loadingModel, loadingIndex: !index, ensureIndex };
}
