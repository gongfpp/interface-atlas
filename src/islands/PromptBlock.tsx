import { useMemo, useState } from "react";
import { useClipboard } from "./shared/useClipboard";
import { solutionVariantBrief, solutionVariantLabel, type VariantScope } from "@/lib/solution-variant";
import { beacon, track } from "@/lib/track";
import { saveSolutionDraft, solutionDraftSignature, type SolutionSaveAttempt } from "@/lib/solutions";

type Layer = "basic" | "design" | "implementation" | "agent";

interface StyleOption {
  id: string;
  name: string;
  guide: string;
}

export interface Selection {
  conceptType: string;
  name: string;
  styleId: string;
  styleName: string;
  mode: string;
  modeName: string;
  variant: string;
  variantName: string;
  variantNote: string;
  variantScope?: VariantScope;
  previewVariant?: string;
  previewVariantName?: string;
  note: string;
  checks: string[];
  narrow: boolean;
}
export interface PromptProps {
  prompts: Record<Layer, { zh: string; en: string }>;
  locale: "zh" | "en";
  conceptName: string;
  styles: StyleOption[];
  selection?: Selection;
  solutionScope?: boolean;
  onSolutionScopeChange?: (specific: boolean) => void;
}

const LAYER_LABEL: Record<
  Layer,
  { zh: string; en: string; hint: { zh: string; en: string } }
> = {
  basic: {
    zh: "基础",
    en: "Basic",
    hint: { zh: "描述设计是什么", en: "What the design is" },
  },
  design: {
    zh: "视觉",
    en: "Design",
    hint: { zh: "强调视觉要求", en: "Visual requirements" },
  },
  implementation: {
    zh: "实现",
    en: "Implementation",
    hint: { zh: "强调技术实现", en: "Technical implementation" },
  },
  agent: {
    zh: "Agent 任务",
    en: "Agent task",
    hint: {
      zh: "可直接交给 Coding Agent，可叠加风格与附加要求",
      en: "Hand to your coding agent — stack a style and extra requirements on top",
    },
  },
};

type Toggle = "dark" | "reducedMotion" | "noDeps" | "runChecks";

const TOGGLE_LABEL: Record<Toggle, { zh: string; en: string }> = {
  dark: { zh: "支持深色模式", en: "Dark mode support" },
  reducedMotion: {
    zh: "尊重 prefers-reduced-motion",
    en: "Respect prefers-reduced-motion",
  },
  noDeps: { zh: "不新增依赖", en: "No new dependencies" },
  runChecks: {
    zh: "完成后运行现有检查并列出修改文件",
    en: "Run existing checks and list modified files",
  },
};

export default function PromptBlock({
  prompts,
  locale,
  conceptName,
  styles,
  selection,
  solutionScope,
  onSolutionScopeChange,
}: PromptProps) {
  const zh = locale === "zh";
  const layers = Object.keys(LAYER_LABEL) as Layer[];
  const [layer, setLayer] = useState<Layer>("agent");
  const [styleId, setStyleId] = useState("");
  const [localSpecific, setLocalSpecific] = useState(true);
  const specific = solutionScope ?? localSpecific;
  const setSpecific = onSolutionScopeChange ?? setLocalSpecific;
  const [group, setGroup] = useState("");
  const [note, setNote] = useState("");
  const [saveResult, setSaveResult] = useState<SolutionSaveAttempt | null>(null);
  const current = selection && specific;
  const selectedStyle = current ? selection.styleId : styleId;
  const [toggles, setToggles] = useState<Record<Toggle, boolean>>(() => {
    const requested =
      typeof location !== "undefined" && selection
        ? new URLSearchParams(location.search).get("requirements")
        : null;
    if (requested !== null) {
      const keys = requested.split(",");
      return {
        dark: keys.includes("dark"),
        reducedMotion: keys.includes("reducedMotion"),
        noDeps: keys.includes("noDeps"),
        runChecks: keys.includes("runChecks"),
      };
    }
    return {
      dark: true,
      reducedMotion: true,
      noDeps: true,
      runChecks: true,
    };
  });

  const sourceURL = (() => {
    if (!selection || typeof location === "undefined") return "";
    const url = new URL(location.href);
    url.search = "";
    if (selection.styleId) url.searchParams.set("style", selection.styleId);
    url.searchParams.set("mode", selection.mode);
    if (selection.variant) url.searchParams.set("form", selection.variant);
    if (selection.variantScope === "requirement" && selection.previewVariant) url.searchParams.set("preview", selection.previewVariant);
    if (selection.narrow) url.searchParams.set("width", "360");
    url.searchParams.set(
      "requirements",
      (Object.keys(toggles) as Toggle[]).filter((k) => toggles[k]).join(","),
    );
    url.hash = "playground";
    return url.href;
  })();

  // 只有 Agent 任务层会被风格与附加要求增强；其余三层是纯概念描述。
  const text = useMemo(() => {
    const base = prompts[layer]?.[locale] ?? "";
    if (!current && layer !== "agent") return base;
    const parts: string[] = current
      ? [
          zh
            ? `在当前项目中实现「${selection.name}」的选中方案。先检查现有组件与设计变量，复用项目的技术体系。`
            : `Implement the selected ${selection.name} solution in the current project. Inspect existing components and design tokens and use the project's stack.`,
          "",
          zh
            ? `当前方案：${selection.name} · ${selection.styleName} · ${selection.modeName}`
            : `Current solution: ${selection.name} · ${selection.styleName} · ${selection.modeName}`,
          selection.note || prompts.design[locale],
          zh ? `参考方案：${sourceURL}` : `Reference solution: ${sourceURL}`,
          ...solutionVariantBrief(selection, locale),
          zh ? "交互与验收要求：" : "Interaction and acceptance requirements:",
          ...selection.checks.map((c) => `- ${c}`),
          zh
            ? "- 保留键盘可达与可见焦点，给操作提供明确反馈。"
            : "- Keep keyboard access, visible focus and clear action feedback.",
          selection.mode === "loading"
            ? zh
              ? "- 实现演示中的加载状态，防止重复提交并提供完成或失败反馈。"
              : "- Implement the demonstrated loading state, prevent duplicate submission and report completion or failure."
            : "",
          selection.mode === "dark"
            ? zh
              ? "- 当前选中深色预览，优先还原深色外观。"
              : "- The selected preview is dark; reproduce its dark appearance."
            : "",
          zh
            ? `预览宽度：${selection.narrow ? "360px 窄容器" : "自适应容器"}。另外验证真实手机视口、长内容与缩放。`
            : `Preview width: ${selection.narrow ? "360px container" : "responsive container"}. Also verify a real mobile viewport, long content and zoom.`,
          zh
            ? "按上述选中方案实现，完成后对照参考预览验证外观与交互；标为未预览的附加要求需另外验收。"
            : "Implement this selected specification, then verify appearance and interactions against the reference preview. Check any not-previewed requirements separately.",
        ].filter(Boolean)
      : [base.trim()];
    const style = styles.find((s) => s.id === selectedStyle);
    if (style) {
      parts.push(
        "",
        zh ? `视觉风格：${style.name}` : `Visual style: ${style.name}`,
        style.guide.trim(),
        current
          ? zh
            ? "该风格规范用于补充，不覆盖上方预览描述与附加形式要求；若后两者冲突，以附加形式要求为准。"
            : "Use the style guide as supplementary context. The preview description and additional variant requirements take precedence; if those conflict, follow the additional variant requirements."
          : "",
      );
    }
    const active = (Object.keys(toggles) as Toggle[]).filter((k) => toggles[k]);
    if (active.length) {
      parts.push(
        "",
        zh ? "附加要求：" : "Additional requirements:",
        ...active.map((k) => `- ${TOGGLE_LABEL[k][locale]}`),
      );
    }
    return parts.join("\n");
  }, [
    prompts,
    layer,
    locale,
    styles,
    selectedStyle,
    toggles,
    zh,
    current,
    selection,
    sourceURL,
  ]);

  const { copy, copied, failed } = useClipboard(text, () => {
    track("prompt-copy", {
      concept: conceptName,
      layer,
      style: selectedStyle || "none",
    });
    beacon("/api/log-prompt", { concept: conceptName, layer });
  });

  const draft = selection ? {
    conceptId: conceptName,
    conceptType: selection.conceptType,
    name: selection.name,
    locale,
    styleId: selection.styleId,
    styleName: selection.styleName,
    mode: selection.mode,
    modeName: selection.modeName,
    variantName: selection.variantName,
    variant: selection.variant,
    variantScope: selection.variantScope,
    previewVariant: selection.previewVariant,
    previewVariantName: selection.previewVariantName,
    requirements: (Object.keys(toggles) as Toggle[])
      .filter((k) => toggles[k])
      .map((k) => TOGGLE_LABEL[k][locale]),
    prompt: text,
    group: group.trim() || (zh ? "我的项目" : "My project"),
    note: note.trim(),
    url: sourceURL,
  } : null;
  const signature = draft ? solutionDraftSignature(draft) : "";
  const saved = saveResult?.signature === signature ? saveResult : null;
  const save = () => {
    if (draft) setSaveResult(saveSolutionDraft(draft, saveResult));
  };

  return (
    <div className="rounded-xl border border-line bg-raised">
      {selection && (
        <div className="border-b border-line p-4">
          <div
            className="mb-3 flex flex-wrap gap-2"
            role="group"
            aria-label={zh ? "输出范围" : "Output scope"}
          >
            <button
              className="demo-tool"
              aria-pressed={specific}
              onClick={() => setSpecific(true)}
            >
              {zh ? "当前方案" : "Current solution"}
            </button>
            <button
              className="demo-tool"
              aria-pressed={!specific}
              onClick={() => setSpecific(false)}
            >
              {zh ? "通用概念说明" : "General concept"}
            </button>
          </div>
          <p data-solution-summary className="text-sm font-medium">
            {current
              ? `${zh ? "当前方案" : "Current solution"}：${selection.name} · ${selection.styleName} · ${selection.modeName}${selection.variantName ? ` · ${solutionVariantLabel(selection.variantScope, locale)}：${selection.variantName}` : ""}`
              : zh
                ? "通用说明：不跟随上方演示选择"
                : "General brief: independent of the preview selection"}
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-1 border-b border-line p-2">
        {!current &&
          layers.map((l) => (
            <button
              key={l}
              aria-pressed={layer === l}
              onClick={() => setLayer(l)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                layer === l
                  ? "bg-accent-soft text-accent"
                  : "text-ink-2 hover:bg-code-bg"
              }`}
              title={LAYER_LABEL[l].hint[locale]}
            >
              {LAYER_LABEL[l][locale]}
            </button>
          ))}
        <button
          onClick={copy}
          className="ml-auto rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-85"
        >
          {copied ? "✓" : "⧉"}{" "}
          {copied
            ? zh
              ? "已复制"
              : "Copied"
            : zh
              ? "复制 Prompt"
              : "Copy prompt"}
        </button>
      </div>

      {(current || layer === "agent") && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line p-3">
          {!current && (
            <label className="flex min-w-0 items-center gap-2 text-xs text-ink-3">
              {zh ? "风格" : "Style"}
              <select
                value={styleId}
                onChange={(e) => setStyleId(e.target.value)}
                className="min-w-0 max-w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink outline-none focus:border-accent"
              >
                <option value="">{zh ? "不指定风格" : "No style"}</option>
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(toggles) as Toggle[]).map((k) => (
              <label
                key={k}
                className="flex items-center gap-1.5 text-xs text-ink-2"
              >
                <input
                  type="checkbox"
                  checked={toggles[k]}
                  onChange={(e) =>
                    setToggles((prev) => ({ ...prev, [k]: e.target.checked }))
                  }
                  className="accent-accent"
                />
                {TOGGLE_LABEL[k][locale]}
              </label>
            ))}
          </div>
        </div>
      )}

      <p role="status" className="px-4 pt-2 text-xs text-accent">
        {failed
          ? zh
            ? "无法访问剪贴板，请选中下方文本手动复制。"
            : "Clipboard unavailable. Select the text below to copy manually."
          : copied
            ? zh
              ? "已复制，可粘贴到你的项目中。"
              : "Copied. Paste it into your project."
            : ""}
      </p>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-ink-2">
        {text}
      </pre>
      {current && (
        <div className="space-y-3 border-t border-line p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-ink-2">
              {zh ? "项目分组" : "Project group"}
              <input
                maxLength={80}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder={zh ? "例如：个人网站" : "e.g. Portfolio"}
                className="mt-1 block w-full rounded-lg border border-line bg-paper p-2 text-sm"
              />
            </label>
            <label className="text-xs text-ink-2">
              {zh ? "为什么选它" : "Why this solution"}
              <input
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  zh ? "例如：用于首页主操作" : "e.g. Primary homepage action"
                }
                className="mt-1 block w-full rounded-lg border border-line bg-paper p-2 text-sm"
              />
            </label>
          </div>
          <button
            className="demo-tool"
            onClick={save}
            disabled={saved?.persisted}
          >
            {saved?.persisted
              ? zh
                ? "✓ 已保存方案"
                : "✓ Solution saved"
              : zh
                ? "保存方案"
                : "Save solution"}
          </button>
          <p role="status" className="text-xs text-accent">
            {saved
              ? saved.persisted
                ? zh
                  ? "方案已保存到项目参考册。"
                  : "Solution saved to your project notebook."
                : zh
                  ? "浏览器未能持久保存。请现在复制上方说明；刷新或离开此页可能丢失。"
                  : "Persistent storage is unavailable. Copy the brief above now; reloading or leaving may lose it."
              : ""}
          </p>
        </div>
      )}
      <p className="border-t border-line px-4 py-2 text-[11px] text-ink-3">
        {current
          ? zh
            ? "输出随实验室选择更新；复制前可在上方阅读全文。"
            : "Output follows the lab selection. Review the complete brief above before copying."
          : LAYER_LABEL[layer].hint[locale]}
      </p>
    </div>
  );
}
