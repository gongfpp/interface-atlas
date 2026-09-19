/**
 * 黄金测试集回归（PRD §9.2 / §38）：
 * 通过 Node 端关键词搜索（与浏览器同一评分模块），验收线 Top-3 命中率 ≥ 80%。
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { search } from '../src/lib/search-core.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixturesPath = join(root, 'fixtures', 'search-golden.json');
const docsPath = join(root, 'public', 'data', 'search-docs.json');

const golden = JSON.parse(readFileSync(fixturesPath, 'utf8'));

if (!existsSync(docsPath)) {
  console.error('✗ 缺少 public/data/search-docs.json，请先运行 npm run search:build');
  process.exit(1);
}
const { docs } = JSON.parse(readFileSync(docsPath, 'utf8'));

let top3Hits = 0;
let top1Hits = 0;
const failures = [];

for (const { q, expect } of golden) {
  const top3 = search(q, docs)
    .slice(0, 3)
    .map((s) => s.doc.id);
  const hit = expect.some((id) => top3.includes(id));
  const hit1 = expect.includes(top3[0]);
  if (hit) top3Hits++;
  if (hit1) top1Hits++;
  const mark = hit ? '✓' : '✗';
  console.log(`${mark} "${q}" → ${top3.join(', ')}${hit1 ? ' [top1]' : ''}`);
  if (!hit) failures.push({ q, got: top3, expect });
}

const rate3 = top3Hits / golden.length;
const rate1 = top1Hits / golden.length;
console.log(`\nTop-3 命中率：${(rate3 * 100).toFixed(1)}%（${top3Hits}/${golden.length}）`);
console.log(`Top-1 命中率：${(rate1 * 100).toFixed(1)}%`);

if (rate3 < 0.8) {
  console.error(`\n✗ 低于 80% 验收线，需补充 aliases 或调整评分`);
  for (const f of failures) console.error(`  未命中：「${f.q}」期望 ${f.expect.join('/')}，实际 ${f.got.join(', ')}`);
  process.exit(1);
}
console.log('✓ 达到验收线');
