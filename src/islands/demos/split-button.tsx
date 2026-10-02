import { usePreviewVariant } from "../shared/previewVariant";
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Item = { id: string; zh: string; en: string };

const ACTIONS: Item[] = [
  { id: 'save', zh: '保存', en: 'Save' },
  { id: 'publish', zh: '保存并发布', en: 'Save and publish' },
  { id: 'template', zh: '存为模板', en: 'Save as template' },
];

const NEW_ITEMS: Item[] = [
  { id: 'page', zh: '新建页面', en: 'New page' },
  { id: 'folder', zh: '新建文件夹', en: 'New folder' },
  { id: 'from-template', zh: '从模板新建', en: 'New from template' },
];

function SplitControl({
  items,
  onPrimary,
  onPick,
  en,
  vertical = false,
  withIcon = false,
  label,
}: {
  items: Item[];
  onPrimary: () => void;
  onPick: (item: Item) => void;
  en: boolean;
  vertical?: boolean;
  withIcon?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const primary = items[0];
  const rest = items.slice(1);
  const primaryLabel = en ? primary.en : primary.zh;

  return (
    <div
      className="relative inline-block"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div
        className={`inline-flex ${vertical ? 'flex-col' : 'flex-row'} overflow-hidden rounded-lg border border-line bg-raised text-xs`}
      >
        <button
          data-anatomy="1"
          type="button"
          onClick={onPrimary}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-ink transition-colors hover:bg-code-bg"
        >
          {withIcon && <span aria-hidden="true">💾</span>}
          {primaryLabel}
        </button>
        <span data-anatomy="2" aria-hidden="true" className={vertical ? 'border-t border-line' : 'border-l border-line'} />
        <button
          data-anatomy="3"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={en ? 'More actions' : '更多动作'}
          onClick={() => setOpen((o) => !o)}
          className={`px-2 py-1.5 text-ink-3 transition-colors hover:bg-code-bg hover:text-accent ${open ? 'bg-code-bg text-accent' : ''}`}
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform"
            style={{
              transform: open ? 'rotate(180deg)' : undefined,
              transitionDuration: 'calc(150ms * var(--demo-speed, 1))',
            }}
          >
            ▾
          </span>
        </button>
      </div>
      {open && (
        <div
          data-anatomy="4"
          role="menu"
          aria-label={label}
          className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-line bg-raised p-1 shadow-lg"
        >
          {rest.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onPick(item);
                setOpen(false);
              }}
              className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-ink-2 transition-colors hover:bg-code-bg"
            >
              {en ? item.en : item.zh}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SplitButtonDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [log, setLog] = useState<string[]>([]);
  const [layout, setLayout] = usePreviewVariant<'horizontal' | 'vertical' | 'with-icon'>('horizontal');

  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 2));

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 text-sm">
        <div className="flex gap-1.5">
          {(
            [
              ['horizontal', en ? 'Horizontal' : '水平'],
              ['vertical', en ? 'Vertical' : '垂直'],
              ['with-icon', en ? 'With icon' : '带图标'],
            ] as ['horizontal' | 'vertical' | 'with-icon', string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={layout === id}
              onClick={() => setLayout(id)}
              className={`rounded-md border px-2 py-1 text-xs ${
                layout === id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <SplitControl
          items={ACTIONS}
          en={en}
          vertical={layout === 'vertical'}
          withIcon={layout === 'with-icon'}
          label={en ? 'Save variants' : '保存变体'}
          onPrimary={() => push(en ? 'Saved' : '已保存')}
          onPick={(item) => push(en ? item.en : item.zh)}
        />
        <p className="text-[11px] text-ink-3">
          {layout === 'vertical'
            ? en
              ? 'Arrow stacks under the face — narrow toolbars.'
              : '箭头堆叠在主区下方，适合窄工具栏。'
            : layout === 'with-icon'
              ? en
                ? 'Icon plus label speeds recognition.'
                : '图标加文案，识别更快。'
              : en
                ? 'Main face and arrow side by side.'
                : '主区与箭头左右并排。'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xs rounded-xl border border-line bg-paper p-4 text-sm">
      <p className="mb-3 text-xs text-ink-3">
        {en ? 'Document actions — default plus variants' : '文档动作 — 默认加同组变体'}
      </p>
      <div className="flex justify-center">
        <SplitControl
          items={ACTIONS}
          en={en}
          label={en ? 'Save variants' : '保存变体'}
          onPrimary={() => push(en ? 'Saved' : '已保存')}
          onPick={(item) => push(en ? item.en : item.zh)}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <SplitControl
          items={NEW_ITEMS}
          en={en}
          withIcon
          label={en ? 'New variants' : '新建变体'}
          onPrimary={() => push(en ? 'New page' : '新建页面')}
          onPick={(item) => push(en ? item.en : item.zh)}
        />
      </div>
      <div className="mt-3 min-h-8 rounded-lg bg-code-bg px-3 py-2 text-xs text-ink-2">
        {log[0] ?? (en ? 'Click the face or the arrow' : '点击主区或箭头试试')}
      </div>
    </div>
  );
};

export default SplitButtonDemo;

export const previewVariants = { ids: ['horizontal', 'vertical', 'with-icon'], default: 'horizontal', modes: ['variants'] };
