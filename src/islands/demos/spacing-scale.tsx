import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const STEPS = [1, 2, 3, 4, 6, 8, 12, 16];

function Group({ gap, token, en, label }: { gap: number; token: number; en: boolean; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-code-bg p-3" style={{ display: 'grid', gap: Math.max(2, Math.round(gap)) }}>
      <p className="font-mono text-[10px] text-ink-3">{label}</p>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
        <span className="h-2.5 rounded-full bg-accent-soft" style={{ width: `${60 + token}px`, maxWidth: '100%' }} />
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
        <span className="h-2.5 rounded-full bg-accent-soft" style={{ width: `${40 + token}px`, maxWidth: '100%' }} />
      </div>
      <p className="text-[10px] text-ink-3">{en ? 'rows share one token' : '组内元素共用同一档'}</p>
    </div>
  );
}

const SpacingScaleMain = ({ en }: { en: boolean }) => {
  const [base, setBase] = useState(4);
  const [idx, setIdx] = useState(3);
  const [density, setDensity] = useState(1);
  const step = STEPS[idx];
  const token = Math.round(base * step * density);
  const inner = Math.max(2, Math.round(token / 2));

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-line bg-raised p-4">
        <div data-anatomy="1" className="mb-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Base unit' : '基准单位'}
          </span>
          <div className="flex gap-1" role="group" aria-label={en ? 'Base unit' : '基准单位'}>
            {[4, 8].map((b) => (
              <button
                key={b}
                aria-pressed={base === b}
                onClick={() => setBase(b)}
                className={`demo-tool border border-line font-mono ${base === b ? '' : 'text-ink-2'}`}
              >
                {b}px
              </button>
            ))}
          </div>
        </div>

        <p data-anatomy="2" className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Step ladder' : '间距档位'}
        </p>
        <div className="mb-4 space-y-1" role="group" aria-label={en ? 'Spacing steps' : '间距档位'}>
          {STEPS.map((s, i) => {
            const value = base * s;
            return (
              <button
                key={s}
                aria-pressed={idx === i}
                onClick={() => setIdx(i)}
                className={`flex w-full items-center gap-2 rounded-md px-1 py-0.5 text-left ${idx === i ? 'bg-accent-soft' : ''}`}
              >
                <span className={`w-10 font-mono text-[10px] ${idx === i ? 'text-accent' : 'text-ink-3'}`}>
                  {value}px
                </span>
                <span
                  className={`h-2 rounded-full ${idx === i ? 'bg-accent' : 'bg-accent-soft'}`}
                  style={{ width: `${value * 3}px`, maxWidth: '80%' }}
                />
              </button>
            );
          })}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="ss-density" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Density multiplier' : '密度乘数'}
          </label>
          <span className="font-mono text-xs text-accent">{density.toFixed(2)}×</span>
        </div>
        <input
          id="ss-density"
          type="range"
          min={0.5}
          max={1.5}
          step={0.05}
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          aria-label={en ? 'Density multiplier' : '密度乘数'}
          className="mb-4 w-full accent-[var(--color-accent)]"
        />

        <div data-anatomy="3" className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Live grouping' : '实时分组'}
          </span>
          <span className="font-mono text-xs text-accent">gap: {token}px</span>
        </div>
        <div className="mt-2 grid" style={{ gap: token, transition: 'gap calc(150ms * var(--demo-speed, 1)) ease' }}>
          <Group gap={inner} token={token} en={en} label={en ? 'Group A' : '分组 A'} />
          <p data-anatomy="4" className="text-center font-mono text-[10px] text-ink-3">
            ↑ {token}px {en ? 'between groups' : '分组之间'}
          </p>
          <Group gap={inner} token={token} en={en} label={en ? 'Group B' : '分组 B'} />
        </div>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'Inner gaps stay smaller than the gap between groups, so spacing itself tells the structure.'
            : '组内间距始终小于组间距，结构由留白自己说清楚。'}
        </p>
      </div>
    </div>
  );
};

function DensityPanel({ base, en }: { base: number; en: boolean }) {
  const label = base === 4 ? (en ? 'Compact' : '紧凑') : base === 8 ? (en ? 'Standard' : '标准') : en ? 'Loose' : '宽松';
  return (
    <section className="rounded-xl border border-line bg-raised p-3">
      <p className="specimen-eyebrow">
        {label} · {base}px
      </p>
      <div className="mt-2 grid" style={{ gap: base * 3 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md border border-line bg-code-bg px-3" style={{ paddingTop: base, paddingBottom: base }}>
            <span className="font-mono text-[10px] text-ink-3">padding {base}px</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const SpacingScaleVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto grid max-w-md gap-3">
    <DensityPanel base={4} en={en} />
    <DensityPanel base={8} en={en} />
    <DensityPanel base={16} en={en} />
    <p className="text-center text-[11px] leading-relaxed text-ink-3">
      {en
        ? 'Same content at three base units. Pick one base per product so everything breathes together.'
        : '同一份内容换三种基准。一个产品只选一个基准，整体疏密才会同步。'}
    </p>
  </div>
);

const SpacingScaleDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <SpacingScaleVariants en={en} />;
  return <SpacingScaleMain en={en} />;
};

export default SpacingScaleDemo;
