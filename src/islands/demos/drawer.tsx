import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Edge = 'right' | 'left' | 'bottom';

const ORDERS = [
  'ORD-1042 · ¥ 268.00',
  'ORD-1043 · ¥ 1,299.00',
  'ORD-1044 · ¥ 89.00',
  'ORD-1045 · ¥ 456.00',
];

function DrawerBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      data-anatomy="1"
      onClick={onClose}
      className="absolute inset-0 z-10 bg-black/40"
      style={{ animation: 'demo-drawer-fade calc(200ms * var(--demo-speed, 1)) both' }}
    >
      {children}
    </div>
  );
}

function DrawerPanel({
  edge,
  onClose,
  title,
  children,
}: {
  edge: Edge;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const pos =
    edge === 'right'
      ? 'inset-y-0 right-0 w-52 rounded-l-xl'
      : edge === 'left'
        ? 'inset-y-0 left-0 w-52 rounded-r-xl'
        : 'inset-x-0 bottom-0 rounded-t-2xl';
  const anim =
    edge === 'bottom' ? 'demo-drawer-up' : edge === 'left' ? 'demo-drawer-left' : 'demo-drawer-right';
  return (
    <div
      data-anatomy="2"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.stopPropagation()}
      className={`absolute flex flex-col bg-raised shadow-2xl ${pos}`}
      style={{ animation: `${anim} calc(240ms * var(--demo-speed, 1)) both` }}
    >
      <div data-anatomy="3" className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <span className="text-xs font-medium">{title}</span>
        <button
          onClick={onClose}
          aria-label="关闭"
          className="text-xs text-ink-3 transition-colors hover:text-ink"
        >
          ✕
        </button>
      </div>
      <div data-anatomy="4" className="flex-1 space-y-2 overflow-y-auto p-3 text-xs text-ink-2">
        {children}
      </div>
      <div data-anatomy="5" className="border-t border-line p-2.5">
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-accent py-1.5 text-xs text-white transition-opacity hover:opacity-90"
        >
          知道了
        </button>
      </div>
    </div>
  );
}

function MockList({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-xs font-medium">订单列表</span>
        <span className="text-[10px] text-ink-3">点击订单查看详情 →</span>
      </div>
      <div className="flex-1 space-y-2 p-3">
        {ORDERS.map((o) => (
          <button
            key={o}
            onClick={onOpen}
            className="block w-full rounded-lg border border-line bg-raised px-3 py-2 text-left text-xs transition-colors hover:border-accent hover:text-accent"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

const DrawerDemo: DemoComponent = ({ mode }) => {
  const [edge, setEdge] = useState<Edge | null>(null);

  const panelContent = (
    <>
      <p className="font-medium text-ink">ORD-1042</p>
      <p>状态：已发货 · 顺丰 SF1234567890</p>
      <p>下单时间：2026-09-16 14:20</p>
      <p>收货地址：杭州市西湖区文三路 100 号</p>
      <div className="rounded-lg border border-line bg-code-bg px-2 py-1.5 text-[11px]">
        买家留言：请尽快发货，谢谢。
      </div>
    </>
  );

  if (mode === 'variants') {
    return (
      <div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <p className="text-xs text-ink-3">三个方向的抽屉，点击触发：</p>
          <div className="flex gap-2">
            {(
              [
                ['right', '右侧滑入'],
                ['left', '左侧滑入'],
                ['bottom', '底部抽屉'],
              ] as [Edge, string][]
            ).map(([e, label]) => (
              <button
                key={e}
                onClick={() => setEdge(e)}
                className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {edge && (
          <DrawerBackdrop onClose={() => setEdge(null)}>
            <DrawerPanel edge={edge} onClose={() => setEdge(null)} title="订单详情">
              {panelContent}
            </DrawerPanel>
          </DrawerBackdrop>
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <MockList onOpen={() => setEdge('right')} />
      {edge && (
        <DrawerBackdrop onClose={() => setEdge(null)}>
          <DrawerPanel edge={edge} onClose={() => setEdge(null)} title="订单详情">
            {panelContent}
          </DrawerPanel>
        </DrawerBackdrop>
      )}
      <style>{`
        @keyframes demo-drawer-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes demo-drawer-right { from { opacity: 0.6; transform: translateX(100%) } to { opacity: 1; transform: none } }
        @keyframes demo-drawer-left { from { opacity: 0.6; transform: translateX(-100%) } to { opacity: 1; transform: none } }
        @keyframes demo-drawer-up { from { opacity: 0.6; transform: translateY(100%) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
};

export default DrawerDemo;
