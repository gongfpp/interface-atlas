import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import * as yaml from 'js-yaml';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const cache = new Map();

// 仅在内存编译这些源文件，复用 TypeScript 与真实 React 服务端渲染；
// 不启动浏览器，也不使用 DOM 模拟器。
function loadSource(relativePath) {
  const filename = resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const module = { exports: {} };
  cache.set(filename, module.exports);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const localRequire = (name) => name.startsWith('.')
    ? loadSource(['.ts', '.tsx'].map((ext) => resolve(dirname(filename), `${name}${ext}`)).find(existsSync))
    : require(name);
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  cache.set(filename, module.exports);
  return module.exports;
}

const matrix = {
  button: ['minimalism', 'neobrutalism', 'glassmorphism', 'swiss-style', 'cyberpunk', 'neumorphism', 'flat-design', 'pixel-art'],
  input: ['minimalism', 'neobrutalism', 'editorial', 'swiss-style', 'cyberpunk', 'neumorphism', 'flat-design', 'organic'],
  card: ['minimalism', 'aurora', 'bento-grid', 'editorial', 'neobrutalism', 'neumorphism', 'swiss-style', 'art-deco'],
};
const sets = Object.fromEntries(Object.keys(matrix).map((id) => [id, loadSource(`src/islands/style-variants/${id}.tsx`).default]));
const { createSession } = loadSource('src/islands/style-variants/session.ts');
const render = (variant, locale, values = {}) => {
  const session = createSession();
  for (const [key, value] of Object.entries(values)) session.set(key, value);
  return renderToStaticMarkup(createElement(variant.Demo, { session, locale }));
};

for (const [component, expected] of Object.entries(matrix)) {
  test(`${component}: 八套真实风格与内容关联和分类名称完全对应`, () => {
    const variants = sets[component];
    assert.deepEqual(variants.map((variant) => variant.style), expected);
    const content = yaml.load(readFileSync(resolve(root, `src/content/components/${component}.yaml`), 'utf8'));
    assert.deepEqual(content.applicable_styles, expected);
    for (const variant of variants) {
      const definition = yaml.load(readFileSync(resolve(root, `src/content/styles/${variant.style}.yaml`), 'utf8'));
      assert.deepEqual(variant.name, definition.name, `${component}/${variant.style} uses canonical localized names`);
      assert.ok(variant.note.zh && variant.note.en);
    }
  });

  test(`${component}: 每套风格均能双语渲染，明确本地演示边界`, () => {
    for (const variant of sets[component]) {
      for (const locale of ['zh', 'en']) {
        const html = render(variant, locale);
        assert.match(html, component === 'button' ? (locale === 'zh' ? /不会提交或保存真实数据/ : /No real data is submitted or saved/) : (locale === 'zh' ? /本地交互演示/ : /Local interaction demo/));
        assert.doesNotMatch(html, /<a\b|\baction=|\btarget=/);
        assert.match(html, /focus-visible:outline-2/);
        assert.match(html, /min-h-11/);
      }
    }
  });
}

test('输入框：各风格均保留受控值、标签与帮助信息关联', () => {
  for (const variant of sets.input) {
    const html = render(variant, 'en', { value: 'name+project@example.org' });
    assert.match(html, /type="email"/);
    assert.match(html, /value="name\+project@example.org"/);
    assert.match(html, /aria-invalid="false"/);
    assert.match(html, /aria-label="Clear email"/);
    const fieldId = html.match(/<input\b[^>]*?\sid="([^"]+)"/)[1];
    assert.ok(html.includes(`for="${fieldId}"`));
    const hintIds = html.match(/aria-describedby="([^"]+)"/)[1].split(' ');
    for (const id of hintIds) assert.ok(html.includes(`id="${id}"`));
    assert.match(html, /type="submit"/);
  }
});

test('输入框：八套风格的空值、错误、清空与校验反馈均双语', () => {
  for (const variant of sets.input) {
    for (const locale of ['zh', 'en']) {
      const empty = render(variant, locale);
      assert.match(empty, /value=""/);
      assert.doesNotMatch(empty, /aria-label="(?:Clear email|清空邮箱)"/);
      for (const value of ['', 'not-an-email', 'a@b', 'a @example.com']) {
        const invalid = render(variant, locale, { value, inputTouched: true });
        assert.match(invalid, /aria-invalid="true"/);
        assert.match(invalid, locale === 'zh' ? /请输入完整邮箱/ : /Enter a complete email/);
      }
      const cleared = render(variant, locale, { value: '', inputTouched: false, inputFeedback: 'cleared' });
      assert.match(cleared, /aria-invalid="false"/);
      assert.match(cleared, locale === 'zh' ? /已清空/ : /Cleared\./);
      const checked = render(variant, locale, { value: 'reader@example.org', inputTouched: true, inputFeedback: 'checked' });
      assert.match(checked, /aria-invalid="false"/);
      assert.match(checked, locale === 'zh' ? /格式有效/ : /Format looks valid/);
    }
  }
});

test('输入框：切换风格保留同一份输入与校验状态', () => {
  const session = createSession();
  session.set('value', 'shared.invalid');
  session.set('inputTouched', true);
  for (const variant of sets.input) {
    const html = renderToStaticMarkup(createElement(variant.Demo, { session, locale: 'en' }));
    assert.match(html, /value="shared.invalid"/);
    assert.match(html, /aria-invalid="true"/);
  }
});

test('卡片：原生按钮控制具名详情区，不伪造外部链接', () => {
  for (const variant of sets.card) {
    const html = render(variant, 'en');
    assert.match(html, /^<article\b/);
    assert.equal((html.match(/<button\b/g) ?? []).length, 2);
    assert.equal((html.match(/type="button"/g) ?? []).length, 2);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /aria-pressed="false"/);
    const panelId = html.match(/aria-controls="([^"]+)"/)[1];
    assert.ok(html.includes(`id="${panelId}" hidden="" role="region"`));
    const titleId = html.match(/aria-labelledby="([^"]+)"/)[1];
    assert.ok(html.includes(`id="${titleId}"`));
  }
});

test('卡片：双语展开与可撤销收藏在同一会话跨风格保留', () => {
  for (const locale of ['zh', 'en']) {
    const session = createSession();
    session.set('cardDetailsOpen', true);
    session.set('cardBookmarked', true);
    session.set('cardBookmarkChanged', true);
    for (const variant of sets.card) {
      const html = renderToStaticMarkup(createElement(variant.Demo, { session, locale }));
      assert.match(html, /aria-expanded="true"/);
      assert.match(html, /aria-pressed="true"/);
      assert.doesNotMatch(html, /hidden=""/);
      assert.match(html, locale === 'zh' ? /可再次点击撤销/ : /Select again to undo/);
    }
    session.set('cardBookmarked', false);
    session.set('cardDetailsOpen', false);
    for (const variant of sets.card) {
      const html = renderToStaticMarkup(createElement(variant.Demo, { session, locale }));
      assert.match(html, /aria-expanded="false"/);
      assert.match(html, /aria-pressed="false"/);
      assert.match(html, locale === 'zh' ? /已取消本次演示的收藏/ : /Bookmark removed from this demo/);
    }
  }
});

test('源码门禁：位移受减弱动效偏好控制，本地操作不联网或写存储', () => {
  for (const component of Object.keys(matrix)) {
    const source = readFileSync(resolve(root, `src/islands/style-variants/${component}.tsx`), 'utf8');
    const motionTokens = source.match(/[^\s"'`]+(?:translate-[xy]-|scale-)[^\s"'`]+/g) ?? [];
    assert.ok(motionTokens.every((token) => token.startsWith('motion-safe:')), motionTokens.join(', '));
    assert.doesNotMatch(source, /\bfetch\s*\(|localStorage|window\.open|location\.(?:href|assign)|transform-none/);
    assert.match(source, /\[overflow-wrap:anywhere\]/);
  }
  const input = readFileSync(resolve(root, 'src/islands/style-variants/input.tsx'), 'utf8');
  assert.match(input, /demo\.clear\(\); inputRef\.current\?\.focus\(\)/);
  assert.match(input, /onSubmit=.*event\.preventDefault\(\); demo\.check\(\)/);
});

// 新拟态不能只靠低对比阴影识别控件，实体边框需足够清楚。
test('新拟态输入与按钮边界在同色表面上保持至少 3:1 静态对比', () => {
  const luminance = (hex) => hex.match(/[a-f0-9]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  assert.ok((luminance('#e7ecf2') + 0.05) / (luminance('#738496') + 0.05) >= 3);
  for (const variants of Object.values(sets)) {
    const html = render(variants.find(variant => variant.style === 'neumorphism'), 'en');
    for (const control of html.match(/<(?:button|input)\b[^>]*>/g)) assert.ok(control.includes('border-[#738496]'));
  }
});
