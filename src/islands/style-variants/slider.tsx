import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
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
        aria-label={zh ? '数值' : 'Value'}
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-5 h-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:border-2 [&::-webkit-slider-runnable-track]:border-black [&::-webkit-slider-runnable-track]:bg-[#ffe600] [&::-moz-range-track]:h-4 [&::-moz-range-track]:border-2 [&::-moz-range-track]:border-black [&::-moz-range-track]:bg-[#ffe600] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white ${thumb}`}
      />
      <p className="mt-4 text-[11px] leading-relaxed">{zh ? "粗黑黄轨道与巨大等宽读数，仅调节本地示例数值。" : "An oversized raw numeral over a fat black-and-yellow track \u2014 utility stripped to monospace and weight. Local value only."}</p>
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
        aria-label={zh ? '数值' : 'Value'}
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 relative mt-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-[#22d3ee] [&::-webkit-slider-runnable-track]:to-[#ff6ec7] [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-[#22d3ee] [&::-moz-range-track]:to-[#ff6ec7] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_14px_#ff6ec7] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_14px_#ff6ec7] ${track} ${thumb}`}
      />
      <p className="relative mt-4 text-[11px] leading-relaxed text-[#c9a6d8]">{zh ? "青粉渐变轨道浮在霓虹网格上，仅调节本地示例数值。" : "A cyan-to-pink gradient track above a glowing neon horizon grid; the thumb is a chrome-white orb. Local value only."}</p>
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
        aria-label={zh ? '数值' : 'Value'}
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:bg-[#dfe2cf] [&::-moz-range-track]:h-3 [&::-moz-range-track]:bg-[#dfe2cf] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8f4e] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_#00000033] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#6b8f4e] ${track} ${thumb}`}
      />
      <p className="mt-4 text-[11px] leading-relaxed text-[#7c8468]">{zh ? "鼠尾草色旋钮与石色圆轨，仅调节本地示例数值。" : "An earthy sage thumb on a soft stone track inside a large-radius card \u2014 gentle, rounded and grounded. Local value only."}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [value, setValue] = useSessionState(session, 'value', 50);
  const shape = style === 'minimalism' || style === 'swiss-style' || style === 'neobrutalism' ? '[&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:rounded-none' : '[&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:rounded-full';
  return <RecipeFrame style={style} locale={locale} title={zh ? '音量调节' : 'Volume control'}>
    <label className="block text-sm">{zh ? '音量' : 'Volume'}
      <output className={`mt-2 block p-3 text-3xl font-semibold tabular-nums ${r.item}`}>{value}%</output>
      <input type="range" min={0} max={100} step={1} value={value} onChange={(event) => setValue(Number(event.target.value))} aria-valuetext={`${value}%`} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-4 h-12 w-full cursor-pointer appearance-none p-2 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-current [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-current [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-current [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-current [&::-moz-range-thumb]:bg-white ${shape} ${r.field}`} />
    </label>
    <div className={`mt-1 flex justify-between text-xs ${r.muted}`}><span>0%</span><span>100%</span></div>
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" onClick={() => setValue(Math.max(0, value - 10))} disabled={value <= 0} className={r.secondary}>{zh ? '减小 10' : 'Decrease 10'}</button>
      <button type="button" onClick={() => setValue(Math.min(100, value + 10))} disabled={value >= 100} className={r.secondary}>{zh ? '增大 10' : 'Increase 10'}</button>
      <button type="button" onClick={() => setValue(50)} className={r.secondary}>{zh ? '重置' : 'Reset'}</button>
    </div>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '巨大等宽数字压在粗黑下划线之上，滑块是黑黄拼色的粗方轨，毫不修饰。',
      en: 'A huge monospace numeral over a thick black rule, with a fat black-and-yellow square track and zero polish.',
    },
    Demo: Brutal,
  },
  {
    style: 'vaporwave',
    name: {"zh":"蒸汽波","en":"Vaporwave"},
    note: {
      zh: '青到粉的渐变轨道浮在发光霓虹地平网格上，白色圆钮带粉色辉光，数字大而斜。',
      en: 'A cyan-to-pink gradient track floats over a glowing neon horizon grid, with a white orb thumb and an italic numeral.',
    },
    Demo: Vapor,
  },
  {
    style: 'organic',
    name: {"zh":"有机自然","en":"Organic"},
    note: {
      zh: '大圆角卡片里一条柔和石色轨道，鼠尾草绿的圆钮带极轻投影，整体松弛自然。',
      en: 'A soft stone track in a large-radius card with a sage-green circular thumb and the faintest shadow — calm and grounded.',
    },
    Demo: Organic,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；轨道与旋钮几何呼应数值面板，支持键盘调节、增减和重置。", en: "Hairlines, monochrome inversion and whitespace; track and thumb geometry echoes the readout with native keyboard input, step controls and reset." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；轨道与旋钮几何呼应数值面板，支持键盘调节、增减和重置。", en: "Solid blocks and clear hierarchy without shadows; track and thumb geometry echoes the readout with native keyboard input, step controls and reset." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；轨道与旋钮几何呼应数值面板，支持键盘调节、增减和重置。", en: "An indexed grid, square edges and a red accent; track and thumb geometry echoes the readout with native keyboard input, step controls and reset." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；轨道与旋钮几何呼应数值面板，支持键盘调节、增减和重置。", en: "Heavy black outlines, hard shadows and bold selection; track and thumb geometry echoes the readout with native keyboard input, step controls and reset." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；轨道与旋钮几何呼应数值面板，支持键盘调节、增减和重置。", en: "Shared soft surfaces, paired shadows and explicit borders; track and thumb geometry echoes the readout with native keyboard input, step controls and reset." }),
];

export default styleVariants;
