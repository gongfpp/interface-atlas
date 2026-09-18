import { useEffect, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const FILTERS = ['按价格', '按评分', '按销量', '只看现货', '包邮', '新品优先'];

const DrawerSlideDemo: DemoComponent = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const bottom = mode === 'variants';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        key={run}
        className="relative h-56 w-full max-w-sm overflow-hidden rounded-xl border border-line bg-paper"
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <p className="text-xs text-ink-3">主页面内容保持可见</p>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
          >
            打开筛选抽屉 →
          </button>
        </div>

        {/* scrim 遮罩 */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/30 transition-opacity"
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transitionDuration: 'calc(0.25s * var(--demo-speed, 1))',
          }}
        />

        {/* drawer 面板 */}
        <div
          className="absolute rounded-xl bg-raised p-3 shadow-xl"
          style={{
            ...(bottom
              ? { left: 8, right: 8, bottom: 8 }
              : { top: 8, bottom: 8, right: 8, width: 150 }),
            transform: open
              ? 'translate(0, 0)'
              : bottom
                ? 'translate(0, 120%)'
                : 'translate(110%, 0)',
            transition: 'transform calc(0.28s * var(--demo-speed, 1)) cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-ink">筛选 / Filters</p>
            <button onClick={() => setOpen(false)} className="text-[10px] text-ink-3 hover:text-ink">
              关闭 ✕
            </button>
          </div>
          <div className="space-y-1.5">
            {FILTERS.slice(0, bottom ? 3 : 5).map((f) => (
              <div key={f} className="rounded-md border border-line bg-paper px-2 py-1.5 text-[11px] text-ink-2">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setRun((r) => r + 1);
          setOpen(false);
        }}
        className="text-[11px] text-ink-3 underline decoration-line underline-offset-2 hover:text-ink"
      >
        重置 / Reset
      </button>
      <p className="text-xs text-ink-3">280ms 材料抽屉曲线；Esc 或遮罩点击关闭；原路滑回</p>
    </div>
  );
};

export default DrawerSlideDemo;
