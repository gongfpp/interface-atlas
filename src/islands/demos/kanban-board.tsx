import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type ColumnId = 'todo' | 'doing' | 'done';

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: '待办 / To do' },
  { id: 'doing', label: '进行中 / Doing' },
  { id: 'done', label: '已完成 / Done' },
];

interface Task {
  id: number;
  title: string;
  tag: string;
}

const INITIAL: Record<ColumnId, Task[]> = {
  todo: [
    { id: 1, title: '整理用户访谈记录', tag: '研究' },
    { id: 2, title: '组件库 v2 迁移', tag: '工程' },
  ],
  doing: [{ id: 3, title: '动效规范起草', tag: '设计' }],
  done: [{ id: 4, title: '信息架构梳理', tag: '设计' }],
};

const order: ColumnId[] = ['todo', 'doing', 'done'];

const KanbanBoardDemo: DemoComponent = ({ mode }) => {
  const [board, setBoard] = useState<Record<ColumnId, Task[]>>(INITIAL);
  const [bump, setBump] = useState(0);

  const move = (id: number, from: ColumnId, dir: 1 | -1) => {
    const to = order[order.indexOf(from) + dir];
    if (!to) return;
    setBoard((prev) => {
      const task = prev[from].find((t) => t.id === id);
      if (!task) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((t) => t.id !== id),
        [to]: [...prev[to], task],
      };
    });
    setBump((b) => b + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div key={bump} className="grid w-full max-w-md grid-cols-3 gap-2">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex min-h-44 flex-col rounded-xl border border-line bg-raised p-2">
            <div className="mb-1.5 flex items-center justify-between px-0.5">
              <p className="text-[10px] font-semibold text-ink-2">{col.label}</p>
              <span className="rounded-full bg-accent-soft px-1.5 text-[10px] font-semibold text-accent">
                {board[col.id].length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {board[col.id].map((task) => (
                <div
                  key={task.id}
                  className="kanban-card rounded-lg border border-line bg-paper p-2"
                >
                  <p className="text-[11px] font-medium leading-snug text-ink">{task.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="rounded bg-ink-3/10 px-1 text-[9px] text-ink-3">{task.tag}</span>
                    <span className="flex gap-1">
                      {col.id !== 'todo' && (
                        <button
                          onClick={() => move(task.id, col.id, -1)}
                          aria-label="左移"
                          className="rounded bg-raised px-1 text-[10px] text-ink-3 hover:text-ink"
                        >
                          ←
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button
                          onClick={() => move(task.id, col.id, 1)}
                          aria-label="右移"
                          className="rounded bg-raised px-1 text-[10px] text-ink-3 hover:text-ink"
                        >
                          →
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {board[col.id].length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line text-[9px] text-ink-3">
                  空列可放置
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setBoard(INITIAL)}
        className="text-[11px] text-ink-3 underline decoration-line underline-offset-2 hover:text-ink"
      >
        重置 / Reset
      </button>
      <p className="text-xs text-ink-3">
        {mode === 'variants' ? '变体可扩展 WIP 限制与泳道' : '点 ← → 在相邻列间移动卡片，列头计数实时更新'}
      </p>
      <style>{`@keyframes kanban-in { from { opacity: 0; transform: translateY(6px) scale(0.98) } to { opacity: 1; transform: none } }
.kanban-card { animation: kanban-in calc(0.25s * var(--demo-speed, 1)) ease-out both; }`}</style>
    </div>
  );
};

export default KanbanBoardDemo;
