import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const PARA_EN =
  'Measure is the number of characters on a line. Somewhere near sixty-five the eye turns back without effort. Push past eighty and the return sweep starts to slip; drop under forty and the paragraph shivers. Drag the handle and find the comfort zone for yourself.';
const PARA_ZH =
  '行宽就是一行能放下多少字。大约在六十几个字符时，眼睛回行最省力。超过八十字就容易跟丢，低于四十字则段落一直在抖。拖动滑块，亲手找出舒适区。';

function estimateCpl(width: number, fontSize: number, cjk: boolean) {
  const avg = fontSize * (cjk ? 1 : 0.5);
  return Math.max(8, Math.round(width / avg));
}

const MeasureMain = ({ en }: { en: boolean }) => {
  const [width, setWidth] = useState(340);
  const fontSize = 15;
  const cpl = estimateCpl(width, fontSize, !en);
  const cjk = !en;
  const zone = cjk
    ? cpl < 22
      ? 'narrow'
      : cpl > 42
        ? 'wide'
        : 'ok'
    : cpl < 45
      ? 'narrow'
      : cpl > 75
        ? 'wide'
        : 'ok';

  const flag =
    zone === 'ok'
      ? { text: en ? 'Comfort zone' : '舒适区', cls: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400' }
      : zone === 'narrow'
        ? { text: en ? 'Too narrow · churning' : '过窄 · 回行频繁', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' }
        : { text: en ? 'Too wide · losing lines' : '过宽 · 易跟丢行', cls: 'bg-red-500/10 text-red-600 dark:text-red-400' };

  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <span data-anatomy="1" className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Container width' : '容器宽度'}
        </span>
        <span className="font-mono text-xs text-accent">{width}px</span>
      </div>
      <input
        type="range"
        min={200}
        max={460}
        step={4}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        aria-label={en ? 'Container width' : '容器宽度'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <span data-anatomy="2" className="font-mono text-xs text-ink-2">
          ≈ {cpl} {en ? 'CPL' : '字/行'}
        </span>
        <span data-anatomy="3" className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${flag.cls}`}>
          {flag.text}
        </span>
      </div>

      <div className="mt-3 flex justify-center">
        <article
          className="rounded-xl border border-line bg-raised px-4 py-4 text-[15px] text-ink"
          style={{ width, maxWidth: '100%', lineHeight: 1.65 }}
        >
          {en ? PARA_EN : PARA_ZH}
        </article>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
        {cjk
          ? '中文舒适区约 28～40 字/行（≈56ch～80ch）。'
          : 'Latin comfort zone: 45–75 characters per line (≈65ch is the classic).'}
      </p>
    </div>
  );
};

const MeasureVariants = ({ en }: { en: boolean }) => {
  const cols = [
    { id: 'narrow', w: 220, zh: '窄栏 45ch', en: 'Narrow 45ch' },
    { id: 'optimal', w: 320, zh: '舒适 65ch', en: 'Optimal 65ch' },
    { id: 'wide', w: 420, zh: '宽界面 80ch', en: 'Wide UI 80ch' },
  ];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      {cols.map((c) => (
        <article key={c.id} className="rounded-xl border border-line bg-raised p-3" style={{ width: c.w, maxWidth: '100%' }}>
          <p className="specimen-eyebrow">{en ? c.en : c.zh}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink">
            {en
              ? 'Width decides whether the return sweep is effortless or a hunt.'
              : '行宽决定回行是顺手一带，还是得低头去找。'}
          </p>
        </article>
      ))}
    </div>
  );
};

const MeasureDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <MeasureVariants en={en} />;
  return <MeasureMain en={en} />;
};

export default MeasureDemo;
