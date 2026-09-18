import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// 站点域名决定 canonical / sitemap / hreflang；部署时用 PUBLIC_SITE_URL 覆盖为真实域名
const site = process.env.PUBLIC_SITE_URL || 'https://interface-atlas.dev';

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
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
