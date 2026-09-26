import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Editorial({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '支付'] : ['Details', 'Shipping', 'Payment'];
  const [step, setStep] = useSessionState(session, 'step', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-y-2 border-black bg-[#faf8f2] px-5 py-6 font-serif text-black">
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">{zh ? '结账' : 'Checkout'}</p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-baseline gap-3 border-b border-black/15 pb-2 last:border-0">
            <span className="text-2xl font-bold italic leading-none">{String(i + 1).padStart(2, '0')}</span>
            <span className={`text-sm ${i === step ? 'font-semibold' : 'text-black/45'}`}>{s}</span>
            {i < step && <span className="ml-auto text-[10px] uppercase tracking-widest text-black/40">{zh ? '已完成' : 'done'}</span>}
            {i === step && <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-red-700">{zh ? '当前' : 'now'}</span>}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-between">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="border border-black px-3 py-1.5 text-[11px] uppercase tracking-widest disabled:opacity-30">
          {zh ? '上一步' : 'Back'}
        </button>
        <button onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))} className="bg-black px-3 py-1.5 text-[11px] uppercase tracking-widest text-white">
          {zh ? '下一步' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function Deco({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '支付'] : ['Details', 'Shipping', 'Payment'];
  const [step, setStep] = useSessionState(session, 'step', 0);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#12141c] px-6 py-7 text-center text-[#e8ce92]" style={{ outline: '1px solid #e8ce9255', outlineOffset: -8 }}>
      <p className="font-serif text-lg uppercase tracking-[0.35em]">{zh ? '结账' : 'Checkout'}</p>
      <div className="mx-auto my-3 flex items-center justify-center gap-2 text-[#e8ce92]/50">
        <span className="h-px w-8 bg-[#e8ce92]/50" />◆<span className="h-px w-8 bg-[#e8ce92]/50" />
      </div>
      <ol className="flex items-start justify-between gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-2">
            <span className={`flex h-8 w-8 rotate-45 items-center justify-center border ${i <= step ? 'border-[#e8ce92] bg-[#e8ce92] text-[#12141c]' : 'border-[#e8ce9255] text-[#e8ce92]/60'}`}>
              <span className="-rotate-45 font-serif text-xs">{i + 1}</span>
            </span>
            <span className="font-serif text-[10px] uppercase tracking-widest">{s}</span>
          </li>
        ))}
      </ol>
      <button onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))} className="mt-6 border border-[#e8ce92] px-6 py-1.5 font-serif text-[11px] uppercase tracking-[0.25em] hover:bg-[#e8ce92] hover:text-[#12141c]">
        {zh ? '继续' : 'Continue'}
      </button>
    </div>
  );
}

function Pixel({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const steps = zh ? ['信息', '配送', '支付'] : ['Details', 'Shipping', 'Payment'];
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
      <button onClick={() => setStep((s) => (s + 1) % steps.length)} className="border-4 border-black bg-[#f6c945] px-4 py-2 text-[10px] font-bold uppercase text-black active:translate-y-[2px]">
        {zh ? '下一步 ▶' : 'Next ▶'}
      </button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: { zh: '编辑排版', en: 'Editorial' },
    note: {
      zh: '衬线大号斜体序号压在细横规线上，当前步骤用红色小标签点出，读起来像杂志目录。',
      en: 'Big italic serif numerals sit on thin rules with the current step flagged by a small red label, reading like a magazine contents page.',
    },
    Demo: Editorial,
  },
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '近黑底配金字，菱形节点严格对称，由发丝金线分隔出优雅的秩序感。',
      en: 'Gold on near-black with symmetrical diamond markers separated by hairline gold rules for an elegant, ordered rhythm.',
    },
    Demo: Deco,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素艺术', en: 'Pixel Art' },
    note: {
      zh: '硬边像素块与无抗锯齿的关卡格子，单色高亮，推进像游戏过关。',
      en: 'Hard-edged pixel blocks and aliased stage cells with a single highlight colour, advancing like clearing game levels.',
    },
    Demo: Pixel,
  },
];

export default styleVariants;
