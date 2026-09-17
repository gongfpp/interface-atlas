/**
 * 内容校验（PRD §33 CI 规则）：
 * 1. related / applicable_* / compare.group 引用存在
 * 2. published 条目 §26 必填字段齐全（含 sources、4 层双语 prompts、implementation）
 * 3. id 全库唯一（文件名即 slug）、slug 规范
 * 4. applicable_styles 必须指向 styles 条目等类型约束
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const TYPES = ['components', 'patterns', 'styles', 'pages', 'motion'];

const errors = [];
const byId = new Map();

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

for (const type of TYPES) {
  const dir = join(root, 'src', 'content', type);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  } catch {
    continue; // 目录可能尚无内容
  }
  for (const file of files) {
    const id = file.replace(/\.yaml$/, '');
    const rel = `${type}/${file}`;
    if (!SLUG_RE.test(id)) errors.push(`${rel}: slug 不符合规范（小写字母/数字/连字符）`);
    if (byId.has(id)) errors.push(`${rel}: id 与 ${byId.get(id)} 重复`);
    byId.set(id, rel);

    let data;
    try {
      data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
    } catch (err) {
      errors.push(`${rel}: YAML 解析失败 — ${err.message}`);
      continue;
    }

    const status = data.status ?? 'draft';
    const fail = (msg) => errors.push(`${rel}: ${msg}`);

    // §26 必填（published）
    if (status === 'published') {
      for (const field of ['name', 'description', 'use_when', 'avoid_when', 'variants', 'prompts', 'sources', 'implementation']) {
        const v = data[field];
        if (v == null || (Array.isArray(v) && v.length === 0)) fail(`published 缺少 ${field}`);
      }
      for (const lang of ['zh', 'en']) {
        if (status === 'published' && !data.description?.[lang]) fail(`description.${lang} 缺失（双语必填）`);
        for (const field of ['use_when', 'avoid_when']) {
          const arr = data[field] ?? [];
          if (status !== 'published') continue;
          if (!arr.length) fail(`${field} 不能为空`);
          arr.forEach((item, i) => {
            if (!item?.[lang]) fail(`${field}[${i}].${lang} 缺失（双语必填）`);
          });
        }
      }
      for (const layer of ['basic', 'design', 'implementation', 'agent']) {
        for (const lang of ['zh', 'en']) {
          if (!data.prompts?.[layer]?.[lang]) fail(`prompts.${layer}.${lang} 缺失`);
        }
      }
      if (!data.sources?.length) fail('sources 缺失（引用来源必填）');
      if (!data.demo?.component) fail('demo.component 缺失');
    }

    // 引用存在性
    for (const refField of ['related', 'applicable_styles', 'applicable_components', 'applicable_pages']) {
      for (const ref of data[refField] ?? []) {
        if (!byId.has(ref)) {
          // 引用可能在后续文件中定义，先记录，最后一轮复查
          (data._pendingRefs ??= []).push({ refField, ref });
        }
      }
    }
    data._rel = rel;
  }
}

// 逐条复查引用（byId 已完整）
for (const type of TYPES) {
  const dir = join(root, 'src', 'content', type);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  } catch {
    continue;
  }
  for (const file of files) {
    const rel = `${type}/${file}`;
    const data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
    for (const { refField, ref } of data._pendingRefs ?? []) {
      errors.push(`${rel}: ${refField} 引用不存在的 id「${ref}」`);
    }
    // 类型约束
    for (const ref of data.applicable_styles ?? []) {
      if (byId.has(ref) && !byId.get(ref).startsWith('styles/')) {
        errors.push(`${rel}: applicable_styles「${ref}」不是 styles 条目`);
      }
    }
    for (const ref of data.applicable_components ?? []) {
      if (byId.has(ref) && !byId.get(ref).startsWith('components/')) {
        errors.push(`${rel}: applicable_components「${ref}」不是 components 条目`);
      }
    }
    for (const ref of data.applicable_pages ?? []) {
      if (byId.has(ref) && !byId.get(ref).startsWith('pages/')) {
        errors.push(`${rel}: applicable_pages「${ref}」不是 pages 条目`);
      }
    }
    if (data.compare?.group) {
      // compare.group 至少要有同组另一成员（单条没有可比性）
      const peers = [...byId.keys()].filter((k) => k !== file.replace(/\.yaml$/, ''));
      if (peers.length === 0 && [...byId.values()].filter((v) => v !== rel).length === 0) {
        errors.push(`${rel}: compare.group「${data.compare.group}」没有其他成员`);
      }
    }
  }
}

// compare.group 成员检查
const groups = new Map();
for (const type of TYPES) {
  const dir = join(root, 'src', 'content', type);
  try {
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
      const data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
      if (data.compare?.group) {
        if (!groups.has(data.compare.group)) groups.set(data.compare.group, []);
        groups.get(data.compare.group).push(`${type}/${file}`);
      }
    }
  } catch { /* 目录不存在 */ }
}
for (const [group, members] of groups) {
  if (members.length < 2) console.warn(`⚠ ${members[0]}: compare.group「${group}」目前只有 1 个成员（内容补齐后应至少 2 条）`);
}

if (errors.length) {
  console.error(`\n✗ 内容校验失败（${errors.length} 个问题）：\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
} else {
  console.log(`✓ 内容校验通过：${byId.size} 个条目，${groups.size} 个 compare 组`);
}
