import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const LIMIT = 120;

function TextareaPlayground() {
  const [value, setValue] = useState('这个产品的上手体验非常流畅，');

  const over = value.length > LIMIT;
  const near = value.length > LIMIT * 0.85;
  const canSubmit = value.trim().length > 0 && !over;

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-line bg-paper p-4 text-sm">
      <label className="block">
        <span data-anatomy="1" className="mb-1.5 block text-xs font-medium text-ink-2">
          产品反馈
        </span>
        <textarea
          data-anatomy="2"
          value={value}
          rows={4}
          onChange={(e) => setValue(e.target.value)}
          placeholder="说说你的使用感受…"
          className="w-full resize-y rounded-lg border border-line bg-raised px-3 py-2 text-xs leading-relaxed text-ink outline-none transition-shadow placeholder:text-ink-3 focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <span className="mt-1 flex items-center justify-between">
          <span data-anatomy="4" className="text-[11px] text-ink-3">
            {canSubmit ? 'Ctrl + Enter 发送' : '输入内容后可提交'}
          </span>
          <span
            data-anatomy="3"
            className={`font-mono text-[11px] ${over ? 'text-red-500' : near ? 'text-amber-500' : 'text-ink-3'}`}
          >
            {value.length} / {LIMIT}
          </span>
        </span>
      </label>
      <button
        disabled={!canSubmit}
        className="mt-2 w-full rounded-lg bg-accent py-1.5 text-xs font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        提交反馈
      </button>
    </div>
  );
}

function VariantSheet() {
  const [auto, setAuto] = useState('自动增高：输入越多行，框越高。');
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 text-sm">
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">自动增高 Autosize</p>
        <textarea
          value={auto}
          rows={1}
          onChange={(e) => setAuto(e.target.value)}
          className="w-full resize-none overflow-hidden rounded-lg border border-line bg-raised px-3 py-2 text-xs text-ink outline-none focus:border-accent"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }}
        />
      </div>
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">固定高 + 内部滚动 Fixed</p>
        <textarea
          rows={3}
          className="w-full resize-none overflow-y-auto rounded-lg border border-line bg-raised px-3 py-2 text-xs text-ink outline-none focus:border-accent"
          defaultValue={'固定三行高度，内容多时内部滚动。\n'.repeat(6)}
        />
      </div>
    </div>
  );
}

const TextareaDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') return <VariantSheet />;
  return <TextareaPlayground />;
};

export default TextareaDemo;
