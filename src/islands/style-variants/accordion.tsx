import { useState } from 'react';
import type { StyleVariantSet } from './types';

function SwissAccordion() {
  const [open, setOpen] = useState(0);
  const items: [string, string, string][] = [
    ['01', 'Grid', 'Twelve columns, one baseline, nothing floats free.'],
    ['02', 'Type', 'Neue Haas-style neutral grotesk at strict sizes.'],
    ['03', 'Colour', 'Black, white and a single signal red for state.'],
  ];
  return (
    <div className="mx-auto w-full max-w-sm bg-white text-black" style={{ borderTop: '3px solid #000' }}>
      {items.map(([no, title, body], i) => (
        <div key={no} className="border-b border-black/15">
          <button onClick={() => setOpen(i)} className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-3 text-left">
            <span className="font-mono text-[10px]" style={{ color: '#e00' }}>
              {no}
            </span>
            <span className="text-sm font-medium">{title}</span>
            <span className="text-lg leading-none" style={{ color: open === i ? '#e00' : '#000' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && <p className="pb-3 pl-[3.25rem] text-[11px] leading-relaxed text-black/60">{body}</p>}
        </div>
      ))}
    </div>
  );
}

function RawAccordion() {
  const [open, setOpen] = useState(0);
  const items = ['UPLOAD', 'TRANSCODE', 'PUBLISH'];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#d8d8d8] font-mono text-black">
      {items.map((it, i) => (
        <div key={it} className="border-b-2 border-black">
          <button onClick={() => setOpen(i)} className="flex w-full items-center justify-between px-3 py-2 text-left">
            <span className={`text-xl font-bold uppercase leading-none tracking-tighter ${open === i ? 'bg-black px-1 text-[#d8d8d8]' : ''}`}>
              {it}
            </span>
            <span className="text-sm">{String(i + 1).padStart(2, '0')}</span>
          </button>
          {open === i && <p className="px-3 pb-3 text-[11px] leading-snug">[ RAW TEXT BODY — NO ROUNDING, NO SHADOW, JUST STRUCTURE ]</p>}
        </div>
      ))}
    </div>
  );
}

function LiquidAccordion() {
  const [open, setOpen] = useState(0);
  const items = ['Storage', 'Privacy', 'Devices'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b2a4a] via-[#3b2d63] to-[#0e1730] p-4">
      <span className="pointer-events-none absolute -top-10 left-10 h-32 w-32 rounded-full bg-[#5b8cff]/40 blur-2xl" />
      <div className="relative flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={it} className="overflow-hidden rounded-3xl border border-white/25 bg-white/10 backdrop-blur-xl">
            <button onClick={() => setOpen(i)} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-white">
              {it}
              <span className="text-white/60">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="px-4 pb-3 text-[11px] leading-relaxed text-white/70">A frosted pill expands in place with no chrome.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '编号、标题、标记严格对齐三条网格线，只用一条信号红区分展开态，其余全是黑白细规线。',
      en: 'Number, title and marker lock to a three-track grid, with one signal red for the open state and everything else black-on-white hairlines.',
    },
    Demo: SwissAccordion,
  },
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '等宽超大写标题直接压在水泥灰底上，展开时标题被反白成黑块，拒绝任何圆角与过渡。',
      en: 'Oversized monospace capitals sit raw on concrete grey, and opening inverts the title into a solid black block with no rounding or easing.',
    },
    Demo: RawAccordion,
  },
  {
    style: 'liquid-glass',
    name: { zh: '液态玻璃', en: 'Liquid Glass' },
    note: {
      zh: '深色渐变上浮着磨砂玻璃胶囊，白色描边与背景模糊制造通透层次，展开在原地撑开。',
      en: 'Frosted glass pills float over a dark gradient, white borders and backdrop blur giving depth as each one expands in place.',
    },
    Demo: LiquidAccordion,
  },
];

export default styleVariants;
