import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const STACKS = [
  {
    id: 'system',
    zh: '系统栈',
    en: 'System stack',
    css: "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', sans-serif",
    chain: ['system-ui', '-apple-system', 'PingFang SC', 'sans-serif'],
    note: { zh: '零下载、零闪烁，随系统变化', en: 'Zero download, zero flash — varies by OS' },
  },
  {
    id: 'web',
    zh: '网络字体 + 回退',
    en: 'Web font + fallback',
    css: "'Georgia', 'Songti SC', 'Times New Roman', serif",
    chain: ['Georgia', 'Songti SC', 'Times New Roman', 'serif'],
    note: { zh: '品牌气质优先，需 font-display 控闪', en: 'Brand voice first — needs font-display' },
  },
  {
    id: 'local-first',
    zh: '本地优先',
    en: 'Local-first',
    css: "'SF Pro Text', 'PingFang SC', system-ui, sans-serif",
    chain: ['SF Pro Text', 'PingFang SC', 'system-ui', 'sans-serif'],
    note: { zh: '有本地字体就用，缺了再下载', en: 'Use the local face; download only if missing' },
  },
] as const;

const FontStackMain = ({ en }: { en: boolean }) => {
  const [stackId, setStackId] = useState<string>('system');
  const [text, setText] = useState(
    en ? 'The quick brown fox jumps over the lazy dog. 排版从字体栈开始。' : '字体栈决定每个字最终由谁渲染。The quick brown fox.',
  );
  const stack = STACKS.find((s) => s.id === stackId)!;

  return (
    <div className="mx-auto max-w-sm">
      <label className="block">
        <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Sample text · editable' : '示例文字 · 可编辑'}
        </span>
        <input
          className="specimen-field text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={en ? 'Sample text' : '示例文字'}
        />
      </label>

      <div className="mt-3 grid grid-cols-3 gap-1" role="group" aria-label={en ? 'Font stack' : '字体栈'}>
        {STACKS.map((s) => (
          <button
            key={s.id}
            aria-pressed={stackId === s.id}
            onClick={() => setStackId(s.id)}
            className={`demo-tool border border-line ${stackId === s.id ? '' : 'text-ink-2'}`}
          >
            {en ? s.en : s.zh}
          </button>
        ))}
      </div>

      <div
        data-anatomy="1"
        className="mt-3 min-h-24 rounded-xl border border-line bg-raised px-4 py-5 text-lg leading-relaxed text-ink"
        style={{ fontFamily: stack.css }}
      >
        {text || (en ? 'Type something…' : '输入点什么…')}
      </div>

      <div data-anatomy="2" className="mt-3 flex flex-wrap items-center gap-1.5">
        {stack.chain.map((f, i) => (
          <span
            key={f}
            className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${
              i === 0 ? 'bg-accent-soft text-accent' : 'bg-code-bg text-ink-2'
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <p data-anatomy="3" className="mt-2 font-mono text-[10px] break-all text-ink-3">
        font-family: {stack.css}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
        {en ? stack.note.en : stack.note.zh}
      </p>
    </div>
  );
};

const FontStackVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto max-w-md space-y-3">
    {STACKS.map((s) => (
      <article key={s.id} className="rounded-xl border border-line bg-raised p-4">
        <p className="specimen-eyebrow">{en ? s.en : s.zh}</p>
        <p className="mt-2 text-base leading-relaxed text-ink" style={{ fontFamily: s.css }}>
          {en
            ? 'Fallbacks keep the layout standing when a face is missing.'
            : '首选字体缺席时，回退链保证版式不塌。'}
        </p>
        <p className="mt-2 font-mono text-[10px] break-all text-ink-3">{s.css}</p>
      </article>
    ))}
    <p className="text-center text-[11px] text-ink-3">
      {en ? 'Always end a stack with a generic family.' : '每条栈末尾都要有通用族兜底。'}
    </p>
  </div>
);

const FontStackDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <FontStackVariants en={en} />;
  return <FontStackMain en={en} />;
};

export default FontStackDemo;
