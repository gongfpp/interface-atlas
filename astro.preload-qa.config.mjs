import config from './astro.config.mjs';
import { demoPreloadCompat } from './build/demo-preload-compat.mjs';

// 保留显式诊断入口；已采用兼容策略后避免重复安装同一插件。
export default {
  ...config,
  vite: {
    ...config.vite,
    plugins: [...(config.vite?.plugins ?? []).filter(plugin => plugin?.name !== 'atlas-demo-registry-preload-compatibility'), demoPreloadCompat()],
  },
};
