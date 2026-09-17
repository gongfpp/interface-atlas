import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type ToastKind = 'success' | 'error' | 'action';

interface ToastItem {
  id: number;
  kind: ToastKind;
  text: string;
}

let nextId = 1;

const DOT: Record<ToastKind, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  action: 'bg-accent',
};

function ToastBar({
  item,
  onDismiss,
  onUndo,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
  onUndo: (id: number) => void;
}) {
  const timer = useRef<number | undefined>(undefined);
  const start = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onDismiss(item.id), 3200);
  };
  useEffect(() => {
    start();
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  return (
    <div
      role="status"
      onMouseEnter={() => window.clearTimeout(timer.current)}
      onMouseLeave={start}
      className="pointer-events-auto flex w-60 items-center gap-2 rounded-xl border border-line bg-raised py-2 pl-3 pr-2 shadow-xl"
      style={{ animation: 'demo-toast-in calc(260ms * var(--demo-speed, 1)) both' }}
    >
      <span data-anatomy="2" aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${DOT[item.kind]}`} />
      <span data-anatomy="1" className="flex-1 text-xs text-ink">{item.text}</span>
      {item.kind === 'action' && (
        <button
          data-anatomy="3"
          onClick={() => onUndo(item.id)}
          className="shrink-0 text-xs font-medium text-accent hover:underline"
        >
          撤销
        </button>
      )}
      <button
        data-anatomy="4"
        aria-label="关闭"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 px-1 text-[11px] text-ink-3 transition-colors hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}

const DEFAULT_TOASTS: [ToastKind, string][] = [
  ['success', '已保存 / Saved'],
  ['error', '网络错误，同步失败'],
  ['action', '已删除「月度报表」'],
];

const ToastDemo: DemoComponent = ({ mode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [restored, setRestored] = useState(true);

  const push = (kind: ToastKind, text: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, kind, text }]);
  };
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  const undo = (id: number) => {
    dismiss(id);
    setRestored(true);
  };

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-2">
        <style>{`@keyframes demo-toast-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }`}</style>
        {DEFAULT_TOASTS.map(([kind, text]) => (
          <div key={kind} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-right text-[10px] uppercase tracking-wider text-ink-3">{kind}</span>
            <div className="pointer-events-auto flex flex-1 items-center gap-2 rounded-xl border border-line bg-raised py-2 pl-3 pr-2 shadow-xl">
              <span data-anatomy="2" aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${DOT[kind]}`} />
              <span data-anatomy="1" className="flex-1 text-xs text-ink">{text}</span>
              {kind === 'action' && (
                <button data-anatomy="3" className="shrink-0 text-xs font-medium text-accent hover:underline">
                  撤销
                </button>
              )}
              <button data-anatomy="4" aria-label="关闭" className="shrink-0 px-1 text-[11px] text-ink-3 hover:text-ink">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <style>{`@keyframes demo-toast-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }`}</style>
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className={`text-xs transition-colors ${restored ? 'text-ink-2' : 'text-ink-3 line-through'}`}>
          「月度报表」{restored ? '' : '（已删除）'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setRestored(true);
              push('success', '已保存 / Saved');
            }}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
          >
            保存
          </button>
          <button
            onClick={() => push('error', '网络错误，同步失败')}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
          >
            同步失败
          </button>
          <button
            onClick={() => {
              setRestored(false);
              push('action', '已删除「月度报表」');
            }}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
          >
            删除报表
          </button>
        </div>
        <p className="text-[11px] text-ink-3">悬停消息条可暂停自动关闭 / Hover to pause auto-dismiss</p>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-col-reverse gap-2">
        {toasts.map((t) => (
          <ToastBar key={t.id} item={t} onDismiss={dismiss} onUndo={undo} />
        ))}
      </div>
    </div>
  );
};

export default ToastDemo;
