import { useId, useMemo, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'free-form' | 'autocomplete' | 'file-chips';

const SUGGESTIONS_ZH = ['排版', '排版检查', '配色', '无障碍', '动效', '组件库'];
const SUGGESTIONS_EN = ['typography', 'typesetting', 'color', 'a11y', 'motion', 'kit'];
const FILES_ZH = ['brand-guide.pdf', 'tokens.json', 'icons.svg', 'wireframe.fig'];
const FILES_EN = ['brand-guide.pdf', 'tokens.json', 'icons.svg', 'wireframe.fig'];

function TagField({
  en,
  variant,
  tags,
  setTags,
}: {
  en: boolean;
  variant: Variant;
  tags: string[];
  setTags: (next: string[]) => void;
}) {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const suggestions = en ? SUGGESTIONS_EN : SUGGESTIONS_ZH;
  const filtered = useMemo(() => {
    if (variant !== 'autocomplete') return [];
    const q = value.trim().toLowerCase();
    return suggestions.filter(
      (s) => s.toLowerCase().includes(q) && !tags.includes(s),
    );
  }, [variant, value, suggestions, tags]);
  const open = variant === 'autocomplete' && value.trim().length > 0 && filtered.length > 0;
  const readonly = variant === 'file-chips';

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v || tags.includes(v)) {
      setValue('');
      return;
    }
    setTags([...tags, v]);
    setValue('');
    setActive(0);
  };
  const remove = (t: string) => setTags(tags.filter((x) => x !== t));

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 block text-xs text-ink-2">
        {variant === 'file-chips'
          ? en
            ? 'Attached files'
            : '已附文件'
          : en
            ? 'Topics'
            : '话题标签'}
      </label>
      <div
        data-anatomy="1"
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border border-line bg-raised p-2 transition-colors focus-within:border-accent"
      >
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-code-bg px-2.5 py-1 text-[11px] text-ink"
          >
            <span className="max-w-36 truncate">{t}</span>
            {!readonly && (
              <button
                type="button"
                data-anatomy="3"
                aria-label={`${en ? 'Remove' : '移除'} ${t}`}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(t);
                }}
                className="text-ink-3 transition-colors hover:text-accent"
              >
                ×
              </button>
            )}
          </span>
        ))}
        {!readonly && (
          <input
            ref={inputRef}
            id={id}
            data-anatomy="2"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                if (variant === 'autocomplete' && filtered[active]) add(filtered[active]);
                else if (value.trim()) add(value);
              } else if (e.key === 'Backspace' && !value && tags.length) {
                remove(tags[tags.length - 1]);
              } else if (e.key === 'ArrowDown' && open) {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp' && open) {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Escape' && open) {
                setValue('');
              }
            }}
            placeholder={
              tags.length
                ? ''
                : variant === 'autocomplete'
                  ? en
                    ? 'Type to filter…'
                    : '输入以筛选…'
                  : en
                    ? 'Type and press Enter'
                    : '输入后回车'
            }
            className="min-w-24 flex-1 bg-transparent px-1 text-xs text-ink outline-none placeholder:text-ink-3"
            role={variant === 'autocomplete' ? 'combobox' : undefined}
            aria-expanded={variant === 'autocomplete' ? open : undefined}
            aria-controls={variant === 'autocomplete' ? `${id}-list` : undefined}
            aria-autocomplete={variant === 'autocomplete' ? 'list' : undefined}
          />
        )}
      </div>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-line bg-raised shadow-lg"
        >
          {filtered.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => add(s)}
                className={`block w-full px-3 py-1.5 text-left text-xs transition-colors ${
                  i === active ? 'bg-code-bg text-accent' : 'text-ink-2 hover:bg-code-bg'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p aria-live="polite" className="mt-2 min-h-4 text-[11px] text-ink-3">
        {readonly
          ? en
            ? 'File chips are removable but not editable.'
            : '文件名标签只可移除，不可编辑。'
          : en
            ? 'Enter or comma mints a chip · Backspace removes the last'
            : '回车或逗号生成标签 · Backspace 删除最后一枚'}
        {tags.length ? ` · ${tags.length}` : ''}
      </p>
    </div>
  );
}

const TagInputDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<Variant>(
    mode === 'variants' ? 'free-form' : 'autocomplete',
  );
  const [freeTags, setFreeTags] = useState<string[]>(
    en ? ['urgent', 'ux'] : ['紧急', '体验'],
  );
  const [autoTags, setAutoTags] = useState<string[]>(
    en ? ['color'] : ['配色'],
  );
  const [fileTags, setFileTags] = useState<string[]>(
    en ? FILES_EN.slice(0, 2) : FILES_ZH.slice(0, 2),
  );

  const tags =
    variant === 'free-form' ? freeTags : variant === 'autocomplete' ? autoTags : fileTags;
  const setTags =
    variant === 'free-form'
      ? setFreeTags
      : variant === 'autocomplete'
        ? setAutoTags
        : setFileTags;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-line bg-paper p-4">
      {mode === 'variants' && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(
            [
              ['free-form', en ? 'Free-form' : '自由输入'],
              ['autocomplete', en ? 'Autocomplete' : '自动补全'],
              ['file-chips', en ? 'File chips' : '文件名标签'],
            ] as [Variant, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={variant === v}
              onClick={() => setVariant(v)}
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
      <p className="mb-3 text-xs text-ink-3">
        {variant === 'file-chips'
          ? en
            ? 'Selected files render as removable chips.'
            : '已选文件呈现为可移除的标签。'
          : variant === 'autocomplete'
            ? en
              ? 'Suggestions filter as you type; Enter accepts.'
              : '边输入边筛选候选，回车采纳。'
            : en
              ? 'Free-form tags — no vocabulary check.'
              : '自由输入，不校验词表。'}
      </p>
      <TagField en={en} variant={variant} tags={tags} setTags={setTags} />
    </div>
  );
};

export default TagInputDemo;
