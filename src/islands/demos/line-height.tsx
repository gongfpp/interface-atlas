import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SAMPLE_EN =
  'Leading is the vertical rhythm of text. Tight leading makes a headline feel carved from stone; loose leading lets body copy breathe. Use unitless multiples so the rhythm scales with the font size instead of freezing in pixels. Adjust the slider and watch the paragraph change character.';
const SAMPLE_ZH =
  '行高是文字的垂直节奏。标题收紧显得挺拔，正文放宽才耐读。用无单位倍数而不是写死像素，行高才会跟着字号一起缩放。拖动滑块，看段落的松紧如何改变阅读感受。行与行之间的空气，就是读者的呼吸。';

const LineHeightMain = ({ en }: { en: boolean }) => {
  const [lh, setLh] = useState(1.55);
  const [unitless, setUnitless] = useState(true);
  const pxLh = Math.round(15 * lh * 10) / 10;

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        <span data-anatomy="2" className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Leading' : '行间距'}
        </span>
        <span className="font-mono text-xs text-accent">
          {unitless ? lh.toFixed(2) : `${pxLh}px`}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={2.4}
        step={0.05}
        value={lh}
        onChange={(e) => setLh(Number(e.target.value))}
        aria-label={en ? 'Line height' : '行高'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />
      <div className="mt-1 flex justify-between font-mono text-[9px] text-ink-3">
        <span>1.0 {en ? 'tight' : '紧'}</span>
        <span>1.7 {en ? 'body' : '正文'}</span>
        <span>2.4 {en ? 'loose' : '松'}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          aria-pressed={unitless}
          onClick={() => setUnitless(true)}
          className="demo-tool border border-line"
        >
          {en ? 'Unitless 1.55' : '无单位 1.55'}
        </button>
        <button
          aria-pressed={!unitless}
          onClick={() => setUnitless(false)}
          className="demo-tool border border-line"
        >
          {en ? `Pixels ${pxLh}px` : `像素 ${pxLh}px`}
        </button>
      </div>

      <article
        data-anatomy="1"
        className="mt-3 rounded-xl border border-line bg-raised px-4 py-4 text-[15px] text-ink"
        style={{ lineHeight: unitless ? lh : `${pxLh}px` }}
      >
        <h3 className="mb-2 font-serif text-lg font-semibold" style={{ lineHeight: 1.2 }}>
          {en ? 'On leading' : '说行高'}
        </h3>
        <p data-anatomy="3">{en ? SAMPLE_EN : SAMPLE_ZH}</p>
      </article>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
        {unitless
          ? en
            ? 'Unitless leading inherits as a ratio — children recompute against their own size.'
            : '无单位行高按比例继承，子元素按自身字号换算。'
          : en
            ? 'Pixel leading freezes on the parent size — smaller text inherits a stretched rhythm.'
            : '像素行高锁在父级字号上，子元素字号变小就会显得过松。'}
      </p>
    </div>
  );
};

const LineHeightVariants = ({ en }: { en: boolean }) => {
  const cols = [
    { id: 'tight', lh: 1.15, zh: '收紧显示 1.15', en: 'Tight display 1.15' },
    { id: 'comfortable', lh: 1.65, zh: '舒适正文 1.65', en: 'Comfortable body 1.65' },
    { id: 'loose', lh: 2.05, zh: '松弛编辑 2.05', en: 'Loose editorial 2.05' },
  ];
  return (
    <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-3">
      {cols.map((c) => (
        <article key={c.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? c.en : c.zh}</p>
          <p className="mt-2 text-[13px] text-ink" style={{ lineHeight: c.lh }}>
            {en
              ? 'One line after another, the rhythm decides how tired the eye gets.'
              : '一行接一行，松紧决定眼睛累不累。'}
          </p>
        </article>
      ))}
    </div>
  );
};

const LineHeightDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <LineHeightVariants en={en} />;
  return <LineHeightMain en={en} />;
};

export default LineHeightDemo;
