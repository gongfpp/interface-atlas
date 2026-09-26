import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';
/** 涂鸦形状（SVG 波浪线）——模块级组件，避免渲染期创建组件 */
function Squiggle({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 12" width="52" height="11" style={{ position: 'absolute', ...style }}>
      <path d="M1 8 Q8 1 15 8 T29 8 T43 8 T57 8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}


/**
 * 孟菲斯风格 · Component × Style
 * 风格 demo 特例：黑白波点底 + 高饱和撞色 + 黑描边偏移阴影 + 涂鸦点缀。不使用站点主题令牌。
 */
const MemphisDemo: DemoComponent = ({ mode }) => {
  const [party, setParty] = useState(false);
  const [note, setNote] = useState('');
  const dark = mode === 'dark';

  const BLACK = '#111111';
  const ground = dark ? '#14143C' : '#FFF6E9';
  const dot = dark ? 'rgba(255,255,255,0.35)' : '#111111';


  if (mode === 'variants') {
    const items = [
      { label: '经典 / Classic', bg: '#FFD53D', dots: false },
      { label: '水磨石 / Terrazzo', bg: '#FF6B6B', dots: true },
      { label: '新孟菲斯 / Neo', bg: '#4D96FF', dots: false },
    ];
    return (
      <div style={{ background: dark ? '#14143C' : '#FFF6E9', padding: 20, borderRadius: 10 }}>
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 150,
                padding: 16,
                background: v.bg,
                border: `3px solid ${BLACK}`,
                borderRadius: 12,
                boxShadow: `5px 5px 0 ${BLACK}`,
                backgroundImage: v.dots
                  ? 'radial-gradient(rgba(255,255,255,0.7) 2.5px, transparent 2.5px)'
                  : undefined,
                backgroundSize: v.dots ? '16px 16px' : undefined,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: BLACK }}>{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-xl p-5"
      style={{
        background: ground,
        backgroundImage: `radial-gradient(${dot} 2.5px, transparent 2.5px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* 涂鸦点缀 */}
      <Squiggle color="#FF6B6B" style={{ right: 14, top: 12 }} />
      <Squiggle color="#4D96FF" style={{ left: 10, bottom: 10 }} />
      <div style={{ position: 'absolute', right: 46, bottom: 16, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '16px solid #FFD53D', transform: 'rotate(-14deg)' }} />

      {/* 撞色卡片 */}
      <div
        style={{
          background: party ? '#B388FF' : '#FF6B6B',
          border: `3px solid ${BLACK}`,
          borderRadius: 12,
          boxShadow: `6px 6px 0 ${BLACK}`,
          padding: '16px 16px 14px',
          transform: party ? 'rotate(-1.2deg)' : 'none',
          transition: 'transform calc(180ms * var(--demo-speed, 1)) ease, background-color calc(180ms * var(--demo-speed, 1)) ease',
        }}
      >
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: BLACK }}>
          MEMPHIS ★ MILANO 1981
        </p>
        <p style={{ margin: '6px 0 12px', fontSize: 17, fontWeight: 900, lineHeight: 1.25, color: BLACK }}>
          热闹是一种态度<br />Ugly is a feature!
        </p>

        {/* Button + Input */}
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="说点什么 / SAY SOMETHING"
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: `2.5px solid ${BLACK}`,
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 12,
            fontWeight: 700,
            color: BLACK,
            boxShadow: `3px 3px 0 ${BLACK}`,
            marginBottom: 12,
          }}
        />
        <button
          onClick={() => setParty((v) => !v)}
          style={{
            border: `3px solid ${BLACK}`,
            borderRadius: 999,
            background: party ? '#FFD53D' : '#4D96FF',
            color: BLACK,
            fontSize: 13,
            fontWeight: 900,
            padding: '9px 22px',
            cursor: 'pointer',
            boxShadow: `4px 4px 0 ${BLACK}`,
            transition: 'background-color calc(150ms * var(--demo-speed, 1)) ease',
          }}
        >
          {party ? '★ PARTY ON' : 'PARTY!'}
        </button>
      </div>
    </div>
  );
};

export default MemphisDemo;
