import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 极简主义 · Component × Style
 * 风格 demo 特例：直接内联该风格的样式，不使用主题令牌（展示的就是风格本身）。
 * 层级只靠 留白 / 字号 / 字重 / 1px 发丝线 建立，无阴影无渐变。
 */
const MinimalismDemo: DemoComponent = ({ mode }) => {
  const [following, setFollowing] = useState(false);
  const [email, setEmail] = useState('');
  const dark = mode === 'dark';

  const panel: CSSProperties = {
    background: dark ? '#0E0E0E' : '#FFFFFF',
    color: dark ? '#F5F5F5' : '#111111',
    padding: '28px 32px',
    transition: `background-color calc(200ms * var(--demo-speed, 1)) ease, color calc(200ms * var(--demo-speed, 1)) ease`,
  };
  const hairline: CSSProperties = { borderColor: dark ? '#262626' : '#E7E7E7' };

  const btnSolid: CSSProperties = {
    background: dark ? '#F5F5F5' : '#111111',
    color: dark ? '#111111' : '#FFFFFF',
    border: 'none',
    borderRadius: 2,
    padding: '10px 22px',
    fontSize: 13,
    letterSpacing: '0.08em',
    cursor: 'pointer',
  };
  const btnOutline: CSSProperties = {
    background: 'transparent',
    color: 'inherit',
    border: `1px solid ${dark ? '#555555' : '#BBBBBB'}`,
    borderRadius: 2,
    padding: '9px 21px',
    fontSize: 13,
    letterSpacing: '0.08em',
    cursor: 'pointer',
  };
  const inputStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${dark ? '#333333' : '#DDDDDD'}`,
    outline: 'none',
    padding: '8px 2px',
    fontSize: 13,
    color: 'inherit',
    width: '100%',
  };

  if (mode === 'variants') {
    const skins = [
      { label: '黑白极简 / Mono', bg: '#FFFFFF', fg: '#000000', line: '#E7E7E7' },
      { label: '扁平极简 / Flat', bg: '#F7F7F7', fg: '#1A1A1A', line: '#DDDDDD' },
      { label: '暖调极简 / Warm', bg: '#FAF7F2', fg: '#3A332C', line: '#E5DCD0' },
    ];
    return (
      <div>
        <div className="flex flex-wrap justify-center gap-5">
          {skins.map((s) => (
            <div
              key={s.label}
              style={{ background: s.bg, color: s.fg, border: `1px solid ${s.line}`, padding: 20, width: 168 }}
            >
              <p style={{ fontSize: 11, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 10 }}>{s.label}</p>
              <p style={{ fontSize: 17, fontWeight: 300, marginBottom: 12 }}>Less, but better.</p>
              <div style={{ borderTop: `1px solid ${s.line}`, paddingTop: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>留白即层级 / Space is hierarchy</span>
              </div>
              <button
                style={{ background: s.fg, color: s.bg, border: 'none', borderRadius: 2, padding: '7px 16px', fontSize: 12, cursor: 'pointer' }}
              >
                按钮 / Button
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-3">同一版式的三种极简变奏 / Three minimal moods, same layout</p>
      </div>
    );
  }

  return (
    <div style={panel}>
      <div className="flex flex-wrap items-start justify-between gap-8">
        {/* Card —— 无边框卡片，只用发丝线与留白分区 */}
        <div style={{ flex: '1 1 220px', minWidth: 220 }}>
          <h3 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.01em', margin: 0 }}>静 · Quiet</h3>
          <p style={{ fontSize: 12, opacity: 0.55, marginTop: 6, letterSpacing: '0.05em' }}>
            FORM FOLLOWS FUNCTION
          </p>
          <div style={{ borderTop: `1px solid ${hairline.borderColor}`, margin: '18px 0' }} />
          <p style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.75, margin: 0 }}>
            删除一切装饰之后，剩下的就是必要的。
            <br />
            Everything essential, nothing more.
          </p>
          <div style={{ borderTop: `1px solid ${hairline.borderColor}`, margin: '18px 0' }} />
          <span style={{ fontSize: 12, opacity: 0.5 }}>极简主义 / Minimalism — 01</span>
        </div>

        {/* Controls —— Button + Input */}
        <div style={{ flex: '1 1 200px', minWidth: 200 }}>
          <label style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.5, display: 'block', marginBottom: 4 }}>
            EMAIL
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <button style={btnSolid} onClick={() => setFollowing((f) => !f)}>
              {following ? '已关注 / FOLLOWING' : '关注 / FOLLOW'}
            </button>
            <button style={btnOutline}>了解更多 / MORE</button>
          </div>
          <p style={{ fontSize: 11, opacity: 0.4, marginTop: 14, letterSpacing: '0.04em' }}>
            {email ? `已输入 ${email.length} 字符 / ${email.length} chars` : '无阴影 · 无渐变 · 无圆角装饰'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimalismDemo;
