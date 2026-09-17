import { useState, type KeyboardEvent } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface FieldProps {
  label: string;
  initial: string;
  multiline?: boolean;
}

function EditableField({ label, initial, multiline = false }: FieldProps) {
  const [value, setValue] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(false);

  const commit = () => {
    const next = draft.trim();
    setValue(next || value);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (!multiline || !e.shiftKey)) {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  };

  if (editing) {
    const shared =
      'w-full rounded-md border border-accent bg-code-bg px-1.5 py-1 text-xs text-ink outline-none';
    return (
      <div data-anatomy="2" className="flex items-start gap-1.5">
        {multiline ? (
          <textarea
            autoFocus
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={commit}
            aria-label={label}
            className={`${shared} resize-none`}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={commit}
            aria-label={label}
            className={shared}
          />
        )}
        <span data-anatomy="3" className="flex shrink-0 gap-0.5 pt-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={commit}
            aria-label="确认"
            className="h-5 w-5 rounded border border-line text-[10px] text-accent hover:bg-accent-soft"
          >
            ✓
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancel}
            aria-label="取消"
            className="h-5 w-5 rounded border border-line text-[10px] text-ink-3 hover:bg-code-bg"
          >
            ✕
          </button>
        </span>
      </div>
    );
  }

  return (
    <button
      data-anatomy="1"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      aria-label={`编辑${label}`}
      className="group flex w-full items-start gap-1.5 rounded text-left"
    >
      <span className="flex-1 whitespace-pre-wrap rounded px-0.5 text-xs leading-relaxed decoration-dotted decoration-line-strong underline-offset-4 group-hover:bg-code-bg group-hover:underline">
        {value}
      </span>
      <span
        aria-hidden="true"
        className="pt-0.5 text-[10px] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
      >
        ✎
      </span>
    </button>
  );
}

const InlineEditingDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-4 text-left md:grid-cols-2">
        <div className="rounded-lg border border-line bg-raised p-3">
          <div className="mb-1 text-xs font-medium">悬停提示 · Hover affordance</div>
          <p className="text-[10px] leading-relaxed text-ink-2">
            悬停时出现<span className="mx-1 underline decoration-dotted underline-offset-4">虚线下划线与铅笔图标</span>
            提示可编辑，点击进入编辑态。
          </p>
        </div>
        <div className="rounded-lg border border-line bg-raised p-3">
          <div className="mb-1 text-xs font-medium">常驻输入 · Always input</div>
          <input
            defaultValue="输入框常驻，失焦即保存"
            aria-label="常驻输入示例"
            className="w-full rounded-md border border-line bg-code-bg px-1.5 py-1 text-xs outline-none focus:border-accent"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-line bg-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium">个人资料 · Profile</span>
        <span className="text-[9px] text-ink-3">点击文本编辑 · Click to edit</span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-ink-3">昵称 · Name</div>
          <EditableField label="昵称" initial="Rin" />
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-ink-3">简介 · Bio</div>
          <EditableField label="简介" initial="界面设计爱好者，正在做一份交互模式图谱。" multiline />
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-ink-3">所在地 · Location</div>
          <EditableField label="所在地" initial="上海 · Shanghai" />
        </div>
      </div>
    </div>
  );
};

export default InlineEditingDemo;
