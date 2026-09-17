import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const PageTransitionDemo: DemoComponent = ({ mode }) => {
  const [page, setPage] = useState<'list' | 'detail'>('list');
  const [anim, setAnim] = useState(false);

  const go = (to: 'list' | 'detail') => {
    setAnim(true);
    setTimeout(() => { setPage(to); setAnim(false); }, 260);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-line">
        <div
          className="absolute inset-0 bg-raised p-4 transition-all duration-300"
          style={{
            opacity: page === 'list' && !anim ? 1 : page === 'list' ? 0 : 0,
            transform: page === 'list' && !anim ? 'translateX(0)' : `translateX(${anim ? '-8%' : '-100%'})`,
          }}
        >
          <p className="text-xs font-semibold text-ink-3">文章列表 / Articles</p>
          {['卡片鼠标悬浮的 4 种做法', '骨架屏到底多长合适', '什么时候不该用弹窗'].map((t) => (
            <div key={t} className="mt-2 rounded-lg border border-line bg-paper p-2 text-[11px]">{t}</div>
          ))}
        </div>
        <div
          className="absolute inset-0 bg-raised p-4 transition-all duration-300"
          style={{
            opacity: page === 'detail' && !anim ? 1 : 0,
            transform: page === 'detail' && !anim ? 'translateX(0)' : `translateX(${anim ? '108%' : '108%'})`,
          }}
        >
          <button onClick={() => go('list')} className="text-[10px] text-accent">← 返回列表</button>
          <p className="mt-2 text-sm font-bold">骨架屏到底多长合适</p>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-full rounded bg-ink-3/20" />
            <div className="h-2 w-5/6 rounded bg-ink-3/20" />
            <div className="h-2 w-4/6 rounded bg-ink-3/20" />
          </div>
          <p className="mt-3 text-[10px] text-ink-3">详情页从右侧滑入（push 进入）</p>
        </div>
        {anim && <div className="absolute inset-0 animate-pulse bg-paper/30" />}
      </div>
      <button
        onClick={() => page === 'list' && go('detail')}
        className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white disabled:opacity-40"
        disabled={page !== 'list'}
      >
        打开文章 → 触发转场
      </button>
      <p className="text-xs text-ink-3">{mode === 'variants' ? '变体：push 滑入 / fade 淡入 / shared element 共享元素' : '点击按钮观察页面间转场'}</p>
    </div>
  );
};

export default PageTransitionDemo;
