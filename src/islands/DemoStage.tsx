import { useEffect, useRef, useState } from 'react';

export type DemoMode = 'default' | 'dark' | 'loading' | 'variants';

/**
 * Demo 组件契约：接收 mode，渲染对应状态。
 * 区域高亮：在 Demo 内部元素上标记 data-anatomy="<n>" 即可获得 Anatomy 联动高亮。
 */
export type DemoComponent = (props: { mode: DemoMode }) => React.ReactNode;

const MODE_LABEL: Record<DemoMode, { zh: string; en: string }> = {
  default: { zh: '默认', en: 'Default' },
  dark: { zh: '深色', en: 'Dark' },
  loading: { zh: '加载态', en: 'Loading' },
  variants: { zh: '形式', en: 'Variants' },
};

interface Props {
  component: string;
  modes: DemoMode[];
  locale: 'zh' | 'en';
  anatomy?: string[];
  render: (mode: DemoMode) => React.ReactNode;
}

export default function DemoStage({ component, modes, locale, anatomy = [], render }: Props) {
  const [mode, setMode] = useState<DemoMode>('default');
  const stageRef = useRef<HTMLDivElement>(null);
  const visibleModes = modes.length ? modes : (['default'] as DemoMode[]);

  // Anatomy 联动：hover 列表项时高亮舞台内对应 data-anatomy 区域
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || anatomy.length === 0) return;
    const highlights = stage.querySelectorAll('[data-anatomy]');
    const enter = (i: number) =>
      highlights.forEach((el) => {
        (el as HTMLElement).style.outline = el.getAttribute('data-anatomy') === String(i) ? '2px solid var(--color-accent)' : '';
      });
    const leave = () => highlights.forEach((el) => ((el as HTMLElement).style.outline = ''));
    document.querySelectorAll('[data-anatomy-trigger]').forEach((trigger) => {
      const i = trigger.getAttribute('data-anatomy-trigger');
      trigger.addEventListener('mouseenter', () => enter(Number(i)));
      trigger.addEventListener('mouseleave', leave);
    });
    return () => leave();
  }, [anatomy.length, mode]);

  const inDark = mode === 'dark';

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {visibleModes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              mode === m
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-ink-2 hover:border-line-strong'
            }`}
          >
            {MODE_LABEL[m][locale]}
          </button>
        ))}
      </div>
      <div
        ref={stageRef}
        className={`demo-stage-checker overflow-hidden rounded-xl border border-line p-6 ${
          inDark ? 'dark bg-[#121210]' : ''
        }`}
      >
        <div className={`pointer-events-none text-[10px] uppercase tracking-wider text-ink-3 ${inDark ? 'dark' : ''}`}>
          {component}
        </div>
        {render(mode)}
      </div>
      {anatomy.length > 0 && (
        <ol className="mt-4 grid gap-1 text-sm md:grid-cols-2">
          {anatomy.map((label, i) => (
            <li
              key={`${label}-${i}`}
              data-anatomy-trigger={i + 1}
              className="cursor-default rounded px-2 py-1 transition-colors hover:bg-accent-soft hover:text-accent"
            >
              <span className="mr-2 font-mono text-xs text-ink-3">{i + 1}</span>{label}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
