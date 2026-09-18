import { useEffect, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ToastSlideInDemo: DemoComponent = ({ mode }) => {
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0);
  const topRight = mode === 'variants';

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [visible, run]);

  const fire = () => {
    setRun((r) => r + 1);
    setVisible(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-line bg-paper">
        <div className="flex h-full items-center justify-center">
          <button
            onClick={fire}
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
          >
            保存 / Save
          </button>
        </div>
        <div
          key={run}
          className="absolute flex items-center gap-3 rounded-lg bg-ink px-4 py-2.5 shadow-lg"
          style={{
            ...(topRight ? { top: 10, right: 10 } : { bottom: 10, left: '50%' }),
            transform: visible
              ? topRight
                ? 'translate(0, 0)'
                : 'translate(-50%, 0)'
              : topRight
                ? 'translate(120%, 0)'
                : 'translate(-50%, 200%)',
            opacity: visible ? 1 : 0,
            transition:
              'transform calc(0.22s * var(--demo-speed, 1)) cubic-bezier(0.22, 1, 0.36, 1), opacity calc(0.22s * var(--demo-speed, 1)) ease-out',
          }}
        >
          <span className="text-xs text-white">已保存 ✓ 3 秒后自动消失</span>
          <button className="text-xs font-semibold text-accent">撤销</button>
        </div>
      </div>
      <button
        onClick={fire}
        className="text-[11px] text-ink-3 underline decoration-line underline-offset-2 hover:text-ink"
      >
        重播 / Replay
      </button>
      <p className="text-xs text-ink-3">滑入 → 停留 3.2s → 反向滑出；从哪边来回哪边去</p>
    </div>
  );
};

export default ToastSlideInDemo;
