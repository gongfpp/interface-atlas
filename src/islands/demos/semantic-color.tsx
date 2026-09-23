import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type ThemeId = 'light' | 'dark' | 'contrast' | 'brand';

const THEMES: Record<
  ThemeId,
  {
    zh: string;
    en: string;
    tokens: {
      bg: string;
      surface: string;
      raised: string;
      text: string;
      muted: string;
      line: string;
      accent: string;
      danger: string;
    };
  }
> = {
  light: {
    zh: '浅色',
    en: 'Light',
    tokens: {
      bg: '#fafaf7',
      surface: '#ffffff',
      raised: '#f3f1ea',
      text: '#17150f',
      muted: '#8a857a',
      line: '#e5e2da',
      accent: '#b4441f',
      danger: '#b42318',
    },
  },
  dark: {
    zh: '深色',
    en: 'Dark',
    tokens: {
      bg: '#121210',
      surface: '#1c1b18',
      raised: '#252320',
      text: '#ecebe6',
      muted: '#9a958a',
      line: '#2c2b26',
      accent: '#e8845d',
      danger: '#f97066',
    },
  },
  contrast: {
    zh: '高对比',
    en: 'High contrast',
    tokens: {
      bg: '#ffffff',
      surface: '#ffffff',
      raised: '#f0f0f0',
      text: '#000000',
      muted: '#333333',
      line: '#000000',
      accent: '#9b1c00',
      danger: '#8b0000',
    },
  },
  brand: {
    zh: '品牌覆盖',
    en: 'Brand override',
    tokens: {
      bg: '#f5f7fb',
      surface: '#ffffff',
      raised: '#e8eef8',
      text: '#0f172a',
      muted: '#64748b',
      line: '#d7dfee',
      accent: '#2563eb',
      danger: '#b42318',
    },
  },
};

const ROLE_KEYS = ['bg', 'surface', 'raised', 'text', 'muted', 'line', 'accent', 'danger'] as const;

const SemanticMain = ({ en }: { en: boolean }) => {
  const [themeId, setThemeId] = useState<ThemeId>('light');
  const theme = THEMES[themeId];
  const t = theme.tokens;

  return (
    <div className="mx-auto max-w-sm">
      <div className="grid grid-cols-4 gap-1" role="group" aria-label={en ? 'Theme' : '主题'}>
        {(Object.keys(THEMES) as ThemeId[]).map((id) => (
          <button
            key={id}
            aria-pressed={themeId === id}
            onClick={() => setThemeId(id)}
            className={`demo-tool border border-line ${themeId === id ? '' : 'text-ink-2'}`}
          >
            {en ? THEMES[id].en : THEMES[id].zh}
          </button>
        ))}
      </div>

      <div
        data-anatomy="3"
        className="mt-3 overflow-hidden rounded-xl border p-4"
        style={{ background: t.bg, borderColor: t.line, color: t.text }}
      >
        <div
          data-anatomy="2"
          className="rounded-lg border p-3"
          style={{ background: t.surface, borderColor: t.line }}
        >
          <p className="text-sm font-semibold" style={{ color: t.text }}>
            {en ? 'Surface card' : 'Surface 卡片'}
          </p>
          <p className="mt-1 text-xs" style={{ color: t.muted }}>
            {en ? 'Muted supporting text' : 'muted 辅助文字'}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-md px-3 py-1.5 text-xs font-medium"
              style={{ background: t.accent, color: '#fafaf7' }}
            >
              {en ? 'Accent' : 'Accent'}
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-xs font-medium"
              style={{ borderColor: t.danger, color: t.danger, background: 'transparent' }}
            >
              {en ? 'Danger' : 'Danger'}
            </button>
          </div>
          <div className="mt-3 rounded-md p-2 text-[10px]" style={{ background: t.raised, color: t.muted }}>
            raised · {en ? 'nested panel' : '嵌套面板'}
          </div>
        </div>
      </div>

      <ul data-anatomy="1" className="mt-3 space-y-1">
        {ROLE_KEYS.map((key) => (
          <li key={key} className="flex items-center gap-2 rounded-md bg-code-bg px-2 py-1">
            <span className="h-3.5 w-3.5 rounded-sm border border-line" style={{ background: t[key] }} />
            <code className="font-mono text-[10px] text-ink-2">--color-{key}</code>
            <code className="ml-auto font-mono text-[9px] text-ink-3">{t[key]}</code>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-center text-[11px] text-ink-3">
        {en
          ? 'Same roles, four value tables — components never see the hex.'
          : '同一套角色，四张取值表——组件从不接触具体色值。'}
      </p>
    </div>
  );
};

const SemanticVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-2">
    {(['light', 'dark'] as ThemeId[]).map((id) => {
      const t = THEMES[id].tokens;
      return (
        <article key={id} className="rounded-xl border p-3" style={{ background: t.bg, borderColor: t.line, color: t.text }}>
          <p className="specimen-eyebrow" style={{ color: t.muted }}>
            {en ? THEMES[id].en : THEMES[id].zh} · dual theme
          </p>
          <p className="mt-2 rounded-md p-2 text-[11px]" style={{ background: t.surface, color: t.text, border: `1px solid ${t.line}` }}>
            text-on-surface
          </p>
          <p className="mt-1 rounded-md p-2 text-[11px]" style={{ background: t.accent, color: '#fafaf7' }}>
            text-on-accent
          </p>
        </article>
      );
    })}
  </div>
);

const SemanticColorDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <SemanticVariants en={en} />;
  return <SemanticMain en={en} />;
};

export default SemanticColorDemo;
