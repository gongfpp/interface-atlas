/**
 * 构建搜索索引（PRD §9）：关键词字段 + 本地 embedding（多语 e5-small，q8 量化）。
 * 产出 public/data/search-index.json，浏览器懒加载。
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

function docEmbedText(doc) {
  // e5 惯例：文档侧加 passage: 前缀
  const bits = [
    doc.name.zh,
    doc.name.en,
    ...doc.aliases,
    ...doc.category,
    ...doc.tags,
    doc.text.zh,
    doc.text.en,
  ];
  return `passage: ${bits.filter(Boolean).join('，')}`;
}

async function embed(texts) {
  const mod = await import('@huggingface/transformers');
  const { pipeline, env } = mod;
  // 网络受限环境走镜像；直连可用时用官方地址
  const remote = process.env.HF_ENDPOINT || 'https://hf-mirror.com';
  try {
    env.remoteHost = remote;
  } catch { /* 只读环境则忽略 */ }
  const extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
    dtype: 'q8',
  });
  const out = await extractor(texts, { pooling: 'mean', normalize: true });
  // out.data 是扁平数组，按句切分
  const dim = out.dims[1];
  const flat = Array.from(out.data);
  const vectors = [];
  for (let i = 0; i < out.dims[0]; i++) vectors.push(flat.slice(i * dim, (i + 1) * dim));
  return vectors;
}

const docs = [...loadDocs(), ...loadGallery()];
console.log(`索引 ${docs.length} 个已发布条目…`);

let vectors = null;
let model = null;
try {
  vectors = await embed(docs.map(docEmbedText));
  model = 'Xenova/multilingual-e5-small';
  console.log(`embedding 完成：${vectors.length} × ${vectors[0]?.length ?? 0}`);
} catch (err) {
  console.warn('embedding 生成失败，索引降级为纯关键词模式：', err.message);
}

const outDir = join(root, 'public', 'data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'search-index.json'),
  JSON.stringify({ docs, vectors, model }),
);
console.log(`写入 public/data/search-index.json（${(JSON.stringify({ docs, vectors }).length / 1024 / 1024).toFixed(2)} MB）`);
