import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 液态玻璃 · Component × Style
 * 风格 demo 特例：厚折射玻璃（低透明填充 + blur/saturate + 顶部镜面高光 + 底部暗边）。
 * 与玻璃拟态区分：那是薄磨砂一片雾，这是厚透镜。不使用站点主题令牌。
 */
function glassBase(dark: boolean, radius: number | string): CSSProperties {
  return {
    background: dark ? 'rgba(20,20,34,0.35)' : 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.55)'}`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,${dark ? 0.35 : 0.75}), inset 0 -1px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.18)`,
    borderRadius: radius,
  };
}

const LiquidGlassDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [shape, setShape] = useState<'sheet' | 'capsule' | 'full'>('sheet');
  const [level, setLevel] = useState(2);
  const dark = mode === 'dark';

  const bg = dark
    ? 'linear-gradient(150deg, #1a0b2e 0%, #3d1a6e 45%, #0d3a5c 100%)'
    : 'linear-gradient(150deg, #FF9A8B 0%, #A18CD1 45%, #6DD5FA 100%)';

  const ink = '#FFFFFF';
  const inkSoft = 'rgba(255,255,255,0.78)';

  // 底层彩色斑块，让折射可感知
  const blobs = (
    <>
      <div style={{ position: 'absolute', left: '8%', top: '12%', width: 110, height: 110, borderRadius: '50%', background: dark ? '#FF71CE' : '#FAD141', opacity: 0.7 }} />
      <div style={{ position: 'absolute', right: '10%', bottom: '14%', width: 90, height: 90, borderRadius: '50%', background: dark ? '#01CDFE' : '#FF6B6B', opacity: 0.65 }} />
      <div style={{ position: 'absolute', left: '40%', bottom: '8%', width: 70, height: 70, borderRadius: 18, background: dark ? '#B967FF' : '#14C88C', opacity: 0.55, transform: 'rotate(18deg)' }} />
    </>
  );

  if (mode === 'variants') {
    const items = [
      { label: en ? 'Sheet lens' : '片状透镜', r: 22, w: 150, h: 110 },
      { label: en ? 'Capsule' : '胶囊按钮', r: 999, w: 150, h: 56 },
      { label: en ? 'Full panel' : '全幅面板', r: 18, w: 150, h: 130 },
    ];
    return (
      <div style={{ position: 'relative', overflow: 'hidden', background: bg, padding: 28, borderRadius: 14 }}>
        {blobs}
        <div className="relative flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                ...glassBase(dark, v.r),
                width: v.w,
                height: v.h,
                display: 'flex',
                alignItems: 'flex-end',
                padding: 12,
                boxSizing: 'border-box',
              }}
            >
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: ink }}>{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const radius = shape === 'capsule' ? 999 : shape === 'full' ? 18 : 22;
  const pad = shape === 'capsule' ? '14px 22px' : shape === 'full' ? '22px 22px' : '18px 20px';

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: bg, padding: 28, borderRadius: 14, minHeight: 300 }}>
      {blobs}

      <div className="relative mx-auto max-w-md">
        <div style={{ ...glassBase(dark, radius), padding: pad, color: ink }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: inkSoft }}>
            LIQUID GLASS / 液态玻璃
          </p>
          <p style={{ margin: '8px 0 6px', fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>
            {shape === 'capsule'
              ? en ? 'Capsule control' : '胶囊控制件'
              : shape === 'full'
                ? en ? 'Full functional layer' : '全幅功能层'
                : en ? 'Thick refractive lens' : '厚折射透镜'}
          </p>
          {shape !== 'capsule' && (
            <p style={{ margin: '0 0 14px', fontSize: 12, lineHeight: 1.7, color: inkSoft }}>
              {en
                ? 'Speculars on top, dark edge below. Not a thin blur veil.'
                : '顶部镜面高光，底部暗边。不是薄磨砂一片雾。'}
            </p>
          )}

          {shape !== 'capsule' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: inkSoft }}>{en ? 'Depth' : '厚度'}</span>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setLevel(n)}
                  aria-pressed={level === n}
                  style={{
                    ...glassBase(dark, 999),
                    width: 34,
                    height: 26,
                    cursor: 'pointer',
                    color: ink,
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${level === n ? 'rgba(255,255,255,0.9)' : dark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.55)'}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              style={{
                ...glassBase(dark, 999),
                color: ink,
                fontSize: 13,
                fontWeight: 600,
                padding: '11px 20px',
                cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.28)',
              }}
              onClick={() => setShape((s) => (s === 'sheet' ? 'capsule' : s === 'capsule' ? 'full' : 'sheet'))}
            >
              {en ? 'Morph shape' : '切换形态'}
            </button>
            <button
              style={{
                ...glassBase(dark, 999),
                color: inkSoft,
                fontSize: 13,
                fontWeight: 600,
                padding: '11px 18px',
                cursor: 'pointer',
                background: 'transparent',
              }}
            >
              {en ? `Layer ${level}` : `第 ${level} 层`}
            </button>
          </div>
        </div>

        <p style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)' }}>
          REFRACT · REFLECT · MORPH
        </p>
      </div>
    </div>
  );
};

export default LiquidGlassDemo;
