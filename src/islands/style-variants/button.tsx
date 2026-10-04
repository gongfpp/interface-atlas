import type { StyleVariantSet, VariantDemoProps } from './types';
import { useButtonFeedback } from '../shared/useButtonFeedback';
import { buttonFeedbackText } from '../../lib/button-feedback';

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4';
const target = 'min-h-11 min-w-28 disabled:cursor-wait disabled:opacity-60';

function Minimal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 border border-black/10 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start}
          className={`${target} ${focus} border border-black bg-black px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline-black`}>
          {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={action.cancel} className={`${target} ${focus} focus-visible:outline-black border border-black/20 px-4 py-2 text-xs uppercase tracking-wider text-black/70 transition-colors duration-150 hover:border-black hover:text-black`}>
          {zh ? '取消' : 'Cancel'}
        </button>
      </div>
      <p role="status" aria-atomic="true" className="min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      <p className="text-[11px] leading-relaxed text-black/50">{zh ? '直角、单一强调色、无阴影：只靠字重与间距区分主次。' : 'Square corners, one accent, no shadow: hierarchy comes from weight and spacing only.'}</p>
    </div>
  );
}

function Neobrutal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  const base = `${target} ${focus} focus-visible:outline-black border-[2.5px] border-black px-4 py-2 text-xs font-black uppercase tracking-wide transition-all duration-100 shadow-[5px_5px_0_0_#000] motion-safe:enabled:active:translate-x-[3px] motion-safe:enabled:active:translate-y-[3px] enabled:active:shadow-none motion-reduce:transition-none`;
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 bg-[#fdf6b2] p-5 text-black" style={{ border: '2.5px solid #000' }}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start} className={`${base} bg-[#ff5d5d]`}>
          {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={action.cancel} className={`${base} bg-white`}>
          {zh ? '取消' : 'Cancel'}
        </button>
      </div>
      <p role="status" aria-atomic="true" className="min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      <p className="text-[11px] font-medium leading-relaxed">{zh ? '粗描边配硬边投影；按下时下沉，键盘和点击触发同一个模拟。' : 'Heavy outline and hard shadow; a press sinks the button. Keyboard and pointer trigger the same simulation.'}</p>
    </div>
  );
}

function Glass({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  return (
    <div className="relative mx-auto flex max-w-sm flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-white">
      <span className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <span className="pointer-events-none absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</p>
      <div className="relative flex flex-wrap gap-3">
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start}
          className={`${target} ${focus} focus-visible:outline-white rounded-xl border border-white/50 bg-white/20 px-4 py-2 text-xs font-semibold shadow-md shadow-black/10 backdrop-blur-md transition-all duration-200 motion-safe:enabled:hover:-translate-y-0.5 enabled:hover:bg-white/35 enabled:hover:shadow-lg motion-safe:enabled:focus-visible:-translate-y-0.5 enabled:focus-visible:bg-white/35 enabled:focus-visible:shadow-lg motion-reduce:transition-none`}>
          {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={action.cancel} className={`${target} ${focus} focus-visible:outline-white rounded-xl border border-white/30 bg-transparent px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-white/15`}>
          {zh ? '取消' : 'Cancel'}
        </button>
      </div>
      <p role="status" aria-atomic="true" className="relative min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      <p className="relative text-[11px] leading-relaxed text-white/80">{zh ? '磨砂玻璃叠在彩色背景上，用边框和模糊建立层次；悬停与键盘聚焦都有反馈。' : 'Frosted glass over a colourful backdrop, with borders and blur for hierarchy. Hover and keyboard focus both give feedback.'}</p>
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
