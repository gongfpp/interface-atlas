import { useState } from 'react';
import type { StyleVariantSet } from './types';

function Flat() {
  const [active, setActive] = useState(0);
  const tabs = ['Design', 'Prototype', 'Specs'];
  const panels = ['Visual system and tokens.', 'Interactive flows and states.', 'Engineering handoff notes.'];
  return (
    <div className="mx-auto w-full max-w-sm bg-paper">
      <div className="flex gap-1">
        {tabs.map((t, i) => (
          <button key={t} type="button" onClick={() => setActive(i)} className={`flex-1 px-3 py-2 text-xs font-medium ${active === i ? 'bg-accent text-white' : 'bg-code-bg text-ink-2 hover:bg-line'}`}>{t}</button>
        ))}
      </div>
      <p className="bg-raised p-4 text-xs leading-relaxed text-ink-2">{panels[active]}</p>
    </div>
  );
}

function LiquidGlass() {
  const [active, setActive] = useState(1);
  const tabs = ['Day', 'Week', 'Month'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2f45] to-[#5b3a6e] p-5">
      <span className="pointer-events-none absolute -top-10 left-1/4 h-24 w-40 rounded-full bg-white/30 blur-2xl" />
      <div className="relative flex rounded-full border border-white/40 bg-white/10 p-1 backdrop-blur-xl">
        {tabs.map((t, i) => (
          <button key={t} type="button" onClick={() => setActive(i)} className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${active === i ? 'bg-white/80 text-[#2a2f45] shadow-[inset_0_1px_1px_rgba(255,255,255,.9)]' : 'text-white/80 hover:bg-white/10'}`}>{t}</button>
        ))}
      </div>
      <p className="relative mt-4 text-center text-[11px] text-white/70">A crystal-clear pill with a specular top highlight.</p>
    </div>
  );
}

function Memphis() {
  const [active, setActive] = useState(0);
  const tabs = ['Pop', 'Jazz', 'Funk'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3e3] p-5" style={{ border: '3px solid #111' }}>
      <span className="pointer-events-none absolute right-4 top-3 text-lg text-[#00a7c4]">◌</span>
      <span className="pointer-events-none absolute bottom-3 left-4 h-4 w-4 rotate-12 bg-[#ff5da2]" style={{ borderRadius: '40% 60% 55% 45%' }} />
      <div className="relative flex gap-2">
        {tabs.map((t, i) => (
          <button key={t} type="button" onClick={() => setActive(i)} className={`px-3 py-2 text-xs font-black uppercase ${i % 2 ? 'rotate-1' : '-rotate-1'} ${active === i ? 'bg-[#ffd23f] shadow-[3px_3px_0_0_#111]' : 'bg-white'}`} style={{ border: '3px solid #111' }}>{t}</button>
        ))}
      </div>
      <p className="relative mt-4 text-xs font-medium text-black/70">Squiggles, dots and clashing colours make the active tab pop.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平设计', en: 'Flat Design' },
    note: {
      zh: '纯色块标签页，零圆角零阴影，选中态就是一块实心强调色。',
      en: 'Solid colour blocks with no radius or shadow — selection is simply a filled accent tile.',
    },
    Demo: Flat,
  },
  {
    style: 'liquid-glass',
    name: { zh: '液态玻璃', en: 'Liquid Glass' },
    note: {
      zh: '几乎透明的胶囊分段控件，选中项是一块带顶部高光的乳白玻璃浮片。',
      en: 'A near-clear pill segmented control whose selection is a milky glass chip with a specular top highlight.',
    },
    Demo: LiquidGlass,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯', en: 'Memphis' },
    note: {
      zh: '倾斜的粗描边色块配几何涂鸦装饰，选中标签弹出一块硬投影的黄。',
      en: 'Tilted, thick-outlined colour blocks with doodled geometry; the active chip pops out on a hard yellow shadow.',
    },
    Demo: Memphis,
  },
];

export default styleVariants;
