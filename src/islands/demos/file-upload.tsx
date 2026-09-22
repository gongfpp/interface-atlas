import { useId, useRef, useState } from "react";
import type { DemoComponent } from "@/islands/DemoStage";
const Demo: DemoComponent = ({ mode, locale = "zh" }) => {
  const en = locale === "en";
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  function add(incoming: FileList | null) {
    if (!incoming) return;
    const list = Array.from(incoming);
    const invalid = list.some(
      (f) =>
        !["image/png", "image/jpeg", "application/pdf"].includes(f.type) ||
        f.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setError(
        en
          ? "Choose PNG, JPG or PDF files, each under 5 MB."
          : "请选择 PNG、JPG 或 PDF 文件，每个不超过 5 MB。",
      );
      return;
    }
    setFiles((prev) => [
      ...prev,
      ...list.map((f) => ({ name: f.name, size: f.size })),
    ]);
    setError("");
  }
  return (
    <div className="specimen">
      <p className="specimen-eyebrow">PROJECT ASSETS</p>
      <h3 className="specimen-title">
        {en ? "Bring your inspiration." : "把你的灵感，放在这里。"}
      </h3>
      <div
        data-anatomy="1"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={`mt-6 rounded-xl ${mode === "variants" ? "border border-line p-4" : "border-2 border-dashed p-6 text-center"} ${drag ? "border-accent bg-accent-soft" : "border-line bg-paper"}`}
      >
        <span className="text-3xl text-accent" aria-hidden="true">
          ↑
        </span>
        <p className="my-3 text-sm">
          {en
            ? "Drop files here, or browse your device"
            : "拖拽文件至此，或从设备中选择"}
        </p>
        <label
          htmlFor={id}
          className="specimen-button inline-block cursor-pointer"
        >
          {en ? "Choose files" : "选择文件"}
        </label>
        <input
          ref={ref}
          id={id}
          data-anatomy="2"
          type="file"
          multiple
          accept="image/png,image/jpeg,application/pdf"
          className="mt-3 block w-full text-xs text-ink-2 file:hidden"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="specimen-note mt-3">PNG / JPG / PDF · ≤ 5 MB</p>
      </div>
      <p role="alert" className="mt-3 text-xs text-red-600">
        {error}
      </p>
      <ul data-anatomy="3" className="mt-3 space-y-2">
        {files.map((f, i) => (
          <li
            key={`${f.name}-${i}`}
            className="flex items-center gap-3 rounded-lg border border-line p-3 text-xs"
          >
            <span className="min-w-0 flex-1 truncate">{f.name}</span>
            <span className="text-ink-3">
              {Math.max(1, Math.round(f.size / 1024))} KB
            </span>
            <button
              aria-label={`${en ? "Remove" : "移除"} ${f.name}`}
              className="demo-tool"
              onClick={() => setFiles((v) => v.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="specimen-note mt-3">
        {en
          ? `${files.length} files selected · Local preview only; files are never uploaded.`
          : `已选择 ${files.length} 个文件 · 仅在本页预览，不会上传。`}
      </p>
    </div>
  );
};
export default Demo;
