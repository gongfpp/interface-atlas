import { useState } from 'react';
import type { StyleVariantSet } from './types';

const editions = [
  { kicker: 'Feature', title: 'The Quiet Grid', deck: 'Whitespace as structure, rules as rhythm.' },
  { kicker: 'Essay', title: 'Type at Scale', deck: 'A display serif carries the hierarchy.' },
  { kicker: 'Profile', title: 'Paper & Ink', deck: 'Masthead, deck, caption — nothing else.' },
];

function Editorial() {
  const [i, setI] = useState(0);
  const s = editions[i];
  return (
    <div className="mx-auto w-full max-w-sm border border-line bg-raised p-6 font-serif text-ink">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">
        <span>Atlas Review</span>
        <span>{i + 1} / {editions.length}</span>
      </div>
      <div className="mt-5 min-h-28">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{s.kicker}</p>
        <h3 className="mt-2 text-2xl leading-tight">{s.title}</h3>
        <p className="mt-2 text-sm italic leading-relaxed text-ink-2">{s.deck}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-[11px] uppercase tracking-widest">
        <button onClick={() => setI((i + editions.length - 1) % editions.length)} className="hover:text-accent">← Prev</button>
        <span className="flex gap-1.5">
          {editions.map((_, n) => (
            <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-1.5 w-1.5 rounded-full ${n === i ? 'bg-ink' : 'bg-line-strong'}`} />
          ))}
        </span>
        <button onClick={() => setI((i + 1) % editions.length)} className="hover:text-accent">Next →</button>
      </div>
    </div>
  );
}

const feeds = ['NEON DISTRICT', 'CHROME RAIN', 'DATA DRIFT'];

function Cyberpunk() {
  const [i, setI] = useState(0);
  return (
    <div className="mx-auto w-full max-w-sm border border-[#00f0ff]/60 bg-[#08080f] p-5 font-mono text-[#7df9ff] shadow-[0_0_22px_rgba(0,240,255,0.3)]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#ff2bd6]">
        <span>// feed_{i + 1}</span>
        <span>sys.ok</span>
      </div>
      <div className="mt-4 border-l-2 border-[#ff2bd6] pl-3">
        <h3 className="text-lg tracking-wide text-[#eaffff]">{feeds[i]}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-[#7df9ff]/70">night market · chrome rain · data drift</p>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs">
        <button onClick={() => setI((i + feeds.length - 1) % feeds.length)} className="border border-[#00f0ff] px-3 py-1 hover:bg-[#00f0ff] hover:text-[#08080f]">[ &lt; ]</button>
        <button onClick={() => setI((i + 1) % feeds.length)} className="border border-[#00f0ff] px-3 py-1 hover:bg-[#00f0ff] hover:text-[#08080f]">[ &gt; ]</button>
        <span className="ml-auto flex gap-1">
          {feeds.map((_, n) => <span key={n} className={`h-3 w-1 ${n === i ? 'bg-[#ff2bd6]' : 'bg-[#00f0ff]/30'}`} />)}
        </span>
      </div>
    </div>
  );
}

const frames = ['STAGE 1UP', 'STAGE QUEST', 'STAGE SAVE'];

function Pixel() {
  const [i, setI] = useState(0);
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-[#41a6f6] bg-[#1a1c2c] p-5 font-mono text-[#f4f4f4]">
      <div className="flex items-center justify-between text-[10px] uppercase text-[#ef7d57]">
        <span>◆ atlas.exe</span>
        <span>{i + 1}/{frames.length}</span>
      </div>
      <div className="mt-4 min-h-24 border-4 border-[#566c86] bg-[#333c57] p-4">
        <h3 className="text-base uppercase tracking-widest">{frames[i]}</h3>
        <p className="mt-2 text-[11px] uppercase leading-relaxed text-[#94b0c2]">press start to continue</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => setI((i + frames.length - 1) % frames.length)} className="border-4 border-[#41a6f6] px-3 py-1 text-xs uppercase text-[#41a6f6] hover:bg-[#41a6f6] hover:text-[#1a1c2c]">◀◀</button>
        <span className="flex gap-1">
          {frames.map((_, n) => <span key={n} className={`h-2 w-3 ${n === i ? 'bg-[#ef7d57]' : 'bg-[#566c86]'}`} />)}
        </span>
        <button onClick={() => setI((i + 1) % frames.length)} className="border-4 border-[#41a6f6] px-3 py-1 text-xs uppercase text-[#41a6f6] hover:bg-[#41a6f6] hover:text-[#1a1c2c]">▶▶</button>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: { zh: '杂志编辑风', en: 'Editorial' },
    note: {
      zh: '把轮播做成杂志跨页：衬线大标题配上下细线，页码取代圆点，翻页是字距很开的小字。',
      en: 'The carousel becomes a magazine spread — serif display headline, hairline rules, page numbers instead of dots.',
    },
    Demo: Editorial,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底上的霓虹描边与辉光，方括号导航和竖条进度条模拟终端讯号。',
      en: 'Neon outlines and glow on near-black, with bracketed nav and vertical progress bars reading like a terminal feed.',
    },
    Demo: Cyberpunk,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素风', en: 'Pixel Art UI' },
    note: {
      zh: '全直角加粗像素边框、等宽大写字母和 NES 调色板，翻页键形如手柄按钮。',
      en: 'Hard pixel corners, chunky borders, monospace caps and an NES palette make the slides feel like a game cartridge screen.',
    },
    Demo: Pixel,
  },
];

export default styleVariants;
