import { useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [category, setCategory] = useState(0);
  const [saved, setSaved] = useState(false);
  const palettes =
    mode === "dark"
      ? ["#1d2922", "#edf0dc", "#afbb87"]
      : ["#f1efe5", "#29392b", "#526445"];
  const names = en
    ? ["Objects", "Spaces", "Rituals"]
    : ["日常器物", "自然空间", "生活仪式"];
  return (
    <div
      className="overflow-hidden rounded-[24px] p-6 sm:p-8"
      style={{ background: palettes[0], color: palettes[1] }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-4 border-b pb-5"
        style={{ borderColor: `${palettes[2]}44` }}
      >
        <span className="font-serif text-2xl">
          mori<span className="text-xs"> / 森</span>
        </span>
        <nav className="flex gap-4" aria-label={en ? "Collection" : "作品分类"}>
          {names.map((x, i) => (
            <button
              key={x}
              className="text-xs"
              style={{
                borderBottom:
                  category === i
                    ? `1px solid ${palettes[2]}`
                    : "1px solid transparent",
              }}
              aria-pressed={category === i}
              onClick={() => setCategory(i)}
            >
              {x}
            </button>
          ))}
        </nav>
      </header>
      <div className="specimen-grid items-center py-8">
        <div>
          <p className="text-[10px] tracking-[.22em]">
            SLOW LIVING, THOUGHTFULLY MADE
          </p>
          <h3 className="my-5 font-serif text-4xl leading-tight">
            {en
              ? ["Closer to nature.", "Room to breathe.", "A slower everyday."][
                  category
                ]
              : [
                  "让日常，\n更近自然。",
                  "给生活，\n一些留白。",
                  "让时间，\n慢慢发生。",
                ][category]}
          </h3>
          <p className="max-w-xs text-xs leading-7 opacity-75">
            {en
              ? "Warm materials, quiet shapes and things made to last. A collection for a considered life."
              : "温润的材质、舒展的形态，以及值得长久陪伴的物件。让设计回到生活本来的样子。"}
          </p>
          <button
            className="mt-6 rounded-full px-5 py-3 text-xs"
            style={{ background: palettes[2], color: palettes[0] }}
            onClick={() => setSaved(!saved)}
          >
            {saved
              ? en
                ? "✓ Collection saved"
                : "✓ 已收藏系列"
              : en
                ? "Save this collection ↗"
                : "收藏这个系列 ↗"}
          </button>
        </div>
        <div
          aria-hidden="true"
          className="relative flex h-64 items-end justify-center overflow-hidden rounded-t-[110px] rounded-b-[20px]"
          style={{ background: "linear-gradient(140deg,#d9d9bd,#b3baa2)" }}
        >
          <div
            className="absolute bottom-8 h-36 w-28 rounded-t-[45%] rounded-b-[30%]"
            style={{
              background: "linear-gradient(100deg,#b69067,#e3c7a4 55%,#b69067)",
              boxShadow: "15px 12px 25px #4b523a33",
            }}
          />
          <div className="absolute bottom-36 h-28 w-1 rotate-12 bg-[#566345]" />
          <div className="absolute bottom-48 left-1/2 h-12 w-20 -rotate-12 rounded-[100%_0_100%_0] bg-[#6e7d53]" />
          <div className="absolute bottom-40 right-1/2 h-12 w-16 rotate-12 rounded-[0_100%_0_100%] bg-[#526445]" />
          <span className="absolute bottom-3 text-[9px] tracking-[.2em] text-[#29392b]">
            {names[category]} · NO. 0{category + 1}
          </span>
        </div>
      </div>
      <footer
        className="flex justify-between border-t pt-4 text-[10px]"
        style={{ borderColor: `${palettes[2]}44` }}
      >
        <span>EST. 2026</span>
        <span>
          {en ? "Less noise. More nature." : "少一点喧嚣，多一点自然。"}
        </span>
      </footer>
    </div>
  );
};
export default Demo;
