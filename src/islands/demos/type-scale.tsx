import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const RATIOS = [
  { id: 'major-second', value: 1.125, label: '1.125', zh: '大二度', en: 'Major 2nd' },
  { id: 'major-third', value: 1.25, label: '1.250', zh: '大三度', en: 'Major 3rd' },
  { id: 'perfect-fourth', value: 4 / 3, label: '1.333', zh: '纯四度', en: 'Perfect 4th' },
];

const STEPS = [
  { key: 'caption', exp: -1, zh: '辅助说明', en: 'Caption' },
  { key: 'body', exp: 0, zh: '正文', en: 'Body' },
  { key: 'h4', exp: 1, zh: '小标题 H4', en: 'Subhead H4' },
  { key: 'h3', exp: 2, zh: '标题 H3', en: 'Heading H3' },
  { key: 'h2', exp: 3, zh: '标题 H2', en: 'Heading H2' },
  { key: 'h1', exp: 4, zh: '大标题 H1', en: 'Display H1' },
];

function ScaleStack({
  ratio,
  base,
  en,
  fluid,
}: {
  ratio: number;
  base: number;
  en: boolean;
  fluid?: boolean;
}) {
  return (
    <ol className="mt-3 space-y-2.5">
      {[...STEPS].reverse().map((s) => {
        const px = base * Math.pow(ratio, s.exp);
        const size = fluid
          ? `clamp(${(px * 0.72).toFixed(1)}px, ${(px * 0.55).toFixed(1)}px + ${(px / 40).toFixed(2)}vw, ${px.toFixed(1)}px)`
          : `${px.toFixed(1)}px`;
        return (
          <li key={s.key} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
            <span
              data-anatomy={s.exp === 0 ? '1' : s.exp > 0 ? '3' : undefined}
              className="truncate text-ink"
              style={{
                fontSize: size,
                lineHeight: s.exp >= 3 ? 1.15 : 1.5,
                fontWeight: s.exp >= 2 ? 650 : 400,
                letterSpacing: s.exp >= 3 ? '-0.02em' : 0,
                fontFamily: s.exp >= 2 ? 'var(--font-serif)' : undefined,
              }}
            >
              {en ? s.en : s.zh}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-ink-3">
              {s.exp >= 0 ? '+' : ''}
              {s.exp} · {px.toFixed(1)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const TypeScaleMain = ({ en }: { en: boolean }) => {
  const [ratioId, setRatioId] = useState('major-third');
  const [base, setBase] = useState(16);
  const ratio = RATIOS.find((r) => r.id === ratioId)!;

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-line bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <span data-anatomy="2" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Scale ratio' : '比例系数'}
          </span>
          <span className="font-mono text-xs text-accent">{ratio.label}</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-1" role="group" aria-label={en ? 'Ratio' : '比例'}>
          {RATIOS.map((r) => (
            <button
              key={r.id}
              aria-pressed={ratioId === r.id}
              onClick={() => setRatioId(r.id)}
              className={`demo-tool border border-line text-center ${ratioId === r.id ? '' : 'text-ink-2'}`}
            >
              <span className="block font-mono text-[11px]">{r.label}</span>
              <span className="block text-[9px] text-ink-3">{en ? r.en : r.zh}</span>
            </button>
          ))}
        </div>

        <div data-anatomy="1" className="mb-1 flex items-center justify-between">
          <label htmlFor="type-scale-base" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Base size' : '基准字号'}
          </label>
          <span className="font-mono text-xs text-accent">{base}px</span>
        </div>
        <input
          id="type-scale-base"
          type="range"
          min={13}
          max={20}
          step={1}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="mb-4 w-full accent-[var(--color-accent)]"
        />

        <ScaleStack ratio={ratio.value} base={base} en={en} />
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Steps = base × ratioⁿ. Change the base and every level moves together.'
          : '每一档 = 基准 × 比例ⁿ。改基准字号，整条阶梯同步移动。'}
      </p>
    </div>
  );
};

const TypeScaleVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto grid max-w-md gap-4">
    <section className="rounded-xl border border-line bg-raised p-4">
      <p className="specimen-eyebrow">MODULAR · 1.250</p>
      <ScaleStack ratio={1.25} base={16} en={en} />
    </section>
    <section className="rounded-xl border border-line bg-raised p-4">
      <p className="specimen-eyebrow">FLUID · clamp()</p>
      <ScaleStack ratio={4 / 3} base={16} en={en} fluid />
    </section>
    <section className="rounded-xl border border-line bg-raised p-4">
      <p className="specimen-eyebrow">T-SHIRT · sm / md / lg</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        {[
          ['xs', 12],
          ['sm', 14],
          ['md', 16],
          ['lg', 20],
          ['xl', 24],
        ].map(([n, px]) => (
          <span key={n as string} className="rounded-md bg-code-bg px-2 py-1 font-mono text-ink" style={{ fontSize: px as number }}>
            {n}
            <span className="ml-1 text-[9px] text-ink-3">{px}px</span>
          </span>
        ))}
      </div>
    </section>
  </div>
);

const TypeScaleDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <TypeScaleVariants en={en} />;
  return <TypeScaleMain en={en} />;
};

export default TypeScaleDemo;
