import { useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [date, setDate] = useState("friday");
  const [reserved, setReserved] = useState(false);
  return (
    <div
      className="relative overflow-hidden p-5 text-[#e8ce92]"
      style={{ background: mode === "variants" ? "#25312e" : "#151c24" }}
    >
      <div className="border border-[#a88b5144] p-6 text-center">
        <p className="text-[10px] tracking-[.35em]">THE AURELIA / EST. 1924</p>
        <svg
          aria-hidden="true"
          viewBox="0 0 400 100"
          className="mx-auto mt-5 h-20 w-full max-w-sm"
          fill="none"
          stroke="#b49456"
          strokeWidth=".7"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <path
              key={i}
              d={`M200 100 L${i * 50} 0 M${80 + i * 10} 100 V${20 + i * 7} H${320 - i * 10} V100`}
            />
          ))}
          <circle cx="200" cy="64" r="26" fill="#151c24" />
          <path d="M180 72 L200 42 L220 72 Z" />
        </svg>
        <h3 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
          {en ? "An evening,\nextraordinary." : "今夜，\n不同寻常。"}
        </h3>
        <p className="mx-auto mt-4 max-w-xs text-xs leading-7 text-[#c7bfae]">
          {en
            ? "An intimate evening of jazz, conversation and considered hospitality."
            : "爵士乐、恰好的交谈与细致的款待，献给值得被记住的夜晚。"}
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
          <select
            aria-label={en ? "Choose an evening" : "选择到访时间"}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setReserved(false);
            }}
            className="min-h-11 border border-[#a88b51] bg-[#151c24] px-4 text-xs text-[#e8ce92]"
          >
            <option value="friday">
              {en ? "Friday · 19:30" : "周五 · 19:30"}
            </option>
            <option value="saturday">
              {en ? "Saturday · 20:00" : "周六 · 20:00"}
            </option>
          </select>
          <button
            onClick={() => setReserved(true)}
            className="border border-[#d7b571] bg-[#d7b571] px-5 py-3 text-xs text-[#151c24]"
          >
            {en ? "Reserve a seat" : "预留席位"}
          </button>
        </div>
        <p role="status" className="mt-4 min-h-6 text-xs">
          {reserved
            ? en
              ? "Your demo reservation is noted. No booking is sent."
              : "已记录演示预约，不会发送真实预订。"
            : "✦"}
        </p>
        <p className="mt-5 border-t border-[#a88b5144] pt-4 text-[9px] tracking-[.3em]">
          MUSIC · CULTURE · CONVERSATION
        </p>
      </div>
    </div>
  );
};
export default Demo;
