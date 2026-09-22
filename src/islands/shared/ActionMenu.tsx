import { useEffect, useId, useRef, useState } from "react";
export default function ActionMenu({
  en = false,
  compact = false,
  contextMode = false,
}: {
  en?: boolean;
  compact?: boolean;
  contextMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [confirm, setConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [name, setName] = useState("Brand exploration.fig");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const labels = en
    ? ["Rename", "Duplicate", "Move to archive", "Delete"]
    : ["重命名", "创建副本", "移入归档", "删除"];
  useEffect(() => {
    if (!open) return;
    items.current[0]?.focus();
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  function pick(i: number) {
    close();
    if (i === 0) {
      setEditing(true);
      setConfirm(false);
    } else if (i === 3) setConfirm(true);
    else
      setStatus(
        i === 1
          ? en
            ? "Created Brand exploration copy.fig in this demo."
            : "已在演示中创建 Brand exploration 副本.fig。"
          : en
            ? "Moved to the demo archive."
            : "已移入演示归档。",
      );
  }
  return (
    <div
      ref={root}
      onContextMenu={(e) => {
        if (!contextMode || deleted) return;
        e.preventDefault();
        setPosition({
          x: Math.min(e.clientX, window.innerWidth - 224),
          y: Math.min(e.clientY, window.innerHeight - 220),
        });
        setOpen(true);
      }}
      className={`specimen ${compact ? "max-w-md" : ""}`}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <p className="specimen-eyebrow mb-5">PROJECT FILE / ACTIONS</p>
      {contextMode && (
        <p className="specimen-note mb-4">
          {en
            ? "Right-click this file area, or use the action button."
            : "在文件区域右键，或使用更多操作按钮。"}
        </p>
      )}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          ◇
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {deleted
              ? en
                ? "File deleted in demo"
                : "文件已从演示中删除"
              : name}
          </p>
          <p className="specimen-note">
            {en
              ? "Design team · Updated 2 hours ago"
              : "设计小组 · 更新于 2 小时前"}
          </p>
        </div>
        {!deleted && (
          <div className="relative">
            <button
              data-anatomy="1"
              ref={trigger}
              className="demo-tool border border-line text-xl"
              aria-label={en ? "More actions" : "更多操作"}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => {
                setPosition(null);
                setOpen(!open);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
            >
              ···
            </button>
            {open && (
              <div
                data-anatomy="2"
                style={
                  position
                    ? {
                        position: "fixed",
                        left: Math.max(8, position.x),
                        top: Math.max(8, position.y),
                        right: "auto",
                      }
                    : undefined
                }
                role="menu"
                id={id}
                aria-label={en ? "File actions" : "文件操作"}
                className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-line bg-raised p-1.5 shadow-xl"
                onKeyDown={(e) => {
                  const current = items.current.indexOf(
                    document.activeElement as HTMLButtonElement,
                  );
                  let next;
                  if (e.key === "ArrowDown")
                    next = (current + 1) % labels.length;
                  else if (e.key === "ArrowUp")
                    next = (current + labels.length - 1) % labels.length;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = labels.length - 1;
                  else if (e.key === "Escape") {
                    e.preventDefault();
                    close();
                    return;
                  } else if (e.key === "Tab") {
                    close();
                    return;
                  } else return;
                  e.preventDefault();
                  items.current[next]?.focus();
                }}
              >
                {labels.map((label, i) => (
                  <div key={label}>
                    {i === 3 && (
                      <hr data-anatomy="4" className="my-1 border-line" />
                    )}
                    <button
                      data-anatomy="3"
                      ref={(el) => {
                        items.current[i] = el;
                      }}
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => pick(i)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs hover:bg-code-bg focus:bg-code-bg ${i === 3 ? "text-red-600 dark:text-red-400" : "text-ink"}`}
                    >
                      <span aria-hidden="true" className="w-4 text-ink-3">
                        {["↗", "⧉", "↓", "×"][i]}
                      </span>
                      {label}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-5 min-h-40 border-t border-line pt-4">
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEditing(false);
              setStatus(en ? "Name updated." : "名称已更新。");
              trigger.current?.focus();
            }}
          >
            <label className="specimen-note">
              {en ? "File name" : "文件名"}
              <input
                autoFocus
                className="specimen-field mt-2"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button className="specimen-button mt-3">
              {en ? "Save name" : "保存名称"}
            </button>
          </form>
        )}
        {confirm && (
          <div>
            <p className="text-sm">
              {en
                ? "Delete this demo file? You can undo this."
                : "删除这个演示文件？删除后可撤销。"}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                autoFocus
                className="specimen-button !bg-red-700 !text-white"
                onClick={() => {
                  setDeleted(true);
                  setConfirm(false);
                  setStatus(en ? "Demo file deleted." : "演示文件已删除。");
                }}
              >
                {en ? "Confirm delete" : "确认删除"}
              </button>
              <button
                className="specimen-button specimen-secondary"
                onClick={() => {
                  setConfirm(false);
                  trigger.current?.focus();
                }}
              >
                {en ? "Cancel" : "取消"}
              </button>
            </div>
          </div>
        )}
        <p role="status" className="specimen-note">
          {status ||
            (!confirm && !editing
              ? en
                ? "Open the menu. Navigate with ↑ ↓; close with Esc or an outside click."
                : "打开菜单，用 ↑ ↓ 选择，Esc 或点击外部关闭。"
              : "")}
        </p>
        {deleted && (
          <button
            className="specimen-button mt-3"
            onClick={() => {
              setDeleted(false);
              setStatus(en ? "File restored." : "文件已恢复。");
            }}
          >
            {en ? "Undo delete" : "撤销删除"}
          </button>
        )}
      </div>
    </div>
  );
}
