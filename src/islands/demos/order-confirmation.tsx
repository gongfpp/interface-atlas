import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：支付成功后的确认页 */

const VARIANTS = [
  { id: 'receipt', zh: '收据式', en: 'Receipt' },
  { id: 'celebratory', zh: '庆祝式', en: 'Celebratory' },
  { id: 'tracking', zh: '物流优先', en: 'Tracking-first' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const T: React.CSSProperties = { transitionDuration: 'calc(200ms * var(--demo-speed, 1))' };

const ORDER_NO = 'AC-2026-0824-7781';

const ITEMS = [
  { zh: '无线降噪耳机', en: 'ANC Headphones', variant: '曜石黑 · 标准版', qty: 1, price: '¥899' },
  { zh: '硅胶保护套', en: 'Silicone Case', variant: '深灰', qty: 2, price: '¥78' },
];

const STEPS = [
  { zh: '已下单', en: 'Placed' },
  { zh: '已付款', en: 'Paid' },
  { zh: '已发货', en: 'Shipped' },
  { zh: '已送达', en: 'Delivered' },
];

const DONE = 2;

const Timeline = ({ en }: { en: boolean }) => (
  <ol data-anatomy="5" className="relative space-y-2 pl-4">
    <span className="absolute bottom-1 left-[5px] top-1 w-px bg-line" aria-hidden="true" />
    {STEPS.map((s, i) => {
      const done = i < DONE;
      return (
        <li key={s.zh} className="relative flex items-center gap-2 text-[10px]">
          <span
            className={`absolute -left-4 h-2.5 w-2.5 rounded-full border ${
              done ? 'border-accent bg-accent' : 'border-line bg-paper'
            }`}
          />
          <span className={done ? 'text-ink' : 'text-ink-3'}>{en ? s.en : s.zh}</span>
          {i === DONE - 1 && (
            <span className="rounded bg-accent-soft px-1 text-[8px] text-accent">{en ? 'Now' : '当前'}</span>
          )}
        </li>
      );
    })}
  </ol>
);

const Items = ({ en }: { en: boolean }) => (
  <div data-anatomy="3" className="space-y-2">
    {ITEMS.map((it) => (
      <div key={it.zh} className="flex items-center gap-2">
        <span className="h-8 w-8 shrink-0 rounded-md border border-line bg-raised" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium">{en ? it.en : it.zh}</p>
          <p className="truncate text-[9px] text-ink-3">
            {it.variant} · ×{it.qty}
          </p>
        </div>
        <span className="font-mono text-[11px] text-ink-2">{it.price}</span>
      </div>
    ))}
  </div>
);

const Totals = ({ en }: { en: boolean }) => (
  <dl data-anatomy="4" className="space-y-1 border-t border-line pt-2 text-[10px]">
    {[
      { k: en ? 'Subtotal' : '小计', v: '¥1,055' },
      { k: en ? 'Shipping' : '运费', v: en ? 'Free' : '免运费' },
      { k: en ? 'Discount' : '优惠', v: '-¥60' },
    ].map((r) => (
      <div key={r.k} className="flex justify-between">
        <dt className="text-ink-3">{r.k}</dt>
        <dd className="font-mono text-ink-2">{r.v}</dd>
      </div>
    ))}
    <div className="flex justify-between border-t border-line pt-1 text-xs font-semibold">
      <dt>{en ? 'Total' : '合计'}</dt>
      <dd className="font-mono text-accent">¥995</dd>
    </div>
  </dl>
);

function Confirmation({
  variant,
  trackingOpen,
  copied,
  onCopy,
  onToggle,
  en,
}: {
  variant: VariantId;
  trackingOpen: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggle: () => void;
  en: boolean;
}) {
  const celebratory = variant === 'celebratory';
  const trackingFirst = variant === 'tracking';
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      {celebratory && (
        <>
          <style>{`@keyframes oc-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}.oc-pop{animation:oc-pop calc(500ms * var(--demo-speed,1)) ease-out both}`}</style>
          <span className="oc-pop absolute right-4 top-3 h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="oc-pop absolute right-8 top-6 h-1 w-1 rounded-full bg-emerald-600" />
          <span className="oc-pop absolute right-3 top-9 h-1 w-1 rounded-full bg-accent" />
        </>
      )}

      <div data-anatomy="1" role="status" className="flex flex-col items-center gap-1 border-b border-line px-4 py-4 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-lg text-white">
          ✓
        </span>
        <p className="font-serif text-sm font-semibold">{en ? 'Payment successful' : '支付成功'}</p>
        <p className="text-[10px] text-ink-3">
          {en ? 'A receipt has been sent to your email.' : '收据已发送到你的邮箱'}
        </p>
      </div>

      <div className="space-y-3 p-3">
        <div data-anatomy="2" className="flex items-center justify-between gap-2 rounded-md bg-raised px-2.5 py-2">
          <div>
            <p className="text-[9px] text-ink-3">{en ? 'Order' : '订单号'}</p>
            <p className="font-mono text-[11px]">{ORDER_NO}</p>
          </div>
          <button
            onClick={onCopy}
            className="rounded border border-line px-2 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
            style={T}
          >
            {copied ? (en ? 'Copied ✓' : '已复制 ✓') : en ? 'Copy' : '复制'}
          </button>
        </div>

        {(trackingFirst || trackingOpen) && (
          <div className="rounded-md border border-line px-2.5 py-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-medium">{en ? 'Delivery' : '物流进度'}</p>
              <span className="text-[9px] text-ink-3">{en ? 'ETA Aug 16' : '预计 8 月 16 日送达'}</span>
            </div>
            <Timeline en={en} />
          </div>
        )}

        <Items en={en} />
        <Totals en={en} />

        <div data-anatomy="6" className="flex flex-wrap gap-2 border-t border-line pt-2">
          {!trackingFirst && (
            <button
              onClick={onToggle}
              aria-expanded={trackingOpen}
              className="rounded-md border border-line px-2.5 py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
              style={T}
            >
              {trackingOpen ? (en ? 'Hide tracking' : '收起物流') : en ? 'Track order' : '查看物流'}
            </button>
          )}
          <button className="rounded-md bg-accent px-2.5 py-1 text-[10px] font-medium text-white transition-colors hover:opacity-90" style={T}>
            {en ? 'Download invoice' : '下载发票'}
          </button>
          <button className="rounded-md px-2.5 py-1 text-[10px] text-ink-2 transition-colors hover:text-accent" style={T}>
            {en ? 'Continue shopping' : '继续购物'}
          </button>
        </div>
      </div>
    </div>
  );
}

const OrderConfirmationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [copied, setCopied] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ORDER_NO);
    } catch {
      /* 非安全上下文忽略，仅给 UI 反馈 */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 230 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Confirmation
                variant={v.id}
                trackingOpen={true}
                copied={false}
                onCopy={() => {}}
                onToggle={() => {}}
                en={en}
              />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {en ? v.en : v.zh}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Confirmation
        variant="receipt"
        trackingOpen={trackingOpen}
        copied={copied}
        onCopy={copy}
        onToggle={() => setTrackingOpen((o) => !o)}
        en={en}
      />
      <p className="mt-2 text-center text-[10px] text-ink-3">
        {en ? 'Copy the order number or expand tracking' : '试试复制订单号、展开物流进度'}
      </p>
    </div>
  );
};

export default OrderConfirmationDemo;
