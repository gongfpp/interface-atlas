import assert from 'node:assert/strict';
import { writeFileSync, existsSync } from 'node:fs';

// 仅在私有 runner 的独立源码 checkout 中生成报告配置，不修改产品或测试文件。
assert.ok(existsSync('playwright.config.mjs'));
assert.ok(!existsSync('playwright.private-qa.config.mjs'));
writeFileSync('.qa-clean.config.mjs', `import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config.mjs';
export default defineConfig({
  ...base,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'qa-evidence/playwright-results.json' }]],
  use: { ...base.use, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
`);
