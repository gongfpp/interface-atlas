import { useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Swiss({ session }: VariantDemoProps) {
  const [active, setActive] = useSessionState(session, 'active', 'Work');
  const items = ['Work', 'Studio', 'Contact'];
  return (
    <div className="mx-auto w-full max-w-md bg-white px-5 py-3 text-black" style={{ borderBottom: '3px solid #111' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight">Atlas<span className="text-[#d0021b]">.</span></span>
        <nav className="flex gap-5 text-[12px]">
          {items.map((it) => (
            <button key={it} type="button" onClick={() => setActive(it)} className={`relative py-1 ${active === it ? 'font-semibold' : 'text-black/55 hover:text-black'}`}>
              {it}
              {active === it && <span className="absolute inset-x-0 -bottom-[13px] h-[3px] bg-[#d0021b]" />}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Neobrutal(_props: VariantDemoProps) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center justify-between bg-[#ffd23f] px-4 py-3 text-black shadow-[5px_5px_0_0_#000]" style={{ border: '3px solid #000' }}>
        <span className="text-sm font-black uppercase tracking-wide">Atlas★</span>
        <button type="button" aria-label="Toggle menu" onClick={() => setMenu(!menu)} className="text-lg font-black sm:hidden">☰</button>
        <nav className="hidden gap-4 text-xs font-black uppercase sm:flex">
          <span className="border-b-[3px] border-black">Work</span>
          <span>Shop</span>
          <span>About</span>
        </nav>
      </div>
      {menu && (
        <div className="mt-2 bg-white px-4 py-2 text-xs font-bold uppercase shadow-[5px_5px_0_0_#000]" style={{ border: '3px solid #000' }}>
          Work · Shop · About
        </div>
      )}
    </div>
  );
}

function Glass({ session }: VariantDemoProps) {
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = ['Home', 'Explore', 'Saved'];
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-r from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-2">
      <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-white backdrop-blur-md">
        <span className="text-sm font-semibold">Atlas</span>
        <nav className="flex gap-1 text-xs">
          {items.map((it, i) => (
            <button key={it} type="button" onClick={() => setActive(i)} className={`rounded-full px-3 py-1 transition-colors ${active === i ? 'bg-white/35 font-semibold' : 'text-white/75 hover:bg-white/15'}`}>{it}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '严格左右分栏，粗底线收口，选中项用一条红色标尺线强调，信息按网格对齐。',
      en: 'A strict left/right grid closed by a heavy rule, with a red measuring line marking the active item.',
    },
    Demo: Swiss,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '亮黄导航条配 3px 黑描边和硬投影，移动端折叠成同名下拉块。',
      en: 'A bright yellow bar with a 3px black outline and hard offset shadow that collapses into a dropdown on small screens.',
    },
    Demo: Neobrutal,
  },
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '导航本体是一条磨砂胶囊，浮在彩色渐变上，活跃项用更亮的玻璃块表示。',
      en: 'The bar itself is a frosted pill floating over a colourful gradient, the active item a brighter pane of glass.',
    },
    Demo: Glass,
  },
];

export default styleVariants;
