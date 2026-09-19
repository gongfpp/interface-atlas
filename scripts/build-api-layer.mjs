/**
 * 构建时生成机器可读层（竞品研究改进 #2，源自 21st.dev）：
 * - public/api/concept/<type>/<id>.json —— 每个条目的完整结构化数据
 * - public/llms.txt —— 全库索引，供 Coding Agent / LLM 拉取
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const TYPES = ['components', 'patterns', 'styles', 'pages', 'motion'];
const apiDir = join(root, 'public', 'api', 'concept');
const index = [];

/** 部署子路径（GitHub Pages 项目站点为 /interface-atlas；根部署为空）。 */
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
    index.push({
      id,
      type,
      name: data.name,
      url: `${BASE}/${type}/${id}`,
      api: `${BASE}/api/concept/${type}/${id}.json`,
      summary: data.description?.zh?.slice(0, 80) ?? '',
    });
  }
}

const llms = [
  '# Interface Atlas（界面图谱）',
  '',
  '> Frontend design concept encyclopedia: components, patterns, styles, pages, motion.',
  '> Each concept: bilingual (zh/en) name, description, when/when-not to use, variants, 4-layer agent prompts.',
  '> Fetch any concept as JSON via its `api` URL.',
  '',
  '## Concepts',
  '',
  ...index.map((c) => `- [${c.name.en} / ${c.name.zh}](${c.api}): ${c.summary}`),
  '',
].join('\n');

writeFileSync(join(root, 'public', 'llms.txt'), llms);
console.log(`机器可读层完成：${index.length} 个 JSON + llms.txt`);
