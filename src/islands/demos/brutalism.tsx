import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 粗野主义 · Component × Style
 * 风格 demo 特例：黑白硬切 + 单一刺眼强调色 + 超大字 + 可见网格。圆角一律 0。不使用站点主题令牌。
 */
const gridBg =
  'repeating-linear-gradient(to right, rgba(10,10,10,0.08) 0 1px, transparent 1px 40px), repeating-linear-gradient(to bottom, rgba(10,10,10,0.08) 0 1px, transparent 1px 40px)';

const BrutalismDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [soft, setSoft] = useState(false);
  const [hits, setHits] = useState(0);
  const [sig, setSig] = useState('');
  const dark = mode === 'dark';

  const bg = dark ? '#0A0A0A' : '#F5F5F0';
  const ink = dark ? '#F5F5F0' : '#0A0A0A';
  const ACCENT = '#FF3B00';
  const radius = soft ? 12 : 0;

  const block: CSSProperties = {
    background: dark ? '#141414' : '#FFFFFF',
    border: `2px solid ${ink}`,
    borderRadius: radius,
    color: ink,
  };

  const btn: CSSProperties = {
    ...block,
    background: ACCENT,
    borderColor: ACCENT,
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: '0.04em',
    padding: '10px 18px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  };

  const btnGhost: CSSProperties = {
    ...btn,
    background: 'transparent',
    borderColor: ink,
    color: ink,
  };

  if (mode === 'variants') {
    const items = [
      { label: en ? 'Classic' : '经典粗野', note: 'radius 0', r: 0, accent: true },
      { label: en ? 'Soft' : '软粗野', note: 'radius 12', r: 12, accent: true },
      { label: en ? 'Typographic' : '排印粗野', note: 'type only', r: 0, accent: false },
    ];
    return (
      <div style={{ background: bg, backgroundImage: gridBg, padding: 24 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                ...block,
                borderRadius: v.r,
                width: 150,
                padding: 14,
                background: dark ? '#141414' : '#FFFFFF',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: v.accent ? 22 : 30,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: v.accent ? ACCENT : ink,
                  textTransform: 'uppercase',
                }}
              >
                {v.accent ? 'Aa' : 'TYPE'}
              </p>
              <p style={{ margin: '12px 0 2px', fontSize: 12, fontWeight: 800 }}>{v.label}</p>
              <p style={{ margin: 0, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.7 }}>
                {v.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, backgroundImage: gridBg, padding: '28px 24px' }}>
      <div className="mx-auto max-w-md">
        <p
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 10,
            letterSpacing: '0.22em',
            color: ACCENT,
          }}
        >
          RAW.STUDIO / EST. 1994
        </p>
        <h3
          style={{
            margin: '6px 0 4px',
            fontSize: soft ? 36 : 44,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: ink,
          }}
        >
          {en ? 'NO RADIUS' : '不修边幅'}
          <br />
          <span style={{ color: ACCENT }}>{en ? 'NO MERCY.' : '也是一种设计'}</span>
        </h3>
        <p style={{ margin: '8px 0 18px', fontSize: 12, lineHeight: 1.7, color: dark ? '#BBBBBB' : '#333333', maxWidth: 320 }}>
          {en
            ? 'Raw structure. Oversized type. One harsh accent.'
            : '裸露结构。超大字号。一个刺眼强调色。'}
        </p>

        <div style={{ ...block, padding: 16, marginBottom: 14 }}>
          <input
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            placeholder={en ? 'YOUR NAME' : '写下你的名字'}
            style={{
              width: '100%',
              background: 'transparent',
              border: `2px solid ${ink}`,
              borderRadius: radius,
              color: ink,
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'ui-monospace, monospace',
              outline: 'none',
              marginBottom: 12,
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button style={btn} onClick={() => setHits((n) => n + 1)}>
              {en ? `HIT ${hits}` : `拍一下 ${hits}`}
            </button>
            <button style={btnGhost} onClick={() => setSoft((v) => !v)}>
              {soft ? (en ? 'GO RAW' : '回到硬切') : en ? 'GO SOFT' : '试试软粗野'}
            </button>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            color: ink,
            textTransform: 'uppercase',
          }}
        >
          {sig ? `HELLO, ${sig.toUpperCase()}` : 'border-radius: 0 // grid visible'}
        </p>
      </div>
    </div>
  );
};

export default BrutalismDemo;
