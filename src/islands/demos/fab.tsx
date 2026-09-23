import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'single' | 'extended' | 'speed-dial';

const CHIPS = [
  { zh: '新建草稿', en: 'New draft', icon: '✎' },
  { zh: '扫描文档', en: 'Scan doc', icon: '⧉' },
  { zh: '导入文件', en: 'Import file', icon: '⇪' },
];

const NOTES = [
  { zh: '色板 v3 已合并', en: 'Palette v3 merged', t: '2h' },
  { zh: '图标集补充 12 枚', en: 'Icon set +12', t: '5h' },
  { zh: '暗色对比度已复核', en: 'Dark contrast checked', t: '1d' },
];

function FabStack({
  en,
  variant,
  onVariant,
  onLog,
}: {
  en: boolean;
  variant: Variant;
  onVariant?: (v: Variant) => void;
  onLog: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        mainRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const extended = variant === 'extended';
  const dial = variant === 'speed-dial';

  return (
    <div className="relative h-full">
      <div data-anatomy="3" className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-end gap-2 p-3">
        {dial &&
          open &&
          CHIPS.map((c, i) => (
            <button
              key={c.zh}
              type="button"
              onClick={() => {
                onLog(en ? c.en : c.zh);
                setOpen(false);
              }}
              style={{
                animation: `fab-pop calc(180ms * var(--demo-speed, 1)) ${i * 40}ms both`,
              }}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-[11px] text-ink shadow-md transition-colors hover:border-accent hover:text-accent"
            >
              <span aria-hidden="true">{c.icon}</span>
              {en ? c.en : c.zh}
            </button>
          ))}
      </div>

      <button
        ref={mainRef}
        type="button"
        data-anatomy="1"
        aria-expanded={dial ? open : undefined}
        aria-label={
          dial
            ? open
              ? en
                ? 'Close quick actions'
                : '收起快捷动作'
              : en
                ? 'Open quick actions'
                : '展开快捷动作'
            : en
              ? 'Create'
              : '新建'
        }
        onClick={() => {
          if (dial) {
            setOpen((o) => !o);
            return;
          }
          onLog(en ? 'Created a blank note' : '已新建空白笔记');
        }}
        className={`absolute bottom-4 right-4 z-10 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white shadow-lg transition-all duration-150 active:scale-[0.94] ${
          extended ? 'h-12 px-4' : 'h-12 w-12'
        }`}
      >
        <span
          data-anatomy="2"
          aria-hidden="true"
          className="text-base leading-none transition-transform duration-150"
          style={{ transform: dial && open ? 'rotate(45deg)' : undefined }}
        >
          +
        </span>
        {extended && (
          <span className="text-xs font-medium">{en ? 'New note' : '新建笔记'}</span>
        )}
      </button>

      {onVariant && (
        <div className="absolute bottom-4 left-3 flex flex-wrap gap-1.5">
          {(
            [
              ['single', en ? 'Single' : '单一圆形'],
              ['extended', en ? 'Extended' : '扩展标签'],
              ['speed-dial', en ? 'Speed dial' : '快捷扇出'],
            ] as [Variant, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={variant === v}
              onClick={() => {
                onVariant(v);
                setOpen(false);
              }}
              className={`pointer-events-auto rounded-md border px-2 py-1 text-[11px] transition-colors ${
                variant === v
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line bg-raised text-ink-2 hover:border-accent hover:text-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const FabDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<Variant>(
    mode === 'variants' ? 'single' : 'speed-dial',
  );
  const [log, setLog] = useState<string | null>(null);

  return (
    <div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-xs font-medium text-ink">
          {en ? 'Notes' : '随手记'}
        </span>
        <span className="text-[10px] text-ink-3">
          {en ? 'FAB floats above' : 'FAB 悬浮于内容之上'}
        </span>
      </div>
      <ul data-anatomy="3" className="space-y-2 p-3 pb-16">
        {NOTES.map((n) => (
          <li
            key={n.zh}
            className="flex items-center justify-between rounded-lg border border-line bg-raised px-3 py-2 text-xs text-ink-2"
          >
            <span>{en ? n.en : n.zh}</span>
            <span className="font-mono text-[10px] text-ink-3">{n.t}</span>
          </li>
        ))}
        <li aria-live="polite" className="min-h-5 text-[11px] text-accent">
          {log ? (en ? `Done · ${log}` : `已执行 · ${log}`) : ''}
        </li>
      </ul>

      <FabStack
        en={en}
        variant={variant}
        onVariant={mode === 'variants' ? setVariant : undefined}
        onLog={setLog}
      />
      <style>{`
        @keyframes fab-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.9) }
          to { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
};

export default FabDemo;
