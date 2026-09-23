import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const LEVELS = [
  {
    level: 0,
    zh: '贴平',
    en: 'Resting',
    use: { zh: '页面底、底纹', en: 'Page ground, wells' },
    shadow: 'none',
  },
  {
    level: 1,
    zh: '轻抬',
    en: 'Raised',
    use: { zh: '卡片', en: 'Cards' },
    shadow: '0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.12)',
  },
  {
    level: 2,
    zh: '悬浮',
    en: 'Hover lift',
    use: { zh: '可点卡片、工具条', en: 'Clickable cards, toolbars' },
    shadow: '0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.12)',
  },
  {
    level: 3,
    zh: '弹层',
    en: 'Popover',
    use: { zh: '下拉、气泡', en: 'Dropdowns, tooltips' },
    shadow: '0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.30)',
  },
  {
    level: 4,
    zh: '浮层',
    en: 'Overlay',
    use: { zh: '抽屉、侧栏', en: 'Drawers, side panels' },
    shadow: '0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px rgba(0,0,0,.30)',
  },
  {
    level: 5,
    zh: '模态',
    en: 'Modal',
    use: { zh: '对话框、全屏浮层', en: 'Dialogs, blocking overlays' },
    shadow: '0 8px 12px 6px rgba(0,0,0,.15), 0 16px 24px 8px rgba(0,0,0,.30)',
  },
];

const ElevationMain = ({ en }: { en: boolean }) => {
  const [lv, setLv] = useState(2);
  const cur = LEVELS[lv];

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        <span data-anatomy="4" className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Elevation level' : '海拔档位'}
        </span>
        <span className="font-mono text-xs text-accent">elev-{lv}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={lv}
        onChange={(e) => setLv(Number(e.target.value))}
        aria-label={en ? 'Elevation level' : '海拔档位'}
        className="mt-1 w-full accent-[var(--color-accent)]"
      />
      <div className="flex justify-between font-mono text-[9px] text-ink-3">
        {LEVELS.map((l) => (
          <span key={l.level} className={l.level === lv ? 'text-accent' : undefined}>
            {l.level}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-center py-4">
        <article
          className="w-56 rounded-2xl border border-line bg-raised p-4"
          style={{ boxShadow: cur.shadow, transition: 'box-shadow 200ms ease' }}
        >
          <div className="mb-2 h-2 w-10 rounded-full bg-line" data-anatomy="4" />
          <p className="text-sm font-semibold text-ink">
            {en ? cur.en : cur.zh} · elev-{lv}
          </p>
          <p className="mt-1 text-[11px] text-ink-2">{en ? cur.use.en : cur.use.zh}</p>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-code-bg" />
            <div className="h-1.5 w-3/4 rounded bg-code-bg" />
          </div>
        </article>
      </div>

      <div className="rounded-lg bg-code-bg px-3 py-2">
        <p data-anatomy="1" className="font-mono text-[9px] text-ink-2">
          umbra · 0 1px 2px rgba(0,0,0,.30)
        </p>
        <p data-anatomy="2" className="font-mono text-[9px] text-ink-2">
          penumbra · 0 {lv}px {lv * 3}px {lv}px rgba(0,0,0,.12)
        </p>
        <p data-anatomy="3" className="font-mono text-[9px] text-ink-3">
          ambient · spread +{lv * 2}px, blur ×{lv || 1}
        </p>
      </div>
      <p className="mt-2 font-mono text-[9px] break-all text-ink-3">box-shadow: {cur.shadow}</p>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Shadows fade on dark surfaces — swap in borders or lighter tints.'
          : '深色界面阴影几乎不可见——改用描边或表面提亮。'}
      </p>
    </div>
  );
};

const ElevationVariants = ({ en }: { en: boolean }) => {
  const schemes = [
    {
      id: 'material',
      zh: '双层材质投影',
      en: 'Material 2-layer',
      cards: [0, 2, 4].map((l) => ({ level: l, shadow: LEVELS[l].shadow })),
    },
    {
      id: 'flat',
      zh: '扁平描边',
      en: 'Flat border-only',
      cards: [1, 2, 3].map((l) => ({ level: l, shadow: 'none' })),
    },
    {
      id: 'ambient',
      zh: '柔和环境投影',
      en: 'Soft ambient',
      cards: [1, 2, 3].map((l) => ({
        level: l,
        shadow: `0 ${l * 4}px ${l * 16}px rgba(0,0,0,${0.06 + l * 0.03})`,
      })),
    },
  ];
  return (
    <div className="mx-auto max-w-md space-y-3">
      {schemes.map((s) => (
        <article key={s.id} className="rounded-xl border border-line bg-raised p-3">
          <p className="specimen-eyebrow">{en ? s.en : s.zh}</p>
          <div className="mt-3 flex items-end justify-center gap-3 pb-2">
            {s.cards.map((c) => (
              <div
                key={c.level}
                className="h-12 w-16 rounded-lg border border-line bg-paper"
                style={{ boxShadow: c.shadow, marginBottom: c.level * 4 }}
              >
                <span className="mt-3 block text-center font-mono text-[10px] text-ink-3">e{c.level}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};

const ElevationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <ElevationVariants en={en} />;
  return <ElevationMain en={en} />;
};

export default ElevationDemo;
