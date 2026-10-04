import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTooltipInteraction, tooltipHasHoverPointer, tooltipIsVisible, updateTooltipInteraction } from '../../src/lib/tooltip-interaction.ts';
import { callbackHarness, keyEvent } from '../helpers/callback-harness.mjs';
const trace = (...actions) => actions.reduce(updateTooltipInteraction, createTooltipInteraction());

test('保留焦点时，指针进入再离开不能关闭提示', () => {
  const state = trace('focus', 'pointer-enter', 'pointer-leave');
  assert.equal(state.focused, true); assert.equal(state.hovered, false); assert.equal(tooltipIsVisible(state), true);
  assert.equal(tooltipIsVisible(updateTooltipInteraction(state, 'blur')), false);
});
test('保留悬停时，聚焦再失焦不能关闭提示', () => {
  const state = trace('pointer-enter', 'focus', 'blur');
  assert.equal(state.hovered, true); assert.equal(state.focused, false); assert.equal(tooltipIsVisible(state), true);
  assert.equal(tooltipIsVisible(updateTooltipInteraction(state, 'pointer-leave')), false);
});
for (const exits of [['pointer-leave', 'blur'], ['blur', 'pointer-leave']]) test(`Esc 在双通道下持续关闭，按 ${exits.join(' → ')} 退出后才能重新唤起`, () => {
  let state = trace('focus', 'pointer-enter', 'dismiss');
  assert.equal(tooltipIsVisible(state), false);
  state = updateTooltipInteraction(state, exits[0]);
  assert.equal(tooltipIsVisible(state), false); assert.equal(state.dismissed, true);
  const reenter = exits[0] === 'pointer-leave' ? 'pointer-enter' : 'focus';
  const stillActive = updateTooltipInteraction(state, reenter);
  assert.equal(tooltipIsVisible(stillActive), false, 'Another active source keeps the explicit dismissal in force');
  state = updateTooltipInteraction(state, exits[1]);
  assert.equal(state.dismissed, false); assert.equal(tooltipIsVisible(state), false);
  assert.equal(tooltipIsVisible(updateTooltipInteraction(state, 'pointer-enter')), true);
});
test('首次 focus → 点按保持显示；二次点按关闭，显式再激活可重新打开', () => {
  let state = trace('focus', 'activate'); assert.equal(tooltipIsVisible(state), true);
  state = updateTooltipInteraction(state, 'activate'); assert.equal(tooltipIsVisible(state), false); assert.equal(state.focused, true);
  state = updateTooltipInteraction(state, 'activate'); assert.equal(tooltipIsVisible(state), true);
  state = updateTooltipInteraction(state, 'dismiss'); assert.equal(tooltipIsVisible(state), false);
  assert.equal(tooltipIsVisible(updateTooltipInteraction(state, 'activate')), true);
});
for (const dismissal of ['activate', 'dismiss']) test(`无焦点触屏激活后 ${dismissal} 关闭，不留下过期抑制`, () => {
  const state = trace('activate', dismissal);
  assert.equal(tooltipIsVisible(state), false); assert.equal(state.dismissed, false);
  assert.equal(tooltipIsVisible(updateTooltipInteraction(state, 'pointer-enter')), true);
});
test('点按后失焦清除点按固定；鼠标悬停仍可独立保留提示', () => {
  assert.equal(tooltipIsVisible(trace('focus', 'activate', 'blur')), false);
  const state = trace('pointer-enter', 'focus', 'activate', 'blur');
  assert.equal(state.activated, false); assert.equal(tooltipIsVisible(state), true);
});
test('触摸指针不伪装成持续悬停，鼠标与笔保留悬停能力', () => {
  assert.equal(tooltipHasHoverPointer('touch'), false); assert.equal(tooltipHasHoverPointer(''), false);
  assert.equal(tooltipHasHoverPointer('mouse'), true); assert.equal(tooltipHasHoverPointer('pen'), true);
});
test('重复 Esc 幂等，且不会篡改物理焦点或悬停来源', () => {
  const state = trace('pointer-enter', 'focus', 'activate', 'dismiss');
  assert.deepEqual(updateTooltipInteraction(state, 'dismiss'), state);
  assert.equal(state.hovered, true); assert.equal(state.focused, true); assert.equal(state.activated, false);
});

const { tooltip: { styles } } = JSON.parse(readFileSync(new URL('../../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));
for (const style of styles) for (const locale of ['zh', 'en']) test(`${style}/${locale}: 实际回调正确处理交错输入，ARIA 同步，重挂载不恢复瞬态`, () => {
  const h = callbackHarness('tooltip', style, locale);
  h.session.set('open', true); // 旧会话里的过期显示状态必须被忽略。
  const trigger = () => h.find((node) => node.type === 'button');
  const region = () => h.find((node) => typeof node.props.onPointerEnter === 'function');
  const shown = () => Boolean(h.find((node) => node.props.role === 'tooltip'));
  const assertShown = (value) => { assert.equal(shown(), value); assert.equal(Boolean(trigger().props['aria-describedby']), value); };
  assertShown(false);
  trigger().props.onFocus(); region().props.onPointerEnter({ pointerType: 'mouse' }); region().props.onPointerLeave({ pointerType: 'mouse' }); assertShown(true);
  trigger().props.onBlur(); assertShown(false);
  region().props.onPointerEnter({ pointerType: 'pen' }); trigger().props.onFocus(); trigger().props.onBlur(); assertShown(true);
  region().props.onPointerCancel({ pointerType: 'pen' }); assertShown(false);
  trigger().props.onFocus(); region().props.onPointerEnter({ pointerType: 'mouse' }); trigger().props.onKeyDown(keyEvent('Escape')); assertShown(false);
  region().props.onPointerLeave({ pointerType: 'mouse' }); region().props.onPointerEnter({ pointerType: 'mouse' }); assertShown(false);
  trigger().props.onBlur(); assertShown(false); region().props.onPointerLeave({ pointerType: 'mouse' });
  region().props.onPointerEnter({ pointerType: 'touch' }); assertShown(false);
  trigger().props.onFocus(); trigger().props.onClick(); assertShown(true); trigger().props.onClick(); assertShown(false);
  trigger().props.onClick(); assertShown(true);
  const remounted = callbackHarness('tooltip', styles[(styles.indexOf(style) + 1) % styles.length], locale, h.session);
  assert.equal(remounted.find((node) => node.props.role === 'tooltip'), undefined);
});
