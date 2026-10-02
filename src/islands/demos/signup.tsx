import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'centered', zh: '居中卡片', en: 'Centered' },
  { id: 'split', zh: '分屏价值', en: 'Split Value' },
  { id: 'social', zh: '社交优先', en: 'Social-first' },
  { id: 'guided', zh: '多步引导', en: 'Guided' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'centered' };

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const strengthOf = (pwd: string) => {
  if (!pwd) return -1;
  let s = 0;
  if (pwd.length >= 6) s++;
  if (/[A-Z]/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd) && pwd.length >= 10) s++;
  return s;
};

const STRENGTH = [{ l: '弱', c: 'bg-red-400' }, { l: '中', c: 'bg-amber-400' }, { l: '强', c: 'bg-accent' }];

function SignupForm({ step, onNext }: { step: 0 | 1; onNext: () => void }) {
  const [pwd, setPwd] = useState('');
  const [terms, setTerms] = useState(false);
  const s = strengthOf(pwd);

  if (step === 0) {
    return (
      <div className="w-44 space-y-2" data-anatomy="2">
        <div className="space-y-1">
          <Bar w="w-10" h="h-1" cls="bg-ink-3/40" />
          <div className="rounded border border-line bg-paper px-1.5 py-1 text-[9px] text-ink-3">you@email.com</div>
        </div>
        <button
          onClick={onNext}
          className="w-full rounded bg-accent py-1 text-[10px] font-medium text-white transition-opacity hover:opacity-90"
        >
          下一步
        </button>
      </div>
    );
  }
  return (
    <div className="w-44 space-y-2" data-anatomy="2">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Bar w="w-8" h="h-1" cls="bg-ink-3/40" />
          <span className="text-[8px] text-ink-3">设置密码</span>
        </div>
        <input
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          type="password"
          placeholder="输入密码"
          aria-label="密码"
          className="w-full rounded border border-line bg-paper px-1.5 py-1 text-[9px] outline-none placeholder:text-ink-3 focus:border-accent"
        />
        <div className="flex items-center gap-1">
          {STRENGTH.map((seg, i) => (
            <span key={seg.l} className={`h-1 flex-1 rounded-full transition-colors ${s >= i ? seg.c : 'bg-ink-3/20'}`} />
          ))}
          <span className="w-6 text-right text-[8px] text-ink-3">{s >= 0 ? STRENGTH[s].l : ''}</span>
        </div>
      </div>
      <button onClick={() => setTerms((t) => !t)} className="flex w-full items-center gap-1 text-left text-[9px] text-ink-2" data-anatomy="4">
        <span className={`flex h-2.5 w-2.5 items-center justify-center rounded-sm border text-[7px] ${terms ? 'border-accent bg-accent text-white' : 'border-line'}`}>
          {terms ? '✓' : ''}
        </span>
        同意<span className="text-accent">服务条款</span>
      </button>
      <button
        onClick={onNext}
        disabled={!terms || s < 1}
        className="w-full rounded bg-accent py-1 text-[10px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        免费注册
      </button>
    </div>
  );
}

const SocialRow = () => (
  <div className="flex w-44 gap-1.5" data-anatomy="3">
    {['GitHub', 'Google'].map((p) => (
      <button key={p} className="flex-1 rounded border border-line bg-paper py-1 text-[9px] text-ink-2 transition-colors hover:border-accent hover:text-accent">
        {p} 注册
      </button>
    ))}
  </div>
);

function Wireframe({ variant }: { variant: VariantId }) {
  const [step, setStep] = useState<0 | 1>(0);
  return (
    <div className="flex h-72 w-full overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      {variant === 'split' && (
        <div className="hidden w-1/2 flex-col justify-center gap-2 bg-accent/10 p-4 sm:flex" data-anatomy="1">
          <span className="h-6 w-6 rounded bg-accent" />
          <p className="font-serif text-sm font-semibold">注册即得</p>
          {['无限项目空间', '全功能 14 天试用', '随时导出数据'].map((v) => (
            <span key={v} className="flex items-center gap-1 text-[9px] text-ink-2"><span className="text-accent">✓</span>{v}</span>
          ))}
        </div>
      )}
      <div className={`flex flex-1 flex-col items-center justify-center gap-2 p-4 ${variant === 'centered' ? 'm-auto max-w-[15rem] rounded-lg border border-line bg-raised py-6 shadow-sm' : ''}`}>
        {variant !== 'split' && <span className="h-5 w-5 rounded bg-accent" data-anatomy="1" />}
        <p className="font-serif text-sm font-semibold">创建你的账号</p>
        {variant === 'social' ? (
          <>
            <SocialRow />
            <div className="flex w-44 items-center gap-2 text-[8px] text-ink-3">
              <span className="h-px flex-1 bg-line" />或用邮箱<span className="h-px flex-1 bg-line" />
            </div>
            <SignupForm step={1} onNext={() => {}} />
          </>
        ) : variant === 'guided' ? (
          <>
            <div className="flex w-44 gap-1" data-anatomy="2">
              {['邮箱', '密码'].map((s, i) => (
                <span key={s} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-ink-3/20'}`} />
              ))}
            </div>
            <SignupForm step={step} onNext={() => setStep((s) => (s === 0 ? 1 : 0))} />
          </>
        ) : (
          <>
            <SignupForm step={1} onNext={() => {}} />
            <div className="flex w-44 items-center gap-2 text-[8px] text-ink-3">
              <span className="h-px flex-1 bg-line" />或<span className="h-px flex-1 bg-line" />
            </div>
            <SocialRow />
          </>
        )}
        <p className="text-[9px] text-ink-3" data-anatomy="5">已有账号？<span className="text-accent">登录</span></p>
      </div>
    </div>
  );
}

const SignupDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = usePreviewVariant<VariantId>('centered');

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
      <p className="text-center text-[11px] text-ink-3">多步变体：输入密码看强度条，勾选条款后才能提交</p>
    </div>
  );
};

export default SignupDemo;
