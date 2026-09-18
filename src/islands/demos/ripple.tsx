import { useState, type PointerEvent } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Wave {
  id: number;
  x: number;
  y: number;
}

const base =
  'relative overflow-hidden select-none rounded-xl px-6 py-3 text-sm font-medium text-white shadow-md';

const RippleDemo: DemoComponent = ({ mode }) => {
  const [waves, setWaves] = useState<Record<string, Wave[]>>({});

  const spawn = (key: string) => (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const wave = { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setWaves((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), wave] }));
    setTimeout(() => {
      setWaves((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((w) => w.id !== wave.id) }));
    }, 700);
  };

  const renderWaves = (key: string, size: number) =>
    (waves[key] ?? []).map((w) => (
      <span
        key={w.id}
        className="ripple-wave pointer-events-none absolute rounded-full bg-white/40"
        style={{ left: w.x, top: w.y, width: size, height: size }}
      />
    ));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button onPointerDown={spawn('a')} className={`${base} bg-accent`}>
          按下试试 / Press me
          {renderWaves('a', 220)}
        </button>
        <button onPointerDown={spawn('b')} className={`${base} bg-ink`}>
          Secondary
          {renderWaves('b', 220)}
        </button>
      </div>
      {mode === 'variants' && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['List item 1', 'List item 2', 'List item 3'].map((label, i) => (
            <button
              key={label}
              onPointerDown={spawn(`l${i}`)}
              className="relative overflow-hidden rounded-lg border border-line bg-raised px-4 py-2 text-xs text-ink"
            >
              {label}
              {renderWaves(`l${i}`, 160)}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-ink-3">波纹从真实触点扩散，400ms 放大渐隐；点哪儿哪儿起波</p>
      <style>{`@keyframes ripple-expand { from { transform: translate(-50%, -50%) scale(0); opacity: 0.6 } to { transform: translate(-50%, -50%) scale(1); opacity: 0 } }
.ripple-wave { animation: ripple-expand calc(0.55s * var(--demo-speed, 1)) ease-out forwards; }`}</style>
    </div>
  );
};

export default RippleDemo;
