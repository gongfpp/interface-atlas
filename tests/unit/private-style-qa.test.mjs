import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { load } from 'js-yaml';

const read = (file) => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
const branch = 'dot/atlas-reference-style-scenes';

test('参考风格验收仅允许私有同仓库指定分支手动触发，不含发布或凭据入口', () => {
  const text = read('.github/workflows/private-style-qa.yml');
  const workflow = load(text);
  assert.deepEqual(Object.keys(workflow.on), ['workflow_dispatch']);
  assert.equal(workflow.on.workflow_dispatch, null);
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  assert.ok(workflow.concurrency.group.includes('github.sha'), '候选应能独立采集首批截图，不等待旧版全量结束');
  assert.equal(workflow.concurrency['cancel-in-progress'], false);
  const job = workflow.jobs['browser-qa'];
  for (const guard of [
    "github.event_name == 'workflow_dispatch'",
    "github.repository == 'gongfpp/interface-atlas'",
    'github.event.repository.private == true',
    `github.ref == 'refs/heads/${branch}'`,
  ]) assert.ok(job.if.includes(guard), `缺少私有验收限制：${guard}`);
  assert.deepEqual(job.strategy.matrix.engine, ['chromium', 'firefox', 'webkit']);
  assert.equal(job.env.PUBLIC_LOG_API, 'off');
  for (const variable of ['PUBLIC_UMAMI_SRC', 'PUBLIC_UMAMI_ID', 'PUBLIC_CF_BEACON_TOKEN']) assert.equal(job.env[variable], '');
  const checkout = job.steps.find((step) => step.uses?.startsWith('actions/checkout@'));
  assert.equal(checkout.with.ref, '${{ github.sha }}');
  assert.equal(checkout.with['persist-credentials'], false);
  assert.doesNotMatch(text, /secrets\.|DEPLOY_KEY|git push|repository_dispatch:|pull_request:|push:|pull_request_target:/);
  const artifacts = job.steps.filter((step) => step.uses?.startsWith('actions/upload-artifact@'));
  assert.equal(artifacts.length, 6);
  for (const artifact of artifacts) {
    assert.ok(artifact.with.name.includes('${{ github.sha }}'));
    assert.equal(artifact.with['retention-days'], 7);
  }
  const targetIndex = job.steps.findIndex((step) => step.id === 'target');
  const quickIndex = job.steps.findIndex((step) => step.id === 'quick');
  const firstArtifactIndex = job.steps.indexOf(artifacts[0]);
  const desktopArtifactIndex = job.steps.indexOf(artifacts[1]);
  assert.ok(artifacts[0].with.name.startsWith('atlas-style-quick-'));
  assert.ok(artifacts[1].with.name.startsWith('atlas-style-desktop-'));
  assert.ok(artifacts[2].with.name.startsWith('atlas-style-narrow-'));
  for (const artifact of artifacts) assert.ok(!artifact.with.path.includes('playwright-report/'), '不得重复打包全部截图的 HTML 副本');
  assert.ok(artifacts[0].with.path.includes('!style-quick-results/**/attachments/*.png'));
  assert.ok(artifacts[1].with.path.includes('style-scene-results/**/*-1280.png'));
  assert.ok(artifacts[2].with.path.includes('style-scene-results/**/*-390.png'));
  assert.ok(artifacts[2].with.path.includes('style-scene-results/**/*-320.png'));
  const regressionIndex = job.steps.findIndex((step) => step.run?.includes("--grep-invert '参考缩景'"));
  assert.ok(quickIndex < firstArtifactIndex && firstArtifactIndex < targetIndex);
  assert.ok(targetIndex < desktopArtifactIndex && desktopArtifactIndex < regressionIndex);
});

test('当前需求分支不能自动或手动公开预览，PR 不触发正式发布', () => {
  const preview = load(read('.github/workflows/deploy-preview.yml'));
  assert.deepEqual(Object.keys(preview.on), ['workflow_dispatch']);
  assert.ok(preview.jobs['build-and-deploy'].if.includes(`github.ref != 'refs/heads/${branch}'`));
  const release = load(read('.github/workflows/deploy-web.yml'));
  assert.deepEqual(Object.keys(release.on), ['workflow_dispatch']);
  assert.equal(release.on.pull_request, undefined);
  assert.equal(release.on.pull_request_target, undefined);
  assert.equal(release.on.workflow_run, undefined);
  for (const job of Object.values(release.jobs)) assert.ok(job.if.includes(`github.ref != 'refs/heads/${branch}'`));
});

test('三引擎配置与目标测试保留本地请求隔离', () => {
  const config = read('playwright.style-qa.config.mjs');
  for (const engine of ['chromium', 'firefox', 'webkit']) assert.ok(config.includes(`name: '${engine}'`));
  assert.match(config, /QA_CANDIDATE_SHA !== candidateCommit/);
  assert.match(read('tests/style-reference-scenes.spec.mjs'), /from '\.\/helpers\/private-browser\.mjs'/);
  const isolation = read('tests/helpers/private-browser.mjs');
  assert.match(isolation, /new URL\(baseURL \?\? 'http:\/\/127\.0\.0\.1:4337'\)/);
  assert.match(isolation, /preview\.protocol !== 'http:' \|\| preview\.hostname !== '127\.0\.0\.1'/);
  assert.match(isolation, /const origin = preview\.origin/);
  assert.match(isolation, /if \(url\.origin === origin\) await route\.continue\(\)/);
  assert.match(isolation, /else await route\.abort\('blockedbyclient'\)/);
});
