import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** 从 demo 根节点读取播放器写入的 --demo-speed（1 = 常速，3 = 慢速）。 */
function readSpeed(el: HTMLElement | null) {
  if (!el) return 1;
  return parseFloat(getComputedStyle(el).getPropertyValue('--demo-speed')) || 1;
}

function useCountUp(
  target: number,
  root: React.RefObject<HTMLDivElement | null>,
  duration = 1600,
  formatted = true
) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const speed = readSpeed(root.current);
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * speed), 1);
      setValue(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, formatted, root]);
  return formatted ? Math.round(value).toLocaleString() : Math.round(value).toString();
}

const NumberCounterDemo: DemoComponent = ({ mode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const kpi = useCountUp(128560, ref, 1600);
  const rate = useCountUp(98, ref, 1300);
  const raw = useCountUp(42310, ref, 1600, false);

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
      <p className="text-xs text-ink-3">ease-out 减速落定；等宽数字防宽度抖动</p>
    </div>
  );
};

export default NumberCounterDemo;
