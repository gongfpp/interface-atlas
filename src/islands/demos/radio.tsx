import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const PLANS = [
  { id: 'free', name: '免费版', desc: '基础功能，1 个项目', price: '¥0' },
  { id: 'pro', name: '专业版', desc: '无限项目 + 协作', price: '¥49/月' },
  { id: 'team', name: '团队版', desc: '权限管理 + 审计日志', price: '¥199/月' },
];

function Dot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-anatomy="1"
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
        on ? 'border-accent' : 'border-line bg-raised'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full bg-accent transition-transform ${
          on ? 'scale-100' : 'scale-0'
        }`}
        style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
      />
    </span>
  );
}

function RadioGroup({ layout }: { layout: 'list' | 'card' }) {
  const [picked, setPicked] = useState('pro');

  return (
    <div role="radiogroup" aria-label="订阅方案" className={layout === 'card' ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-1'}>
      {PLANS.map((p) => {
        const on = picked === p.id;
        if (layout === 'card') {
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(p.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                on ? 'border-accent bg-accent-soft' : 'border-line bg-raised hover:border-accent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Dot on={on} />
                <span className="text-xs font-medium text-ink">{p.name}</span>
              </div>
              <p data-anatomy="4" className="mt-1.5 text-[11px] text-ink-3">{p.desc}</p>
              <p className="mt-1 font-mono text-xs text-accent">{p.price}</p>
            </button>
          );
        }
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            onClick={() => setPicked(p.id)}
            data-anatomy={p.id === 'free' ? '2' : p.id === 'pro' ? '3' : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
              on ? 'bg-accent-soft' : 'hover:bg-code-bg'
            }`}
          >
            <Dot on={on} />
            <span data-anatomy="2" className={`text-xs ${on ? 'font-medium text-ink' : 'text-ink-2'}`}>{p.name}</span>
            <span data-anatomy="3" className="ml-auto text-[11px] text-ink-3">{p.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

const RadioDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">列表式 List</p>
          <div className="rounded-xl border border-line bg-paper p-2">
            <RadioGroup layout="list" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">卡片式 Card</p>
          <RadioGroup layout="card" />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-sm rounded-xl border border-line bg-paper p-3">
      <RadioGroup layout="list" />
    </div>
  );
};

export default RadioDemo;
