import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type SyntheticEvent,
} from "react";
import { track } from '@/lib/track';
import {
  exportSolutionsMarkdown,
  getServerSolutionsSnapshot,
  getSolutionsSnapshot,
  removeSolution,
  restoreSolution,
  retrySolutionsStorage,
  solutionsStorageAvailable,
  subscribeSolutions,
  updateSolution,
  BACKUP_MAX_BYTES,
  exportSolutionsBackup,
  readSolutionsBackup,
  importSolutions,
  type SavedSolution,
} from "@/lib/solutions";
import { solutionVariantLabel } from "@/lib/solution-variant";
import { BASE, localePath } from "@/lib/i18n";

const control =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

const input =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function SolutionCard({
  item,
  locale,
  report,
  remove,
}: {
  item: SavedSolution;
  locale: "zh" | "en";
  report: (persisted: boolean, action: string) => void;
  remove: (item: SavedSolution) => void;
}) {
  const zh = locale === "zh";
  const [editing, setEditing] = useState<Pick<
    SavedSolution,
    "group" | "note"
  > | null>(null);
  function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const changes: Partial<Pick<SavedSolution, "group" | "note">> = {};
    const group = String(data.get("group") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    if (group !== editing?.group) changes.group = group;
    if (note !== editing?.note) changes.note = note;
    report(
      updateSolution(item.id, changes),
      zh ? "方案已更新。" : "Solution updated.",
    );
    setEditing(null);
  }
  return (
    <article
      tabIndex={-1}
      data-solution-id={item.id}
      className="min-w-0 rounded-xl border border-line bg-raised p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-serif text-lg font-semibold">
            {item.name}
          </h3>
          {item.variantScope === "requirement" && item.previewVariant && (
            <p className="mt-1 text-xs text-ink-3">
              {zh ? "实际预览形式" : "Actual preview variant"}：
              {item.previewVariantName || item.previewVariant}
            </p>
          )}
          <p className="mt-1 break-words text-sm text-ink-2">
            {item.styleName} · {item.modeName || item.mode}
            {item.variant
              ? ` · ${solutionVariantLabel(item.variantScope, locale)}：${item.variantName || item.variant}`
              : ""}
          </p>
        </div>
        <button
          type="button"
          className={control}
          aria-label={`${zh ? "移除方案" : "Remove solution"} ${item.name}`}
          onClick={() => remove(item)}
        >
          {zh ? "移除" : "Remove"}
        </button>
      </div>
      {item.requirements.length > 0 && (
        <ul
          className="mt-3 flex flex-wrap gap-2"
          aria-label={zh ? "方案要求" : "Requirements"}
        >
          {item.requirements.map((requirement, index) => (
            <li
              key={`${requirement}-${index}`}
              className="rounded-md bg-paper px-2 py-1 text-xs text-ink-2"
            >
              {requirement}
            </li>
          ))}
        </ul>
      )}
      {editing ? (
        <form onSubmit={save} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-xs text-ink-2">
            {zh ? "项目分组" : "Project group"}
            <input
              name="group"
              defaultValue={editing.group}
              maxLength={120}
              placeholder={zh ? "例如：个人网站" : "e.g. Personal website"}
              className={input}
            />
          </label>
          <label className="grid gap-1 text-xs text-ink-2">
            {zh ? "选择理由" : "Why this solution"}
            <textarea
              name="note"
              defaultValue={editing.note}
              maxLength={1000}
              rows={3}
              placeholder={
                zh
                  ? "它将用于哪里，为什么适合？"
                  : "Where will you use it, and why?"
              }
              className={input}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={control}>
              {zh ? "保存修改" : "Save changes"}
            </button>
            <button
              type="button"
              className={control}
              onClick={() => setEditing(null)}
            >
              {zh ? "取消" : "Cancel"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-4 break-words text-xs text-ink-3">
            {zh ? "项目" : "Project"} ·{" "}
            {item.group || (zh ? "未分组" : "Ungrouped")}
          </p>
          {item.note && (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink-2">
              {item.note}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              className={`${control} border-accent text-accent`}
              href={item.url}
            >
              {zh ? "恢复方案" : "Restore solution"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className={control}
              onClick={() => setEditing({ group: item.group, note: item.note })}
            >
              {zh ? "编辑分组与理由" : "Edit group and note"}
            </button>
          </div>
        </>
      )}
      <details className="mt-4 border-t border-line pt-3">
        <summary className="cursor-pointer text-xs text-ink-2">
          {zh ? "查看保存的任务说明" : "View saved implementation brief"}
        </summary>
        <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-ink-2">
          {item.prompt}
        </pre>
      </details>
    </article>
  );
}

export default function SolutionNotebook({ locale }: { locale: "zh" | "en" }) {
  const zh = locale === "zh";
  const solutions = useSyncExternalStore(
    subscribeSolutions,
    getSolutionsSnapshot,
    getServerSolutionsSnapshot,
  );
  const available = useSyncExternalStore(
    subscribeSolutions,
    solutionsStorageAvailable,
    () => true,
  );
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const fileInput = useRef<HTMLInputElement>(null);
  const mergeButton = useRef<HTMLButtonElement>(null);
  const importButton = useRef<HTMLButtonElement>(null);
  const undoButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const fileRequest = useRef(0);
  const [removed, setRemoved] = useState<SavedSolution[]>([]);
  const [reading, setReading] = useState(false);
  const [backup, setBackup] = useState<{
    name: string;
    items: SavedSolution[];
  } | null>(null);
  useEffect(
    () => () => {
      fileRequest.current++;
    },
    [],
  );
  useEffect(() => {
    if (removed.length) undoButton.current?.focus();
  }, [removed]);
  useEffect(() => {
    if (backup) mergeButton.current?.focus();
  }, [backup]);
  const [group, setGroup] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const groups = [...new Set(solutions.map((item) => item.group))];
  const activeGroup = group !== null && groups.includes(group) ? group : null;
  const visible =
    activeGroup === null
      ? solutions
      : solutions.filter((item) => item.group === activeGroup);
  function report(persisted: boolean, action: string) {
    setMessage(
      persisted
        ? action
        : zh
          ? "浏览器未能保存修改；当前页面仍可使用，请立即导出备份，刷新后可能丢失。"
          : "The browser could not save this change. Export a backup now; reloading may lose it.",
    );
  }
  async function copy() {
    const markdown = exportSolutionsMarkdown(visible, locale);
    try {
      await navigator.clipboard.writeText(markdown);
      track('notebook-copy', { source: 'notebook-markdown', count: visible.length, outcome: 'success' });
      setManualCopy("");
      setMessage(
        zh
          ? "已复制 Markdown，包含配置、理由和完整任务说明。"
          : "Markdown copied with configurations, notes, and implementation briefs.",
      );
    } catch {
      track('notebook-copy', { source: 'notebook-markdown', count: visible.length, outcome: 'failed' });
      setManualCopy(markdown);
      setMessage(
        zh
          ? "浏览器未允许复制。请从下面的文本框手动复制，或下载 Markdown。"
          : "Clipboard access was unavailable. Copy the text below or download Markdown.",
      );
    }
  }
  function download(json = false) {
    const content = json
      ? exportSolutionsBackup(visible, BASE)
      : exportSolutionsMarkdown(visible, locale);
    const url = URL.createObjectURL(
      new Blob([content], {
        type: json
          ? "application/json;charset=utf-8"
          : "text/markdown;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = json
      ? "interface-atlas-notebook.json"
      : "interface-atlas-notebook.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      json
        ? zh
          ? "已生成可导入的备份，包含当前显示的方案。"
          : "Backup download started for the solutions currently shown."
        : zh
          ? "已生成 Markdown 下载，包含当前显示的方案。"
          : "Markdown download started for the solutions currently shown.",
    );
  }
  function remove(item: SavedSolution) {
    report(
      removeSolution(item.id),
      zh ? "方案已移除，可以撤销。" : "Solution removed. You can undo this.",
    );
    setRemoved((previous) => [...previous, item]);
  }
  function undo() {
    const item = removed.at(-1);
    if (!item) return;
    report(restoreSolution(item), zh ? "方案已恢复。" : "Solution restored.");
    setRemoved((previous) => previous.slice(0, -1));
    setGroup(null);
    if (removed.length === 1)
      requestAnimationFrame(() => {
        const card = Array.from(
          root.current?.querySelectorAll<HTMLElement>("[data-solution-id]") ??
            [],
        ).find((card) => card.dataset.solutionId === item.id);
        card?.focus();
      });
  }
  async function chooseBackup(event: SyntheticEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    const request = ++fileRequest.current;
    setBackup(null);
    setReading(true);
    setMessage("");
    try {
      if (file.size > BACKUP_MAX_BYTES) throw new Error("size");
      const items = readSolutionsBackup(await file.text(), BASE);
      if (request === fileRequest.current)
        setBackup({ name: file.name, items });
    } catch (error) {
      if (request === fileRequest.current)
        setMessage(
          error instanceof Error && error.message === "size"
            ? zh
              ? "备份文件过大，请选择不超过 5 MB 的文件。"
              : "Choose a backup file no larger than 5 MB."
            : zh
              ? "无法读取这份备份。请使用参考册导出的 JSON 备份；原有方案未被修改。"
              : "Could not read this backup. Choose a JSON backup exported by the notebook. Existing solutions were not changed.",
        );
    } finally {
      if (request === fileRequest.current) setReading(false);
    }
  }
  function mergeBackup() {
    if (!backup) return;
    const result = importSolutions(backup.items);
    report(
      result.persisted,
      zh
        ? `已导入 ${result.added} 个方案，跳过 ${result.skipped} 个已有方案。`
        : `Imported ${result.added} solutions; skipped ${result.skipped} existing solutions.`,
    );
    setBackup(null);
    setGroup(null);
    importButton.current?.focus();
  }
  const newCount =
    backup?.items.filter(
      (item) => !solutions.some((existing) => existing.id === item.id),
    ).length ?? 0;
  return (
    <section ref={root} aria-labelledby="solution-notebook-title" data-track-region="solution-notebook">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="solution-notebook-title"
            className="font-serif text-xl font-semibold"
          >
            {zh ? "项目参考册" : "Project notebook"}
            {solutions.length > 0 && (
              <span className="ml-2 text-sm font-normal text-ink-3">
                {solutions.length}
              </span>
            )}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
            {zh
              ? "保留选中的风格、模式、形式与实现说明，再按项目整理。恢复配置时，已输入内容等临时演示状态不会保留。"
              : "Keep selected styles, modes, variants, and implementation briefs, organized by project. Restoring a configuration does not restore temporary demo inputs or runtime state."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {solutions.length > 0 && (
            <>
              <button type="button" className={control} onClick={copy} data-track-label="copy-notebook-markdown">
                {zh ? "复制 Markdown" : "Copy Markdown"}
              </button>
              <button
                type="button"
                className={control}
                onClick={() => download()}
              >
                {zh ? "下载 Markdown" : "Download Markdown"}
              </button>
              <button
                type="button"
                className={control}
                onClick={() => download(true)}
              >
                {zh ? "下载备份" : "Download backup"}
              </button>
            </>
          )}
          <button
            type="button"
            className={control}
            ref={importButton}
            disabled={!ready || reading}
            onClick={() => fileInput.current?.click()}
          >
            {reading
              ? zh
                ? "正在读取…"
                : "Reading…"
              : zh
                ? "导入备份"
                : "Import backup"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="hidden"
            aria-label={zh ? "选择参考册备份" : "Choose notebook backup"}
            onChange={chooseBackup}
          />
        </div>
      </div>
      {!available && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-accent bg-raised p-3 text-sm"
        >
          {zh
            ? "本地存储不可用，当前改动只在本次页面会话中保留。请下载备份，或在存储恢复后重试。"
            : "Local storage is unavailable. Download a backup or retry after storage becomes available."}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() =>
              report(
                retrySolutionsStorage(),
                zh ? "当前更改已保存。" : "Current changes saved.",
              )
            }
          >
            {zh ? "重试保存" : "Retry saving"}
          </button>
        </p>
      )}
      <p role="status" className="mt-3 text-sm text-ink-2">
        {message}
      </p>
      {removed.length > 0 && (
        <button
          ref={undoButton}
          type="button"
          className={control}
          onClick={undo}
        >
          {zh ? "撤销移除" : "Undo removal"} ({removed.length})
        </button>
      )}
      {backup && (
        <div
          className="mt-4 rounded-lg border border-line bg-raised p-4"
          role="region"
          aria-label={zh ? "待导入备份" : "Backup ready to import"}
        >
          <p className="break-words font-medium">{backup.name}</p>
          <p className="mt-2 text-sm">
            {zh
              ? `共有 ${backup.items.length} 个方案，将新增 ${newCount} 个。已有方案会保留。`
              : `${backup.items.length} solutions, ${newCount} new. Existing solutions will be kept.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              ref={mergeButton}
              className={control}
              onClick={mergeBackup}
            >
              {zh ? "合并到参考册" : "Merge into notebook"}
            </button>
            <button
              type="button"
              className={control}
              onClick={() => {
                setBackup(null);
                importButton.current?.focus();
              }}
            >
              {zh ? "取消导入" : "Cancel import"}
            </button>
          </div>
        </div>
      )}
      {manualCopy && (
        <label className="mt-3 grid gap-2 text-sm">
          {zh ? "手动复制 Markdown" : "Copy Markdown manually"}
          <textarea
            readOnly
            value={manualCopy}
            rows={8}
            className={input}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
      {solutions.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6">
          <p className="text-sm leading-relaxed text-ink-2">
            {zh
              ? "在组件实验室选好效果，点击「使用当前方案」，再保存到参考册。每个方案都能写下用途和选择理由。"
              : "Choose a preview in a component lab, use the current solution, then save it to your notebook. Add a project and a reason for each choice."}
          </p>
          <a
            href={localePath("/components", locale)}
            className="mt-3 inline-flex text-sm font-medium text-accent"
          >
            {zh ? "去挑选一个方案 →" : "Find a solution →"}
          </a>
        </div>
      ) : (
        <>
          <label className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-2">
            {zh ? "项目分组" : "Project group"}
            <select
              className={control}
              value={activeGroup === null ? "all" : `group:${activeGroup}`}
              onChange={(event) =>
                setGroup(
                  event.target.value === "all"
                    ? null
                    : event.target.value.slice(6),
                )
              }
            >
              <option value="all">
                {zh ? "全部项目" : "All projects"} ({solutions.length})
              </option>
              {groups.map((name) => (
                <option key={name} value={`group:${name}`}>
                  {name || (zh ? "未分组" : "Ungrouped")} (
                  {solutions.filter((item) => item.group === name).length})
                </option>
              ))}
            </select>
            <span className="text-xs text-ink-3">
              {zh
                ? "复制与下载包含当前显示的方案"
                : "Copy and download include the solutions shown"}
            </span>
          </label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {visible.map((item) => (
              <SolutionCard
                key={item.id}
                item={item}
                locale={locale}
                report={report}
                remove={remove}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
