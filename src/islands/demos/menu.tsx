import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Item {
  label: string;
  danger?: boolean;
  sep?: boolean;
}

const ITEMS: Item[] = [
  { label: '重命名' },
  { label: '复制链接' },
  { label: '移动到…' },
  { label: '删除', danger: true, sep: true },
];

function MenuPanel({ onExec, onClose }: { onExec: (label: string) => void; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const flat = ITEMS.map((it, i) => ({ ...it, i })).filter((it) => !it.sep);
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((v) => (v + 1) % flat.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((v) => (v - 1 + flat.length) % flat.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onExec(flat[idx].label);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      data-anatomy="2"
      role="menu"
      ref={listRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="absolute top-full left-1/2 z-20 mt-1.5 w-40 -translate-x-1/2 rounded-xl border border-line bg-raised p-1 shadow-2xl"
      style={{ animation: 'demo-menu-in calc(160ms * var(--demo-speed, 1)) both', transformOrigin: 'top center' }}
    >
      <p className="px-2.5 pb-1 pt-1.5 text-[10px] uppercase tracking-wider text-ink-3">设计稿-A.psd</p>
      {ITEMS.map((it) => (
        <div key={it.label}>
          {it.sep && <div data-anatomy="4" className="my-1 border-t border-line" />}
          <button
            data-anatomy="3"
            role="menuitem"
            onMouseEnter={() => setIdx(flat.findIndex((f) => f.label === it.label))}
            onClick={() => onExec(it.label)}
            className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
              it.danger
                ? 'text-red-500 hover:bg-red-500/10'
                : flat[idx].label === it.label
                  ? 'bg-accent-soft text-accent'
                  : 'text-ink-2'
            }`}
          >
            {it.label}
          </button>
        </div>
      ))}
    </div>
  );
}

function MenuDemoInner() {
  const [open, setOpen] = useState(false);
  const [executed, setExecuted] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const exec = (label: string) => {
    setOpen(false);
    if (label === '删除') {
      setConfirming(true);
    } else {
      setExecuted(label);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={ref} className="relative">
        <button
          data-anatomy="1"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`h-8 w-8 rounded-lg border text-sm transition-colors ${
            open ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent hover:text-accent'
          }`}
          aria-label="更多操作"
        >
          ⋯
        </button>
        {open && <MenuPanel onExec={exec} onClose={() => setOpen(false)} />}
      </div>
      <p className="h-4 text-[11px] text-ink-3">
        {confirming ? (
          <span className="text-red-500">确认删除？再点一次菜单外的区域取消 / Confirm delete?</span>
        ) : executed ? (
          `已执行：${executed}`
        ) : (
          '点击 ⋯ 打开菜单，支持 ↑↓ 与 Enter / Open the menu, ↑↓ + Enter'
        )}
      </p>
    </div>
  );
}

function ContextMenuDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onClick={() => setPos(null)}
      className="relative flex h-44 w-full max-w-sm cursor-context-menu items-center justify-center rounded-xl border border-dashed border-line bg-paper text-xs text-ink-3"
    >
      在此区域右键 / Right-click here
      {pos && (
        <div
          role="menu"
          className="absolute z-20 w-36 rounded-xl border border-line bg-raised p-1 shadow-2xl"
          style={{ left: Math.min(pos.x, 220), top: Math.min(pos.y, 100), animation: 'demo-menu-in calc(160ms * var(--demo-speed, 1)) both' }}
          onClick={(e) => e.stopPropagation()}
        >
          {['新建文件', '粘贴', '排序方式'].map((label) => (
            <button
              key={label}
              role="menuitem"
              onClick={() => setPos(null)}
              className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-ink-2 transition-colors hover:bg-accent-soft hover:text-accent"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const MenuDemo: DemoComponent = ({ mode }) => {
  const keyframes = (
    <style>{`@keyframes demo-menu-in { from { opacity: 0; transform: translateX(-50%) scale(0.96) } to { opacity: 1; transform: translateX(-50%) scale(1) } }`}</style>
  );
  if (mode === 'variants') {
    return (
      <div className="flex flex-col items-center gap-4">
        {keyframes}
        <MenuDemoInner />
        <p className="text-[10px] uppercase tracking-wider text-ink-3">右键上下文菜单 Context</p>
        <ContextMenuDemo />
      </div>
    );
  }
  return (
    <div className="flex justify-center pt-2">
      {keyframes}
      <MenuDemoInner />
    </div>
  );
};

export default MenuDemo;
