import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Glass({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'standard');
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
          <button
            key={id}
            onClick={() => setV(id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm backdrop-blur-md transition-colors ${
              v === id ? 'border-white/60 bg-white/25' : 'border-white/25 bg-white/10'
            }`}
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${v === id ? 'border-white' : 'border-white/60'}`}>
              {v === id && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            {label}
          </button>
        ))}
      </div>
      <p className="relative mt-4 text-[11px] leading-relaxed text-white/80">Each option is its own frosted pane; the selected dot brightens a more opaque, blurred fill.</p>
    </div>
  );
}

function Deco({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'grand');
  const opts = [
    ['grand', zh ? '豪华套房' : 'The Grand Suite'],
    ['terrace', zh ? '露台房' : 'Terrace Room'],
    ['salon', zh ? '私人沙龙' : 'Salon Privé'],
  ];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#0e1116] p-6 text-[#e8d9a8]" style={{ outline: '1px solid #d4af3755', outlineOffset: '-10px' }}>
      <p className="mb-3 text-center font-serif text-lg tracking-[0.2em] text-[#d4af37]">{zh ? '住宿' : 'ACCOMMODATION'}</p>
      <div className="mb-4 flex items-center justify-center gap-2 text-[#d4af37]">
        <span className="h-px w-8 bg-[#d4af37]/60" />
        <span className="text-[10px]">◆</span>
        <span className="h-px w-8 bg-[#d4af37]/60" />
      </div>
      <div className="space-y-2">
        {opts.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setV(id)}
            className={`flex w-full items-center gap-3 border px-4 py-2.5 text-left font-serif text-sm ${
              v === id ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#f3e6bd]' : 'border-[#d4af37]/30 text-[#c9bd97]'
            }`}
          >
            <span className={`h-3 w-3 rotate-45 border ${v === id ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#d4af37]/50'}`} />
            {label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#9a8f6d]">Diamond selects and a fan-like divider in gold on near-black; the serif keeps it symmetrical and formal.</p>
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 's');
  const opts = [
    ['s', zh ? '小' : 'Small'],
    ['m', zh ? '中' : 'Medium'],
    ['l', zh ? '大' : 'Large'],
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3e7] p-6 text-black">
      <span className="absolute right-4 top-4 h-4 w-4 rounded-full border-4 border-[#00e5ff]" />
      <span className="absolute right-11 top-3 h-6 w-6 border-4 border-[#ffe600]" />
      <span className="absolute right-5 top-12 h-2 w-6 rounded-full bg-[#ff2e63]" />
      <p className="mb-4 inline-block -rotate-2 bg-[#ff2e63] px-3 py-1 text-xs font-black uppercase text-white">{zh ? '选择尺寸' : 'Pick a size'}</p>
      <div className="space-y-2">
        {opts.map(([id, label], i) => (
          <button
            key={id}
            onClick={() => setV(id)}
            style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}
            className={`flex w-full items-center gap-3 border-[3px] border-black px-3 py-2 text-left text-sm font-bold ${
              v === id ? 'bg-[#00e5ff] shadow-[4px_4px_0_0_#000]' : 'bg-white'
            }`}
          >
            <span className={`h-4 w-4 rounded-full border-[3px] border-black ${v === id ? 'bg-[#ff2e63]' : 'bg-transparent'}`} />
            {label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-medium leading-relaxed">Confetti dots, a tilted sticker label and alternating row rotations — deliberately off-grid and clashing.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '每个选项都是彩色渐变上的一块磨砂玻璃，选中的那块更亮更实、圆点透出。',
      en: 'Every option is a frosted pane over a colourful gradient; the selected one turns brighter and more opaque.',
    },
    Demo: Glass,
  },
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '近黑底配金色菱形选择点与扇形分隔线，衬线对称排版营造正式而奢华的气质。',
      en: 'Gold diamond selects and a fan-like divider on near-black; symmetrical serif type reads formal and luxurious.',
    },
    Demo: Deco,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯风格', en: 'Memphis Design' },
    note: {
      zh: '彩色纸屑圆点、倾斜贴纸标题与逐行交错旋转，刻意打破网格并制造撞色。',
      en: 'Confetti dots, a tilted sticker label and alternating row rotations deliberately break the grid and clash colours.',
    },
    Demo: Memphis,
  },
];

export default styleVariants;
