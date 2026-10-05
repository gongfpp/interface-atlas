import { defineConfig } from '@playwright/test';
import base from './playwright.cross-browser-qa.config.mjs';

// 仅供私有预加载 A/B 诊断；不是完整验收配置。
export default defineConfig({
  ...base,
  testMatch: ['**/*.spec.mjs', '**/*.diagnostic.mjs'],
});
