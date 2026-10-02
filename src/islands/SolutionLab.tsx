import { useEffect, useRef, useState } from "react";
import type { DemoComponent, DemoMode } from "./DemoStage";
import type { StyleVariantSet } from "./style-variants/types";
import { createSession } from "./style-variants/session";
import {
  PreviewVariantContext,
  type PreviewVariants,
} from "./shared/previewVariant";
import PromptBlock, { type PromptProps } from "./PromptBlock";
import { localePath } from "@/lib/i18n";

const demos = import.meta.glob("./demos/*.tsx");
const variants = import.meta.glob("./style-variants/*.tsx");
const modeNames = {
  default: ["默认", "Default"],
  dark: ["深色", "Dark"],
  loading: ["加载态", "Loading"],
  variants: ["形式", "Variants"],
};
type Props = PromptProps & {
  component: string;
  modes: DemoMode[];
  anatomy: string[];
  conceptType: string;
  name: string;
  forms: { id: string; name: string; note: string }[];
  checks: string[];
};

export default function SolutionLab(props: Props) {
  const { component, locale, modes, anatomy, forms, checks } = props;
  const zh = locale === "zh";
  const [loaded, setLoaded] = useState<{
    Demo: DemoComponent;
    styles: StyleVariantSet;
    previewVariants?: PreviewVariants;
  } | null>(null);
  const [failed, setFailed] = useState(false);

  const [styleId, setStyle] = useState("");
  const [mode, setMode] = useState<DemoMode>("default");
  const [form, setForm] = useState("");
  const [specific, setSpecific] = useState(true);
  const [narrow, setNarrow] = useState(false);
  const [device, setDevice] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(390);
  const [revision, setRevision] = useState(0);
  const [part, setPart] = useState<number | null>(null);
  const [session, setSession] = useState(createSession);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    const styleLoader = variants[`./style-variants/${component}.tsx`];
    Promise.all([
      demos[`./demos/${component}.tsx`](),
      styleLoader ? styleLoader() : Promise.resolve({ default: [] }),
    ])
      .then(([demo, styles]) => {
        if (!alive) return;
        const set = (styles as { default: StyleVariantSet }).default;
        setLoaded({
          Demo: (demo as { default: DemoComponent }).default,
          styles: set,
          previewVariants: (demo as { previewVariants?: PreviewVariants })
            .previewVariants,
        });
        const params = new URLSearchParams(location.search);
        const style = params.get("style") ?? "";
        const nextMode = params.get("mode") as DemoMode;
        setStyle(set.some((s) => s.style === style) ? style : "");
        setMode(modes.includes(nextMode) ? nextMode : "default");
        setForm(
          forms.some((v) => v.id === params.get("form"))
            ? params.get("form")!
            : "",
        );
        setNarrow(params.get("width") === "360");
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [component, modes, forms]);
  if (failed)
    return (
      <div role="alert" className="rounded-xl border border-line p-6">
        {zh ? "实验室加载失败。" : "The lab could not load."}{" "}
        <button
          className="demo-tool"
          onClick={() => {
            location.reload();
          }}
        >
          {zh ? "重新加载页面" : "Reload page"}
        </button>
      </div>
    );
  if (!loaded)
    return <p role="status">{zh ? "正在加载实验室…" : "Loading lab…"}</p>;
  const current = loaded.styles.find((s) => s.style === styleId);
  const interactiveForms =
    !current &&
    (loaded.previewVariants?.modes ?? ["default", "dark"]).includes(mode)
      ? loaded.previewVariants
      : undefined;
  const selectedFormId = interactiveForms
    ? interactiveForms.ids.includes(form)
      ? form
      : (interactiveForms.defaults?.[mode] ?? interactiveForms.default)
    : form;
  const selectedForm = forms.find((v) => v.id === selectedFormId);
  const visibleForms = interactiveForms
    ? forms.filter((v) => interactiveForms.ids.includes(v.id))
    : forms;
  const activeMode = current ? "default" : mode;
  const selection = {
    conceptType: props.conceptType,
    name: props.name,
    styleId: current?.style ?? "",
    styleName: current?.name[locale] ?? (zh ? "基础示例" : "Base example"),
    mode: activeMode,
    modeName: modeNames[activeMode][zh ? 0 : 1],
    variant: selectedFormId,
    variantName: selectedForm?.name ?? "",
    variantNote: selectedForm?.note ?? "",
    note: current?.note[locale] ?? selectedForm?.note ?? "",
    checks,
    narrow,
  };
  const previewURL = `${localePath("/viewport", locale)}?concept=${encodeURIComponent(props.conceptName)}&mode=${activeMode}&style=${encodeURIComponent(styleId)}&form=${encodeURIComponent(selectedFormId)}`;
  return (
    <div className="space-y-5" data-solution-lab>
      <div id="style-variants" className="demo-workbench">
        {loaded.styles.length > 0 && (
          <div className="demo-toolbar">
            <div
              className="flex flex-wrap gap-1"
              role="group"
              aria-label={zh ? "风格变体" : "Style variants"}
            >
              <button
                className="demo-tool"
                aria-pressed={!current}
                onClick={() => {
                  setStyle("");
                  if (current) setForm("");
                  setPart(null);
                }}
              >
                {zh ? "基础示例" : "Base example"}
              </button>
              {loaded.styles.map((s) => (
                <button
                  key={s.style}
                  className="demo-tool"
                  data-style={s.style}
                  aria-pressed={s.style === styleId}
                  onClick={() => {
                    setStyle(s.style);
                    if (!current) setForm("");
                    setPart(null);
                  }}
                >
                  {s.name[locale]}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="demo-toolbar">
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label={zh ? "演示模式" : "Demo mode"}
          >
            {!current &&
              modes.length > 1 &&
              modes.map((m) => (
                <button
                  key={m}
                  className="demo-tool"
                  aria-pressed={mode === m}
                  onClick={() => {
                    setMode(m);
                    if (mode !== m) setForm("");
                    setPart(null);
                  }}
                >
                  {modeNames[m][zh ? 0 : 1]}
                </button>
              ))}
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              className="demo-tool"
              aria-pressed={narrow}
              onClick={() => setNarrow(!narrow)}
            >
              {zh ? "窄容器" : "Narrow container"}
            </button>
            <button
              className="demo-tool"
              aria-expanded={device}
              onClick={() => setDevice(!device)}
            >
              {zh ? "设备视口" : "Device viewport"}
            </button>
            <button
              className="demo-tool"
              onClick={() => {
                setSession(createSession());
                setForm("");
                setRevision((n) => n + 1);
                setPart(null);
              }}
            >
              {zh ? "↺ 重置" : "↺ Reset"}
            </button>
          </div>
        </div>
        <div
          className={`demo-stage-checker demo-canvas ${activeMode === "dark" ? "dark" : ""}`}
        >
          <div className="demo-canvas-caption">
            <span>
              {selection.styleName} · {selection.modeName}
            </span>
            <span>{narrow ? "360 PX" : "RESPONSIVE"}</span>
          </div>
          <div
            className="demo-viewport"
            style={{ maxWidth: narrow ? 360 : "100%" }}
          >
            <div
              className="demo-content"
              key={`${styleId}-${mode}-${revision}`}
              data-active-part={part ?? undefined}
            >
              {current ? (
                <current.Demo locale={locale} session={session} />
              ) : (
                <PreviewVariantContext.Provider
                  value={
                    interactiveForms
                      ? { value: selectedFormId, onChange: setForm }
                      : null
                  }
                >
                  <loaded.Demo mode={mode} locale={locale} />
                </PreviewVariantContext.Provider>
              )}
            </div>
          </div>
          {current && (
            <p className="mt-4 border-t border-line pt-3 text-sm text-ink-2">
              {current.note[locale]}
            </p>
          )}
          {narrow && (
            <p className="mt-3 text-xs text-ink-3">
              {zh
                ? "仅限制内容宽度；固定定位与媒体查询仍使用浏览器视口。"
                : "Only the container is narrower. Fixed positioning and media queries still use the browser viewport."}
            </p>
          )}
        </div>
        {!current && anatomy.length > 0 && (
          <div className="demo-anatomy">
            <p className="mb-3 text-xs text-ink-3">
              {zh
                ? "结构拆解 · 悬停或聚焦部位"
                : "Anatomy · hover or focus a part"}
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
      {device && (
        <section
          className="min-w-0 rounded-xl border border-line bg-raised p-4"
          aria-label={zh ? "设备视口预览" : "Device viewport preview"}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm">
              {zh ? "视口宽度" : "Viewport width"}{" "}
              <select
                value={deviceWidth}
                onChange={(e) => setDeviceWidth(Number(e.target.value))}
                className="rounded border border-line bg-paper p-2"
              >
                {[320, 390, 768, 1024].map((w) => (
                  <option key={w} value={w}>
                    {w} px
                  </option>
                ))}
              </select>
            </label>
            <a
              className="text-sm text-accent underline"
              href={previewURL}
              target="_blank"
              rel="noreferrer"
            >
              {zh ? "单独打开预览" : "Open preview separately"} ↗
            </a>
          </div>
          <p className="mb-3 text-xs text-ink-3">
            {zh
              ? "独立页面视口：媒体查询与固定定位按此宽度运行。此处单独试用，不同步临时输入，也不替代真机验证。"
              : "An independent page viewport: media queries and fixed positioning use this width. Inputs are independent; this does not replace testing on a real device."}
          </p>
          <div className="max-w-full overflow-x-auto rounded-lg border border-line bg-code-bg p-2">
            <iframe
              title={
                zh
                  ? "当前方案的设备视口预览"
                  : "Device viewport of the current solution"
              }
              src={previewURL}
              style={{
                width: deviceWidth,
                height: 580,
                maxWidth: "none",
                border: 0,
              }}
            />
          </div>
        </section>
      )}
      <p className="text-xs text-ink-3">
        {zh
          ? "风格间保留该组支持的输入与选择；切换基础示例或演示模式会重置临时交互。"
          : "Style variants retain supported inputs and selections. Switching to the base example or a different mode resets temporary interaction state."}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-raised p-4">
        <div>
          <p className="font-medium">
            {zh ? "看中这个效果了？" : "Found your direction?"}
          </p>
          <p className="mt-1 text-xs text-ink-3">
            {zh
              ? "把当前风格与状态带入实现说明，或存进项目参考册。"
              : "Take this style and state into your implementation brief, or save it to a project."}
          </p>
        </div>
        <button
          className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white"
          onClick={() => {
            setSpecific(true);
            output.current?.scrollIntoView({
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
              block: "start",
            });
            output.current?.focus({ preventScroll: true });
          }}
        >
          {zh ? "使用当前方案" : "Use current solution"} ↓
        </button>
      </div>
      <div
        id="prompts"
        ref={output}
        tabIndex={-1}
        className="scroll-mt-24 rounded-xl focus-visible:outline-accent"
      >
        <h3 className="mb-3 font-serif text-xl font-semibold">
          {zh ? "带到你的项目里" : "Take it into your project"}
        </h3>
        {forms.length > 0 && (
          <label className="mb-3 block text-sm text-ink-2">
            {zh
              ? interactiveForms
                ? "预览形式（与上方演示同步）"
                : "实现形式（附加要求，不改变上方演示）"
              : interactiveForms
                ? "Preview variant (synced with the demo)"
                : "Implementation variant (a requirement, not a preview control)"}
            <select
              className="ml-2 max-w-full rounded-lg border border-line bg-paper p-2"
              value={selectedFormId}
              onChange={(e) => setForm(e.target.value)}
            >
              {!interactiveForms && (
                <option value="">
                  {zh ? "沿用演示形式" : "As demonstrated"}
                </option>
              )}
              {visibleForms.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <PromptBlock
          {...props}
          selection={selection}
          solutionScope={specific}
          onSolutionScopeChange={setSpecific}
        />
        <p className="mt-3 text-xs text-ink-3">
          {zh
            ? "保存的方案保留风格、形式与实现要求；演示中的临时输入不会保存。"
            : "Saved solutions keep style, variant and requirements. Temporary demo input is not stored."}{" "}
          <a
            className="text-accent underline"
            href={localePath("/saved", locale)}
          >
            {zh ? "打开项目参考册" : "Open project notebook"} →
          </a>
        </p>
      </div>
    </div>
  );
}
