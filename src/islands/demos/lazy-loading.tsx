import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type ItemState = 'pending' | 'loaded';

const COLORS = [
  'from-sky-400/70 to-indigo-500/70',
  'from-amber-400/70 to-rose-500/70',
  'from-emerald-400/70 to-teal-500/70',
  'from-fuchsia-400/70 to-purple-500/70',
  'from-cyan-400/70 to-blue-500/70',
  'from-orange-400/70 to-red-500/70',
];

function LazyCard({ index, loaded }: { index: number; loaded: boolean }) {
  return (
    <div
      className="relative h-16 overflow-hidden rounded-md border border-line bg-raised"
      style={{ aspectRatio: '5 / 2' }}
    >
      {loaded ? (
        <div
          className={`flex h-full items-center justify-center bg-gradient-to-br text-[10px] font-medium text-white ${COLORS[index % COLORS.length]}`}
          style={{ animation: `lazy-reveal calc(0.5s * var(--demo-speed, 1)) ease-out both` }}
        >
          图片 #{index + 1} 已加载 · Loaded
        </div>
      ) : (
        <div
          className="flex h-full items-center justify-center text-[10px] text-ink-3"
          style={{ animation: `lazy-pulse calc(1.6s * var(--demo-speed, 1)) ease-in-out infinite` }}
        >
          占位 · Pending
        </div>
      )}
    </div>
  );
}

function LazyList({ simulate, keySeed }: { simulate: boolean; keySeed: number }) {
  const [states, setStates] = useState<ItemState[]>(() => Array(6).fill('pending'));
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setStates(Array(6).fill('pending'));
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          setStates((prev) => {
            if (prev[idx] === 'loaded') return prev;
            const next = [...prev];
            next[idx] = 'loaded';
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { root, rootMargin: '0px 0px 12% 0px', threshold: 0.2 },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [keySeed]);

  // 模拟进入视口：把前两个未加载项直接标记为 loaded
  useEffect(() => {
    if (!simulate) return;
    setStates((prev) => {
      const next = [...prev];
      const first = next.indexOf('pending');
      if (first !== -1) next[first] = 'loaded';
      return next;
    });
  }, [simulate]);

  return (
    <div
      ref={rootRef}
      className="h-56 w-full space-y-2 overflow-y-auto rounded-md border border-line bg-code-bg p-2"
    >
      {states.map((state, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          data-index={i}
          data-anatomy={i === 0 ? '2' : undefined}
        >
          <LazyCard index={i} loaded={state === 'loaded'} />
        </div>
      ))}
    </div>
  );
}

const LazyLoadingDemo: DemoComponent = ({ mode }) => {
  const [simulate, setSimulate] = useState(false);
  const [keySeed, setKeySeed] = useState(0);

  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'native', zh: '原生 loading="lazy"', en: 'One attribute, zero JS', note: '交给浏览器判断时机' },
          { id: 'observer', zh: 'IntersectionObserver', en: 'Observer-driven', note: '自定义提前量与动画' },
          { id: 'placeholder', zh: '占位渐进', en: 'Placeholder first', note: '缩略图/纯色块先行' },
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
      <div className="mb-2 flex items-center justify-between text-[10px] text-ink-3">
        <span data-anatomy="1">向下滚动或点右侧按钮，卡片进入视口才加载</span>
        <button
          onClick={() => {
            setSimulate(false);
            requestAnimationFrame(() => setSimulate(true));
          }}
          className="shrink-0 rounded border border-line bg-raised px-2 py-1 text-[10px] transition-colors hover:border-accent hover:text-accent"
        >
          模拟进入视口
        </button>
      </div>
      <LazyList key={keySeed} simulate={simulate} keySeed={keySeed} />
      <button
        onClick={() => {
          setKeySeed((k) => k + 1);
          setSimulate(false);
        }}
        className="mt-2 w-full rounded border border-line bg-raised px-2 py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
      >
        重置演示 · Reset
      </button>
      <style>{`
        @keyframes lazy-reveal { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        @keyframes lazy-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.45 } }
      `}</style>
    </div>
  );
};

export default LazyLoadingDemo;
