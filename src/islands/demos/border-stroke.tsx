import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ERROR = '#b42318';
const SPEED = 'calc(150ms * var(--demo-speed, 1))';

const swatches = [
  { css: 'var(--color-line)', label: 'line' },
  { css: 'var(--color-line-strong)', label: 'line-strong' },
  { css: 'var(--color-accent)', label: 'accent' },
];

const BorderMain = ({ en }: { en: boolean }) => {
  const [width, setWidth] = useState(1);
  const [radius, setRadius] = useState(10);
  const [boxSizing, setBoxSizing] = useState<'border-box' | 'content-box'>('border-box');

  const borderTotal = width * 2;
  const outerWidth = 160 + (boxSizing === 'content-box' ? borderTotal : 0);

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Stroke width' : '描边宽度'}
        </span>
        <span className="font-mono text-xs text-accent">{width}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        aria-label={en ? 'Stroke width' : '描边宽度'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Corner radius' : '圆角'}
        </span>
        <span className="font-mono text-xs text-accent">{radius}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={20}
        step={2}
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        aria-label={en ? 'Corner radius' : '圆角'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="box-sizing">
        {(['border-box', 'content-box'] as const).map((v) => (
          <button
            key={v}
            aria-pressed={boxSizing === v}
            onClick={() => setBoxSizing(v)}
            className={`demo-tool border border-line font-mono text-[10px] ${boxSizing === v ? '' : 'text-ink-2'}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-code-bg p-3">
        <div
          data-anatomy="1"
          className="shrink-0 bg-raised p-3"
          style={{
            width: 160,
            boxSizing,
            borderStyle: 'solid',
            borderWidth: width,
            borderColor: 'var(--color-line-strong)',
            borderRadius: radius,
            transition: `border-width ${SPEED} ease, border-radius ${SPEED} ease`,
          }}
        >
          <div data-anatomy="4" className="rounded bg-code-bg p-2">
            <div className="h-2 w-16 rounded-full bg-line" />
            <div className="mt-1.5 h-2 w-10 rounded-full bg-line" />
          </div>
        </div>
        <div
          className="flex h-16 flex-1 items-center justify-center rounded-lg border border-dashed border-line-strong font-mono text-[9px] text-ink-3"
          style={{ transition: `all ${SPEED} ease` }}
        >
          {en ? 'neighbour' : '相邻元素'}
        </div>
      </div>

      <p className="mt-2 font-mono text-[9px] text-ink-3">
        {`160px + 2×${width}px border → ${outerWidth}px total`}
      </p>

      <div data-anatomy="2" className="mt-3 flex flex-wrap items-center gap-3">
        {swatches.map((s) => (
          <span key={s.label} className="flex items-center gap-1">
            <i className="h-3.5 w-3.5 rounded-sm border" style={{ borderColor: s.css }} />
            <code className="font-mono text-[9px] text-ink-3">{s.label}</code>
          </span>
        ))}
      </div>

      <div data-anatomy="3" className="mt-3 flex items-center gap-2">
        {[0, 6, 14].map((r) => (
          <span
            key={r}
            className="h-8 w-8 border border-line-strong bg-raised"
            style={{ borderRadius: r }}
          />
        ))}
        <span className="font-mono text-[9px] text-ink-3">{en ? 'radius steps' : '圆角阶梯'}</span>
      </div>

      <div data-anatomy="5" className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-line bg-raised px-3 py-1.5 text-[11px] text-ink transition-colors hover:border-ink"
          style={{ transitionDuration: SPEED }}
        >
          {en ? 'Hover me' : '悬停看我'}
        </button>
        <button className="rounded-md border border-line bg-raised px-3 py-1.5 text-[11px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {en ? 'Tab to focus' : 'Tab 聚焦'}
        </button>
        <span
          className="rounded-md border bg-raised px-3 py-1.5 text-[11px]"
          style={{ borderColor: ERROR, color: ERROR }}
        >
          {en ? 'Error' : '报错'}
        </span>
      </div>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'content-box adds the border outside 160px; border-box keeps the total fixed.'
          : 'content-box 会在 160px 之外再加边框；border-box 让总宽保持不变。'}
      </p>
    </div>
  );
};

const BorderVariants = ({ en }: { en: boolean }) => {
  const items = [
    {
      id: 'border',
      zh: '实体边框',
      en: 'Solid border',
      note: { zh: '计入布局空间', en: 'Takes layout space' },
      style: { border: '2px solid var(--color-line-strong)' },
    },
    {
      id: 'outline',
      zh: '轮廓描边',
      en: 'Outline',
      note: { zh: '画在盒外，不占位', en: 'Outside the box, no space' },
      style: { outline: '2px solid var(--color-accent)', outlineOffset: '2px' },
    },
    {
      id: 'ring',
      zh: '阴影环',
      en: 'Shadow ring',
      note: { zh: '阴影模拟，可叠层', en: 'Faked with shadow, stackable' },
      style: { boxShadow: '0 0 0 2px var(--color-accent-soft)' },
    },
  ];
  return (
    <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <article key={it.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? it.en : it.zh}</p>
          <div
            className="mt-3 flex h-16 items-center justify-center rounded-lg bg-paper font-mono text-[10px] text-ink-2"
            style={{ ...it.style, transition: `all ${SPEED} ease` }}
          >
            {it.id}
          </div>
          <p className="mt-2 text-[10px] text-ink-3">{en ? it.note.en : it.note.zh}</p>
        </article>
      ))}
    </div>
  );
};

const BorderStrokeDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <BorderVariants en={en} />;
  return <BorderMain en={en} />;
};

export default BorderStrokeDemo;
