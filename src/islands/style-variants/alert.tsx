import type { StyleVariantSet } from './types';

function SwissAlert() {
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-[4px_1fr] bg-white text-black" style={{ border: '1px solid #000' }}>
      <span className="bg-[#e60012]" />
      <div className="p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Notice</p>
        <p className="mt-1 text-base font-bold leading-tight tracking-tight">Sync failed. Retry when online.</p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-black pt-2 text-[11px]">
          <span className="font-mono">CODE 04</span>
          <span className="text-right underline">Retry</span>
        </div>
      </div>
    </div>
  );
}

function BrutalAlert() {
  return (
    <div className="mx-auto w-full max-w-sm bg-black p-5 font-mono text-[#eaff00]" style={{ border: '2px solid #eaff00' }}>
      <p className="break-words text-4xl font-black leading-[0.9] tracking-tighter">SYNC FAILED</p>
      <p className="mt-3 border-t border-[#eaff00] pt-2 text-[11px] leading-relaxed text-[#eaff00]/70">
        connection lost :: retry later
      </p>
    </div>
  );
}

function CorpMemphisAlert() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#e8f3ff] p-5 text-[#1f2a44]" style={{ border: '1px solid #cfe2ff' }}>
      <div className="flex items-start gap-4">
        <span className="relative h-12 w-12 shrink-0">
          <span className="absolute inset-0 rounded-full bg-[#6c8cff]" />
          <span className="absolute bottom-0 right-0 h-5 w-5 rotate-12 rounded-sm bg-[#ffb648]" />
        </span>
        <div>
          <p className="text-sm font-extrabold">Sync paused</p>
          <p className="mt-1 text-xs leading-relaxed text-[#4a5b7c]">We will retry automatically.</p>
          <button className="mt-3 rounded-full bg-[#6c8cff] px-4 py-1.5 text-xs font-bold text-white">Retry now</button>
        </div>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '严格两栏网格加一条朱红竖标，标题用 Helvetica 式粗黑体压紧字距。',
      en: 'A strict two-column grid with a red vertical marker and tightened Helvetica-style bold type.',
    },
    Demo: SwissAlert,
  },
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '超大等宽标题直接撞上黑底荧光黄，信息像未打磨的混凝土块。',
      en: 'Oversized monospace type slammed onto black with acid yellow — the alert is an unpolished concrete slab.',
    },
    Demo: BrutalAlert,
  },
  {
    style: 'corporate-memphis',
    name: { zh: '企业孟菲斯', en: 'Corporate Memphis' },
    note: {
      zh: '克制版孟菲斯：圆角色块、几何圆形图标与胶囊按钮，友好且扁平。',
      en: 'Restrained Memphis: rounded blocks, a geometric circle icon and a pill button — friendly and flat.',
    },
    Demo: CorpMemphisAlert,
  },
];

export default styleVariants;
