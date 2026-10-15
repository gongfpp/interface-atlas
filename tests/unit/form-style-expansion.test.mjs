import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import * as yaml from 'js-yaml';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const coverage = JSON.parse(readFileSync(resolve(root, 'src/lib/component-style-coverage.json'), 'utf8'));
const forms = Object.entries(coverage).filter(([, entry]) => entry.group === 'forms');

// 直接转译并运行源文件；真实 SSR 与纯回调状态测试均不启动浏览器、不模拟 DOM。
function sourceLoader(reactOverride) {
  const cache = new Map();
  function load(path) {
    let filename = resolve(root, path);
    if (!existsSync(filename)) filename = ['.ts', '.tsx'].map((ext) => filename + ext).find(existsSync);
    assert.ok(filename, `Source module exists: ${path}`);
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    const localRequire = (name) => name === 'react' && reactOverride ? reactOverride : name.startsWith('.') ? load(resolve(dirname(filename), name)) : require(name);
    new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
    cache.set(filename, module.exports);
    return module.exports;
  }
  return load;
}
const load = sourceLoader();
const { createSession } = load('src/islands/style-variants/session.ts');
const sets = Object.fromEntries(forms.map(([id]) => [id, load(`src/islands/style-variants/${id}.tsx`).default]));
function render(variant, locale = 'en', state = {}) {
  const session = createSession();
  for (const [key, value] of Object.entries(state)) session.set(key, value);
  return renderToStaticMarkup(createElement(variant.Demo, { session, locale }));
}

for (const [id, entry] of forms) {
  test(`${id}: 注册数量准确且保留原风格，名称和内容关联一致`, () => {
    const variants = sets[id];
    assert.equal(variants.length, entry.styles.length);
    assert.deepEqual(variants.map((variant) => variant.style), entry.styles);
    assert.ok(entry.original.every((style) => variants.some((variant) => variant.style === style)));
    const content = yaml.load(readFileSync(resolve(root, `src/content/components/${id}.yaml`), 'utf8'));
    assert.deepEqual(content.applicable_styles, entry.styles);
    for (const variant of variants) {
      const definition = yaml.load(readFileSync(resolve(root, `src/content/styles/${variant.style}.yaml`), 'utf8'));
      assert.deepEqual(variant.name, definition.name);
      assert.ok(variant.note.zh.length > 10 && variant.note.en.length > 10);
    }
  });
  test(`${id}: 所有适配均可中英文 SSR，控件可见且不联网`, () => {
    for (const variant of sets[id]) {
      for (const locale of ['zh', 'en']) {
        const html = render(variant, locale);
        assert.match(html, /<(input|button|select|textarea)\b/);
        assert.match(html, /focus-visible:outline-2/);
        assert.doesNotMatch(html, /\baction=|\btarget=|<a\b/);
        if (!entry.original.includes(variant.style)) {
          assert.match(html, new RegExp(`data-style-recipe="${variant.style}"`));
          assert.match(html, locale === 'zh' ? /本地交互演示/ : /Local interaction demo/);
          assert.match(html, /min-h-11/);
        }
      }
    }
    const source = readFileSync(resolve(root, `src/islands/style-variants/${id}.tsx`), 'utf8');
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|window\.open|localStorage|location\.(?:href|assign)/);
  });
}

test('全部表单适配读取既有会话键，跨风格保留选择或文本', () => {
  const cases = {
    checkbox: [{ checked: false }, /(?:aria-checked="false"|type="checkbox")/],
    'color-picker': [{ value: '#123456', selected: 3 }, /#123456/i],
    combobox: [{ value: 'Organic', comboQuery: 'nomatch' }, /Selected: <!-- -->Organic|Selected: Organic|Selected:.*Organic/],
    'date-picker': [{ yearMonth: { y: 2028, m: 1 }, day: 29 }, /(?:February 29, 2028|2028年2月29日|2028年二月29日)/],
    'file-upload': [{ files: [{ id: 88, name: 'sample.png' }] }, /Remove sample\.png/],
    'filter-panel': [{ active: ['Mono'] }, /(?:checked=""|aria-pressed="true")/],
    'multi-select': [{ selected: ['Design', 'Data'] }, /(?:checked=""|aria-pressed="true")/],
    radio: [{ value: 'express' }, /type="radio"[^>]*checked=""[^>]*value="express"/],
    rating: [{ value: 4 }, /(?:aria-pressed="true"|checked="")/],
    select: [{ value: 'team' }, /<option[^>]*value="team" selected="">/],
    slider: [{ value: 87 }, /value="87"/],
    switch: [{ on: true }, /role="switch" aria-checked="true"/],
    'tag-input': [{ tags: [{ id: -99, label: 'shared-tag' }] }, /Remove shared-tag/],
    textarea: [{ value: '共享文字 shared text' }, /共享文字 shared text/],
    'segmented-control': [{ active: 2 }, /(?:aria-pressed="true"|checked="")/],
    input: [{ value: 'shared@example.org', inputTouched: true }, /value="shared@example.org"/],
  };
  for (const [id, [state, pattern]] of Object.entries(cases)) {
    for (const variant of sets[id]) assert.match(render(variant, 'en', state), pattern, `${id}/${variant.style}`);
  }
});

test('文件队列校验真实扩展名、MIME 与 5 MB 上限', () => {
  const { fileIssue } = load('src/islands/style-variants/file-upload.tsx');
  const size = 5 * 1024 * 1024;
  for (const file of [{ name: 'file.PNG', type: 'image/png', size }, { name: 'file.jpeg', type: 'image/jpeg', size: 1 }, { name: 'file.pdf', type: '', size: 1 }]) assert.equal(fileIssue(file), null);
  assert.equal(fileIssue({ name: 'file.png', type: 'image/png', size: size + 1 }), 'size');
  assert.equal(fileIssue({ name: 'file.psd', type: '', size: 1 }), 'type');
  assert.equal(fileIssue({ name: 'file.png', type: 'application/x-msdownload', size: 1 }), 'type');
  assert.equal(fileIssue({ name: 'file.png.exe', type: 'image/png', size: 1 }), 'type');
});

// 受控事件的函数级验证：仅运行 JSX 函数和 hook 状态槽，不构造 document/window/DOM。
function callbackHarness(id, style, locale = 'en') {
  const slots = [];
  let cursor = 0;
  const mockReact = {
    useId: () => 'unit-id',
    useRef: (initial) => ({ current: initial }),
    useCallback: (callback) => callback,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (next) => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
    },
  };
  const local = sourceLoader(mockReact);
  const session = local('src/islands/style-variants/session.ts').createSession();
  const variant = local(`src/islands/style-variants/${id}.tsx`).default.find((entry) => entry.style === style);
  const visit = (element) => {
    if (element == null || typeof element !== 'object') return element;
    if (Array.isArray(element)) return element.map(visit);
    if (typeof element.type === 'function') return visit(element.type(element.props));
    return { type: element.type, props: { ...element.props, children: visit(element.props.children) } };
  };
  function draw() { cursor = 0; return visit(createElement(variant.Demo, { session, locale })); }
  function nodes(node) {
    if (node == null || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap((child) => nodes(child));
    return [node, ...nodes(node.props.children)];
  }
  const text = (node) => node == null ? '' : Array.isArray(node) ? node.map(text).join('') : typeof node === 'object' ? text(node.props.children) : String(node);
  return { session, nodes: () => nodes(draw()), text, find: (predicate) => nodes(draw()).find(predicate), button: (label) => nodes(draw()).find((node) => node.type === 'button' && text(node) === label) };
}

test('新增复选框、开关、多选与单选回调可切换、重置且写回原会话', () => {
  for (const [id, entry] of forms.filter(([id]) => ['checkbox', 'switch', 'multi-select', 'radio', 'rating', 'segmented-control'].includes(id))) {
    for (const style of entry.styles.filter((style) => !entry.original.includes(style))) {
      const h = callbackHarness(id, style);
      if (id === 'checkbox') {
        h.find((node) => node.type === 'input').props.onChange({ target: { checked: false } }); assert.equal(h.session.get('checked'), false);
      } else if (id === 'switch') {
        h.find((node) => node.props.role === 'switch').props.onClick(); assert.equal(h.session.get('on'), true);
        h.button('Reset to off').props.onClick(); assert.equal(h.session.get('on'), false);
      } else if (id === 'multi-select') {
        const input = () => h.nodes().filter((node) => node.type === 'input')[1]; input().props.onChange(); assert.deepEqual(h.session.get('selected'), ['Design', 'Code']);
        input().props.onChange(); assert.deepEqual(h.session.get('selected'), ['Design']);
        h.button('Clear selection').props.onClick(); assert.deepEqual(h.session.get('selected'), []);
      } else if (id === 'radio') {
        h.nodes().filter((node) => node.type === 'input')[1].props.onChange(); assert.equal(h.session.get('value'), 'express');
        h.button('Reset choice').props.onClick(); assert.equal(h.session.get('value'), 'standard');
      } else if (id === 'rating') {
        h.nodes().filter((node) => node.type === 'input')[3].props.onChange(); assert.equal(h.session.get('value'), 4);
        h.button('Clear rating').props.onClick(); assert.equal(h.session.get('value'), 0);
      } else {
        h.nodes().filter((node) => node.type === 'input')[2].props.onChange(); assert.equal(h.session.get('active'), 2);
        h.button('Reset to week').props.onClick(); assert.equal(h.session.get('active'), 1);
      }
    }
  }
});

test('新增组合框、标签、筛选、文本和数值的重复操作/清空回调真实工作', () => {
  for (const [id, entry] of forms.filter(([id]) => ['combobox', 'tag-input', 'filter-panel', 'textarea', 'slider', 'select', 'color-picker', 'input'].includes(id))) {
    for (const style of entry.styles.filter((style) => !entry.original.includes(style))) {
      const h = callbackHarness(id, style);
      if (id === 'combobox') {
        h.find((node) => node.type === 'input').props.onChange({ target: { value: 'no match' } }); assert.equal(h.session.get('comboQuery'), 'no match');
        assert.ok(h.nodes().some((node) => h.text(node).includes('No matching styles')));
        h.find((node) => node.type === 'select').props.onChange({ target: { value: 'Organic' } }); assert.equal(h.session.get('value'), 'Organic');
        h.button('Clear search and choice').props.onClick(); assert.equal(h.session.get('value'), ''); assert.equal(h.session.get('comboQuery'), '');
      } else if (id === 'tag-input') {
        const input = () => h.find((node) => node.type === 'input');
        input().props.onChange({ target: { value: 'new-topic' } });
        input().props.onKeyDown({ key: 'Enter', nativeEvent: { isComposing: true }, preventDefault() {} }); assert.equal(h.session.get('tags', []).length, 0, 'IME composition cannot submit');
        input().props.onKeyDown({ key: 'Enter', nativeEvent: { isComposing: false }, preventDefault() {} }); assert.equal(h.session.get('tags').length, 3);
        input().props.onChange({ target: { value: 'new-topic' } }); h.button('Add').props.onClick(); assert.equal(h.session.get('tags').length, 4, 'duplicate labels remain independently selectable');
        const removeButtons = h.nodes().filter((node) => node.props['aria-label'] === 'Remove new-topic');
        assert.equal(removeButtons.length, 2); removeButtons[0].props.onClick();
        assert.equal(h.nodes().filter((node) => node.props['aria-label'] === 'Remove new-topic').length, 1);
        h.button('Clear all').props.onClick(); assert.deepEqual(h.session.get('tags'), []);
      } else if (id === 'filter-panel') {
        h.nodes().filter((node) => node.type === 'input')[1].props.onChange(); assert.deepEqual(h.session.get('active'), ['Sans', 'Serif']);
        h.button('Clear all').props.onClick(); assert.deepEqual(h.session.get('active'), []);
        assert.ok(h.nodes().some((node) => h.text(node).includes('4 local sample results')));
      } else if (id === 'textarea') {
        h.find((node) => node.type === 'textarea').props.onChange({ target: { value: '新文字' } }); assert.equal(h.session.get('value'), '新文字');
        h.button('Clear draft').props.onClick(); assert.equal(h.session.get('value'), '');
      } else if (id === 'slider') {
        h.find((node) => node.type === 'input').props.onChange({ target: { value: '100' } });
        assert.equal(h.button('Increase 10').props.disabled, true); h.button('Decrease 10').props.onClick(); assert.equal(h.session.get('value'), 90);
        h.button('Reset').props.onClick(); assert.equal(h.session.get('value'), 50);
      } else if (id === 'select') {
        h.find((node) => node.type === 'select').props.onChange({ target: { value: 'team' } }); assert.equal(h.session.get('value'), 'team');
        h.button('Reset plan').props.onClick(); assert.equal(h.session.get('value'), 'pro');
      } else if (id === 'color-picker') {
        h.find((node) => node.type === 'input').props.onChange({ target: { value: '#123456' } }); assert.equal(h.session.get('value'), '#123456');
        h.button('Reset color').props.onClick(); assert.equal(h.session.get('value'), '#2563eb');
      } else {
        h.find((node) => node.type === 'input').props.onChange({ target: { value: 'bad-email' } });
        h.find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
        assert.equal(h.find((node) => node.type === 'input').props['aria-invalid'], true);
        h.find((node) => node.props['aria-label'] === 'Clear email').props.onClick(); assert.equal(h.session.get('value'), '');
        assert.equal(h.find((node) => node.type === 'input').props['aria-invalid'], false);
      }
    }
  }
});

test('新增日期与文件队列可翻月、清除、拒绝非法文件和重新选择同名文件', () => {
  for (const style of coverage['date-picker'].styles.filter((style) => !coverage['date-picker'].original.includes(style))) {
    const h = callbackHarness('date-picker', style);
    h.find((node) => node.props['aria-label'] === 'Next month').props.onClick(); assert.deepEqual(h.session.get('yearMonth'), { y: 2026, m: 9 });
    h.button('Clear date').props.onClick(); assert.equal(h.session.get('day'), 0);
    h.find((node) => node.props['aria-label'] === 'Previous month').props.onClick(); assert.equal(h.session.get('day'), 0);
    h.find((node) => node.props['aria-label'] === 'September 18, 2026').props.onClick(); assert.equal(h.session.get('day'), 18);
  }
  for (const style of coverage['file-upload'].styles.filter((style) => !coverage['file-upload'].original.includes(style))) {
    const h = callbackHarness('file-upload', style);
    const native = { value: 'C:\\fakepath\\image.png' };
    h.find((node) => node.type === 'input').props.onChange({ target: { files: [{ name: 'image.png', type: 'image/png', size: 12 }, { name: 'bad.psd', type: '', size: 12 }] }, currentTarget: native });
    assert.equal(native.value, '', 'native input resets so the same file can be selected again');
    assert.deepEqual(h.session.get('files').map((file) => file.name), ['image.png']);
    assert.ok(h.nodes().some((node) => node.props.role === 'alert' && h.text(node).includes('bad.psd')));
    h.find((node) => node.props['aria-label'] === 'Remove image.png').props.onClick(); assert.deepEqual(h.session.get('files'), []);
  }
});


test('标签八种风格均允许重复，删除只影响目标独立 ID', () => {
  for (const style of coverage['tag-input'].styles) {
    const h = callbackHarness('tag-input', style);
    const input = () => h.find((node) => node.type === 'input');
    for (let attempt = 0; attempt < 2; attempt++) {
      input().props.onChange({ target: { value: 'dup' } });
      input().props.onKeyDown({ key: 'Enter', nativeEvent: { isComposing: false }, preventDefault() {} });
    }
    const duplicates = h.session.get('tags').filter((tag) => tag.label.toLowerCase() === 'dup');
    assert.equal(duplicates.length, 2, style);
    assert.notEqual(duplicates[0].id, duplicates[1].id, `${style}: repeated labels have different IDs`);
    const remove = () => h.nodes().filter((node) => node.type === 'button' && node.props['aria-label'] === `Remove ${duplicates[0].label}`);
    assert.equal(remove().length, 2, style);
    remove()[0].props.onClick();
    assert.equal(remove().length, 1, style);
    assert.deepEqual(h.session.get('tags').filter((tag) => tag.label.toLowerCase() === 'dup'), [duplicates[1]], `${style}: only the targeted ID is removed`);
  }
});

test('组合框候选的悬停位移仅在允许动态效果时启用', () => {
  const source = readFileSync(resolve(root, 'src/islands/style-variants/combobox.tsx'), 'utf8');
  const motionTokens = source.match(/[^\s"'`]+(?:translate-[xy]-|scale-)[^\s"'`]+/g) ?? [];
  assert.ok(motionTokens.length > 0);
  assert.ok(motionTokens.every((token) => token.startsWith('motion-safe:')), motionTokens.join(', '));
});


test('组合框八种风格按 taxonomy 双语展示，中英文搜索均匹配且会话 ID 不变', () => {
  const values = ['Aurora', 'Bauhaus', 'Cyberpunk', 'Organic', 'Vaporwave'];
  const taxonomy = ['aurora', 'bauhaus', 'cyberpunk', 'organic', 'vaporwave'];
  const names = Object.fromEntries(values.map((value, index) => [value, yaml.load(readFileSync(resolve(root, `src/content/styles/${taxonomy[index]}.yaml`), 'utf8')).name]));
  for (const variant of sets.combobox) {
    for (const locale of ['zh', 'en']) {
      const html = render(variant, locale);
      for (const name of Object.values(names)) assert.ok(html.includes(name[locale]), `${variant.style}/${locale}: ${name[locale]}`);
      const selectedHtml = render(variant, locale, { value: 'Aurora', comboQuery: 'nomatch' });
      assert.match(selectedHtml, locale === 'zh' ? /已选：极光渐变/ : /Selected: Aurora Gradient/);
      for (const query of ['极光', 'aurora gradient', ' AURORA ']) {
        const h = callbackHarness('combobox', variant.style, locale);
        h.find((node) => node.type === 'input').props.onChange({ target: { value: query } });
        const native = h.find((node) => node.type === 'select');
        if (native) {
          assert.deepEqual(h.nodes().filter((node) => node.type === 'option' && node.props.value).map((node) => node.props.value), ['Aurora']);
          native.props.onChange({ target: { value: 'Aurora' } });
        } else {
          const candidates = h.nodes().filter((node) => node.type === 'button' && 'aria-pressed' in node.props);
          assert.equal(candidates.length, 1, `${variant.style}/${locale}: ${query}`);
          assert.equal(h.text(candidates[0]), names.Aurora[locale]);
          candidates[0].props.onClick();
        }
        assert.equal(h.session.get('value'), 'Aurora', 'localized labels do not replace the stable session ID');
        assert.ok(h.nodes().some((node) => node.props.role === 'status' && h.text(node).includes(names.Aurora[locale])));
      }
    }
  }
});
