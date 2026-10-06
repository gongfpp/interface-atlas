import { defineConfig } from '@playwright/test';
import base from './playwright.config.mjs';

// 仅为隔离 QA 提供报告；生产配置和构建产物不依赖该文件。
export default defineConfig({
  ...base,
  workers: 2,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'qa-evidence/playwright-results.json' }],
  ],
  use: { ...base.use, trace: 'retain-on-failure', screenshot: 'only-on-failure', serviceWorkers: 'block' },
});
