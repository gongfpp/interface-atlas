import type { FC } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const LOGOS = ['Acme', 'Nimbus', 'Vertex', 'Orbit', 'Polaris', 'Quanta'];

const Strip: FC<{ reverse?: boolean; duration: number }> = ({ reverse, duration }) => (
  <div className="overflow-hidden border-y border-line py-2.5" style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
    <div
      className="flex w-max items-center gap-10 pr-10"
      style={{
        animation: `marquee calc(${duration}s * var(--demo-speed, 1)) linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {[...LOGOS, ...LOGOS].map((logo, i) => (
        <span key={i} className="whitespace-nowrap font-serif text-sm font-semibold text-ink-3">
          {logo}
        </span>
      ))}
    </div>
  </div>
);

const MarqueeDemo: DemoComponent = ({ mode }) => (
  <div className="flex w-full flex-col items-center gap-4">
    <div className="w-full max-w-md">
      <Strip duration={18} reverse={mode === 'variants'} />
      {mode === 'variants' && <div className="mt-2"><Strip duration={24} /></div>}
    </div>
    <p className="text-xs text-ink-3">内容复制两份位移 -50% 无缝循环，匀速不缓动</p>
    <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
  </div>
);

export default MarqueeDemo;
