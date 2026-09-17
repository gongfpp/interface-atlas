import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 便当盒网格 · Component × Style
 * 风格 demo 特例：直接展示一个 Bento 网格布局——4 列网格 + 不同 span 圆角格。
 */
const BentoGridDemo: DemoComponent = ({ mode }) => {
  const [liked, setLiked] = useState(true);
  const dark = mode === 'dark';

  const tile: CSSProperties = {
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    background: dark ? '#1C1F26' : '#F4F5F7',
    color: dark ? '#E8EAEE' : '#1B1D22',
  };

  const tileHero: CSSProperties = {
    ...tile,
    background: dark
      ? 'linear-gradient(140deg, #243B6B 0%, #1B2540 100%)'
      : 'linear-gradient(140deg, #4D7CFE 0%, #7A5CFF 100%)',
    color: '#FFFFFF',
    gridColumn: 'span 2',
    gridRow: 'span 2',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end' as const,
  };

  const tileWide: CSSProperties = { ...tile, gridColumn: 'span 2' };

  const label: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    opacity: 0.6,
  };

  if (mode === 'variants') {
    const items = [
      { label: '发布会式 / Keynote', span: '2x2 hero', bg: 'linear-gradient(140deg, #4D7CFE, #7A5CFF)', col: 'span 2', row: 'span 2' },
      { label: '仪表盘式 / Dashboard', span: '2x1 wide', bg: dark ? '#1C1F26' : '#F4F5F7', col: 'span 2', row: undefined },
      { label: '个人主页式 / Profile', span: '1x1', bg: dark ? '#242935' : '#E9ECEF', col: undefined, row: undefined },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '52px', gap: 10, maxWidth: 380, margin: '0 auto' }}>
        {items.map((v) => (
          <div
            key={v.label}
            style={{
              ...tile,
              background: v.bg,
              gridColumn: v.col,
              gridRow: v.row,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700 }}>{v.label}</span>
            <span style={{ ...label, fontSize: 9 }}>{v.span}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: '64px',
        gap: 10,
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {/* 主格 2x2：主视觉 */}
      <div style={tileHero}>
        <p style={{ ...label, margin: '0 0 4px' }}>Featured</p>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.25 }}>
          便当盒：<br />面积即层级
        </p>
        <button
          onClick={() => setLiked((v) => !v)}
          style={{
            marginTop: 8,
            alignSelf: 'flex-start',
            border: 0,
            borderRadius: 999,
            background: liked ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.22)',
            color: '#2A2F5E',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          {liked ? '♥ 已收藏' : '♡ 收藏'}
        </button>
      </div>

      {/* 指标格 1x1 */}
      <div style={tile} className="flex flex-col justify-between">
        <span style={label}>Visits</span>
        <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>2,4k</span>
      </div>

      {/* 头像格 1x1 */}
      <div style={tile} className="flex items-center gap-2">
        <div style={{ width: 30, height: 30, borderRadius: 999, background: dark ? '#3A4256' : '#C9CFDA' }} />
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700 }}>Studio K</p>
          <p style={{ margin: 0, fontSize: 9, opacity: 0.55 }}>@studio_k</p>
        </div>
      </div>

      {/* 宽格 2x1：进度 */}
      <div style={tileWide} className="flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
          <span style={label}>Storage</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>72%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: dark ? '#2A2F3C' : '#E2E5EA' }}>
          <div style={{ width: '72%', height: '100%', borderRadius: 999, background: dark ? '#5AC8FA' : '#4D7CFE' }} />
        </div>
      </div>

      {/* 小格 1x1：状态徽章 */}
      <div style={tile} className="flex flex-col items-start justify-center gap-1">
        <span style={label}>Status</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 999,
            background: dark ? '#123B2A' : '#DCF5E7',
            color: dark ? '#4ADE80' : '#0E8A4A',
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* 小格 1x1：日期 */}
      <div style={tile} className="flex flex-col items-start justify-center gap-1">
        <span style={label}>Sync</span>
        <span style={{ fontSize: 13, fontWeight: 800 }}>09.17</span>
      </div>
    </div>
  );
};

export default BentoGridDemo;
