/** A chosen preview and its implementation brief, stored only in this browser. */
export interface SavedSolution {
  id: string;
  conceptId: string;
  conceptType: string;
  name: string;
  locale: 'zh' | 'en';
  styleId: string;
  styleName: string;
  mode: string;
  modeName?: string;
  variant: string;
  variantName?: string;
  requirements: string[];
  prompt: string;
  group: string;
  note: string;
  url: string;
  createdAt: number;
}

export type SolutionDraft = Omit<SavedSolution, 'id' | 'createdAt'>;
export interface SolutionSaveAttempt {
  signature: string;
  id: string;
  createdAt: number;
  persisted: boolean;
}

/** 草稿内容未变时，失败重试必须沿用同一条记录的身份。 */
export function solutionDraftSignature(draft: SolutionDraft): string {
  return JSON.stringify([
    draft.conceptId, draft.conceptType, draft.name, draft.locale,
    draft.styleId, draft.styleName, draft.mode, draft.modeName ?? '',
    draft.variant, draft.variantName ?? '', draft.requirements, draft.prompt,
    draft.group.trim(), draft.note.trim(), draft.url,
  ]);
}

export function saveSolutionDraft(draft: SolutionDraft, previous: SolutionSaveAttempt | null): SolutionSaveAttempt {
  const signature = solutionDraftSignature(draft);
  const sameDraft = previous?.signature === signature;
  const id = sameDraft ? previous.id : crypto.randomUUID();
  const createdAt = sameDraft ? previous.createdAt : Date.now();
  return { signature, id, createdAt, persisted: saveSolution({ ...draft, id, createdAt }) };
}

const KEY = 'ia-solutions-v1';
const EMPTY: SavedSolution[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cache = EMPTY;
let memoryRaw: string | null = null;
let memoryOnly = false;
let storageBroken = false;
let bound = false;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeSolutions(listener: () => void) {
  if (!bound && typeof window !== 'undefined') {
    bound = true;
    window.addEventListener('storage', (event) => {
      if (event.key !== KEY && event.key !== null) return;
      // Do not discard unsaved in-memory work when another tab changes storage.
      if (!memoryOnly) cachedRaw = undefined;
      emit();
    });
  }
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function safeUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value || /[\\\s<>]/.test(value)) return false;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://atlas.invalid';
  if (!value.startsWith('/') && !/^https?:\/\//.test(value)) return false;
  try {
    const url = new URL(value, origin);
    return url.origin === origin && /^https?:$/.test(url.protocol);
  } catch { return false; }
}

function isSolution(value: unknown): value is SavedSolution {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  const strings = ['id', 'conceptId', 'conceptType', 'name', 'styleId', 'styleName', 'mode', 'variant', 'prompt', 'group', 'note'];
  return strings.every((field) => typeof item[field] === 'string')
    && Boolean(item.id && item.conceptId && item.conceptType && item.name)
    && (item.locale === 'zh' || item.locale === 'en')
    && typeof item.createdAt === 'number' && Number.isFinite(item.createdAt) && item.createdAt >= 0
    && Array.isArray(item.requirements) && item.requirements.every((text) => typeof text === 'string')
    && (item.modeName === undefined || typeof item.modeName === 'string')
    && (item.variantName === undefined || typeof item.variantName === 'string')
    && safeUrl(item.url);
}

function parse(raw: string | null): SavedSolution[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(parsed)) return EMPTY;
    const seen = new Set<string>();
    return parsed.filter(isSolution).filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch { return EMPTY; }
}

export function getSolutionsSnapshot(): SavedSolution[] {
  if (typeof window === 'undefined') return EMPTY;
  let raw = memoryRaw;
  if (!memoryOnly) {
    try { raw = window.localStorage.getItem(KEY); }
    catch { storageBroken = true; }
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cache = parse(raw);
    memoryRaw = raw;
  }
  return cache;
}

export function getServerSolutionsSnapshot(): SavedSolution[] { return EMPTY; }
export function solutionsStorageAvailable(): boolean { return !storageBroken; }

function write(items: SavedSolution[]): boolean {
  if (typeof window === 'undefined') return false;
  memoryRaw = JSON.stringify(items);
  try {
    window.localStorage.setItem(KEY, memoryRaw);
    storageBroken = false;
    memoryOnly = false;
  } catch {
    storageBroken = true;
    memoryOnly = true;
  }
  cachedRaw = memoryRaw;
  cache = items;
  emit();
  return !storageBroken;
}

/** False means this browser could not persist the change; it remains in memory. */
export function saveSolution(solution: SavedSolution): boolean {
  if (!isSolution(solution)) return false;
  const next = { ...solution, requirements: [...solution.requirements], group: solution.group.trim(), note: solution.note.trim() };
  return write([next, ...getSolutionsSnapshot().filter((item) => item.id !== next.id)]);
}

export function removeSolution(id: string): boolean {
  return write(getSolutionsSnapshot().filter((item) => item.id !== id));
}

export function updateSolution(id: string, changes: Partial<Pick<SavedSolution, 'group' | 'note'>>): boolean {
  const items = getSolutionsSnapshot();
  if (!items.some((item) => item.id === id)) return false;
  return write(items.map((item) => item.id === id ? {
    ...item,
    group: typeof changes.group === 'string' ? changes.group.trim() : item.group,
    note: typeof changes.note === 'string' ? changes.note.trim() : item.note,
  } : item));
}

function inline(text: string): string { return text.replace(/[\\`*_{}[\]<>#|]/g, '\\$&').replace(/\r?\n/g, ' '); }

export function exportSolutionsMarkdown(items: SavedSolution[], locale: 'zh' | 'en'): string {
  const zh = locale === 'zh';
  const groups = [...new Set(items.map((item) => item.group))];
  const lines = [`# ${zh ? '项目参考册' : 'Project notebook'}`, '', zh ? '保存的预览配置与任务说明。运行时输入等临时状态不会恢复。' : 'Saved preview configurations and implementation briefs. Temporary inputs and runtime state are not restored.', ''];
  for (const group of groups) {
    lines.push(`## ${inline(group || (zh ? '未分组' : 'Ungrouped'))}`, '');
    for (const item of items.filter((entry) => entry.group === group)) {
      let url = item.url;
      if (typeof window !== 'undefined') url = new URL(url, window.location.origin).href;
      lines.push(`### ${inline(item.name)}`, '', `- ${zh ? '风格' : 'Style'}: ${inline(item.styleName)}`, `- ${zh ? '模式' : 'Mode'}: ${inline(item.modeName || item.mode)}`);
      if (item.variant) lines.push(`- ${zh ? '形式' : 'Variant'}: ${inline(item.variantName || item.variant)}`);
      if (item.note) lines.push(`- ${zh ? '选择理由' : 'Why this solution'}: ${inline(item.note)}`);
      if (item.requirements.length) lines.push(`- ${zh ? '要求' : 'Requirements'}: ${item.requirements.map(inline).join(' · ')}`);
      lines.push(`- [${zh ? '恢复方案' : 'Restore solution'}](<${url.replace(/[<>\s]/g, (char) => encodeURIComponent(char))}>)`, '', `#### ${zh ? '实现任务' : 'Implementation brief'}`, '');
      // A fence longer than any prompt fence keeps user content inside the code block.
      const runs = item.prompt.match(/`+/g) ?? [];
      const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
      lines.push(`${fence}text`, item.prompt, fence, '');
    }
  }
  return lines.join('\n');
}
