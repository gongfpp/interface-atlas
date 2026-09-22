import { useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [track, setTrack] = useState(0);
  const dark = mode === "dark";
  const bg = dark ? "#30363d" : "#e7ebf0";
  const shadow = dark
    ? "8px 8px 18px #22262b,-8px -8px 18px #3e464f"
    : "8px 8px 18px #c5cbd3,-8px -8px 18px #ffffff";
  const inset = dark
    ? "inset 4px 4px 8px #22262b,inset -4px -4px 8px #3e464f"
    : "inset 4px 4px 8px #c5cbd3,inset -4px -4px 8px #fff";
  const tracks = ["Morning light", "A quiet place", "After the rain"];
  return (
    <div
      className="mx-auto max-w-lg rounded-3xl p-8 text-center"
      style={{ background: bg, color: dark ? "#e9edf3" : "#3e4858" }}
    >
      <p className="text-[10px] tracking-[.22em]">STILL / FOCUS PLAYER</p>
      <div
        className="mx-auto my-7 flex h-32 w-32 items-center justify-center rounded-full"
        style={{ boxShadow: shadow }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl text-[#6f83b7]"
          style={{ boxShadow: inset }}
        >
          ♫
        </div>
      </div>
      <h3 className="text-xl font-semibold">{tracks[track]}</h3>
      <p className="mt-2 text-xs opacity-70">
        {en
          ? "Ambient sessions · Preview controls only"
          : "专注时刻 · 仅演示控件，不播放音频"}
      </p>
      <div className="my-7 flex justify-center gap-6">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            aria-label={
              (en
                ? [
                    "Previous track",
                    playing ? "Pause preview" : "Play preview",
                    "Next track",
                  ]
                : ["上一首", playing ? "暂停预览" : "播放预览", "下一首"])[i]
            }
            aria-pressed={i === 1 ? playing : undefined}
            onClick={() =>
              i === 1
                ? setPlaying(!playing)
                : setTrack((t) => (t + (i === 0 ? 2 : 1)) % 3)
            }
            className="h-12 w-12 rounded-full text-sm"
            style={{
              boxShadow: i === 1 && playing ? inset : shadow,
              color: i === 1 ? "#5873aa" : undefined,
            }}
          >
            {["←", playing ? "Ⅱ" : "▶", "→"][i]}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-4 text-xs">
        {en ? "Volume" : "音量"}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="min-w-0 flex-1 accent-[#627cae]"
        />
        <span className="w-8">{volume}%</span>
      </label>
      <p role="status" className="mt-5 text-xs opacity-70">
        {playing
          ? en
            ? "Preview state: playing"
            : "预览状态：播放中"
          : en
            ? "Preview state: paused"
            : "预览状态：已暂停"}
      </p>
    </div>
  );
};
export default Demo;
