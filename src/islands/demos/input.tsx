import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span data-anatomy="1" className="mb-1.5 block text-xs font-medium text-ink-2">
        {label}
      </span>
      {children}
      <span
        data-anatomy="4"
        className={`mt-1.5 block text-[11px] ${error ? 'text-red-500' : 'text-ink-3'}`}
      >
        {error ?? hint}
      </span>
    </label>
  );
}

const base =
  'h-9 w-full rounded-lg border bg-raised px-3 text-xs text-ink outline-none transition-shadow placeholder:text-ink-3';

function InputPlayground() {
  const [value, setValue] = useState('acme');
  const [touched, setTouched] = useState(false);

  const invalid = touched && !/^[a-z0-9-]{3,16}$/.test(value);
  const error = invalid ? '仅限小写字母、数字与中划线，3～16 位' : undefined;

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-line bg-paper p-4">
      <Field
        label="团队 ID"
        hint="将用于访问地址：acme.app/team/…"
        error={error}
      >
        <span className="relative block">
          <span data-anatomy="3" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3">
            ＠
          </span>
          <input
            data-anatomy="2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="输入团队 ID"
            aria-invalid={invalid || undefined}
            className={`${base} border-line pr-8 pl-8 focus:border-accent focus:ring-2 focus:ring-accent/30 ${
              error ? 'border-red-400' : ''
            }`}
          />
          {value && (
            <button
              onClick={() => {
                setValue('');
                setTouched(false);
              }}
              aria-label="清空"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-ink-3 hover:text-ink"
            >
              ✕
            </button>
          )}
        </span>
      </Field>
    </div>
  );
}

function VariantSheet() {
  const [filled, setFilled] = useState('');
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 text-sm">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">描边 Outline</p>
        <input className={`${base} border-line focus:border-accent focus:ring-2 focus:ring-accent/30`} placeholder="描边样式" />
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">填充 Filled</p>
        <input
          value={filled}
          onChange={(e) => setFilled(e.target.value)}
          className="h-9 w-full rounded-t-lg border-b border-line bg-code-bg px-3 text-xs text-ink outline-none placeholder:text-ink-3 focus:border-b-2 focus:border-accent"
          placeholder="填充样式"
        />
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">错误 Error</p>
        <input className={`${base} border-red-400 focus:ring-2 focus:ring-red-400/30`} defaultValue="中文标题!" aria-invalid="true" />
        <p className="mt-1 text-[11px] text-red-500">标题不能包含特殊字符</p>
      </div>
    </div>
  );
}

const InputDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') return <VariantSheet />;
  return <InputPlayground />;
};

export default InputDemo;
