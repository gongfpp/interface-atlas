import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function FlatPopover({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#2d6cdf] p-5 text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">{en ? 'Account' : '账户'}</p>
      <div className="relative mt-3 inline-block">
        <button onClick={() => setOpen((v) => !v)} className="bg-white px-4 py-2 text-xs font-semibold text-[#2d6cdf]">
          {en ? 'Options' : '选项'}
        </button>
        {open && (
          <div className="absolute left-0 top-full z-10 mt-1 w-44 bg-[#f4b400] p-2 text-[#1b1b1b]">
            <p className="px-2 py-1 text-xs font-semibold">{en ? 'Profile' : '个人资料'}</p>
            <p className="px-2 py-1 text-xs font-semibold">{en ? 'Sign out' : '退出登录'}</p>
          </div>
        )}
      </div>
      <p className="mt-28 text-[11px] leading-relaxed text-white/80">Solid colour blocks, zero shadow, zero border.</p>
    </div>
  );
}

function NeuPopover({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e0e5ec] p-6 text-[#4a5568]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8695a8]">{en ? 'Display' : '显示'}</p>
      <div className="relative mt-3 inline-block">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-[#e0e5ec] px-4 py-2 text-xs font-semibold shadow-[6px_6px_12px_#b8c0cc,-6px_-6px_12px_#ffffff]"
        >
          {en ? 'Density' : '密度'}
        </button>
        {open && (
          <div className="absolute left-0 top-full z-10 mt-2 w-40 rounded-2xl bg-[#e0e5ec] p-2 shadow-[8px_8px_16px_#b8c0cc,-8px_-8px_16px_#ffffff]">
            <p className="rounded-lg px-3 py-2 text-xs">{en ? 'Comfortable' : '宽松'}</p>
            <p className="rounded-lg px-3 py-2 text-xs">{en ? 'Compact' : '紧凑'}</p>
          </div>
        )}
      </div>
      <p className="mt-28 text-[11px] leading-relaxed text-[#8695a8]">One surface extruded into clay with dual shadows.</p>
    </div>
  );
}

function EditorialPopover({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', true);
  return (
    <div className="mx-auto w-full max-w-sm border-t-2 border-ink bg-raised p-5 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">The Index</p>
      <div className="relative mt-3 inline-block">
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-serif text-lg underline decoration-ink-3 underline-offset-4"
        >
          {en ? 'Related essays' : '相关文章'}
        </button>
        {open && (
          <div className="absolute left-0 top-full z-10 mt-2 w-52 border border-ink bg-raised p-3">
            <p className="font-serif text-sm">Issue 42 — Form</p>
            <div className="my-2 h-px bg-line-strong" />
            <p className="text-[11px] leading-relaxed text-ink-2">A quarterly on typography and rules.</p>
          </div>
        )}
      </div>
      <p className="mt-24 text-[11px] leading-relaxed text-ink-3">Serif display, hairline rules, footnote hierarchy.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平化设计', en: 'Flat Design' },
    note: {
      zh: '弹层是一块纯色色块，去掉边框与投影，只靠对比色区分层级。',
      en: 'The popover is a pure colour block — no border or shadow, hierarchy only from contrasting fills.',
    },
    Demo: FlatPopover,
  },
  {
    style: 'neumorphism',
    name: { zh: '新拟态', en: 'Neumorphism' },
    note: {
      zh: '触发器和弹层从同一块灰面挤出，双阴影让它摸起来像软陶。',
      en: 'Trigger and popover are extruded from the same grey surface; dual shadows make them feel like soft clay.',
    },
    Demo: NeuPopover,
  },
  {
    style: 'editorial',
    name: { zh: '杂志编辑风', en: 'Editorial' },
    note: {
      zh: '衬线标题配一条发丝分隔线，弹层读起来像杂志边栏的延伸注释。',
      en: 'A serif title over a hairline rule makes the popover read like a marginal note in a magazine.',
    },
    Demo: EditorialPopover,
  },
];

export default styleVariants;
