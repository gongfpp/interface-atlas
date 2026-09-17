import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { CONCEPT_TYPES, type ConceptType } from '@/content.config';

export type Concept = CollectionEntry<(typeof CONCEPT_TYPES)[number]> & {
  /** 所属 collection 名，即条目类型 */
  conceptType: ConceptType;
};

export async function getConcepts(type: ConceptType): Promise<Concept[]> {
  const entries = await getCollection(type);
  return entries
    .filter((e) => e.data.status === 'published')
    .map((e) => ({ ...e, conceptType: type }));
}

export async function getAllConcepts(): Promise<Concept[]> {
  const all = await Promise.all(CONCEPT_TYPES.map((t) => getConcepts(t)));
  return all.flat();
}

/** related id 可能指向任意类型，全库索引解析 */
export async function resolveRelated(ids: string[]): Promise<Concept[]> {
  const all = await getAllConcepts();
  const byId = new Map(all.map((c) => [c.id, c]));
  return ids.map((id) => byId.get(id)).filter((c): c is Concept => Boolean(c));
}

export async function getConcept(type: ConceptType, id: string): Promise<Concept | undefined> {
  const entry = await getEntry(type, id);
  return entry ? { ...entry, conceptType: type } : undefined;
}

export function conceptPath(concept: Pick<Concept, 'id' | 'conceptType'>, locale: 'zh' | 'en'): string {
  const base = `/${concept.conceptType}/${concept.id}`;
  return locale === 'zh' ? base : `/en${base}`;
}

export const POPULAR_IDS = [
  'command-palette',
  'glassmorphism',
  'bento-grid',
  'skeleton-loading',
  'neobrutalism',
  'scroll-reveal',
];
