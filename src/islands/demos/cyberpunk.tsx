import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 赛博朋克 · Component × Style
 * 风格 demo 特例：近黑深底 + 霓虹青/品红发光 + 切角面板 + 扫描线。不使用站点主题令牌。
 */
const CYBER_STYLES = `
  @keyframes cp-glitch {
    0%, 88%, 100% { transform: translate(0); text-shadow: none; }
    90% { transform: translate(-2px, 0); text-shadow: 2px 0 #FF2E88, -2px 0 #00E5FF; }
    94% { transform: translate(2px, 0); text-shadow: -2px 0 #FF2E88, 2px 0 #00E5FF; }
    97% { transform: translate(0); text-shadow: 1px 0 #FF2E88; }
  }
  .cp-glitch {
    animation: cp-glitch calc(4s * var(--demo-speed, 1)) steps(1) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .cp-glitch { animation: none; }
  }
`;

const CyberpunkDemo: DemoComponent = ({ mode }) => {
  const [connected, setConnected] = useState(true);
  const [cmd, setCmd] = useState('');
  const dark = mode === 'dark';

  // 赛博朋克本身只有深色形态；default 与 dark 用同一霓虹深底，亮度微调
  const bg = dark ? 'linear-gradient(160deg, #08070f 0%, #0d0b14 100%)' : 'linear-gradient(160deg, #12101f 0%, #1a1330 100%)';
  const CYAN = '#00E5FF';
  const MAGENTA = '#FF2E88';
  const mono = 'ui-monospace, "JetBrains Mono", "SF Mono", monospace';

  const cut = 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))';

  if (mode === 'variants') {
    const items = [
      { label: 'NEON CITY', accent: CYAN, second: MAGENTA },
      { label: 'TERMINAL', accent: '#39FF14', second: '#39FF14' },
      { label: 'GLITCH', accent: MAGENTA, second: '#FFD600' },
    ];
    return (
      <div style={{ background: '#0a0912', padding: 20, borderRadius: 10 }}>
        <style>{CYBER_STYLES}</style>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              className="cp-glitch"
              style={{
                width: 150,
                padding: 16,
                clipPath: cut,
                background: '#12101f',
                border: `1px solid ${v.accent}`,
                boxShadow: `0 0 10px ${v.accent}44, inset 0 0 14px ${v.second}22`,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: mono, color: v.accent, textShadow: `0 0 8px ${v.accent}` }}>{v.label}</p>
              <p style={{ margin: '6px 0 0', fontSize: 10, fontFamily: mono, color: '#7a8ba8' }}>// variant.sys</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-sm p-5"
      style={{ background: bg }}
    >
      <style>{CYBER_STYLES}</style>
      {/* 扫描线叠层 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 3px)',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative" style={{ fontFamily: mono }}>
        <p
          className="cp-glitch"
          style={{
            margin: '0 0 12px',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#EAF8FF',
            textShadow: `0 0 10px ${CYAN}88`,
          }}
        >
          N1GHT//C1TY_OS
        </p>

        {/* 切角面板：状态 + 终端输入 */}
        <div
          style={{
            clipPath: cut,
            background: '#12101f',
            border: `1px solid ${CYAN}AA`,
            boxShadow: `0 0 12px ${CYAN}33`,
            padding: 14,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span style={{ fontSize: 11, color: '#7a8ba8' }}>&gt; uplink.status</span>
            <button
              onClick={() => setConnected((v) => !v)}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
                border: `1px solid ${connected ? CYAN : MAGENTA}`,
                color: connected ? CYAN : MAGENTA,
                background: 'transparent',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: mono,
                padding: '4px 12px',
                cursor: 'pointer',
                textShadow: `0 0 6px ${connected ? CYAN : MAGENTA}`,
              }}
            >
              {connected ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ color: MAGENTA, fontSize: 13, fontWeight: 700 }}>&gt;_</span>
            <input
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              placeholder="run ./jack_in"
              style={{
                flex: 1,
                background: 'rgba(0,229,255,0.05)',
                border: `1px solid ${CYAN}55`,
                color: CYAN,
                fontSize: 12,
                fontFamily: mono,
                padding: '8px 10px',
                outline: 'none',
                textShadow: `0 0 6px ${CYAN}66`,
              }}
            />
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 10, color: '#5a6a86' }}>
            {cmd ? `exec: ${cmd} … [OK]` : '// awaiting input · secure channel'}
          </p>
        </div>

        <p style={{ margin: '12px 0 0', fontSize: 10, letterSpacing: '0.18em', color: `${MAGENTA}cc` }}>
          HIGH TECH · LOW LIFE · NEON
        </p>
      </div>
    </div>
  );
};

export default CyberpunkDemo;
