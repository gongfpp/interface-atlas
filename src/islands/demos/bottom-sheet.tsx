import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'fixed' | 'draggable' | 'full-expand';
type Detent = 'peek' | 'half' | 'full';

const DETENT_H: Record<Detent, string> = {
  peek: '28%',
  half: '52%',
  full: '88%',
};
const ORDER: Detent[] = ['peek', 'half', 'full'];

const ACTIONS = [
  { zh: '分享链接', en: 'Share link' },
  { zh: '复制短链', en: 'Copy short link' },
  { zh: '生成二维码', en: 'Make QR code' },
  { zh: '导出为 PDF', en: 'Export as PDF' },
];

function BottomSheetPanel({
  en,
  variant,
  onClose,
}: {
  en: boolean;
  variant: Variant;
  onClose: () => void;
}) {
  const [detent, setDetent] = useState<Detent>(
    variant === 'full-expand' ? 'full' : 'half',
  );
  const [dragY, setDragY] = useState<number | null>(null);
  const startY = useRef(0);
  const startIdx = useRef(1);
  const startH = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const height = dragY != null ? `${Math.min(Math.max(dragY, 80), 520)}px` : DETENT_H[detent];

  return (
    <div
      data-anatomy="1"
      className="absolute inset-0 z-10 bg-black/40"
      style={{ animation: 'bs-fade calc(200ms * var(--demo-speed, 1)) both' }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        data-anatomy="3"
        role="dialog"
        aria-modal="true"
        aria-label={en ? 'Share actions' : '分享操作'}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl bg-raised shadow-2xl"
        style={{
          height,
          animation: 'bs-up calc(240ms * var(--demo-speed, 1)) both',
          touchAction: 'none',
        }}
      >
        <div
          data-anatomy="2"
          className="flex flex-col items-center gap-2 px-3 pb-1 pt-2"
          style={{ cursor: variant === 'draggable' ? 'grab' : 'default' }}
          onPointerDown={(e) => {
            if (variant !== 'draggable') return;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            startY.current = e.clientY;
            startIdx.current = ORDER.indexOf(detent);
            startH.current = panelRef.current?.clientHeight ?? 200;
            setDragY(startH.current);
          }}
          onPointerMove={(e) => {
            if (variant !== 'draggable' || dragY == null) return;
            const dy = startY.current - e.clientY;
            setDragY(Math.min(Math.max(startH.current + dy, 80), 520));
          }}
          onPointerUp={(e) => {
            if (variant !== 'draggable' || dragY == null) return;
            const dy = startY.current - e.clientY;
            const stageH =
              panelRef.current?.parentElement?.parentElement?.clientHeight ?? 400;
            if (dy < -stageH * 0.22) {
              onClose();
              return;
            }
            const deltaSteps = Math.round(dy / (stageH * 0.18));
            const idx = Math.min(2, Math.max(0, startIdx.current + deltaSteps));
            setDetent(ORDER[idx]);
            setDragY(null);
          }}
        >
          <span
            aria-hidden="true"
            className="h-1 w-9 rounded-full bg-line"
          />
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-medium text-ink">
              {en ? 'Share this board' : '分享这块看板'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={en ? 'Close' : '关闭'}
              className="text-xs text-ink-3 transition-colors hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>

        <ul className="flex-1 space-y-1 overflow-y-auto px-3 pb-2 pt-1">
          {ACTIONS.map((a) => {
            const label = en ? a.en : a.zh;
            return (
              <li key={a.zh}>
                <button
                  type="button"
                  onClick={() => setPicked(label)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-left text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
                >
                  {label}
                </button>
              </li>
            );
          })}
          <li className="pt-1 text-[11px] text-ink-3" aria-live="polite">
            {picked
              ? en
                ? `Picked: ${picked}`
                : `已选择：${picked}`
              : variant === 'draggable'
                ? en
                  ? 'Drag the grabber · swipe down to dismiss'
                  : '拖动抓手切换档位 · 下滑关闭'
                : variant === 'full-expand'
                  ? en
                    ? 'Full-expand detent for keyboards'
                    : '全屏展开，适合键盘弹出'
                  : en
                    ? 'Fixed height — no dragging'
                    : '固定高度，不可拖拽'}
          </li>
        </ul>

        <div className="border-t border-line p-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-accent py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            {en ? 'Done' : '完成'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bs-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bs-up { from { transform: translateY(100%) } to { transform: none } }
      `}</style>
    </div>
  );
}

const BottomSheetDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<Variant>(
    mode === 'variants' ? 'fixed' : 'draggable',
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto h-80 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="text-xs font-medium text-ink">
            {en ? 'Design board' : '设计看板'}
          </span>
          <span className="text-[10px] text-ink-3">v2.4</span>
        </div>
        <div className="flex-1 space-y-2 p-3">
          <div className="rounded-lg bg-code-bg p-3">
            <p className="text-xs text-ink-2">
              {en ? 'Roadmap · Q3 launch' : '路线图 · Q3 发布'}
            </p>
            <p className="mt-1 font-serif text-base text-ink">
              {en ? '12 tasks · 3 owners' : '12 个任务 · 3 位负责人'}
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-3">
            {en
              ? 'A bottom sheet rises from the bottom edge with a grabber — not a side drawer, not a centered modal.'
              : '底部抽屉从底边升起、带抓手 —— 不是侧边抽屉，也不是居中模态框。'}
          </p>
        </div>
        <div className="border-t border-line p-3">
          {mode === 'variants' && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {(
                [
                  ['fixed', en ? 'Fixed' : '固定高度'],
                  ['draggable', en ? 'Draggable' : '可拖拽档位'],
                  ['full-expand', en ? 'Full expand' : '全屏展开'],
                ] as [Variant, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={variant === v}
                  onClick={() => setVariant(v)}
                  className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                    variant === v
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-ink-2 hover:border-accent hover:text-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-lg bg-accent py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            {en ? 'Open bottom sheet' : '打开底部抽屉'}
          </button>
        </div>
      </div>
      {open && (
        <BottomSheetPanel
          en={en}
          variant={variant}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default BottomSheetDemo;
