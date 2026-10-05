import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { demoPreloadCompat } from './build/demo-preload-compat.mjs';

// 站点域名决定 canonical / sitemap / hreflang；部署时用 PUBLIC_SITE_URL 覆盖为真实域名
const site = process.env.PUBLIC_SITE_URL || 'https://interface-atlas.dev';

// 部署子路径：GitHub Pages 项目站点用 /interface-atlas，根部署用 /
const rawBase = process.env.PUBLIC_BASE_PATH || '/';
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  site,
  base,
  integrations: [react(), sitemap({ filter: (page) => !/\/(?:en\/)?viewport\/?$/.test(page) })],
  vite: {
    plugins: [tailwindcss(), demoPreloadCompat()],
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
