import { useState } from 'react';
import type { StyleVariantSet } from './types';

const CATS = ['Sans', 'Serif', 'Mono'];
const SIZES = ['Small', 'Large'];

function Swiss() {
  const [sel, setSel] = useState<string[]>(['Sans']);
  const toggle = (v: string) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const rows = (items: string[]) =>
    items.map((it) => (
      <label key={it} onClick={() => toggle(it)} className="flex cursor-pointer items-center justify-between border-t border-black/10 py-1.5 text-xs">
        <span className="flex items-center gap-2">
          <span className={`h-3.5 w-3.5 border border-black ${sel.includes(it) ? 'bg-black' : 'bg-white'}`} />
          {it}
        </span>
        <span className="font-mono text-[10px] text-black/40">{it.length}</span>
      </label>
    ));
  return (
    <div className="mx-auto w-full max-w-sm border border-black bg-white font-sans text-black">
      <div className="flex items-baseline justify-between border-b-2 border-red-600 px-4 py-2.5">
        <span className="text-sm font-bold uppercase tracking-tight">Filter</span>
        <span className="font-mono text-[10px] tracking-wider text-black/50">12 RESULTS</span>
      </div>
      <div className="p-4">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
          <span className="h-2 w-2 bg-red-600" />Category
        </p>
        {rows(CATS)}
        <p className="mb-1 mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
          <span className="h-2 w-2 bg-red-600" />Size
        </p>
        {rows(SIZES)}
      </div>
      <button onClick={() => setSel([])} className="w-full border-t border-black bg-black py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-red-600">
        Clear all
      </button>
    </div>
  );
}

function Bauhaus() {
  const [sel, setSel] = useState<string[]>(['Furniture']);
  const toggle = (v: string) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const opts = [
    { label: 'Furniture', color: '#1d4ed8' },
    { label: 'Lighting', color: '#e11d48' },
    { label: 'Storage', color: '#f5b500' },
  ];
  return (
    <div className="mx-auto w-full max-w-sm border-2 border-black bg-[#f4efe2] p-4 font-sans text-black">
      <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-3">
        <span className="h-4 w-4 rounded-full bg-[#e11d48]" />
        <span className="h-4 w-4 bg-[#f5b500]" />
        <span className="h-0 w-0 border-x-[8px] border-b-[14px] border-x-transparent border-b-[#1d4ed8]" />
        <span className="ml-auto text-xs font-black uppercase tracking-widest">Filter</span>
      </div>
      {opts.map((o) => {
        const on = sel.includes(o.label);
        return (
          <button key={o.label} onClick={() => toggle(o.label)} className="mb-2 flex w-full items-center gap-3 border-2 border-black bg-white px-3 py-2 text-left text-sm font-bold">
            <span className="h-4 w-4 rounded-full border-2 border-black" style={{ background: on ? o.color : 'transparent' }} />
            {o.label}
            <span className="ml-auto font-mono text-xs">{on ? '■' : '□'}</span>
          </button>
        );
      })}
      <button onClick={() => setSel([])} className="mt-1 w-full bg-black py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
        Reset
      </button>
    </div>
  );
}

function Neumorph() {
  const [sel, setSel] = useState<string[]>(['Warm']);
  const toggle = (v: string) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e6e9ef] p-6 text-[#4b5563]">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Tone</p>
      {['Warm', 'Cool', 'Neutral'].map((o) => {
        const on = sel.includes(o);
        return (
          <button
            key={o}
            onClick={() => toggle(o)}
            className={`mb-3 flex w-full items-center justify-between rounded-2xl px-5 py-3 text-sm font-semibold transition-shadow ${
              on
                ? 'shadow-[inset_5px_5px_10px_#c3c7cf,inset_-5px_-5px_10px_#ffffff]'
                : 'shadow-[5px_5px_10px_#c3c7cf,-5px_-5px_10px_#ffffff]'
            }`}
          >
            {o}
            <span className={`h-3 w-3 rounded-full ${on ? 'bg-[#7c8aa5]' : 'bg-[#d1d6de]'}`} />
          </button>
        );
      })}
      <button onClick={() => setSel([])} className="mt-1 w-full rounded-2xl px-4 py-2 text-[11px] uppercase tracking-widest text-[#6b7280] shadow-[3px_3px_6px_#c3c7cf,-3px_-3px_6px_#ffffff]">
        Clear
      </button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '国际主义', en: 'Swiss Style' },
    note: {
      zh: '两栏网格配红色标记与发丝分割线，复选项排成无圆角的黑白表格，选中只靠纯黑填充。',
      en: 'A two-column grid with red ticks and hairline rules; checkboxes become square table cells and selection is pure black-and-white fill.',
    },
    Demo: Swiss,
  },
  {
    style: 'bauhaus',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    note: {
      zh: '圆、方、三角作几何标记并以红黄蓝原色填充，粗黑边框把筛选组切成海报式色块。',
      en: 'Circle, square and triangle serve as marks filled in primary red, blue and yellow, thick black borders cutting groups into poster blocks.',
    },
    Demo: Bauhaus,
  },
  {
    style: 'neumorphism',
    name: { zh: '新拟物', en: 'Neumorphism' },
    note: {
      zh: '同一灰底上用双向柔和阴影把选项挤出或压入软陶质感，选中项变成内陷凹槽。',
      en: 'Dual soft shadows on one grey surface extrude or press each option like clay; the selected row becomes an inset groove.',
    },
    Demo: Neumorph,
  },
];

export default styleVariants;
