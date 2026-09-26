import { useEffect, useState } from 'react';
import type { LabSession, StyleVariant, StyleVariantSet } from './style-variants/types';
import { createSession } from './style-variants/session';

/**
 * 组件详情页的“不同风格下的它”画廊。
 * 每个组件的变体模块按需加载（import.meta.glob → 独立 chunk），
 * 因此新增一个 src/islands/style-variants/<id>.tsx 就自动出现，无需注册表。
 */
const modules = import.meta.glob('./style-variants/*.tsx');

export default function StyleVariantGallery({
  component,
  locale,
}: {
  component: string;
  locale: 'zh' | 'en';
}) {
  const [variants, setVariants] = useState<StyleVariantSet | null>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [session] = useState<LabSession>(() => createSession());
  const en = locale === 'en';
  const loader = modules[`./style-variants/${component}.tsx`];

  useEffect(() => {
    if (!loader) return;
    let alive = true;
    loader()
      .then((mod) => {
        const set = (mod as { default: StyleVariantSet }).default ?? [];
        // 延迟到下一个宏任务，避免 effect 内同步 setState 触发级联渲染
        setTimeout(() => {
          if (alive) setVariants(set);
        }, 0);
      })
      .catch(() => {
        setTimeout(() => {
          if (alive) setFailed(true);
        }, 0);
      });
    return () => {
      alive = false;
    };
  }, [loader, attempt]);

  if (!loader) return null;

  if (failed) {
    return (
      <div role="alert" className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        <p>{en ? 'Could not load the style variants.' : '风格变体加载失败。'}</p>
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            setVariants(null);
            setAttempt((a) => a + 1);
          }}
          className="mt-3 rounded-full border border-line px-3 py-1 text-xs text-ink-2 hover:border-accent hover:text-accent"
        >
          {en ? 'Retry' : '重试'}
        </button>
      </div>
    );
  }

  if (!variants) {
    return (
      <p role="status" className="text-sm text-ink-3">
        {en ? 'Loading style variants…' : '正在加载风格变体…'}
      </p>
    );
  }
  if (!variants.length) return null;

  const current: StyleVariant = variants[active] ?? variants[0];

  return (
    <div className="demo-workbench">
      <div className="demo-toolbar">
        <div className="flex flex-wrap gap-1" role="group" aria-label={en ? 'Style variants' : '风格变体'}>
          {variants.map((v, i) => (
            <button
              key={v.style}
              type="button"
              data-style={v.style}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className="demo-tool"
            >
              {v.name[locale]}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-ink-3">{current.style}</span>
      </div>
      <div className="demo-canvas">
        <div className="demo-viewport">
          <div key={current.style} className="demo-content">
            <current.Demo session={session} locale={locale} />
          </div>
        </div>
        <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-3">
          {current.note[locale]}
        </p>
      </div>
    </div>
  );
}
