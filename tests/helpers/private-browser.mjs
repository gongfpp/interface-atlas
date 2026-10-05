import { test as base, expect } from '@playwright/test';

// 测试只允许访问本次本地构建。包括 Giscus 在内的外部页面和服务均不请求。
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === 'http://127.0.0.1:4337') await route.continue();
      else await route.abort('blockedbyclient');
    });
    await use(context);
  },
});
export { expect };
