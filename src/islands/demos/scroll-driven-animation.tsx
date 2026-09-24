import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'scroll-linked' | 'scroll-triggered' | 'parallax-layers';

function ScrollDrivenPlayground({ en, kind }: { en: boolean; kind: Kind }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        const p = max > 0 ? el.scrollTop / max : 0;
        setProgress(p);
        if (kind === 'scroll-triggered' && p > 0.25) setTriggered(true);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [kind]);

  const pct = Math.round(progress * 100);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div data-anatomy="2" className="w-full">
        <div className="mb-1 flex justify-between text-[10px] text-ink-3">
          <span>{en ? 'Scroll progress' : '滚动进度'}</span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="sda-item h-full rounded-full bg-accent"
            style={{ width: `${pct}%`, transformOrigin: 'left center' }}
          />
        </div>
      </div>

      <div
        ref={boxRef}
        data-anatomy="1"
        className="relative h-44 w-full overflow-y-auto rounded-xl border border-line bg-paper"
      >
        {kind === 'parallax-layers' && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent-soft to-transparent"
            style={{ transform: `translateY(${progress * -36}px)` }}
          />
        )}
        <div className="relative space-y-3 p-3">
          {[0, 1, 2, 3, 4].map((i) => {
            const local = Math.min(1, Math.max(0, progress * 5 - i + 0.4));
            const isTriggered = kind !== 'scroll-triggered' || triggered;
            const style =
              kind === 'scroll-linked'
                ? {
                    opacity: 0.25 + local * 0.75,
                    transform: `translateY(${(1 - local) * 14}px)`,
                  }
                : kind === 'parallax-layers'
                  ? { transform: `translateY(${progress * (i % 2 ? -18 : 10)}px)` }
                  : isTriggered
                    ? undefined
                    : { opacity: 0.35 };
            return (
              <div
                key={i}
                data-anatomy={i === 1 ? '3' : undefined}
                className={`sda-item rounded-lg border border-line bg-raised px-2.5 py-2 text-[11px] text-ink ${
                  kind === 'scroll-triggered' && isTriggered && i === 1 ? 'sda-reveal' : ''
                }`}
                style={style}
              >
                {en ? `Section ${i + 1}` : `章节 ${i + 1}`}
                <span className="mt-0.5 block text-[9px] text-ink-3">
                  {kind === 'scroll-linked'
                    ? en
                      ? 'opacity/offset bound to scroll'
                      : '透明度与位移绑定滚动位置'
                    : kind === 'scroll-triggered'
                      ? en
                        ? 'fires once past 25%'
                        : '越过 25% 后按时间播一次'
                      : en
                        ? 'layers move at different rates'
                        : '各层以不同速率移动'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-ink-3">
        {kind === 'scroll-linked'
          ? en
            ? 'Scrub the container — progress is reversible'
            : '滚动容器即可擦洗 — 进度可反向'
          : kind === 'scroll-triggered'
            ? en
              ? 'Scroll past 25% to fire the timed reveal'
              : '滚过 25% 触发定时显现'
            : en
              ? 'Parallax layers drift at different rates'
              : '视差层以不同速率漂移'}
      </p>
      <style>{`@keyframes sda-rise { from { opacity: 0.3; transform: translateY(12px) } to { opacity: 1; transform: none } }
.sda-item { transition: opacity calc(0.25s * var(--demo-speed, 1)) ease, transform calc(0.25s * var(--demo-speed, 1)) ease; }
.sda-reveal { animation: sda-rise calc(0.5s * var(--demo-speed, 1)) ease-out both; }
`}</style>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Kind, string, string]> = [
    ['scroll-linked', '滚动联动', 'Scroll-linked'],
    ['scroll-triggered', '滚动触发', 'Scroll-triggered'],
    ['parallax-layers', '视差层', 'Parallax layers'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english]) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{id}</p>
          <div className="mt-2 h-12 overflow-hidden rounded-lg bg-code-bg p-2">
            <div className="h-1 w-full rounded bg-line">
              <div className={`h-full rounded bg-accent ${id === 'scroll-linked' ? 'w-2/3' : 'w-1/3'}`} />
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full rounded bg-ink-3/30" />
              <div className="h-1.5 w-3/4 rounded bg-ink-3/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ScrollDrivenAnimationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <ScrollDrivenPlayground en={en} kind="scroll-linked" />;
};

export default ScrollDrivenAnimationDemo;
