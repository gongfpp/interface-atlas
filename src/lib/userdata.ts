const SAVED_KEY = "ia-saved";
const HISTORY_KEY = "ia-history";
const HISTORY_MAX = 30;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
/** 存储不可用时的内存回退，保证同一会话内读写一致（刷新后不持久化）。 */
const lastDisk = new Map<string, string | null>();
type Mutation = { type: "add" | "remove" | "visit"; id: string };
const pending = new Map<string, Mutation[]>();
const failedReads = new Set<string>();

function emit() {
  for (const listener of listeners) listener();
}

/** 跨标签页同步：另一个标签页写入时刷新缓存并通知订阅者。 */
let crossTabBound = false;
function bindCrossTab() {
  if (crossTabBound || typeof window === "undefined") return;
  crossTabBound = true;
  window.addEventListener("storage", (e) => {
    if (e.key !== SAVED_KEY && e.key !== HISTORY_KEY && e.key !== null) return;
    emit();
  });
}

export function subscribe(cb: () => void) {
  bindCrossTab();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function storageAvailable(): boolean {
  return pending.size === 0 && failedReads.size === 0;
}

function readDisk(key: string): { raw: string | null; readable: boolean } {
  try {
    const raw = window.localStorage.getItem(key);
    lastDisk.set(key, raw);
    failedReads.delete(key);
    return { raw, readable: true };
  } catch {
    failedReads.add(key);
  }
  return { raw: lastDisk.get(key) ?? null, readable: false };
}

function apply(key: string, raw: string | null): string[] {
  return (pending.get(key) ?? []).reduce((ids, op) => {
    const rest = ids.filter((id) => id !== op.id);
    if (op.type === "remove") return rest;
    const next = [op.id, ...rest];
    return op.type === "visit" ? next.slice(0, HISTORY_MAX) : next;
  }, parse(raw));
}

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return JSON.stringify(apply(key, readDisk(key).raw));
}

function flush(key: string) {
  const disk = readDisk(key);
  if (!disk.readable) return;
  if (!pending.has(key)) return;
  const raw = JSON.stringify(apply(key, disk.raw));
  try {
    window.localStorage.setItem(key, raw);
    lastDisk.set(key, raw);
    pending.delete(key);
  } catch {
    /* Pending operations remain available for retry. */
  }
}

function write(key: string, operation: Mutation) {
  if (typeof window === "undefined") return;
  pending.set(key, [
    ...(pending.get(key) ?? []).filter((op) => op.id !== operation.id),
    operation,
  ]);
  flush(key);
  emit();
}

/** 水合时不读取浏览器存储。 */
export function getServerStorageSnapshot(): boolean {
  return true;
}

/** 重试当前页未保存的值，不需要再次切换收藏。 */
export function retryUserdataStorage(): boolean {
  if (typeof window === "undefined") return false;
  for (const key of [SAVED_KEY, HISTORY_KEY]) {
    flush(key);
  }
  emit();
  return storageAvailable();
}

function parse(raw: string | null): string[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readIds(key: string): string[] {
  return parse(safeGet(key));
}

// --- 缓存快照：raw 未变时返回同一引用，满足 useSyncExternalStore 的稳定性要求 ---
let savedRaw: string | null | undefined;
let savedCache: string[] = EMPTY;

/** 收藏快照（useSyncExternalStore getSnapshot） */
export function getSavedSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = safeGet(SAVED_KEY);
  if (raw !== savedRaw) {
    savedRaw = raw;
    savedCache = parse(raw);
  }
  return savedCache;
}

let historyRaw: string | null | undefined;
let historyCache: string[] = EMPTY;

/** 浏览历史快照（最近在最前，去重，上限 30） */
export function getHistorySnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = safeGet(HISTORY_KEY);
  if (raw !== historyRaw) {
    historyRaw = raw;
    historyCache = parse(raw);
  }
  return historyCache;
}

/** 服务端 / 水合阶段快照 */
export function getServerSnapshot(): string[] {
  return EMPTY;
}

/** 切换收藏，返回切换后的状态 */
export function toggleSaved(id: string): boolean {
  const exists = readIds(SAVED_KEY).includes(id);
  write(SAVED_KEY, { type: exists ? "remove" : "add", id });
  return !exists;
}

export function removeSaved(id: string) {
  write(SAVED_KEY, { type: "remove", id });
}

/** 记录浏览历史 */
export function pushHistory(id: string) {
  write(HISTORY_KEY, { type: "visit", id });
}
