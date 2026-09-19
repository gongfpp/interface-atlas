/**
 * 构建搜索索引（PRD §9）：中英名称 + Alias + Tags + Category + Description 的关键词字段。
 * 产出 public/data/search-docs.json，浏览器首次交互时加载。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const TYPES = ['components', 'patterns', 'styles', 'pages', 'motion'];

function loadGallery() {
  const dir = join(root, 'src', 'content', 'gallery');
  const docs = [];
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  } catch {
    return docs;
  }
  for (const file of files) {
    const data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
    if (data.status && data.status !== 'published') continue;
    docs.push({
      id: file.replace(/\.yaml$/, ''),
      type: 'gallery',
      name: data.name,
      aliases: data.aliases ?? [],
      tags: ['gallery', '灵感图', 'prompt'],
      category: [],
      text: { zh: data.description?.zh ?? '', en: data.description?.en ?? '' },
    });
  }
  return docs;
}

function loadDocs() {
  const docs = [];
  for (const type of TYPES) {
    const dir = join(root, 'src', 'content', type);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
    } catch {
      continue;
    }
    for (const file of files) {
      const data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
      if (data.status && data.status !== 'published') continue;
      const id = file.replace(/\.yaml$/, '');
      docs.push({
        id,
        type,
        name: data.name,
        aliases: data.aliases ?? [],
        tags: data.tags ?? [],
        category: data.category ?? [],
        text: { zh: data.description?.zh ?? '', en: data.description?.en ?? '' },
      });
    }
  }
  return docs;
}

const docs = [...loadDocs(), ...loadGallery()];
console.log(`索引 ${docs.length} 个已发布条目…`);

const outDir = join(root, 'public', 'data');
mkdirSync(outDir, { recursive: true });

const payload = JSON.stringify({ docs });
writeFileSync(join(outDir, 'search-docs.json'), payload);
console.log(`写入 public/data/search-docs.json（${(payload.length / 1024).toFixed(1)} KB）`);
