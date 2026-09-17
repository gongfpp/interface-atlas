import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const TASKS = ['整理用户反馈', '更新发布日志', '回复支持邮件', '合并 PR #42'];

function Mark({ state }: { state: 'on' | 'off' | 'mixed' }) {
  return (
    <span
      aria-hidden="true"
      data-anatomy="1"
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        state === 'off' ? 'border-line bg-raised' : 'border-accent bg-accent text-white'
      }`}
    >
      {state === 'on' && <span className="text-[9px] leading-none">✓</span>}
      {state === 'mixed' && <span className="h-0.5 w-2 rounded bg-white" />}
    </span>
  );
}

function Row({
  label,
  state,
  onToggle,
  anatomy,
}: {
  label: string;
  state: 'on' | 'off';
  onToggle: () => void;
  anatomy?: string;
}) {
  return (
    <button
      role="checkbox"
      aria-checked={state === 'on'}
      onClick={onToggle}
      data-anatomy={anatomy}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-code-bg"
    >
      <Mark state={state} />
      <span className={`text-xs ${state === 'on' ? 'text-ink-3 line-through' : 'text-ink-2'}`}>{label}</span>
    </button>
  );
}

function CheckboxGroup() {
  const [done, setDone] = useState<string[]>(['回复支持邮件']);
  const all = done.length === TASKS.length;
  const some = done.length > 0 && !all;

  const toggle = (t: string) =>
    setDone((d) => (d.includes(t) ? d.filter((x) => x !== t) : [...d, t]));

  return (
    <div className="mx-auto max-w-xs rounded-xl border border-line bg-paper p-3">
      <button
        role="checkbox"
        aria-checked={some ? 'mixed' : all}
        onClick={() => setDone(all ? [] : [...TASKS])}
        data-anatomy="2"
        className="mb-1 flex w-full items-center gap-2.5 rounded-lg bg-code-bg px-2 py-1.5 text-left"
      >
        <Mark state={all ? 'on' : some ? 'mixed' : 'off'} />
        <span data-anatomy="3" className="text-xs font-medium text-ink">
          全部完成（{done.length}/{TASKS.length}）
        </span>
      </button>
      <div data-anatomy="4">
        {TASKS.map((t) => (
          <Row key={t} label={t} state={done.includes(t) ? 'on' : 'off'} onToggle={() => toggle(t)} />
        ))}
      </div>
    </div>
  );
}

function ConsentRow() {
  const [ok, setOk] = useState(false);

  return (
    <div className="mx-auto max-w-xs rounded-xl border border-line bg-paper p-3">
      <Row label="我已阅读并同意服务条款" state={ok ? 'on' : 'off'} onToggle={() => setOk((o) => !o)} anatomy="1" />
      <p className="px-2 text-[11px] text-ink-3">{ok ? '已同意 ✓' : '提交按钮保持禁用'}</p>
    </div>
  );
}

const CheckboxDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-3 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">单项 Single + 半选 Indeterminate</p>
          <ConsentRow />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">分组 Group</p>
          <CheckboxGroup />
        </div>
      </div>
    );
  }
  return <CheckboxGroup />;
};

export default CheckboxDemo;
