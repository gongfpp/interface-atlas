import type { DemoComponent } from '@/islands/DemoStage';

const LoadingSpinnerDemo: DemoComponent = ({ mode }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="flex flex-wrap items-end justify-center gap-8">
      <div className="text-center">
        <div
          className="mx-auto h-9 w-9 rounded-full border-[3.5px] border-line"
          style={{ borderTopColor: 'var(--color-accent)', animation: 'spin calc(0.9s * var(--demo-speed, 1)) linear infinite' }}
        />
        <p className="mt-2 text-[10px] text-ink-3">ring / 圆环</p>
      </div>
      <div className="text-center">
        <div className="mx-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-accent"
              style={{ animation: `spinner-bounce calc(1s * var(--demo-speed, 1)) ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-3">dots / 三点</p>
      </div>
      {mode === 'variants' && (
        <div className="text-center">
          <div
            className="mx-auto h-9 w-9 rounded-full border-[3px] border-dashed border-accent"
            style={{ animation: 'spin calc(1.4s * var(--demo-speed, 1)) linear infinite' }}
          />
          <p className="mt-2 text-[10px] text-ink-3">dashed / 虚线</p>
        </div>
      )}
    </div>
    <p className="text-xs text-ink-3">适合瞬时等待（&lt; 1s）；结构化内容请用骨架屏</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }
@keyframes spinner-bounce { 0%,80%,100% { transform: scale(.6); opacity:.4 } 40% { transform: scale(1); opacity:1 } }`}</style>
  </div>
);

export default LoadingSpinnerDemo;
