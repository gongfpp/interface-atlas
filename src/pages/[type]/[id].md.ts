import type { APIRoute, GetStaticPaths } from 'astro';
import { CONCEPT_TYPES } from '@/content.config';
import { getConcepts, type Concept } from '@/lib/content';
import { conceptToMarkdown } from '@/lib/concept-markdown';

type Props = { concept: Concept; typeMap: Record<string, string> };

export const getStaticPaths: GetStaticPaths = async () => {
  // 全库 id → 类型索引，供 Markdown 内跨类型引用解析真实地址
  const typeMap: Record<string, string> = {};
  const paths: Array<{ params: { type: string; id: string }; props: Props }> = [];
  for (const type of CONCEPT_TYPES) {
    for (const concept of await getConcepts(type)) {
      typeMap[concept.id] = type;
      paths.push({ params: { type, id: concept.id }, props: { concept, typeMap } });
    }
  }
  return paths;
};

export const GET: APIRoute = ({ props }) => {
  const { concept, typeMap } = props as Props;
  return new Response(conceptToMarkdown(concept, 'zh', (id) => typeMap[id]), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
