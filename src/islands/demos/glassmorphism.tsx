import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 玻璃拟态 Component × Style 展示：同屏 Button + Input + Card。
 * 用内联样式呈现该风格本身（不使用站点主题令牌），深底 + 彩色光斑让半透明玻璃可见。
 */
const GlassmorphismDemo: DemoComponent = ({ mode }) => {
  const dark = mode === 'dark';
  const bg = dark
    ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #7dd3fc 0%, #c4b5fd 45%, #f9a8d4 100%)';
  const glass: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(16px) saturate(160%)',
    WebkitBackdropFilter: 'blur(16px) saturate(160%)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.65)'}`,
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
    borderRadius: 16,
  };
  const ink = dark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.85)';
  const inkSoft = dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)';

  return (
    <div
      className="relative overflow-hidden rounded-xl p-6"
      style={{ background: bg }}
    >
      {/* 彩色光斑，让 blur 可感知 */}
      <div className="absolute -left-4 top-2 h-24 w-24 rounded-full" style={{ background: dark ? '#f472b6' : '#fde047', opacity: 0.55, filter: 'blur(4px)' }} />
      <div className="absolute right-6 bottom-2 h-20 w-20 rounded-full" style={{ background: dark ? '#22d3ee' : '#34d399', opacity: 0.5, filter: 'blur(4px)' }} />

      <div className="relative mx-auto grid max-w-md gap-4">
        <div style={glass} className="p-5">
          <p style={{ color: ink, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>登录 / Sign in</p>
          <input
            placeholder="you@example.com"
            className="mb-2 w-full px-3 py-2 text-sm outline-none"
            style={{ ...glass, borderRadius: 10, color: ink, border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)'}` }}
          />
          <input
            type="password"
            placeholder="••••••••"
            className="mb-3 w-full px-3 py-2 text-sm outline-none"
            style={{ ...glass, borderRadius: 10, color: ink, border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)'}` }}
          />
          <button
            className="w-full py-2 text-sm font-medium transition-transform active:scale-[0.97]"
            style={{
              background: dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.8)'}`,
              borderRadius: 10,
              color: ink,
            }}
          >
            继续 / Continue
          </button>
        </div>
        <div style={glass} className="flex items-center gap-3 p-4">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.6)' }} />
          <div>
            <p style={{ color: ink, fontSize: 13, fontWeight: 500 }}>毛玻璃卡片 / Glass card</p>
            <p style={{ color: inkSoft, fontSize: 11 }}>backdrop-filter: blur(16px)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismDemo;
