import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'centered' | 'confirm' | 'sheet';

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      data-anatomy="1"
      onClick={onClose}
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40"
      style={{ animation: 'demo-modal-fade calc(180ms * var(--demo-speed, 1)) both' }}
    >
      {children}
    </div>
  );
}

function CenteredModal({ onClose, onDelete }: { onClose: () => void; onDelete: () => void }) {
  return (
    <div
      data-anatomy="2"
      role="dialog"
      aria-modal="true"
      aria-label="删除项目"
      onClick={(e) => e.stopPropagation()}
      className="w-64 rounded-xl border border-line bg-raised p-4 shadow-2xl"
      style={{ animation: 'demo-modal-in calc(200ms * var(--demo-speed, 1)) both' }}
    >
      <p data-anatomy="3" className="font-serif font-semibold">删除项目？</p>
      <p data-anatomy="4" className="mt-1.5 text-xs leading-relaxed text-ink-2">
        「Acme 官网改版」将被移入回收站，30 天后彻底删除。
      </p>
      <div data-anatomy="5" className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-line px-3 py-1 text-xs text-ink-2 transition-colors hover:bg-code-bg"
        >
          取消
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg bg-accent px-3 py-1 text-xs text-white transition-transform hover:opacity-90"
        >
          删除
        </button>
      </div>
    </div>
  );
}

function ConfirmMini({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-anatomy="2"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      className="w-56 rounded-xl border border-line bg-raised p-4 text-center shadow-2xl"
      style={{ animation: 'demo-modal-in calc(200ms * var(--demo-speed, 1)) both' }}
    >
      <p data-anatomy="3" className="text-sm font-medium">丢弃草稿？</p>
      <p data-anatomy="4" className="mt-1 text-[11px] text-ink-2">此操作无法撤销。</p>
      <div data-anatomy="5" className="mt-3 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-line py-1 text-xs text-ink-2 hover:bg-code-bg"
        >
          继续编辑
        </button>
        <button onClick={onClose} className="flex-1 rounded-lg bg-accent py-1 text-xs text-white">
          丢弃
        </button>
      </div>
    </div>
  );
}

function SheetMini({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-anatomy="1"
      onClick={onClose}
      className="absolute inset-0 z-10 flex items-end justify-center bg-black/40"
      style={{ animation: 'demo-modal-fade calc(180ms * var(--demo-speed, 1)) both' }}
    >
      <div
        data-anatomy="2"
        role="dialog"
        aria-modal="true"
        aria-label="分享设置"
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-2xl bg-raised p-4 shadow-2xl"
        style={{ animation: 'demo-modal-up calc(240ms * var(--demo-speed, 1)) both' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink-3/40" />
        <p data-anatomy="3" className="text-sm font-medium">分享设置</p>
        <p data-anatomy="4" className="mt-1 text-[11px] text-ink-2">任何拥有链接的人都可以查看。</p>
        <button
          data-anatomy="5"
          onClick={onClose}
          className="mt-3 w-full rounded-lg bg-accent py-1.5 text-xs text-white"
        >
          完成
        </button>
      </div>
    </div>
  );
}

function MockPage({ onOpen, deleted }: { onOpen: () => void; deleted: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-xs font-medium">项目列表</span>
        <button
          data-anatomy="2"
          onClick={onOpen}
          className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          删除项目…
        </button>
      </div>
      <div className="flex-1 space-y-2 p-3">
        <div className="rounded-lg border border-line bg-raised px-3 py-2 text-xs">Acme 移动端 App</div>
        <div
          className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
            deleted ? 'border-dashed border-line text-ink-3 line-through' : 'border-line bg-raised'
          }`}
        >
          Acme 官网改版{deleted ? '（已删除）' : ''}
        </div>
      </div>
    </div>
  );
}

const ModalDemo: DemoComponent = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [deleted, setDeleted] = useState(false);

  if (mode === 'variants') {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="mb-3 text-xs text-ink-3">同一内容的三种形态，点击触发：</p>
        <div className="flex justify-center gap-2">
          {(
            [
              ['centered', '居中对话框'],
              ['confirm', '紧凑确认框'],
              ['sheet', '底部面板'],
            ] as [Variant, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              {label}
            </button>
          ))}
        </div>
        {variant && (
          <Backdrop onClose={() => setVariant(null)}>
            {variant === 'centered' && (
              <CenteredModal onClose={() => setVariant(null)} onDelete={() => setVariant(null)} />
            )}
            {variant === 'confirm' && <ConfirmMini onClose={() => setVariant(null)} />}
            {variant === 'sheet' && <SheetMini onClose={() => setVariant(null)} />}
          </Backdrop>
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <MockPage onOpen={() => setOpen(true)} deleted={deleted} />
      {open && (
        <Backdrop onClose={() => setOpen(false)}>
          <CenteredModal
            onClose={() => setOpen(false)}
            onDelete={() => {
              setOpen(false);
              setDeleted(true);
            }}
          />
        </Backdrop>
      )}
      <style>{`
        @keyframes demo-modal-in { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        @keyframes demo-modal-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes demo-modal-up { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
};

export default ModalDemo;
