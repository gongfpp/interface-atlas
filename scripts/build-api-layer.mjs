/**
 * 构建时生成机器可读层：
 * - public/api/concept/<type>/<id>.json —— 每条目的完整结构化数据
 * - public/api/terms.json —— 全库一次性打包（Agent 只需拉这一个文件）
 * - public/llms.txt —— 索引，告诉 LLM 站点结构与取数入口
 * - public/llms-full.txt —— 全库定义级全文（名称/别名/定义/何时用/Agent Prompt 摘要）
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const TYPES = ['components', 'patterns', 'styles', 'pages', 'motion', 'foundation', 'a11y'];
const apiDir = join(root, 'public', 'api', 'concept');
const terms = [];
const index = [];

/** 部署子路径（GitHub Pages 项目站点为 /interface-atlas-web；根部署为空）。 */
const BASE = (process.env.PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

for (const type of TYPES) {
  const dir = join(root, 'src', 'content', type);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  } catch {
    continue;
  }
  mkdirSync(join(apiDir, type), { recursive: true });
  for (const file of files) {
    const data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
    const id = file.replace(/\.yaml$/, '');
    if (data.status && data.status !== 'published') continue;
    const json = JSON.stringify({ id, type, ...data }, null, 2);
    writeFileSync(join(apiDir, type, `${id}.json`), json);
    const entry = {
      id,
      type,
      url: `${BASE}/${type}/${id}`,
      apiUrl: `${BASE}/api/concept/${type}/${id}.json`,
      md: `${BASE}/${type}/${id}.md`,
      ...data,
    };
    terms.push(entry);
    index.push({
      id,
      type,
      name: data.name,
      url: entry.url,
      apiUrl: entry.apiUrl,
      md: entry.md,
      summary: data.description?.zh?.slice(0, 80) ?? '',
    });
  }
}

terms.sort((a, b) => (a.type + a.id).localeCompare(b.type + b.id));

writeFileSync(
  join(root, 'public', 'api', 'terms.json'),
  JSON.stringify(
    {
      generated: new Date().toISOString().slice(0, 10),
      site: 'https://gongfpp.github.io/interface-atlas-web',
      count: terms.length,
      types: TYPES,
      note: 'Full catalog dump. Each term also at api URL and .md twin. llms.txt / llms-full.txt for humans-to-LLM navigation.',
      terms,
    },
    null,
    2,
  ),
);

const llms = [
  '# Interface Atlas（界面图谱）',
  '',
  '> Frontend design concept encyclopedia: components, patterns, styles, pages, motion, foundation, accessibility.',
  '> Each concept: bilingual (zh/en) name, description, when/when-not to use, variants, 4-layer agent prompts.',
  '>',
  '> Machine-readable entry points:',
  '> - `terms.json` — full catalog in one file (start here)',
  '> - `/api/concept/<type>/<id>.json` — one concept as JSON',
  '> - `/<type>/<id>.md` — one concept as Markdown (also `/en/<type>/<id>.md`)',
  '> - `llms-full.txt` — every concept with definition + agent prompt',
  '',
  '## Concepts',
  '',
  ...index.map((c) => `- [${c.name.en} / ${c.name.zh}](${c.apiUrl}): ${c.summary}`),
  '',
].join('\n');

writeFileSync(join(root, 'public', 'llms.txt'), llms);

const full = [
  '# Interface Atlas — Full Catalog',
  '',
  `> ${terms.length} concepts. Per-concept JSON at /api/concept/<type>/<id>.json · Markdown at /<type>/<id>.md`,
  '',
  ...terms.map((c) => {
    const block = [
      `## ${c.type}/${c.id} — ${c.name.en} / ${c.name.zh}`,
      '',
      `- Type: ${c.type} · Aliases: ${(c.aliases || []).join(' · ') || '—'}`,
      `- Page: ${c.url} · JSON: ${c.apiUrl} · MD: ${c.md}`,
      '',
      `**What / 这是什么:** ${c.description?.zh ?? ''}`,
      '',
      `**What (en):** ${c.description?.en ?? ''}`,
      '',
      `**When to use:** ${(c.use_when || []).map((u) => u.zh).join('；')}`,
      '',
      `**When not to use:** ${(c.avoid_when || []).map((u) => u.zh).join('；')}`,
      '',
      `**Agent prompt (zh):**`,
      '',
      '```text',
      c.prompts?.agent?.zh ?? '',
      '```',
      '',
    ];
    return block.join('\n');
  }),
].join('\n');

writeFileSync(join(root, 'public', 'llms-full.txt'), full);
console.log(
  `机器可读层完成：${terms.length} 个 JSON + terms.json + llms.txt + llms-full.txt`,
);
