import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config.mjs';

// 按需安装 Firefox/WebKit，复用同一份业务与几何断言；默认 CI 仍使用 Chromium。
// 独立预览端口允许与默认回归并行，但必须使用同一份已经完成的构建。
export default defineConfig({
  ...base,
  outputDir: './style-scene-results',
  testMatch: [
    '**/style-full-pages.spec.mjs',
    '**/style-page-controls.spec.mjs',
    '**/style-keyboard-removal.spec.mjs',
    '**/style-scroll-isolation.spec.mjs',
    '**/style-generic-parity.spec.mjs',
    '**/style-state-design.spec.mjs',
    '**/style-controls-lifecycle.spec.mjs',
  ],
  use: { ...base.use, baseURL: 'http://127.0.0.1:4339' },
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    ...base.webServer,
    command: 'npm run preview -- --host 127.0.0.1 --port 4339 --ignore-lock',
    url: 'http://127.0.0.1:4339',
  },
});
