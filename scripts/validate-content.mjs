/**
 * 内容校验（PRD §33 CI 规则）：
 * 1. related / applicable_* 引用必须存在于全库（先全量加载再统一校验，不允许边遍历边判断）
 * 2. published 条目 §26 必填字段齐全（含 sources、4 层双语 prompts、implementation、demo）
 * 3. id 全库唯一、slug 规范
 * 4. applicable_* 类型前缀约束
 * 5. compare.group 至少 2 个成员（CI 环境为硬失败，本地为警告；成员补齐后自然转绿）
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const TYPES = ['components', 'patterns', 'styles', 'pages', 'motion'];
const IS_CI = process.env.CI === 'true';

const errors = [];
const warnings = [];
const entries = new Map(); // id -> { type, rel, data }
const compareGroups = new Map(); // group -> [{ id, rel }]

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RELATIONS = new Set([
  'alternative_to',
  'similar_to',
  'used_with',
  'contains',
  'uses',
  'affects',
  'applies_to',
]);

// ---- 第一遍：全量加载 ----
for (const type of TYPES) {
  const dir = join(root, 'src', 'content', type);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  } catch {
    continue;
  }
  for (const file of files) {
    const id = file.replace(/\.yaml$/, '');
    const rel = `${type}/${file}`;
    if (!SLUG_RE.test(id)) errors.push(`${rel}: slug 不符合规范（小写字母/数字/连字符）`);
    if (entries.has(id)) errors.push(`${rel}: id 与 ${entries.get(id).rel} 重复`);
    let data;
    try {
      data = yamlLoad(readFileSync(join(dir, file), 'utf8'));
    } catch (err) {
      errors.push(`${rel}: YAML 解析失败 — ${err.message}`);
      continue;
    }
    entries.set(id, { type, rel, data });
  }
}

// ---- 第二遍：统一校验 ----
const REF_FIELDS = ['related', 'applicable_styles', 'applicable_components', 'applicable_pages'];
const TYPE_PREFIX = {
  applicable_styles: 'styles',
  applicable_components: 'components',
  applicable_pages: 'pages',
};

for (const [id, { type, rel, data }] of entries) {
  const status = data.status ?? 'draft';
  const fail = (msg) => errors.push(`${rel}: ${msg}`);

  if (status === 'published') {
    for (const field of ['name', 'description', 'use_when', 'avoid_when', 'variants', 'prompts', 'sources', 'implementation', 'demo']) {
      const v = data[field];
      if (v == null || (Array.isArray(v) && v.length === 0)) fail(`published 缺少 ${field}`);
    }
    for (const lang of ['zh', 'en']) {
      if (!data.description?.[lang]) fail(`description.${lang} 缺失（双语必填）`);
      for (const field of ['use_when', 'avoid_when']) {
        (data[field] ?? []).forEach((item, i) => {
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

  // 引用存在性 + 类型前缀（基于全量 Map）；related 为 { id, relation }
  for (const refField of REF_FIELDS) {
    for (const item of data[refField] ?? []) {
      const ref = item && typeof item === 'object' ? item.id : item;
      if (!ref) {
        fail(`${refField} 存在空引用`);
        continue;
      }
      if (refField === 'related' && item && typeof item === 'object' && !RELATIONS.has(item.relation)) {
        fail(`related「${ref}」的 relation 非法：${item.relation}`);
      }
      const target = entries.get(ref);
      if (!target) {
        fail(`${refField} 引用不存在的 id「${ref}」`);
        continue;
      }
      const prefix = TYPE_PREFIX[refField];
      if (prefix && target.type !== prefix) {
        fail(`${refField}「${ref}」是 ${target.type} 条目，应为 ${prefix}`);
      }
    }
  }

  if (data.compare?.group) {
    if (!compareGroups.has(data.compare.group)) compareGroups.set(data.compare.group, []);
    compareGroups.get(data.compare.group).push({ id, rel });
  }
}

for (const [group, members] of compareGroups) {
  if (members.length < 2) {
    const msg = `compare.group「${group}」只有 1 个成员（${members[0].rel}），至少需要 2 条才能对比`;
    if (IS_CI) errors.push(msg);
    else warnings.push(msg);
  }
}

if (warnings.length) {
  for (const w of warnings) console.warn(`⚠ ${w}`);
}
if (errors.length) {
  console.error(`\n✗ 内容校验失败（${errors.length} 个问题）：\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ 内容校验通过：${entries.size} 个条目，${compareGroups.size} 个 compare 组（CI 严格模式：${IS_CI}）`);
