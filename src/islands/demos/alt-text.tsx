import type { DemoComponent } from '@/islands/DemoStage';
import { useState } from 'react';

const AltTextDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [alt, setAlt] = useState(
    en ? 'March sales up 18% month over month' : '3 月销量环比上涨 18%',
  );
  const [decorative, setDecorative] = useState(false);

  const effective = decorative ? '' : alt.trim();
  const announcement = decorative
    ? en
      ? '(skipped — decorative image)'
      : '（已跳过——装饰图）'
    : effective
      ? en
        ? `Image: ${effective}`
        : `图片：${effective}`
      : en
        ? 'Image: (empty alt — will be skipped, often wrongly)'
        : '图片：（alt 为空——会被跳过，此处并不该跳过）';

  if (mode === 'variants') {
    const rows: Array<[string, string, string]> = [
      ['informative', en ? 'Informative' : '信息型', en ? 'A bar chart of Q1 revenue' : '一季度营收柱状图'],
      ['decorative', en ? 'Decorative' : '装饰型', 'alt=""'],
      ['functional', en ? 'Functional' : '功能型', en ? 'Close (not “grey X icon”)' : '关闭（不是「灰色叉号图标」）'],
    ];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        {rows.map(([id, label, sample]) => (
          <div key={id} className="rounded-xl border border-line bg-raised px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-ink-3">{id}</p>
            <p className="mt-1 text-xs font-medium text-ink">{label}</p>
            <p className="mt-0.5 font-mono text-[11px] text-accent">{sample}</p>
          </div>
        ))}
        <p className="text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'Write the takeaway, not the paint. Actions, not icon shapes.'
            : '写信息结论，不写画面细节。写动作，不写图标形状。'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <div data-anatomy="1" className="overflow-hidden rounded-xl border border-line bg-code-bg">
        <svg viewBox="0 0 320 132" role="img" aria-label={effective || undefined} className="block w-full">
          <rect width="320" height="132" fill="none" />
          <text x="16" y="24" className="fill-current text-[11px]" fill="currentColor" opacity="0.5">
            {en ? 'Monthly sales' : '月度销量'}
          </text>
          {[42, 68, 54, 88, 76, 102].map((h, i) => (
            <rect
              key={i}
              x={28 + i * 48}
              y={116 - h}
              width="28"
              height={h}
              rx="4"
              fill={i === 5 ? 'var(--color-accent)' : 'currentColor'}
              opacity={i === 5 ? 1 : 0.22}
            />
          ))}
          {decorative && (
            <text x="160" y="70" textAnchor="middle" fill="currentColor" opacity="0.35" className="text-[11px]">
              {en ? 'decorative' : '装饰图'}
            </text>
          )}
        </svg>
      </div>

      <div data-anatomy="2" className="rounded-xl border border-line bg-raised px-3 py-2.5">
        <label className="block text-[10px] uppercase tracking-wider text-ink-3" htmlFor="demo-alt-field">
          alt
        </label>
        <input
          id="demo-alt-field"
          value={decorative ? '' : alt}
          disabled={decorative}
          onChange={(e) => setAlt(e.target.value)}
          placeholder={en ? 'Describe the takeaway…' : '描述图片信息结论…'}
          className="mt-1 w-full rounded-lg border border-line bg-code-bg px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-3 disabled:opacity-50"
        />
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-ink-2">
          <input
            type="checkbox"
            checked={decorative}
            onChange={(e) => setDecorative(e.target.checked)}
            className="h-3.5 w-3.5 accent-accent"
          />
          {en ? 'Decorative — alt="" (skip)' : '装饰图——alt=""（跳过）'}
        </label>
      </div>

      <div className="rounded-xl border border-line bg-code-bg px-3 py-2.5">
        <p className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Screen reader announces' : '读屏朗读结果'}
        </p>
        <p className="mt-1 text-[11px] text-ink">{announcement}</p>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Toggle decorative on an informative chart — notice how much context vanishes.'
          : '把信息图切成装饰图试试——一下就少掉了多少信息。'}
      </p>
    </div>
  );
};

export default AltTextDemo;
