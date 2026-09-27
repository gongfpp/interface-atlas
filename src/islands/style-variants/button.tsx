import { useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Minimal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [saved, setSaved] = useSessionState(session, 'saved', false);
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 border border-black/10 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">{zh ? '保存更改' : 'Save changes'}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setSaved(true)}
          className="border border-black bg-black px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors duration-150 hover:bg-white hover:text-black"
        >
          {saved ? (zh ? '已保存' : 'Saved') : zh ? '保存' : 'Save'}
        </button>
        <button className="border border-black/20 px-4 py-2 text-xs uppercase tracking-wider text-black/70 transition-colors duration-150 hover:border-black hover:text-black">
          {zh ? '取消' : 'Cancel'}
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-black/50">Two corners, one accent, no shadow: hierarchy comes from weight and spacing only.</p>
    </div>
  );
}

function Neobrutal({ locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [pressed, setPressed] = useState(false);
  const base =
    'border-[2.5px] border-black px-4 py-2 text-xs font-black uppercase tracking-wide transition-all duration-100';
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 bg-[#fdf6b2] p-5 text-black" style={{ border: '2.5px solid #000' }}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{zh ? '确认订单' : 'Confirm order'}</p>
      <div className="flex flex-wrap gap-3">
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          className={`${base} bg-[#ff5d5d] ${pressed ? 'translate-x-[3px] translate-y-[3px] shadow-none' : 'shadow-[5px_5px_0_0_#000]'}`}
        >
          {zh ? '立即支付' : 'Pay now'}
        </button>
        <button className={`${base} bg-white shadow-[5px_5px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none`}>
          {zh ? '稍后' : 'Later'}
        </button>
      </div>
      <p className="text-[11px] font-medium leading-relaxed">Heavy outline and a hard offset shadow; pressing physically sinks the button.</p>
    </div>
  );
}

function Glass({ locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [hover, setHover] = useState(false);
  return (
    <div className="relative mx-auto flex max-w-sm flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-white">
      <span className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <span className="pointer-events-none absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{zh ? '订阅' : 'Subscribe'}</p>
      <div className="relative flex gap-3">
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`rounded-xl border border-white/50 bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
            hover ? '-translate-y-0.5 bg-white/35 shadow-lg shadow-black/20' : 'shadow-md shadow-black/10'
          }`}
        >
          {zh ? '开始使用' : 'Get started'}
        </button>
        <button className="rounded-xl border border-white/30 bg-transparent px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-white/15">
          {zh ? '了解更多' : 'Learn more'}
        </button>
      </div>
      <p className="relative text-[11px] leading-relaxed text-white/80">Frosted glass floating over a colourful backdrop; the border and blur do the work.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '去掉圆角、阴影与装饰色，层次完全交给字重和留白；悬停只做颜色反转。',
      en: 'No radius, shadow or decorative colour — hierarchy comes from weight and whitespace, with a colour-only hover inversion.',
    },
    Demo: Minimal,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '2.5px 黑描边配硬边投影，按下时按钮真的“沉”下去，反馈被放大到可见。',
      en: 'A 2.5px black outline with a hard offset shadow; pressing physically sinks the button so feedback is impossible to miss.',
    },
    Demo: Neobrutal,
  },
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '半透明磨砂面叠在彩色渐变上，边框与背景模糊取代实色，悬停轻轻上浮。',
      en: 'A translucent frosted surface over a colourful gradient — border and backdrop blur replace solid fills, lifting gently on hover.',
    },
    Demo: Glass,
  },
];

export default styleVariants;
