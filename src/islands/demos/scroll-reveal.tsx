import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ScrollRevealDemo: DemoComponent = ({ mode }) => {
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replay = () => {
    setRevealed(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRevealed(true), 120);
  };

  const items = ['标题先浮现', '描述随后跟上', '操作按钮最后出现'];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="w-full max-w-sm space-y-3 rounded-xl border border-line p-4">
        {items.map((text, i) => (
          <div
            key={text}
            className="rounded-lg border border-line bg-raised p-3 transition-all"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(18px)',
              transition: `opacity calc(${0.5 + i * 0.15}s * var(--demo-speed, 1)) ease, transform calc(${0.5 + i * 0.15}s * var(--demo-speed, 1)) ease`,
            }}
          >
            <p className="text-xs font-medium">{text}</p>
          </div>
        ))}
      </div>
      <button onClick={replay} className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white">
        ↻ 模拟滚动进入视口 / Replay
      </button>
      <p className="text-xs text-ink-3">真实场景由 IntersectionObserver 触发，进入视口后逐个显现{mode === 'variants' ? '（变体：fade-up / slide-left / stagger 逐项延迟）' : ''}</p>
    </div>
  );
};

export default ScrollRevealDemo;
