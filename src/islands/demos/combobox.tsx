import { useId, useRef, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const options = en
    ? [
        "Editorial",
        "Minimalism",
        "Glassmorphism",
        "Neobrutalism",
        "Organic",
        "Art Deco",
      ]
    : [
        "编辑风格",
        "极简主义",
        "玻璃拟态",
        "新粗野主义",
        "有机自然",
        "装饰艺术",
      ];
  const filtered = options.filter((x) =>
    x.toLowerCase().includes(query.toLowerCase()),
  );
  const pick = (value: string) => {
    setSelected(value);
    setQuery(value);
    setOpen(false);
    input.current?.focus();
  };
  if (mode === "variants")
    return (
      <div className="specimen">
        <p className="specimen-eyebrow">SELECT ONLY / NATIVE</p>
        <h3 className="specimen-title">
          {en ? "Choose from a fixed set." : "从固定选项中选择。"}
        </h3>
        <label className="mb-2 mt-6 block text-sm" htmlFor={id}>
          {en ? "Visual style" : "视觉风格"}
        </label>
        <select
          id={id}
          className="specimen-field"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">{en ? "Choose a style" : "请选择风格"}</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <p role="status" className="specimen-note mt-4">
          {selected
            ? `${en ? "Selected" : "已选择"}：${selected}`
            : en
              ? "No typing needed. Use the native picker."
              : "无需输入，直接使用原生选择器。"}
        </p>
      </div>
    );
  return (
    <div
      className="specimen"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <p className="specimen-eyebrow">FIND YOUR AESTHETIC</p>
      <h3 className="specimen-title">
        {en ? "Pick a direction." : "找到你的设计方向。"}
      </h3>
      <label htmlFor={id} data-anatomy="1" className="mb-2 mt-6 block text-sm">
        {en ? "Visual style" : "视觉风格"}
      </label>
      <div className="relative">
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={
            open && filtered[active] ? `${id}-option-${active}` : undefined
          }
          value={query}
          placeholder={
            en ? "Search or choose a style" : "输入关键词，或直接选择"
          }
          className="specimen-field pr-10"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected("");
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
              setActive((i) =>
                filtered.length
                  ? (i + (e.key === "ArrowDown" ? 1 : filtered.length - 1)) %
                    filtered.length
                  : 0,
              );
            } else if (e.key === "Enter" && open && filtered[active]) {
              e.preventDefault();
              pick(filtered[active]);
            }
          }}
          data-anatomy="2"
        />
        <button
          aria-label={en ? "Clear selection" : "清空选择"}
          className="absolute right-1 top-1 h-10 w-9 text-ink-3"
          onClick={() => {
            setQuery("");
            setSelected("");
            setActive(0);
            setOpen(true);
            input.current?.focus();
          }}
        >
          ×
        </button>
      </div>
      <div className="min-h-52 pt-2">
        {open && (
          <div>
            <ul
              id={`${id}-list`}
              role="listbox"
              aria-label={en ? "Visual styles" : "可选风格"}
              data-anatomy="3"
              className="max-h-44 overflow-auto rounded-xl border border-line bg-raised p-1 shadow-lg"
            >
              {filtered.map((label, i) => (
                <li
                  id={`${id}-option-${i}`}
                  key={label}
                  role="option"
                  aria-selected={selected === label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(label)}
                  onMouseEnter={() => setActive(i)}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm ${i === active ? "bg-accent-soft text-accent" : ""}`}
                >
                  {label}
                </li>
              ))}
            </ul>
            {!filtered.length && (
              <p role="status" className="specimen-note p-3">
                {en
                  ? "No matching styles. Clear the field and try again."
                  : "没有匹配风格，清空后重新选择。"}
              </p>
            )}
          </div>
        )}
        <p className="specimen-note mt-3" role="status">
          {selected
            ? `${en ? "Selected" : "已选择"}：${selected}`
            : en
              ? "Type to filter; ↑ ↓ to navigate; Enter to select."
              : "输入筛选，↑ ↓ 定位，Enter 确认。"}
        </p>
      </div>
    </div>
  );
};
export default Demo;
