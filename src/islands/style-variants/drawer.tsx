import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function MinimalDrawer({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Panel</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="border border-black px-3 py-1 text-[11px] uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
        >
          {open ? (en ? 'Close' : '关闭') : (en ? 'Open' : '打开')}
        </button>
      </div>
      <div className="relative mt-4 h-40 overflow-hidden border border-black/10">
        <div
          className={`absolute inset-y-0 right-0 w-40 border-l border-black bg-white p-3 transition-transform duration-200 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <p className="text-xs font-medium">{en ? 'Settings' : '设置'}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-black/50">Hairline edge, no shadow, radius 0.</p>
        </div>
      </div>
    </div>
  );
}

function NeobrutalDrawer({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#c8f31d] p-4 text-black" style={{ border: '3px solid #000' }}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-black uppercase tracking-widest">Drawer</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="border-[3px] border-black bg-white px-3 py-1 text-[11px] font-black uppercase shadow-[3px_3px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {open ? (en ? 'Shut' : '收起') : (en ? 'Open' : '打开')}
        </button>
      </div>
      <div className="relative mt-4 h-40 overflow-hidden border-[3px] border-black bg-[#ff5d5d]">
        <div
          className={`absolute inset-y-0 right-0 w-40 border-l-[3px] border-black bg-white p-3 transition-transform duration-150 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <p className="text-xs font-black uppercase">{en ? 'Menu' : '菜单'}</p>
          <p className="mt-1 text-[11px] font-medium">Heavy outline, hard offset shadow.</p>
        </div>
      </div>
    </div>
  );
}

function DecoDrawer({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#0d1b2a] p-5 text-[#e8ce92]"
      style={{ border: '1px solid #e8ce92', outline: '1px solid #e8ce9244', outlineOffset: '-6px' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-xs uppercase tracking-[0.35em]">Atelier</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="border border-[#e8ce92] px-3 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#e8ce92] hover:text-[#0d1b2a]"
        >
          {open ? (en ? 'Close' : '关闭') : (en ? 'Open' : '打开')}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[#e8ce92]/60">
        <span className="h-px flex-1 bg-[#e8ce92]/40" />
        <span className="text-[10px]">◆</span>
        <span className="h-px flex-1 bg-[#e8ce92]/40" />
      </div>
      <div className="relative mt-3 h-40 overflow-hidden border border-[#e8ce92]/30">
        <div
          className={`absolute inset-y-0 left-0 w-40 border-r border-[#e8ce92] bg-[#12263a] p-3 transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <p className="font-serif text-sm">{en ? 'Collections' : '收藏'}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#e8ce92]/70">Gold rules on midnight blue.</p>
        </div>
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '抽屉只剩一条发丝边和纯白面板，用位移速度而非阴影表达层级。',
      en: 'The drawer is just a hairline edge on a white panel — hierarchy comes from motion, not shadow.',
    },
    Demo: MinimalDrawer,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '3px 黑框与硬投影把抽屉做成一块实体，按钮按下会真的错位一格。',
      en: 'A 3px black frame and hard offset shadow make the drawer a solid slab; the toggle physically shifts on press.',
    },
    Demo: NeobrutalDrawer,
  },
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '午夜蓝配金线、对称菱形分隔与衬线标题，抽屉像剧场幕布一样滑出。',
      en: 'Midnight blue with gold rules, a symmetric diamond divider and serif titles — the drawer sweeps open like a theatre curtain.',
    },
    Demo: DecoDrawer,
  },
];

export default styleVariants;
