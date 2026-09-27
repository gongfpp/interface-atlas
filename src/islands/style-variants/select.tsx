import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Swiss({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'grid');
  return (
    <div className="mx-auto w-full max-w-sm border border-black bg-white p-5 text-black">
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 border-b-2 border-black pb-2">
        <span className="font-mono text-[11px] font-bold text-[#e11d2a]">01</span>
        <span className="text-sm font-bold uppercase tracking-[0.15em]">{zh ? '布局网格' : 'Layout grid'}</span>
      </div>
      <div className="relative mt-4">
        <select
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="w-full appearance-none border border-black bg-white py-2.5 pl-3 pr-8 text-sm font-medium focus:outline-none"
        >
          <option value="grid">{zh ? '12 栏网格' : '12-column grid'}</option>
          <option value="baseline">{zh ? '基线网格' : 'Baseline grid'}</option>
          <option value="modular">{zh ? '模块化字阶' : 'Modular scale'}</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#e11d2a]">▼</span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-black/50">A numbered label on a strict baseline, one red accent, square edges — typography is the hierarchy.</p>
    </div>
  );
}

function Bauhaus({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'b');
  return (
    <div className="mx-auto w-full max-w-sm bg-[#f4efe3] p-6 text-black">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-4 w-4 rounded-full bg-[#e63946]" />
        <span className="h-4 w-4 bg-[#ffd166]" />
        <span className="h-0 w-0 border-x-[8px] border-b-[14px] border-x-transparent border-b-[#1d4ed8]" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{zh ? '表单' : 'Form'}</span>
      </div>
      <div className="relative">
        <select
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="w-full appearance-none rounded-full border-[3px] border-black bg-[#1d4ed8] py-3 pl-5 pr-10 text-sm font-bold uppercase text-white focus:outline-none"
        >
          <option value="a">{zh ? '圆形' : 'Circle'}</option>
          <option value="b">{zh ? '三角形' : 'Triangle'}</option>
          <option value="c">{zh ? '正方形' : 'Square'}</option>
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#ffd166]" />
      </div>
      <p className="mt-3 text-[11px] font-medium leading-relaxed">Primary-colour circle, square and triangle head a bold pill field — pure geometric construction.</p>
    </div>
  );
}

function LiquidGlass({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'pro');
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f172a] via-[#3b2f63] to-[#0ea5e9] p-6 text-white">
      <span className="pointer-events-none absolute -top-10 left-8 h-32 w-32 rounded-full bg-fuchsia-400/40 blur-2xl" />
      <p className="relative mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">{zh ? '套餐' : 'Plan'}</p>
      <div className="relative">
        <select
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="w-full appearance-none rounded-full border border-white/40 bg-white/15 py-3 pl-5 pr-10 text-sm font-semibold backdrop-blur-xl focus:outline-none"
        >
          <option className="text-black" value="basic">{zh ? '入门版' : 'Starter'}</option>
          <option className="text-black" value="pro">{zh ? '专业版' : 'Professional'}</option>
          <option className="text-black" value="team">{zh ? '工作室版' : 'Studio'}</option>
        </select>
        <span className="pointer-events-none absolute left-6 right-6 top-[5px] h-px bg-white/70" />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/80">▾</span>
      </div>
      <p className="relative mt-3 text-[11px] leading-relaxed text-white/75">A pill of clear glass with a specular hairline across its top, floating over a deep gradient.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '编号标签对齐基线，直角边框加唯一红色三角箭头，用网格与字重建立层级。',
      en: 'A numbered label sits on the baseline; square edges and a single red triangle arrow build hierarchy from grid and weight.',
    },
    Demo: Swiss,
  },
  {
    style: 'bauhaus',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    note: {
      zh: '红黄蓝三原色以圆、方、三角构成表头，选择器本体是粗黑边的大圆角胶囊。',
      en: 'A red-yellow-blue header of circle, square and triangle tops a thick-black pill field — geometry reduced to primaries.',
    },
    Demo: Bauhaus,
  },
  {
    style: 'liquid-glass',
    name: { zh: '液态玻璃', en: 'Liquid Glass' },
    note: {
      zh: '透明玻璃胶囊落在深色渐变上，顶部一道高光发丝，选项文字浮在模糊层之上。',
      en: 'A translucent glass pill over a deep gradient, topped by a specular highlight line, with the value floating on blur.',
    },
    Demo: LiquidGlass,
  },
];

export default styleVariants;
