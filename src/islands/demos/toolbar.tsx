import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'icon' | 'formatting' | 'contextual';
type Toggle = 'bold' | 'italic' | 'underline' | 'align-left' | 'align-center';

const TOGGLES: { id: Toggle; icon: string; labelZh: string; labelEn: string }[] = [
  { id: 'bold', icon: 'B', labelZh: '加粗', labelEn: 'Bold' },
  { id: 'italic', icon: 'I', labelZh: '斜体', labelEn: 'Italic' },
  { id: 'underline', icon: 'U', labelZh: '下划线', labelEn: 'Underline' },
  { id: 'align-left', icon: '☰', labelZh: '左对齐', labelEn: 'Align left' },
  { id: 'align-center', icon: '≡', labelZh: '居中', labelEn: 'Align center' },
];

function ToolbarDemoInner({
  en,
  variant,
  onVariant,
}: {
  en: boolean;
  variant: Variant;
  onVariant?: (v: Variant) => void;
}) {
  const [on, setOn] = useState<Set<Toggle>>(new Set(['bold']));
  const [text, setText] = useState(
    en ? 'Select me to show the contextual bar.' : '选中这段文字试试上下文工具条。',
  );
  const [selected, setSelected] = useState(false);
  const [log, setLog] = useState<string | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: Toggle) => {
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showContextual = variant === 'contextual' && selected;
  const hideBar = variant === 'contextual' && !selected;

  const onList = variant === 'icon';
  const buttons = onList
    ? TOGGLES.slice(0, 3)
    : TOGGLES;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-line bg-paper p-4">
      {onVariant && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(
            [
              ['icon', en ? 'Icon' : '图标工具条'],
              ['formatting', en ? 'Formatting' : '排版工具条'],
              ['contextual', en ? 'Contextual' : '上下文'],
            ] as [Variant, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={variant === v}
              onClick={() => onVariant(v)}
              className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                variant === v
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-ink-2 hover:border-accent hover:text-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!hideBar && (
        <div
          data-anatomy="1"
          ref={regionRef}
          role="toolbar"
          aria-label={en ? 'Text actions' : '文本操作'}
          className="flex flex-wrap items-center gap-0.5 rounded-lg border border-line bg-raised p-1"
          onKeyDown={(e) => {
            const idx = btnRefs.current.findIndex((b) => b === document.activeElement);
            if (idx < 0) return;
            let next: number;
            if (e.key === 'ArrowRight') next = (idx + 1) % buttons.length;
            else if (e.key === 'ArrowLeft') next = (idx - 1 + buttons.length) % buttons.length;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = buttons.length - 1;
            else return;
            e.preventDefault();
            btnRefs.current[next]?.focus();
          }}
          style={{
            animation: showContextual
              ? 'tb-pop calc(160ms * var(--demo-speed, 1)) both'
              : undefined,
          }}
        >
          {buttons.map((b, i) => (
            <span key={b.id} className="flex items-center">
              {i === 3 && (
                <span
                  aria-hidden="true"
                  data-anatomy="3"
                  className="mx-1 h-5 w-px bg-line"
                />
              )}
              <button
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                data-anatomy="2"
                aria-pressed={on.has(b.id)}
                aria-label={en ? b.labelEn : b.labelZh}
                tabIndex={i === 0 ? 0 : -1}
                onClick={() => {
                  toggle(b.id);
                  setLog(en ? `${b.labelEn} → ${!on.has(b.id)}` : `${b.labelZh} → ${!on.has(b.id)}`);
                }}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors ${
                  b.id === 'italic' ? 'italic' : b.id === 'underline' ? 'underline' : ''
                } ${
                  b.id === 'bold' ? 'font-bold' : ''
                } ${
                  on.has(b.id)
                    ? 'bg-accent/15 text-accent'
                    : 'text-ink-2 hover:bg-code-bg hover:text-ink'
                }`}
              >
                {b.icon}
              </button>
            </span>
          ))}
        </div>
      )}

      {variant === 'contextual' && !selected && (
        <p className="mb-2 text-[11px] text-ink-3">
          {en
            ? 'Toolbar is hidden — select the text below to summon it.'
            : '工具条已隐藏 — 选中下方文字以唤出。'}
        </p>
      )}

      <div className="mt-3">
        <label className="sr-only" htmlFor="tb-demo-text">
          {en ? 'Editable sample' : '示例文本'}
        </label>
        <textarea
          id="tb-demo-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSelect={() => setSelected(true)}
          onBlur={() => window.setTimeout(() => setSelected(false), 120)}
          rows={3}
          className={`w-full resize-none rounded-lg border border-line bg-raised p-3 text-sm outline-none transition-colors focus:border-accent ${
            on.has('bold') ? 'font-bold' : ''
          } ${on.has('italic') ? 'italic' : ''} ${on.has('underline') ? 'underline' : ''} ${
            on.has('align-center') ? 'text-center' : 'text-left'
          } text-ink`}
        />
      </div>

      <p aria-live="polite" className="mt-2 min-h-4 text-[11px] text-ink-3">
        {log
          ? en
            ? `Action · ${log}`
            : `动作 · ${log}`
          : en
            ? 'One tab stop · arrows move inside the strip'
            : '整条一个 Tab 站点 · 方向键在组内移动'}
      </p>
      <style>{`
        @keyframes tb-pop { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}

const ToolbarDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<Variant>(
    mode === 'variants' ? 'icon' : 'formatting',
  );
  return (
    <ToolbarDemoInner
      en={en}
      variant={variant}
      onVariant={mode === 'variants' ? setVariant : undefined}
    />
  );
};

export default ToolbarDemo;
