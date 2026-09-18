import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ITEMS = [
  {
    q: '骨架屏要显示多久？',
    a: '只要真实请求未返回就一直保持；但若 300ms 内就返回，跳过骨架屏直接渲染，避免闪烁。',
  },
  {
    q: '动效时长统一用多少？',
    a: '微交互 100～200ms，展开位移类 250～300ms，页面级转场可到 400ms；一律配速度系数便于慢速查看。',
  },
  {
    q: '什么情况不用做动效？',
    a: '高频操作、用户在赶时间的流程、以及 reduced-motion 用户面前——后者的降级不是删动画，是换更安静的反馈。',
  },
];

const AccordionExpandDemo: DemoComponent = ({ mode }) => {
  const [open, setOpen] = useState<number | null>(0);
  const exclusive = mode !== 'variants';

  const toggle = (i: number) => {
    if (exclusive) setOpen((cur) => (cur === i ? null : i));
    else setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md divide-y divide-line rounded-xl border border-line bg-raised">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="px-4 py-1">
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-ink"
              >
                {item.q}
                <span
                  className="chev ml-3 shrink-0 text-ink-3 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▾
                </span>
              </button>
              <div
                className="acc-outer"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="acc-inner">
                  <p className="pb-3 text-xs leading-relaxed text-ink-2">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-ink-3">
        {mode === 'variants' ? '多开模式：各项独立开合' : '互斥手风琴：一次只开一项，再点收起'}
      </p>
      <style>{`@keyframes acc-none { from { opacity: 0 } to { opacity: 1 } }
.acc-outer { display: grid; transition: grid-template-rows calc(0.3s * var(--demo-speed, 1)) cubic-bezier(0.22, 1, 0.36, 1); }
.acc-inner { min-height: 0; overflow: hidden; }
.chev { transition-duration: calc(0.3s * var(--demo-speed, 1)); }`}</style>
    </div>
  );
};

export default AccordionExpandDemo;
