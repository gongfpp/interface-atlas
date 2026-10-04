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
// Source compilation and React SSR only. This does not emulate a browser or a DOM.
function source(relative) {
  let file = resolve(root, relative);
  if (!existsSync(file)) file = ['.ts', '.tsx'].map(ext => file + ext).find(existsSync);
  assert.ok(file, `Source exists: ${relative}`);
  if (cache.has(file)) return cache.get(file);
  const mod = { exports: {} };
  const result = ts.transpileModule(readFileSync(file, 'utf8'), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  new Function('require', 'module', 'exports', result.outputText)(name => name.startsWith('.') ? source(resolve(dirname(file), name)) : require(name), mod, mod.exports);
  cache.set(file, mod.exports);
  return mod.exports;
}
const matrix = JSON.parse(readFileSync(resolve(root, 'src/lib/component-style-coverage.json'), 'utf8'));
const slugs = Object.keys(matrix).filter(id => matrix[id].group === 'navigation');
const variants = Object.fromEntries(slugs.map(id => [id, source(`src/islands/style-variants/${id}.tsx`).default]));
const { createSession } = source('src/islands/style-variants/session.ts');
function render(variant, locale = 'en', state = {}) {
  const session = createSession();
  for (const [key, value] of Object.entries(state)) session.set(key, value);
  return renderToStaticMarkup(createElement(variant.Demo, { session, locale }));
}
const buttons = html => html.match(/<button\b[^>]*>/g) ?? [];

for (const id of slugs) {
  test(`${id}: eight real appearances, preserved originals, canonical bilingual names`, () => {
    const set = variants[id];
    assert.equal(set.length, 8);
    assert.deepEqual(set.map(v => v.style), matrix[id].styles);
    assert.deepEqual(set.slice(0, 3).map(v => v.style), matrix[id].original);
    const content = yaml.load(readFileSync(resolve(root, `src/content/components/${id}.yaml`), 'utf8'));
    assert.deepEqual(content.applicable_styles, matrix[id].styles);
    for (const variant of set) {
      const canonical = yaml.load(readFileSync(resolve(root, `src/content/styles/${variant.style}.yaml`), 'utf8'));
      assert.deepEqual(variant.name, canonical.name);
      assert.ok(variant.note.zh && variant.note.en);
    }
  });
  test(`${id}: every appearance renders bilingual native controls and honest local scope`, () => {
    for (const variant of variants[id]) for (const locale of ['zh', 'en']) {
      const html = render(variant, locale);
      assert.match(html, locale === 'en' ? /Local interaction demo/ : /本地交互演示/);
      assert.ok(buttons(html).length > 0, `${id}/${variant.style}`);
      for (const button of buttons(html)) {
        assert.match(button, /type="button"/);
        assert.match(button, /focus-visible:outline-2/);
      }
      assert.doesNotMatch(html, /<a\b|\baction=|\btarget=|undefined|NaN/);
      for (const [, targets] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) for (const target of targets.split(' ')) {
        assert.ok(html.includes(`id="${target}"`), `${id}/${variant.style} has target ${target}`);
      }
    }
  });
}

test('numeric navigation selection survives every appearance and language', () => {
  for (const id of ['menu', 'sidebar', 'navbar']) {
    for (const variant of variants[id]) for (const locale of ['en', 'zh']) {
      const html = render(variant, locale, { active: 2, navbarMenu: true });
      assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1, `${id}/${variant.style}`);
      assert.match(html, locale === 'en' ? (id === 'navbar' ? /Contact/ : id === 'menu' ? /Library/ : /Archive/) : (id === 'navbar' ? /联系/ : id === 'menu' ? /资料库/ : /档案/));
    }
  }
});

test('accordion and timeline disclosures keep linked collapsed and expanded states', () => {
  for (const id of ['accordion', 'timeline']) for (const variant of variants[id]) {
    const open = render(variant, 'en', { open: 2 });
    assert.equal((open.match(/aria-expanded="true"/g) ?? []).length, 1);
    const closed = render(variant, 'en', { open: -1 });
    assert.doesNotMatch(closed, /aria-expanded="true"/);
    assert.equal((closed.match(/aria-expanded="false"/g) ?? []).length, 3);
  }
});

test('breadcrumb parent navigation and return path are bounded in every appearance', () => {
  for (const variant of variants.breadcrumb) {
    const root = render(variant, 'en', { level: 0 });
    assert.equal((root.match(/aria-current="page"/g) ?? []).length, 1);
    assert.match(root, /Viewing Library/);
    const leaf = render(variant, 'en', { level: 2 });
    assert.match(leaf, /Viewing Components/);
    assert.ok(buttons(leaf).some(b => /disabled=""/.test(b)));
  }
});

test('pagination supports the same complete five-page range across appearances', () => {
  for (const variant of variants.pagination) for (const page of [1, 5]) {
    const html = render(variant, 'en', { page });
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
    assert.match(html, new RegExp(`Page ${page}(?: of| /)`));
    assert.match(html, /Page 5/);
  }
});

test('table variants retain numeric sort direction and shared sample rows', () => {
  for (const variant of variants.table) for (const asc of [false, true]) {
    const html = render(variant, 'en', { asc });
    assert.match(html, new RegExp(`aria-sort="${asc ? 'ascending' : 'descending'}"`));
    assert.ok(asc ? html.indexOf('Colour') < html.indexOf('Layout') : html.indexOf('Layout') < html.indexOf('Colour'));
  }
});

test('tabs preserve the selected panel and a single tab stop', () => {
  for (const variant of variants.tabs) {
    const html = render(variant, 'en', { active: 2 });
    assert.equal((html.match(/role="tab"/g) ?? []).length, 3);
    assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
    assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 3);
    assert.equal((buttons(html).filter(b => /tabindex="0"/.test(b))).length, 1);
    assert.match(html, /Engineering handoff/);
  }
});

test('toolbar has real formatting, reversible selection, and one keyboard entry point', () => {
  for (const variant of variants.toolbar) {
    const html = render(variant, 'en', { active: 1, toolbarFocus: 2 });
    assert.match(html, /role="toolbar"/);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.match(html, /Italic applied/);
    assert.equal(buttons(html).filter(b => /tabindex="0"/.test(b)).length, 1);
    const cleared = render(variant, 'en', { active: -1 });
    assert.match(cleared, /No formatting applied/);
  }
  const expanded = render(variants.toolbar[0], 'en', { toolbarMore: true });
  assert.match(expanded, /aria-expanded="true"/);
  assert.match(expanded, /Arrow keys move between tools/);
});

test('stepper endpoint restarts the local preview instead of submitting or stalling', () => {
  for (const variant of variants.stepper) {
    const html = render(variant, 'en', { step: 2 });
    assert.match(html, /Restart demo/);
    assert.match(html, /Review/);
  }
});

test('avatars, badges and file lists keep shared reversible state', () => {
  for (const variant of variants.avatar) {
    const html = render(variant, 'en', { selected: 2 });
    assert.match(html, /Jules/);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  }
  for (const variant of variants.badge) {
    assert.match(render(variant, 'en', { badgeRead: true }), /All read/);
    assert.match(render(variant, 'en', { badgeRead: false }), /3 new/);
  }
  for (const variant of variants['tree-view']) {
    const html = render(variant, 'en', { expanded: ['public'], selectedFile: 'logo.svg' });
    assert.match(html, /Selected file: logo.svg/);
    assert.equal((html.match(/aria-expanded="true"/g) ?? []).length, 1);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  }
});

test('navigation modules contain no backend simulation, persistence or outbound effects', () => {
  for (const id of slugs) {
    const code = readFileSync(resolve(root, `src/islands/style-variants/${id}.tsx`), 'utf8');
    assert.doesNotMatch(code, /\bfetch\s*\(|localStorage|sessionStorage|window\.open|location\.(?:href|assign)|https?:\/\//);
    assert.doesNotMatch(code, /useSessionState\(session, 'active', (?:en|items\[)/);
  }
});

// Actual JSX function callbacks with hook state slots. No DOM/window/document is constructed.
// These tests prove state transitions, not browser layout, focus, pointer delivery or live keyboard behavior.
const { callbackHarness } = await import('../helpers/callback-harness.mjs');
const action = (h, predicate) => {
  const control = h.find(node => node.type === 'button' && predicate(node));
  assert.ok(control, 'Expected action exists');
  assert.notEqual(control.props.disabled, true, 'Enabled action can run');
  assert.equal(typeof control.props.onClick, 'function');
  control.props.onClick();
  return control;
};

test('callbacks: menu/sidebar/navbar select real sections and keep selection through every skin', () => {
  for (const id of ['menu', 'sidebar', 'navbar']) {
    const shared = createSession();
    for (const style of matrix[id].styles) {
      const h = callbackHarness(id, style, 'en', shared);
      const opener = h.find(n => n.type === 'button' && typeof n.props['aria-expanded'] === 'boolean');
      if (opener && !opener.props['aria-expanded']) action(h, n => n.props['aria-expanded'] === false);
      const label = id === 'navbar' ? 'Contact' : id === 'menu' ? 'Library' : 'Archive';
      action(h, n => h.text(n).includes(label));
      assert.equal(shared.get('active', -1), 2, `${id}/${style}`);
      assert.equal(h.find(n => n.type === 'button' && n.props['aria-current'] === 'page') && h.nodes().filter(n => n.type === 'button' && n.props['aria-current'] === 'page').length, 1);
      if (opener) assert.equal(shared.get('navbarMenu', true), false, 'Selecting a nav item closes its local menu');
    }
    for (const style of matrix[id].styles) {
      const h = callbackHarness(id, style, 'zh', shared);
      const current = h.find(n => n.type === 'button' && n.props['aria-current'] === 'page');
      assert.ok(current, `${id}/${style} restores current selection after remount/locale switch`);
    }
  }
});

test('callbacks: all carousel skins wrap previous/next at both ends', () => {
  for (const style of matrix.carousel.styles) {
    const h = callbackHarness('carousel', style);
    const prev = n => n.props['aria-label'] === 'Previous slide' || /Prev/.test(h.text(n));
    const next = n => n.props['aria-label'] === 'Next slide' || /Next/.test(h.text(n));
    action(h, prev); assert.equal(h.session.get('index', -1), 2, `${style}: previous wraps`);
    action(h, next); assert.equal(h.session.get('index', -1), 0, `${style}: next wraps`);
    action(h, next); assert.equal(h.session.get('index', -1), 1, `${style}: next advances`);
    action(h, prev); assert.equal(h.session.get('index', -1), 0, `${style}: previous returns`);
  }
});

test('callbacks: accordion and timeline open, switch and collapse in every skin', () => {
  for (const id of ['accordion', 'timeline']) for (const style of matrix[id].styles) {
    const h = callbackHarness(id, style);
    action(h, n => n.props['aria-expanded'] === true);
    assert.equal(h.session.get('open', 99), -1, `${id}/${style}: collapse`);
    const controls = h.nodes().filter(n => n.type === 'button' && n.props['aria-expanded'] === false);
    controls[2].props.onClick();
    assert.equal(h.session.get('open', 99), 2, `${id}/${style}: open final item`);
    const switched = callbackHarness(id, matrix[id].styles[(matrix[id].styles.indexOf(style) + 1) % 8], 'zh', h.session);
    assert.equal(switched.nodes().filter(n => n.type === 'button' && n.props['aria-expanded'] === true).length, 1);
  }
});

test('callbacks: breadcrumb navigates to parent and reopens children without routing', () => {
  for (const style of matrix.breadcrumb.styles) {
    const h = callbackHarness('breadcrumb', style);
    action(h, n => h.text(n) === 'Library');
    assert.equal(h.session.get('level', -1), 0);
    action(h, n => h.text(n) === 'Open next level');
    assert.equal(h.session.get('level', -1), 1);
    action(h, n => h.text(n) === 'Open next level');
    assert.equal(h.session.get('level', -1), 2);
    assert.equal(h.button('Open next level').props.disabled, true);
  }
});

test('callbacks: pagination moves within five pages with terminal controls disabled', () => {
  for (const style of matrix.pagination.styles) {
    const h = callbackHarness('pagination', style);
    action(h, n => n.props['aria-label'] === 'Page 1');
    assert.equal(h.session.get('page', 0), 1);
    const prev = h.find(n => n.type === 'button' && n.props['aria-label'] === 'Previous page');
    if (prev) assert.equal(prev.props.disabled, true, `${style}: previous disabled at first page`);
    action(h, n => n.props['aria-label'] === 'Page 5');
    assert.equal(h.session.get('page', 0), 5);
    const next = h.find(n => n.type === 'button' && n.props['aria-label'] === 'Next page');
    if (next) assert.equal(next.props.disabled, true, `${style}: next disabled at last page`);
    if (prev) { action(h, n => n.props['aria-label'] === 'Previous page'); assert.equal(h.session.get('page', 0), 4); }
    action(h, n => n.props['aria-label'] === 'Page 2');
    assert.equal(h.session.get('page', 0), 2);
    if (next) { action(h, n => n.props['aria-label'] === 'Next page'); assert.equal(h.session.get('page', 0), 3); }
  }
});

test('callbacks: every stepper advances, returns where supported, and restarts from review', () => {
  for (const style of matrix.stepper.styles) {
    const h = callbackHarness('stepper', style);
    const forward = n => /Next|Continue|Restart demo/.test(h.text(n));
    action(h, forward); assert.equal(h.session.get('step', -1), 1);
    const back = h.button('Back');
    if (back) {
      action(h, n => h.text(n) === 'Back'); assert.equal(h.session.get('step', -1), 0);
      assert.equal(h.button('Back').props.disabled, true);
      action(h, forward);
    }
    action(h, forward); assert.equal(h.session.get('step', -1), 2);
    action(h, n => h.text(n) === 'Restart demo'); assert.equal(h.session.get('step', -1), 0);
  }
});

test('callbacks: numeric table sorting toggles actual row order in each style', () => {
  for (const style of matrix.table.styles) {
    const h = callbackHarness('table', style);
    const names = () => h.nodes().filter(n => ['td', 'th'].includes(n.type)).map(n => h.text(n)).filter(value => ['Layout', 'Typography', 'Colour'].includes(value));
    assert.deepEqual(names(), ['Layout', 'Typography', 'Colour']);
    action(h, n => /Count|Units/.test(h.text(n)));
    assert.equal(h.session.get('asc', false), true);
    assert.deepEqual(names(), ['Colour', 'Typography', 'Layout']);
    action(h, n => /Count|Units/.test(h.text(n)));
    assert.equal(h.session.get('asc', true), false);
    assert.deepEqual(names(), ['Layout', 'Typography', 'Colour']);
  }
});

test('callbacks: tabs and toolbars update selected content instead of only visual styling', () => {
  for (const style of matrix.tabs.styles) {
    const h = callbackHarness('tabs', style);
    action(h, n => n.props.role === 'tab' && h.text(n) === 'Specs');
    assert.equal(h.session.get('active', -1), 2);
    assert.equal(h.nodes().filter(n => n.props?.role === 'tabpanel' && !n.props.hidden).length, 1);
    assert.match(h.text(h.find(n => n.props?.role === 'tabpanel' && !n.props.hidden)), /Engineering handoff/);
    action(h, n => n.props.role === 'tab' && h.text(n) === 'Design');
    assert.equal(h.session.get('active', -1), 0);
  }
  for (const style of matrix.toolbar.styles) {
    const h = callbackHarness('toolbar', style);
    action(h, n => n.props['aria-label'] === 'Italic');
    assert.equal(h.session.get('active', -2), 1);
    assert.ok(h.find(n => n.type === 'p' && h.text(n) === 'A little style goes a long way.' && n.props.className.includes('italic')));
    action(h, n => n.props['aria-label'] === 'Italic');
    assert.equal(h.session.get('active', -2), -1);
    assert.ok(h.find(n => n.props?.role === 'status' && h.text(n) === 'No formatting applied'));
  }
  const more = callbackHarness('toolbar', 'flat-design');
  action(more, n => more.text(n) === 'More'); assert.equal(more.session.get('toolbarMore', false), true);
  action(more, n => more.text(n) === 'Less'); assert.equal(more.session.get('toolbarMore', true), false);
});

test('callbacks: trees expand/collapse folders and preserve selected file across styles', () => {
  const shared = createSession();
  for (const style of matrix['tree-view'].styles) {
    const h = callbackHarness('tree-view', style, 'en', shared);
    const folder = h.find(n => n.type === 'button' && typeof n.props['aria-expanded'] === 'boolean' && h.text(n).includes('public'));
    assert.ok(folder);
    if (folder.props['aria-expanded']) folder.props.onClick();
    assert.ok(!shared.get('expanded', ['src']).includes('public'));
    action(h, n => typeof n.props['aria-expanded'] === 'boolean' && h.text(n).includes('public'));
    assert.ok(shared.get('expanded', []).includes('public'));
    action(h, n => h.text(n) === 'logo.svg');
    assert.equal(shared.get('selectedFile', ''), 'logo.svg');
    action(h, n => typeof n.props['aria-expanded'] === 'boolean' && h.text(n).includes('public'));
    assert.ok(!shared.get('expanded', []).includes('public'));
  }
});

test('callbacks: badge read/reset and avatar profile changes persist through all skins', () => {
  for (const style of matrix.badge.styles) {
    const h = callbackHarness('badge', style);
    action(h, n => h.text(n) === 'Mark sample messages read');
    assert.equal(h.session.get('badgeRead', false), true);
    action(h, n => h.text(n) === 'Restore unread badges');
    assert.equal(h.session.get('badgeRead', true), false);
  }
  const shared = createSession();
  for (const style of matrix.avatar.styles) {
    const h = callbackHarness('avatar', style, 'en', shared);
    action(h, n => /View (?:teammate 3|Jules)/.test(n.props['aria-label'] ?? ''));
    assert.equal(shared.get('selected', -1), 2);
    assert.ok(h.find(n => n.props?.role === 'status' && h.text(n).includes('Jules')));
    action(h, n => /View (?:teammate 1|Amelia)/.test(n.props['aria-label'] ?? ''));
    assert.equal(shared.get('selected', -1), 0);
  }
});
