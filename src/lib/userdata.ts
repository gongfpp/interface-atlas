const SAVED_KEY = 'ia-saved';
const HISTORY_KEY = 'ia-history';
const HISTORY_MAX = 30;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
/** 存储不可用时的内存回退，保证同一会话内读写一致（刷新后不持久化）。 */
const memory = new Map<string, string>();
const pendingWrites = new Set<string>();
const failedReads = new Set<string>();

function emit() {
  for (const listener of listeners) listener();
}

/** 跨标签页同步：另一个标签页写入时刷新缓存并通知订阅者。 */
let crossTabBound = false;
function bindCrossTab() {
  if (crossTabBound || typeof window === 'undefined') return;
  crossTabBound = true;
  window.addEventListener('storage', (e) => {
    if (e.key !== SAVED_KEY && e.key !== HISTORY_KEY && e.key !== null) return;
    // 其他标签页的写入或清空不能丢弃当前页尚未落盘的操作。
    for (const key of [SAVED_KEY, HISTORY_KEY]) {
      if (e.key !== null && e.key !== key) continue;
      if (pendingWrites.has(key)) continue;
      memory.delete(key);
      if (key === SAVED_KEY) savedRaw = undefined;
      else historyRaw = undefined;
    }
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
  return pendingWrites.size === 0 && failedReads.size === 0;
}

function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  if (pendingWrites.has(key)) return memory.get(key) ?? null;
  try {
    const value = window.localStorage.getItem(key);
    failedReads.delete(key);
    if (value === null) memory.delete(key);
    else memory.set(key, value);
    return value;
  } catch {
    failedReads.add(key);
  }
  return memory.get(key) ?? null;
}

function safeSet(key: string, value: string) {
  memory.set(key, value);
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
    pendingWrites.delete(key);
    failedReads.delete(key);
  } catch {
    pendingWrites.add(key);
  }
}

/** 水合时不读取浏览器存储。 */
export function getServerStorageSnapshot(): boolean { return true; }

/** 重试当前页未保存的值，不需要再次切换收藏。 */
export function retryUserdataStorage(): boolean {
  if (typeof window === 'undefined') return false;
  for (const key of [SAVED_KEY, HISTORY_KEY]) {
    if (pendingWrites.has(key)) safeSet(key, memory.get(key) ?? '[]');
    else safeGet(key);
  }
  emit();
  return storageAvailable();
}

function parse(raw: string | null): string[] {
  try {
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readIds(key: string): string[] {
  return parse(safeGet(key));
}

function writeIds(key: string, ids: string[]) {
  safeSet(key, JSON.stringify(ids));
  emit();
}

// --- 缓存快照：raw 未变时返回同一引用，满足 useSyncExternalStore 的稳定性要求 ---
let savedRaw: string | null | undefined;
let savedCache: string[] = EMPTY;

/** 收藏快照（useSyncExternalStore getSnapshot） */
export function getSavedSnapshot(): string[] {
  if (typeof window === 'undefined') return EMPTY;
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
  if (typeof window === 'undefined') return EMPTY;
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
  const ids = readIds(SAVED_KEY).slice();
  const index = ids.indexOf(id);
  if (index >= 0) ids.splice(index, 1);
  else ids.unshift(id);
  writeIds(SAVED_KEY, ids);
  return index < 0;
}

export function removeSaved(id: string) {
  writeIds(
    SAVED_KEY,
    readIds(SAVED_KEY).filter((x) => x !== id),
  );
}

/** 记录浏览历史 */
export function pushHistory(id: string) {
  const next = readIds(HISTORY_KEY).filter((x) => x !== id);
  next.unshift(id);
  writeIds(HISTORY_KEY, next.slice(0, HISTORY_MAX));
}
