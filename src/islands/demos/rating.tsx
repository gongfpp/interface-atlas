import { useId, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);
  const id = useId();
  const labels = en
    ? ["Poor", "Fair", "Good", "Great", "Excellent"]
    : ["不满意", "一般", "不错", "很棒", "非常喜欢"];
  return (
    <div className="specimen text-center">
      <p className="specimen-eyebrow">A MOMENT OF FEEDBACK</p>
      <h3 className="specimen-title">
        {en ? "How was your experience?" : "这次体验，感觉如何？"}
      </h3>
      <p className="specimen-note">
        {en
          ? "Your feedback helps shape the next iteration."
          : "每一点反馈，都会让下一版更好。"}
      </p>
      <fieldset
        data-anatomy="1"
        className="my-7 flex justify-center gap-2"
        onMouseLeave={() => setHover(0)}
      >
        <legend className="sr-only">
          {en ? "Rate your experience" : "为体验评分"}
        </legend>
        {labels.map((label, i) => (
          <label
            key={label}
            className="cursor-pointer"
            onMouseEnter={() => setHover(i + 1)}
          >
            <input
              className="peer sr-only"
              type="radio"
              name={id}
              value={i + 1}
              checked={rating === i + 1}
              onChange={() => {
                setRating(i + 1);
                setSent(false);
              }}
              aria-label={`${i + 1} ${en ? "stars" : "星"} · ${label}`}
            />
            <span
              data-anatomy="2"
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-3xl transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:scale-110 ${(hover || rating) > i ? "text-amber-600 dark:text-amber-400" : "text-ink-3"}`}
            >
              {mode === "variants" ? ["☹", "◔", "◑", "☺", "♡"][i] : "★"}
            </span>
          </label>
        ))}
      </fieldset>
      <p data-anatomy="3" role="status" className="specimen-note mb-5 min-h-6">
        {sent
          ? en
            ? "Thank you! Feedback recorded in this demo."
            : "谢谢！反馈已记录在本次演示中。"
          : hover || rating
            ? labels[(hover || rating) - 1]
            : en
              ? "Choose a rating to continue"
              : "选择一个分数后即可提交"}
      </p>
      <button
        disabled={!rating || sent}
        className="specimen-button"
        onClick={() => setSent(true)}
      >
        {en ? "Submit feedback" : "提交反馈"}
      </button>
    </div>
  );
};
export default Demo;
