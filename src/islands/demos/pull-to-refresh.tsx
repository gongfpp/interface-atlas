import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const THRESHOLD = 56;
const DAMPING = 0.45;

function makeFeed(batch: number): string[] {
  return [
    `推荐流已更新 · 第 ${batch} 次刷新`,
    'Rin 发布了新文章《手势设计十讲》',
    'Mao 把项目状态改为「进行中」',
    '3 条新评论待处理',
    '系统例行备份完成',
  ];
}

const PullToRefreshDemo: DemoComponent = ({ mode }) => {
  const [feed, setFeed] = useState<string[]>(() => makeFeed(1));
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const batchRef = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let startY: number | null = null;

    const startRefresh = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      setRefreshing(true);
      pullRef.current = THRESHOLD * 0.8;
      setPull(THRESHOLD * 0.8);
      setTimeout(() => {
        batchRef.current += 1;
        setFeed(makeFeed(batchRef.current));
        refreshingRef.current = false;
        setRefreshing(false);
        pullRef.current = 0;
        setPull(0);
      }, 1400);
    };

    const onDown = (y: number) => {
      startY = el.scrollTop <= 0 && !refreshingRef.current ? y : null;
    };
    const onMove = (y: number, prevent: () => void) => {
      if (startY === null) return;
      const d = (y - startY) * DAMPING;
      if (d > 0 && el.scrollTop <= 0) {
        prevent();
        const v = Math.min(d, 90);
        pullRef.current = v;
        setPull(v);
      }
    };
    const onUp = () => {
      if (startY === null) return;
      startY = null;
      if (pullRef.current >= THRESHOLD) startRefresh();
      else {
        pullRef.current = 0;
        setPull(0);
      }
    };

    const tStart = (e: TouchEvent) => onDown(e.touches[0].clientY);
    const tMove = (e: TouchEvent) => onMove(e.touches[0].clientY, () => e.preventDefault());
    const pDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') onDown(e.clientY);
    };
    const pMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') onMove(e.clientY, () => {});
    };

    el.addEventListener('touchstart', tStart, { passive: true });
    el.addEventListener('touchmove', tMove, { passive: false });
    el.addEventListener('touchend', onUp);
    el.addEventListener('touchcancel', onUp);
    el.addEventListener('pointerdown', pDown);
    el.addEventListener('pointermove', pMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('touchstart', tStart);
      el.removeEventListener('touchmove', tMove);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('touchcancel', onUp);
      el.removeEventListener('pointerdown', pDown);
      el.removeEventListener('pointermove', pMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const snapped = refreshing || pull === 0;
  const progress = Math.min(pull / THRESHOLD, 1);

  if (mode === 'variants') {
    return (
      <div className="grid gap-4 text-left md:grid-cols-2">
        <div className="rounded-lg border border-line bg-raised p-3 text-center">
          <div className="mb-2 text-xs font-medium">指示器跟随 · Tracked spinner</div>
          <div className="flex h-16 items-center justify-center rounded border border-line/60">
            <span className="inline-flex items-center gap-2 text-[10px] text-ink-2">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-line-strong border-t-accent" />
              下拉中 · 62%
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-raised p-3 text-center">
          <div className="mb-2 text-xs font-medium">文字提示 · Text hint</div>
          <div className="flex h-16 flex-col items-center justify-center gap-1 rounded border border-line/60 text-[10px] text-ink-2">
            <span>↓ 下拉刷新</span>
            <span className="text-ink-3">过阈值后 → 松手立即刷新</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xs select-none">
      <div className="overflow-hidden rounded-lg border border-line bg-raised">
        <div
          data-anatomy="1"
          className="flex items-center justify-center text-[10px] text-ink-2"
          style={{
            height: snapped ? (refreshing ? THRESHOLD * 0.8 : pull) : pull,
            transition: snapped ? 'height 240ms cubic-bezier(0.2, 0.8, 0.3, 1)' : undefined,
          }}
        >
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-line-strong"
            style={{
              borderTopColor: 'var(--color-accent, currentColor)',
              transform: refreshing ? undefined : `rotate(${progress * 180}deg) scale(${0.6 + progress * 0.4})`,
              animation: refreshing ? `demo-ptr-spin calc(0.8s * var(--demo-speed, 1)) linear infinite` : undefined,
            }}
          />
          <span data-anatomy="2" className="ml-2">
            {refreshing ? '刷新中… · Refreshing' : pull >= THRESHOLD ? '松手刷新 · Release' : '下拉刷新 · Pull'}
          </span>
        </div>
        <div ref={scrollRef} data-anatomy="3" className="h-48 overflow-y-auto overscroll-contain px-3">
          {feed.map((line, i) => (
            <div key={`${line}-${i}`} className="border-b border-line/60 py-2.5 text-xs last:border-b-0">
              {line}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-ink-3">
        在列表顶部按住并向下拖动（触屏或鼠标均可） · Drag down at the top
      </p>
      <style>{`@keyframes demo-ptr-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default PullToRefreshDemo;
