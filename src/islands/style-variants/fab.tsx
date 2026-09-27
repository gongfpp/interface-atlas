import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Neobrutal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', false);
  return (
    <div className="relative mx-auto h-40 w-full max-w-sm border-[2.5px] border-black bg-[#fdf6b2]">
      <p className="p-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black">{en ? 'New note' : '新建笔记'}</p>
      {open && (
        <button className="absolute bottom-[5.5rem] right-4 border-[2.5px] border-black bg-white px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0_0_#000]">{en ? 'Upload' : '上传'}</button>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label={en ? (open ? 'Close actions' : 'Add') : open ? '收起操作' : '添加'}
        className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-black bg-[#ff5d5d] text-2xl font-black text-black shadow-[5px_5px_0_0_#000] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        {open ? '×' : '+'}
      </button>
    </div>
  );
}

function LiquidGlass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', false);
  return (
    <div className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8ec5ff] via-[#c9a7ff] to-[#ffb6d5] p-5">
      <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">{en ? 'Inbox' : '收件箱'}</p>
      <button
        onClick={() => setOpen(!open)}
        aria-label={en ? (open ? 'Close compose' : 'Compose') : open ? '收起撰写' : '撰写'}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/50 bg-white/25 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-all hover:bg-white/40"
      >
        <span className="text-xl leading-none">{open ? '×' : '+'}</span>
        {open && <span className="pr-1 text-xs font-semibold">{en ? 'Compose' : '撰写'}</span>}
      </button>
    </div>
  );
}

function Clay({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', false);
  const puffy = { boxShadow: 'inset -4px -4px 8px rgba(120,90,160,0.25), inset 4px 4px 8px rgba(255,255,255,0.9), 0 10px 18px rgba(120,90,160,0.25)' };
  return (
    <div className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-[2rem] bg-[#efe6ff] p-5 text-[#5b4b8a]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9b8cc4]">{en ? 'New post' : '新帖子'}</p>
      <button
        onClick={() => setOpen(!open)}
        aria-label={en ? (open ? 'Close' : 'Add') : open ? '收起' : '添加'}
        className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#c9b6ff] text-2xl font-bold text-[#5b4b8a]"
        style={puffy}
      >
        {open ? '×' : '+'}
      </button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '圆形 FAB 用 3px 黑描边加硬投影，点开弹出第二条同款按钮，按下时整体位移下沉。',
      en: 'A round FAB with a 3px outline and hard offset shadow; opening reveals a second one and pressing sinks it.',
    },
    Demo: Neobrutal,
  },
  {
    style: 'liquid-glass',
    name: { zh: '液态玻璃', en: 'Liquid Glass' },
    note: {
      zh: 'FAB 是漂浮的透明玻璃胶囊：渐变背景上叠白色高光、模糊和一圈亮边，展开时横向拉长露出文字。',
      en: 'The FAB is a floating clear-glass capsule — white specular highlight, blur and bright rim over gradient; it stretches into a labelled pill.',
    },
    Demo: LiquidGlass,
  },
  {
    style: 'claymorphism',
    name: { zh: '黏土风', en: 'Claymorphism' },
    note: {
      zh: '淡紫底上的软糖圆钮：内阴影做出厚度、外阴影托起，边角圆润像捏出来的黏土。',
      en: 'A puffy pastel clay button on matching lavender — inner shadows give thickness, outer shadow lifts it, fully rounded.',
    },
    Demo: Clay,
  },
];

export default styleVariants;
