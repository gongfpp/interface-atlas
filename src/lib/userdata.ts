const SAVED_KEY = 'ia-saved';
const HISTORY_KEY = 'ia-history';
const HISTORY_MAX = 30;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
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
  if (typeof window === 'undefined') return EMPTY;
  return parse(window.localStorage.getItem(key));
}

function writeIds(key: string, ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* 存储不可用时静默 */
  }
  emit();
}

// --- 缓存快照：raw 未变时返回同一引用，满足 useSyncExternalStore 的稳定性要求 ---
let savedRaw: string | null | undefined;
let savedCache: string[] = EMPTY;

/** 收藏快照（useSyncExternalStore getSnapshot） */
export function getSavedSnapshot(): string[] {
  if (typeof window === 'undefined') return EMPTY;
  const raw = window.localStorage.getItem(SAVED_KEY);
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
  const raw = window.localStorage.getItem(HISTORY_KEY);
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
