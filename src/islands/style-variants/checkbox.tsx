import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Neumorph({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'checked', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#e6ebf2] p-6 text-[#5a6473]">
      <p className="mb-4 text-xs font-semibold tracking-wide">Preferences</p>
      <button
        onClick={() => setOn(!on)}
        className={`flex w-full items-center gap-4 rounded-xl bg-[#e6ebf2] px-4 py-3 text-left transition-all duration-200 ${
          on
            ? 'shadow-[6px_6px_12px_#c3cad6,-6px_-6px_12px_#ffffff]'
            : 'shadow-[inset_5px_5px_10px_#c3cad6,inset_-5px_-5px_10px_#ffffff]'
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md bg-[#e6ebf2] text-xs font-bold transition-all duration-200 ${
            on
              ? 'text-[#5566ff] shadow-[inset_2px_2px_4px_#c3cad6,inset_-2px_-2px_4px_#ffffff]'
              : 'text-transparent shadow-[3px_3px_6px_#c3cad6,-3px_-3px_6px_#ffffff]'
          }`}
        >
          ✓
        </span>
        <span className="text-sm">Email me the digest</span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#8b93a3]">The row extrudes from the same clay surface; checking it inverts the dual shadows to sink inward.</p>
    </div>
  );
}

function Pixel({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'checked', false);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#1a1c2c] p-5 font-mono text-[#f4f4f4]">
      <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#94b0c2]">Options</p>
      <button onClick={() => setOn(!on)} className="flex w-full items-center gap-3 border-4 border-[#94b0c2] bg-[#333c57] p-3 text-left">
        <span
          className={`flex h-6 w-6 items-center justify-center border-4 text-[10px] font-bold ${
            on ? 'border-[#41a6f6] bg-[#41a6f6] text-[#1a1c2c]' : 'border-[#94b0c2] bg-[#1a1c2c] text-transparent'
          }`}
        >
          X
        </span>
        <span className="text-xs">{on ? 'MUSIC ON' : 'MUSIC OFF'}</span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#94b0c2]">Chunky square borders in a minimal palette; the box snaps between two pixel states with no easing.</p>
    </div>
  );
}

function Neobrutal({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'checked', true);
  return (
    <div className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#ffe066] p-5 text-black">
      <button
        onClick={() => setOn(!on)}
        className={`flex w-full items-center gap-3 border-[3px] border-black px-3 py-3 text-left transition-all duration-100 ${
          on ? 'bg-white shadow-none' : 'bg-[#ff8fab] shadow-[4px_4px_0_0_#000]'
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center border-[3px] border-black text-sm font-black ${
            on ? 'bg-black text-white' : 'bg-white text-transparent'
          }`}
        >
          ✓
        </span>
        <span className="text-xs font-black uppercase tracking-wider">I accept the terms</span>
      </button>
      <p className="mt-4 text-[11px] font-medium leading-relaxed">A 3px outline with an offset shadow; ticking drops the shadow so the row looks physically pressed.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neumorphism',
    name: { zh: '新拟态', en: 'Neumorphism' },
    note: {
      zh: '整行从同色黏土面挤出，勾选时内外双阴影反向，凹陷感和浮起感互换。',
      en: 'The row is extruded from a same-colour clay surface; checking flips the dual shadows so raised becomes sunken.',
    },
    Demo: Neumorph,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素风', en: 'Pixel Art UI' },
    note: {
      zh: '4px 方角粗边配合寥寥几色的调色板，勾选框在两帧像素状态间硬切换。',
      en: 'Chunky 4px square borders and a tiny palette; the box snaps between two pixel states without easing.',
    },
    Demo: Pixel,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '3px 黑描边加硬边投影，勾选后投影消失、方块反转为黑，反馈被直接放大。',
      en: 'A 3px outline with a hard offset shadow; ticking removes the shadow and inverts the box to black.',
    },
    Demo: Neobrutal,
  },
];

export default styleVariants;
