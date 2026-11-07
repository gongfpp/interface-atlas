import { defineConfig, devices } from '@playwright/test';

// 真正运行 WebKit；iPhone 项目模拟触摸与移动视口，不等同实体 iPhone 验收。
export default defineConfig({
  testDir: './tests',
  testMatch: ['approved-atlas.spec.mjs', 'atlas-pages.spec.mjs', 'atlas-behaviors.spec.mjs', 'atlas-contrast.spec.mjs', 'atlas-touch.spec.mjs'],
  timeout: 30000, workers: 1, retries: 0,
  use: { baseURL: 'http://127.0.0.1:4341', serviceWorkers: 'block' },
  projects: [
    { name: 'webkit-desktop', testMatch: ['atlas-behaviors.spec.mjs', 'atlas-contrast.spec.mjs'], grepInvert: / 390/, use: { ...devices['Desktop Safari'] } },
    { name: 'webkit-touch', grep: / 390/, use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run preview -- --outDir out/cloudflare-preview --host 127.0.0.1 --port 4341 --ignore-lock',
    url: 'http://127.0.0.1:4341', reuseExistingServer: false, timeout: 30000,
  },
});
