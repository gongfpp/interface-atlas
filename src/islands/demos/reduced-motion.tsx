import type { DemoComponent } from '@/islands/DemoStage';
import { useEffect, useState } from 'react';

const MOTION_CSS = `
@keyframes rm-slide {
  from { opacity: 0; transform: translateX(-28px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}
@keyframes rm-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.rm-full { animation: rm-slide 620ms cubic-bezier(.2,.8,.2,1) both; }
.rm-fade { animation: rm-fade 220ms ease-out both; }
.rm-none { animation: none; }
`;

const ReducedMotionDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [reduce, setReduce] = useState(false);
  const [osReduce, setOsReduce] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setOsReduce(mq.matches);
      if (mq.matches) setReduce(true);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const cls = reduce ? 'rm-fade' : 'rm-full';

  if (mode === 'variants') {
    const rows: Array<[string, string, string]> = [
      ['full', en ? 'Full motion' : '全动效', 'rm-full'],
      ['fade', en ? 'Fade only' : '仅淡入', 'rm-fade'],
      ['none', en ? 'No animation' : '无动画', 'rm-none'],
    ];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
        <style>{MOTION_CSS}</style>
        {rows.map(([id, label, animation]) => (
          <div key={id} className="rounded-xl border border-line bg-raised p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-ink-3">{id} · {label}</p>
            <div
              key={`${id}-${pulse}`}
              className={`rounded-lg border border-line bg-code-bg px-3 py-2 text-xs text-ink ${animation}`}
            >
              {en ? 'Report ready' : '月报已生成'}
            </div>
          </div>
        ))}
        <button
          onClick={() => setPulse((p) => p + 1)}
          className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent"
        >
          {en ? 'Replay all ↺' : '全部重播 ↺'}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <style>{MOTION_CSS}</style>
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-raised px-3 py-2.5">
        <span className="text-xs font-medium text-ink">
          {en ? 'Simulate “reduce motion”' : '模拟系统「减弱动效」'}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[10px] text-ink-3">{reduce ? 'ON' : 'OFF'}</span>
          <input
            type="checkbox"
            checked={reduce}
            onChange={(e) => setReduce(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
        </span>
      </label>

      <div data-anatomy="1" className="overflow-hidden rounded-xl border border-line bg-code-bg p-4">
        <div
          key={pulse}
          className={`rounded-lg border border-line bg-raised px-3 py-3 text-xs text-ink ${cls}`}
        >
          {en ? 'Your monthly report is ready — 18 pages' : '你的月度报告已生成——共 18 页'}
        </div>
        <button
          onClick={() => setPulse((p) => p + 1)}
          className="mt-3 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          {en ? 'Replay entrance ▸' : '重播入场动画 ▸'}
        </button>
      </div>

      <div data-anatomy="2" className="rounded-xl border border-line bg-raised px-3 py-2.5 text-[11px] text-ink-2">
        <p className="text-ink-3">
          {en ? 'OS preference (matchMedia)' : '系统偏好（matchMedia）'} ·{' '}
          <span className={osReduce ? 'text-accent' : 'text-ink'}>
            prefers-reduced-motion: {osReduce ? 'reduce' : 'no-preference'}
          </span>
        </p>
        <p className="mt-1 leading-relaxed">
          {reduce
            ? en
              ? 'Demoted to a 220ms fade — no travel, no zoom.'
              : '已降级为 220ms 淡入——没有位移，没有缩放。'
            : en
              ? 'Full entrance: slide 28px + scale 0.96 over 620ms.'
              : '完整入场：左移 28px + 缩放 0.96，620ms。'}
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'The toggle stands in for the OS switch; real apps read matchMedia and demote automatically.'
          : '开关模拟的是系统设置；真实应用读 matchMedia 并自动降级。'}
      </p>
    </div>
  );
};

export default ReducedMotionDemo;
