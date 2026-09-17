import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 瑞士风格 · Component × Style
 * 风格 demo 特例：严格网格 + 无衬线 + 黑白红，左对齐排版。不使用站点主题令牌。
 */
const SwissStyleDemo: DemoComponent = ({ mode }) => {
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState('');
  const dark = mode === 'dark';

  const RED = '#E30613';
  const paper = dark ? '#111111' : '#FFFFFF';
  const ink = dark ? '#F2F2F2' : '#111111';
  const sans = '"Helvetica Neue", Helvetica, Arial, sans-serif';

  if (mode === 'variants') {
    const items = [
      { label: '苏黎世 / Zurich', note: 'modular grid', rule: 4 },
      { label: '巴塞尔 / Basel', note: 'type rhythm', rule: 2 },
      { label: '新瑞士 / New Swiss', note: 'mono + hairline', rule: 1 },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-6" style={{ fontFamily: sans }}>
        {items.map((v) => (
          <div key={v.label} style={{ width: 160, color: ink }}>
            <div style={{ borderTop: `${v.rule}px solid ${RED}`, marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.label}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888', fontFamily: 'ui-monospace, monospace' }}>{v.note}</p>
          </div>
        ))}
      </div>
    );
  }

  const cell: CSSProperties = { padding: '10px 12px' };

  return (
    <div
      className="mx-auto max-w-md p-5"
      style={{ background: paper, color: ink, fontFamily: sans }}
    >
      {/* 顶线 + 编号 */}
      <div style={{ borderTop: `3px solid ${ink}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: RED, fontWeight: 700 }}>NO. 04</span>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#888' }}>GRID / GRIDS</span>
      </div>

      {/* 大标题 */}
      <p style={{ margin: '10px 0 0', fontSize: 34, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.03em' }}>
        Die Ordnung<br />秩序即信息
      </p>

      {/* 2px 粗线 */}
      <div style={{ borderTop: `2px solid ${ink}`, margin: '12px 0 0' }} />

      {/* 表格式信息行 */}
      <div style={{ borderBottom: '1px solid ' + (dark ? '#333' : '#DDD') }}>
        {[{ n: '01', t: 'Typografie 排版', c: 'Helvetica' }, { n: '02', t: 'Raster 网格', c: '12 col' }].map((row, i) => (
          <div
            key={row.n}
            className="grid grid-cols-[32px_1fr_auto]"
            style={{
              ...cell,
              borderBottom: '1px solid ' + (dark ? '#2a2a2a' : '#E5E5E5'),
              background: active === i ? (dark ? '#1c1c1c' : '#F5F5F5') : 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setActive(i)}
          >
            <span style={{ fontSize: 11, color: RED, fontFamily: 'ui-monospace, monospace' }}>{row.n}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{row.t}</span>
            <span style={{ fontSize: 11, color: '#888', fontFamily: 'ui-monospace, monospace' }}>{row.c}</span>
          </div>
        ))}
      </div>

      {/* Button + Input：直角 线性 */}
      <div className="mt-4 flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SUCHE 搜索"
          style={{
            flex: 1,
            border: 0,
            borderBottom: `1px solid ${ink}`,
            borderRadius: 0,
            background: 'transparent',
            color: ink,
            fontFamily: sans,
            fontSize: 13,
            padding: '6px 2px',
            outline: 'none',
          }}
        />
        <button
          style={{
            border: 0,
            background: RED,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '8px 18px',
            cursor: 'pointer',
            borderRadius: 0,
          }}
        >
          LOS
        </button>
      </div>
    </div>
  );
};

export default SwissStyleDemo;
