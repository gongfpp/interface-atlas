import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Unit = 'rem' | 'em' | 'vw';
const UNITS: Unit[] = ['rem', 'em', 'vw'];

const pxCard: CSSProperties = { fontSize: 14, padding: '8px 16px', borderRadius: 6 };

function unitCard(unit: Unit): CSSProperties {
  if (unit === 'vw') return { fontSize: '1.4vw', padding: '0.6vw 1.4vw', borderRadius: '0.5vw', minWidth: '5vw' };
  const factor = 14 / 16;
  return { fontSize: `${factor}em`, padding: `${8 / 16}em ${16 / 16}em`, borderRadius: `${6 / 16}em` };
}

const RelativeUnitsMain = ({ en }: { en: boolean }) => {
  const [root, setRoot] = useState(16);
  const [unit, setUnit] = useState<Unit>('rem');

  const readout =
    unit === 'rem'
      ? `1rem = ${root}px`
      : unit === 'em'
        ? `1em = 1.25 × ${root}px = ${(root * 1.25).toFixed(1)}px`
        : '1vw = 1% viewport width';

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-line bg-raised p-4">
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="ru-root" data-anatomy="1" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Root font size (browser setting)' : '根字号（浏览器设置）'}
          </label>
          <span className="font-mono text-xs text-accent">{root}px</span>
        </div>
        <input
          id="ru-root"
          type="range"
          min={12}
          max={24}
          step={1}
          value={root}
          onChange={(e) => setRoot(Number(e.target.value))}
          aria-label={en ? 'Root font size' : '根字号'}
          className="w-full accent-[var(--color-accent)]"
        />
        <p className="mb-4 text-[10px] text-ink-3">
          {en
            ? 'Drag to imitate a user raising their default font size.'
            : '拖动它，模拟用户把浏览器默认字号调大。'}
        </p>

        <div className="mb-4 grid grid-cols-3 gap-1" role="group" aria-label={en ? 'Unit' : '单位'}>
          {UNITS.map((u) => (
            <button
              key={u}
              data-anatomy={u === 'vw' ? '4' : '3'}
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={`demo-tool border border-line font-mono ${unit === u ? '' : 'text-ink-2'}`}
            >
              {u}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg border border-dashed border-line-strong bg-code-bg p-3"
          style={{ fontSize: `${root}px` }}
        >
          <p className="mb-2 font-mono text-[10px] text-ink-3">
            {en ? 'preview root' : '预览根字号'} · {root}px
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span data-anatomy="2" className="rounded-md border border-line-strong bg-raised text-ink" style={pxCard}>
              px 固定
            </span>
            {unit === 'em' ? (
              <span className="border border-line-strong bg-accent-soft text-accent" style={unitCard(unit)}>
                <span style={{ fontSize: '1.25em' }}>em 嵌套</span>
              </span>
            ) : (
              <span className="border border-line-strong bg-accent-soft text-accent" style={unitCard(unit)}>
                {unit} 单位
              </span>
            )}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-3">
            {en
              ? 'px stays frozen; the relative card and any nested em grow with the root.'
              : 'px 纹丝不动，相对单位的卡片会随根字号放大，嵌套的 em 还会层层相乘。'}
          </p>
        </div>

        <p className="mt-2 text-center font-mono text-[11px] text-accent">{readout}</p>

        <div className="mt-4 space-y-2 border-t border-line pt-4">
          <div data-anatomy="4">
            <p className="mb-1 font-mono text-[10px] text-ink-3">width: 55vw</p>
            <div className="h-3 rounded-sm bg-accent-soft" style={{ width: '55vw', maxWidth: '100%' }} />
            <p className="mt-1 text-[10px] text-ink-3">{en ? 'viewport width — full-bleed sections' : '视口宽度——整屏区块'}</p>
          </div>
          <div data-anatomy="5">
            <p className="mb-1 font-mono text-[10px] text-ink-3">width: 70%</p>
            <div className="h-3 rounded-sm bg-accent" style={{ width: '70%' }} />
            <p className="mt-1 text-[10px] text-ink-3">{en ? 'percentage of the parent container' : '相对父容器的百分比'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelativeUnitsVariants = ({ en }: { en: boolean }) => {
  const rows = [
    { unit: 'px', a: '14px', b: '14px', note: { zh: '固定不变', en: 'Never moves' } },
    { unit: 'rem', a: '14px', b: '21px', note: { zh: '随根字号 16→24', en: 'Follows root 16→24' } },
    { unit: 'em', a: '14px', b: '21px', note: { zh: '嵌套时继续相乘', en: 'Multiplies when nested' } },
    { unit: '%', a: '87.5%', b: '87.5%', note: { zh: '相对父级字号', en: 'Relative to parent' } },
    { unit: 'vw', a: 'viewport', b: 'viewport', note: { zh: '随窗口变化', en: 'Follows the window' } },
  ];
  return (
    <div className="mx-auto max-w-sm">
      <div className="overflow-hidden rounded-xl border border-line bg-raised">
        <div className="grid grid-cols-4 border-b border-line bg-code-bg px-3 py-2 font-mono text-[10px] text-ink-3">
          <span>{en ? 'unit' : '单位'}</span>
          <span>@16px</span>
          <span>@24px</span>
          <span>{en ? 'behaviour' : '行为'}</span>
        </div>
        {rows.map((r) => (
          <div key={r.unit} className="grid grid-cols-4 items-center border-b border-line px-3 py-2 text-[11px] text-ink last:border-b-0">
            <span className="font-mono text-accent">{r.unit}</span>
            <span className="font-mono text-ink-2">{r.a}</span>
            <span className="font-mono text-ink-2">{r.b}</span>
            <span className="text-ink-3">{en ? r.note.en : r.note.zh}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Only rem and % respect a larger root font size, which is why accessibility guidance prefers them.'
          : '只有 rem 与 % 会跟着用户调大的根字号走，这正是无障碍规范推荐它们的原因。'}
      </p>
    </div>
  );
};

const RelativeUnitsDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <RelativeUnitsVariants en={en} />;
  return <RelativeUnitsMain en={en} />;
};

export default RelativeUnitsDemo;
