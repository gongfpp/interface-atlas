import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
/** 真实 TS 源码内存编译；默认真实 React SSR，可传模块替身做无 DOM 的回调单元测试。 */
export function sourceLoader(overrides = {}) {
  const cache = new Map();
  function load(relativePath) {
    const filename = resolve(root, relativePath);
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} }; cache.set(filename, module.exports);
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
    const localRequire = (name) => {
      if (name in overrides) return overrides[name];
      if (name.startsWith('.') || name.startsWith('@/')) {
        const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(filename), name);
        const source = ['', '.ts', '.tsx'].map((ext) => base + ext).find(existsSync);
        if (!source) throw new Error(`Missing source: ${name} from ${filename}`);
        return load(source);
      }
      return require(name);
    };
    new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
    cache.set(filename, module.exports); return module.exports;
  }
  return load;
}
