import test from 'node:test';
import assert from 'node:assert/strict';
import { placeTooltip, observeTooltipPlacement } from '../../src/lib/tooltip-placement.ts';

const viewport = { left: 0, top: 0, width: 1280, height: 1000 };
const anchor = { left: 439, top: 955.5, width: 170, height: 44 };
test('真实回归：触发器贴近底边时翻到上方，不推动页面', () => {
  const bubble = placeTooltip(anchor, { width: 390, height: 80 }, viewport);
  assert.equal(bubble.placement, 'top');
  assert.equal(bubble.top, 863.5);
  assert.equal(bubble.left, 439);
});
test('顶部空间不足时向下；基本演示的左右偏好在边缘反转', () => {
  assert.equal(placeTooltip({ ...anchor, top: 8 }, { width: 200, height: 50 }, viewport, 'top').placement, 'bottom');
  assert.equal(placeTooltip({ ...anchor, left: 8 }, { width: 200, height: 50 }, viewport, 'left').placement, 'right');
  assert.equal(placeTooltip({ ...anchor, left: 1090 }, { width: 200, height: 50 }, viewport, 'right').placement, 'left');
});
test('窄视口左右边缘、巨大内容和视觉视口偏移均限制在可见范围', () => {
  for (const preferred of ['top', 'bottom', 'left', 'right']) for (const left of [-40, 0, 280, 400]) for (const top of [-30, 8, 760, 900]) {
    const view = { left: 15, top: 20, width: 320, height: 800 };
    const bubble = placeTooltip({ left, top, width: 170, height: 44 }, { width: 900, height: 850 }, view, preferred);
    assert.ok(bubble.left >= 23 && bubble.left + bubble.width <= 327);
    assert.ok(bubble.top >= 28 && bubble.top + bubble.height <= 812);
  }
});
test('正常空间保留首选方向、间隔和基础气泡居中对齐', () => {
  const bubble = placeTooltip({ left: 400, top: 300, width: 100, height: 44 }, { width: 200, height: 50 }, viewport, 'top', 8, true);
  assert.deepEqual(bubble, { placement: 'top', left: 350, top: 242, width: 200, height: 50, arrowX: 100, arrowY: 42 });
});
test('气泡在水平边缘被限制后，箭头仍指向真实触发器并远离气泡圆角', () => {
  const view = { left: 0, top: 0, width: 320, height: 600 };
  const right = placeTooltip({ left: 280, top: 300, width: 32, height: 44 }, { width: 200, height: 50 }, view, 'top', 8, true);
  assert.equal(right.left, 112); assert.equal(right.arrowX, 184);
  const left = placeTooltip({ left: -10, top: 300, width: 32, height: 44 }, { width: 200, height: 50 }, view, 'top', 8, true);
  assert.equal(left.left, 8); assert.equal(left.arrowX, 8);
});

function events() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, callback, capture = false) { const key = `${type}/${capture}`; if (!listeners.has(key)) listeners.set(key, new Set()); listeners.get(key).add(callback); },
    removeEventListener(type, callback, capture = false) { listeners.get(`${type}/${capture}`)?.delete(callback); },
    dispatch(type, capture = false) { for (const callback of [...(listeners.get(`${type}/${capture}`) ?? [])]) callback(); },
  };
}
for (const topLayer of [true, false]) test(`${topLayer ? 'manual 顶层' : '绝对定位回退'}：滚动/resize/尺寸变化重测，保留透明 hover 桥并释放订阅`, () => {
  let observed = [], disconnected = false, popoverOpen = false, showCount = 0, hideCount = 0, resized;
  const visualViewport = { ...events(), offsetLeft: 0, offsetTop: 0, width: 800, height: 800 };
  const view = { ...events(), visualViewport, innerHeight: 800, ResizeObserver: class {
    constructor(callback) { resized = callback; }
    observe(node) { observed.push(node); }
    disconnect() { disconnected = true; observed = []; }
  } };
  let rootRect = { left: 100, top: 700, width: 400, height: 68 };
  let triggerRect = { left: 110, top: 712, width: 170, height: 44 };
  let contentHeight = 72;
  const root = { ownerDocument: { defaultView: view, documentElement: { clientWidth: 800 } }, getBoundingClientRect: () => rootRect, clientLeft: 0, clientTop: 0, scrollLeft: 0, scrollTop: 0 };
  const trigger = { getBoundingClientRect: () => ({ ...triggerRect, right: triggerRect.left + triggerRect.width, bottom: triggerRect.top + triggerRect.height }) };
  const content = { style: {}, get offsetWidth() { return Math.min(400, parseFloat(layer.style.maxWidth)); }, get offsetHeight() { return Math.min(contentHeight, parseFloat(this.style.maxHeight)); }, get scrollHeight() { return contentHeight; } };
  const layer = { firstElementChild: content, style: { setProperty(name, value) { this[name] = value; } }, dataset: {}, removeAttribute(name) { assert.equal(name, 'popover'); }, matches: () => popoverOpen, hidePopover() { popoverOpen = false; hideCount++; } };
  if (topLayer) layer.showPopover = () => { popoverOpen = true; showCount++; };
  const placements = [];
  const cleanup = observeTooltipPlacement(root, trigger, layer, { matchRootWidth: true, onPlacement: (value) => placements.push(value) });
  assert.equal(showCount, topLayer ? 1 : 0);
  assert.equal(layer.dataset.tooltipPlacement, 'top');
  assert.equal(layer.style.padding, '0px 0px 12px 0px');
  assert.equal(layer.style.top, topLayer ? '628px' : '-72px');
  assert.equal(layer.style.width, '400px');
  assert.equal(layer.style.position, topLayer ? 'fixed' : 'absolute');
  assert.equal(observed.length, 3);

  rootRect = { ...rootRect, top: 188 }; triggerRect = { ...triggerRect, top: 200 };
  view.dispatch('scroll', true);
  assert.equal(layer.dataset.tooltipPlacement, 'bottom');
  assert.equal(layer.style.top, topLayer ? '244px' : '56px');
  assert.equal(layer.style.padding, '12px 0px 0px 0px');
  visualViewport.width = 320; view.dispatch('resize');
  assert.equal(layer.style.width, '304px');
  assert.equal(layer.style.left, topLayer ? '8px' : '-92px');
  visualViewport.offsetLeft = 10; visualViewport.dispatch('scroll');
  assert.equal(layer.style.left, topLayer ? '18px' : '-82px');
  visualViewport.height = 400; visualViewport.dispatch('resize');
  contentHeight = 600; resized();
  assert.equal(content.style.maxHeight, '384px');
  assert.equal(content.style.overflowY, 'auto', '极短视口仍可阅读全部内容');
  assert.equal(layer.style.visibility, 'visible');
  triggerRect = { ...triggerRect, top: -4000 }; view.dispatch('scroll', true);
  assert.equal(layer.dataset.tooltipSuspended, 'true');
  assert.equal(layer.style.visibility, 'hidden');
  assert.equal(layer.style.padding, '0px', '屏幕外的触发器不能产生巨大的透明命中区');
  triggerRect = { ...triggerRect, top: 200 }; view.dispatch('scroll', true);
  assert.equal(layer.dataset.tooltipSuspended, 'false');
  assert.equal(layer.style.visibility, 'visible', '重新滚入视口后恢复，而不重置输入状态');
  assert.ok(layer.style.padding.split(' ').every((value) => parseFloat(value) <= 12));
  assert.ok(placements.includes('top') && placements.includes('bottom'));
  cleanup();
  assert.equal(disconnected, true);
  assert.equal(hideCount, topLayer ? 1 : 0);
  assert.ok([...view.listeners.values(), ...visualViewport.listeners.values()].every((set) => set.size === 0));
});
