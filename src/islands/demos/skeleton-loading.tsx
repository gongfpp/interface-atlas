import type { DemoComponent } from '@/islands/DemoStage';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skeleton-demo-block rounded bg-ink-3/25 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(100deg, transparent 20%, color-mix(in srgb, currentColor 8%, transparent) 45%, transparent 70%)',
        backgroundSize: '200% 100%',
        animation: `skeleton-shimmer calc(1.6s * var(--demo-speed, 1)) ease-in-out infinite`,
      }}
    />
  );
}

const SkeletonDemo: DemoComponent = ({ mode }) => {
  const lines = [1, 2, 3];
  if (mode === 'loading') {
    return (
      <div className="flex gap-3">
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3.5 w-3/4" />
          {lines.map((i) => (
            <SkeletonBlock key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-3">
          <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3.5 w-3/4" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-5/6" />
          </div>
        </div>
      ))}
      <style>{`@keyframes skeleton-shimmer { 0% { background-position: 180% 0 } 100% { background-position: -80% 0 } }`}</style>
    </div>
  );
};

export default SkeletonDemo;
