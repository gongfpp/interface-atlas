import { useState } from 'react';
import type { StyleVariantSet } from './types';

function FlatAvatar() {
  const people: [string, string][] = [
    ['AL', '#ff6b6b'],
    ['MK', '#4d96ff'],
    ['JS', '#ffd93d'],
    ['RT', '#6bcb77'],
  ];
  return (
    <div className="mx-auto w-full max-w-sm bg-raised p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Team</p>
      <div className="mt-3 flex -space-x-2">
        {people.map(([init, color]) => (
          <span
            key={init}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-raised text-xs font-bold text-white"
            style={{ background: color }}
          >
            {init}
          </span>
        ))}
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-code-bg text-xs font-bold text-ink-2">+8</span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-2">Solid fills and zero depth; overlap and hue alone carry identity.</p>
    </div>
  );
}

function MemphisAvatar() {
  const [picked, setPicked] = useState(0);
  const people = ['A', 'B', 'C'];
  const colors = ['#ff3d9a', '#00d2e0', '#ffe23d'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3ff] p-5 text-black" style={{ border: '3px solid #000' }}>
      <span className="absolute right-4 top-3 h-4 w-4 rounded-full" style={{ background: '#00d2e0' }} />
      <span className="absolute right-9 top-7 h-2 w-2 rounded-full bg-black" />
      <p className="text-xs font-black uppercase tracking-[0.15em]">Pick a buddy</p>
      <div className="mt-4 flex gap-4">
        {people.map((p, i) => (
          <button
            key={p}
            onClick={() => setPicked(i)}
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-black transition-transform"
            style={{
              background: colors[i],
              transform: picked === i ? 'translate(2px,2px)' : 'none',
              boxShadow: picked === i ? '2px 2px 0 #000' : '4px 4px 0 #000',
              outline: '3px solid #000',
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-bold">Clashing candy colours, hard black offsets and confetti dots.</p>
    </div>
  );
}

function DecoAvatar() {
  return (
    <div className="mx-auto w-full max-w-sm bg-[#10131c] p-6 text-center" style={{ border: '1px solid #c8a24a' }}>
      <div className="mx-auto flex w-fit items-center gap-3 text-[#c8a24a]">
        <span className="h-px w-10 bg-[#c8a24a]" />
        <span className="text-[10px] tracking-[0.4em]">MEMBER</span>
        <span className="h-px w-10 bg-[#c8a24a]" />
      </div>
      <div className="mx-auto mt-5 flex h-20 w-20 rotate-45 items-center justify-center border-2 border-[#c8a24a]">
        <span className="-rotate-45 font-serif text-3xl text-[#f3e6c4]">A</span>
      </div>
      <p className="mt-6 font-serif text-lg text-[#f3e6c4]">Amelia Ford</p>
      <p className="font-serif text-[11px] italic text-[#c8a24a]">Curator</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平设计', en: 'Flat Design' },
    note: {
      zh: '纯色圆形叠放成头像组，没有阴影或渐变，只靠色相与白色描边区分个体。',
      en: 'Solid-colour circles stack into an avatar group with no shadow or gradient, using only hue and a white ring to separate members.',
    },
    Demo: FlatAvatar,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯', en: 'Memphis' },
    note: {
      zh: '荧光粉蓝黄圆头像配 4px 黑色硬投影与随机圆点，选中时头像向左上“压扁”位移。',
      en: 'Neon pink, cyan and yellow circles carry 4px black hard shadows and stray dots, and the chosen one hops into its own shadow.',
    },
    Demo: MemphisAvatar,
  },
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '深底金色双线轴对称，首字母嵌在旋转 45° 的菱形徽章里，配衬线姓名与斜体头衔。',
      en: 'Dark gold hairlines mirror symmetrically around an initial set in a 45°-rotated lozenge, finished with serif name and italic title.',
    },
    Demo: DecoAvatar,
  },
];

export default styleVariants;
