import { useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [plan, setPlan] = useState("personal");
  const labels = en
    ? ["Workspace", "Preferences", "Review"]
    : ["创建空间", "选择偏好", "确认信息"];
  return (
    <div className="specimen">
      <p className="specimen-eyebrow">A NEW BEGINNING</p>
      <h3 className="specimen-title">
        {en ? "Your next project starts here." : "新项目，从这里开始。"}
      </h3>
      <ol
        data-anatomy="1"
        className={`my-6 flex gap-3 ${mode === "variants" ? "flex-col" : ""}`}
      >
        {labels.map((label, i) => (
          <li
            key={label}
            className="flex flex-1 items-center gap-2"
            aria-current={i === step ? "step" : undefined}
          >
            <span
              data-anatomy={i === step ? "2" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${i <= step ? "bg-accent text-white" : "bg-code-bg text-ink-2"}`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className="text-xs">{label}</span>
          </li>
        ))}
      </ol>
      <div data-anatomy="3" className="min-h-32">
        {done ? (
          <div role="status">
            <h4 className="text-xl">
              {en ? "✓ Workspace created" : "✓ 工作区已创建"}
            </h4>
            <p className="specimen-note mt-2">
              {en
                ? "This preview is local and does not create an account."
                : "此处仅为本地演示，不会创建真实账号。"}
            </p>
          </div>
        ) : step === 0 ? (
          <label className="text-sm">
            {en ? "Workspace name" : "工作区名称"}
            <input
              className="specimen-field mt-3"
              value={name}
              aria-invalid={error}
              onChange={(e) => {
                setName(e.target.value);
                setError(false);
              }}
              placeholder={en ? "e.g. Design studio" : "例如：设计工作室"}
            />
            {error && (
              <span role="alert" className="mt-2 block text-xs text-red-600">
                {en ? "Please enter a name to continue." : "请输入名称后继续。"}
              </span>
            )}
          </label>
        ) : step === 1 ? (
          <label className="text-sm">
            {en ? "Workspace type" : "工作区用途"}
            <select
              className="specimen-field mt-3"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="personal">
                {en ? "Personal project" : "个人项目"}
              </option>
              <option value="team">
                {en ? "Team collaboration" : "团队协作"}
              </option>
            </select>
          </label>
        ) : (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt>{en ? "Name" : "名称"}</dt>
              <dd className="break-all">{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{en ? "Type" : "用途"}</dt>
              <dd>
                {plan === "personal"
                  ? en
                    ? "Personal"
                    : "个人项目"
                  : en
                    ? "Team"
                    : "团队协作"}
              </dd>
            </div>
          </dl>
        )}
      </div>
      <div data-anatomy="4" className="mt-5 flex justify-between gap-3">
        <button
          className="specimen-button specimen-secondary"
          disabled={step === 0 || done}
          onClick={() => setStep((s) => s - 1)}
        >
          {en ? "Back" : "上一步"}
        </button>
        <button
          className="specimen-button"
          disabled={done}
          onClick={() => {
            if (step === 0 && !name.trim()) {
              setError(true);
              return;
            }
            if (step === 2) setDone(true);
            else setStep((s) => s + 1);
          }}
        >
          {step === 2
            ? en
              ? "Create workspace"
              : "创建工作区"
            : en
              ? "Continue →"
              : "下一步 →"}
        </button>
      </div>
    </div>
  );
};
export default Demo;
