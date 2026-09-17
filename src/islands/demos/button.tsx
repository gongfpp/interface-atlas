import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const CLASSES: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:opacity-90 border-transparent',
  secondary: 'border-line text-ink hover:border-accent hover:text-accent bg-raised',
  ghost: 'border-transparent text-ink-2 hover:bg-code-bg hover:text-ink',
  danger: 'border-transparent bg-red-600/90 text-white hover:bg-red-600',
};

function Btn({
  variant,
  children,
  onClick,
  disabled,
  busy,
}: {
  variant: Variant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      data-anatomy={variant === 'primary' ? '1' : variant === 'danger' ? '4' : undefined}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${CLASSES[variant]}`}
    >
      {busy && (
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

function ButtonPlayground() {
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 2));

  const save = () => {
    setBusy(true);
    setSaved(false);
    window.setTimeout(() => {
      setBusy(false);
      setSaved(true);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-line bg-paper p-4 text-sm">
      <p className="mb-3 text-xs text-ink-3">发布设置 — 演示主要 / 次要 / 幽灵 / 危险四个层级</p>
      <div className="flex flex-wrap items-center gap-2" data-anatomy="2">
        <Btn variant="primary" busy={busy} onClick={save}>
          保存更改
        </Btn>
        <Btn variant="secondary" onClick={() => push('点击了「预览」')}>
          预览
        </Btn>
        <Btn variant="ghost" onClick={() => push('点击了「取消』')}>
          取消
        </Btn>
        <Btn variant="danger" onClick={() => push('点击了「删除站点」')}>
          删除站点
        </Btn>
      </div>
      <div data-anatomy="3" className="mt-3 min-h-8 rounded-lg bg-code-bg px-3 py-2 text-xs text-ink-2">
        {busy ? '正在保存…' : saved ? '已保存 ✓' : (log[0] ?? '点击上方按钮查看反馈')}
      </div>
    </div>
  );
}

function VariantSheet() {
  return (
    <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 text-sm sm:grid-cols-4">
      {(['primary', 'secondary', 'ghost', 'danger'] as Variant[]).map((v) => (
        <div key={v} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-paper p-3">
          <Btn variant={v}>{v === 'primary' ? '主要' : v === 'secondary' ? '次要' : v === 'ghost' ? '幽灵' : '危险'}</Btn>
          <Btn variant={v} disabled>
            禁用
          </Btn>
          <Btn variant={v} busy>
            加载
          </Btn>
        </div>
      ))}
    </div>
  );
}

const ButtonDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') return <VariantSheet />;
  return <ButtonPlayground />;
};

export default ButtonDemo;
