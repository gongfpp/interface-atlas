import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Corner = 'all' | 'top' | 'bl';
const PRESETS = [
  { r: 0, zh: '直角', en: 'Sharp' },
  { r: 8, zh: '柔和', en: 'Soft' },
  { r: 16, zh: '圆润', en: 'Rounded' },
];

function corners(r: number, mode: Corner): string {
  if (mode === 'top') return `${r}px ${r}px 0 0`;
  if (mode === 'bl') return `0 0 0 ${r}px`;
  return `${r}px`;
}

const BorderRadiusMain = ({ en }: { en: boolean }) => {
  const [r, setR] = useState(16);
  const [concentric, setConcentric] = useState(true);
  const [corner, setCorner] = useState<Corner>('all');
  const innerR = concentric ? Math.max(0, r - 8) : r;

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-line bg-raised p-4">
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="br-radius" data-anatomy="1" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Radius' : '圆角半径'}
          </label>
          <span className="font-mono text-xs text-accent">{r}px</span>
        </div>
        <input
          id="br-radius"
          type="range"
          min={0}
          max={32}
          step={1}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          aria-label={en ? 'Radius' : '圆角半径'}
          className="w-full accent-[var(--color-accent)]"
        />

        <div className="mt-1 grid grid-cols-3 gap-1" role="group" aria-label={en ? 'Presets' : '预设'}>
          {PRESETS.map((p) => (
            <button
              key={p.r}
              aria-pressed={r === p.r}
              onClick={() => setR(p.r)}
              className={`demo-tool border border-line ${r === p.r ? '' : 'text-ink-2'}`}
            >
              {en ? p.en : p.zh}
            </button>
          ))}
        </div>

        <div data-anatomy="2" className="mt-4">
          <div className="mb-1 flex gap-1" role="group" aria-label={en ? 'Corners' : '四角'}>
            {(
              [
                ['all', en ? 'All' : '四角'],
                ['top', en ? 'Top only' : '仅上方'],
                ['bl', en ? 'One corner' : '单角'],
              ] as [Corner, string][]
            ).map(([m, label]) => (
              <button
                key={m}
                aria-pressed={corner === m}
                onClick={() => setCorner(m)}
                className={`demo-tool border border-line ${corner === m ? '' : 'text-ink-2'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="border border-line-strong bg-code-bg p-2"
            style={{ borderRadius: corners(r, corner), transition: 'border-radius calc(160ms * var(--demo-speed, 1)) ease' }}
          >
            <div
              className="flex items-center justify-center border border-line bg-raised text-[10px] text-ink-2"
              style={{
                borderRadius: `${innerR}px`,
                padding: '14px 12px',
                transition: 'border-radius calc(160ms * var(--demo-speed, 1)) ease',
              }}
            >
              {en ? 'outer − 8px = inner' : '外 − 8px = 内'}
            </div>
          </div>
        </div>

        <div data-anatomy="3" className="mt-4 flex items-center justify-between rounded-lg border border-line bg-code-bg px-3 py-2">
          <span className="text-[11px] text-ink-2">
            {en ? 'Concentric inner radius' : '同心圆角'}
          </span>
          <button
            aria-pressed={concentric}
            onClick={() => setConcentric((v) => !v)}
            className={`demo-tool border border-line font-mono ${concentric ? '' : 'text-ink-2'}`}
          >
            {concentric ? 'on' : 'off'}
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-3">
          {concentric
            ? en
              ? 'Inner radius = outer − gap, so the curves stay parallel.'
              : '内圆角 = 外圆角 − 间距，两道弧线保持平行。'
            : en
              ? 'Off: the inner sharp corner pokes past the outer curve.'
              : '关闭：内层直角会顶出外层弧线，出现凹口。'}
        </p>

        <div data-anatomy="4" className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent-soft text-[10px] text-accent"
            style={{ borderRadius: '50%' }}
          >
            50%
          </span>
          <span
            className="bg-accent px-4 py-2 text-[11px] text-paper"
            style={{ borderRadius: '9999px' }}
          >
            {en ? 'Pill · 9999px' : '胶囊 · 9999px'}
          </span>
          <span className="text-[10px] leading-relaxed text-ink-3">
            {en ? 'Avatars and tags' : '头像与标签'}
          </span>
        </div>
      </div>
    </div>
  );
};

const BorderRadiusVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto grid max-w-md gap-3">
    {[
      { r: 8, label: en ? 'Soft · 8px' : '柔和 · 8px', note: en ? 'tables, dense controls' : '表格、密集控件' },
      { r: 16, label: en ? 'Rounded · 16px' : '圆润 · 16px', note: en ? 'cards and panels' : '卡片与面板' },
      { r: 9999, label: en ? 'Pill · full' : '胶囊 · full', note: en ? 'buttons, tags, avatars' : '按钮、标签、头像' },
    ].map((v) => (
      <section key={v.r} className="rounded-xl border border-line bg-raised p-3">
        <p className="specimen-eyebrow">{v.label}</p>
        <div className="mt-2 flex items-center gap-3">
          <span
            className="border border-line bg-code-bg px-4 py-2 text-[11px] text-ink"
            style={{ borderRadius: v.r === 9999 ? '9999px' : `${v.r}px` }}
          >
            {en ? 'Button' : '按钮'}
          </span>
          <span className="text-[10px] text-ink-3">{v.note}</span>
        </div>
      </section>
    ))}
    <p className="text-center text-[11px] leading-relaxed text-ink-3">
      {en
        ? 'One radius language: small on controls, larger as surfaces grow.'
        : '一套圆角语言：控件小，容器越大圆角越大。'}
    </p>
  </div>
);

const BorderRadiusDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <BorderRadiusVariants en={en} />;
  return <BorderRadiusMain en={en} />;
};

export default BorderRadiusDemo;
