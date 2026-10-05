// 避免 WebKit 缓存失败的演示 modulepreload；修改兼容策略时必须同步更新哈希版本。
export const DEMO_PRELOAD_COMPAT_VERSION = 'atlas-demo-registry-no-js-modulepreload-v1';

const registrySources = [
  '/src/islands/SolutionLab.tsx',
  '/src/islands/ViewportPreview.tsx',
  '/src/islands/demos/DemoMount.tsx',
];
const isRegistry = (chunk) => registrySources.some((source) => chunk.facadeModuleId?.replaceAll('\\', '/').endsWith(source));

export function demoPreloadCompat() {
  const registryHosts = new Set();
  return {
    name: 'atlas-demo-registry-preload-compatibility',
    apply: 'build',
    enforce: 'pre',
    configEnvironment(name, environment) {
      if (name !== 'client') return;
      const previous = environment.build?.modulePreload;
      const previousResolve = typeof previous === 'object' ? previous.resolveDependencies : undefined;
      return { build: { modulePreload: {
        ...(typeof previous === 'object' ? previous : {}),
        polyfill: false,
        resolveDependencies(filename, dependencies, context) {
          // CSS 依赖由 Vite 自身保留；HTML 和其他 JS 的预加载列表保持原策略。
          if (context.hostType === 'js' && registryHosts.has(context.hostId)) return [];
          return previousResolve ? previousResolve(filename, dependencies, context) : dependencies;
        },
      } } };
    },
    augmentChunkHash(chunk) {
      // 依赖列表在 generateBundle 才改写，必须提前让相应 URL 随策略版本变化。
      if (this.environment.name === 'client' && isRegistry(chunk)) return DEMO_PRELOAD_COMPAT_VERSION;
    },
    generateBundle: {
      order: 'pre',
      handler(_options, bundle) {
        if (this.environment.name !== 'client') return;
        registryHosts.clear();
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk' && isRegistry(chunk)) registryHosts.add(chunk.fileName);
        }
      },
    },
  };
}
