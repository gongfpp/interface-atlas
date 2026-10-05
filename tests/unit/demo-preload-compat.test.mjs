import test from 'node:test';
import assert from 'node:assert/strict';
import { demoPreloadCompat, DEMO_PRELOAD_COMPAT_VERSION } from '../../build/demo-preload-compat.mjs';

const registry = name => ({ type: 'chunk', fileName: `${name}.hash.js`, facadeModuleId: `/project/src/islands/${name === 'DemoMount' ? 'demos/' : ''}${name}.tsx` });
const client = { environment: { name: 'client' } }, server = { environment: { name: 'ssr' } };

test('预加载兼容实验仅配置 client 环境，默认站点配置未引用它', async () => {
  const { readFileSync } = await import('node:fs');
  const plugin = demoPreloadCompat();
  assert.equal(plugin.configEnvironment('ssr', {}), undefined);
  assert.doesNotMatch(readFileSync(new URL('../../astro.config.mjs', import.meta.url), 'utf8'), /demoPreloadCompat/);
});
test('仅三个注册器的 JS 预加载依赖置空，其他 JS 与 HTML 保留前序策略', () => {
  const plugin = demoPreloadCompat();
  const resolve = plugin.configEnvironment('client', { build: { modulePreload: { resolveDependencies: (_file, deps) => [...deps, 'previous.js'] } } }).build.modulePreload.resolveDependencies;
  const chunks = Object.fromEntries(['SolutionLab', 'ViewportPreview', 'DemoMount'].map(name => [name, registry(name)]));
  plugin.generateBundle.handler.call(client, {}, chunks);
  for (const chunk of Object.values(chunks)) assert.deepEqual(resolve('input.js', ['input.js'], { hostId: chunk.fileName, hostType: 'js' }), []);
  assert.deepEqual(resolve('input.js', ['input.js'], { hostId: 'other.js', hostType: 'js' }), ['input.js', 'previous.js']);
  assert.deepEqual(resolve('input.js', ['input.js'], { hostId: 'SolutionLab.hash.js', hostType: 'html' }), ['input.js', 'previous.js']);
});
test('策略盐仅进入客户端三个注册器的 bundler hash，避免同 URL 异内容', () => {
  const plugin = demoPreloadCompat();
  for (const name of ['SolutionLab', 'ViewportPreview', 'DemoMount']) {
    assert.equal(plugin.augmentChunkHash.call(client, registry(name)), DEMO_PRELOAD_COMPAT_VERSION);
    assert.equal(plugin.augmentChunkHash.call(server, registry(name)), undefined);
  }
  assert.equal(plugin.augmentChunkHash.call(client, { facadeModuleId: '/project/src/islands/Search.tsx' }), undefined);
});
test('重复构建清除上一轮注册器文件名', () => {
  const plugin = demoPreloadCompat();
  const resolve = plugin.configEnvironment('client', {}).build.modulePreload.resolveDependencies;
  plugin.generateBundle.handler.call(client, {}, { old: registry('SolutionLab') });
  plugin.generateBundle.handler.call(client, {}, { next: { ...registry('SolutionLab'), fileName: 'SolutionLab.next.js' } });
  assert.deepEqual(resolve('input.js', ['input.js'], { hostId: 'SolutionLab.hash.js', hostType: 'js' }), ['input.js']);
  assert.deepEqual(resolve('input.js', ['input.js'], { hostId: 'SolutionLab.next.js', hostType: 'js' }), []);
});
