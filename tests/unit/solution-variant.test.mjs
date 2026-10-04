import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';
import { load } from 'js-yaml';
import { resolveSolutionVariant, selectSolutionVariant, solutionVariantBrief, solutionVariantLabel } from '../../src/lib/solution-variant.ts';

const forms = [
  { id: 'outline', name: '描边', note: '边框包裹' },
  { id: 'filled', name: '填充', note: '浅灰底无边框' },
  { id: 'with-addons', name: '带前后缀', note: '内嵌图标与清除按钮' },
];
const capability = { ids: ['outline', 'filled'], default: 'outline', modes: ['default', 'dark', 'variants'], defaults: { variants: 'filled' } };
const resolve = patch => resolveSolutionVariant({ forms, requested: '', mode: 'default', styled: false, capability, ...patch });

test('已实现形式同时驱动演示与输出；未选择时使用该模式真实默认形式', () => {
  const chosen = resolve({ requested: 'filled' });
  assert.equal(chosen.scope, 'preview');
  assert.equal(chosen.preview.id, 'filled');
  assert.equal(chosen.variant.id, 'filled');
  assert.equal(resolve({ mode: 'variants' }).preview.id, 'filled');
  assert.equal(resolve({ mode: 'dark' }).preview.id, 'outline');
});

test('附加要求保持先前预览，切回已实现形式时清除附加身份', () => {
  const requested = resolve({ requested: 'with-addons', previewRequested: 'filled' });
  assert.equal(requested.scope, 'requirement');
  assert.equal(requested.preview.id, 'filled');
  assert.equal(requested.variant.id, 'with-addons');
  assert.deepEqual(requested.additional.map(item => item.id), ['with-addons']);
  const switched = resolve({ requested: 'outline', previewRequested: requested.preview.id });
  assert.equal(switched.scope, 'preview');
  assert.equal(switched.preview.id, 'outline');
});

test('从仅含 form 的旧链接恢复后直接选附加要求，不回落到默认预览', () => {
  const restored = resolve({ requested: 'filled' });
  const next = selectSolutionVariant(restored, 'with-addons');
  assert.deepEqual(next, { requested: 'with-addons', previewRequested: 'filled' });
  const changed = resolve(next);
  assert.equal(changed.preview.id, 'filled');
  assert.equal(changed.scope, 'requirement');
  assert.equal(resolve(selectSolutionVariant(changed, 'outline')).preview.id, 'outline');
});

test('风格变体、不支持的模式、无能力的演示不能伪称形式已预览', () => {
  for (const patch of [{ styled: true }, { mode: 'loading' }, { capability: undefined }]) {
    const result = resolve({ requested: 'filled', ...patch });
    assert.equal(result.scope, 'requirement');
    assert.equal(result.preview, undefined);
    assert.equal(result.supported.length, 0);
    assert.equal(result.additional.length, forms.length);
  }
  assert.equal(resolve({ styled: true }).variant, undefined);
});

test('无效链接值安全回落，不伪造不存在的形式或隐藏有效的附加要求', () => {
  assert.equal(resolve({ requested: 'unknown', previewRequested: 'invalid' }).preview.id, 'outline');
  assert.equal(resolve({ requested: 'unknown', styled: true }).variant, undefined);
  const result = resolve({ requested: 'with-addons', previewRequested: 'with-addons' });
  assert.equal(result.preview.id, 'outline');
  assert.equal(result.variant.id, 'with-addons');
  assert.equal(result.scope, 'requirement');
});

test('参考链接可以分别往返实际预览与附加要求，设备视口只拿实际预览', () => {
  const result = resolve({ requested: 'with-addons', previewRequested: 'filled' });
  const link = new URL('https://atlas.example/interface-atlas-web/components/input');
  link.searchParams.set('form', result.variant.id);
  link.searchParams.set('preview', result.preview.id);
  const restored = resolve({ requested: link.searchParams.get('form'), previewRequested: link.searchParams.get('preview') });
  assert.deepEqual(restored, result);
  const viewport = resolve({ requested: result.preview.id });
  assert.equal(viewport.preview.id, 'filled');
  assert.equal(viewport.scope, 'preview');
});

test('双语复制说明明确未预览和冲突优先级，不把附加要求当验收证据', () => {
  const selection = { variantName: 'Filled', variantNote: 'No border', variantScope: 'requirement', previewVariantName: 'Outline' };
  const zh = solutionVariantBrief(selection, 'zh').join('\n');
  const en = solutionVariantBrief(selection, 'en').join('\n');
  assert.match(zh, /实际预览形式：Outline/);
  assert.match(zh, /附加形式（未预览）：Filled/);
  assert.match(zh, /以附加形式要求为准/);
  assert.match(en, /Additional variant \(not previewed\).*Filled/);
  assert.match(en, /additional variant takes precedence/);
  assert.match(en, /must be verified separately/);
  const preview = solutionVariantBrief({ ...selection, variantScope: 'preview' }, 'zh');
  assert.deepEqual(preview, ['已预览形式：Filled。No border']);
  assert.deepEqual(solutionVariantBrief({ ...selection, variantName: '' }, 'en'), []);
  assert.equal(solutionVariantLabel(undefined, 'zh'), '形式');
});

// 读取演示中实际导出的静态能力，不复制一份测试专用清单。
function readCapability(source) {
  const file = ts.createSourceFile('demo.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declarations = new Map();
  for (const statement of file.statements) if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) declarations.set(declaration.name.text, declaration.initializer);
    }
  }
  if (!declarations.has('previewVariants')) return null;
  function read(node) {
    if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return read(node.expression);
    if (ts.isIdentifier(node)) return read(declarations.get(node.text));
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(read);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => [property.name.text, read(property.initializer)]));
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'map') {
      const callback = node.arguments[0];
      assert.ok(ts.isArrowFunction(callback) && ts.isPropertyAccessExpression(callback.body) && callback.body.name.text === 'id');
      return read(node.expression.expression).map(value => value.id);
    }
    throw new Error(`能力不是受支持的静态声明：${node?.getText(file)}`);
  }
  return read(declarations.get('previewVariants'));
}

let capabilityCount = 0;
for (const type of readdirSync(new URL('../../src/content/', import.meta.url))) {
  if (type === 'gallery') continue;
  for (const filename of readdirSync(new URL(`../../src/content/${type}/`, import.meta.url))) {
    if (!filename.endsWith('.yaml')) continue;
    const content = load(readFileSync(new URL(`../../src/content/${type}/${filename}`, import.meta.url), 'utf8'));
    if (!content.demo) continue;
    const source = readFileSync(new URL(`../../src/islands/demos/${content.demo.component}.tsx`, import.meta.url), 'utf8');
    const actual = readCapability(source);
    if (!actual) continue;
    capabilityCount++;
    test(`${type}/${filename}：所有声明模式和形式都保持真实预览边界`, () => {
      const options = content.variants.map(form => ({ id: form.id, name: form.name.zh, note: form.note?.zh ?? '' }));
      for (const id of actual.ids) assert.ok(options.some(option => option.id === id), `内容缺少已预览形式 ${id}`);
      assert.ok(actual.ids.includes(actual.default));
      for (const id of Object.values(actual.defaults ?? {})) assert.ok(actual.ids.includes(id));
      for (const mode of content.demo.modes) for (const styled of [false, true]) for (const requested of ['', ...options.map(form => form.id)]) {
        const result = resolveSolutionVariant({ forms: options, requested, mode, styled, capability: actual });
        const interactive = !styled && (actual.modes ?? ['default', 'dark']).includes(mode);
        assert.equal(Boolean(result.preview), interactive);
        assert.equal(result.supported.length + result.additional.length, options.length);
        if (interactive) assert.equal(result.preview.id, actual.ids.includes(requested) ? requested : (actual.defaults?.[mode] ?? actual.default));
        if (requested) assert.equal(result.scope, interactive && actual.ids.includes(requested) ? 'preview' : 'requirement');
      }
    });
  }
}
test('全库能力矩阵确实覆盖了多个组件和页面', () => assert.ok(capabilityCount >= 30, `只发现 ${capabilityCount} 项能力`));
