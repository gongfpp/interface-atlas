import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${
        pass
          ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
          : 'bg-red-500/10 text-red-600 dark:text-red-400'
      }`}
    >
      {pass ? '✓' : '✕'} {label}
    </span>
  );
}

const ContrastMain = ({ en }: { en: boolean }) => {
  const [fg, setFg] = useState('#57534a');
  const [bg, setBg] = useState('#fafaf7');
  const ratio = contrastRatio(fg, bg);
  const r = Math.round(ratio * 100) / 100;

  return (
    <div className="mx-auto max-w-sm">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span data-anatomy="1" className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Foreground' : '前景色'}
          </span>
          <input
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-line bg-raised"
            aria-label={en ? 'Foreground colour' : '前景色'}
          />
          <span className="mt-1 block font-mono text-[10px] text-ink-3">{fg}</span>
        </label>
        <label className="block">
          <span data-anatomy="2" className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Background' : '背景色'}
          </span>
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-line bg-raised"
            aria-label={en ? 'Background colour' : '背景色'}
          />
          <span className="mt-1 block font-mono text-[10px] text-ink-3">{bg}</span>
        </label>
      </div>

      <div
        data-anatomy="4"
        className="mt-3 rounded-xl border border-line px-4 py-4"
        style={{ background: bg }}
      >
        <p className="text-base leading-relaxed" style={{ color: fg }}>
          {en ? 'Body text at 16px needs 4.5:1.' : '正文 16px 需要 4.5:1。'}
        </p>
        <p className="mt-1 text-2xl font-semibold leading-tight" style={{ color: fg }}>
          {en ? 'Large text 3:1' : '大号文字 3:1'}
        </p>
      </div>

      <div data-anatomy="3" className="mt-3 flex items-center justify-between rounded-lg bg-code-bg px-3 py-2">
        <span className="text-[10px] uppercase tracking-wider text-ink-3">{en ? 'Ratio' : '对比比值'}</span>
        <span className="font-mono text-lg font-semibold text-accent">{r}:1</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge pass={r >= 4.5} label="AA body 4.5" />
        <Badge pass={r >= 3} label="AA large 3" />
        <Badge pass={r >= 7} label="AAA body 7" />
        <Badge pass={r >= 4.5} label="AAA large 4.5" />
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'WCAG 2.1 floors. APCA refines further by weight and size.'
          : 'WCAG 2.1 门槛。APCA 进一步按字重与字号细化。'}
      </p>
    </div>
  );
};

const ContrastVariants = ({ en }: { en: boolean }) => {
  const rows = [
    { fg: '#17150f', bg: '#fafaf7', zh: '正文 AA 4.5:1', en: 'Body AA 4.5:1' },
    { fg: '#8a857a', bg: '#fafaf7', zh: '辅助文字 · 临界', en: 'Muted text · borderline' },
    { fg: '#b4441f', bg: '#ffffff', zh: '强调色 · 大号 3:1', en: 'Accent · large 3:1' },
  ];
  return (
    <div className="mx-auto max-w-md space-y-2">
      {rows.map((row) => {
        const r = Math.round(contrastRatio(row.fg, row.bg) * 100) / 100;
        return (
          <div key={row.zh} className="rounded-xl border border-line p-3" style={{ background: row.bg }}>
            <p className="text-sm" style={{ color: row.fg }}>
              {en ? row.en : row.zh}
            </p>
            <p className="mt-1 font-mono text-[10px]" style={{ color: row.fg, opacity: 0.8 }}>
              {row.fg} on {row.bg} · {r}:1
            </p>
          </div>
        );
      })}
    </div>
  );
};

const ContrastRatioDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <ContrastVariants en={en} />;
  return <ContrastMain en={en} />;
};

export default ContrastRatioDemo;
