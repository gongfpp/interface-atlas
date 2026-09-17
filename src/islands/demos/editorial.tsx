import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/**
 * 杂志编辑风 · Component × Style
 * 风格 demo 特例：衬线大标题 + 首字下沉 + 发丝线 + 章节编号。不使用站点主题令牌。
 */
const EditorialDemo: DemoComponent = ({ mode }) => {
  const [expanded, setExpanded] = useState(false);
  const dark = mode === 'dark';

  const paper = dark ? '#17150F' : '#FAF8F4';
  const ink = dark ? '#EDE6D8' : '#1A1816';
  const hair = dark ? '#3A362B' : '#D8D2C6';
  const serif = 'Georgia, "Times New Roman", serif';

  if (mode === 'variants') {
    const items = [
      { label: '大报 / Broadsheet', serif: true, cols: 2, caps: true },
      { label: '光面杂志 / Glossy', serif: true, cols: 1, caps: false },
      { label: '数字编辑 / Digital', serif: false, cols: 1, caps: true },
    ];
    return (
      <div className="flex flex-wrap justify-center gap-6" style={{ background: paper, padding: 20, borderRadius: 6 }}>
        {items.map((v) => (
          <div key={v.label} style={{ width: 150 }}>
            <div style={{ borderTop: `1px solid ${hair}`, paddingTop: 8 }}>
              <p style={{
                margin: 0,
                fontFamily: v.serif ? serif : '"Helvetica Neue", sans-serif',
                fontSize: 19,
                lineHeight: 1.15,
                color: ink,
                textTransform: v.caps ? 'uppercase' : 'none',
                letterSpacing: v.caps ? '0.04em' : '0',
              }}>
                {v.serif ? 'The Printed Voice' : 'The Digital Voice'}
              </p>
              <p style={{ margin: '6px 0 0', fontFamily: serif, fontSize: 11, lineHeight: 1.6, color: ink, opacity: 0.7, columnCount: v.cols, columnGap: 10 }}>
                Layout speaks first; the reader follows the rhythm of the page.
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-md p-5"
      style={{ background: paper, color: ink, fontFamily: serif }}
    >
      {/* 眉题 + 刊号 */}
      <div style={{ borderTop: `2.5px solid ${ink}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"Helvetica Neue", sans-serif' }}>
          Issue Nº 42 · Autumn
        </span>
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"Helvetica Neue", sans-serif', opacity: 0.55 }}>
          Essays
        </span>
      </div>

      {/* 大标题 */}
      <h2 style={{ margin: '12px 0 0', fontSize: 31, lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em' }}>
        The Quiet Art of<br /><em>Setting Words Well</em>
      </h2>

      {/* 发丝线 */}
      <div style={{ borderTop: `1px solid ${hair}`, margin: '14px 0 12px' }} />

      {/* 正文 + 首字下沉 */}
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, textAlign: 'justify' }}>
        <span
          style={{
            float: 'left',
            fontSize: 46,
            lineHeight: 0.82,
            paddingRight: 8,
            paddingTop: 4,
            fontWeight: 400,
          }}
        >
          T
        </span>
        ypography is the voice of the page. Long before a reader finishes the first
        sentence, the measure, the leading and the weight of the face have already
        spoken. {expanded && 'A well-set column asks for nothing; it simply carries the eye, line after line, the way a good host keeps pouring tea without being asked.'}
      </p>

      {/* Button：编辑风操作 */}
      <div className="mt-4 flex items-center justify-between">
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: '"Helvetica Neue", sans-serif', opacity: 0.55 }}>
          {expanded ? '— End of excerpt' : '· Continued'}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            border: 'none',
            borderBottom: `1px solid ${ink}`,
            background: 'transparent',
            color: ink,
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: 14,
            padding: '0 2px 1px',
            cursor: 'pointer',
          }}
        >
          {expanded ? '收起 / Fold' : '继续阅读 / Continue'}
        </button>
      </div>
    </div>
  );
};

export default EditorialDemo;
