import { createElement } from 'react';
import { sourceLoader } from './load-source.mjs';
/** 只运行 JSX 函数与受控事件回调。没有 document、window 或 DOM；不能证明浏览器焦点/布局。 */
export function callbackHarness(id, style, locale = 'en', sharedSession) {
  const slots = []; const refs = []; let cursor = 0; let refCursor = 0; let effects = [];
  const hooks = {
    useId: () => 'callback-unit-id',
    useRef: (initial) => refs[refCursor++] ??= { current: initial },
    // 默认仍不运行副作用；测试可显式注入节点替身并执行当前渲染捕获的 effect。
    useEffect: (effect) => { effects.push(effect); },
    useLayoutEffect: (effect) => { effects.push(effect); },
    useCallback: (callback) => callback,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (next) => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
    },
  };
  const load = sourceLoader({ react: hooks });
  const session = sharedSession ?? load('src/islands/style-variants/session.ts').createSession();
  const variant = load(`src/islands/style-variants/${id}.tsx`).default.find((entry) => entry.style === style);
  function visit(element) {
    if (element == null || typeof element !== 'object') return element;
    if (Array.isArray(element)) return element.map(visit);
    if (typeof element.type === 'function') return visit(element.type(element.props));
    return { type: element.type, props: { ...element.props, children: visit(element.props.children) } };
  }
  function draw() { cursor = 0; refCursor = 0; effects = []; return visit(createElement(variant.Demo, { session, locale })); }
  function nodes(node) { if (node == null || typeof node !== 'object') return []; if (Array.isArray(node)) return node.flatMap(nodes); return [node, ...nodes(node.props.children)]; }
  const text = (node) => node == null ? '' : Array.isArray(node) ? node.map(text).join('') : typeof node === 'object' ? text(node.props.children) : String(node);
  return { session, refs: () => refs, effects: () => effects, nodes: () => nodes(draw()), text, find: (predicate) => nodes(draw()).find(predicate), button: (label) => nodes(draw()).find((node) => node.type === 'button' && text(node) === label) };
}
export function keyEvent(key) { return { key, preventDefault() {}, stopPropagation() {} }; }
