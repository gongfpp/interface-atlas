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
  const [selected, setSelected] = useSessionState(session, 'selected', 0);
  const pick = (hex: string, i: number) => {
    setValue(hex);
    setSelected(i);
  };
  return (
    <div className="mx-auto w-full max-w-sm border border-[#00f0ff]/40 bg-[#05060a] p-5 font-mono text-[#9ffcff] shadow-[0_0_24px_#00f0ff22]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff2e88]">▚ {en ? 'Palette.exe' : '调色板.exe'}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {NEON.map((c, i) => {
          const on = selected === i;
          return (
            <button
              key={c.hex}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c.hex, i)}
              className="h-14 border-2 transition-transform hover:-translate-y-0.5"
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
        <span style={{ color: value }}>{NEON.find((c) => c.hex === value)?.name}</span>
        <span className="text-[#9ffcff]/70">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

function MemphisColorPicker({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [value, setValue] = useSessionState(session, 'value', '#ff5c8a');
  const [selected, setSelected] = useSessionState(session, 'selected', 0);
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
          const on = selected === i;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c, i)}
              className="h-14 w-14 border-4 border-black transition-transform"
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
  const [selected, setSelected] = useSessionState(session, 'selected', 0);
  const pick = (hex: string, i: number) => {
    setValue(hex);
    setSelected(i);
  };
  return (
    <div className="mx-auto w-full max-w-sm rounded-[42px_28px_46px_24px] bg-[#f3efe1] p-6 text-[#4d4a3a]">
      <p className="font-serif text-sm italic text-[#6b6a56]">{en ? 'Natural palette' : '自然色板'}</p>
      <div className="mt-5 flex flex-wrap gap-5">
        {EARTH.map((c, i) => {
          const on = selected === i;
          return (
            <button key={c.hex} type="button" aria-pressed={on} onClick={() => pick(c.hex, i)} className="flex flex-col items-center gap-2">
              <span
                className="h-14 w-14 border border-black/5 transition-transform"
                style={{
                  background: c.hex,
                  borderRadius: on ? '60% 40% 55% 45% / 50% 55% 45% 50%' : '46% 54% 42% 58% / 56% 44% 56% 44%',
                  transform: on ? 'scale(1.12)' : 'scale(1)',
                }}
              />
              <span className="text-[10px] uppercase tracking-wider text-[#8a8770]">{c.name}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-5 border-t border-[#d9d4c2] pt-3 text-[11px] text-[#6b6a56]">
        {en ? 'Selected' : '已选'} · {EARTH.find((c) => c.hex === value)?.name}
      </p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底上霓虹描边与辉光，等宽字体实时回显十六进制色值。',
      en: 'Neon outlines and glow on near-black, with a monospace readout echoing the hex value live.',
    },
    Demo: CyberpunkColorPicker,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯', en: 'Memphis' },
    note: {
      zh: '高饱和撞色配黑描边、不规则圆角与手绘波浪圆点，选中块歪斜抬起。',
      en: 'Clashing saturated colours with black outlines, uneven radii and doodled waves/dots; the selected chip tilts and lifts.',
    },
    Demo: MemphisColorPicker,
  },
  {
    style: 'organic',
    name: { zh: '有机自然', en: 'Organic' },
    note: {
      zh: '奶油绿大地色系，色块是曲率不规则的卵石形，选中时轻轻放大。',
      en: 'An earthy cream-and-green palette with pebble shapes of irregular organic curvature that gently swell when selected.',
    },
    Demo: OrganicColorPicker,
  },
];

export default styleVariants;
