import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';
import { useButtonFeedback } from '../shared/useButtonFeedback';
import { buttonFeedbackText } from '../../lib/button-feedback';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Locale = 'zh' | 'en';
const NAMES: Record<Variant, [string, string]> = {
  primary: ['主要', 'Primary'], secondary: ['次要', 'Secondary'],
  ghost: ['幽灵', 'Ghost'], danger: ['危险', 'Danger'],
};
const CLASSES: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:opacity-90 border-transparent',
  secondary: 'border-line text-ink hover:border-accent hover:text-accent bg-raised',
  ghost: 'border-transparent text-ink-2 hover:bg-code-bg hover:text-ink',
  danger: 'border-transparent bg-red-600/90 text-white hover:bg-red-600',
};

function Btn({ variant, children, onClick, disabled, busy }: {
  variant: Variant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || busy} aria-busy={busy || undefined}
      data-anatomy={variant === 'primary' ? '1' : variant === 'danger' ? '4' : undefined}
      className={`inline-flex min-h-11 min-w-20 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 motion-safe:enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${CLASSES[variant]}`}>
      {(busy || variant === 'primary') && <span aria-hidden="true" className={`h-3 w-3 shrink-0 animate-spin rounded-full border-[1.5px] border-current border-t-transparent motion-reduce:animate-none ${busy ? '' : 'invisible'}`} />}
      {children}
    </button>
  );
}

function ButtonPlayground({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const action = useButtonFeedback();
  const [notice, setNotice] = useState('');
  return (
    <div className="mx-auto max-w-md rounded-xl border border-line bg-paper p-4 text-sm">
      <p className="mb-3 text-xs text-ink-3">{zh ? '发布设置 · 本地交互演示，不修改真实数据' : 'Publish settings · local interaction demo; no real data changes'}</p>
      <div className="flex flex-wrap items-center gap-2" data-anatomy="2">
        <Btn variant="primary" busy={action.busy} onClick={() => { setNotice(''); action.start(); }}>
          {zh ? '保存更改' : 'Save changes'}
        </Btn>
        <Btn variant="secondary" disabled={action.busy} onClick={() => setNotice(zh ? '已触发预览示例；没有打开或发布真实页面。' : 'Preview example triggered. No real page was opened or published.')}>
          {zh ? '预览' : 'Preview'}
        </Btn>
        <Btn variant="ghost" onClick={() => { setNotice(''); action.cancel(); }}>
          {zh ? '取消' : 'Cancel'}
        </Btn>
        <Btn variant="danger" disabled={action.busy} onClick={() => setNotice(zh ? '已触发危险操作示例；没有删除任何站点。' : 'Danger-action example triggered. No site was deleted.')}>
          {zh ? '模拟删除' : 'Simulate delete'}
        </Btn>
      </div>
      <div data-anatomy="3" role="status" aria-atomic="true" className="mt-3 min-h-10 rounded-lg bg-code-bg px-3 py-2 text-xs text-ink-2">
        {notice || buttonFeedbackText(action.state, locale)}
      </div>
    </div>
  );
}

function VariantSheet({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [picked, setPicked] = useState<Variant>();
  return (
    <div className="mx-auto max-w-xl space-y-3 text-sm">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8.5rem),1fr))] gap-3">
        {(['primary', 'secondary', 'ghost', 'danger'] as Variant[]).map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-paper p-3">
            <Btn variant={variant} onClick={() => setPicked(variant)}>{NAMES[variant][zh ? 0 : 1]}</Btn>
            <Btn variant={variant} disabled>{zh ? '禁用' : 'Disabled'}</Btn>
            <Btn variant={variant} busy>{zh ? '加载' : 'Loading'}</Btn>
          </div>
        ))}
      </div>
      <p role="status" aria-atomic="true" className="min-h-10 text-xs text-ink-2">{picked
        ? zh ? `已试用「${NAMES[picked][0]}」按钮。禁用和加载项是不可操作的状态样板。` : `${NAMES[picked][1]} button tried. Disabled and loading items are non-interactive state samples.`
        : zh ? '点击或用键盘触发第一行按钮，比较四种层级；下方是禁用和加载状态样板。' : 'Click or use the keyboard on the first-row buttons to compare four levels. Below are disabled and loading state samples.'}</p>
    </div>
  );
}

const ButtonDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  if (mode === 'variants') return <VariantSheet locale={locale} />;
  return <ButtonPlayground locale={locale} />;
};
export default ButtonDemo;
