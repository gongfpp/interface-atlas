import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const ElasticBounceDemo: DemoComponent = ({ mode }) => {
  const [run, setRun] = useState(0);
  const jelly = mode === 'variants';

  return (
    <div className="flex flex-col items-center gap-6">
      <div key={run} className="flex flex-col items-center gap-4">
        <div
          className="bounce-target flex h-20 w-20 flex-col items-center justify-center rounded-full bg-accent-soft"
          style={{ animationName: jelly ? 'jelly' : 'overshoot-pop' }}
        >
          <span className="text-2xl">🎉</span>
          <span className="text-[10px] font-semibold text-accent">已完成</span>
        </div>
        <p className="text-sm font-medium text-ink">任务提交成功</p>
      </div>
      <button
        onClick={() => setRun((r) => r + 1)}
        className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
      >
        重播 / Replay
      </button>
      <p className="text-xs text-ink-3">
        {jelly ? '果冻抖动：scale 1→1.12→0.94→1 连续振荡' : '一次过冲：cubic-bezier y>1 越过终点再回落'}
      </p>
      <style>{`@keyframes overshoot-pop { 0% { opacity: 0; transform: scale(0.55) } 100% { opacity: 1; transform: scale(1) } }
@keyframes jelly { 0% { opacity: 0; transform: scale(0.6) } 30% { opacity: 1; transform: scale(1.12) } 55% { transform: scale(0.94) } 75% { transform: scale(1.04) } 100% { transform: scale(1) } }
.bounce-target { animation-duration: calc(0.55s * var(--demo-speed, 1)); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); animation-fill-mode: both; transform-origin: center; }
`}</style>
    </div>
  );
};

export default ElasticBounceDemo;
