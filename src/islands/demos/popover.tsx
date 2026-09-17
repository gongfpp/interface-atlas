import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function Pop({
  label,
  children,
  width = 'w-56',
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        data-anatomy="1"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
          open
            ? 'border-accent bg-accent-soft text-accent'
            : 'border-line text-ink-2 hover:border-accent hover:text-accent'
        }`}
      >
        {label}
      </button>
      {open && (
        <div
          data-anatomy="2"
          className={`absolute top-full left-1/2 z-20 mt-2 rounded-xl border border-line bg-raised p-3 text-left shadow-2xl ${width}`}
          style={{ animation: 'demo-pop-in calc(180ms * var(--demo-speed, 1)) both' }}
        >
          <span
            data-anatomy="3"
            aria-hidden="true"
            className="absolute -top-[5px] left-1/2 -ml-[5px] h-2.5 w-2.5 rotate-45 border-l border-t border-line bg-raised"
          />
          <button
            data-anatomy="4"
            aria-label="关闭"
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 text-[11px] text-ink-3 transition-colors hover:text-ink"
          >
            ✕
          </button>
          {children}
        </div>
      )}
    </div>
  );
}

function PlainContent() {
  return (
    <div className="pt-1">
      <p className="text-xs font-medium">什么是净推荐值？</p>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
        NPS 衡量用户推荐意愿：推荐者百分比减去贬损者百分比，范围 -100 到 100。
      </p>
    </div>
  );
}

function InteractiveContent() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="pt-1"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-xs font-medium">邀请成员</p>
      {sent ? (
        <p className="mt-1.5 text-[11px] text-emerald-600">邀请已发送 / Invitation sent</p>
      ) : (
        <>
          <input
            placeholder="name@acme.dev"
            className="mt-1.5 w-full rounded-lg border border-line bg-paper px-2 py-1 text-[11px] outline-none focus:border-accent"
          />
          <button type="submit" className="mt-2 w-full rounded-lg bg-accent py-1 text-[11px] text-white">
            发送邀请
          </button>
        </>
      )}
    </form>
  );
}

function MediaContent() {
  return (
    <div className="pt-1">
      <div className="flex h-16 items-center justify-center rounded-lg bg-accent-soft">
        <span className="font-serif text-2xl text-accent">Aa</span>
      </div>
      <p className="mt-2 text-xs font-medium">Acme Serif</p>
      <p className="text-[11px] text-ink-2">新版品牌衬线字体，用于标题与数字。</p>
    </div>
  );
}

const PopoverDemo: DemoComponent = ({ mode }) => {
  const keyframes = (
    <style>{`@keyframes demo-pop-in { from { opacity: 0; transform: translateX(-50%) scale(0.95) } to { opacity: 1; transform: translateX(-50%) scale(1) } }`}</style>
  );
  if (mode === 'variants') {
    return (
      <div className="flex h-40 items-start justify-center gap-3 pt-6">
        {keyframes}
        <Pop label="说明"> <PlainContent /> </Pop>
        <Pop label="邀请"> <InteractiveContent /> </Pop>
        <Pop label="字体"> <MediaContent /> </Pop>
      </div>
    );
  }
  return (
    <div className="flex h-40 items-start justify-center gap-3 pt-6">
      {keyframes}
      <Pop label="什么是 NPS？"> <PlainContent /> </Pop>
      <Pop label="邀请成员"> <InteractiveContent /> </Pop>
    </div>
  );
};

export default PopoverDemo;
