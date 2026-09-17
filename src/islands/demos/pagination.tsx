import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const PaginationDemo: DemoComponent = ({ mode }) => {
  const [page, setPage] = useState(3);
  const total = 12;
  const pages = (m: number) => {
    const out: Array<number | '…'> = [];
    for (let i = 1; i <= m; i++) {
      if (i === 1 || i === m || Math.abs(i - page) <= 1) out.push(i);
      else if (out[out.length - 1] !== '…') out.push('…');
    }
    return out;
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <nav className="flex items-center gap-1" aria-label="分页演示">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent disabled:opacity-30"
          disabled={page === 1}
        >
          ‹
        </button>
        {pages(total).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 text-xs text-ink-3">…</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                p === page ? 'bg-accent text-white' : 'text-ink-2 hover:bg-code-bg'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => setPage((p) => Math.min(total, p + 1))}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent disabled:opacity-30"
          disabled={page === total}
        >
          ›
        </button>
      </nav>
      {mode === 'variants' && (
        <div className="flex flex-wrap justify-center gap-4 text-xs text-ink-3">
          <span className="rounded-full border border-line px-3 py-1">简洁型：‹ 3/12 ›</span>
          <span className="rounded-full border border-line px-3 py-1">加载更多按钮（与无限滚动混用）</span>
        </div>
      )}
      <p className="text-xs text-ink-3">当前第 {page} / {total} 页 — 位置永远可知、可分享、可回退</p>
    </div>
  );
};

export default PaginationDemo;
