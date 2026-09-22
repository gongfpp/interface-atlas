import { useId, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";

const InputDemo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const id = useId();
  const [email, setEmail] = useState("lin@example.com");
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shape, setShape] = useState("outline");
  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const choices = [
    ["outline", "描边", "Outlined"],
    ["filled", "填充", "Filled"],
    ["underline", "下划线", "Underline"],
  ];
  return (
    <div className="specimen">
      <p className="specimen-eyebrow">FORM & STRUCTURE / 01</p>
      <h3 className="specimen-title">
        {en ? "A place for your next idea." : "让好想法，有个开始。"}
      </h3>
      <p className="specimen-note mb-6">
        {en
          ? "Edit the field, clear it, or submit an invalid email to explore feedback."
          : "修改内容、清空输入，或提交错误邮箱，观察状态的变化。"}
      </p>
      <div className="mb-5 flex flex-wrap gap-2">
        {choices.map(([v, zh, english]) => (
          <button
            className="demo-tool border border-line"
            key={v}
            aria-pressed={shape === v}
            onClick={() => setShape(v)}
          >
            {en ? english : zh}
          </button>
        ))}
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          setSaved(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        }}
      >
        <label
          htmlFor={`${id}-email`}
          data-anatomy="1"
          className="mb-2 block text-sm font-medium"
        >
          {en ? "Work email" : "工作邮箱"}
        </label>
        <div className="relative">
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={email}
            data-anatomy="2"
            aria-invalid={invalid}
            aria-describedby={`${id}-hint`}
            onBlur={() => setTouched(true)}
            onChange={(e) => {
              setEmail(e.target.value);
              setSaved(false);
            }}
            placeholder="you@example.com"
            className={`specimen-field pr-12 ${shape === "filled" ? "!bg-code-bg !border-transparent" : shape === "underline" ? "!rounded-none !border-0 !border-b !bg-transparent" : ""} ${invalid ? "!border-red-500" : ""}`}
          />
          {email && (
            <button
              data-anatomy="3"
              type="button"
              aria-label={en ? "Clear email" : "清空邮箱"}
              onClick={() => {
                setEmail("");
                setSaved(false);
                setTouched(false);
                document.getElementById(`${id}-email`)?.focus();
              }}
              className="absolute right-1 top-1 h-10 w-10 text-ink-3"
            >
              ×
            </button>
          )}
        </div>
        <p
          id={`${id}-hint`}
          data-anatomy="4"
          className={`mt-2 min-h-5 text-xs ${invalid ? "text-red-600 dark:text-red-400" : "text-ink-2"}`}
        >
          {invalid
            ? en
              ? "Enter a valid email, for example lin@example.com."
              : "请输入完整邮箱，例如 lin@example.com。"
            : en
              ? "Used for project notifications. Demo only; nothing is sent."
              : "用于接收项目通知。此处仅演示，不会发送邮件。"}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button className="specimen-button">
            {en ? "Save preference →" : "保存偏好 →"}
          </button>
          <p
            role="status"
            className="text-xs text-emerald-700 dark:text-emerald-400"
          >
            {saved
              ? en
                ? "✓ Preference saved in this preview"
                : "✓ 已在当前演示中保存"
              : ""}
          </p>
        </div>
      </form>
      {mode === "variants" && (
        <div className="specimen-grid mt-6 border-t border-line pt-6">
          <label className="relative block pt-2">
            <input placeholder=" " className="specimen-field peer" />
            <span className="absolute left-3 top-0 bg-raised px-1 text-xs text-ink-2 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              {en ? "Floating label" : "浮动标签"}
            </span>
          </label>
          <label className="block rounded-lg border border-line bg-code-bg px-3 py-2">
            <span className="block text-[10px] text-ink-2">
              {en ? "Inset label" : "内嵌标签"}
            </span>
            <input
              className="w-full bg-transparent text-sm outline-none"
              defaultValue={en ? "Autumn design project" : "秋季设计计划"}
            />
          </label>
        </div>
      )}
    </div>
  );
};
export default InputDemo;
