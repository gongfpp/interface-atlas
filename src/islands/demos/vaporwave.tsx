import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const chrome = 'linear-gradient(180deg, #fdf6ff 0%, #b967ff 35%, #01cdfe 52%, #ff71ce 70%, #f5d0fe 100%)';

/** 透视网格地平线 */
function GridHorizon({ color, fade }: { color: string; fade: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '46%',
        perspective: '200px',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-50%',
          right: '-50%',
          top: 0,
          height: '220%',
          transform: 'rotateX(72deg)',
          transformOrigin: 'top center',
          backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 44px), repeating-linear-gradient(0deg, ${color} 0 2px, transparent 2px 44px)`,
          backgroundSize: '44px 44px',
          maskImage: `linear-gradient(to bottom, transparent 0%, ${fade} 30%, #000 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, ${fade} 30%, #000 100%)`,
        }}
      />
    </div>
  );
}

/**
 * 蒸汽波 · Component × Style
 * 风格 demo 特例：霓虹粉紫青 + 网格地平线 + 镀铬字 + 棕榈剪影。不使用站点主题令牌。
 */
const VaporwaveDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [glitch, setGlitch] = useState(false);
  const [track, setTrack] = useState('');
  const [playing, setPlaying] = useState(false);
  const dark = mode === 'dark';

  const PINK = '#FF71CE';
  const CYAN = '#01CDFE';
  const VIOLET = '#B967FF';

  const bg = dark
    ? 'linear-gradient(180deg, #12002B 0%, #2B0F54 55%, #5B1E8C 100%)'
    : 'linear-gradient(180deg, #2B0F54 0%, #5B1E8C 45%, #FF71CE 100%)';

  const ink = '#FFE9FF';
  const sub = '#C9A0E8';

  const panel: CSSProperties = {
    background: 'rgba(255,113,206,0.12)',
    border: `1px solid ${CYAN}`,
    borderRadius: 6,
    boxShadow: `0 0 16px rgba(1,205,254,0.35)`,
    padding: 18,
  };

  const vpill: CSSProperties = {
    borderRadius: 999,
    border: `1px solid ${CYAN}`,
    background: 'transparent',
    color: CYAN,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.12em',
    padding: '10px 18px',
    cursor: 'pointer',
    textShadow: `0 0 8px ${CYAN}`,
    boxShadow: `0 0 12px rgba(1,205,254,0.35)`,
  };

  if (mode === 'variants') {
    const items = [
      { label: en ? 'Mall soft' : '商场软调', bg: 'linear-gradient(180deg,#F5D0FE,#B967FF)' },
      { label: en ? 'Neon glitch' : '霓虹故障', bg: 'linear-gradient(180deg,#2B0F54,#FF71CE)' },
      { label: en ? 'Chrome' : '全息镀铬', bg: chrome },
    ];
    return (
      <div style={{ background: dark ? '#12002B' : '#2B0F54', padding: 24, borderRadius: 10 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                width: 150,
                padding: 16,
                borderRadius: 8,
                background: v.bg,
                border: `1px solid rgba(1,205,254,0.6)`,
                boxShadow: '0 0 14px rgba(185,103,255,0.4)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#2B0F54',
                  textShadow: '0 1px 0 rgba(255,255,255,0.5)',
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
    <div style={{ position: 'relative', overflow: 'hidden', background: bg, padding: 28, borderRadius: 10, minHeight: 320 }}>
      <GridHorizon color="rgba(1,205,254,0.55)" fade="rgba(1,205,254,0.2)" />

      {/* 太阳 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: 36,
          width: 88,
          height: 88,
          marginLeft: -44,
          borderRadius: '50%',
          background: `linear-gradient(180deg, ${PINK}, ${VIOLET})`,
          opacity: 0.85,
          boxShadow: `0 0 40px ${PINK}`,
          maskImage: 'repeating-linear-gradient(#000 0 8px, transparent 8px 12px)',
          WebkitMaskImage: 'repeating-linear-gradient(#000 0 8px, transparent 8px 12px)',
        }}
      />

      {/* 棕榈剪影 */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', left: 12, bottom: 18, fontSize: 54, filter: 'grayscale(1) brightness(0.2)', opacity: 0.85, lineHeight: 1 }}
      >
        🌴
      </span>

      <div className="relative mx-auto max-w-md" style={{ paddingTop: 46 }}>
        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: '0.08em',
            background: chrome,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            textShadow: glitch ? '2px 0 #FF71CE, -2px 0 #01CDFE' : undefined,
            filter: 'drop-shadow(0 2px 0 rgba(10,0,48,0.8))',
          }}
        >
          MALL★95
        </p>
        <p style={{ margin: '2px 0 14px', fontSize: 11, letterSpacing: '0.28em', color: sub }}>
          {en ? 'SUNSET NEVER ENDS' : '消费主义的夏日永不落幕'}
        </p>

        <div style={panel}>
          <input
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            placeholder={en ? 'Track title…' : '点一首金曲…'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(10,0,48,0.55)',
              border: `1px solid ${PINK}`,
              borderRadius: 999,
              color: ink,
              padding: '10px 16px',
              fontSize: 12,
              outline: 'none',
              marginBottom: 12,
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button
              style={{ ...vpill, background: playing ? PINK : 'transparent', color: playing ? '#0A0030' : CYAN, borderColor: PINK, textShadow: playing ? 'none' : `0 0 8px ${CYAN}` }}
              onClick={() => setPlaying((v) => !v)}
            >
              {playing ? (en ? '■ STOP' : '■ 停') : en ? '▶ PLAY' : '▶ 播放'}
            </button>
            <button style={vpill} onClick={() => setGlitch((v) => !v)}>
              {glitch ? (en ? 'GLITCH ON' : '故障开') : en ? 'GLITCH OFF' : '故障关'}
            </button>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 11, color: ink, letterSpacing: '0.08em' }}>
            {playing && track
              ? `♪ ${track}`
              : glitch
                ? 'RGB OFFSET · SCANLINES 0.05'
                : en
                  ? 'grid horizon · chrome type'
                  : '网格地平线 · 镀铬大字'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VaporwaveDemo;
