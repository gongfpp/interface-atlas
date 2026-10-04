import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Glass({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'standard');
  const name = useId();
  const opts = [
    ['standard', zh ? '标准配送' : 'Standard shipping'],
    ['express', zh ? '次日达' : 'Express 1-day'],
    ['pickup', zh ? '门店自提' : 'Store pickup'],
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#d946ef] to-[#22d3ee] p-6 text-white">
      <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      <p className="relative mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{zh ? '配送方式' : 'Delivery'}</p>
      <div className="relative space-y-2">
        {opts.map(([id, label]) => (
          <label
            key={id}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm backdrop-blur-md transition-colors ${
              v === id ? 'border-white/60 bg-white/25' : 'border-white/25 bg-white/10'
            }`}
          >
            <span aria-hidden="true" className={`flex h-4 w-4 items-center justify-center rounded-full border ${v === id ? 'border-white' : 'border-white/60'}`}>
              {v === id && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <input type="radio" name={name} value={id} checked={v === id} onChange={() => setV(id)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
      <p className="relative mt-4 text-[11px] leading-relaxed text-white/80">{zh ? '每个选项是一块磨砂玻璃，选中后变亮；只演示选择，不安排配送。' : 'Each option is a frosted pane that brightens when selected. Demo only; no delivery is arranged.'}</p>
    </div>
  );
}

function Deco({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'standard');
  const name = useId();
  const opts = [
    ['standard', zh ? '标准配送' : 'Standard shipping'],
    ['express', zh ? '次日达' : 'Express 1-day'],
    ['pickup', zh ? '门店自提' : 'Store pickup'],
  ];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#0e1116] p-6 text-[#e8d9a8]" style={{ outline: '1px solid #d4af3755', outlineOffset: '-10px' }}>
      <p className="mb-3 text-center font-serif text-lg tracking-[0.2em] text-[#d4af37]">{zh ? '配送方式' : 'DELIVERY'}</p>
      <div className="mb-4 flex items-center justify-center gap-2 text-[#d4af37]">
        <span className="h-px w-8 bg-[#d4af37]/60" />
        <span className="text-[10px]">◆</span>
        <span className="h-px w-8 bg-[#d4af37]/60" />
      </div>
      <div className="space-y-2">
        {opts.map(([id, label]) => (
          <label
            key={id}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-3 border px-4 py-2.5 text-left font-serif text-sm ${
              v === id ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#f3e6bd]' : 'border-[#d4af37]/30 text-[#c9bd97]'
            }`}
          >
            <span aria-hidden="true" className={`h-3 w-3 rotate-45 border ${v === id ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#d4af37]/50'}`} />
            <input type="radio" name={name} value={id} checked={v === id} onChange={() => setV(id)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#9a8f6d]">{zh ? '金色菱形与衬线保持对称秩序；只演示选择，不安排配送。' : 'Gold diamonds and serif type create symmetry. Demo only; no delivery is arranged.'}</p>
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'standard');
  const name = useId();
  const opts = [
    ['standard', zh ? '标准配送' : 'Standard shipping'],
    ['express', zh ? '次日达' : 'Express 1-day'],
    ['pickup', zh ? '门店自提' : 'Store pickup'],
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3e7] p-6 text-black">
      <span className="absolute right-4 top-4 h-4 w-4 rounded-full border-4 border-[#00e5ff]" />
      <span className="absolute right-11 top-3 h-6 w-6 border-4 border-[#ffe600]" />
      <span className="absolute right-5 top-12 h-2 w-6 rounded-full bg-[#ff2e63]" />
      <p className="mb-4 inline-block -rotate-2 bg-[#ff2e63] px-3 py-1 text-xs font-black uppercase text-white">{zh ? '配送方式' : 'Pick delivery'}</p>
      <div className="space-y-2">
        {opts.map(([id, label], i) => (
          <label
            key={id}
            style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-3 border-[3px] border-black px-3 py-2 text-left text-sm font-bold ${
              v === id ? 'bg-[#00e5ff] shadow-[4px_4px_0_0_#000]' : 'bg-white'
            }`}
          >
            <span aria-hidden="true" className={`h-4 w-4 rounded-full border-[3px] border-black ${v === id ? 'bg-[#ff2e63]' : 'bg-transparent'}`} />
            <input type="radio" name={name} value={id} checked={v === id} onChange={() => setV(id)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-medium leading-relaxed">{zh ? '彩色纸屑与倾斜贴纸打破网格；选择仅用于本地演示。' : 'Confetti and tilted stickers break the grid. Selection stays in this local demo.'}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const name = useId();
  const [value, setValue] = useSessionState(session, 'value', 'standard');
  const choices = [{ id: 'standard', zh: '标准配送', en: 'Standard shipping' }, { id: 'express', zh: '次日达', en: 'Express 1-day' }, { id: 'pickup', zh: '门店自提', en: 'Store pickup' }];
  return <RecipeFrame style={style} locale={locale} title={zh ? '配送选项预览' : 'Delivery option preview'}>
    <fieldset><legend className={`mb-3 text-sm ${r.muted}`}>{zh ? '请选择一项' : 'Choose one option'}</legend>
      <div className="space-y-3">{choices.map((choice) => <label key={choice.id} className={`flex min-h-14 cursor-pointer items-center gap-3 p-3 ${value === choice.id ? r.active : r.item}`}>
        <input type="radio" name={name} value={choice.id} checked={value === choice.id} onChange={() => setValue(choice.id)} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-5 w-5 shrink-0 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />
        <span>{zh ? choice.zh : choice.en}</span>
      </label>)}</div>
    </fieldset>
    <p role="status" className={`mt-4 text-sm ${r.muted}`}>{zh ? '已选：' : 'Selected: '}{choices.find((choice) => choice.id === value)?.[zh ? 'zh' : 'en'] ?? (zh ? '尚未选择' : 'None')}</p>
    <button type="button" onClick={() => setValue('standard')} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '恢复默认' : 'Reset choice'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'glassmorphism',
    name: {"zh":"玻璃拟态","en":"Glassmorphism"},
    note: {
      zh: '每个选项都是彩色渐变上的一块磨砂玻璃，选中的那块更亮更实、圆点透出。',
      en: 'Every option is a frosted pane over a colourful gradient; the selected one turns brighter and more opaque.',
    },
    Demo: Glass,
  },
  {
    style: 'art-deco',
    name: {"zh":"装饰艺术","en":"Art Deco"},
    note: {
      zh: '近黑底配金色菱形选择点与扇形分隔线，衬线对称排版营造正式而奢华的气质。',
      en: 'Gold diamond selects and a fan-like divider on near-black; symmetrical serif type reads formal and luxurious.',
    },
    Demo: Deco,
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '彩色纸屑圆点、倾斜贴纸标题与逐行交错旋转，刻意打破网格并制造撞色。',
      en: 'Confetti dots, a tilted sticker label and alternating row rotations deliberately break the grid and clash colours.',
    },
    Demo: Memphis,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；互斥选项的表面与选中边界一起变化，使用原生方向键选择和恢复默认。", en: "Hairlines, monochrome inversion and whitespace; exclusive choices change surface and selected borders together, with native arrow-key selection and reset." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；互斥选项的表面与选中边界一起变化，使用原生方向键选择和恢复默认。", en: "Solid blocks and clear hierarchy without shadows; exclusive choices change surface and selected borders together, with native arrow-key selection and reset." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；互斥选项的表面与选中边界一起变化，使用原生方向键选择和恢复默认。", en: "An indexed grid, square edges and a red accent; exclusive choices change surface and selected borders together, with native arrow-key selection and reset." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；互斥选项的表面与选中边界一起变化，使用原生方向键选择和恢复默认。", en: "Heavy black outlines, hard shadows and bold selection; exclusive choices change surface and selected borders together, with native arrow-key selection and reset." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；互斥选项的表面与选中边界一起变化，使用原生方向键选择和恢复默认。", en: "Shared soft surfaces, paired shadows and explicit borders; exclusive choices change surface and selected borders together, with native arrow-key selection and reset." }),
];

export default styleVariants;
