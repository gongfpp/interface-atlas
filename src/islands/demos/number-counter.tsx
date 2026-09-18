import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, run: number, duration = 1600, formatted = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const speed = (() => {
      const el = document.querySelector('[data-demo-root]');
      if (!el) return 1;
      return parseFloat(getComputedStyle(el).getPropertyValue('--demo-speed')) || 1;
    })();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * speed), 1);
      setValue(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration, formatted]);
  return formatted ? Math.round(value).toLocaleString() : Math.round(value).toString();
}

const NumberCounterDemo: DemoComponent = ({ mode }) => {
  const [run, setRun] = useState(0);
  const kpi = useCountUp(128560, run, 1600);
  const rate = useCountUp(98, run, 1300);
  const raw = useCountUp(42310, run, 1600, false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-end justify-center gap-10">
        <div className="text-center">
          <p className="font-mono text-3xl font-bold text-ink tabular-nums">{kpi}</p>
          <p className="mt-1 text-[10px] text-ink-3">总下载量 / Downloads</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-accent tabular-nums">{rate}%</p>
          <p className="mt-1 text-[10px] text-ink-3">好评率 / Satisfaction</p>
        </div>
        {mode === 'variants' && (
          <div className="text-center">
            <p className="font-mono text-2xl font-bold text-ink-2 tabular-nums">{raw}</p>
            <p className="mt-1 text-[10px] text-ink-3">无千分位 / Raw digits</p>
          </div>
        )}
      </div>
      <button
        onClick={() => setRun((r) => r + 1)}
        className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
      >
        重播 / Replay
      </button>
      <p className="text-xs text-ink-3">ease-out 减速落定；等宽数字防宽度抖动</p>
    </div>
  );
};

export default NumberCounterDemo;
