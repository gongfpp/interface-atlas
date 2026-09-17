import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Task = { id: number; label: string };

const INITIAL_TASKS: Task[] = [
  { id: 1, label: '整理需求池 · Triage requests' },
  { id: 2, label: '更新设计规范 · Update specs' },
  { id: 3, label: '回复用户反馈 · Reply to feedback' },
];

const UNDO_MS = 5000;

function UndoBar({ label, onUndo }: { label: string; onUndo: () => void }) {
  return (
    <div
      data-anatomy="2"
      role="status"
      className="absolute inset-x-3 bottom-2 overflow-hidden rounded-md bg-ink text-raised shadow-lg"
      style={{ animation: `undo-rise calc(0.25s * var(--demo-speed, 1)) ease-out both` }}
    >
      <div className="flex items-center gap-3 px-3 py-2 text-xs">
        <span className="flex-1 truncate">已删除「{label}」· Deleted</span>
        <button
          type="button"
          data-anatomy="4"
          onClick={onUndo}
          className="shrink-0 rounded px-1.5 py-0.5 font-medium text-accent underline-offset-2 hover:underline"
        >
          撤销 · Undo
        </button>
      </div>
      <div className="h-0.5 w-full bg-white/20">
        <div
          data-anatomy="3"
          className="h-full bg-accent"
          style={{ animation: `undo-count calc(${UNDO_MS}ms * var(--demo-speed, 1)) linear forwards` }}
        />
      </div>
    </div>
  );
}

function UndoList() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [pending, setPending] = useState<{ task: Task; index: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  const commit = () => {
    setPending(null);
    timerRef.current = null;
  };

  const removeTask = (id: number) => {
    if (pending) return; // 同一时间只保留一个撤销窗口
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setPending({ task, index });
    timerRef.current = window.setTimeout(commit, UNDO_MS);
  };

  const undo = () => {
    if (!pending) return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setTasks((prev) => {
      const next = [...prev];
      next.splice(Math.min(pending.index, next.length), 0, pending.task);
      return next;
    });
    setPending(null);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full rounded-lg border border-line bg-raised p-3 pb-10">
      <div className="mb-2 text-xs font-medium">今日任务 · Today</div>
      {tasks.length === 0 && (
        <div className="rounded-md border border-dashed border-line px-3 py-4 text-center text-[10px] text-ink-3">
          全部删除了 · Nothing left — undo?
        </div>
      )}
      <ul className="space-y-1.5" aria-label="任务列表 · Task list">
        {tasks.map((t) => (
          <li
            key={t.id}
            data-anatomy="1"
            className="flex items-center gap-2 rounded-md border border-line bg-code-bg px-2.5 py-2 text-xs"
          >
            <span className="flex-1 truncate">{t.label}</span>
            <button
              type="button"
              aria-label={`删除 ${t.label}`}
              onClick={() => removeTask(t.id)}
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-ink-2 transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      {pending && <UndoBar label={pending.task.label} onUndo={undo} />}
    </div>
  );
}

const UndoActionDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'snackbar', zh: '撤销条', en: 'Snackbar', note: '底部条 + 倒计时，Gmail 经典样式' },
          { id: 'toast-undo', zh: '轻提示撤销', en: 'Toast undo', note: 'Toast 内嵌撤销按钮，自动消失' },
          { id: 'delay-commit', zh: '延迟提交', en: 'Delayed commit', note: '界面即时更新，请求倒计时后才发出' },
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
      <UndoList />
      <p className="mt-2 text-center text-[10px] text-ink-3">
        删除一条试试，5 秒内可撤销 · Delete one — undo within 5s
      </p>
      <style>{`
        @keyframes undo-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes undo-count { from { width: 100% } to { width: 0% } }
      `}</style>
    </div>
  );
};

export default UndoActionDemo;
