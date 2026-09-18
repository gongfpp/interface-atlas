import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#EF4444'];

interface Piece {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  color: string;
  size: number;
  delay: number;
}

let seq = 0;

const ConfettiDemo: DemoComponent = ({ mode }) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);

  const burst = (e: MouseEvent<HTMLButtonElement>) => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const originX = mode === 'variants' ? 0.5 : e.clientX - rect.left;
    const originY = mode === 'variants' ? 0 : e.clientY - rect.top;
    const count = mode === 'variants' ? 70 : 42;
    const fresh: Piece[] = Array.from({ length: count }, () => {
      const angle = mode === 'variants' ? Math.PI * (0.1 + Math.random() * 0.8) : Math.PI * (0.15 + Math.random() * 0.7);
      const speed = 90 + Math.random() * 130;
      return {
        id: ++seq,
        x: originX,
        y: originY,
        dx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        dy: mode === 'variants' ? Math.abs(Math.sin(angle)) * speed + 40 : -Math.abs(Math.sin(angle)) * speed - 40,
        rot: (Math.random() - 0.5) * 1080,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 6,
        delay: mode === 'variants' ? Math.random() * 0.4 : 0,
      };
    });
    setPieces((prev) => [...prev, ...fresh]);
    setTimeout(() => {
      const ids = new Set(fresh.map((p) => p.id));
      setPieces((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 2200);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={areaRef}
        className="relative flex h-52 w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-line bg-paper"
      >
        <button
          onClick={burst}
          className="z-10 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-transform active:scale-95"
        >
          🎉 完成任务 / Done
        </button>
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece pointer-events-none absolute rounded-[2px]"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size * 0.6,
              background: p.color,
              animationDelay: `calc(${p.delay}s * var(--demo-speed, 1))`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            } as CSSProperties}
          />
        ))}
      </div>
      <p className="text-xs text-ink-3">一次性爆出，1.5s 抛物线飘落后清理；纸屑不拦截点击</p>
      <style>{`@keyframes confetti-fly { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1 } 100% { transform: translate(var(--dx), calc(var(--dy) + 140px)) rotate(var(--rot)); opacity: 0 } }
.confetti-piece { animation: confetti-fly calc(1.6s * var(--demo-speed, 1)) cubic-bezier(0.15, 0.6, 0.6, 1) both; }`}</style>
    </div>
  );
};

export default ConfettiDemo;
