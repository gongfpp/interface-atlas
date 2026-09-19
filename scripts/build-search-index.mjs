/**
 * 构建搜索索引（PRD §9）：关键词字段 + 本地 embedding（多语 e5-small，q8 量化）。
 * 拆成两个文件，浏览器按需加载：
 * - public/data/search-docs.json    关键词层（~58KB），首次交互即加载，先出结果
 * - public/data/search-vectors.json 向量层（聚焦弱命中时懒加载，base64 float32 压缩）
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';
import { encodeVectors } from '../src/lib/vector-codec.mjs';

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

const docsPayload = JSON.stringify({ docs });
writeFileSync(join(outDir, 'search-docs.json'), docsPayload);
console.log(`写入 public/data/search-docs.json（${(docsPayload.length / 1024).toFixed(1)} KB）`);

if (vectors && model) {
  const encoded = encodeVectors(vectors);
  const vectorsPayload = JSON.stringify({ model, ...encoded });
  writeFileSync(join(outDir, 'search-vectors.json'), vectorsPayload);
  console.log(
    `写入 public/data/search-vectors.json（${(vectorsPayload.length / 1024).toFixed(1)} KB，${encoded.count}×${encoded.dim}）`,
  );
} else {
  writeFileSync(join(outDir, 'search-vectors.json'), JSON.stringify({ model: null, count: 0, dim: 0, data: '' }));
  console.log('未生成 embedding，向量层为空（搜索降级为纯关键词）');
}
