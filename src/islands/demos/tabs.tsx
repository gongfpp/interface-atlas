import { useId, useRef, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const TabsDemo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [active, setActive] = useState(0);
  const [style, setStyle] = useState(
    mode === "variants" ? "pill" : "underline",
  );
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = en
    ? ["Overview", "Activity", "Files"]
    : ["项目概览", "最近动态", "设计文件"];
  return (
    <div className="specimen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="specimen-eyebrow">WORKSPACE / ATELIER</p>
        <select
          aria-label={en ? "Tab appearance" : "标签页外观"}
          className="rounded-md border border-line bg-paper px-2 py-1 text-xs"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="underline">{en ? "Underline" : "下划线"}</option>
          <option value="pill">{en ? "Segmented" : "胶囊分段"}</option>
          <option value="card">{en ? "Card" : "卡片式"}</option>
        </select>
      </div>
      <h3 className="specimen-title mb-6">
        {en ? "Brand studio" : "品牌设计工作室"}
      </h3>
      <div
        data-anatomy="1"
        role="tablist"
        aria-label={en ? "Project" : "项目内容"}
        className={`flex gap-1 ${style === "pill" ? "rounded-xl bg-code-bg p-1" : "border-b border-line"}`}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            id={`${id}-tab-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let next: number;
              if (e.key === "ArrowRight") next = (active + 1) % 3;
              else if (e.key === "ArrowLeft") next = (active + 2) % 3;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 2;
              else return;
              e.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
            className={`flex-1 px-2 py-3 text-xs transition-colors ${active === i ? (style === "underline" ? "border-b-2 border-accent text-accent" : "rounded-lg bg-raised text-ink shadow-sm") : "text-ink-2"}`}
            data-anatomy={i === active ? "2" : undefined}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        data-anatomy="3"
        className="min-h-40 pt-6"
      >
        {active === 0 ? (
          <div className="specimen-grid">
            <div className="rounded-xl bg-code-bg p-4">
              <p className="specimen-note">
                {en ? "Design progress" : "设计完成度"}
              </p>
              <p className="my-2 text-3xl font-semibold">
                72<span className="text-lg text-ink-3">%</span>
              </p>
              <progress
                value="72"
                max="100"
                aria-label={en ? "Design progress" : "设计完成度"}
                className="h-1.5 w-full accent-accent"
              />
            </div>
            <div className="p-4">
              <p className="specimen-note">
                {en ? "Next milestone" : "下一个里程碑"}
              </p>
              <p className="mt-2 text-lg font-medium">
                {en ? "Visual review" : "视觉方案评审"}
              </p>
              <p className="specimen-note mt-2">
                {en
                  ? "Friday · 14:00 · 4 collaborators"
                  : "周五 · 14:00 · 4 位协作者"}
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {(active === 1
              ? en
                ? [
                    "Lin updated the color palette",
                    "Alex added 6 components",
                    "You approved the type scale",
                  ]
                : [
                    "林舟更新了品牌色板",
                    "小夏添加了 6 个组件",
                    "你确认了字体层级方案",
                  ]
              : ["Brand guidelines.pdf", "Design system.fig", "Icons.svg"]
            ).map((x, i) => (
              <li
                key={x}
                className="flex items-center gap-3 border-b border-line pb-3 text-sm"
              >
                <span className="text-xs text-accent">0{i + 1}</span>
                {x}
                <span className="ml-auto text-xs text-ink-3">
                  {active === 1 ? `${i + 1}h` : `${i + 1}.2 MB`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="specimen-note mt-3">
        {en
          ? "Use ← →, Home and End while a tab is focused."
          : "聚焦标签后，可用 ← →、Home 和 End 切换。"}
      </p>
    </div>
  );
};
export default TabsDemo;
