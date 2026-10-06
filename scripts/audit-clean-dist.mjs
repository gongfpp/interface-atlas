import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// 仅私有验收保存清单；公开流程仍只同步 Astro dist，不复制源码或测试证据。
const paths = readdirSync('dist', { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile()).map(entry => `${entry.parentPath}/${entry.name}`).sort();
assert.ok(paths.length > 1000);
const forbidden = /(?:^|\/)(?:tests|qa-evidence|playwright-report|\.git|\.env)(?:[/.]|$)|private-browser-acceptance|\.map$/;
for (const path of paths) {
  assert.doesNotMatch(path, forbidden);
  if (/\.(?:html|js|css|json|txt|xml)$/.test(path)) {
    const value = readFileSync(path, 'utf8');
    assert.doesNotMatch(value, /BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|qa-evidence\/|playwright-report\/|private-browser-acceptance\.md|\/workspace\/scratch\//);
    if (path.endsWith('.html')) assert.doesNotMatch(value, /(?:src|href)=["']\/_astro\//);
  }
}
const index = readFileSync('dist/index.html', 'utf8');
assert.match(index, /\/interface-atlas-web\/_astro\//);
const manifest = paths.map(path => `${createHash('sha256').update(readFileSync(path)).digest('hex')}  ${path}`).join('\n')+'\n';
writeFileSync('qa-evidence/release-dist-manifest.sha256', manifest);
writeFileSync('qa-evidence/release-dist-audit.json', JSON.stringify({ files: paths.length, base: '/interface-atlas-web', privateEvidenceFound: false, sourceMapsFound: false, credentialPatternFound: false }, null, 2)+'\n');
console.log(`生产子路径和发布隔离扫描通过：${paths.length} 个运行时文件。`);
