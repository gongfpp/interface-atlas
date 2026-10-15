import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as yaml from 'js-yaml';
import { sourceLoader } from '../helpers/load-source.mjs';
const load = sourceLoader();
const root = new URL('../../', import.meta.url);
const matrix = JSON.parse(readFileSync(new URL('src/lib/component-style-coverage.json', root), 'utf8'));
const wallComponents = new Set(['button', 'input', 'card', 'select', 'checkbox', 'switch']);
const { createSession } = load('src/islands/style-variants/session.ts');
const definition = (kind, id) => yaml.load(readFileSync(new URL(`src/content/${kind}/${id}.yaml`, root), 'utf8'));
const sets = Object.fromEntries(Object.keys(matrix).map((id) => [id, load(`src/islands/style-variants/${id}.tsx`).default]));
const render = (variant, locale, state = {}) => { const session = createSession(); for (const [key, value] of Object.entries(state)) session.set(key, value); return renderToStaticMarkup(createElement(variant.Demo, { locale, session })); };

test('范围门禁：40 个组件各八套，核心六类按批准数量扩展，保留 147 套基线，总计 401 套', () => {
  const ids = readdirSync(new URL('src/content/components/', root)).filter((file) => file.endsWith('.yaml')).map((file) => file.slice(0, -5)).sort();
  assert.deepEqual(Object.keys(matrix), ids);
  assert.equal(ids.length, 46);
  assert.equal(Object.values(matrix).reduce((total, row) => total + row.original.length, 0), 147);
  assert.equal(Object.values(sets).reduce((total, set) => total + set.length, 0), 401);
  for (const id of Object.keys(matrix)) assert.equal(sets[id].length, wallComponents.has(id) ? id === 'button' ? 21 : 12 : 8, `${id}: approved coverage`);
  assert.equal(readdirSync(new URL('src/content/styles/', root)).filter((file) => file.endsWith('.yaml')).length, 25);
});

for (const [id, row] of Object.entries(matrix)) {
  test(`${id}: 注册数量精确、完整保留原风格、taxonomy 与 YAML 关联一致`, () => {
    const set = sets[id];
    assert.equal(set.length, row.styles.length); assert.equal(new Set(set.map((entry) => entry.style)).size, row.styles.length);
    assert.deepEqual(set.map((entry) => entry.style), row.styles);
    assert.deepEqual(set.slice(0, row.original.length).map((entry) => entry.style), row.original);
    assert.deepEqual(definition('components', id).applicable_styles, row.styles);
    for (const entry of set) {
      assert.deepEqual(entry.name, definition('styles', entry.style).name, `${id}/${entry.style}: canonical style name`);
      assert.ok(entry.note.zh.length > 8 && entry.note.en.length > 8);
      assert.equal(typeof entry.Demo, 'function');
      if (wallComponents.has(id)) {
        assert.equal(typeof entry.Sample, 'function');
        for (const locale of ['zh', 'en']) {
          const sample = renderToStaticMarkup(createElement(entry.Sample, { locale }));
          assert.match(sample, new RegExp(`data-style-sample="${entry.style}"`));
          assert.match(sample, /aria-hidden="true"/);
          assert.doesNotMatch(sample, /<(?:button|input|select|textarea)\b/);
        }
      } else assert.equal(entry.Sample, undefined);
    }
  });
  test(`${id}: 所有风格均以真实 React 双语渲染，材质结构不同且具备实际控件`, () => {
    const signatures = new Set();
    for (const entry of sets[id]) {
      for (const locale of ['zh', 'en']) {
        const html = render(entry, locale);
        assert.match(html, /<(?:button|input|select|textarea)\b/, `${id}/${entry.style}: must include a real interactive control`);
        assert.doesNotMatch(html, /href=["'](?:https?:|#)|\baction=/, `${id}/${entry.style}: no false navigation or submission`);
        if (locale === 'zh') assert.match(html, /[\u4e00-\u9fff]/);
        else assert.doesNotMatch(html, /[\u4e00-\u9fff]/, `${id}/${entry.style}: English rendering contains untranslated Chinese`);
        assert.doesNotMatch(html, /undefined|NaN/);
        if (locale === 'en') signatures.add([...html.matchAll(/class="([^"]+)"/g)].map((match) => match[1]).join('|'));
      }
    }
    assert.equal(signatures.size, row.styles.length, `${id}: each style changes material, type, shape or layout classes`);
  });
}

const feedbackStates = {
  alert: { alertState: 'resolved', alertVisible: true },
  'bottom-sheet': { open: true, dialogChoice: true, dialogOutcome: 'confirmed' },
  'command-palette': { commandQuery: 'nothing-matches-this', commandResult: 1 },
  drawer: { open: true, dialogOutcome: 'cancelled' },
  dropdown: { open: true, menuAction: 1 },
  fab: { open: true, menuAction: 0 },
  lightbox: { open: true, index: 2 },
  modal: { open: true, dialogChoice: true, dialogOutcome: 'cancelled' },
  popover: { open: true },
  'progress-bar': { pct: 100 },
  'split-button': { open: true, menuAction: 2 },
  toast: { visible: true, toastUndone: true },
};
for (const [id, state] of Object.entries(feedbackStates)) test(`${id}: 全八风格恢复同一已操作状态，附加形式不冒充后端实现`, () => {
  const session = createSession(); for (const [key, value] of Object.entries(state)) session.set(key, value);
  for (const entry of sets[id]) for (const locale of ['zh', 'en']) {
    const html = renderToStaticMarkup(createElement(entry.Demo, { session, locale }));
    assert.match(html, locale === 'zh' ? /本地交互演示/ : /Local interaction demo/);
    if (['drawer', 'modal', 'bottom-sheet', 'lightbox'].includes(id)) { assert.match(html, /role="dialog"/); assert.doesNotMatch(html, /aria-modal/); }
    if (id === 'progress-bar') assert.match(html, /aria-valuenow="100"/);
    if (id === 'toast') assert.match(html, locale === 'zh' ? /已撤销/ : /undone/);
    if (id === 'command-palette') assert.match(html, locale === 'zh' ? /没有匹配命令/ : /No matching commands/);
  }
});

test('风格配方包含独立几何、字体与材质，不包含未授权业务副作用或连续装饰动画', () => {
  const source = readFileSync(new URL('src/islands/shared/styleRecipe.tsx', root), 'utf8');
  assert.match(source, /font-serif/); assert.match(source, /font-mono/); assert.match(source, /grid-cols-/); assert.match(source, /backdrop-blur/); assert.match(source, /shadow-\[inset/); assert.match(source, /border-double/);
  for (const path of ['src/islands/shared/styleRecipe.tsx', 'src/islands/shared/feedbackRecipes.tsx']) assert.doesNotMatch(readFileSync(new URL(path, root), 'utf8'), /\bfetch\s*\(|localStorage|window\.open|location\.(?:assign|href)|setInterval|animate-pulse/);
});


test('选中配方保留边界几何并替换旧颜色，不叠冲突色或阴影', () => {
  const { recipe } = load('src/islands/shared/styleRecipe.tsx');
  const glass = recipe('glassmorphism');
  assert.match(glass.active, /rounded-xl/);
  assert.ok(glass.active.split(' ').includes('border-white'));
  assert.ok(!glass.active.split(' ').includes('border-white/60'));
  assert.ok(!glass.active.split(' ').includes('bg-[#183250]/90'));
  const neu = recipe('neumorphism');
  assert.match(neu.active, /border-\[#1756a9\]/);
  assert.doesNotMatch(neu.active, /border-\[#738496\]/);
  assert.equal(neu.active.split(' ').filter((token) => token.startsWith('shadow-')).length, 1);
  assert.match(neu.active, /min-h-11/);
});
