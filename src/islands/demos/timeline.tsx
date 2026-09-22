import { useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [expanded, setExpanded] = useState<number | null>(1);
  const [reverse, setReverse] = useState(false);
  const events = en
    ? [
        ["09:00", "Discovery", "Aligned on audience, goals and scope."],
        [
          "11:30",
          "Visual exploration",
          "Three directions are ready for review.",
        ],
        ["14:00", "Prototype review", "Test the flow, then gather feedback."],
      ]
    : [
        ["09:00", "需求对齐", "明确使用人群、项目目标和交付范围。"],
        ["11:30", "视觉探索", "已完成三个设计方向，等待团队评审。"],
        ["14:00", "原型评审", "先体验完整流程，再汇总改进建议。"],
      ];
  const indices = reverse ? [2, 1, 0] : [0, 1, 2];
  return (
    <div className="specimen">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="specimen-eyebrow">PROJECT JOURNAL</p>
          <h3 className="specimen-title">
            {en ? "A day of making." : "记录创作的每一步。"}
          </h3>
        </div>
        <button
          className="demo-tool border border-line self-center"
          aria-pressed={reverse}
          onClick={() => setReverse(!reverse)}
        >
          {en ? "Reverse order" : "切换顺序"} ↕
        </button>
      </div>
      <ol
        data-anatomy="1"
        className={`mt-6 ${mode === "variants" ? "grid gap-3" : "border-l border-line pl-5"}`}
      >
        {indices.map((i) => (
          <li key={i} className="relative pb-5">
            <span
              data-anatomy="2"
              className={`absolute -left-[25px] top-3 h-2 w-2 rounded-full bg-accent ${mode === "variants" ? "hidden" : ""}`}
            />
            <button
              className="w-full rounded-lg p-2 text-left hover:bg-code-bg"
              aria-expanded={expanded === i}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="specimen-eyebrow">{events[i][0]}</span>
              <span className="mt-1 flex justify-between text-sm font-medium">
                {events[i][1]}
                <span>{expanded === i ? "−" : "+"}</span>
              </span>
            </button>
            {expanded === i && (
              <p data-anatomy="3" className="specimen-note px-2 pt-2">
                {events[i][2]}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
export default Demo;
