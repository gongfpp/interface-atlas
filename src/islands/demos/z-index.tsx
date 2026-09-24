import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SPEED = 'calc(180ms * var(--demo-speed, 1))';

const SCALE = [
  { name: 'base', value: 0 },
  { name: 'dropdown', value: 10 },
  { name: 'sticky', value: 20 },
  { name: 'modal', value: 40 },
  { name: 'toast', value: 60 },
];

const ZMain = ({ en }: { en: boolean }) => {
  const [z, setZ] = useState(9999);
  const [contextOn, setContextOn] = useState(true);

  const badgeWins = !contextOn && z > 1;

  return (
    <div className="mx-auto max-w-sm">
      <div
        data-anatomy="1"
        className="relative h-44 w-full overflow-hidden rounded-xl border border-line bg-code-bg"
      >
        <div data-anatomy="5" className="pointer-events-none absolute inset-0" />
        <div
          data-anatomy="4"
          className="absolute right-0 top-0 flex h-24 w-1/2 items-center justify-center rounded-bl-lg bg-accent font-mono text-[10px] text-paper"
          style={{ zIndex: 1 }}
        >
          C · z-1
        </div>
        <div
          data-anatomy="3"
          className="absolute left-3 top-12 h-24 w-3/5 rounded-lg border border-line-strong bg-raised"
          style={{
            transform: contextOn ? 'translateZ(0)' : 'none',
            transition: `transform ${SPEED} ease`,
          }}
        >
          <span className="absolute left-2 top-2 font-mono text-[9px] text-ink-3">A</span>
          <span
            data-anatomy="2"
            className="absolute -right-2 -top-3 rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] text-paper"
            style={{
              zIndex: z,
              boxShadow: badgeWins ? '0 0 0 2px var(--color-accent-soft)' : 'none',
              transition: `box-shadow ${SPEED} ease`,
            }}
          >
            z={z}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          aria-pressed={contextOn}
          onClick={() => setContextOn((v) => !v)}
          className="demo-tool border border-line"
        >
          {en ? 'A creates context' : 'A 生成上下文'} · {contextOn ? 'on' : 'off'}
        </button>
        <button
          aria-pressed={z === 9999}
          onClick={() => setZ(9999)}
          className="demo-tool border border-line font-mono"
        >
          9999
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Badge z-index' : '徽标 z-index'}
        </span>
        <span className="font-mono text-xs text-accent">{z}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={z > 10 ? 10 : z}
        onChange={(e) => setZ(Number(e.target.value))}
        aria-label={en ? 'Badge z-index' : '徽标 z-index'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-3">
        {badgeWins
          ? en
            ? 'Same context — the badge beats C with a higher z-index.'
            : '同一上下文——徽标凭更高的 z-index 压过 C。'
          : en
            ? 'A is a stacking context: z=9999 is trapped and C still wins.'
            : 'A 是层叠上下文：z=9999 被锁在里面，C 照样在上。'}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {SCALE.map((s) => (
          <li key={s.name} className="rounded-md bg-code-bg px-2 py-1 font-mono text-[9px] text-ink-2">
            --z-{s.name}: {s.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ZVariants = ({ en }: { en: boolean }) => {
  const cards = [
    {
      id: 'magic',
      zh: '魔法数字',
      en: 'Magic numbers',
      note: { zh: '9999 与 1 混用，仍会输给上下文', en: '9999 next to 1 still loses to a context' },
      chips: ['1', '9999'],
    },
    {
      id: 'named',
      zh: '命名档位',
      en: 'Named ladder',
      note: { zh: '每个用途一个令牌，稳定可读', en: 'One token per purpose, stable and readable' },
      chips: ['10', '20', '40', '60'],
    },
    {
      id: 'isolated',
      zh: '隔离上下文',
      en: 'Isolated context',
      note: { zh: 'isolation: isolate 把子元素锁在局部', en: 'isolation: isolate traps children locally' },
      chips: ['isolate', 'z-5'],
    },
  ];
  return (
    <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <article key={c.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? c.en : c.zh}</p>
          <div className="mt-3 flex h-16 flex-wrap content-center items-center justify-center gap-1.5 rounded-lg bg-paper p-2">
            {c.chips.map((chip) => (
              <span
                key={chip}
                className="rounded bg-accent-soft px-2 py-1 font-mono text-[9px] text-accent"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-3">{en ? c.note.en : c.note.zh}</p>
        </article>
      ))}
    </div>
  );
};

const ZIndexDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <ZVariants en={en} />;
  return <ZMain en={en} />;
};

export default ZIndexDemo;
