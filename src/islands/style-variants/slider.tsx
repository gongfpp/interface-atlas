import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const track = '[&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:rounded-full';
const thumb =
  '[&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:cursor-pointer';

function Brutal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 72);
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-black bg-white p-6 font-mono text-black">
      <div className="flex items-end justify-between border-b-4 border-black pb-2">
        <span className="text-xs font-bold uppercase">{zh ? '音量' : 'Volume'}</span>
        <span className="text-5xl font-black leading-none tracking-tighter">{v}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`mt-5 h-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:border-2 [&::-webkit-slider-runnable-track]:border-black [&::-webkit-slider-runnable-track]:bg-[#ffe600] [&::-moz-range-track]:h-4 [&::-moz-range-track]:border-2 [&::-moz-range-track]:border-black [&::-moz-range-track]:bg-[#ffe600] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white ${thumb}`}
      />
      <p className="mt-4 text-[11px] leading-relaxed">An oversized raw numeral over a fat black-and-yellow track — utility stripped to monospace and weight.</p>
    </div>
  );
}

function Vapor({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 55);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-gradient-to-b from-[#1a103c] to-[#3a0f5c] p-6 text-[#ffd9f7]">
      <div
        className="absolute inset-x-0 bottom-0 h-16 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(#ff6ec7 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.4em] text-[#22d3ee]">{zh ? '频率' : 'Frequency'}</p>
      <p className="relative mt-1 text-3xl font-black italic text-[#ff6ec7] drop-shadow-[0_0_10px_#ff6ec7]">{v}%</p>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`relative mt-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-[#22d3ee] [&::-webkit-slider-runnable-track]:to-[#ff6ec7] [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-[#22d3ee] [&::-moz-range-track]:to-[#ff6ec7] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_14px_#ff6ec7] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_14px_#ff6ec7] ${track} ${thumb}`}
      />
      <p className="relative mt-4 text-[11px] leading-relaxed text-[#c9a6d8]">A cyan-to-pink gradient track above a glowing neon horizon grid; the thumb is a chrome-white orb.</p>
    </div>
  );
}

function Organic({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 40);
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-[#f1efe3] p-6 text-[#39452f]">
      <p className="font-serif text-lg">{zh ? '饮水量' : 'Water intake'}</p>
      <p className="mt-1 text-xs text-[#7c8468]">{zh ? `每日目标的 ${v}%` : `${v}% of your daily goal`}</p>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`mt-5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:bg-[#dfe2cf] [&::-moz-range-track]:h-3 [&::-moz-range-track]:bg-[#dfe2cf] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8f4e] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_#00000033] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#6b8f4e] ${track} ${thumb}`}
      />
      <p className="mt-4 text-[11px] leading-relaxed text-[#7c8468]">An earthy sage thumb on a soft stone track inside a large-radius card — gentle, rounded and grounded.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '巨大等宽数字压在粗黑下划线之上，滑块是黑黄拼色的粗方轨，毫不修饰。',
      en: 'A huge monospace numeral over a thick black rule, with a fat black-and-yellow square track and zero polish.',
    },
    Demo: Brutal,
  },
  {
    style: 'vaporwave',
    name: { zh: '蒸汽波', en: 'Vaporwave' },
    note: {
      zh: '青到粉的渐变轨道浮在发光霓虹地平网格上，白色圆钮带粉色辉光，数字大而斜。',
      en: 'A cyan-to-pink gradient track floats over a glowing neon horizon grid, with a white orb thumb and an italic numeral.',
    },
    Demo: Vapor,
  },
  {
    style: 'organic',
    name: { zh: '有机自然', en: 'Organic' },
    note: {
      zh: '大圆角卡片里一条柔和石色轨道，鼠尾草绿的圆钮带极轻投影，整体松弛自然。',
      en: 'A soft stone track in a large-radius card with a sage-green circular thumb and the faintest shadow — calm and grounded.',
    },
    Demo: Organic,
  },
];

export default styleVariants;
