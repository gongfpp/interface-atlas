import { useCallback, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const PAGE_SIZE = 5;
const TOTAL_PAGES = 4;

interface Item {
  id: string;
  title: string;
  excerpt: string;
}

function makePage(page: number): Item[] {
  return Array.from({ length: PAGE_SIZE }, (_, i) => {
    const n = (page - 1) * PAGE_SIZE + i + 1;
    return {
      id: `item-${n}`,
      title: `条目 ${n}`,
      excerpt: `第 ${page} 页 · 第 ${i + 1} 条，滚动到底自动追加`,
    };
  });
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 rounded-full border-2 border-line-strong border-t-transparent align-[-2px]"
      style={{
        borderTopColor: 'var(--color-accent, currentColor)',
        animation: `demo-spin calc(0.8s * var(--demo-speed, 1)) linear infinite`,
      }}
    />
  );
}

function Row({ item }: { item: Item }) {
  return (
    <div className="border-b border-line/60 py-2 last:border-b-0">
      <div className="text-xs font-medium">{item.title}</div>
      <div className="mt-0.5 text-[10px] text-ink-3">{item.excerpt}</div>
    </div>
  );
}

const InfiniteScrollDemo: DemoComponent = ({ mode }) => {
  const [items, setItems] = useState<Item[]>(() => makePage(1));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const done = page >= TOTAL_PAGES;
  const busyRef = useRef(false);
  const runRef = useRef(0);

  const loadMore = useCallback(() => {
    const run = runRef.current;
    if (busyRef.current || page >= TOTAL_PAGES) return;
    busyRef.current = true;
    setLoading(true);
    setTimeout(() => {
      if (runRef.current !== run) return;
      setItems((prev) => [...prev, ...makePage(page + 1)]);
      setPage((p) => p + 1);
      setLoading(false);
      busyRef.current = false;
    }, 900);
  }, [page]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) loadMore();
  };

  const reset = () => {
    runRef.current += 1;
    busyRef.current = false;
    setItems(makePage(1));
    setPage(1);
    setLoading(false);
  };

  if (mode === 'variants') {
    return (
      <div className="grid gap-4 text-left md:grid-cols-2">
        <div className="rounded-lg border border-line bg-raised p-3">
          <div className="mb-1 text-xs font-medium">到底提示 · End notice</div>
          <div className="max-h-56 overflow-y-auto rounded border border-line/60 px-2">
            {items.map((it) => (
              <Row key={it.id} item={it} />
            ))}
            <div className="py-2.5 text-center text-[10px] text-ink-3">
              {done ? '— 没有更多了 —' : loading ? '加载中… · Loading' : '继续下滑加载更多'}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-raised p-3">
          <div className="mb-1 text-xs font-medium">兜底按钮 · Fallback button</div>
          <div className="max-h-56 overflow-y-auto rounded border border-line/60 px-2">
            {items.map((it) => (
              <Row key={it.id} item={it} />
            ))}
          </div>
          <button
            onClick={loadMore}
            disabled={done || loading}
            className="mt-2 w-full rounded-md border border-line py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {done ? '已全部加载 · All loaded' : loading ? '加载中… · Loading' : '加载更多 · Load more'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium">订阅流 · Feed</span>
        <button
          onClick={reset}
          className="text-[10px] text-ink-3 underline-offset-2 transition-colors hover:text-accent hover:underline"
        >
          重置 · Reset
        </button>
      </div>
      <div
        data-anatomy="1"
        onScroll={onScroll}
        className="h-56 overflow-y-auto overscroll-contain rounded-lg border border-line bg-raised px-3"
      >
        {items.map((it) => (
          <Row key={it.id} item={it} />
        ))}
        <div className="py-3 text-center">
          {loading ? (
            <span data-anatomy="2" className="inline-flex items-center gap-1.5 text-[10px] text-ink-3">
              <Spinner />
              加载中… · Loading
            </span>
          ) : done ? (
            <span data-anatomy="3" className="text-[10px] text-ink-3">
              — 已经到底了 · You've reached the end —
            </span>
          ) : (
            <span className="text-[10px] text-ink-3">继续下滑加载更多 · Keep scrolling</span>
          )}
        </div>
      </div>
      <style>{`@keyframes demo-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default InfiniteScrollDemo;
