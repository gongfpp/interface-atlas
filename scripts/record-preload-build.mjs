import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const mode = process.argv[2];
assert.ok(['baseline', 'candidate'].includes(mode));
mkdirSync('qa-evidence', { recursive: true });
const files = Object.fromEntries(readdirSync('dist/_astro').filter(name => name.endsWith('.js')).sort().map(name => {
  const bytes = readFileSync(`dist/_astro/${name}`);
  return [name, { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }];
}));
const report = { mode, files, count: Object.keys(files).length, bytes: Object.values(files).reduce((sum, file) => sum + file.bytes, 0) };
writeFileSync(`qa-evidence/${mode}-build.json`, JSON.stringify(report, null, 2));
if (mode === 'candidate') {
  const baseline = JSON.parse(readFileSync('qa-evidence/baseline-build.json', 'utf8'));
  const removed = Object.keys(baseline.files).filter(name => !(name in files));
  const added = Object.keys(files).filter(name => !(name in baseline.files));
  const changedInPlace = Object.keys(files).filter(name => name in baseline.files && files[name].sha256 !== baseline.files[name].sha256);
  const summary = { baselineBytes: baseline.bytes, candidateBytes: report.bytes, removed, added, changedInPlace };
  writeFileSync('qa-evidence/preload-build-comparison.json', JSON.stringify(summary, null, 2));
  assert.deepEqual(changedInPlace, [], '不能覆盖已有内容哈希 URL 的字节');
  assert.equal(removed.length, 3); assert.equal(added.length, 3);
  for (const name of [...removed, ...added]) assert.match(name, /^(?:SolutionLab|ViewportPreview|DemoMount)\.[\w-]+\.js$/);
  console.log(JSON.stringify(summary));
}
