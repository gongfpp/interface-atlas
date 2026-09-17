import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function CountBadge({ n }: { n: number }) {
  return (
    <span
      data-anatomy="2"
      className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium leading-none text-white ring-2 ring-paper transition-transform ${
        n > 0 ? 'scale-100' : 'scale-0'
      }`}
      style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
      aria-label={`${n} 条未读`}
    >
      {n > 99 ? '99+' : n}
    </span>
  );
}

function DotBadge({ on }: { on: boolean }) {
  return (
    <span
      data-anatomy="2"
      aria-label="有新内容"
      className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-paper transition-transform ${
        on ? 'scale-100' : 'scale-0'
      }`}
      style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
    />
  );
}

function LabelBadge({ tone, children }: { tone: 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode }) {
  const skin = {
    success: 'bg-emerald-500/15 text-emerald-600',
    warning: 'bg-amber-500/15 text-amber-600',
    error: 'bg-red-500/15 text-red-500',
    info: 'bg-sky-500/15 text-sky-600',
  }[tone];
  return (
    <span data-anatomy="2" className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${skin}`}>
      <span data-anatomy="3" aria-hidden="true" className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function HostButton({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      data-anatomy="1"
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-colors ${
        active ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-raised text-ink-2'
      }`}
    >
      {children}
    </span>
  );
}

function CountPlayground() {
  const [n, setN] = useState(3);
  return (
    <div className="flex flex-col items-center gap-2">
      <HostButton active={n > 0}>
        <span aria-hidden="true">✉</span>
        <CountBadge n={n} />
      </HostButton>
      <div className="flex gap-1.5">
        <button
          onClick={() => setN((v) => Math.min(v + 17, 128))}
          className="rounded-lg border border-line px-2 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          +17 条消息
        </button>
        <button
          onClick={() => setN(0)}
          className="rounded-lg border border-line px-2 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          全部已读
        </button>
      </div>
    </div>
  );
}

function DotPlayground() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={() => setOn((v) => !v)} aria-pressed={on} className="relative">
        <HostButton active={on}>
          <span aria-hidden="true">🔔</span>
        </HostButton>
        <span className="pointer-events-none absolute inset-0">
          <DotBadge on={on} />
        </span>
      </button>
      <span className="text-[10px] text-ink-3">点击切换小红点 / Toggle the dot</span>
    </div>
  );
}

function LabelsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <LabelBadge tone="success">已发布</LabelBadge>
      <LabelBadge tone="warning">即将过期</LabelBadge>
      <LabelBadge tone="error">已逾期</LabelBadge>
      <LabelBadge tone="info">Beta</LabelBadge>
    </div>
  );
}

const BadgeDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-start justify-center gap-6">
          <CountPlayground />
          <DotPlayground />
        </div>
        <LabelsRow />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-8">
      <CountPlayground />
      <DotPlayground />
    </div>
  );
};

export default BadgeDemo;
