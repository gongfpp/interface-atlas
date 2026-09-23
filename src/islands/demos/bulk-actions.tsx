import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Row = { id: string; name: string; status: string };

const INITIAL: Row[] = [
  { id: '1', name: '季度报告.pdf', status: 'draft' },
  { id: '2', name: '设计稿-v2.fig', status: 'review' },
  { id: '3', name: '合同扫描件', status: 'done' },
  { id: '4', name: '会议纪要.md', status: 'draft' },
  { id: '5', name: '发布清单', status: 'review' },
];

function BulkPlayground({ en }: { en: boolean }) {
  const [rows, setRows] = useState(INITIAL);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Row[] | null>(null);
  const headerRef = useRef<HTMLInputElement>(null);

  const allOn = rows.length > 0 && selected.size === rows.length;
  const someOn = selected.size > 0 && !allOn;

  useEffect(() => {
    if (headerRef.current) headerRef.current.indeterminate = someOn;
  }, [someOn]);

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const run = (action: 'archive' | 'delete') => {
    const removed = rows.filter((r) => selected.has(r.id));
    if (!removed.length) return;
    setUndoStack(removed);
    setRows((rs) => rs.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    setToast(
      action === 'delete'
        ? en
          ? `Deleted ${removed.length} item(s)`
          : `已删除 ${removed.length} 项`
        : en
          ? `Archived ${removed.length} item(s)`
          : `已归档 ${removed.length} 项`,
    );
  };

  const undo = () => {
    if (!undoStack) return;
    setRows((rs) => [...undoStack, ...rs].sort((a, b) => Number(a.id) - Number(b.id)));
    setUndoStack(null);
    setToast(en ? 'Restored' : '已撤销恢复');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <table data-anatomy="1" className="w-full overflow-hidden rounded-xl border border-line bg-paper text-xs">
        <thead>
          <tr className="border-b border-line bg-code-bg text-left text-[10px] text-ink-3">
            <th data-anatomy="2" className="w-8 px-2 py-2">
              <input
                ref={headerRef}
                type="checkbox"
                checked={allOn}
                onChange={() => setSelected(allOn ? new Set() : new Set(rows.map((r) => r.id)))}
                aria-label={en ? 'Select all' : '全选'}
                className="accent-accent"
              />
            </th>
            <th className="px-2 py-2">{en ? 'Name' : '名称'}</th>
            <th className="px-2 py-2">{en ? 'Status' : '状态'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className={`border-b border-line/60 last:border-0 ${selected.has(r.id) ? 'bg-accent-soft/40' : ''}`}
            >
              <td className="px-2 py-1.5">
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggle(r.id)}
                  aria-label={r.name}
                  className="accent-accent"
                />
              </td>
              <td className="px-2 py-1.5 text-ink">{r.name}</td>
              <td className="px-2 py-1.5 text-ink-3">{r.status}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={3} className="px-3 py-6 text-center text-ink-3">
                {en ? 'No rows' : '没有数据'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        data-anatomy="3"
        className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2 transition-all"
        style={{
          transitionDuration: 'calc(0.22s * var(--demo-speed, 1))',
          opacity: selected.size ? 1 : 0.45,
          transform: selected.size ? 'translateY(0)' : 'translateY(4px)',
        }}
      >
        <span data-anatomy="4" className="text-[11px] text-ink-2">
          {selected.size
            ? en
              ? `${selected.size} selected`
              : `已选 ${selected.size} 项`
            : en
              ? 'Select rows to act'
              : '勾选行以操作'}
        </span>
        <div className="ml-auto flex gap-1.5">
          <button
            onClick={() => run('archive')}
            disabled={!selected.size}
            className="rounded-lg border border-line px-2.5 py-1 text-[11px] text-ink-2 disabled:opacity-40"
          >
            {en ? 'Archive' : '归档'}
          </button>
          <button
            onClick={() => run('delete')}
            disabled={!selected.size}
            className="rounded-lg bg-red-600/90 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
          >
            {en ? 'Delete' : '删除'}
          </button>
        </div>
      </div>

      <div className="mt-2 min-h-8 rounded-lg bg-code-bg px-3 py-2 text-[11px] text-ink-2">
        {toast ? (
          <span>
            {toast}
            {undoStack && (
              <button onClick={undo} className="ml-2 text-accent underline underline-offset-2">
                {en ? 'Undo' : '撤销'}
              </button>
            )}
          </span>
        ) : (
          (en ? 'Bulk actions run once against the selection' : '批量操作对整个选择集一次执行')
        )}
      </div>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[string, string, string]> = [
    ['checkbox-action-bar', '复选框 + 操作栏', 'Checkbox + action bar'],
    ['select-all-inverse', '全选 + 反选', 'Select-all + inverse'],
    ['sticky-footer', '粘性底栏', 'Sticky footer bar'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english], i) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{id}</p>
          <div className="mt-2 flex h-12 items-center gap-1 rounded-lg bg-code-bg px-2">
            {i === 2 ? (
              <div className="mt-auto mb-1 h-4 w-full rounded bg-accent/70" />
            ) : (
              <>
                <span className="h-3 w-3 rounded-sm border border-ink-3" />
                <span className="h-3 w-3 rounded-sm bg-accent" />
                <span className="ml-auto text-[9px] text-ink-3">2</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const BulkActionsDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <BulkPlayground en={en} />;
};

export default BulkActionsDemo;
