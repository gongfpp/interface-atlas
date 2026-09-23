import type { DemoComponent } from '@/islands/DemoStage';
import { useState } from 'react';

const RING_CSS = `
.fr-off:focus, .fr-off:focus-visible { outline: none !important; box-shadow: none !important; }
.fr-outline:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
.fr-shadow:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--color-paper), 0 0 0 4px var(--color-accent); }
.fr-tint:focus-visible { outline: none; border-color: var(--color-accent); }
`;

const FocusRingDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [showRing, setShowRing] = useState(true);
  const [pressed, setPressed] = useState<string | null>(null);

  if (mode === 'variants') {
    const rows: Array<[string, string, string]> = [
      ['outline', en ? 'Outline ring' : '外轮廓', 'fr-outline'],
      ['shadow-ring', en ? 'Shadow ring' : '阴影环', 'fr-shadow'],
      ['border-tint', en ? 'Border tint' : '描边染色', 'fr-tint'],
    ];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
        <style>{RING_CSS}</style>
        {rows.map(([id, label, cls]) => (
          <div key={id} className="flex items-center gap-3 rounded-xl border border-line bg-raised px-3 py-2.5">
            <span className="w-20 shrink-0 text-[10px] uppercase tracking-wider text-ink-3">{id}</span>
            <button className={`rounded-lg border border-line bg-code-bg px-4 py-2 text-xs text-ink ${cls}`}>
              {en ? 'Tab here' : '按 Tab 聚焦'}
            </button>
            <span className="text-xs text-ink-2">{label}</span>
          </div>
        ))}
        <p className="text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'Tab into each button to compare ring shapes. Outline survives forced-colors.'
            : '分别用 Tab 聚焦对比三种轮廓。外轮廓在强制颜色模式下最稳。'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <style>{RING_CSS}</style>
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-raised px-3 py-2.5">
        <span data-anatomy="2" className="text-xs font-medium text-ink">
          {en ? 'Show focus ring' : '显示焦点环'}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[10px] text-ink-3">{showRing ? 'ON' : 'OFF'}</span>
          <input
            type="checkbox"
            checked={showRing}
            onChange={(e) => setShowRing(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
        </span>
      </label>

      <div
        className={`flex flex-wrap justify-center gap-2 rounded-xl border border-line bg-code-bg p-4 ${showRing ? 'fr-outline' : 'fr-off'}`}
      >
        <button
          data-anatomy="1"
          onClick={() => setPressed(en ? 'Saved' : '已保存')}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-paper"
        >
          {en ? 'Save' : '保存'}
        </button>
        <button
          data-anatomy="1"
          onClick={() => setPressed(en ? 'Cancelled' : '已取消')}
          className="rounded-lg border border-line bg-raised px-4 py-2 text-xs text-ink-2"
        >
          {en ? 'Cancel' : '取消'}
        </button>
        <button
          data-anatomy="1"
          onClick={() => setPressed(en ? 'More' : '更多')}
          className="rounded-lg border border-line bg-raised px-4 py-2 text-xs text-ink-2"
        >
          {en ? 'More' : '更多'}
        </button>
      </div>

      <p className="min-h-4 text-center text-[11px] text-accent">
        {pressed ? (en ? `Pressed: ${pressed}` : `按下了：${pressed}`) : ''}
      </p>
      <p className="text-center text-[11px] leading-relaxed text-ink-3">
        {showRing
          ? en
            ? 'Press Tab to walk the buttons — the ring marks where you are.'
            : '用 Tab 键在按钮间移动——轮廓标出你此刻在哪。'
          : en
            ? 'Rings off. Tab now and notice how easy it is to get lost.'
            : '焦点环已关闭。再按 Tab 试试，很容易就找不到自己在哪。'}
      </p>
    </div>
  );
};

export default FocusRingDemo;
