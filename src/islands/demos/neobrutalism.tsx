import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 新粗野主义 · Component × Style
 * 风格 demo 特例：直接内联该风格样式。三件套 = 粗黑边 + 偏移实心阴影 + 糖果撞色。
 */
const styles = `
  .nb-press {
    transition: transform calc(120ms * var(--demo-speed, 1)) ease,
      box-shadow calc(120ms * var(--demo-speed, 1)) ease;
  }
  .nb-press:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000 !important; }
  .nb-press:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #000 !important; }
  .nb-tilt:hover { transform: rotate(-2deg) translate(-2px, -2px); }
`;

const NeobrutalismDemo: DemoComponent = ({ mode }) => {
  const [likes, setLikes] = useState(128);
  const [name, setName] = useState('');
  const dark = mode === 'dark';

  const BLACK = '#000000';
  const border = `${BLACK} 3px solid`;

  const panel: CSSProperties = {
    background: dark ? '#1B1B2F' : '#FDF2D8',
    padding: '26px 28px',
    color: BLACK,
  };

  const nbBase: CSSProperties = {
    border,
    borderRadius: 12,
    boxShadow: `4px 4px 0 ${BLACK}`,
  };

  const card: CSSProperties = {
    ...nbBase,
    background: dark ? '#24243C' : '#FFFFFF',
    overflow: 'hidden',
    flex: '1 1 230px',
    minWidth: 230,
  };

  const btnPrimary: CSSProperties = {
    ...nbBase,
    background: '#FF5D5D',
    color: BLACK,
    fontWeight: 700,
    padding: '10px 18px',
    fontSize: 13,
    cursor: 'pointer',
    letterSpacing: '0.03em',
  };

  const btnYellow: CSSProperties = {
    ...btnPrimary,
    background: '#FFC900',
  };

  const inputStyle: CSSProperties = {
    ...nbBase,
    background: dark ? '#24243C' : '#FFFFFF',
    padding: '10px 12px',
    fontSize: 13,
    color: BLACK,
    width: '100%',
    outline: 'none',
    borderRadius: 10,
  };

  const badge: CSSProperties = {
    ...nbBase,
    background: '#4D9FFF',
    color: BLACK,
    fontWeight: 800,
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'inline-block',
    boxShadow: `2px 2px 0 ${BLACK}`,
  };

  if (mode === 'variants') {
    const variants = [
      { label: '经典硬阴影 / Classic', bg: '#FFFFFF', accent: '#FF5D5D', tilt: 0 },
      { label: '糖果色 / Candy', bg: '#FFB3E6', accent: '#B388FF', tilt: 2 },
      { label: '粗粝噪点 / Grunge', bg: '#D9D9D9', accent: '#FFC900', tilt: -3 },
    ];
    return (
      <div>
        <style>{styles}</style>
        <div className="flex flex-wrap justify-center gap-6">
          {variants.map((v) => (
            <div
              key={v.label}
              className="nb-press nb-tilt"
              style={{
                border,
                borderRadius: 12,
                boxShadow: `5px 5px 0 ${BLACK}`,
                background: v.bg,
                width: 158,
                padding: 14,
                transform: `rotate(${v.tilt}deg)`,
                color: BLACK,
              }}
            >
              <div
                style={{ background: v.accent, border: `2px solid ${BLACK}`, borderRadius: 8, height: 34, marginBottom: 10 }}
              />
              <p style={{ fontWeight: 800, fontSize: 13, margin: '0 0 4px' }}>{v.label}</p>
              <p style={{ fontSize: 11, margin: 0, fontFamily: 'monospace' }}>3px border + 0 blur</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-3">粗黑边 · 实心偏移阴影 · 撞色 / borders, hard shadows, clash</p>
      </div>
    );
  }

  return (
    <div style={panel}>
      <style>{styles}</style>
      <div className="flex flex-wrap items-start gap-6">
        {/* Card */}
        <div style={card}>
          <div
            style={{
              background: '#FF5D5D',
              borderBottom: `3px solid ${BLACK}`,
              padding: '14px 16px',
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            ⚡ STICKER CARD
          </div>
          <div style={{ padding: 16 }}>
            <span style={badge}>NEW</span>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: '12px 0 0', fontWeight: 500 }}>
              粗黑边 + 硬阴影，丑得理直气壮。
              <br />
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>bold, loud, zero blur.</span>
            </p>
          </div>
        </div>

        {/* Controls：Button + Input */}
        <div style={{ flex: '1 1 210px', minWidth: 210 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的代号 / YOUR NAME"
            style={inputStyle}
          />
          <div className="mt-5 flex flex-wrap gap-4">
            <button className="nb-press" style={btnPrimary} onClick={() => setLikes((n) => n + 1)}>
              👍 点赞 {likes}
            </button>
            <button className="nb-press" style={btnYellow}>
              订阅 / JOIN
            </button>
          </div>
          <p style={{ fontSize: 12, marginTop: 14, fontWeight: 600, fontFamily: 'monospace' }}>
            {name ? `HELLO, ${name.toUpperCase()}!` : 'box-shadow: 4px 4px 0 #000'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NeobrutalismDemo;
