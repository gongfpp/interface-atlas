import { useState, type CSSProperties } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/** 非对称圆角 = 手画的抖 */
const wobble = (a = 1, b = 1) =>
  `${255 * a}px ${15 * b}px ${225 * a}px ${15 * b}px / ${15 * b}px ${225 * a}px ${15 * b}px ${255 * a}px`;

/**
 * 手绘涂鸦 · Component × Style
 * 风格 demo 特例：抖动描边 + 纸纹 + 马克笔高亮 + 轻微倾斜。不使用站点主题令牌。
 */
const HandDrawnDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [marker, setMarker] = useState(true);
  const [note, setNote] = useState('');
  const [stuck, setStuck] = useState(false);
  const dark = mode === 'dark';

  const paper = dark ? '#2A241C' : '#FAF6EE';
  const ink = dark ? '#F3EBDC' : '#2B2B2B';
  const sub = dark ? '#B0A48E' : '#6B6357';
  const HI = '#FFE566';
  const CORAL = '#FF8A65';

  const rules = dark
    ? 'repeating-linear-gradient(#0000 0 27px, rgba(243,235,220,0.08) 27px 28px)'
    : 'repeating-linear-gradient(#0000 0 27px, rgba(43,43,43,0.08) 27px 28px)';

  const sketch: CSSProperties = {
    border: `2px solid ${ink}`,
    borderRadius: wobble(),
    background: dark ? '#332B20' : '#FFFDF7',
    color: ink,
    boxShadow: '2px 3px 0 rgba(43,43,43,0.08)',
  };

  const skBtn: CSSProperties = {
    ...sketch,
    borderRadius: wobble(0.6, 1.2),
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transform: 'rotate(-1deg)',
    background: marker ? CORAL : 'transparent',
    color: marker ? '#2B2B2B' : ink,
  };

  if (mode === 'variants') {
    const items = [
      { label: en ? 'Marker sketch' : '马克笔草图', tilt: -2, hi: true },
      { label: en ? 'Notebook doodle' : '笔记本涂鸦', tilt: 1.5, hi: false },
      { label: en ? 'Sticker chaos' : '贴纸乱贴', tilt: -3, hi: true },
    ];
    return (
      <div style={{ background: paper, backgroundImage: rules, padding: 24, borderRadius: 8 }}>
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((v) => (
            <div
              key={v.label}
              style={{
                ...sketch,
                width: 148,
                padding: 16,
                transform: `rotate(${v.tilt}deg)`,
              }}
            >
              <svg viewBox="0 0 60 24" width="54" height="22" aria-hidden="true">
                <path
                  d="M2 14 Q12 2 22 14 T42 14 T58 10"
                  fill="none"
                  stroke={v.hi ? CORAL : ink}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 13,
                  fontWeight: 700,
                  background: v.hi ? `linear-gradient(transparent 55%, ${HI} 55%)` : undefined,
                  display: 'inline',
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
    <div style={{ background: paper, backgroundImage: rules, padding: 26, borderRadius: 8 }}>
      <div className="mx-auto max-w-md">
        <div style={{ ...sketch, padding: '18px 20px', transform: stuck ? 'rotate(1.4deg)' : 'rotate(-1deg)', transition: 'transform calc(180ms * var(--demo-speed, 1)) ease' }}>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.14em', color: sub, fontWeight: 700 }}>
            {en ? 'SCRIBBLE & CO.' : '随手画工作室'}
          </p>
          <p style={{ margin: '6px 0 10px', fontSize: 24, fontWeight: 800, lineHeight: 1.2, transform: 'rotate(-0.6deg)' }}>
            <span style={{ background: marker ? `linear-gradient(transparent 55%, ${HI} 55%)` : undefined }}>
              {en ? 'Draw it crooked' : '画歪一点'}
            </span>
            <br />
            {en ? "it's fine." : '没关系。'}
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.7, color: sub }}>
            {en ? 'Human warmth against machine-perfect UI.' : '人手的温度，对抗机器级完美。'}
          </p>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={en ? 'scribble a note…' : '随手写一句…'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              ...sketch,
              borderRadius: wobble(0.5, 1),
              padding: '10px 14px',
              fontSize: 13,
              marginBottom: 14,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button style={skBtn} onClick={() => setStuck((v) => !v)}>
              {stuck ? (en ? 'unstick' : '撕下来') : en ? 'stick it' : '贴上去'}
            </button>
            <button
              style={{ ...skBtn, background: marker ? HI : 'transparent', transform: 'rotate(1.2deg)' }}
              onClick={() => setMarker((v) => !v)}
            >
              {marker ? (en ? 'marker on' : '马克笔开') : en ? 'marker off' : '马克笔关'}
            </button>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: sub, fontStyle: 'italic' }}>
            {note ? `✎ ${note}` : en ? 'border-radius: 255px 15px 225px 15px / …' : '圆故意画不圆'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HandDrawnDemo;
