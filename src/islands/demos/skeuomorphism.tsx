import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 拟物化 · Component × Style
 * 风格 demo 特例：内联材质渐变 + 内高光 + 投影，做出实体按压感。不使用站点主题令牌。
 */
const SkeuomorphismDemo: DemoComponent = ({ mode }) => {
  const [power, setPower] = useState(true);
  const [volume, setVolume] = useState('7');
  const dark = mode === 'dark';

  const panelBg = dark
    ? 'linear-gradient(160deg, #3a3128 0%, #241d16 60%, #2e261d 100%)'
    : 'linear-gradient(160deg, #6b5233 0%, #4a3820 55%, #5a4429 100%)';

  // 实体感三要素：窄渐变 + 顶部内高光 + 底部投影
  const knob: CSSProperties = {
    background: 'linear-gradient(#fdfbf5, #cfc7b4 45%, #a89e88)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.25), 0 3px 5px rgba(0,0,0,0.45)',
    border: '1px solid rgba(60,45,25,0.7)',
    borderRadius: 9,
    color: '#3a2c18',
    textShadow: '0 1px 0 rgba(255,255,255,0.7)',
  };

  const pressed = (on: boolean): CSSProperties => ({
    ...knob,
    background: on
      ? 'linear-gradient(#e2d9c4, #b3a88e)'
      : 'linear-gradient(#fdfbf5, #cfc7b4 45%, #a89e88)',
    boxShadow: on
      ? 'inset 0 2px 5px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.25)'
      : knob.boxShadow,
    transform: on ? 'translateY(1px)' : 'none',
  });

  const insetWell: CSSProperties = {
    background: 'linear-gradient(#2c2214, #1c150b)',
    boxShadow:
      'inset 0 2px 5px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.15)',
    border: '1px solid rgba(0,0,0,0.6)',
    borderRadius: 8,
    color: '#ffd98a',
    fontFamily: 'ui-monospace, monospace',
    textShadow: '0 0 4px rgba(255,190,80,0.6)',
  };

  if (mode === 'variants') {
    const items = [
      { label: '皮革 / Leather', bg: 'linear-gradient(160deg, #7a5a38 0%, #54381e 100%)', stitch: 'rgba(240,220,180,0.75)' },
      { label: '拉丝金属 / Metal', bg: 'linear-gradient(180deg, #e8e8ea 0%, #9fa1a6 48%, #d6d7da 55%, #8e9094 100%)', stitch: 'rgba(60,60,65,0.55)' },
      { label: '纸质 / Paper', bg: 'linear-gradient(170deg, #f7f2e6 0%, #e2d8c2 100%)', stitch: 'rgba(140,120,90,0.4)' },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-5">
        {items.map((v) => (
          <div
            key={v.label}
            style={{
              background: v.bg,
              border: '1px solid rgba(0,0,0,0.45)',
              borderRadius: 12,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.35)',
              width: 150,
              padding: 16,
            }}
          >
            <div
              style={{
                border: `1px dashed ${v.stitch}`,
                borderRadius: 8,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#2e2414' }}>{v.label}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-md rounded-xl p-5"
      style={{
        background: panelBg,
        border: '1px solid rgba(0,0,0,0.55)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 20px rgba(0,0,0,0.45)',
      }}
    >
      {/* 缝线 */}
      <div
        className="pointer-events-none absolute inset-2 rounded-lg"
        style={{ border: '1.5px dashed rgba(240,220,180,0.45)' }}
      />
      <p
        style={{
          margin: '0 0 12px',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#f3e6c8',
          textShadow: '0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        VINTAGE AUDIO
      </p>

      <div className="flex items-center justify-between gap-4">
        {/* 开关：拨杆感 */}
        <button
          onClick={() => setPower((p) => !p)}
          style={{ ...pressed(power), width: 92, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          POWER {power ? 'ON' : 'OFF'}
        </button>

        {/* 输入：凹陷显示屏 */}
        <input
          value={volume}
          onChange={(e) => setVolume(e.target.value.replace(/\D/g, '').slice(0, 2))}
          style={{ ...insetWell, width: 84, padding: '8px 10px', fontSize: 14, textAlign: 'center', outline: 'none' }}
          aria-label="volume"
        />
      </div>

      {/* 卡片：金属铭牌 */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'linear-gradient(180deg, #eceade 0%, #b8b3a0 50%, #d9d4c2 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 4px rgba(0,0,0,0.4)',
          border: '1px solid rgba(70,55,30,0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#3c2f1a', letterSpacing: '0.08em' }}>
          TAPE DECK · CH-{volume || '0'}
        </span>
        <span style={{ fontSize: 10, color: '#6b5a38', fontFamily: 'ui-monospace, monospace' }}>
          embossed metal plate
        </span>
      </div>
    </div>
  );
};

export default SkeuomorphismDemo;
