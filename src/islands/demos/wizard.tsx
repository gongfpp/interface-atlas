import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'linear' | 'free-order' | 'with-review';

const STEPS = [
  { zh: '账号', en: 'Account' },
  { zh: '资料', en: 'Profile' },
  { zh: '确认', en: 'Review' },
];

function WizardPlayground({ en, review }: { en: boolean; review: boolean }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ email: 'lin@example.com', name: '', plan: 'pro' });
  const [done, setDone] = useState(false);
  const last = STEPS.length - 1;
  const maxStep = review ? last : last - 1;

  const field = (label: string, value: string, onChange: (v: string) => void) => (
    <label className="mb-2 block">
      <span className="mb-1 block text-[10px] text-ink-3">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </label>
  );

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-line bg-paper p-4">
      <ol data-anatomy="1" className="mb-4 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s.en} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i <= step && setStep(i)}
              aria-current={i === step ? 'step' : undefined}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                i < step
                  ? 'border-accent bg-accent text-white'
                  : i === step
                    ? 'border-accent text-accent'
                    : 'border-line text-ink-3'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`text-[11px] ${i === step ? 'text-ink' : 'text-ink-3'}`}>
              {en ? s.en : s.zh}
            </span>
            {i < last && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      <div data-anatomy="2" className="min-h-28">
        {done ? (
          <p className="py-8 text-center text-sm text-ink">
            {en ? 'Submitted — values accumulated across steps.' : '已提交 — 各步数据累积后一次落库。'}
          </p>
        ) : step === 0 ? (
          <>
            <p className="mb-2 text-xs font-medium text-ink">{en ? 'Account' : '账号'}</p>
            {field(en ? 'Email' : '邮箱', values.email, (v) => setValues({ ...values, email: v }))}
          </>
        ) : step === 1 ? (
          <>
            <p className="mb-2 text-xs font-medium text-ink">{en ? 'Profile' : '资料'}</p>
            {field(en ? 'Display name' : '昵称', values.name, (v) => setValues({ ...values, name: v }))}
            <p className="mb-1 block text-[10px] text-ink-3">{en ? 'Plan' : '套餐'}</p>
            <div className="flex gap-1.5">
              {['pro', 'team'].map((p) => (
                <button
                  key={p}
                  onClick={() => setValues({ ...values, plan: p })}
                  aria-pressed={values.plan === p}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] ${
                    values.plan === p ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
                  }`}
                >
                  {p === 'pro' ? (en ? 'Pro' : '专业版') : en ? 'Team' : '团队版'}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-xs font-medium text-ink">{en ? 'Review' : '确认'}</p>
            <dl className="space-y-1 rounded-lg bg-code-bg px-3 py-2 font-mono text-[11px] text-ink-2">
              <div>email: {values.email || '—'}</div>
              <div>name: {values.name || '—'}</div>
              <div>plan: {values.plan}</div>
            </dl>
          </>
        )}
      </div>

      <div data-anatomy="3" className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || done}
          className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 disabled:opacity-40"
        >
          {en ? '← Back' : '← 上一步'}
        </button>
        <span className="text-[10px] text-ink-3">
          {en ? `Step ${step + 1} / ${maxStep + 1}` : `第 ${step + 1} / ${maxStep + 1} 步`}
        </span>
        <button
          onClick={() => {
            if (step < maxStep) setStep((s) => s + 1);
            else setDone(true);
          }}
          disabled={done}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          {step < maxStep ? (en ? 'Next →' : '下一步 →') : en ? 'Submit' : '提交'}
        </button>
      </div>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Variant, string, string, string]> = [
    ['linear', '线性', 'Linear', '严格一步一步推进'],
    ['free-order', '自由顺序', 'Free-order', '已完成步可点回跳'],
    ['with-review', '带确认步', 'With review', '末步汇总后再提交'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english, note]) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{en ? id : note}</p>
          <div className="mt-2 flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-accent' : id === 'free-order' ? 'bg-accent/40' : 'bg-line'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const WizardDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <WizardPlayground en={en} review />;
};

export default WizardDemo;
