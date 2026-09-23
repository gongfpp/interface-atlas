import { useMemo, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const OPTIONS = [
  { zh: '无障碍', en: 'Accessibility' },
  { zh: '动效', en: 'Motion' },
  { zh: '排版', en: 'Typography' },
  { zh: '色彩', en: 'Color' },
  { zh: '图标', en: 'Icons' },
  { zh: '插画', en: 'Illustration' },
];

function LabelChip({
  text,
  onRemove,
}: {
  text: string;
  onRemove: () => void;
}) {
  return (
    <span
      data-anatomy="3"
      className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent"
    >
      {text}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${text}`}
        className="rounded px-0.5 text-ink-3 transition-colors hover:text-accent"
      >
        ×
      </button>
    </span>
  );
}

function MultiSelectField({ en }: { en: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([en ? 'Motion' : '动效']);

  const labels = useMemo(() => OPTIONS.map((o) => (en ? o.en : o.zh)), [en]);
  const filtered = labels.filter((l) =>
    l.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (value: string) =>
    setPicked((p) => (p.includes(value) ? p.filter((x) => x !== value) : [...p, value]));

  return (
    <div
      className="relative w-full max-w-xs text-sm"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div
        data-anatomy="1"
        className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-raised p-1.5"
      >
        {picked.map((p) => (
          <LabelChip key={p} text={p} onRemove={() => toggle(p)} />
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder={picked.length ? '' : en ? 'Pick tags…' : '选择标签…'}
          aria-label={en ? 'Filter tags' : '筛选标签'}
          className="min-w-16 flex-1 bg-transparent px-1 py-0.5 text-xs text-ink outline-none placeholder:text-ink-3"
        />
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((o) => !o)}
          className="rounded px-1 text-ink-3 transition-transform hover:text-accent"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        >
          ▾
        </button>
      </div>
      {open && (
        <ul
          data-anatomy="2"
          role="listbox"
          aria-multiselectable="true"
          aria-label={en ? 'Available tags' : '可选标签'}
          className="absolute z-10 mt-1 max-h-36 w-full overflow-y-auto rounded-lg border border-line bg-raised p-1 shadow-lg"
        >
          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={picked.includes(opt)}
                onClick={() => toggle(opt)}
                className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs ${
                  picked.includes(opt) ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-code-bg'
                }`}
              >
                <span className="truncate">{opt}</span>
                {picked.includes(opt) && <span className="ml-auto pl-2">✓</span>}
              </button>
            </li>
          ))}
          {!filtered.length && (
            <li role="presentation" className="px-2 py-2 text-xs text-ink-3">
              {en ? 'No matching tags.' : '没有匹配的标签。'}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function CheckboxList({ en }: { en: boolean }) {
  const [picked, setPicked] = useState<string[]>([en ? 'Color' : '色彩']);
  const labels = OPTIONS.map((o) => (en ? o.en : o.zh));
  const toggle = (v: string) =>
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5 rounded-lg border border-line bg-raised p-3">
      {labels.map((l) => (
        <label key={l} className="flex cursor-pointer items-center gap-2 text-xs text-ink-2">
          <input
            type="checkbox"
            checked={picked.includes(l)}
            onChange={() => toggle(l)}
            className="accent-[color:var(--color-accent,#0a0)]"
          />
          {l}
        </label>
      ))}
    </div>
  );
}

function DualList({ en }: { en: boolean }) {
  const labels = OPTIONS.map((o) => (en ? o.en : o.zh));
  const [available, setAvailable] = useState(labels.slice(2));
  const [chosen, setChosen] = useState(labels.slice(0, 2));
  const move = (from: string[], to: string[], value: string) => {
    setAvailable(from === available ? from.filter((x) => x !== value) : [...from, value]);
    setChosen(to === chosen ? to.filter((x) => x !== value) : [...to, value]);
  };
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <ul className="h-32 flex-1 overflow-y-auto rounded-lg border border-line bg-raised p-1">
        {available.map((a) => (
          <li key={a}>
            <button
              type="button"
              onClick={() => move(available, chosen, a)}
              className="w-full rounded-md px-2 py-1 text-left text-xs text-ink-2 hover:bg-code-bg"
            >
              {a}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1">
        <button type="button" onClick={() => available[0] && move(available, chosen, available[0])} className="rounded border border-line px-2 py-1 text-xs text-ink-2 hover:border-accent">
          →
        </button>
        <button type="button" onClick={() => chosen[0] && move(chosen, available, chosen[0])} className="rounded border border-line px-2 py-1 text-xs text-ink-2 hover:border-accent">
          ←
        </button>
      </div>
      <ul className="h-32 flex-1 overflow-y-auto rounded-lg border border-line bg-raised p-1">
        {chosen.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => move(chosen, available, c)}
              className="w-full rounded-md px-2 py-1 text-left text-xs text-accent hover:bg-accent-soft"
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MultiSelectDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<'chips' | 'checkbox-list' | 'dual'>('chips');

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3 text-sm">
        <div className="flex gap-1.5">
          {(
            [
              ['chips', 'Chips'],
              ['checkbox-list', 'Checkboxes'],
              ['dual', 'Dual list'],
            ] as ['chips' | 'checkbox-list' | 'dual', string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={variant === id}
              onClick={() => setVariant(id)}
              className={`rounded-md border px-2 py-1 text-xs ${
                variant === id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {variant === 'chips' && <MultiSelectField en={en} />}
        {variant === 'checkbox-list' && <CheckboxList en={en} />}
        {variant === 'dual' && <DualList en={en} />}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xs rounded-xl border border-line bg-paper p-4">
      <p className="mb-2 text-xs font-medium text-ink-2">
        {en ? 'Skills' : '技能标签'}
      </p>
      <MultiSelectField en={en} />
      <p className="mt-3 text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Pick several tags; each chip removes on its own.'
          : '可挑选多个标签，每个标签都能单独移除。'}
      </p>
    </div>
  );
};

export default MultiSelectDemo;
