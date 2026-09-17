import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const MagneticButtonDemo: DemoComponent = ({ mode }) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const area = areaRef.current;
    const btn = btnRef.current;
    if (!area || !btn) return;
    const b = btn.getBoundingClientRect();
    const dx = e.clientX - (b.left + b.width / 2);
    const dy = e.clientY - (b.top + b.height / 2);
    const dist = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - dist / 140);
    setPos({ x: dx * 0.35 * pull, y: dy * 0.35 * pull });
    setInside(true);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={areaRef}
        onMouseMove={onMove}
        onMouseLeave={() => { setPos({ x: 0, y: 0 }); setInside(false); }}
        className="flex h-40 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-line"
      >
        <button
          ref={btnRef}
          className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-transform"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: inside ? 'transform 80ms ease-out' : 'transform 400ms cubic-bezier(.2,.8,.3,1.2)',
          }}
        >
          被磁吸的按钮 / Magnetic
        </button>
      </div>
      <p className="text-xs text-ink-3">🖱 在虚线区域内移动鼠标，按钮会被"吸"过去 / Move your cursor inside</p>
      {mode === 'variants' && <p className="text-[11px] text-ink-3">变体：拉力系数 0.2～0.5、作用半径 100～180px、回弹曲线弹性 1.1～1.3</p>}
    </div>
  );
};

export default MagneticButtonDemo;
