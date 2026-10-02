import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'one-page', zh: '单页结账', en: 'One-page' },
  { id: 'multi-step', zh: '多步结账', en: 'Multi-step' },
  { id: 'accordion', zh: '手风琴式', en: 'Accordion' },
  { id: 'express', zh: '快捷支付', en: 'Express' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'multi-step' };

const STEPS = ['收货', '支付', '确认'];
const TOTAL = 238;

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

function Stepper({ step, onStep }: { step: number; onStep: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5" data-anatomy="1">
      {STEPS.map((s, i) => (
        <button key={s} onClick={() => i < step && onStep(i)} className="flex items-center gap-1 text-[9px]" disabled={i > step}>
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${
              i < step ? 'bg-accent text-white' : i === step ? 'border-2 border-accent text-accent' : 'border border-line text-ink-3'
            }`}
          >
            {i < step ? '✓' : i + 1}
          </span>
          <span className={i === step ? 'font-medium text-ink' : 'text-ink-3'}>{s}</span>
          {i < STEPS.length - 1 && <span className="ml-0.5 h-px w-4 bg-line" />}
        </button>
      ))}
    </div>
  );
}

function Summary({ done }: { done: boolean }) {
  return (
    <div className="w-28 shrink-0 space-y-1 rounded-md border border-line bg-raised p-2" data-anatomy="4">
      <p className="text-[9px] font-medium text-ink-2">订单摘要{done && <span className="ml-1 text-accent">✓</span>}</p>
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-accent/30" />
        <Bar w="w-12" h="h-1" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-accent/20" />
        <Bar w="w-10" h="h-1" />
      </div>
      <div className="border-t border-line pt-1 text-[9px] text-ink-2">
        <p className="flex justify-between"><span>运费</span><span>免运费</span></p>
        <p className="flex justify-between font-semibold text-ink"><span>合计</span><span>¥{TOTAL}</span></p>
      </div>
    </div>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(0);
  const [pay, setPay] = useState('card');
  const [placed, setPlaced] = useState(false);

  const stepForms = [
    <div key="ship" className="space-y-1.5" data-anatomy="2">
      {['姓名', '收货地址', '手机号'].map((l) => (
        <div key={l} className="space-y-0.5">
          <Bar w="w-10" h="h-1" cls="bg-ink-3/40" />
          <div className="rounded border border-line bg-paper px-2 py-1 text-[9px] text-ink-3">
            {l === '手机号' ? '138****8888' : l === '姓名' ? '林小满' : '杭州市…'}
          </div>
        </div>
      ))}
    </div>,
    <div key="pay" className="space-y-1" data-anatomy="3">
      {[
        { id: 'card', l: '银行卡支付' },
        { id: 'wechat', l: '微信支付' },
        { id: 'alipay', l: '支付宝' },
      ].map((p) => (
        <button
          key={p.id}
          onClick={() => setPay(p.id)}
          className={`flex w-full items-center gap-1.5 rounded border px-2 py-1 text-[9px] transition-colors ${
            pay === p.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full border ${pay === p.id ? 'border-accent bg-accent' : 'border-line'}`} />
          {p.l}
        </button>
      ))}
    </div>,
    <div key="done" className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
      <span className="text-lg text-accent">✓</span>
      <p className="text-[11px] font-medium">订单已提交</p>
      <p className="text-[9px] text-ink-3">确认邮件已发送</p>
    </div>,
  ];

  const placeBtn = (
    <button
      onClick={() => (step < 2 ? setStep((s) => s + 1) : setPlaced(true))}
      disabled={placed}
      className="w-full rounded bg-accent py-1.5 text-[10px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      data-anatomy="5"
    >
      {step < 2 ? `下一步：${STEPS[step + 1]}` : placed ? '已提交 ✓' : `提交订单 · ¥${TOTAL}`}
    </button>
  );

  const header = variant === 'one-page' ? <span className="text-[10px] font-medium">安全结账</span> : <Stepper step={step} onStep={setStep} />;

  if (variant === 'accordion') {
    return (
      <div className="flex h-72 w-full gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
          {STEPS.map((s, i) => (
            <div key={s} className={`rounded-md border ${i === open ? 'border-accent' : 'border-line'}`}>
              <button
                onClick={() => setOpen(i)}
                className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-[10px]"
              >
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] ${i < open ? 'bg-accent text-white' : i === open ? 'border-2 border-accent text-accent' : 'border border-line text-ink-3'}`}>
                  {i < open ? '✓' : i + 1}
                </span>
                {s}
                <span className="ml-auto text-ink-3">{i === open ? '▾' : '▸'}</span>
              </button>
              {i === open && (
                <div className="border-t border-line p-2" data-anatomy="2">
                  {i === 0 && <Bar w="w-full" h="h-1" />}
                  {i === 0 && <div className="mt-1 rounded border border-line bg-paper px-2 py-1 text-[9px] text-ink-3">林小满 · 杭州市…</div>}
                  {i === 1 && <p className="text-[9px] text-ink-2">选择支付方式：银行卡 / 微信 / 支付宝</p>}
                  {i === 2 && <p className="text-[9px] text-ink-2">核对收货与支付信息后提交</p>}
                </div>
              )}
            </div>
          ))}
          {placeBtn}
        </div>
        <Summary done={placed} />
      </div>
    );
  }

  if (variant === 'one-page') {
    return (
      <div className="flex h-72 w-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
        <div className="flex items-center justify-between">{header}<span className="text-[9px] text-ink-3">🔒 加密传输</span></div>
        <div className="flex flex-1 gap-2 overflow-hidden">
          <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
            {stepForms[0]}
            {stepForms[1]}
          </div>
          <Summary done={placed} />
        </div>
        {placeBtn}
      </div>
    );
  }

  if (variant === 'express') {
    return (
      <div className="flex h-72 w-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
        <div className="flex items-center justify-between"><span className="text-[10px] font-medium">快捷支付</span><span className="text-[9px] text-ink-3">🔒 加密传输</span></div>
        <div className="flex gap-1.5" data-anatomy="3">
          {['Apple Pay', '微信一键付'].map((e) => (
            <button key={e} onClick={() => setPlaced(true)} className="flex-1 rounded bg-accent py-1.5 text-[9px] font-medium text-white hover:opacity-90">
              ⚡ {e}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[8px] text-ink-3">
          <span className="h-px flex-1 bg-line" />或用下方表单<span className="h-px flex-1 bg-line" />
        </div>
        <div className="flex flex-1 gap-2 overflow-hidden">
          <div className="flex-1 space-y-1.5 overflow-hidden">{stepForms[0]}</div>
          <Summary done={placed} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-72 w-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
      <div className="flex items-center justify-between">{header}<span className="text-[9px] text-ink-3">🔒 加密传输</span></div>
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
          {stepForms[step]}
          {step === 0 && <p className="mt-auto text-[8px] text-ink-3">配送：预计 3 天到达</p>}
        </div>
        <Summary done={placed} />
      </div>
      {placeBtn}
    </div>
  );
}

const CheckoutDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = usePreviewVariant<VariantId>('multi-step');

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            aria-pressed={variant === v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={variant} variant={variant} />
      <p className="text-center text-[11px] text-ink-3">点「下一步」走完三步流程；步骤条可点回退</p>
    </div>
  );
};

export default CheckoutDemo;
