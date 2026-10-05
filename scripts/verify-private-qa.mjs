import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = '.github/workflows/';
const workflows = readdirSync(root).filter((name) => /\.ya?ml$/.test(name)).sort();
assert.deepEqual(workflows, ['ci.yml', 'deploy-preview.yml', 'deploy-web.yml']);
for (const name of workflows) {
  const content = readFileSync(root + name, 'utf8');
  assert.doesNotMatch(content, /workflow_run|pull_request_target|repository_dispatch/);
  assert.match(content, /permissions:\n  contents: read/);
  if (name !== 'ci.yml') {
    const jobs = content.split(/^jobs:\n/m)[1].split(/^  [\w-]+:\n/m).slice(1);
    assert.equal(jobs.length, name === 'deploy-web.yml' ? 2 : 1);
    for (const job of jobs) assert.match(job.split(/^    steps:/m)[0], /^    if: \$\{\{ false \}\}$/m);
  }
}
const ci = readFileSync(root + 'ci.yml', 'utf8');
assert.match(ci, /on:\n  push:\n    branches: \[dot\/atlas-private-browser-qa\]\n\npermissions:/);
assert.doesNotMatch(ci, /secrets\.|DEPLOY_KEY|git push|workflow_dispatch|pull_request:/);
assert.match(ci, /github\.event\.repository\.private == true/);
assert.match(ci, /github\.ref == 'refs\/heads\/dot\/atlas-private-browser-qa'/);
assert.match(ci, /persist-credentials: false/);
assert.match(ci, /retention-days: 7/);
assert.match(ci, /PUBLIC_LOG_API: 'off'/);
const ciJobs = ci.split(/^jobs:\n/m)[1].split(/^  [\w-]+:\n/m).slice(1);
assert.equal(ciJobs.length, 2);
for (const job of ciJobs) {
  const header = job.split(/^    steps:/m)[0];
  assert.match(header, /github\.event_name == 'push'/);
  assert.match(header, /github\.repository == 'gongfpp\/interface-atlas'/);
  assert.match(header, /github\.event\.repository\.private == true/);
  assert.match(header, /github\.ref == 'refs\/heads\/dot\/atlas-private-browser-qa'/);
  assert.doesNotMatch(job, /^    permissions:/m);
  assert.match(job, /persist-credentials: false/);
  assert.match(job, /retention-days: 7/);
  assert.match(header, /PUBLIC_LOG_API: 'off'/);
}
const tests = readdirSync('tests', { recursive: true }).filter((name) => /\.(?:spec|diagnostic)\.mjs$/.test(name));
assert.ok(tests.length > 0);
for (const name of tests) {
  const content = readFileSync('tests/' + name, 'utf8');
  assert.doesNotMatch(content, /from ['"]@playwright\/test['"]/);
  assert.match(content, /from ['"]\.\/helpers\/private-browser\.mjs['"]/);
}
console.log(`三个 workflow 已校验：发布 jobs 关闭，CI 仅私有 QA 分支，${tests.length} 个浏览器文件使用本地请求隔离。`);
