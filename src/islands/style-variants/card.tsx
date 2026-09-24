import type { StyleVariantSet } from './types';

function MinimalCard() {
  return (
    <div className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Essay</p>
      <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">The shape of restraint</h3>
      <p className="mt-2 text-[12px] leading-relaxed text-black/60">Hairline border, two type sizes, nothing else.</p>
      <div className="mt-5 flex gap-3 border-t border-black/10 pt-3 text-[11px] uppercase tracking-wider text-black/50">
        <span>Read</span>
        <span>·</span>
        <span>6 min</span>
      </div>
    </div>
  );
}

function AuroraCard() {
  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#0b0f1f] p-5 text-[#e7ecff]"
      style={{ border: '1px solid #ffffff1a' }}
    >
      <span className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[#5b8cff] opacity-40 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-[#b45bff] opacity-40 blur-3xl" />
      <span className="pointer-events-none absolute right-10 top-4 h-24 w-24 rounded-full bg-[#3ff0c0] opacity-30 blur-3xl" />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">Release 3.0</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">Northern lights, shipped.</h3>
        <p className="mt-2 text-[12px] leading-relaxed text-white/70">Gradient blooms drifting behind a glass border.</p>
        <button className="mt-5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold">
          Open changelog
        </button>
      </div>
    </div>
  );
}

function BentoCard() {
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2 rounded-2xl bg-[#eef0f3] p-2 text-[#1c1f24]">
      <div className="col-span-3 rounded-xl bg-white p-3" style={{ boxShadow: '0 1px 2px #0000000d' }}>
        <p className="text-xs font-semibold">Weekly report</p>
        <p className="mt-1 text-[11px] text-[#6b7280]">Tidy modules, equal gaps, soft radii.</p>
      </div>
      <div className="col-span-2 rounded-xl bg-[#1c1f24] p-3 text-white">
        <p className="text-2xl font-bold tracking-tight">82%</p>
        <p className="text-[10px] uppercase tracking-wider text-white/60">Done</p>
      </div>
      <div className="col-span-1 rounded-xl bg-[#d7f36a] p-3">
        <p className="text-2xl font-bold tracking-tight">+12</p>
        <p className="text-[10px] uppercase tracking-wider text-[#1c1f24]/60">New</p>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '卡片只有一条发丝边框，靠字号与字重分层，页脚用细线收束。',
      en: 'The card is a single hairline box; hierarchy comes from type scale and weight, closed by a thin footer rule.',
    },
    Demo: MinimalCard,
  },
  {
    style: 'aurora',
    name: { zh: '极光渐变', en: 'Aurora Gradient' },
    note: {
      zh: '深色卡面上漂浮蓝紫青三团柔焦光斑，内容压在玻璃边框之上。',
      en: 'Three soft blue, purple and teal blooms drift on a dark card, with content floating on a glass border.',
    },
    Demo: AuroraCard,
  },
  {
    style: 'bento-grid',
    name: { zh: '便当盒网格', en: 'Bento Grid' },
    note: {
      zh: '卡片本身拆成不等宽的圆角模块网格，用留白和色块组织信息。',
      en: 'The card becomes a grid of unequal rounded modules, organising content through gaps and colour blocks.',
    },
    Demo: BentoCard,
  },
];

export default styleVariants;
