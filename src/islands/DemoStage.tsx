import { useState } from "react";

export type DemoMode = "default" | "dark" | "loading" | "variants";
export type DemoComponent = (props: {
  mode: DemoMode;
  locale?: "zh" | "en";
}) => React.ReactNode;
const MODE_LABEL = {
  default: ["默认", "Default"],
  dark: ["深色", "Dark"],
  loading: ["加载态", "Loading"],
  variants: ["形式", "Variants"],
};

interface Props {
  component: string;
  modes: DemoMode[];
  locale: "zh" | "en";
  anatomy?: string[];
  render: (mode: DemoMode) => React.ReactNode;
}

export default function DemoStage({
  component,
  modes,
  locale,
  anatomy = [],
  render,
}: Props) {
  const [mode, setMode] = useState<DemoMode>(modes[0] ?? "default");
  const [narrow, setNarrow] = useState(false);
  const [revision, setRevision] = useState(0);
  const [part, setPart] = useState<number | null>(null);
  const en = locale === "en";
  const visibleModes = modes.length ? modes : (["default"] as DemoMode[]);
  return (
    <div className="demo-workbench">
      <div className="demo-toolbar">
        <div
          className="flex flex-wrap gap-1"
          role="group"
          aria-label={en ? "Demo mode" : "演示模式"}
        >
          {visibleModes.length > 1 && visibleModes.map((m) => (
            <button
              key={m}
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                setPart(null);
              }}
              className="demo-tool"
            >
              {MODE_LABEL[m][en ? 1 : 0]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            className="demo-tool"
            aria-pressed={narrow}
            onClick={() => setNarrow(!narrow)}
          >
            {en ? "Narrow container" : "窄容器"}
          </button>
          <button
            className="demo-tool"
            onClick={() => {
              setRevision((r) => r + 1);
              setPart(null);
            }}
          >
            {en ? "↺ Reset" : "↺ 重置"}
          </button>
        </div>
      </div>
      <div
        className={`demo-stage-checker demo-canvas ${mode === "dark" ? "dark" : ""}`}
      >
        <div className="demo-canvas-caption">
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {en ? "LIVE PREVIEW" : "实时交互"}
          </span>
          <span>
            {narrow ? "360 PX" : "RESPONSIVE"} · {component}
          </span>
        </div>
        <div
          className="demo-viewport"
          style={{ maxWidth: narrow ? 360 : "100%" }}
        >
          <div
            key={`${mode}-${revision}`}
            className="demo-content"
            data-active-part={part ?? undefined}
          >
            {render(mode)}
          </div>
        </div>
      </div>
      {anatomy.length > 0 && (
        <div className="demo-anatomy">
          <p className="mb-3 text-xs text-ink-3">
            {en
              ? "Explore the anatomy · focus or select a part"
              : "结构拆解 · 悬停、聚焦或点选部位"}
          </p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {anatomy.map((label, i) => (
              <li key={label}>
                <button
                  className="anatomy-part"
                  aria-pressed={part === i + 1}
                  onMouseEnter={() => setPart(i + 1)}
                  onMouseLeave={() => setPart(null)}
                  onFocus={() => setPart(i + 1)}
                  onBlur={() => setPart(null)}
                  onClick={() => setPart(i + 1)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
