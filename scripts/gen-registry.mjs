/**
 * 重新生成 src/islands/demos/registry.ts：
 * 扫描 src/islands/demos/*.tsx（除 DemoMount），按文件名生成 import + 注册表。
 * 用法：npm run gen:registry
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const demoDir = join(root, 'src', 'islands', 'demos');

const files = readdirSync(demoDir)
  .filter((f) => f.endsWith('.tsx') && f !== 'DemoMount.tsx')
  .map((f) => f.replace(/\.tsx$/, ''))
  .sort();

const toName = (slug) =>
  slug.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('') + 'Demo';

const imports = files.map((s) => `import ${toName(s)} from './${s}';`).join('\n');
const entries = files.map((s) => `  '${s}': ${toName(s)},`).join('\n');

const out = `import type { DemoComponent } from '@/islands/DemoStage';

/**
 * Demo 注册表：concept YAML 的 demo.component 键 → React 组件。
 * 由 scripts/gen-registry.mjs 生成（npm run gen:registry），不要手工编辑。
 */
${imports}

export const demos: Record<string, DemoComponent> = {
${entries}
};
`;
writeFileSync(join(demoDir, 'registry.ts'), out);
console.log(`registry: ${files.length} demos registered`);
