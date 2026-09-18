import { useLayoutEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ITEMS = [
  { id: 1, title: '极简主义', emoji: '◻️', tone: 'bg-accent-soft' },
  { id: 2, title: '包豪斯', emoji: '🔺', tone: 'bg-raised' },
  { id: 3, title: '玻璃拟态', emoji: '🧊', tone: 'bg-paper' },
  { id: 4, title: '新粗野', emoji: '⬛', tone: 'bg-raised' },
];

const SharedElementTransitionDemo: DemoComponent = ({ mode }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const detailRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (selected == null || !detailRef.current) return;
    const card = cardRefs.current[selected];
    const detail = detailRef.current;
    if (!card) return;
    const first = card.getBoundingClientRect();
    const last = detail.getBoundingClientRect();
    const dx = first.left + first.width / 2 - (last.left + last.width / 2);
    const dy = first.top + first.height / 2 - (last.top + last.height / 2);
    const s = first.width / last.width;
    const speed = parseFloat(getComputedStyle(detail).getPropertyValue('--demo-speed')) || 1;
    const anim = detail.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${s})`, borderRadius: '12px' },
        { transform: 'translate(0, 0) scale(1)', borderRadius: '12px' },
      ],
      { duration: 350 * speed, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
    return () => {
      anim.cancel();
    };
  }, [selected]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative w-full max-w-md">
        <div className="grid grid-cols-2 gap-2.5">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              ref={(el) => {
                cardRefs.current[item.id] = el;
              }}
              onClick={() => setSelected(item.id)}
              className={`flex items-center gap-2 rounded-xl border border-line p-3 text-left shadow-sm transition-transform active:scale-95 ${item.tone}`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-medium text-ink">{item.title}</span>
            </button>
          ))}
        </div>

        {selected != null && (
          <div className="absolute inset-0 z-10 rounded-xl bg-paper p-4 shadow-lg" ref={detailRef}>
            <button
              onClick={() => setSelected(null)}
              className="text-[10px] text-ink-3 hover:text-ink"
            >
              ← 收回 / Close
            </button>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{ITEMS.find((i) => i.id === selected)?.emoji}</span>
              <p className="text-sm font-bold text-ink">{ITEMS.find((i) => i.id === selected)?.title}</p>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-full rounded bg-ink-3/20" />
              <div className="h-2 w-5/6 rounded bg-ink-3/20" />
              <div className="h-2 w-3/6 rounded bg-ink-3/20" />
            </div>
            <p className="mt-3 text-[10px] text-ink-3">卡片连续放大为详情容器（FLIP 350ms）</p>
          </div>
        )}
      </div>
      <p className="text-xs text-ink-3">
        {mode === 'variants' ? '关闭时反向缩回原位，原路返回' : '点卡片 → 飞入详情；点收回 → 飞回列表'}
      </p>
    </div>
  );
};

export default SharedElementTransitionDemo;
