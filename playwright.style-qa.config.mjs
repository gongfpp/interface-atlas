import { defineConfig, devices } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import base from './playwright.config.mjs';

// 私有 PR 截图与浏览器报告必须指向实际检出的候选，而不是合并预览提交。
const candidateCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (process.env.QA_CANDIDATE_SHA && process.env.QA_CANDIDATE_SHA !== candidateCommit) {
  throw new Error('QA_CANDIDATE_SHA 与实际检出提交不一致');
}

export default defineConfig({
  ...base,
  metadata: { candidateCommit, privateEvidence: true },
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'qa-evidence/playwright-results.json' }],
  ],
  use: { ...base.use, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
