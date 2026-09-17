import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 黏土风 · Component × Style
 * 风格 demo 特例：粉彩底 + 大圆角 + 三重阴影（外投影带色/内下压/内上高光）。不使用站点主题令牌。
 */
const ClaymorphismDemo: DemoComponent = ({ mode }) => {
  const [pressed, setPressed] = useState(false);
  const [name, setName] = useState('');
  const dark = mode === 'dark';

  // 深色黏土：深灰底 + 更深一号同色投影
  const ground = dark ? '#23252E' : '#EAF0FF';
  const ink = dark ? '#E8EAF2' : '#232A3D';
  const PRIMARY = '#6C8CFF';
  const drop = (alpha: number, y: number, blur: number) =>
    dark ? `0 ${y}px ${blur}px rgba(0,0,0,${alpha})` : `0 ${y}px ${blur}px rgba(108,140,255,${alpha})`;

  const clay = (state: 'idle' | 'in' = 'idle'): CSSProperties => ({
    borderRadius: 20,
    background: PRIMARY,
    color: '#FFFFFF',
    border: 'none',
    boxShadow:
      state === 'in'
        ? `${drop(0.45, 5, 10)}, inset 0 -3px 8px rgba(30,50,150,0.4), inset 0 4px 8px rgba(0,0,0,0.18)`
        : `${drop(0.4, 14, 26)}, inset 0 -7px 14px rgba(30,50,150,0.35), inset 0 3px 7px rgba(255,255,255,0.55)`,
    transition: 'box-shadow calc(160ms * var(--demo-speed, 1)) ease, transform calc(160ms * var(--demo-speed, 1)) ease',
    transform: state === 'in' ? 'scale(0.97)' : 'none',
  });

  const clayCard: CSSProperties = {
    borderRadius: 24,
    background: dark ? '#2C2F3A' : '#FFFFFF',
    boxShadow: `${drop(0.35, 16, 30)}, inset 0 -8px 16px ${dark ? 'rgba(0,0,0,0.4)' : 'rgba(108,140,255,0.12)'}, inset 0 3px 6px ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)'}`,
    border: dark ? '1px solid #3A3E4C' : 'none',
  };

  const clayInput: CSSProperties = {
    width: '100%',
    borderRadius: 16,
    border: 'none',
    outline: 'none',
    padding: '11px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: ink,
    background: dark ? '#23252E' : '#E4EBFF',
    boxShadow: `inset 0 4px 8px ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(108,140,255,0.25)'}, inset 0 -1px 0 ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)'}`,
    marginBottom: 12,
  };

  if (mode === 'variants') {
    const items = [
      { label: '软黏土 / Soft', bg: '#6C8CFF', tint: 'rgba(108,140,255,0.4)' },
      { label: '糖果黏土 / Candy', bg: '#FF7EB6', tint: 'rgba(255,126,182,0.4)' },
      { label: '深色黏土 / Dark', bg: '#3A3E4C', tint: 'rgba(0,0,0,0.5)' },
    ];
    return (
      <div style={{ background: dark ? '#23252E' : '#EAF0FF', padding: 20, borderRadius: 12 }}>
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 146,
                padding: 18,
                borderRadius: 24,
                background: v.bg,
                color: '#fff',
                boxShadow: `0 16px 28px ${v.tint}, inset 0 -8px 14px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.5)`,
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-5" style={{ background: ground, borderRadius: 20 }}>
      {/* 黏土卡片 */}
      <div style={clayCard} className="p-5">
        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: ink }}>
          软乎乎的控制台 / Squish Console
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="捏个名字 / Your name"
          style={clayInput}
        />
        <div className="flex items-center gap-3">
          <button
            style={{ ...clay(pressed ? 'in' : 'idle'), padding: '12px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={() => setName(name.toUpperCase())}
          >
            捏一下 / SQUEEZE
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: ink, opacity: 0.65 }}>
            {name ? `${name} ✓` : 'inset + drop shadow'}
          </span>
        </div>
      </div>

      {/* 黏土徽章行 */}
      <div className="mt-4 flex flex-wrap gap-3">
        {['COOL', 'SOFT', 'PUFFY'].map((t) => (
          <span
            key={t}
            style={{
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 11,
              fontWeight: 800,
              color: '#FFFFFF',
              background: '#FF9F7A',
              boxShadow: `0 8px 16px rgba(255,159,122,0.45), inset 0 -4px 8px rgba(180,80,40,0.35), inset 0 2px 5px rgba(255,255,255,0.6)`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ClaymorphismDemo;
