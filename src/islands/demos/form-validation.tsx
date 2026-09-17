import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type FieldState = 'idle' | 'invalid' | 'valid';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function StatusIcon({ state }: { state: FieldState }) {
  if (state === 'valid') return <span className="text-xs text-emerald-500">✓</span>;
  if (state === 'invalid') return <span className="text-xs text-red-500">✕</span>;
  return null;
}

function messageFor(value: string): string {
  if (!value) return '邮箱不能为空 · Email is required';
  if (!value.includes('@')) return '缺少 @ 符号，例如 name@example.com · Missing "@"';
  if (!EMAIL_RE.test(value)) return '格式不完整，检查域名部分，例如 name@example.com · Check the domain part';
  return '';
}

function ValidationForm() {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<FieldState>('idle');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const runCheck = (v: string) => {
    if (!v) {
      setState('idle');
      setMessage('');
      return;
    }
    if (EMAIL_RE.test(v)) {
      setState('valid');
      setMessage('');
    } else {
      setState('invalid');
      setMessage(messageFor(v));
    }
  };

  const onChange = (v: string) => {
    setValue(v);
    setSubmitted(false);
    if (touched) runCheck(v);
  };

  const onBlur = () => {
    setTouched(true);
    runCheck(value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    runCheck(value);
    if (EMAIL_RE.test(value)) {
      setSubmitted(true);
    } else if (value) {
      setState('invalid');
      setMessage(messageFor(value));
    } else {
      setState('invalid');
      setMessage(messageFor(''));
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg border border-line bg-raised p-4">
      <label htmlFor="demo-email" className="block text-xs font-medium">
        邮箱 · Email
      </label>
      <div
        data-anatomy="1"
        className={`mt-1.5 flex items-center gap-2 rounded-md border bg-code-bg px-2.5 py-2 transition-colors ${
          state === 'invalid'
            ? 'border-red-500'
            : state === 'valid'
              ? 'border-emerald-500/70'
              : 'border-line focus-within:border-accent'
        }`}
      >
        <input
          id="demo-email"
          type="email"
          value={value}
          aria-invalid={state === 'invalid'}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="name@example.com"
          className="w-full bg-transparent text-xs outline-none placeholder:text-ink-3"
        />
        <StatusIcon state={state} />
      </div>
      <p data-anatomy="2" role="alert" aria-live="polite" className="mt-1.5 min-h-4 text-[10px] leading-4">
        {state === 'invalid' && <span className="text-red-500">{message}</span>}
        {state === 'valid' && <span className="text-emerald-500">格式正确 · Looks good</span>}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          data-anatomy="3"
          className="rounded-md bg-accent px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90"
        >
          提交 · Submit
        </button>
        {submitted && (
          <span
            className="text-[10px] text-emerald-500"
            style={{ animation: `fv-pop calc(0.3s * var(--demo-speed, 1)) ease-out both` }}
          >
            ✓ 提交成功 · Submitted
          </span>
        )}
      </div>
    </form>
  );
}

const FormValidationDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'on-blur', zh: '失焦校验', en: 'On blur', note: '离开字段时检查，干扰最小' },
          { id: 'on-change', zh: '实时校验', en: 'Live', note: '输入即校验，反馈最快' },
          { id: 'on-submit', zh: '提交校验', en: 'On submit', note: '统一检查并聚焦首个错误' },
        ].map((v) => (
          <div key={v.id} className="rounded-md border border-line bg-raised p-3">
            <div className="font-mono text-[10px] text-accent">{v.id}</div>
            <div className="mt-1 text-xs font-medium">{v.zh}</div>
            <div className="text-[10px] text-ink-3">{v.en}</div>
            <p className="mt-2 leading-relaxed">{v.note}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <ValidationForm />
      <p className="mt-2 text-center text-[10px] text-ink-3">
        试试输入 "hello" 或 "a@b.c"，观察实时反馈 · Try "hello" or "a@b.c"
      </p>
      <style>{`@keyframes fv-pop { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
};

export default FormValidationDemo;
