import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const RANGE_CSS = `
.demo-range {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.demo-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.25);
  cursor: grab;
  transition: transform calc(120ms * var(--demo-speed, 1));
}
.demo-range::-webkit-slider-thumb:hover { transform: scale(1.15); }
.demo-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.25);
  cursor: grab;
}
.demo-range.dual { pointer-events: none; }
.demo-range.dual::-webkit-slider-thumb { pointer-events: auto; }
.demo-range.dual::-moz-range-thumb { pointer-events: auto; }
`;

function fill(pct: number) {
  return { background: `linear-gradient(to right, var(--color-accent) ${pct}%, rgba(128,128,128,.25) ${pct}%)` };
}

function SingleSlider() {
  const [v, setV] = useState(64);
  return (
    <div className="mx-auto max-w-xs rounded-xl border border-line bg-paper p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <span data-anatomy="1" className="text-xs font-medium text-ink-2">音量</span>
        <span data-anatomy="4" className="font-mono text-xs text-accent">{v}%</span>
      </div>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-xs text-ink-3">🔈</span>
        <input
          data-anatomy="2"
          type="range"
          min={0}
          max={100}
          value={v}
          aria-valuenow={v}
          aria-label="音量"
          onChange={(e) => setV(Number(e.target.value))}
          className="demo-range w-full"
          style={fill(v)}
        />
        <span aria-hidden="true" className="text-xs text-ink-3">🔊</span>
      </div>
    </div>
  );
}

function MarksSlider() {
  const [v, setV] = useState(25);
  return (
    <div className="mx-auto max-w-xs text-sm">
      <div className="mb-1 flex justify-between text-[11px] text-ink-3">
        <span>存储配额</span>
        <span className="font-mono text-accent">{v} GB</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={25}
        value={v}
        aria-valuenow={v}
        aria-label="存储配额"
        onChange={(e) => setV(Number(e.target.value))}
        className="demo-range w-full"
        style={fill(v)}
      />
      <div className="mt-1 flex justify-between px-[7px] font-mono text-[10px] text-ink-3">
        {[0, 25, 50, 75, 100].map((m) => (
          <span key={m} className={m === v ? 'text-accent' : ''}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function RangeSlider() {
  const [lo, setLo] = useState(120);
  const [hi, setHi] = useState(680);
  const pct = (x: number) => (x / 1000) * 100;
  return (
    <div className="mx-auto max-w-xs text-sm">
      <div className="mb-2 flex items-center justify-between text-[11px] text-ink-3">
        <span>价格区间</span>
        <span className="font-mono text-accent">¥{lo} – ¥{hi}</span>
      </div>
      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink-3/25" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={lo}
          aria-label="最低价格"
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 50))}
          className="demo-range dual absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          style={{ background: 'transparent' }}
        />
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={hi}
          aria-label="最高价格"
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 50))}
          className="demo-range dual absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
}

const SliderDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 text-sm">
        <style>{RANGE_CSS}</style>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">单值 Single</p>
          <SingleSlider />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">带刻度 With marks</p>
          <MarksSlider />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">双端区间 Range</p>
          <RangeSlider />
        </div>
      </div>
    );
  }
  return (
    <div>
      <style>{RANGE_CSS}</style>
      <SingleSlider />
    </div>
  );
};

export default SliderDemo;
