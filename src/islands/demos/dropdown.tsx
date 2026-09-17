import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Item = { label: string; icon: string; danger?: boolean };

const ITEMS: Item[] = [
  { label: '重命名', icon: '✏️' },
  { label: '复制链接', icon: '🔗' },
  { label: '移动到…', icon: '📁' },
  { label: '删除', icon: '🗑️', danger: true },
];

function MenuPanel({ onPick, anatomy }: { onPick: (label: string) => void; anatomy?: string }) {
  return (
    <div
      data-anatomy={anatomy}
      role="menu"
      aria-label="项目操作"
      className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-line bg-raised p-1 shadow-lg"
    >
      {ITEMS.map((item) => (
        <div key={item.label}>
          {item.danger && <div data-anatomy="4" className="mx-1 my-1 border-t border-line" />}
          <button
            role="menuitem"
            onClick={() => onPick(item.label)}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              item.danger ? 'text-red-500 hover:bg-red-500/10' : 'text-ink-2 hover:bg-code-bg hover:text-ink'
            }`}
          >
            <span aria-hidden="true" className="text-[11px]">{item.icon}</span>
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
}

function DropdownPlayground() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  const pick = (label: string) => {
    setLast(label);
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-xs rounded-xl border border-line bg-paper p-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="h-8 w-8 shrink-0 rounded-lg bg-accent-soft" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-ink">产品设计稿 v3.fig</p>
          <p className="truncate text-[11px] text-ink-3">修改于 2 小时前</p>
        </div>
        <div className="relative">
          <button
            data-anatomy="1"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="更多操作"
            className={`flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-2 transition-colors hover:border-accent hover:text-accent ${
              open ? 'border-accent text-accent' : ''
            }`}
          >
            ···
          </button>
          {open && <MenuPanel onPick={pick} anatomy="2" />}
        </div>
      </div>
      <p data-anatomy="3" className="mt-3 border-t border-line pt-2 text-[11px] text-ink-3">
        {last ? `执行了「${last}」` : '点击 ··· 展开操作菜单'}
      </p>
    </div>
  );
}

function HoverDropdown() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="relative text-sm" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
          open ? 'border-accent text-accent' : 'border-line text-ink-2'
        }`}
      >
        产品 ▾
      </button>
      {open && (
        <MenuPanel
          onPick={setLast}
          anatomy="2"
        />
      )}
      <p className="mt-2 text-[11px] text-ink-3">{last ? `执行了「${last}」` : '悬停展开'}</p>
    </div>
  );
}

const DropdownDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">悬停展开 Hover</p>
          <HoverDropdown />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">更多按钮 More button</p>
          <DropdownPlayground />
        </div>
      </div>
    );
  }
  return <DropdownPlayground />;
};

export default DropdownDemo;
