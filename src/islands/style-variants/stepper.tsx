import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Editorial({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '检查'] : ['Details', 'Shipping', 'Review'];
  const [step, setStep] = useSessionState(session, 'step', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-y-2 border-black bg-[#faf8f2] px-5 py-6 font-serif text-black">
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">{zh ? '流程演示' : 'Workflow demo'}</p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} aria-current={step === i ? 'step' : undefined} className="flex items-baseline gap-3 border-b border-black/15 pb-2 last:border-0">
            <span className="text-2xl font-bold italic leading-none">{String(i + 1).padStart(2, '0')}</span>
            <span className={`text-sm ${i === step ? 'font-semibold' : 'text-black/45'}`}>{s}</span>
            {i < step && <span className="ml-auto text-[10px] uppercase tracking-widest text-black/40">{zh ? '已完成' : 'done'}</span>}
            {i === step && <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-red-700">{zh ? '当前' : 'now'}</span>}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border border-black px-3 py-1.5 text-[11px] uppercase tracking-widest disabled:opacity-30">
          {zh ? '上一步' : 'Back'}
        </button>
        <button type="button" onClick={() => setStep((s) => s === steps.length - 1 ? 0 : s + 1)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none bg-black px-3 py-1.5 text-[11px] uppercase tracking-widest text-white">
          {step === 2 ? (zh ? '重新演示' : 'Restart demo') : (zh ? '下一步' : 'Next')}
        </button>
      </div>
      <p role="status" className="mt-4 text-xs">{zh ? `当前：${steps[step]} · 仅本地预览，不会提交订单。` : `Current: ${steps[step]} · Local preview; no order is submitted.`}</p>
    </div>
  );
}

function Deco({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '检查'] : ['Details', 'Shipping', 'Review'];
  const [step, setStep] = useSessionState(session, 'step', 0);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#12141c] px-6 py-7 text-center text-[#e8ce92]" style={{ outline: '1px solid #e8ce9255', outlineOffset: -8 }}>
      <p className="font-serif text-lg uppercase tracking-[0.35em]">{zh ? '流程演示' : 'Workflow demo'}</p>
      <div className="mx-auto my-3 flex items-center justify-center gap-2 text-[#e8ce92]/50">
        <span className="h-px w-8 bg-[#e8ce92]/50" />◆<span className="h-px w-8 bg-[#e8ce92]/50" />
      </div>
      <ol className="flex items-start justify-between gap-2">
        {steps.map((s, i) => (
          <li key={s} aria-current={step === i ? 'step' : undefined} className="flex flex-1 flex-col items-center gap-2">
            <span className={`flex h-8 w-8 rotate-45 items-center justify-center border ${i <= step ? 'border-[#e8ce92] bg-[#e8ce92] text-[#12141c]' : 'border-[#e8ce9255] text-[#e8ce92]/60'}`}>
              <span className="-rotate-45 font-serif text-xs">{i + 1}</span>
            </span>
            <span className="font-serif text-[10px] uppercase tracking-widest">{s}</span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => setStep((s) => s === steps.length - 1 ? 0 : s + 1)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none mt-6 border border-[#e8ce92] px-6 py-1.5 font-serif text-[11px] uppercase tracking-[0.25em] hover:bg-[#e8ce92] hover:text-[#12141c]">
        {step === 2 ? (zh ? '重新演示' : 'Restart demo') : (zh ? '继续' : 'Continue')}
      </button>
      <p role="status" className="mt-4 text-xs">{zh ? `当前：${steps[step]} · 仅本地预览，不会提交订单。` : `Current: ${steps[step]} · Local preview; no order is submitted.`}</p>
    </div>
  );
}

function Pixel({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '检查'] : ['Details', 'Shipping', 'Review'];
  const [step, setStep] = useSessionState(session, 'step', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-black bg-[#1b1b2f] p-5 font-mono text-[#eaeaea]">
      <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#7cf6a0]">{zh ? `第 ${step + 1}/3 步` : `Step ${step + 1}/3`}</p>
      <div className="mb-4 flex gap-1">
        {steps.map((s, i) => (
          <div key={s} className={`flex h-8 flex-1 items-center justify-center border-2 border-black text-[10px] ${i <= step ? 'bg-[#7cf6a0] text-black' : 'bg-[#3a3a5c] text-[#9aa0c0]'}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setStep((s) => (s + 1) % steps.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border-4 border-black bg-[#f6c945] px-4 py-2 text-[10px] font-bold uppercase text-black active:translate-y-[2px]">
        {step === 2 ? (zh ? '重新演示' : 'Restart demo') : (zh ? '下一步 ▶' : 'Next ▶')}
      </button>
      <p role="status" className="mt-4 text-xs">{zh ? `当前：${steps[step]} · 仅本地预览，不会提交订单。` : `Current: ${steps[step]} · Local preview; no order is submitted.`}</p>
    </div>
  );
}


function AdaptedStepper({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [step, setStep] = useSessionState(session, 'step', 0);
  const steps = en ? ['Details', 'Shipping', 'Review'] : ['信息', '配送', '检查'];
  const descriptions = en ? ['Check the sample contact details.', 'Choose a sample delivery option.', 'Review the demo summary. No order is placed.'] : ['查看示例联系信息。', '选择示例配送方式。', '查看演示摘要，不会创建订单。'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Three-step preview' : '三步流程预览'}>
    <ol className="space-y-2">{steps.map((label, i) => <li key={i} aria-current={step === i ? 'step' : undefined} className={`flex items-center gap-3 p-3 ${step === i ? r.active : r.item}`}><span aria-hidden="true" className="font-mono">{i < step ? '✓' : `0${i+1}`}</span><span className="flex-1 text-sm">{label}</span><span className="text-xs">{i < step ? (en ? 'Done' : '已完成') : step === i ? (en ? 'Current' : '当前') : (en ? 'Later' : '待进行')}</span></li>)}</ol>
    <p role="status" className={`mt-3 p-3 text-sm ${r.secondary}`}>{descriptions[step]}</p>
    <div className="mt-4 flex justify-between gap-2"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-4 text-xs disabled:opacity-40 ${r.secondary}`}>{en ? 'Back' : '上一步'}</button><button type="button" onClick={() => setStep(step === 2 ? 0 : step + 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-4 text-xs ${r.control}`}>{step === 2 ? (en ? 'Restart demo' : '重新演示') : (en ? 'Continue' : '继续')}</button></div>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。步骤节点区分完成、当前和待进行，支持上一步、继续及末步重新演示。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Step markers distinguish completed, current and future stages, with Back, Continue and an explicit final-step restart."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。步骤节点区分完成、当前和待进行，支持上一步、继续及末步重新演示。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Step markers distinguish completed, current and future stages, with Back, Continue and an explicit final-step restart."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。步骤节点区分完成、当前和待进行，支持上一步、继续及末步重新演示。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Step markers distinguish completed, current and future stages, with Back, Continue and an explicit final-step restart."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。步骤节点区分完成、当前和待进行，支持上一步、继续及末步重新演示。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Step markers distinguish completed, current and future stages, with Back, Continue and an explicit final-step restart."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。步骤节点区分完成、当前和待进行，支持上一步、继续及末步重新演示。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Step markers distinguish completed, current and future stages, with Back, Continue and an explicit final-step restart."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '衬线大号斜体序号压在细横规线上，当前步骤用红色小标签点出，读起来像杂志目录。',
      en: 'Big italic serif numerals sit on thin rules with the current step flagged by a small red label, reading like a magazine contents page.',
    },
    Demo: localDemo(Editorial),
  },
  {
    style: 'art-deco',
    name: {"zh":"装饰艺术","en":"Art Deco"},
    note: {
      zh: '近黑底配金字，菱形节点严格对称，由发丝金线分隔出优雅的秩序感。',
      en: 'Gold on near-black with symmetrical diamond markers separated by hairline gold rules for an elegant, ordered rhythm.',
    },
    Demo: localDemo(Deco),
  },
  {
    style: 'pixel-art',
    name: {"zh":"像素风","en":"Pixel Art UI"},
    note: {
      zh: '硬边像素块与无抗锯齿的关卡格子，单色高亮，推进像游戏过关。',
      en: 'Hard-edged pixel blocks and aliased stage cells with a single highlight colour, advancing like clearing game levels.',
    },
    Demo: localDemo(Pixel),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedStepper {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
