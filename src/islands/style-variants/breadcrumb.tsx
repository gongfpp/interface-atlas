import type { StyleVariantSet } from './types';

function Editorial() {
  return (
    <div className="mx-auto w-full max-w-sm border-y border-ink bg-paper py-3">
      <nav className="flex items-center justify-center gap-2 font-serif text-[13px]">
        <span className="text-ink-3">Journal</span>
        <span className="text-accent">/</span>
        <span className="text-ink-3">Design</span>
        <span className="text-accent">/</span>
        <span className="font-semibold text-ink">Archive</span>
      </nav>
    </div>
  );
}

function Pixel() {
  return (
    <div className="mx-auto w-full max-w-sm bg-[#1a1c2c] p-4 font-mono text-[#f4f4f4]" style={{ border: '4px solid #566c86', boxShadow: '4px 4px 0 0 #333c57' }}>
      <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase">
        <span className="bg-[#566c86] px-2 py-1">Home</span>
        <span className="text-[#41a6f6]">►</span>
        <span className="px-1 py-1 text-[#94b0c2]">Games</span>
        <span className="text-[#41a6f6]">►</span>
        <span className="bg-[#ef7d57] px-2 py-1 text-[#1a1c2c]">RPG</span>
      </nav>
    </div>
  );
}

function Brutal() {
  return (
    <div className="mx-auto w-full max-w-sm bg-white p-4 text-black" style={{ border: '4px solid #000' }}>
      <nav className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold uppercase">
        <span className="underline">ROOT</span>
        <span className="text-2xl leading-none">//</span>
        <span className="text-black/60">SYS</span>
        <span className="text-2xl leading-none">//</span>
        <span className="bg-black px-2 py-0.5 text-white">CONFIG</span>
      </nav>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: { zh: '杂志编辑', en: 'Editorial' },
    note: {
      zh: '上下双规则线夹住一行居中衬线路径，只用朱砂斜杠层级分隔。',
      en: 'A centred serif path held between two rules, with vermilion slashes the only hierarchy cue.',
    },
    Demo: Editorial,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素艺术', en: 'Pixel Art' },
    note: {
      zh: '4px 硬像素边框与直角色块，用三角箭头当分隔符，末级路径反白高亮。',
      en: 'Hard 4px pixel borders and square colour chips, with triangle separators and the last crumb inverted.',
    },
    Demo: Pixel,
  },
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '超大号等宽双斜杠强行断开层级，黑白硬对比，当前页直接反色成黑块。',
      en: 'Oversized monospace double-slashes violently split the levels; the current page inverts to a black block.',
    },
    Demo: Brutal,
  },
];

export default styleVariants;
