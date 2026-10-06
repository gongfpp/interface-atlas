import { defineConfig, devices } from '@playwright/test';
import base from './playwright.private-qa.config.mjs';

// Linux 上的官方 Firefox/WebKit 构建；WebKit 不能替代 Safari 或 iOS 真机验收。
export default defineConfig({
  ...base,
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
