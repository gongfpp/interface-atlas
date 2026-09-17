import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * Y2K 千禧美学 · Component × Style
 * 风格 demo 特例：镀铬渐变 + 糖果半透明塑料 + 闪光星形。不使用站点主题令牌。
 */
const Y2KDemo: DemoComponent = ({ mode }) => {
  const [shiny, setShiny] = useState(false);
  const [handle, setHandle] = useState('');
  const dark = mode === 'dark';

  const chrome = 'linear-gradient(180deg, #fdfdfd 0%, #b9bac1 38%, #ffffff 50%, #83848c 62%, #e6e6ea 100%)';

  if (mode === 'variants') {
    const items = [
      { label: '糖果塑料 / Candy', bg: 'linear-gradient(180deg, #8ff0c0 0%, #3ecf8e 60%, #b8ffe3 100%)' },
      { label: '镀铬金属 / Chrome', bg: chrome },
      { label: '珠光幻彩 / Iridescent', bg: 'linear-gradient(135deg, #ffd1ec 0%, #c9b8ff 30%, #a8e8ff 55%, #fff7b8 80%, #ffb8f0 100%)' },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-6" style={{ background: '#231433', padding: 20, borderRadius: 12 }}>
        {items.map((v) => (
          <div
            key={v.label}
            style={{
              width: 148,
              padding: 16,
              borderRadius: 20,
              background: v.bg,
              boxShadow: 'inset 0 10px 16px rgba(255,255,255,0.65), inset 0 -8px 14px rgba(40,20,80,0.28), 0 6px 14px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3a1f5c', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>{v.label}</span>
          </div>
        ))}
      </div>
    );
  }

  const sparkle: CSSProperties = {
    position: 'absolute',
    fontSize: 14,
    color: '#ffe98a',
    textShadow: '0 0 6px rgba(255,235,140,0.9)',
    pointerEvents: 'none',
  };

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-2xl p-5"
      style={{
        background: dark
          ? 'linear-gradient(150deg, #2b1b4d 0%, #4a1f6e 55%, #1d1440 100%)'
          : 'linear-gradient(150deg, #FFC8F0 0%, #C8B8FF 50%, #A8D8FF 100%)',
      }}
    >
      <span style={{ ...sparkle, left: 16, top: 12 }}>✦</span>
      <span style={{ ...sparkle, right: 22, top: 34, fontSize: 10 }}>✦</span>

      {/* 糖果卡片 */}
      <div
        style={{
          borderRadius: 22,
          padding: '18px 16px',
          background: dark ? 'linear-gradient(180deg, rgba(255,190,240,0.34), rgba(150,190,255,0.26))' : 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))',
          boxShadow: 'inset 0 10px 16px rgba(255,255,255,0.7), inset 0 -8px 14px rgba(90,40,160,0.22), 0 8px 18px rgba(60,20,120,0.25)',
          border: '1px solid rgba(255,255,255,0.75)',
        }}
      >
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.01em',
            background: chrome,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            filter: dark ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' : 'drop-shadow(0 1px 1px rgba(255,255,255,0.9))',
          }}
        >
          CYBER★PRINCESS
        </p>
        <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: dark ? '#e6d6ff' : '#7a3fa8', letterSpacing: '0.14em' }}>
          ☆ MILLENNIUM EDITION 2001 ☆
        </p>

        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="your.handle@2001"
          style={{
            width: '100%',
            border: '1px solid rgba(255,255,255,0.85)',
            borderRadius: 999,
            padding: '9px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: '#4a2170',
            background: 'rgba(255,255,255,0.72)',
            boxShadow: 'inset 0 6px 10px rgba(120,80,200,0.18)',
            outline: 'none',
            marginBottom: 10,
          }}
        />
        <button
          onClick={() => setShiny((v) => !v)}
          style={{
            width: '100%',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            color: '#3a1f5c',
            background: shiny ? chrome : 'linear-gradient(180deg, #9ff3ff 0%, #38b6e8 55%, #baf0ff 100%)',
            boxShadow: 'inset 0 12px 16px rgba(255,255,255,0.8), inset 0 -8px 12px rgba(0,70,130,0.3), 0 5px 10px rgba(40,10,90,0.35)',
            textShadow: '0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          {shiny ? '★ CHROME ON ★' : 'GO SHINY ✧'}
        </button>
      </div>

      <p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(70,30,110,0.6)', letterSpacing: '0.2em' }}>
        {handle ? `WELCOME, ${handle.toUpperCase()} ☆` : 'CHROME · CANDY · SPARKLE'}
      </p>
    </div>
  );
};

export default Y2KDemo;
