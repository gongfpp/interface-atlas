import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const INITIAL = ['设计评审 · Design review', '更新图标库 · Update icons', '撰写周报 · Write weekly report', '修复构建警告 · Fix build warnings'];

function UpDownButtons({ index, count, onMove }: { index: number; count: number; onMove: (from: number, to: number) => void }) {
  const btn =
    'flex h-6 w-6 items-center justify-center rounded border border-line text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-2';
  return (
    <span className="flex gap-1">
      <button
        type="button"
        aria-label={`上移 · Move up: ${INITIAL[index] ?? ''}`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className={btn}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label={`下移 · Move down: ${INITIAL[index] ?? ''}`}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className={btn}
      >
        ↓
      </button>
    </span>
  );
}

function SortableList() {
  const [items, setItems] = useState<string[]>(INITIAL);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  return (
    <div className="w-full">
      <ul className="space-y-1.5" aria-label="可排序列表 · Sortable list">
        {items.map((item, i) => {
          const dragging = dragIndex === i;
          const over = overIndex === i && dragIndex !== null && dragIndex !== i;
          return (
            <li
              key={item}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnter={() => setOverIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => {
                if (dragIndex !== null && overIndex !== null) move(dragIndex, overIndex);
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`flex cursor-grab items-center gap-2 rounded-md border bg-raised px-2.5 py-2 text-xs transition-all active:cursor-grabbing ${
                dragging ? 'border-accent/50 opacity-40' : 'border-line'
              } ${over ? 'border-accent shadow-sm' : ''}`}
              style={over ? { animation: `dds-pulse calc(0.9s * var(--demo-speed, 1)) ease-in-out infinite` } : undefined}
            >
              <span aria-hidden="true" className="text-ink-3 select-none">
                ⠿
              </span>
              <span className="flex-1 truncate">{item}</span>
              <UpDownButtons index={i} count={items.length} onMove={move} />
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-center text-[10px] text-ink-3">
        拖动整行换位，或用 ↑↓ 按钮 · Drag a row or use the arrows
      </p>
    </div>
  );
}

const DragAndDropSortingDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'full-item', zh: '整行拖动', en: 'Whole item', note: '按条目任意位置拖，最直接' },
          { id: 'handle', zh: '把手拖动', en: 'Handle', note: '六点把手限定拖拽区，避免与滚动冲突' },
          { id: 'button', zh: '按钮排序', en: 'Buttons', note: '上移/下移按钮，键盘与读屏友好' },
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
    <div className="mx-auto w-full max-w-sm" data-anatomy="1">
      <SortableList />
      <style>{`@keyframes dds-pulse { 0%, 100% { box-shadow: 0 0 0 0 transparent } 50% { box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 12%, transparent) } }`}</style>
    </div>
  );
};

export default DragAndDropSortingDemo;
