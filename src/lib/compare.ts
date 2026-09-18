import { getAllConcepts, type Concept } from '@/lib/content';
import type { Locale } from '@/lib/i18n';

/** 一个 compare 组：成员（按类型→id 排序）与共享维度（顺序取首成员）。 */
export interface CompareGroup {
  group: string;
  members: Concept[];
  dimensions: string[];
}

/** 全部成立的 compare 组（成员 ≥2；CI 已保证 compare 组成员数）。 */
export async function getCompareGroups(): Promise<CompareGroup[]> {
  const all = await getAllConcepts();
  const byGroup = new Map<string, Concept[]>();
  for (const concept of all) {
    const group = concept.data.compare?.group;
    if (!group) continue;
    const list = byGroup.get(group);
    if (list) list.push(concept);
    else byGroup.set(group, [concept]);
  }
  return [...byGroup.entries()]
    .filter(([, members]) => members.length >= 2)
    .map(([group, members]) => ({
      group,
      members,
      dimensions: Object.keys(members[0].data.compare?.dimensions ?? {}),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

export async function getCompareGroup(group: string): Promise<CompareGroup | undefined> {
  return (await getCompareGroups()).find((g) => g.group === group);
}

export function comparePath(group: string, locale: Locale): string {
  const base = `/compare/${group}`;
  return locale === 'zh' ? base : `/en${base}`;
}
