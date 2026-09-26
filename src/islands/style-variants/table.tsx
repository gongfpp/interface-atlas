import { useState } from 'react';
import type { StyleVariantSet } from './types';

function EditorialTable() {
  const [asc, setAsc] = useState(false);
  const rows = [
    { city: 'Tokyo', pop: 37.4 },
    { city: 'Paris', pop: 11.2 },
    { city: 'Lima', pop: 9.8 },
  ].sort((a, b) => (asc ? a.pop - b.pop : b.pop - a.pop));
  return (
    <div className="mx-auto w-full max-w-md border-t-2 border-ink bg-raised p-5 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Metropolis Index</p>
      <table className="mt-3 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="py-2 font-serif text-sm font-normal italic">City</th>
            <th scope="col" aria-sort={asc ? 'ascending' : 'descending'} className="py-2 text-right font-serif text-sm font-normal italic">
              <button type="button" onClick={() => setAsc((v) => !v)} className="underline-offset-2 hover:underline">
                Population {asc ? '↑' : '↓'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="font-serif">
          {rows.map((r) => (
            <tr key={r.city} className="border-b border-line">
              <td className="py-2 text-sm">{r.city}</td>
              <td className="py-2 text-right text-sm tabular-nums">{r.pop.toFixed(1)}M</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink-3">Serif headers, rule-separated rows, click to sort.</p>
    </div>
  );
}

function SwissTable() {
  const [asc, setAsc] = useState(false);
  const rows = [
    { city: 'Tokyo', units: 37.4 },
    { city: 'Paris', units: 11.2 },
    { city: 'Lima', units: 9.8 },
  ].sort((a, b) => (asc ? a.units - b.units : b.units - a.units));
  return (
    <div className="mx-auto w-full max-w-md bg-white p-4 text-black" style={{ border: '1px solid #000' }}>
      <div className="flex items-center justify-between border-b-2 border-[#e60012] pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Statistik</span>
        <span className="font-mono text-[10px]">2026</span>
      </div>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-widest">
            <th scope="col" className="py-2">City</th>
            <th scope="col" aria-sort={asc ? 'ascending' : 'descending'} className="py-2 text-right">
              <button type="button" onClick={() => setAsc((v) => !v)} className="uppercase tracking-widest">
                Units {asc ? '↑' : '↓'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.city} className="border-t border-black/20">
              <td className="py-2 text-sm font-medium">{r.city}</td>
              <td className="py-2 text-right font-mono text-sm tabular-nums">{r.units.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HandDrawnTable() {
  const rows = [
    ['Milk', '2'],
    ['Bread', '1'],
    ['Eggs', '6'],
  ];
  return (
    <div
      className="mx-auto w-full max-w-md bg-[#fdfaf0] p-5 text-[#2f2a20]"
      style={{ border: '2px dashed #4a4234', borderRadius: '12px 6px 14px 8px' }}
    >
      <p className="font-serif text-lg" style={{ textDecoration: 'underline wavy #b4441f' }}>
        Shopping list
      </p>
      <table className="mt-3 w-full border-collapse">
        <tbody>
          {rows.map(([item, qty], i) => (
            <tr key={item} className={i % 2 ? 'rotate-[-0.4deg]' : 'rotate-[0.3deg]'}>
              <td className="py-2 text-sm">
                <span className="inline-block border-b border-[#4a4234]/60 px-1">{item}</span>
              </td>
              <td className="py-2 text-right font-serif text-sm">{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] italic text-[#4a4234]/70">Rough inked rules, tilted rows, handwritten serif.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: { zh: '杂志编辑风', en: 'Editorial' },
    note: {
      zh: '表头用斜体衬线、行间只用发丝规则线分隔，整张表像杂志的数据栏。',
      en: 'Italic serif headers and hairline row rules make the table read like a magazine data column.',
    },
    Demo: EditorialTable,
  },
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '黑框内用红色粗线压顶，标题全大写紧字距，数字用等宽体右对齐。',
      en: 'Inside a black frame a bold red rule caps the header, with all-caps tight tracking and monospace right-aligned figures.',
    },
    Demo: SwissTable,
  },
  {
    style: 'hand-drawn',
    name: { zh: '手绘涂鸦', en: 'Hand-drawn UI' },
    note: {
      zh: '虚线手绘边框配波浪下划线，每一行略微倾斜，像随手记的清单。',
      en: 'A dashed sketch border and wavy underline, with every row tilted slightly like a scrawled list.',
    },
    Demo: HandDrawnTable,
  },
];

export default styleVariants;
