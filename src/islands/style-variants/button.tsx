import { recipe, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useButtonFeedback } from '../shared/useButtonFeedback';
import { buttonFeedbackText } from '../../lib/button-feedback';

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4';
const target = 'min-h-11 min-w-28 max-w-full disabled:cursor-wait disabled:opacity-60';

function Minimal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 border border-black/10 bg-white p-5 text-black [overflow-wrap:anywhere]">
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
    <div className="mx-auto flex max-w-sm flex-col gap-3 bg-[#fdf6b2] p-5 text-black [overflow-wrap:anywhere]" style={{ border: '2.5px solid #000' }}>
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
    <div className="relative mx-auto flex max-w-sm flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-[#080511] [overflow-wrap:anywhere]">
      <span className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <span className="pointer-events-none absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em]">{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</p>
      <div className="relative flex flex-wrap gap-3">
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start}
          className={`${target} ${focus} focus-visible:outline-[#080511] rounded-xl border border-white/50 bg-white/20 px-4 py-2 text-xs font-semibold shadow-md shadow-black/10 backdrop-blur-md transition-all duration-200 motion-safe:enabled:hover:-translate-y-0.5 enabled:hover:bg-white/35 enabled:hover:shadow-lg motion-safe:enabled:focus-visible:-translate-y-0.5 enabled:focus-visible:bg-white/35 enabled:focus-visible:shadow-lg motion-reduce:transition-none`}>
          {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={action.cancel} className={`${target} ${focus} focus-visible:outline-[#080511] rounded-xl border border-white/30 bg-transparent px-4 py-2 text-xs font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-white/15`}>
          {zh ? '取消' : 'Cancel'}
        </button>
      </div>
      <p role="status" aria-atomic="true" className="relative min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      <p className="relative text-[11px] leading-relaxed">{zh ? '磨砂玻璃叠在彩色背景上，用边框和模糊建立层次；悬停与键盘聚焦都有反馈。' : 'Frosted glass over a colourful backdrop, with borders and blur for hierarchy. Hover and keyboard focus both give feedback.'}</p>
    </div>
  );
}

function Swiss({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-[2rem_minmax(0,1fr)] gap-4 border-y-2 border-black bg-white p-5 text-black [overflow-wrap:anywhere]">
      <span className="font-mono text-xs font-bold text-[#b21f1f]" aria-hidden="true">01</span>
      <div className="min-w-0">
        <p className="border-b border-black pb-3 text-xs font-bold uppercase tracking-[0.18em]">{zh ? '操作 / 本地模拟' : 'Action / local demo'}</p>
        <h4 className="my-5 text-3xl font-black leading-none tracking-tight">{zh ? '清楚。直接。' : 'Clear. Direct.'}</h4>
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start} className={`${target} ${focus} flex w-full items-center justify-between gap-3 bg-[#b21f1f] px-4 py-3 text-left text-sm font-bold text-white hover:bg-black focus-visible:outline-black`}>
          <span>{action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}</span><span aria-hidden="true">↗</span>
        </button>
        <button type="button" onClick={action.cancel} className={`${target} ${focus} mt-2 w-full border-b border-black px-4 py-3 text-left text-sm font-semibold hover:bg-black/5 focus-visible:outline-black`}>{zh ? '取消' : 'Cancel'}</button>
        <p role="status" aria-atomic="true" className="mt-4 min-h-10 border-t border-black/20 pt-3 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      </div>
    </div>
  );
}

function Cyberpunk({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  return (
    <div className="relative mx-auto w-full max-w-sm border border-[#45f4db] bg-[#080d19] p-5 font-mono text-[#d5fff8] [overflow-wrap:anywhere]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #45f4db 3px, #45f4db 4px)' }} />
      <div className="relative">
        <p className="border-b border-[#45f4db]/50 pb-3 text-[10px] uppercase tracking-[0.18em] text-[#ff9df1]">{zh ? '终端 06 / 本地模拟' : 'Terminal 06 / local demo'}</p>
        <h4 className="my-5 text-2xl font-black uppercase leading-tight">{zh ? '等待指令_' : 'Await command_'}</h4>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start} className={`${target} ${focus} border-2 border-[#45f4db] bg-[#45f4db] px-4 py-3 text-xs font-black uppercase text-[#080d19] shadow-[3px_3px_0_#eb73dc] enabled:hover:shadow-[0_0_16px_#45f4db55] enabled:active:shadow-none focus-visible:outline-[#ff9df1]`}>
            {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
          </button>
          <button type="button" onClick={action.cancel} className={`${target} ${focus} border border-[#ff9df1] bg-[#080d19] px-4 py-3 text-xs uppercase text-[#ffb7f5] hover:bg-[#31182e] focus-visible:outline-[#45f4db]`}>{zh ? '取消' : 'Cancel'}</button>
        </div>
        <p role="status" aria-atomic="true" className="mt-5 min-h-10 border-l-2 border-[#45f4db] pl-3 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      </div>
    </div>
  );
}

function Neumorphic({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const action = useButtonFeedback(session);
  const raised = 'shadow-[5px_5px_10px_#bec8d3,-5px_-5px_10px_#ffffff] enabled:active:shadow-[inset_3px_3px_6px_#bec8d3,inset_-3px_-3px_6px_#ffffff]';
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e7ecf2] p-6 text-[#283c50] shadow-[8px_8px_18px_#bcc6d1,-8px_-8px_18px_#ffffff] [overflow-wrap:anywhere]">
      <div aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#b8c3ce] text-xl text-[#1756a9] shadow-[inset_4px_4px_8px_#bdc8d3,inset_-4px_-4px_8px_#ffffff]">↓</div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4d6175]">{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</p>
      <div className="mt-5 flex flex-wrap gap-4">
        <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start} className={`${target} ${focus} ${raised} rounded-2xl border border-[#738496] bg-[#e7ecf2] px-4 py-3 text-sm font-bold text-[#1756a9] hover:border-[#1756a9] focus-visible:outline-[#1756a9]`}>
          {action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={action.cancel} className={`${target} ${focus} rounded-2xl border border-[#738496] bg-[#e7ecf2] px-4 py-3 text-sm shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#ffffff] hover:border-[#1756a9] focus-visible:outline-[#1756a9]`}>{zh ? '取消' : 'Cancel'}</button>
      </div>
      <p role="status" aria-atomic="true" className="mt-5 min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
      <p className="mt-3 text-[11px] leading-relaxed text-[#4d6175]">{zh ? '阴影只表达材质；文字、实线边界与焦点共同说明操作状态。' : 'Shadows express material. Labels, solid borders and focus communicate interaction state.'}</p>
    </div>
  );
}

function AdditionalButton({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const r = recipe(style); const action = useButtonFeedback(session); const zh = locale === 'zh';
  return <div data-style-recipe={style} className={`mx-auto w-full max-w-sm [overflow-wrap:anywhere] ${r.frame}`}>
    <header className={r.header}><h4 className={r.title}>{zh ? '保存更改 · 本地模拟' : 'Save changes · local demo'}</h4></header>
    <div className={style === 'pixel-art' ? 'grid gap-4' : 'flex flex-wrap gap-3'}>
      <button type="button" disabled={action.busy} aria-busy={action.busy} onClick={action.start} className={`${r.control} !min-w-28`}>{action.busy ? (zh ? '处理中…' : 'Working…') : zh ? '保存' : 'Save'}</button>
      <button type="button" onClick={action.cancel} className={r.secondary}>{zh ? '取消' : 'Cancel'}</button>
    </div>
    <p role="status" aria-atomic="true" className="mt-4 min-h-10 text-xs leading-relaxed">{buttonFeedbackText(action.state, locale)}</p>
  </div>;
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
  {
    style: 'swiss-style', name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: { zh: '编号侧栏、严格左对齐与大字号建立网格秩序；单一红色主按钮和细线取消操作突出层级。', en: 'An indexed rail, flush-left grid and strong type scale establish order; one red primary action and a ruled cancel action define hierarchy.' },
    Demo: Swiss,
  },
  {
    style: 'cyberpunk', name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: { zh: '近黑终端、静态扫描线与等宽排版配青色实体主按钮、品红偏移描边；不使用闪烁制造反馈。', en: 'A near-black terminal, static scanlines and monospace type frame a solid cyan action with magenta offsets; feedback never relies on flicker.' },
    Demo: Cyberpunk,
  },
  {
    style: 'neumorphism', name: { zh: '新拟态', en: 'Neumorphism' },
    note: { zh: '同色软浮雕表面上的凸起主按钮与凹陷次操作；明暗双阴影之外保留深色文字、实线边框和可见焦点。', en: 'A raised primary button and inset secondary action share a soft relief surface; paired shadows retain dark labels, solid borders and visible focus.' },
    Demo: Neumorphic,
  },
  recipeVariant('flat-design', (props) => <AdditionalButton {...props} style="flat-design" />, { zh: '无投影纯色块、分明圆角与等高操作；保存和取消共享可中断本地状态。', en: 'Shadow-free solid blocks, clear corners and equal-height actions share an interruptible local save state.' }),
  recipeVariant('pixel-art', (props) => <AdditionalButton {...props} style="pixel-art" />, { zh: '4px 方角边与阶梯硬投影，等宽大写按钮纵向堆叠；加载、取消与完成都有文字反馈。', en: 'Square 4px edges, stepped hard shadows and stacked monospace actions expose loading, cancellation and completion in text.' }),
];

export default styleVariants;
