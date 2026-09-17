import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 包豪斯 · Component × Style
 * 风格 demo 特例：圆/三角/方 × 红黄蓝黑 的几何构成。不使用站点主题令牌。
 */
const BauhausDemo: DemoComponent = ({ mode }) => {
  const [picked, setPicked] = useState<'red' | 'blue'>('red');
  const [name, setName] = useState('');
  const dark = mode === 'dark';

  const RED = '#D93025';
  const BLUE = '#1D4ED8';
  const YELLOW = '#F2B705';
  const BLACK = '#111111';
  const cream = dark ? '#171512' : '#F4EFE6';

  if (mode === 'variants') {
    const items = [
      { label: '魏玛 / Weimar', shape: 'circle', color: RED, warm: YELLOW },
      { label: '德绍 / Dessau', shape: 'triangle', color: YELLOW, warm: BLUE },
      { label: '当代 / Contemporary', shape: 'square', color: BLUE, warm: RED },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-6" style={{ background: cream, padding: 20, borderRadius: 8 }}>
        {items.map((v) => (
          <div key={v.label} style={{ width: 150, position: 'relative', height: 120, overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: 10,
                width: 64,
                height: 64,
                background: v.color,
                ...(v.shape === 'circle'
                  ? { borderRadius: '50%' }
                  : v.shape === 'triangle'
                    ? { clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }
                    : {}),
              }}
            />
            <div style={{ position: 'absolute', right: 10, bottom: 26, width: 34, height: 34, background: v.warm, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 3, background: BLACK }} />
            <p style={{ position: 'absolute', left: 0, bottom: 8, margin: 0, fontSize: 12, fontWeight: 800, color: BLACK, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {v.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-md p-5"
      style={{ background: cream, position: 'relative', overflow: 'hidden' }}
    >
      {/* 构成：大红圆 + 黄三角 + 蓝方 + 黑线 */}
      <div style={{ position: 'relative', height: 120, marginBottom: 14 }}>
        <div style={{ position: 'absolute', left: -18, top: -14, width: 110, height: 110, borderRadius: '50%', background: picked === 'red' ? RED : BLUE }} />
        <div style={{ position: 'absolute', right: 42, top: 8, width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderBottom: `46px solid ${YELLOW}` }} />
        <div style={{ position: 'absolute', right: 0, bottom: 6, width: 34, height: 34, background: picked === 'red' ? BLUE : RED }} />
        <div style={{ position: 'absolute', left: 78, top: 0, width: 2, height: 104, background: BLACK }} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 3, background: BLACK }} />
        <p style={{ position: 'absolute', left: 92, top: 14, margin: 0, fontSize: 24, fontWeight: 900, lineHeight: 1.05, color: BLACK, letterSpacing: '-0.01em' }}>
          FORM &<br />FUNKTION
        </p>
      </div>

      {/* Button + Input：几何色块 */}
      <div className="flex items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NAME"
          style={{
            flex: 1,
            border: 0,
            borderBottom: `2px solid ${BLACK}`,
            borderRadius: 0,
            background: 'transparent',
            color: BLACK,
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 2px',
            outline: 'none',
            letterSpacing: '0.06em',
          }}
        />
        <button
          onClick={() => setPicked((p) => (p === 'red' ? 'blue' : 'red'))}
          style={{
            border: 0,
            borderRadius: 0,
            background: BLACK,
            color: '#fff',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.1em',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          SWAP
        </button>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 11, fontWeight: 700, color: BLACK, letterSpacing: '0.08em' }}>
        {name ? `HALLO, ${name.toUpperCase()} — KREIS × DREIECK × QUADRAT` : 'KREIS × DREIECK × QUADRAT'}
      </p>
    </div>
  );
};

export default BauhausDemo;
