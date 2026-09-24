import { useState } from 'react';
import type { StyleVariantSet } from './types';

function MinimalProgress() {
  const [pct, setPct] = useState(45);
  return (
    <div className="mx-auto w-full max-w-sm border border-line bg-raised p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Uploading</span>
        <span className="font-mono text-xs tabular-nums text-ink">{pct}%</span>
      </div>
      <div className="mt-4 h-[3px] w-full bg-line">
        <div className="h-[3px] bg-ink transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <button
        onClick={() => setPct((p) => (p >= 100 ? 0 : p + 20))}
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink"
      >
        Advance
      </button>
    </div>
  );
}

function BauhausProgress() {
  const [step, setStep] = useState(3);
  const cols = ['#e02b20', '#1f4fd8', '#f4c400'];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#f4efe4] p-5 text-black" style={{ border: '3px solid #000' }}>
      <div className="flex items-end justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.15em]">Install</span>
        <span className="font-mono text-lg font-black tabular-nums">{step * 10}%</span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            aria-label={`${(i + 1) * 10}%`}
            className="h-6 flex-1"
            style={{ background: i < step ? cols[i % 3] : '#fff', border: '2px solid #000' }}
          />
        ))}
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider">Ten blocks · primary triad</p>
    </div>
  );
}

function PixelProgress() {
  const [pct, setPct] = useState(40);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#0d0d12] p-5 font-mono text-[#e8e8ff]">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
        <span>Loading world</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-3 flex gap-[3px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-5 flex-1" style={{ background: i * 5 < pct ? '#5ff06a' : '#26263a' }} />
        ))}
      </div>
      <button
        onClick={() => setPct((p) => (p >= 100 ? 0 : p + 20))}
        className="mt-4 border-2 border-[#5ff06a] px-2 py-1 text-[10px] uppercase tracking-widest text-[#5ff06a]"
      >
        Step
      </button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '轨道与填充都压到 3px 直角细线，只保留墨水色和等宽百分比，进度靠长度本身说话。',
      en: 'Track and fill collapse to a 3px square hairline, leaving only ink and a mono percentage so length alone carries the progress.',
    },
    Demo: MinimalProgress,
  },
  {
    style: 'bauhaus',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    note: {
      zh: '把连续填充拆成十个黑框方块，用红黄蓝三原色循环上色，进度变成可点击的几何色块。',
      en: 'The continuous fill breaks into ten black-framed blocks cycled through the red-yellow-blue triad, turning progress into clickable geometry.',
    },
    Demo: BauhausProgress,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素艺术', en: 'Pixel Art' },
    note: {
      zh: '二十格硬边像素在近黑底上用荧光绿逐格点亮，等宽字与直角共同维持 8-bit 语汇。',
      en: 'Twenty hard-edged pixels light up in neon green on near-black, with monospace type and right angles keeping the 8-bit vocabulary.',
    },
    Demo: PixelProgress,
  },
];

export default styleVariants;
