import { useState } from 'react';
import type { StyleVariantSet } from './types';

const OPTS = ['Day', 'Week', 'Month'];

function Minimal() {
  const [i, setI] = useState(1);
  return (
    <div className="mx-auto w-full max-w-sm border border-black/10 bg-white p-5 text-black">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Range</p>
      <div className="flex border border-black/20">
        {OPTS.map((o, k) => (
          <button
            key={o}
            onClick={() => setI(k)}
            className={`flex-1 border-r border-black/20 py-2 text-xs uppercase tracking-wider last:border-r-0 ${
              i === k ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] tabular-nums text-black/50">{OPTS[i]} · 1,240 sessions</p>
    </div>
  );
}

function Brutal() {
  const [i, setI] = useState(0);
  return (
    <div className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#c6f24e] p-5 text-black">
      <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em]">Range</p>
      <div className="flex gap-2">
        {OPTS.map((o, k) => (
          <button
            key={o}
            onClick={() => setI(k)}
            className={`flex-1 border-[2.5px] border-black px-1 py-2 text-[11px] font-black uppercase shadow-[3px_3px_0_0_#000] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              i === k ? 'bg-[#ff5d5d]' : 'bg-white'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold">{OPTS[i]} selected</p>
    </div>
  );
}

function Glass() {
  const [i, setI] = useState(1);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-white">
      <span className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <p className="relative mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">Range</p>
      <div className="relative flex rounded-full border border-white/40 bg-white/15 p-1 backdrop-blur-md">
        {OPTS.map((o, k) => (
          <button
            key={o}
            onClick={() => setI(k)}
            className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition-all ${
              i === k ? 'bg-white/40 shadow-lg shadow-black/20' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="relative mt-3 text-[11px] text-white/80">{OPTS[i]}</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '去掉圆角与阴影，只用一条发丝外框和黑白反转表达选中，读数随选择同步。',
      en: 'No radius or shadow: a single hairline frame and black/white inversion mark the choice while the readout updates.',
    },
    Demo: Minimal,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '2.5px 黑描边加硬边投影，选中段填亮红，按下时整段向下重力下沉。',
      en: 'A 2.5px black outline with a hard offset shadow; the active segment fills bright red and sinks under gravity on press.',
    },
    Demo: Brutal,
  },
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '胶囊形磨砂容器浮在彩色渐变上，选中项是抬升的半透明白块加投影。',
      en: 'A frosted pill floats over a colour gradient, and the selected segment is a raised translucent white block with a shadow.',
    },
    Demo: Glass,
  },
];

export default styleVariants;
