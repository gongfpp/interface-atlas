import { useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function useRating(session: VariantDemoProps['session']) {
  const [rating, setRating] = useSessionState(session, 'value', 0);
  const [hover, setHover] = useState(0);
  return { rating, hover, setRating, setHover };
}

function Retro({ session }: VariantDemoProps) {
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-xl bg-gradient-to-b from-[#2a1a2e] to-[#120a1a] p-6 text-center"
      style={{ border: '1px solid #ff8a3d55', boxShadow: 'inset 0 0 24px #ff8a3d22' }}
      onMouseLeave={() => setHover(0)}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8a3d]">Rate the signal</p>
      <div className="my-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className={`text-3xl transition-all ${n <= active ? 'text-[#ffd166]' : 'text-[#ffd16633]'}`}
            style={{ textShadow: n <= active ? '0 0 10px #ff8a3d, 2px 2px 0 #b3400a' : undefined }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-[11px] text-[#ffd166]">{rating ? `LEVEL ${rating}/5` : 'awaiting input'}</p>
    </div>
  );
}

function Y2K({ session }: VariantDemoProps) {
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  return (
    <div className="mx-auto w-full max-w-sm rounded-[28px] bg-gradient-to-br from-[#dff3ff] via-[#f6e6ff] to-[#ffe3f5] p-6 text-center" onMouseLeave={() => setHover(0)}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a4fa0]">rate_me.exe</p>
      <div className="my-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold transition-transform hover:scale-110 ${
              n <= active
                ? 'border-white bg-gradient-to-b from-white via-[#b9f0ff] to-[#7fd2ff] text-[#0b5c8a] shadow-[inset_0_4px_6px_#fff,0_3px_6px_#7fd2ff88]'
                : 'border-white/70 bg-white/40 text-[#a9c4d6]'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-[11px] text-[#7a4fa0]">{rating ? `>> ${rating}/5` : 'click a bubble'}</p>
    </div>
  );
}

function Memphis({ session }: VariantDemoProps) {
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  const colors = ['#ff3d7f', '#ffd23f', '#00b8a9', '#3d5aff', '#ff6b35'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-black bg-[#fef6e4] p-6 text-center" onMouseLeave={() => setHover(0)}>
      <span className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-[#00b8a9]" />
      <span className="absolute bottom-3 left-4 h-2 w-2 rounded-full bg-[#ff3d7f]" />
      <p className="font-black uppercase tracking-tight text-black">Rate it!</p>
      <div className="my-4 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="text-3xl transition-transform hover:rotate-12"
            style={{ color: n <= active ? colors[n - 1] : '#d8cfc0', WebkitTextStroke: '1.5px #000' }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-xs font-bold text-black">{rating ? `${rating} / 5` : 'pick a star'}</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'retro-futurism',
    name: { zh: '复古未来主义', en: 'Retro-futurism' },
    note: {
      zh: '暖色暗底上霓虹描边与硬投影星标发光，像老式仪表盘的读数。',
      en: 'Neon-outlined stars with a hard offset shadow glow on a warm dark base like an old dashboard readout.',
    },
    Demo: Retro,
  },
  {
    style: 'y2k',
    name: { zh: '千禧风', en: 'Y2K' },
    note: {
      zh: '镀铬泡泡按钮带内高光与粉蓝渐变底，选中像被点亮的玻璃球。',
      en: 'Chrome bubble buttons with inner highlights on a pink-blue gradient light up like glossy glass orbs.',
    },
    Demo: Y2K,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯', en: 'Memphis' },
    note: {
      zh: '粗黑描边彩色星形配撞色圆点装饰，选中的颜色从鲜艳噪声里跳出来。',
      en: 'Black-stroked stars in clashing brights with dot confetti; the chosen colour pops out of the playful noise.',
    },
    Demo: Memphis,
  },
];

export default styleVariants;
