import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 扁平化 · Component × Style
 * 风格 demo 特例：纯色块 + 无渐变无投影，层级全靠颜色与排版。不使用站点主题令牌。
 */
const FlatDesignDemo: DemoComponent = ({ mode }) => {
  const [liked, setLiked] = useState(false);
  const [email, setEmail] = useState('');
  const dark = mode === 'dark';

  // Flat UI Colors 经典色板
  const C = {
    blue: '#3498DB',
    red: '#E74C3C',
    green: '#2ECC71',
    teal: '#1ABC9C',
    orange: '#E67E22',
    dark: '#34495E',
    deep: '#2C3E50',
    light: '#ECF0F1',
  };

  const btn: CSSProperties = {
    background: liked ? C.red : C.blue,
    color: '#FFFFFF',
    border: 0,
    borderRadius: 3,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color calc(150ms * var(--demo-speed, 1)) ease',
  };

  const input: CSSProperties = {
    background: dark ? C.deep : C.light,
    color: dark ? '#ECF0F1' : C.deep,
    border: 0,
    borderRadius: 3,
    padding: '10px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  };

  if (mode === 'variants') {
    const tiles = [
      { label: 'Metro 磁贴 / Metro', bg: C.blue, radius: 0 },
      { label: 'Flat UI 撞色 / Flat UI', bg: C.teal, radius: 4 },
      { label: '扁平 2.0 / Flat 2.0', bg: C.orange, radius: 3 },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-5">
        {tiles.map((t) => (
          <div
            key={t.label}
            style={{
              background: t.bg,
              borderRadius: t.radius,
              width: 150,
              padding: 18,
              color: '#fff',
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{t.label}</p>
            <p style={{ margin: '6px 0 0', fontSize: 11, opacity: 0.85 }}>solid · radius {t.radius}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-md rounded-lg p-5"
      style={{ background: dark ? C.deep : C.light, borderRadius: 4 }}
    >
      {/* Card：纯色块头条 */}
      <div style={{ background: dark ? C.dark : C.blue, borderRadius: 4, padding: '16px 16px 14px', color: '#fff' }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.85 }}>
          NEWS · 09.17
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>
          扁平化：把界面交给色块 / The interface is a plane
        </p>
      </div>

      {/* 控件区：Button + Input */}
      <div className="mt-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱 / EMAIL"
          style={input}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            style={btn}
            onClick={() => setLiked((v) => !v)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = liked ? '#C0392B' : '#2980B9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = liked ? C.red : C.blue)}
          >
            {liked ? '已订阅 / SUBSCRIBED' : '订阅 / SUBSCRIBE'}
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: dark ? '#95A5A6' : '#7F8C8D' }}>
            {email ? `HELLO, ${email.toUpperCase()}` : '0 gradients · 0 shadows'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlatDesignDemo;
