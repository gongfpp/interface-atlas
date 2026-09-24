import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const VARIANTS = [
  { id: 'tour', zh: '分步导览', en: 'Step Tour' },
  { id: 'checklist', zh: '任务清单', en: 'Checklist' },
  { id: 'interactive', zh: '实操引导', en: 'Interactive' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TEXT = {
  zh: {
    skip: '跳过',
    next: '下一步',
    done: '完成引导',
    finish: '开始第一个任务',
    title: ['欢迎使用 Atlas', '连接你的数据', '设置完成'],
    body: ['一句话说明产品能帮你做什么。', '完成第一个关键设置动作。', '把示例任务交给你，直接开始。'],
    tasks: ['创建第一个项目', '邀请一位成员', '设置通知偏好'],
    target: ['这里新建项目', '点这里邀请成员', '在这里调整偏好'],
    hint: '点按钮推进引导',
  },
  en: {
    skip: 'Skip',
    next: 'Next',
    done: 'Finish',
    finish: 'Start first task',
    title: ['Welcome to Atlas', 'Connect your data', 'Setup complete'],
    body: ['One line on what the product does for you.', 'Complete the first key setup step.', 'Here is a sample task to begin.'],
    tasks: ['Create your first project', 'Invite a teammate', 'Set notification preferences'],
    target: ['Create a project here', 'Invite a teammate here', 'Adjust preferences here'],
    hint: 'Click the button to advance',
  },
};

type Copy = (typeof TEXT)['zh'];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
    {children}
  </div>
);

function TourBody({
  copy,
  step,
  onNext,
  onSkip,
}: {
  copy: Copy;
  step: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const n = copy.title.length;
  const done = step >= n;
  const pct = done ? 100 : ((step + 1) / n) * 100;
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-3/20" data-anatomy="1">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${pct}%`, transitionDuration: 'calc(250ms * var(--demo-speed, 1))' }}
          />
        </div>
        <button onClick={onSkip} className="text-[10px] text-ink-3 transition-colors hover:text-accent" data-anatomy="6">
          {copy.skip}
        </button>
      </div>
      <div className="mt-2 flex gap-1" data-anatomy="4">
        {copy.title.map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${done || i <= step ? 'bg-accent' : 'bg-ink-3/30'}`} />
        ))}
      </div>
      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center" data-anatomy="2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">✓</span>
          <p className="font-serif text-sm font-semibold">{copy.title[n - 1]}</p>
          <p className="text-[11px] text-ink-2">{copy.finish}</p>
        </div>
      ) : (
        <>
          <div className="mt-3 flex h-24 items-center justify-center rounded-lg bg-accent-soft" data-anatomy="2">
            <span className="font-serif text-2xl font-bold text-accent">{step + 1}</span>
          </div>
          <div className="mt-3 flex-1" data-anatomy="3">
            <p className="font-serif text-sm font-semibold">{copy.title[step]}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-2">{copy.body[step]}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-ink-3">
              {step + 1} / {n}
            </span>
            <button
              onClick={onNext}
              className="rounded bg-accent px-3 py-1 text-[11px] font-medium text-white hover:opacity-90"
              data-anatomy="5"
            >
              {step === n - 1 ? copy.done : copy.next}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChecklistBody({
  copy,
  checked,
  onToggle,
}: {
  copy: Copy;
  checked: boolean[];
  onToggle: (i: number) => void;
}) {
  const total = checked.filter(Boolean).length;
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="font-serif text-sm font-semibold" data-anatomy="3">
          {copy.title[0]}
        </p>
        <span className="text-[10px] text-ink-3">
          {total} / {checked.length}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-3/20" data-anatomy="1">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${(total / checked.length) * 100}%`, transitionDuration: 'calc(250ms * var(--demo-speed, 1))' }}
        />
      </div>
      <div className="mt-3 flex-1 space-y-2" data-anatomy="4">
        {copy.tasks.map((t, i) => (
          <button
            key={t}
            onClick={() => onToggle(i)}
            className="flex w-full items-center gap-2 rounded-md border border-line bg-raised px-2 py-1.5 text-left transition-colors hover:border-line-strong"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] ${
                checked[i] ? 'border-accent bg-accent text-white' : 'border-line-strong text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={`text-[11px] ${checked[i] ? 'text-ink-3 line-through' : 'text-ink'}`}>{t}</span>
          </button>
        ))}
      </div>
      <div className="mt-3" data-anatomy="5">
        <button className="w-full rounded bg-accent px-3 py-1.5 text-[11px] font-medium text-white hover:opacity-90">
          {copy.done}
        </button>
      </div>
    </div>
  );
}

function InteractiveBody({
  copy,
  target,
  onAdvance,
}: {
  copy: Copy;
  target: number;
  onAdvance: () => void;
}) {
  const labels = ['项目', '成员', '设置'];
  const actions = ['新建', '邀请', '偏好'];
  return (
    <div className="flex flex-1 flex-col p-3">
      <div className="flex h-7 items-center gap-2 rounded-t border-b border-line bg-raised px-2" data-anatomy="3">
        <span className="h-2.5 w-2.5 rounded bg-accent" />
        <span className="text-[10px] font-medium">Atlas</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 py-2">
        {copy.target.map((label, i) => (
          <div key={label} className="relative flex items-center justify-between rounded border border-line bg-raised px-2 py-2">
            <span className="text-[10px] text-ink-2">{labels[i]}</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] ${
                i === target ? 'relative z-10 bg-accent text-white' : 'bg-ink-3/15 text-ink-2'
              }`}
            >
              {actions[i]}
            </span>
            {i === target && (
              <>
                <span className="onb-ring pointer-events-none absolute -inset-1 rounded-md border-2 border-accent" data-anatomy="1" />
                <span
                  className="absolute left-2 top-full z-20 mt-1 rounded-md border border-line bg-paper px-2 py-1 text-[10px] text-ink shadow-md"
                  data-anatomy="5"
                >
                  {label}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={onAdvance} className="rounded bg-accent px-3 py-1 text-[11px] font-medium text-white hover:opacity-90">
          {copy.next}
        </button>
      </div>
      <style>{`
        @keyframes onbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        .onb-ring { animation: onbPulse calc(1400ms * var(--demo-speed, 1)) ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .onb-ring { animation: none; } }
      `}</style>
    </div>
  );
}

const OnboardingDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const copy = TEXT[locale];
  const [variant, setVariant] = useState<VariantId>('tour');
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState([false, false, false]);

  const body = (v: VariantId) => {
    if (v === 'tour')
      return (
        <TourBody
          copy={copy}
          step={step}
          onNext={() => setStep((s) => Math.min(s + 1, copy.title.length))}
          onSkip={() => setStep(copy.title.length)}
        />
      );
    if (v === 'checklist')
      return (
        <ChecklistBody copy={copy} checked={checked} onToggle={(i) => setChecked((c) => c.map((x, j) => (j === i ? !x : x)))} />
      );
    return <InteractiveBody copy={copy} target={step % copy.target.length} onAdvance={() => setStep((s) => (s + 1) % copy.target.length)} />;
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Card>
                {v.id === 'tour' && <TourBody copy={copy} step={1} onNext={() => {}} onSkip={() => {}} />}
                {v.id === 'checklist' && <ChecklistBody copy={copy} checked={[true, false, false]} onToggle={() => {}} />}
                {v.id === 'interactive' && <InteractiveBody copy={copy} target={1} onAdvance={() => {}} />}
              </Card>
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
            onClick={() => {
              setVariant(v.id);
              setStep(0);
            }}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh} / {v.en}
          </button>
        ))}
      </div>
      <Card>{body(variant)}</Card>
      <p className="text-center text-[11px] text-ink-3">{copy.hint}</p>
    </div>
  );
};

export default OnboardingDemo;
