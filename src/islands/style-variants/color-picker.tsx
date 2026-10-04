import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const NEON = [
  { hex: '#00f0ff', name: 'CYAN' },
  { hex: '#ff2e88', name: 'MAGENTA' },
  { hex: '#f7ff3c', name: 'VOLT' },
  { hex: '#8f00ff', name: 'VIOLET' },
];
const MEMPHIS = ['#ff5c8a', '#ffd23f', '#3ddc97', '#4d7cff'];
const EARTH = [
  { hex: '#7f9d6b', name: 'Sage' },
  { hex: '#c8a27a', name: 'Clay' },
  { hex: '#a65e4e', name: 'Terracotta' },
  { hex: '#5f7a86', name: 'River' },
];

function CyberpunkColorPicker({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [value, setValue] = useSessionState(session, 'value', '#00f0ff');
  const [, setSelected] = useSessionState(session, 'selected', 0);
  const pick = (hex: string, i: number) => {
    setValue(hex);
    setSelected(i);
  };
  return (
    <div className="mx-auto w-full max-w-sm border border-[#00f0ff]/40 bg-[#05060a] p-5 font-mono text-[#9ffcff] shadow-[0_0_24px_#00f0ff22]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff2e88]">▚ {en ? 'Palette.exe' : '调色板.exe'}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {NEON.map((c, i) => {
          const on = value === c.hex;
          return (
            <button
              key={c.hex}
              aria-label={`${c.name} ${c.hex}`}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c.hex, i)}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 h-14 border-2 transition-transform hover:-translate-y-0.5"
              style={{
                background: c.hex,
                borderColor: on ? '#fff' : '#00f0ff55',
                boxShadow: on ? `0 0 16px ${c.hex}` : 'none',
              }}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-3 py-2 text-[11px]">
        <span style={{ color: value }}>{NEON.find((c) => c.hex === value)?.name ?? (en ? 'CUSTOM' : '自定义')}</span>
        <span className="text-[#9ffcff]/70">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

function MemphisColorPicker({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [value, setValue] = useSessionState(session, 'value', '#ff5c8a');
  const [, setSelected] = useSessionState(session, 'selected', 0);
  const pick = (hex: string, i: number) => {
    setValue(hex);
    setSelected(i);
  };
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden border-4 border-black bg-white p-6 text-black">
      <span className="pointer-events-none absolute right-4 top-3 text-2xl">〰️</span>
      <span className="pointer-events-none absolute bottom-3 left-4 text-xl">● ● ●</span>
      <p className="text-sm font-black uppercase tracking-wider">{en ? 'Pick a shade' : '选个颜色'}</p>
      <div className="mt-5 flex flex-wrap gap-4 pl-2">
        {MEMPHIS.map((c, i) => {
          const on = value === c;
          return (
            <button
              key={c}
              aria-label={en ? `Choose ${c}` : `选择 ${c}`}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c, i)}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 h-14 w-14 border-4 border-black transition-transform"
              style={{
                background: c,
                borderRadius: i % 2 ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
                transform: on ? 'rotate(-8deg) scale(1.1)' : 'rotate(4deg)',
                boxShadow: '4px 4px 0 0 #000',
              }}
            />
          );
        })}
      </div>
      <p className="mt-5 inline-block -rotate-2 border-4 border-black bg-[#ffd23f] px-3 py-1 text-xs font-black uppercase">{value}</p>
    </div>
  );
}

function OrganicColorPicker({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [value, setValue] = useSessionState(session, 'value', '#7f9d6b');
  const [, setSelected] = useSessionState(session, 'selected', 0);
  const pick = (hex: string, i: number) => {
    setValue(hex);
    setSelected(i);
  };
  return (
    <div className="mx-auto w-full max-w-sm rounded-[42px_28px_46px_24px] bg-[#f3efe1] p-6 text-[#4d4a3a]">
      <p className="font-serif text-sm italic text-[#6b6a56]">{en ? 'Natural palette' : '自然色板'}</p>
      <div className="mt-5 flex flex-wrap gap-5">
        {EARTH.map((c, i) => {
          const on = value === c.hex;
          return (
            <button key={c.hex} aria-label={en ? `${c.name} ${c.hex}` : `选择 ${c.hex}`} type="button" aria-pressed={on} onClick={() => pick(c.hex, i)} className="focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col items-center gap-2">
              <span
                className="h-14 w-14 border border-black/5 transition-transform"
                style={{
                  background: c.hex,
                  borderRadius: on ? '60% 40% 55% 45% / 50% 55% 45% 50%' : '46% 54% 42% 58% / 56% 44% 56% 44%',
                  transform: on ? 'scale(1.12)' : 'scale(1)',
                }}
              />
              <span className="text-[10px] uppercase tracking-wider text-[#8a8770]">{en ? c.name : ['鼠尾草', '泥土', '陶土', '河流'][i]}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-5 border-t border-[#d9d4c2] pt-3 text-[11px] text-[#6b6a56]">
        {en ? 'Selected' : '已选'} · {value}
      </p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [value, setValue] = useSessionState(session, 'value', '#2563eb');
  const [, setSelected] = useSessionState(session, 'selected', 0);
  const colors = ['#2563eb', '#be185d', '#047857', '#a16207'];
  const labels = zh ? ['蓝色', '玫红', '森林绿', '赭黄'] : ['Blue', 'Rose', 'Forest', 'Ochre'];
  const pick = (color: string) => { setValue(color); setSelected(colors.indexOf(color)); };
  return <RecipeFrame style={style} locale={locale} title={zh ? '颜色样本' : 'Color swatches'}>
    <div className="grid grid-cols-2 gap-3">
      {colors.map((color, i) => <button key={color} type="button" aria-pressed={value === color} onClick={() => pick(color)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex min-h-16 items-center gap-2 p-2 text-sm ${value === color ? r.active : r.item}`}>
        <span aria-hidden="true" style={{ backgroundColor: color }} className={`h-8 w-8 shrink-0 border border-current ${style === 'neumorphism' ? 'rounded-full shadow-[inset_2px_2px_4px_#0005]' : style === 'minimalism' || style === 'swiss-style' ? '' : 'rounded-md'}`} />
        <span>{labels[i]} {value === color ? '✓' : ''}</span>
      </button>)}
    </div>
    <label className={`mt-4 flex items-center justify-between gap-3 p-3 ${r.item}`}>
      <span>{zh ? '自定义颜色' : 'Custom color'}</span>
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#2563eb'} onChange={(event) => pick(event.target.value)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 h-11 w-14 cursor-pointer ${r.field}`} />
    </label>
    <output aria-live="polite" className={`mt-3 block font-mono text-sm ${r.muted}`}>{value.toUpperCase()}</output>
    <button type="button" onClick={() => pick('#2563eb')} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '重置颜色' : 'Reset color'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底上霓虹描边与辉光，等宽字体实时回显十六进制色值。',
      en: 'Neon outlines and glow on near-black, with a monospace readout echoing the hex value live.',
    },
    Demo: CyberpunkColorPicker,
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '高饱和撞色配黑描边、不规则圆角与手绘波浪圆点，选中块歪斜抬起。',
      en: 'Clashing saturated colours with black outlines, uneven radii and doodled waves/dots; the selected chip tilts and lifts.',
    },
    Demo: MemphisColorPicker,
  },
  {
    style: 'organic',
    name: {"zh":"有机自然","en":"Organic"},
    note: {
      zh: '奶油绿大地色系，色块是曲率不规则的卵石形，选中时轻轻放大。',
      en: 'An earthy cream-and-green palette with pebble shapes of irregular organic curvature that gently swell when selected.',
    },
    Demo: OrganicColorPicker,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；色板、选中色样和自定义颜色控件采用同一材质语言。", en: "Hairlines, monochrome inversion and whitespace; swatches, selected samples and the custom color control share the material language." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；色板、选中色样和自定义颜色控件采用同一材质语言。", en: "Solid blocks and clear hierarchy without shadows; swatches, selected samples and the custom color control share the material language." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；色板、选中色样和自定义颜色控件采用同一材质语言。", en: "An indexed grid, square edges and a red accent; swatches, selected samples and the custom color control share the material language." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；色板、选中色样和自定义颜色控件采用同一材质语言。", en: "Heavy black outlines, hard shadows and bold selection; swatches, selected samples and the custom color control share the material language." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；色板、选中色样和自定义颜色控件采用同一材质语言。", en: "Shared soft surfaces, paired shadows and explicit borders; swatches, selected samples and the custom color control share the material language." }),
];

export default styleVariants;
