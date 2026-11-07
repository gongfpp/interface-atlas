import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: ['approved-atlas.spec.mjs', 'atlas-pages.spec.mjs', 'atlas-behaviors.spec.mjs', 'atlas-contrast.spec.mjs', 'atlas-touch.spec.mjs'],
  timeout: 30000, workers: 2, retries: 0,
  use: { baseURL: 'http://127.0.0.1:4339', serviceWorkers: 'block', browserName: 'chromium' },
  webServer: {
    command: 'npm run preview -- --outDir out/cloudflare-preview --host 127.0.0.1 --port 4339 --ignore-lock',
    url: 'http://127.0.0.1:4339', reuseExistingServer: false, timeout: 30000,
  },
});
