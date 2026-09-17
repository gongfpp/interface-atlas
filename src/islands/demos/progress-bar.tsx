import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function Bar({ value, done }: { value: number; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div data-anatomy="1" className="h-1.5 flex-1 overflow-hidden rounded-full bg-code-bg">
        <div
          data-anatomy="2"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="上传进度"
          className={`h-full rounded-full transition-[width] ease-out ${done ? 'bg-emerald-500' : 'bg-accent'}`}
          style={{ width: `${value}%`, transitionDuration: 'calc(400ms * var(--demo-speed, 1))' }}
        />
      </div>
      <span data-anatomy="3" className={`w-16 shrink-0 text-right font-mono text-[11px] tabular-nums ${done ? 'text-emerald-500' : 'text-ink-2'}`}>
        {done ? '✓ 完成' : `${value}%`}
      </span>
    </div>
  );
}

function IndeterminateBar() {
  return (
    <div className="flex items-center gap-3">
      <div data-anatomy="1" className="h-1.5 flex-1 overflow-hidden rounded-full bg-code-bg">
        <div
          data-anatomy="2"
          className="h-full w-1/4 rounded-full bg-accent"
          style={{ animation: 'demo-progress-loop calc(1.4s * var(--demo-speed, 1)) ease-in-out infinite' }}
        />
      </div>
      <span data-anatomy="3" className="w-16 shrink-0 text-right text-[11px] text-ink-3">处理中…</span>
    </div>
  );
}

function UploadDemo() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const start = () => {
    setValue(0);
    setRunning(true);
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setValue((v) => {
        const next = v + Math.floor(Math.random() * 14) + 4;
        if (next >= 100) {
          window.clearInterval(timer.current);
          setRunning(false);
          return 100;
        }
        return next;
      });
    }, 320);
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-line bg-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium">brand-assets.zip</p>
          <p className="text-[10px] text-ink-3">24.6 MB · 上传至 产品资料</p>
        </div>
        <button
          onClick={start}
          disabled={running}
          className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {running ? '上传中…' : value >= 100 ? '重新上传' : '开始上传'}
        </button>
      </div>
      <Bar value={value} done={value >= 100} />
      <div className="mt-4 border-t border-line pt-3">
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">不定进度 Indeterminate</p>
        <IndeterminateBar />
      </div>
    </div>
  );
}

const ProgressBarDemo: DemoComponent = ({ mode }) => {
  const keyframes = (
    <style>{`@keyframes demo-progress-loop { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }`}</style>
  );
  if (mode === 'loading') {
    return (
      <div className="w-full max-w-sm space-y-3 rounded-xl border border-line bg-raised p-4">
        {keyframes}
        <IndeterminateBar />
        <Bar value={68} done={false} />
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      {keyframes}
      <UploadDemo />
    </div>
  );
};

export default ProgressBarDemo;
