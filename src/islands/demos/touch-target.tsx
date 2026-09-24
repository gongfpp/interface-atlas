import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const MIN_SIZE = 28;
const MAX_SIZE = 64;
const VISUAL = 24;

const TouchTargetMain = ({ en }: { en: boolean }) => {
  const [size, setSize] = useState(44);
  const [gap, setGap] = useState(8);
  const [showHit, setShowHit] = useState(true);
  const [down, setDown] = useState<number | null>(null);

  const sizeOk = size >= 44;
  const gapOk = gap >= 8;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Hit area' : '热区边长'}
        </span>
        <span className={`font-mono text-xs ${sizeOk ? 'text-accent' : 'text-ink-2'}`}>{size}px</span>
      </div>
      <input
        type="range"
        min={MIN_SIZE}
        max={MAX_SIZE}
        step={2}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        aria-label={en ? 'Hit area size' : '热区边长'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Spacing' : '目标间距'}
        </span>
        <span className={`font-mono text-xs ${gapOk ? 'text-accent' : 'text-ink-2'}`}>{gap}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={24}
        step={2}
        value={gap}
        onChange={(e) => setGap(Number(e.target.value))}
        aria-label={en ? 'Spacing between targets' : '目标间距'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div className="mt-3 flex justify-center">
        <div
          data-anatomy="3"
          className="grid rounded-xl border border-line bg-code-bg p-3"
          style={{ gridTemplateColumns: 'repeat(3, auto)', gap, justifyContent: 'center' }}
        >
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              data-anatomy="2"
              aria-label={en ? `Target ${i + 1}` : `目标 ${i + 1}`}
              onPointerDown={() => setDown(i)}
              onPointerUp={() => setDown(null)}
              onPointerLeave={() => setDown(null)}
              className={`relative grid place-items-center rounded-lg border ${
                down === i ? 'border-accent bg-accent-soft' : 'border-line bg-raised'
              }`}
              style={{ width: size, height: size }}
            >
              {showHit && (
                <span className="pointer-events-none absolute inset-0 rounded-lg border border-dashed border-accent" />
              )}
              <span
                data-anatomy="1"
                className="block rounded-md bg-ink"
                style={{ width: VISUAL, height: VISUAL }}
              />
            </button>
          ))}
        </div>
      </div>

      <div
        data-anatomy="4"
        className={`mt-3 rounded-lg px-3 py-2 text-[11px] ${
          sizeOk && gapOk ? 'bg-accent-soft text-accent' : 'bg-code-bg text-ink-2'
        }`}
      >
        {sizeOk && gapOk
          ? en
            ? 'Meets the 44×44 minimum with 8px spacing.'
            : '达到 44×44 最小尺寸，间距不少于 8px。'
          : !sizeOk
            ? en
              ? `Hit area is ${size}px — under the 44px minimum.`
              : `热区只有 ${size}px，低于 44px 最小边。`
            : en
              ? `Spacing is ${gap}px — add at least 8px to avoid mis-taps.`
              : `间距只有 ${gap}px，至少留 8px 以免误触。`}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] leading-relaxed text-ink-3">
          {en ? 'Tap a target to see the press feedback.' : '按下目标，看看命中反馈。'}
        </p>
        <button
          type="button"
          onClick={() => setShowHit((s) => !s)}
          aria-pressed={showHit}
          className="demo-tool border border-line"
        >
          {showHit ? (en ? 'Hide hit areas' : '隐藏热区') : en ? 'Show hit areas' : '显示热区'}
        </button>
      </div>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'The 24px glyph stays fixed; only the transparent hit area grows.'
          : '24px 图标本身不变，只有透明热区在变大。'}
      </p>
    </div>
  );
};

const TouchTargetVariants = ({ en }: { en: boolean }) => {
  const items = [
    {
      id: 'comfortable',
      title: en ? 'Comfortable' : '舒适大热区',
      note: en ? 'Visual 44px = hit 44px.' : '视觉 44px ＝ 热区 44px。',
      box: 44,
      glyph: 44,
    },
    {
      id: 'padded-icon',
      title: en ? 'Padded icon' : '图标加内边距',
      note: en ? '24px glyph + 10px padding.' : '24px 图标 + 10px 内边距。',
      box: 44,
      glyph: 24,
    },
    {
      id: 'pseudo',
      title: en ? 'Pseudo-element' : '伪元素扩展',
      note: en ? '24px glyph, ::before adds inset.' : '24px 图标，::before 补足热区。',
      box: 24,
      glyph: 24,
    },
  ];
  return (
    <div className="mx-auto grid w-full max-w-md gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <article key={it.id} className="rounded-xl border border-line bg-raised p-3 text-center">
          <p className="specimen-eyebrow">{it.title}</p>
          <div className="mt-3 grid place-items-center">
            <span className="relative grid place-items-center" style={{ width: 44, height: 44 }}>
              {it.id === 'pseudo' && (
                <span className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-accent" />
              )}
              <span
                className={`grid place-items-center rounded-full border ${
                  it.id === 'comfortable' ? 'border-accent bg-accent-soft' : 'border-line bg-code-bg'
                }`}
                style={{ width: it.box, height: it.box }}
              >
                <span className="rounded-md bg-ink" style={{ width: it.glyph, height: it.glyph }} />
              </span>
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{it.note}</p>
        </article>
      ))}
    </div>
  );
};

const TouchTargetDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <TouchTargetVariants en={en} />;
  return <TouchTargetMain en={en} />;
};

export default TouchTargetDemo;
