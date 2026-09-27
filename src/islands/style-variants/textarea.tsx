import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Flat({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'Write a short note…');
  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-[#eef4ff] p-4 text-[#0f172a]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{zh ? '消息' : 'Message'}</span>
        <span className="rounded bg-[#2563eb] px-2 py-0.5 text-[10px] font-semibold text-white">{v.length}</span>
      </div>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-md border-2 border-[#2563eb] bg-white p-3 text-sm focus:outline-none"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#475569]">Solid fills and a flat 2px border with a live character chip — depth is purely colour-blocked.</p>
    </div>
  );
}

function HandDrawn({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'dear notebook,');
  return (
    <div className="mx-auto w-full max-w-sm -rotate-1 bg-[#fbf7ec] p-5 text-[#2f2a25]">
      <p className="font-serif text-lg italic">{zh ? '草稿本' : 'Scratch pad'}</p>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
        className="mt-3 w-full resize-none border-2 border-[#2f2a25] bg-transparent p-3 text-sm italic outline-none"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#6b6155]">Wobbly asymmetric radii and a slight tilt make the box feel penciled onto paper by hand.</p>
    </div>
  );
}

function Cyberpunk({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '> transmit');
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#05060a] p-5 font-mono text-[#7df9ff]"
      style={{ border: '1px solid #ff2bd6', boxShadow: '0 0 12px #ff2bd6, inset 0 0 24px #ff2bd610' }}
    >
      <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#ff2bd6]">{zh ? '// 上行链路' : '// uplink'}</p>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        className="w-full resize-none border border-[#7df9ff]/60 bg-[#0a0f18] p-3 text-xs text-[#7df9ff] outline-none placeholder:text-[#7df9ff]/40 focus:border-[#7df9ff] focus:shadow-[0_0_16px_#7df9ff]"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#ff2bd6]/80">A magenta frame glows around a monospace input grid; the void background makes every neon edge hum.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平化设计', en: 'Flat Design' },
    note: {
      zh: '纯色块加 2px 平边，配实时字数小徽章，完全不用阴影和渐变来做层次。',
      en: 'Pure colour blocks, a flat 2px border and a live character chip — hierarchy with no shadow or gradient at all.',
    },
    Demo: Flat,
  },
  {
    style: 'hand-drawn',
    name: { zh: '手绘涂鸦', en: 'Hand-drawn UI' },
    note: {
      zh: '四角用不对称的抖动圆角画出歪斜描边，整块纸面轻转一度，像铅笔随手框出。',
      en: 'Asymmetric wobbling radii render a shaky outline, and the whole page tilts a degree like a pencil sketch.',
    },
    Demo: HandDrawn,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底上一圈发光的品红边框，输入区是等宽青字，聚焦时整框亮起霓虹辉光。',
      en: 'A glowing magenta frame on near-black holds a monospace cyan grid, and focusing ignites the neon glow.',
    },
    Demo: Cyberpunk,
  },
];

export default styleVariants;
