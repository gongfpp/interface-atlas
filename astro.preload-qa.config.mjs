import config from './astro.config.mjs';
import { demoPreloadCompat } from './build/demo-preload-compat.mjs';

// 只在显式指定该配置的私有诊断构建中启用；默认产品配置不变。
export default {
  ...config,
  vite: {
    ...config.vite,
    plugins: [...(config.vite?.plugins ?? []), demoPreloadCompat()],
  },
};
