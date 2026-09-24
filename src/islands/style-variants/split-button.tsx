import { useState } from 'react';
import type { StyleVariantSet } from './types';

function SwissSplitButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto w-full max-w-sm border border-black bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">02 — Output</p>
      <div className="mt-4 flex items-stretch">
        <button type="button" className="flex-1 border-2 border-black bg-black px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[0.15em] text-white">
          Export
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid w-10 place-items-center border-2 border-l-0 border-black bg-[#e30613] text-white"
        >
          ▾
        </button>
      </div>
      {open && (
        <ul className="border-2 border-t-0 border-black">
          {['PDF', 'PNG', 'SVG'].map((f) => (
            <li key={f} className="border-t border-black/20 first:border-t-0">
              <button type="button" className="block w-full px-4 py-2 text-left text-[11px] uppercase tracking-wider hover:bg-[#e30613] hover:text-white">
                {f}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FlatSplitButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-[#eef6f6] p-5 text-[#0f3d3e]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0f3d3e]/60">Share post</p>
      <div className="mt-3 flex items-stretch overflow-hidden rounded-md">
        <button type="button" className="flex-1 bg-[#12a594] px-4 py-3 text-left text-sm font-semibold text-white">
          Publish
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid w-11 place-items-center bg-[#0f8b7d] text-white"
        >
          ▾
        </button>
      </div>
      {open && (
        <ul className="mt-2 overflow-hidden rounded-md bg-white">
          {['Copy link', 'Save draft', 'Schedule'].map((f) => (
            <li key={f}>
              <button type="button" className="block w-full px-4 py-2.5 text-left text-[13px] text-[#12494a] hover:bg-[#d7f0ec]">
                {f}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClaySplitButton() {
  const [open, setOpen] = useState(false);
  const clay = 'shadow-[8px_8px_16px_rgba(174,164,214,0.55),-8px_-8px_16px_rgba(255,255,255,0.9)]';
  return (
    <div className="mx-auto w-full max-w-sm rounded-[28px] bg-[#e9e6fb] p-6 text-[#4a3f78]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a6fb0]">New project</p>
      <div className={`mt-4 flex items-stretch rounded-[22px] ${clay}`}>
        <button
          type="button"
          className="flex-1 rounded-l-[22px] bg-gradient-to-b from-[#9b8cf7] to-[#7c67f0] px-4 py-3 text-left text-sm font-bold text-white"
        >
          Create
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid w-11 place-items-center rounded-r-[22px] bg-gradient-to-b from-[#b3a7ff] to-[#8f7ff2] text-white"
        >
          ▾
        </button>
      </div>
      {open && (
        <ul className={`mt-4 space-y-2 rounded-[22px] p-2 ${clay}`}>
          {['Blank', 'From template', 'Import'].map((f) => (
            <li key={f}>
              <button type="button" className="w-full rounded-2xl bg-[#f4f2ff] px-4 py-2.5 text-left text-[13px] font-semibold text-[#5b4e93]">
                {f}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '瑞士国际主义', en: 'Swiss Style' },
    note: {
      zh: '严格网格对齐，主体黑块配一格红色直角下拉，菜单用发丝线分行。',
      en: 'Strictly grid-aligned: a black main block with a single red square caret and menu rows split by hairlines.',
    },
    Demo: SwissSplitButton,
  },
  {
    style: 'flat-design',
    name: { zh: '扁平设计', en: 'Flat Design' },
    note: {
      zh: '纯色块拼出无阴影圆角按钮，菜单是浅色卡片，只靠色差分层。',
      en: 'Solid colour blocks form a shadowless rounded button; the menu is a pale card that layers by colour alone.',
    },
    Demo: FlatSplitButton,
  },
  {
    style: 'claymorphism',
    name: { zh: '黏土拟态', en: 'Claymorphism' },
    note: {
      zh: '整体做成同色系的柔软 3D 黏土，双向投影让按钮和菜单像鼓起的软糖。',
      en: 'The whole control is soft same-hue 3D clay; dual shadows make the button and menu puff up like gummies.',
    },
    Demo: ClaySplitButton,
  },
];

export default styleVariants;
