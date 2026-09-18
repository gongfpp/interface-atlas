import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const LAYERS = [
  { label: '远景 / Far', factor: 0.25, cls: 'text-[10px]', bg: 'bg-accent-soft border-accent/30' },
  { label: '中景 / Mid', factor: 0.55, cls: 'text-[11px]', bg: 'bg-raised border-line' },
  { label: '前景 / Near', factor: 1, cls: 'text-[11px]', bg: 'bg-paper border-line-strong' },
];

const ParallaxDemo: DemoComponent = ({ mode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  const onScroll = () => {
    if (scrollRef.current) setTop(scrollRef.current.scrollTop);
  };

  const jump = (t: number) => {
    scrollRef.current?.scrollTo({ top: t, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative h-52 w-full max-w-sm overflow-y-auto rounded-xl border border-line bg-accent-soft/40"
      >
        {LAYERS.map((layer, i) => (
          <div
            key={layer.label}
            className={`absolute inset-x-6 rounded-lg border px-3 py-2 shadow-sm ${layer.bg}`}
            style={{ top: 24 + i * 78 - top * layer.factor, zIndex: i }}
          >
            <p className={`font-mono font-semibold text-ink-2 ${layer.cls}`}>
              {layer.label} · x{layer.factor}
            </p>
            <p className="mt-0.5 text-[10px] text-ink-3">translateY(scrollY × {layer.factor})</p>
          </div>
        ))}
        <div className="h-[480px] w-full" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => jump(0)}
          className="rounded-full border border-line bg-raised px-4 py-1.5 text-[11px] text-ink-2 hover:text-ink"
        >
          ↑ 回顶 / Top
        </button>
        <button
          onClick={() => jump(260)}
          className="rounded-full bg-accent px-4 py-1.5 text-[11px] font-semibold text-white"
        >
          ↓ 滚动 / Scroll
        </button>
      </div>
      <p className="text-xs text-ink-3">
        {mode === 'variants' ? '三层不同速率：速度差即纵深' : '滚动框内观察各层速度差；也可直接滚动'}
      </p>
    </div>
  );
};

export default ParallaxDemo;
