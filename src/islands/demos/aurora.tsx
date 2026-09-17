import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 极光渐变 · Component × Style
 * 风格 demo 特例：多色模糊光斑漂移 + 极简前景。动画乘 var(--demo-speed, 1)。
 */
const AURORA_STYLES = `
  @keyframes aurora-drift {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); }
    50% { transform: translate(4%, -3%) scale(1.08) rotate(6deg); }
    100% { transform: translate(-3%, 3%) scale(0.97) rotate(-4deg); }
  }
  .aurora-blob { animation: aurora-drift calc(22s * var(--demo-speed, 1)) ease-in-out infinite alternate; }
  .aurora-blob-2 { animation-duration: calc(30s * var(--demo-speed, 1)); animation-delay: calc(-8s * var(--demo-speed, 1)); }
  @media (prefers-reduced-motion: reduce) {
    .aurora-blob, .aurora-blob-2 { animation: none; }
  }
`;

const AuroraGradientDemo: DemoComponent = ({ mode }) => {
  const [breathing, setBreathing] = useState(true);
  const dark = mode === 'dark';

  const ground = dark ? '#0B0E1A' : '#F6F7FB';
  const ink = dark ? '#EDF1FB' : '#1B2130';

  if (mode === 'variants') {
    const items = [
      { label: '静态网格 / Mesh', bg: 'radial-gradient(60% 60% at 30% 30%, #5EEAD4, transparent 70%), radial-gradient(60% 60% at 75% 45%, #818CF8, transparent 70%), radial-gradient(55% 55% at 50% 85%, #C084FC, transparent 70%)' },
      { label: '流动光斑 / Blobs', bg: 'radial-gradient(55% 55% at 35% 40%, #7DD3FC, transparent 70%), radial-gradient(55% 55% at 70% 60%, #A5B4FC, transparent 72%)' },
      { label: '暗夜极光 / Dark', bg: 'radial-gradient(50% 50% at 30% 35%, #14B8A6, transparent 70%), radial-gradient(55% 55% at 70% 50%, #7C3AED, transparent 72%), radial-gradient(45% 45% at 50% 85%, #2563EB, transparent 70%)' },
    ];
    return (
      <div style={{ background: '#0B0E1A', padding: 20, borderRadius: 12 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 150,
                height: 92,
                borderRadius: 14,
                background: v.bg,
                filter: 'blur(6px)',
                transform: 'scale(0.96)',
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-center" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)' }}>
          STATIC MESH · FLOWING BLOBS · DARK AURORA
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-xl p-5"
      style={{ background: ground }}
    >
      <style>{AURORA_STYLES}</style>

      {/* 极光光斑 */}
      <div
        className="aurora-blob pointer-events-none absolute"
        style={{
          left: '-15%',
          top: '-25%',
          width: '75%',
          height: '90%',
          background: dark ? '#14B8A6' : '#5EEAD4',
          opacity: dark ? 0.55 : 0.7,
          filter: 'blur(64px)',
          borderRadius: '50%',
        }}
      />
      <div
        className={`aurora-blob aurora-blob-2 pointer-events-none absolute ${breathing ? '' : 'opacity-60'}`}
        style={{
          right: '-18%',
          bottom: '-30%',
          width: '80%',
          height: '100%',
          background: dark ? '#7C3AED' : '#818CF8',
          opacity: dark ? 0.5 : 0.55,
          filter: 'blur(70px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '35%',
          bottom: '-35%',
          width: '45%',
          height: '70%',
          background: dark ? '#2563EB' : '#C084FC',
          opacity: dark ? 0.4 : 0.45,
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />

      {/* 极简前景：Button + Input + Card */}
      <div className="relative mx-auto max-w-xs py-2">
        <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: ink, letterSpacing: '-0.01em' }}>
          Aurora
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: ink, opacity: 0.6, lineHeight: 1.6 }}>
          色彩是主角，内容保持安静。<br />Color breathes; the content stays quiet.
        </p>

        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 8px 24px rgba(90,90,160,0.16)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)'}`,
          }}
        >
          <input
            placeholder="留下邮箱 / Email"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: ink,
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
              boxShadow: `inset 0 2px 5px ${dark ? 'rgba(0,0,0,0.4)' : 'rgba(100,100,170,0.18)'}`,
              marginBottom: 10,
            }}
          />
          <button
            onClick={() => setBreathing((v) => !v)}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              background: 'linear-gradient(100deg, #14B8A6 0%, #6366F1 55%, #A855F7 100%)',
              boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
              opacity: breathing ? 1 : 0.75,
              transition: 'opacity calc(200ms * var(--demo-speed, 1)) ease',
            }}
          >
            {breathing ? '✦ 呼吸中 / Breathing' : '光斑静止 / Still'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuroraGradientDemo;
