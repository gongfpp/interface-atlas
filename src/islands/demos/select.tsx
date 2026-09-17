import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const OPTIONS = ['北京 · Asia/Shanghai', '东京 · Asia/Tokyo', '伦敦 · Europe/London', '纽约 · America/New_York'];

const HOBBIES = ['爬山', '摄影', '烹饪', '骑行'];

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-auto text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`}
      style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
    >
      ▾
    </span>
  );
}

function CustomSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(OPTIONS[0]);

  return (
    <div className="relative w-56 text-sm" data-anatomy="1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-raised px-3 text-xs text-ink hover:border-accent"
      >
        <span className="truncate">{value}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          data-anatomy="2"
          role="listbox"
          aria-label="时区"
          className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-line bg-raised p-1 shadow-lg"
        >
          {OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                role="option"
                aria-selected={opt === value}
                data-anatomy={opt === value ? '4' : '3'}
                onClick={() => {
                  setValue(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs ${
                  opt === value ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-code-bg'
                }`}
              >
                <span className="truncate">{opt}</span>
                {opt === value && <span className="ml-auto pl-2">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MultiSelect() {
  const [picked, setPicked] = useState<string[]>(['摄影']);
  const toggle = (h: string) =>
    setPicked((p) => (p.includes(h) ? p.filter((x) => x !== h) : [...p, h]));

  return (
    <div className="text-sm">
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-raised p-1.5">
        {picked.map((p) => (
          <button
            key={p}
            onClick={() => toggle(p)}
            className="flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent"
          >
            {p} <span aria-hidden="true">✕</span>
          </button>
        ))}
        {!picked.length && <span className="px-1 text-xs text-ink-3">未选择</span>}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {HOBBIES.map((h) => (
          <button
            key={h}
            onClick={() => toggle(h)}
            aria-pressed={picked.includes(h)}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              picked.includes(h)
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  );
}

const SelectDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-5 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">原生 Native</p>
          <select className="h-9 w-full rounded-lg border border-line bg-raised px-2 text-xs text-ink" defaultValue={OPTIONS[1]}>
            {OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">多选 Multiple（chips）</p>
          <MultiSelect />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-sm rounded-xl border border-line bg-paper p-4">
      <p className="mb-2 text-xs font-medium text-ink-2">所在时区</p>
      <CustomSelect />
    </div>
  );
};

export default SelectDemo;
