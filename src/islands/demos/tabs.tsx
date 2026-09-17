import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const TABS = [
  {
    id: 'overview',
    label: '概览',
    lines: ['成员 128 · 项目 12', '本周活跃度 ▁▂▄▃▆', '存储用量 42%'],
  },
  {
    id: 'activity',
    label: '动态',
    lines: ['Rin 部署了 v2.4.1', 'Mao 邀请了 2 位成员', '系统 03:00 例行维护完成'],
  },
  {
    id: 'settings',
    label: '设置',
    lines: ['命名空间：acme-prod', '默认分支：main', '危险区：转让 / 删除'],
  },
];

function useRovingKeys(count: number, active: number, onMove: (i: number) => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onMove((active + 1) % count);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onMove((active - 1 + count) % count);
    }
  };
}

function UnderlineTabs({ framed = true }: { framed?: boolean }) {
  const [active, setActive] = useState(0);
  const onKey = useRovingKeys(TABS.length, active, setActive);
  const tab = TABS[active];

  return (
    <div className={`mx-auto max-w-xl text-sm ${framed ? 'rounded-xl border border-line bg-paper' : ''}`}>
      <div data-anatomy="1" role="tablist" aria-label="标签页" className="relative flex" onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex-1 border-b border-line py-2.5 text-xs transition-colors ${
              i === active ? 'text-accent' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
        <span
          data-anatomy="2"
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 bg-accent transition-transform"
          style={{
            width: `${100 / TABS.length}%`,
            transform: `translateX(${active * 100}%)`,
            transitionDuration: 'calc(220ms * var(--demo-speed, 1))',
          }}
        />
      </div>
      <div
        data-anatomy="3"
        role="tabpanel"
        aria-labelledby={tab.id}
        key={tab.id}
        className="p-4"
        style={{ animation: 'tabs-fade calc(180ms * var(--demo-speed, 1)) both' }}
      >
        {tab.lines.map((line) => (
          <p key={line} className="border-b border-line py-2 text-xs text-ink-2 last:border-0">
            {line}
          </p>
        ))}
      </div>
      <style>{`@keyframes tabs-fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

function PillTabs() {
  const [active, setActive] = useState(0);
  return (
    <div role="tablist" aria-label="胶囊标签" className="flex gap-1 rounded-lg bg-code-bg p-1">
      {TABS.map((t, i) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={i === active}
          onClick={() => setActive(i)}
          className={`flex-1 rounded-md px-2 py-1.5 text-xs transition-all ${
            i === active ? 'bg-raised text-ink shadow-sm' : 'text-ink-2'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function CardTabs() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="卡片标签" className="flex gap-1 px-1">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-t-lg border border-b-0 px-3 py-1.5 text-xs transition-colors ${
              i === active ? 'border-line bg-raised text-ink' : 'border-transparent text-ink-2 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg rounded-tl-none border border-line bg-raised p-3 text-xs text-ink-2">
        {TABS[active].lines[0]}
      </div>
    </div>
  );
}

const TabsDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 text-sm">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">下划线式 Underline</p>
          <UnderlineTabs framed={false} />
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">胶囊分段式 Pill / Segmented</p>
          <PillFrame><PillTabs /></PillFrame>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">卡片式 Card</p>
          <PillFrame><CardTabs /></PillFrame>
        </div>
      </div>
    );
  }
  return <UnderlineTabs />;
};

function PillFrame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-line bg-paper p-3">{children}</div>;
}

export default TabsDemo;
