import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const STEPS_SHORT = [100, 200, 300, 400, 500, 600, 700, 800];

function stepColor(hue: number, sat: number, stop: number) {
  const t = (stop - 50) / 850;
  const light = 97 - t * 85;
  const s = sat * (0.55 + t * 0.55);
  return `hsl(${hue} ${s.toFixed(1)}% ${light.toFixed(1)}%)`;
}

function textColorFor(hue: number, sat: number, stop: number) {
  return stop >= 500 ? '#fafaf7' : `hsl(${hue} ${(sat * 0.9).toFixed(1)}% 18%)`;
}

const PaletteMain = ({ en }: { en: boolean }) => {
  const [hue, setHue] = useState(230);
  const [sat, setSat] = useState(55);
  const secondaryHue = (hue + 32) % 360;
  const neutralHue = hue;

  const roles = [
    { id: 'primary', zh: '主色 Primary', en: 'Primary', swatch: stepColor(hue, sat, 600), text: stepColor(hue, sat, 50) },
    { id: 'secondary', zh: '辅助 Secondary', en: 'Secondary', swatch: stepColor(secondaryHue, sat * 0.7, 500), text: stepColor(secondaryHue, sat, 50) },
    { id: 'accent', zh: '点缀 Accent', en: 'Accent', swatch: stepColor(hue, sat, 400), text: stepColor(hue, sat, 900) },
    { id: 'neutral', zh: '中性 Neutral', en: 'Neutral', swatch: stepColor(neutralHue, 8, 500), text: stepColor(neutralHue, 8, 50) },
  ];

  return (
    <div className="mx-auto max-w-sm">
      <div data-anatomy="1" className="flex items-center justify-between">
        <label htmlFor="palette-hue" className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Base hue' : '基色色相'}
        </label>
        <span className="font-mono text-xs text-accent">{hue}°</span>
      </div>
      <input
        id="palette-hue"
        type="range"
        min={0}
        max={360}
        step={1}
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
        style={{
          background: `linear-gradient(to right, hsl(0 ${sat}% 55%), hsl(60 ${sat}% 55%), hsl(120 ${sat}% 55%), hsl(180 ${sat}% 55%), hsl(240 ${sat}% 55%), hsl(300 ${sat}% 55%), hsl(360 ${sat}% 55%))`,
          height: 6,
          borderRadius: 999,
          appearance: 'none',
        }}
      />

      <div className="mt-2 flex items-center justify-between">
        <label htmlFor="palette-sat" className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Saturation' : '饱和度'}
        </label>
        <span className="font-mono text-xs text-accent">{sat}%</span>
      </div>
      <input
        id="palette-sat"
        type="range"
        min={15}
        max={85}
        step={1}
        value={sat}
        onChange={(e) => setSat(Number(e.target.value))}
        className="mb-3 w-full accent-[var(--color-accent)]"
      />

      <div data-anatomy="2" className="overflow-hidden rounded-xl border border-line">
        <div className="flex">
          {STOPS.map((stop) => (
            <div
              key={stop}
              className="flex h-14 flex-1 items-end justify-center pb-1"
              style={{ background: stepColor(hue, sat, stop) }}
              title={`--color-primary-${stop}`}
            >
              <span className="font-mono text-[8px]" style={{ color: textColorFor(hue, sat, stop) }}>
                {stop}
              </span>
            </div>
          ))}
        </div>
        <div className="flex bg-code-bg px-2 py-1 font-mono text-[8px] text-ink-3">
          <span className="flex-1 text-left">50</span>
          <span className="flex-1 text-center">500</span>
          <span className="flex-1 text-right">900</span>
        </div>
      </div>

      <div data-anatomy="3" className="mt-3 grid grid-cols-2 gap-2">
        {roles.map((r) => (
          <div key={r.id} className="rounded-lg border border-line bg-raised p-2">
            <div
              className="mb-1.5 flex h-8 items-center justify-center rounded-md text-[10px] font-medium"
              style={{ background: r.swatch, color: r.text }}
            >
              Aa
            </div>
            <p className="text-[10px] text-ink-2">{en ? r.en : r.zh}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaletteVariants = ({ en }: { en: boolean }) => {
  const rows = [
    { id: 'single', zh: '单色相色阶', en: 'Single hue ramp', h: 210, s: 60 },
    { id: 'comp', zh: '互补双色', en: 'Complementary', h: 210, s: 60, alt: 30 },
    { id: 'mono', zh: '单色系', en: 'Monochrome', h: 210, s: 8 },
  ];
  return (
    <div className="mx-auto max-w-md space-y-3">
      {rows.map((r) => (
        <article key={r.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? r.en : r.zh}</p>
          <div className="mt-2 flex h-8 overflow-hidden rounded-md">
            {STEPS_SHORT.map((stop, i) => {
              const hue = r.alt != null && i >= 5 ? r.alt : r.h;
              return (
                <div key={stop} className="flex-1" style={{ background: stepColor(hue, r.s, stop) }} />
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
};

const PaletteDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <PaletteVariants en={en} />;
  return <PaletteMain en={en} />;
};

export default PaletteDemo;
