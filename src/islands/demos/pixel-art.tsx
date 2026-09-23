import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const P = {
  ink: '#1A1C2C',
  purple: '#5D275D',
  red: '#B13E53',
  orange: '#EF7D57',
  yellow: '#FFCD75',
  green: '#A7F070',
  paper: '#F4F4F4',
};

/** 抖动网点：两色交替 4px 网格 */
const dither = (a: string, b: string) =>
  `repeating-conic-gradient(${a} 0% 25%, ${b} 0% 50%) 0 0 / 4px 4px`;

/**
 * 像素风 · Component × Style
 * 风格 demo 特例：硬像素边缘 + 有限色板 + 点阵感等宽字 + 抖动网点。圆角 0。不使用站点主题令牌。
 */
const PixelArtDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [coins, setCoins] = useState(3);
  const [name, setName] = useState('');
  const dark = mode === 'dark';

  const bg = dark ? P.ink : '#3B3B98';
  const card: CSSProperties = {
    background: dark ? '#29366F' : P.paper,
    border: `3px solid ${P.ink}`,
    borderRadius: 0,
    boxShadow: `4px 4px 0 ${P.ink}`,
    color: dark ? P.paper : P.ink,
    padding: 16,
  };

  const pxBtn: CSSProperties = {
    ...card,
    background: P.orange,
    color: P.ink,
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: '0.06em',
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    textTransform: 'uppercase',
  };

  const hearts = Array.from({ length: 5 }, (_, i) => i < coins);

  if (mode === 'variants') {
    const items = [
      { label: en ? '8-bit retro' : '8位复古', bg: P.red, dith: false },
      { label: en ? 'Modern pixel' : '现代像素', bg: P.green, dith: true },
      { label: en ? 'Isometric' : '等距像素', bg: P.yellow, dith: true },
    ];
    return (
      <div style={{ background: bg, padding: 22 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 148,
                padding: 14,
                background: v.dith ? undefined : v.bg,
                backgroundColor: v.dith ? undefined : v.bg,
                backgroundImage: v.dith ? dither(v.bg, P.ink) : undefined,
                border: `3px solid ${P.ink}`,
                boxShadow: `4px 4px 0 ${P.ink}`,
                borderRadius: 0,
              }}
            >
              <div
                style={{
                  height: 36,
                  backgroundImage: v.dith ? dither(P.paper, 'transparent') : undefined,
                  backgroundColor: v.dith ? undefined : P.paper,
                  border: `2px solid ${P.ink}`,
                  marginBottom: 10,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'ui-monospace, monospace',
                  color: P.ink,
                  textTransform: 'uppercase',
                }}
              >
                {v.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, padding: 24 }}>
      <div className="mx-auto max-w-md">
        <div style={card}>
          <div className="mb-3 flex items-center justify-between">
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.14em',
                fontFamily: 'ui-monospace, monospace',
                textTransform: 'uppercase',
              }}
            >
              {en ? 'PLAYER 1' : '玩家 1'}
            </p>
            <div style={{ display: 'flex', gap: 4 }} aria-label={en ? 'Health' : '生命值'}>
              {hearts.map((on, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    background: on ? P.red : 'transparent',
                    border: `2px solid ${on ? P.red : dark ? P.paper : P.ink}`,
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
          </div>

          <p
            style={{
              margin: '0 0 12px',
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.15,
              fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
              textShadow: `2px 2px 0 ${P.purple}`,
            }}
          >
            {en ? 'PIXEL QUEST' : '像素任务'}
          </p>

          {/* 抖动进度条 */}
          <div style={{ border: `3px solid ${dark ? P.paper : P.ink}`, height: 18, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, coins * 20)}%`, height: '100%', backgroundImage: dither(P.green, P.yellow) }} />
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 8))}
            placeholder={en ? 'HERO NAME' : '起个名字'}
            maxLength={8}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: dark ? P.ink : '#FFFFFF',
              color: dark ? P.green : P.ink,
              border: `3px solid ${dark ? P.paper : P.ink}`,
              borderRadius: 0,
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.12em',
              outline: 'none',
              marginBottom: 12,
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button style={pxBtn} onClick={() => setCoins((n) => Math.min(5, n + 1))}>
              {en ? 'INSERT COIN' : '投币'}
            </button>
            <button
              style={{ ...pxBtn, background: P.yellow }}
              onClick={() => setCoins(0)}
            >
              {en ? 'RESET' : '重来'}
            </button>
          </div>
          <p
            style={{
              margin: '12px 0 0',
              fontSize: 11,
              fontFamily: 'ui-monospace, monospace',
              opacity: 0.85,
            }}
          >
            {name ? `> ${name} READY` : '> image-rendering: pixelated'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PixelArtDemo;
