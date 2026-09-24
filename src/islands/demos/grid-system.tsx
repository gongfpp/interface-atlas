import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SPEED = 'calc(220ms * var(--demo-speed, 1))';

const GridMain = ({ en }: { en: boolean }) => {
  const [cols, setCols] = useState(12);
  const [gutter, setGutter] = useState(12);
  const [autoFit, setAutoFit] = useState(false);
  const [width, setWidth] = useState(440);

  const count = autoFit ? 8 : cols;
  const tracks = autoFit ? 'repeat(auto-fit, minmax(72px, 1fr))' : `repeat(${cols}, minmax(0, 1fr))`;

  return (
    <div className="mx-auto max-w-md">
      <style>{`
        .grid-system-cq {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        @container (min-width: 380px) {
          .grid-system-cq { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={en ? 'Grid mode' : '栅格模式'}>
        <button
          aria-pressed={!autoFit}
          onClick={() => setAutoFit(false)}
          className={`demo-tool border border-line ${autoFit ? 'text-ink-2' : ''}`}
        >
          {en ? 'Fixed 12-col' : '固定 12 栏'}
        </button>
        <button
          aria-pressed={autoFit}
          onClick={() => setAutoFit(true)}
          className={`demo-tool border border-line ${autoFit ? '' : 'text-ink-2'}`}
        >
          auto-fit
        </button>
      </div>

      <div data-anatomy="2" className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Columns' : '列数'}
          </span>
          <span className="font-mono text-xs text-accent">{autoFit ? 'auto' : cols}</span>
        </div>
        <input
          type="range"
          min={2}
          max={12}
          step={1}
          value={cols}
          disabled={autoFit}
          onChange={(e) => setCols(Number(e.target.value))}
          aria-label={en ? 'Columns' : '列数'}
          className="mt-1 w-full accent-[var(--color-accent)]"
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Gutter' : '槽间距'}
          </span>
          <span className="font-mono text-xs text-accent">{gutter}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          step={4}
          value={gutter}
          onChange={(e) => setGutter(Number(e.target.value))}
          aria-label={en ? 'Gutter' : '槽间距'}
          className="mt-1 w-full accent-[var(--color-accent)]"
        />
      </div>

      <div
        data-anatomy="5"
        className="grid-system-scope mx-auto mt-3 w-full rounded-xl border border-line bg-code-bg p-2"
        style={{
          maxWidth: width,
          containerType: 'inline-size',
          transition: `max-width ${SPEED} ease`,
        }}
      >
        <div
          data-anatomy="3"
          className="rounded-lg border border-dashed border-line-strong p-3"
          style={{ transition: `padding ${SPEED} ease` }}
        >
          <div
            data-anatomy="1"
            className="grid"
            style={{
              gridTemplateColumns: tracks,
              gap: gutter,
              transition: `gap ${SPEED} ease, grid-template-columns ${SPEED} ease`,
            }}
          >
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="flex h-8 items-center justify-center overflow-hidden rounded bg-accent-soft font-mono text-[9px] text-accent"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div
            data-anatomy="4"
            className="grid-system-cq mt-3 rounded-lg border border-line bg-raised p-2"
            style={{ transition: `grid-template-columns ${SPEED} ease` }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded bg-code-bg p-2 text-center font-mono text-[9px] text-ink-2">
                cq {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Container width' : '容器宽度'}
        </span>
        <span className="font-mono text-xs text-accent">{width}px</span>
      </div>
      <input
        type="range"
        min={260}
        max={520}
        step={20}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        aria-label={en ? 'Container width' : '容器宽度'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <p className="mt-2 break-all font-mono text-[9px] text-ink-3">
        grid-template-columns: {tracks}; gap: {gutter}px
      </p>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Shrink the container past 380px: the cq card drops from 3 columns to 1 — by container, not viewport.'
          : '把容器缩到 380px 以内：cq 卡片从 3 列塌成 1 列——看容器，不看视口。'}
      </p>
    </div>
  );
};

const GridVariants = ({ en }: { en: boolean }) => {
  const cards = [
    {
      id: 'fixed-12',
      zh: '固定 12 栏',
      en: 'Fixed 12-column',
      columns: 'repeat(12, minmax(0, 1fr))',
      count: 12,
      note: { zh: '稳但断点写死', en: 'Stable but fixed breakpoints' },
    },
    {
      id: 'auto-fit',
      zh: '自动适应',
      en: 'Auto-fit',
      columns: 'repeat(auto-fit, minmax(28px, 1fr))',
      count: 8,
      note: { zh: '列数交给浏览器', en: 'Browser picks the count' },
    },
    {
      id: 'container',
      zh: '容器查询',
      en: 'Container query',
      columns: 'repeat(3, minmax(0, 1fr))',
      count: 3,
      note: { zh: '按自身宽度回流', en: 'Reflows by its own width' },
    },
  ];
  return (
    <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <article key={c.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? c.en : c.zh}</p>
          <div
            className="mt-3 grid gap-1"
            style={{ gridTemplateColumns: c.columns }}
          >
            {Array.from({ length: c.count }).map((_, i) => (
              <span key={i} className="h-6 rounded bg-accent-soft" />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-3">{en ? c.note.en : c.note.zh}</p>
        </article>
      ))}
    </div>
  );
};

const GridSystemDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <GridVariants en={en} />;
  return <GridMain en={en} />;
};

export default GridSystemDemo;
