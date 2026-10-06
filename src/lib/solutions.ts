import { solutionVariantLabel, type VariantScope } from "./solution-variant.ts";

/** A chosen preview and its implementation brief, stored only in this browser. */
export interface SavedSolution {
  id: string;
  conceptId: string;
  conceptType: string;
  name: string;
  locale: "zh" | "en";
  styleId: string;
  styleName: string;
  mode: string;
  modeName?: string;
  variant: string;
  variantName?: string;
  variantScope?: VariantScope;
  previewVariant?: string;
  previewVariantName?: string;
  requirements: string[];
  prompt: string;
  group: string;
  note: string;
  url: string;
  createdAt: number;
}

export type SolutionDraft = Omit<SavedSolution, "id" | "createdAt">;
export interface SolutionSaveAttempt {
  signature: string;
  id: string;
  createdAt: number;
  persisted: boolean;
}

/** 草稿内容未变时，失败重试必须沿用同一条记录的身份。 */
export function solutionDraftSignature(draft: SolutionDraft): string {
  return JSON.stringify([
    draft.conceptId,
    draft.conceptType,
    draft.name,
    draft.locale,
    draft.styleId,
    draft.styleName,
    draft.mode,
    draft.modeName ?? "",
    draft.variant,
    draft.variantName ?? "",
    draft.variantScope ?? "",
    draft.previewVariant ?? "",
    draft.previewVariantName ?? "",
    draft.requirements,
    draft.prompt,
    draft.group.trim(),
    draft.note.trim(),
    draft.url,
  ]);
}

export function saveSolutionDraft(
  draft: SolutionDraft,
  previous: SolutionSaveAttempt | null,
): SolutionSaveAttempt {
  const signature = solutionDraftSignature(draft);
  const sameDraft = previous?.signature === signature;
  const id = sameDraft ? previous.id : crypto.randomUUID();
  const createdAt = sameDraft ? previous.createdAt : Date.now();
  return {
    signature,
    id,
    createdAt,
    persisted: saveSolution({ ...draft, id, createdAt }),
  };
}

const KEY = "ia-solutions-v1";
const EMPTY: SavedSolution[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cache = EMPTY;
type Mutation =
  | { type: "save" | "import"; item: SavedSolution }
  | { type: "remove"; id: string }
  | {
      type: "edit";
      id: string;
      changes: Partial<Pick<SavedSolution, "group" | "note">>;
    };
let lastDisk: SavedSolution[] = EMPTY;
let pending: Mutation[] = [];
let storageBroken = false;
let bound = false;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeSolutions(listener: () => void) {
  if (!bound && typeof window !== "undefined") {
    bound = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== KEY && event.key !== null) return;
      // Rebase pending operations on the fresh disk value without discarding local edits.
      cachedRaw = undefined;
      emit();
    });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function safeUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value || /[\\\s<>]/.test(value))
    return false;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://atlas.invalid";
  if (!value.startsWith("/") && !/^https?:\/\//.test(value)) return false;
  try {
    const url = new URL(value, origin);
    return url.origin === origin && /^https?:$/.test(url.protocol);
  } catch {
    return false;
  }
}

function isSolution(value: unknown): value is SavedSolution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  const strings = [
    "id",
    "conceptId",
    "conceptType",
    "name",
    "styleId",
    "styleName",
    "mode",
    "variant",
    "prompt",
    "group",
    "note",
  ];
  return (
    strings.every((field) => typeof item[field] === "string") &&
    Boolean(item.id && item.conceptId && item.conceptType && item.name) &&
    (item.locale === "zh" || item.locale === "en") &&
    typeof item.createdAt === "number" &&
    Number.isFinite(item.createdAt) &&
    item.createdAt >= 0 &&
    Array.isArray(item.requirements) &&
    item.requirements.every((text) => typeof text === "string") &&
    (item.modeName === undefined || typeof item.modeName === "string") &&
    (item.variantName === undefined || typeof item.variantName === "string") &&
    (item.variantScope === undefined ||
      item.variantScope === "preview" ||
      item.variantScope === "requirement") &&
    (item.previewVariant === undefined ||
      typeof item.previewVariant === "string") &&
    (item.previewVariantName === undefined ||
      typeof item.previewVariantName === "string") &&
    safeUrl(item.url)
  );
}

function parse(raw: string | null): SavedSolution[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    const seen = new Set<string>();
    return parsed.filter(isSolution).filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch {
    return EMPTY;
  }
}

function readDisk(): { items: SavedSolution[]; readable: boolean } {
  try {
    lastDisk = parse(window.localStorage.getItem(KEY));
    storageBroken = pending.length > 0;
    return { items: lastDisk, readable: true };
  } catch {
    storageBroken = true;
    return { items: lastDisk, readable: false };
  }
}

function apply(
  items: SavedSolution[],
  operations: Mutation[],
): SavedSolution[] {
  return operations.reduce((current, operation) => {
    if ("item" in operation) {
      if (
        operation.type === "import" &&
        current.some((item) => item.id === operation.item.id)
      )
        return current;
      return [
        operation.item,
        ...current.filter((item) => item.id !== operation.item.id),
      ];
    }
    if (operation.type === "remove")
      return current.filter((item) => item.id !== operation.id);
    // An edit cannot resurrect an entry another tab removed; unrelated fields remain current.
    return current.map((item) =>
      item.id === operation.id ? { ...item, ...operation.changes } : item,
    );
  }, items);
}

function snapshot(items: SavedSolution[]): SavedSolution[] {
  const raw = JSON.stringify(items);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cache = items;
  }
  return cache;
}

export function getSolutionsSnapshot(): SavedSolution[] {
  if (typeof window === "undefined") return EMPTY;
  return snapshot(apply(readDisk().items, pending));
}

export function getServerSolutionsSnapshot(): SavedSolution[] {
  return EMPTY;
}
export function solutionsStorageAvailable(): boolean {
  return !storageBroken;
}

export function retrySolutionsStorage(): boolean {
  if (typeof window === "undefined") return false;
  const disk = readDisk();
  const items = apply(disk.items, pending);
  // A successful write after a failed read could erase data we never saw.
  if (disk.readable) {
    try {
      if (pending.length)
        window.localStorage.setItem(KEY, JSON.stringify(items));
      lastDisk = items;
      pending = [];
      storageBroken = false;
    } catch {
      storageBroken = true;
    }
  }
  snapshot(items);
  emit();
  return !storageBroken;
}

function mutate(operation: Mutation): boolean {
  if (typeof window === "undefined") return false;
  if ("item" in operation) {
    pending = pending.filter(
      (op) => ("item" in op ? op.item.id : op.id) !== operation.item.id,
    );
  } else if (operation.type === "remove") {
    // Keep earlier unsaved edits so undoing a failed deletion can restore them.
    pending = pending.filter(
      (op) => !(op.type === "remove" && op.id === operation.id),
    );
  }
  pending.push(operation);
  return retrySolutionsStorage();
}

/** False means this browser could not persist the change; it remains in memory. */
export function saveSolution(solution: SavedSolution): boolean {
  if (!isSolution(solution)) return false;
  const item = {
    ...solution,
    requirements: [...solution.requirements],
    group: solution.group.trim(),
    note: solution.note.trim(),
  };
  return mutate({ type: "save", item });
}

export function removeSolution(id: string): boolean {
  return mutate({ type: "remove", id });
}

export function updateSolution(
  id: string,
  changes: Partial<Pick<SavedSolution, "group" | "note">>,
): boolean {
  const item = getSolutionsSnapshot().find((item) => item.id === id);
  if (!item) return false;
  const patch: Partial<Pick<SavedSolution, "group" | "note">> = {};
  if (typeof changes.group === "string" && changes.group.trim() !== item.group)
    patch.group = changes.group.trim();
  if (typeof changes.note === "string" && changes.note.trim() !== item.note)
    patch.note = changes.note.trim();
  return mutate({ type: "edit", id, changes: patch });
}

/** Undo a local deletion without overwriting a record restored or edited by another tab. */
export function restoreSolution(item: SavedSolution): boolean {
  if (!isSolution(item) || typeof window === "undefined") return false;
  pending = pending.filter(
    (op) => !(op.type === "remove" && op.id === item.id),
  );
  pending.push({ type: "import", item });
  return retrySolutionsStorage();
}

export const BACKUP_MAX_BYTES = 5 * 1024 * 1024;
const backupFormat = "interface-atlas-notebook";

export function exportSolutionsBackup(
  items: SavedSolution[],
  base = "",
): string {
  const origin =
    typeof window === "undefined"
      ? "https://atlas.invalid"
      : window.location.origin;
  return JSON.stringify(
    {
      format: backupFormat,
      version: 1,
      base,
      exportedAt: new Date().toISOString(),
      solutions: items.map((item) => {
        const url = new URL(item.url, origin);
        return { ...item, url: url.pathname + url.search + url.hash };
      }),
    },
    null,
    2,
  );
}

/** Validate the whole backup before changing storage; relocate only Atlas detail routes. */
export function readSolutionsBackup(text: string, base = ""): SavedSolution[] {
  if (new TextEncoder().encode(text).byteLength > BACKUP_MAX_BYTES)
    throw new Error("size");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("format");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("format");
  const data = value as Record<string, unknown>;
  if (data.format !== backupFormat || data.version !== 1)
    throw new Error("version");
  if (
    typeof data.base !== "string" ||
    !/^(?:\/[A-Za-z0-9_-]+)*$/.test(data.base)
  )
    throw new Error("format");
  if (!Array.isArray(data.solutions) || data.solutions.length > 2000)
    throw new Error("data");
  const ids = new Set<string>();
  return data.solutions.map((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("data");
    const record = value as Record<string, unknown>;
    if (
      typeof record.url !== "string" ||
      !record.url.startsWith("/") ||
      record.url.startsWith("//") ||
      /[\\\s<>]/.test(record.url)
    )
      throw new Error("url");
    const url = new URL(record.url, "https://atlas.invalid");
    const sourceBase = data.base as string;
    if (sourceBase && !url.pathname.startsWith(sourceBase + "/"))
      throw new Error("url");
    const route = url.pathname.slice(sourceBase.length);
    const match = route.match(
      /^\/(?:en\/)?(components|patterns|pages|styles|motion|foundation|a11y)\/([a-z0-9-]+)\/?$/,
    );
    if (
      !match ||
      match[1] !== record.conceptType ||
      match[2] !== record.conceptId
    )
      throw new Error("url");
    const item = { ...record, url: base + route + url.search + url.hash };
    if (!isSolution(item)) throw new Error("data");
    if (ids.has(item.id)) throw new Error("duplicates");
    ids.add(item.id);
    return item;
  });
}

/** Merge missing IDs only. Existing records and projects are preserved. */
export function importSolutions(items: SavedSolution[]): {
  added: number;
  skipped: number;
  persisted: boolean;
} {
  if (!items.every(isSolution)) throw new Error("data");
  const ids = new Set(getSolutionsSnapshot().map((item) => item.id));
  const incoming = items.filter((item) => !ids.has(item.id));
  // Queue the entire batch and flush once, so an invalid file cannot partly replace the notebook.
  pending.push(...incoming.map((item) => ({ type: "import" as const, item })));
  const persisted = retrySolutionsStorage();
  return {
    added: incoming.length,
    skipped: items.length - incoming.length,
    persisted,
  };
}

function inline(text: string): string {
  return text.replace(/[\\`*_{}[\]<>#|]/g, "\\$&").replace(/\r?\n/g, " ");
}

export function exportSolutionsMarkdown(
  items: SavedSolution[],
  locale: "zh" | "en",
): string {
  const zh = locale === "zh";
  const groups = [...new Set(items.map((item) => item.group))];
  const lines = [
    `# ${zh ? "项目参考册" : "Project notebook"}`,
    "",
    zh
      ? "保存的预览配置与任务说明。运行时输入等临时状态不会恢复。"
      : "Saved preview configurations and implementation briefs. Temporary inputs and runtime state are not restored.",
    "",
  ];
  for (const group of groups) {
    lines.push(`## ${inline(group || (zh ? "未分组" : "Ungrouped"))}`, "");
    for (const item of items.filter((entry) => entry.group === group)) {
      let url = item.url;
      if (typeof window !== "undefined")
        url = new URL(url, window.location.origin).href;
      lines.push(
        `### ${inline(item.name)}`,
        "",
        `- ${zh ? "风格" : "Style"}: ${inline(item.styleName)}`,
        `- ${zh ? "模式" : "Mode"}: ${inline(item.modeName || item.mode)}`,
      );
      if (item.variantScope === "requirement" && item.previewVariant)
        lines.push(
          `- ${zh ? "实际预览形式" : "Actual preview variant"}: ${inline(item.previewVariantName || item.previewVariant)}`,
        );
      if (item.variant)
        lines.push(
          `- ${solutionVariantLabel(item.variantScope, locale)}: ${inline(item.variantName || item.variant)}`,
        );
      if (item.note)
        lines.push(
          `- ${zh ? "选择理由" : "Why this solution"}: ${inline(item.note)}`,
        );
      if (item.requirements.length)
        lines.push(
          `- ${zh ? "要求" : "Requirements"}: ${item.requirements.map(inline).join(" · ")}`,
        );
      lines.push(
        `- [${zh ? "恢复方案" : "Restore solution"}](<${url.replace(/[<>\s]/g, (char) => encodeURIComponent(char))}>)`,
        "",
        `#### ${zh ? "实现任务" : "Implementation brief"}`,
        "",
      );
      // A fence longer than any prompt fence keeps user content inside the code block.
      const runs = item.prompt.match(/`+/g) ?? [];
      const fence = "`".repeat(
        Math.max(3, ...runs.map((run) => run.length + 1)),
      );
      lines.push(`${fence}text`, item.prompt, fence, "");
    }
  }
  return lines.join("\n");
}
