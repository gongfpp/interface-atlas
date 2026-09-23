import type { APIRoute, GetStaticPaths } from 'astro';
import { CONCEPT_TYPES } from '@/content.config';
import { getConcepts, type Concept } from '@/lib/content';
import { conceptToMarkdown } from '@/lib/concept-markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<{ params: { type: string; id: string }; props: { concept: Concept } }> = [];
  for (const type of CONCEPT_TYPES) {
    for (const concept of await getConcepts(type)) {
      paths.push({ params: { type, id: concept.id }, props: { concept } });
    }
  }
  return paths;
};

export const GET: APIRoute = ({ props }) => {
  const { concept } = props as { concept: Concept };
  return new Response(conceptToMarkdown(concept, 'zh'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
