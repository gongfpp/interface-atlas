import { useState } from 'react';
import type { StyleVariantSet } from './types';

function Neumorph() {
  const [page, setPage] = useState(3);
  const raised = 'shadow-[5px_5px_10px_#c3c4cb,-5px_-5px_10px_#ffffff]';
  const pressed = 'shadow-[inset_5px_5px_10px_#c3c4cb,inset_-5px_-5px_10px_#ffffff]';
  return (
    <div className="mx-auto w-full max-w-sm bg-[#e6e7ee] p-5">
      <div className="flex items-center justify-center gap-3">
        <button type="button" aria-label="Previous page" onClick={() => setPage(Math.max(1, page - 1))} className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm text-[#6b6f80] ${raised}`}>‹</button>
        {[1, 2, 3, 4].map((n) => (
          <button key={n} type="button" onClick={() => setPage(n)} className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${page === n ? `text-[#5b5f70] ${pressed}` : 'text-[#8a8e9e] ' + raised}`}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function Vapor() {
  const [page, setPage] = useState(2);
  return (
    <div className="mx-auto w-full max-w-sm bg-gradient-to-b from-[#2b1055] to-[#7597de] p-5 text-center">
      <div className="flex items-center justify-center gap-3 font-mono text-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setPage(n)} className={`h-9 w-9 ${page === n ? 'bg-[#ff71ce] text-[#2b1055] shadow-[0_0_18px_#ff71ce]' : 'border border-[#01cdfe]/60 text-[#01cdfe] hover:bg-[#01cdfe]/10'}`}>{n}</button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#b967ff]">Page {page} / 5</p>
    </div>
  );
}

function Swiss() {
  const [page, setPage] = useState(2);
  return (
    <div className="mx-auto w-full max-w-sm bg-white py-3 text-black" style={{ borderTop: '3px solid #111', borderBottom: '3px solid #111' }}>
      <div className="flex items-stretch justify-center divide-x divide-black/15 font-mono text-sm">
        <button type="button" aria-label="Previous page" onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 text-black/50 hover:text-[#d0021b]">←</button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setPage(n)} className={`px-3 py-1 ${page === n ? 'bg-[#d0021b] font-bold text-white' : 'hover:bg-black/5'}`}>{n}</button>
        ))}
        <button type="button" aria-label="Next page" onClick={() => setPage(Math.min(5, page + 1))} className="px-3 py-1 text-black/50 hover:text-[#d0021b]">→</button>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neumorphism',
    name: { zh: '新拟物', en: 'Neumorphism' },
    note: {
      zh: '同色底上靠双向柔光投影把页码“挤”出来，当前页则向内凹陷。',
      en: 'Pages are extruded from a same-colour surface by dual soft shadows; the current page is pressed inward.',
    },
    Demo: Neumorph,
  },
  {
    style: 'vaporwave',
    name: { zh: '蒸汽波', en: 'Vaporwave' },
    note: {
      zh: '紫蓝渐变底上等宽页码，选中页是发着粉色辉光的方块。',
      en: 'Monospaced page numbers on a purple-blue gradient, the active page a square glowing pink.',
    },
    Demo: Vapor,
  },
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '上下粗规则线夹住等分方格，当前页是唯一的红色实心块。',
      en: 'Equal grid cells between heavy double rules, with the current page as the single red solid block.',
    },
    Demo: Swiss,
  },
];

export default styleVariants;
