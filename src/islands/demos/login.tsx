import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'centered', zh: '居中卡片', en: 'Centered' },
  { id: 'split', zh: '分屏品牌', en: 'Split' },
  { id: 'multi-step', zh: '多步登录', en: 'Multi-step' },
  { id: 'social', zh: '社交优先', en: 'Social-first' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

function LoginForm({ step, onNext }: { step: 0 | 1; onNext: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-44 space-y-2" data-anatomy="2">
      <div className="space-y-1">
        <Bar w="w-8" h="h-1" cls="bg-ink-3/40" />
        <div className="flex items-center rounded border border-line bg-paper px-1.5 py-1 text-[9px] text-ink-3">
          {step === 0 ? 'you@email.com' : show ? 'p@ssw0rd!' : '••••••••'}
        </div>
      </div>
      {step === 1 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Bar w="w-10" h="h-1" cls="bg-ink-3/40" />
            <button onClick={() => setShow((s) => !s)} className="text-[9px] text-accent">
              {show ? '隐藏' : '显示'}
            </button>
          </div>
          <div className="rounded border border-line bg-paper px-1.5 py-1 text-[9px] text-ink-3">
            {show ? 'p@ssw0rd!' : '••••••••'}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-[9px]" data-anatomy="4">
        <span className="flex items-center gap-1 text-ink-2"><span className="h-2 w-2 rounded-sm bg-accent" />记住我</span>
        <span className="text-accent">忘记密码？</span>
      </div>
      <button
        onClick={onNext}
        className="w-full rounded bg-accent py-1 text-[10px] font-medium text-white transition-opacity hover:opacity-90"
      >
        {step === 0 ? '下一步' : '登录'}
      </button>
    </div>
  );
}

const SocialRow = ({ compact = false }: { compact?: boolean }) => (
  <div className={`flex ${compact ? 'flex-col' : 'flex-row'} gap-1.5`} data-anatomy="3">
    {['GitHub', 'Google'].map((p) => (
      <button key={p} className="flex-1 rounded border border-line bg-paper py-1 text-[9px] text-ink-2 transition-colors hover:border-accent hover:text-accent">
        {p} 登录
      </button>
    ))}
  </div>
);

function Wireframe({ variant }: { variant: VariantId }) {
  const [step, setStep] = useState<0 | 1>(0);
  return (
    <div className="flex h-72 w-full overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      {variant === 'split' && (
        <div className="hidden w-1/2 flex-col items-center justify-center gap-2 bg-accent/10 p-4 sm:flex" data-anatomy="1">
          <span className="h-6 w-6 rounded bg-accent" />
          <p className="font-serif text-sm font-semibold">Acme 团队工作台</p>
          <Bar w="w-2/3" h="h-1" />
          <Bar w="w-1/2" h="h-1" />
        </div>
      )}
      <div className={`flex flex-1 flex-col items-center justify-center gap-2 p-4 ${variant === 'centered' ? 'rounded-lg border border-line bg-raised shadow-sm m-auto max-w-[15rem] py-6' : ''}`}>
        {variant !== 'split' && (
          <span className="h-5 w-5 rounded bg-accent" data-anatomy="1" />
        )}
        <p className="font-serif text-sm font-semibold">
          {variant === 'multi-step' ? (step === 0 ? '登录到 Acme' : '输入密码') : '登录到 Acme'}
        </p>
        {variant === 'social' ? (
          <>
            <SocialRow />
            <div className="flex w-44 items-center gap-2 text-[8px] text-ink-3">
              <span className="h-px flex-1 bg-line" />或用邮箱<span className="h-px flex-1 bg-line" />
            </div>
            <LoginForm step={1} onNext={() => setStep(1)} />
          </>
        ) : variant === 'multi-step' ? (
          <>
            <div className="flex w-44 gap-1" data-anatomy="2">
              {['邮箱', '密码'].map((s, i) => (
                <span key={s} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-ink-3/20'}`} />
              ))}
            </div>
            <LoginForm step={step} onNext={() => setStep((s) => (s === 0 ? 1 : 0))} />
          </>
        ) : (
          <>
            <LoginForm step={1} onNext={() => {}} />
            <div className="flex w-44 items-center gap-2 text-[8px] text-ink-3">
              <span className="h-px flex-1 bg-line" />或<span className="h-px flex-1 bg-line" />
            </div>
            <div className="w-44"><SocialRow compact /></div>
          </>
        )}
        <p className="text-[9px] text-ink-3" data-anatomy="5">没有账号？<span className="text-accent">注册</span></p>
      </div>
    </div>
  );
}

const LoginDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = useState<VariantId>('centered');

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
      <p className="text-center text-[11px] text-ink-3">多步变体：点「下一步」切换步骤</p>
    </div>
  );
};

export default LoginDemo;
