import { useId, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const NavbarDemo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [joined, setJoined] = useState(false);
  const [appearance, setAppearance] = useState(
    mode === "variants" ? "floating" : "standard",
  );
  const id = useId();
  const links = en
    ? ["Product", "Resources", "Pricing"]
    : ["产品", "资源", "定价"];
  const titles = en
    ? [
        "Make room for better ideas.",
        "A little inspiration goes a long way.",
        "Start small. Grow together.",
      ]
    : [
        "为更好的想法，留点空间。",
        "好设计，从一点灵感开始。",
        "轻松开始，一起成长。",
      ];
  const cards = en
    ? ["Shared canvas", "Design library", "Team workspace"]
    : ["共享画布", "设计素材库", "团队工作区"];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex gap-2">
        {["standard", "floating", "centered"].map((v, i) => (
          <button
            className="demo-tool"
            aria-pressed={v === appearance}
            key={v}
            onClick={() => setAppearance(v)}
          >
            {
              (en
                ? ["Standard", "Floating", "Centered"]
                : ["标准", "悬浮", "居中"])[i]
            }
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-raised p-4">
        <div
          className={`flex flex-wrap items-center gap-3 border-line p-3 ${appearance === "floating" ? "rounded-xl border bg-code-bg shadow-sm" : "border-b"}`}
        >
          <span data-anatomy="1" className="font-serif text-lg font-bold">
            ◈ forma
          </span>
          <nav
            data-anatomy="2"
            aria-label={en ? "Demo navigation" : "示例导航"}
            className={`specimen-desktop flex gap-1 ${appearance === "centered" ? "mx-auto" : ""}`}
          >
            {links.map((link, i) => (
              <button
                key={link}
                aria-current={i === active ? "page" : undefined}
                className={`demo-tool ${active === i ? "bg-accent-soft !text-accent" : ""}`}
                onClick={() => setActive(i)}
              >
                {link}
              </button>
            ))}
          </nav>
          <button
            className="demo-tool ml-auto border border-line"
            aria-label={en ? "Toggle navigation" : "展开导航"}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
          <button
            data-anatomy="4"
            className="specimen-button"
            onClick={() => setJoined(!joined)}
          >
            {joined
              ? en
                ? "✓ Joined"
                : "✓ 已加入"
              : en
                ? "Get started"
                : "开始体验"}
          </button>
        </div>
        {open && (
          <nav
            id={id}
            className="grid gap-1 border-b border-line py-3"
            aria-label={en ? "Expanded navigation" : "展开的导航"}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                document
                  .querySelector<HTMLButtonElement>(`[aria-controls="${id}"]`)
                  ?.focus();
              }
            }}
          >
            {links.map((link, i) => (
              <button
                key={link}
                className="demo-tool text-left"
                onClick={() => {
                  setActive(i);
                  setOpen(false);
                }}
              >
                {link}
              </button>
            ))}
          </nav>
        )}
        <div className="p-4 pt-8">
          <p className="specimen-eyebrow">
            {links[active]} / FOR CREATIVE TEAMS
          </p>
          <h3 className="my-3 max-w-md font-serif text-3xl leading-snug">
            {titles[active]}
          </h3>
          <p className="specimen-note mb-5" role="status">
            {joined
              ? en
                ? "Your demo workspace is ready. Explore the resources below."
                : "演示工作区已准备好，可以探索下方资源。"
              : en
                ? "One shared place to collect, create and collaborate."
                : "在同一个地方，收集灵感、创作与协作。"}
          </p>
          <input
            data-anatomy="3"
            className="specimen-field mb-4"
            aria-label={en ? "Search resources" : "搜索资源"}
            placeholder={en ? "Search resources…" : "搜索下方资源…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {cards
              .filter((x) => x.toLowerCase().includes(query.toLowerCase()))
              .map((x) => (
                <span
                  key={x}
                  className="rounded-lg border border-line bg-paper px-4 py-3 text-xs"
                >
                  ↗ {x}
                </span>
              ))}
            {!cards.some((x) =>
              x.toLowerCase().includes(query.toLowerCase()),
            ) && (
              <p className="specimen-note">
                {en
                  ? "No resources found. Try another keyword."
                  : "没有匹配资源，请换个关键词。"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavbarDemo;
