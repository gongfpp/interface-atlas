import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/** 扁平长肢小人 —— 模块级 SVG，避免渲染期创建组件 */
function Figure({ pose, colors }: { pose: 'wave' | 'sit'; colors: { skin: string; body: string; limb: string } }) {
  return (
    <svg viewBox="0 0 120 140" width="110" height="128" aria-hidden="true">
      <circle cx="60" cy="28" r="16" fill={colors.skin} />
      <rect x="44" y="46" width="32" height="44" rx="14" fill={colors.body} />
      {pose === 'wave' ? (
        <>
          <path d="M48 58 Q22 50 14 28" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M72 58 Q98 64 104 40" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M52 90 Q46 118 38 132" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M68 90 Q78 116 90 128" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M48 60 Q28 72 22 88" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M72 60 Q94 58 102 48" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M52 90 Q60 112 86 118" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M68 92 Q70 116 40 124" stroke={colors.limb} strokeWidth="9" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

/**
 * 企业孟菲斯 · Component × Style
 * 风格 demo 特例：扁平抽象小人 + 紫黄桃有限色板 + 胶囊按钮。纯平涂无阴影。不使用站点主题令牌。
 */
const CorporateMemphisDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [pose, setPose] = useState<'wave' | 'sit'>('wave');
  const [task, setTask] = useState('');
  const [done, setDone] = useState(false);
  const dark = mode === 'dark';

  const bg = dark ? '#1C1230' : '#FFF8F0';
  const ink = dark ? '#F3ECFF' : '#2B2140';
  const sub = dark ? '#A996C4' : '#7A6B8C';
  const PURPLE = '#7B61FF';
  const YELLOW = '#FAD141';
  const PEACH = '#F48196';

  const pill: CSSProperties = {
    borderRadius: 999,
    border: 'none',
    padding: '11px 22px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  };

  const card: CSSProperties = {
    borderRadius: 24,
    background: dark ? '#2A1B45' : '#FFFFFF',
    padding: 20,
  };

  if (mode === 'variants') {
    const items = [
      { label: en ? 'People' : '经典人形', bg: PURPLE, pose: 'wave' as const },
      { label: en ? 'Abstract' : '抽象色块', bg: YELLOW, pose: 'sit' as const },
      { label: en ? 'Gradient flat' : '渐变扁平', bg: PEACH, pose: 'wave' as const },
    ];
    return (
      <div style={{ background: bg, padding: 22, borderRadius: 16 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div key={v.label} style={{ width: 150, borderRadius: 24, background: v.bg, padding: 16, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Figure pose={v.pose} colors={{ skin: '#86CCCA', body: '#FFFFFF', limb: '#FFFFFF' }} />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: '#2B2140' }}>{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, padding: 24, borderRadius: 16 }}>
      <div className="mx-auto flex max-w-lg flex-wrap items-center gap-5">
        <div
          style={{
            borderRadius: 28,
            background: pose === 'wave' ? PURPLE : YELLOW,
            padding: '10px 8px 0',
            display: 'flex',
            justifyContent: 'center',
            minWidth: 130,
          }}
        >
          <Figure
            pose={pose}
            colors={{ skin: '#86CCCA', body: pose === 'wave' ? '#FAD141' : '#F48196', limb: '#2B2140' }}
          />
        </div>

        <div style={{ ...card, flex: '1 1 220px', minWidth: 220 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: PURPLE }}>
            ALEGRIA · TEAM SPACE
          </p>
          <p style={{ margin: '6px 0 12px', fontSize: 20, fontWeight: 800, lineHeight: 1.3, color: ink }}>
            {en ? 'Work feels lighter' : '一起把事情做简单'}
          </p>
          <input
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              setDone(false);
            }}
            placeholder={en ? 'Name a task…' : '说一件要做的事…'}
            style={{
              width: '100%',
              borderRadius: 999,
              border: 'none',
              background: dark ? '#1C1230' : '#F4EFFF',
              color: ink,
              padding: '11px 18px',
              fontSize: 13,
              outline: 'none',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button
              style={{ ...pill, background: PURPLE, color: '#FFFFFF' }}
              onClick={() => setDone(true)}
            >
              {en ? 'Add to board' : '加入看板'}
            </button>
            <button
              style={{ ...pill, background: PEACH, color: '#2B2140' }}
              onClick={() => setPose((p) => (p === 'wave' ? 'sit' : 'wave'))}
            >
              {en ? 'Switch pose' : '换个姿势'}
            </button>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 12, color: sub }}>
            {done && task
              ? en
                ? `“${task}” is on the board.`
                : `「${task}」已上板。`
              : en
                ? 'Flat figures. Limited palette. Zero shadows.'
                : '扁平小人 · 有限色板 · 无阴影'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateMemphisDemo;
