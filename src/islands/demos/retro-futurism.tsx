import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 复古未来主义 · Component × Style
 * 风格 demo 特例：暖色奶油橙棕 + 粗圆角机身感 + 轨道线/网格地平线。不使用站点主题令牌。
 */
const RetroFuturismDemo: DemoComponent = ({ mode }) => {
  const [launched, setLaunched] = useState(false);
  const [freq, setFreq] = useState('108.5');
  const dark = mode === 'dark';

  const mono = 'ui-monospace, "SF Mono", monospace';

  const casing: CSSProperties = {
    borderRadius: 22,
    background: dark
      ? 'linear-gradient(180deg, #2E2620 0%, #211B16 100%)'
      : 'linear-gradient(180deg, #F7EDD6 0%, #EBD9B4 100%)',
    boxShadow: dark
      ? 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -5px 10px rgba(0,0,0,0.5), 0 8px 18px rgba(0,0,0,0.5)'
      : 'inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -5px 9px rgba(120,70,30,0.25), 0 7px 16px rgba(90,50,20,0.28)',
    border: dark ? '1px solid #3E342B' : '1px solid rgba(140,95,45,0.5)',
  };

  if (mode === 'variants') {
    const items = [
      { label: '原子时代 / Atompunk', bg: 'linear-gradient(180deg, #F7EDD6, #EBD9B4)', ink: '#7A4322' },
      { label: '卡带未来 / Cassette', bg: 'linear-gradient(180deg, #E4DECB, #CFC7AE)', ink: '#4A4438' },
      { label: '合成器落日 / Synth', bg: 'linear-gradient(180deg, #F2B77E, #E8795A)', ink: '#5C2418' },
    ];
    return (
      <div style={{ background: '#20180F', padding: 20, borderRadius: 12 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 150,
                padding: 16,
                borderRadius: 20,
                background: v.bg,
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.75), inset 0 -5px 8px rgba(90,50,20,0.3), 0 6px 12px rgba(0,0,0,0.45)',
              }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: v.ink }}>{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden p-5"
      style={casing}
    >
      {/* 轨道线 + 行星 */}
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 130,
          height: 130,
          border: `1px solid ${dark ? '#5A4A38' : '#B98A55'}`,
          borderRadius: '50%',
          transform: 'rotate(-18deg) scaleY(0.82)',
        }}
      />
      <div style={{ position: 'absolute', right: 34, top: 26, width: 26, height: 26, borderRadius: '50%', background: dark ? '#E8965A' : '#E8965A', boxShadow: 'inset -3px -3px 0 rgba(120,60,20,0.4)' }} />

      <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', color: dark ? '#D8A25E' : '#8A4B2E' }}>
        ORBITAL ★ STATIONS
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em', color: dark ? '#F2E4C2' : '#4A2C14', lineHeight: 1.1 }}>
        Tomorrow, circa 1968
      </p>

      {/* 屏显输入：CRT 窗口 */}
      <div
        style={{
          background: dark ? '#161310' : '#2A2018',
          borderRadius: 10,
          padding: '8px 12px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.12)',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 10, color: '#FFB24D', fontFamily: mono, letterSpacing: '0.1em' }}>FREQ</span>
        <input
          value={freq}
          onChange={(e) => setFreq(e.target.value.replace(/[^\d.]/g, '').slice(0, 5))}
          style={{
            flex: 1,
            background: 'transparent',
            border: 0,
            outline: 'none',
            color: '#FFC46B',
            fontFamily: mono,
            fontSize: 15,
            fontWeight: 700,
            textShadow: '0 0 6px rgba(255,170,70,0.7)',
          }}
          aria-label="frequency"
        />
        <span style={{ fontSize: 10, color: '#FFB24D', fontFamily: mono }}>MHz</span>
      </div>

      {/* 大按钮 + 状态 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLaunched((v) => !v)}
          style={{
            border: 0,
            borderRadius: 999,
            padding: '11px 24px',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            color: '#FFF6E4',
            background: launched
              ? 'linear-gradient(180deg, #F0906A, #C4552F)'
              : 'linear-gradient(180deg, #6FB3C9 0%, #2F6E8C 100%)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -3px 5px rgba(0,0,0,0.35), 0 4px 8px rgba(70,40,15,0.4)',
            textShadow: '0 1px 1px rgba(0,0,0,0.3)',
          }}
        >
          {launched ? '★ LAUNCHED' : 'LAUNCH'}
        </button>
        <span style={{ fontSize: 11, fontFamily: mono, color: dark ? '#C9A468' : '#8A6438' }}>
          {launched ? 'T-minus 0 · godspeed' : 'status: standing by'}
        </span>
      </div>

      {/* 网格地平线 */}
      <div
        style={{
          marginTop: 14,
          height: 34,
          borderRadius: 8,
          background: `repeating-linear-gradient(0deg, ${dark ? 'rgba(230,160,90,0.3)' : 'rgba(61,122,153,0.4)'} 0 1px, transparent 1px 8px)`,
          borderTop: `1px solid ${dark ? '#E6A05A' : '#3D7A99'}`,
        }}
      />
    </div>
  );
};

export default RetroFuturismDemo;
