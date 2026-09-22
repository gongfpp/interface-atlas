import { useId, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [period, setPeriod] = useState(1);
  const id = useId();
  const labels = en ? ["Week", "Month", "Year"] : ["周", "月", "年"];
  const values = [
    [20, 40, 35, 60, 45, 70, 50],
    [35, 50, 45, 80, 60, 90, 70],
    [40, 60, 70, 55, 80, 95, 90],
  ];
  return (
    <div className="specimen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="specimen-eyebrow">STUDIO ANALYTICS</p>
          <h3 className="specimen-title">
            {en ? "Creative momentum" : "每一步，都有进展"}
          </h3>
        </div>
        <fieldset
          data-anatomy="1"
          className={`flex gap-1 p-1 ${mode === "variants" ? "rounded-full border border-line" : "rounded-lg bg-code-bg"}`}
        >
          <legend className="sr-only">{en ? "Time range" : "统计周期"}</legend>
          {labels.map((label, i) => (
            <label key={label} className="relative cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name={id}
                checked={period === i}
                onChange={() => setPeriod(i)}
              />
              <span
                data-anatomy={period === i ? "2" : undefined}
                className="block rounded-md px-4 py-2 text-xs text-ink-2 peer-checked:bg-raised peer-checked:text-accent peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-accent"
              >
                {label}
              </span>
            </label>
          ))}
        </fieldset>
      </div>
      <div data-anatomy="3" aria-live="polite">
        <p className="mt-5 text-4xl font-semibold">
          {[128, 512, 6144][period].toLocaleString()}{" "}
          <span className="text-xs font-normal text-ink-2">
            {en ? "completed tasks" : "项任务已完成"}
          </span>
        </p>
        <div aria-hidden="true" className="mt-6 flex h-28 items-end gap-3">
          {values[period].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-accent/25 transition-all last:bg-accent"
              style={{ height: `${v}%` }}
            />
          ))}
        </div>
        <p className="specimen-note mt-3">
          {en
            ? `Viewing: ${labels[period]} · sample data`
            : `当前：按${labels[period]}查看 · 示例数据`}
        </p>
      </div>
    </div>
  );
};
export default Demo;
