import { useEffect, useState } from "react";
import {
  PreviewVariantContext,
  type PreviewVariants,
} from "./shared/previewVariant";
import { resolveSolutionVariant } from "@/lib/solution-variant";
import type { DemoComponent, DemoMode } from "./DemoStage";
import type { StyleVariantSet } from "./style-variants/types";
import { createSession } from "./style-variants/session";

const demos = import.meta.glob("./demos/*.tsx");
const variants = import.meta.glob("./style-variants/*.tsx");

export default function ViewportPreview({
  locale,
  concepts,
}: {
  locale: "zh" | "en";
  concepts: { id: string; component: string; modes: DemoMode[] }[];
}) {
  const [session] = useState(createSession);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams(location.search);
    const concept = concepts.find((c) => c.id === params.get("concept"));
    const loader = concept && demos[`./demos/${concept.component}.tsx`];
    Promise.resolve()
      .then(async () => {
        if (!loader || !concept) throw new Error("Unknown preview");
        const mode = concept.modes.includes(params.get("mode") as DemoMode)
          ? (params.get("mode") as DemoMode)
          : "default";
        const styleLoader =
          variants[`./style-variants/${concept.component}.tsx`];
        const styles = styleLoader
          ? ((await styleLoader()) as { default: StyleVariantSet }).default
          : [];
        const current = styles.find((s) => s.style === params.get("style"));
        const demoModule = (await loader()) as {
          default: DemoComponent;
          previewVariants?: PreviewVariants;
        };
        const Demo = demoModule.default;
        const capability = demoModule.previewVariants;
        const variant = resolveSolutionVariant({
          forms: capability?.ids.map(id => ({ id, name: id, note: "" })) ?? [],
          requested: params.get("form") ?? "",
          previewRequested: params.get("preview") ?? "",
          mode, styled: Boolean(current), capability,
        });
        if (!alive) return;
        document.documentElement.classList.toggle(
          "dark",
          !current && mode === "dark",
        );
        setContent(
          current ? (
            <current.Demo locale={locale} session={session} />
          ) : (
            <PreviewSample
              Demo={Demo}
              mode={mode}
              locale={locale}
              initial={variant.preview?.id ?? ""}
              controlled={Boolean(variant.preview)}
            />
          ),
        );
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [concepts, locale, session]);
  if (failed)
    return (
      <p role="alert">
        {locale === "zh"
          ? "无法加载该预览，请关闭后重试。"
          : "Could not load this preview. Close it and try again."}
      </p>
    );
  return (
    <main className="min-h-screen bg-paper p-4 text-ink">
      {content ?? (
        <p role="status">
          {locale === "zh" ? "正在加载视口预览…" : "Loading viewport preview…"}
        </p>
      )}
    </main>
  );
}

function PreviewSample({
  Demo,
  mode,
  locale,
  initial,
  controlled,
}: {
  Demo: DemoComponent;
  mode: DemoMode;
  locale: "zh" | "en";
  initial: string;
  controlled: boolean;
}) {
  const [value, onChange] = useState(initial);
  return (
    <PreviewVariantContext.Provider
      value={controlled ? { value, onChange } : null}
    >
      <Demo mode={mode} locale={locale} />
    </PreviewVariantContext.Provider>
  );
}
