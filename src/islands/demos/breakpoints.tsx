import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const MIN = 200;
const MAX = 420;
const BP_ONE = 280;
const BP_TWO = 380;

const BreakpointsMain = ({ en }: { en: boolean }) => {
  const [width, setWidth] = useState(300);
  const cols = width >= BP_TWO ? 3 : width >= BP_ONE ? 2 : 1;
  const inlineNav = width >= BP_ONE;
  const stage = width >= BP_TWO ? 2 : width >= BP_ONE ? 1 : 0;
  const pct = ((width - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Viewport width' : '视口宽度'}
        </span>
        <span className="font-mono text-xs text-accent">{width}px</span>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={4}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        aria-label={en ? 'Viewport width' : '视口宽度'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div data-anatomy="1" className="relative mt-1 h-7 border-b border-line">
        {[
          { v: BP_ONE, label: '280' },
          { v: BP_TWO, label: '380' },
        ].map((bp) => (
          <span
            key={bp.v}
            className="absolute bottom-0 -translate-x-1/2 text-center"
            style={{ left: `${((bp.v - MIN) / (MAX - MIN)) * 100}%` }}
          >
            <span className={`font-mono text-[9px] ${width >= bp.v ? 'text-accent' : 'text-ink-3'}`}>
              {bp.label}
            </span>
            <span className="mx-auto block h-2 w-px bg-line-strong" />
          </span>
        ))}
        <span
          className="absolute bottom-[-1px] h-2.5 w-px -translate-x-1/2 bg-accent"
          style={{ left: `${pct}%` }}
        />
      </div>

      <p data-anatomy="2" className="mt-2 truncate font-mono text-[10px] text-ink-2">
        {stage === 0
          ? '@media (min-width: 0)'
          : stage === 1
            ? '@media (min-width: 280px)'
            : '@media (min-width: 380px)'}
      </p>

      <div className="mt-2 flex justify-center">
        <div
          data-anatomy="3"
          className="rounded-xl border border-line bg-code-bg p-2"
          style={{ width, maxWidth: '100%' }}
        >
          <div className={inlineNav ? 'flex items-center gap-1.5' : 'flex flex-col gap-1'}>
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded bg-line-strong ${inlineNav ? '' : 'ml-4'}`}
                style={{ width: inlineNav ? 22 - i * 3 : 30 - i * 4 }}
              />
            ))}
          </div>
          <div
            className="mt-2 grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-md border border-line bg-raised p-1.5">
                <span className="block h-1.5 w-2/3 rounded bg-line" />
                <span className="mt-1 block h-6 rounded bg-accent-soft" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p data-anatomy="4" className="mt-2 truncate font-mono text-[10px] text-ink-3">
        {'base: grid-template-columns: 1fr'}
      </p>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? `${cols} column${cols > 1 ? 's' : ''} · nav ${inlineNav ? 'inline' : 'stacked'}. Breakpoints come from the content, not device names.`
          : `${cols} 列 · 导航${inlineNav ? '横排' : '堆叠'}。断点来自内容哪里开始挤，而不是设备型号。`}
      </p>
    </div>
  );
};

const BreakpointsVariants = ({ en }: { en: boolean }) => {
  const items = [
    {
      id: 'mobile-first',
      title: en ? 'Mobile-first' : '移动优先',
      code: '@media (min-width: 48rem)',
      note: en ? 'Narrow is the base; add upward.' : '窄屏是基线，向上叠加。',
      cols: 2,
    },
    {
      id: 'desktop-first',
      title: en ? 'Desktop-first' : '桌面优先',
      code: '@media (max-width: 47.99rem)',
      note: en ? 'Wide is the base; subtract down.' : '宽屏是基线，向下删减。',
      cols: 2,
    },
    {
      id: 'container',
      title: en ? 'Container query' : '容器查询',
      code: '@container (min-width: 30rem)',
      note: en ? 'Switch on component width, not viewport.' : '按组件自身宽度切换，而非视口。',
      cols: 1,
    },
  ];
  return (
    <div className="mx-auto grid w-full max-w-md gap-3">
      {items.map((it) => (
        <article key={it.id} className="rounded-xl border border-line bg-raised p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="specimen-eyebrow">{it.title}</p>
            <span className="font-mono text-[9px] text-ink-3">{it.cols === 1 ? '1fr' : '2fr'}</span>
          </div>
          <div
            className="mt-2 grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${it.cols}, minmax(0, 1fr))` }}
          >
            {[0, 1].map((i) => (
              <span key={i} className="block rounded-md bg-code-bg py-3" />
            ))}
          </div>
          <p className="mt-2 truncate font-mono text-[9px] text-accent">{it.code}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{it.note}</p>
        </article>
      ))}
    </div>
  );
};

const BreakpointsDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <BreakpointsVariants en={en} />;
  return <BreakpointsMain en={en} />;
};

export default BreakpointsDemo;
