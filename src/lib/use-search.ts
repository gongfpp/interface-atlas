import { useCallback, useEffect, useRef, useState } from 'react';
import { search } from '@/lib/search-core.mjs';
import { decodeVectors } from '@/lib/vector-codec.mjs';
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

interface VectorsPayload {
  model: string | null;
  count: number;
  dim: number;
  data: string;
}

type Extractor = (text: string, opts: Record<string, unknown>) => Promise<{ data: Float32Array }>;

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

// 关键词层（~58KB）：首次交互即加载，先出结果
let docsPromise: Promise<SearchDoc[]> | null = null;
function loadDocs() {
  if (!docsPromise) {
    docsPromise = fetch(withBase('/data/search-docs.json'))
      .then((r) => r.json())
      .then((p: { docs?: SearchDoc[] }) => p.docs ?? [])
      .catch(() => []);
  }
  return docsPromise;
}

// 向量层（base64 float32）：只在关键词弱命中时才加载
let vectorsPromise: Promise<{ vectors: number[][] | null; model: string | null }> | null = null;
function loadVectors() {
  if (!vectorsPromise) {
    vectorsPromise = fetch(withBase('/data/search-vectors.json'))
      .then((r) => r.json())
      .then((p: VectorsPayload) =>
        p.model && p.count ? { model: p.model, vectors: decodeVectors(p) } : { model: null, vectors: null },
      )
      .catch(() => ({ model: null, vectors: null }));
  }
  return vectorsPromise;
}

// 模型 pipeline 初始化较重，跨查询/跨实例只做一次
let extractorPromise: Promise<Extractor> | null = null;
function loadExtractor(model: string): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = import('@huggingface/transformers').then(
      ({ pipeline }) =>
        pipeline('feature-extraction', model, { dtype: 'q8' }) as unknown as Extractor,
    );
  }
  return extractorPromise;
}

/**
 * 搜索数据层（PRD §9）：渐进式两段结果。
 * 1. 关键词层就绪后立即给结果（同步、无模型）；
 * 2. 仅当关键词弱命中时，后台加载向量 + 本地 embedding 模型重排，完成后原地升级结果。
 */
export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [loadingModel, setLoadingModel] = useState(false);
  const reqId = useRef(0);
  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ensureIndex = useCallback(() => {
    loadDocs().then((d) => setDocs((cur) => cur ?? d));
  }, []);

  const runSearch = useCallback(async (q: string, list: SearchDoc[]) => {
    const id = ++reqId.current;

    // 第一段：关键词结果立即展示（只保留真正命中的条目，避免无关结果刷屏）
    const kwScored = search(q, list, null, null).filter((h: SearchHit) => h.kw > 0);
    setResults(kwScored.slice(0, 12));
    setActive(0);

    // 第二段：弱命中才做语义重排，结果后续原地替换
    const weak = !kwScored[0] || kwScored[0].kw < 30;
    if (!weak || q.trim().length < 2) {
      setLoadingModel(false);
      return;
    }

    setLoadingModel(true);
    try {
      const { vectors, model } = await loadVectors();
      if (reqId.current !== id || !vectors || !model) return;
      const extractor = await loadExtractor(model);
      if (reqId.current !== id) return;
      const out = await extractor(`query: ${q}`, { pooling: 'mean', normalize: true });
      if (reqId.current !== id) return;
      setResults(search(q, list, vectors, Array.from(out.data)).slice(0, 12));
      setActive(0);
    } catch {
      /* 语义层不可用时保留已展示的关键词结果 */
    } finally {
      if (reqId.current === id) setLoadingModel(false);
    }
  }, []);

  useEffect(() => {
    if (!docs) return;
    // 延迟到下一个宏任务执行搜索，避免 effect 内同步 setState 触发级联渲染
    const t = setTimeout(() => runSearch(query, docs), 0);
    return () => clearTimeout(t);
  }, [query, docs, runSearch]);

  // 查询日志回流（PRD §9.3）：只记录无结果 / 弱命中查询，防止把强命中原文全部入库
  useEffect(() => {
    if (!query.trim() || loadingModel || !docs) return;
    const top = results[0];
    const weak = !top || top.kw < 30;
    if (!weak) return;
    track('search-miss', { results: results.length });
    if (logTimer.current) clearTimeout(logTimer.current);
    logTimer.current = setTimeout(() => logSearch(query), 900);
    return () => {
      if (logTimer.current) clearTimeout(logTimer.current);
    };
  }, [query, results, loadingModel, docs]);

  return { query, setQuery, results, active, setActive, loadingModel, loadingIndex: !docs, ensureIndex };
}
