import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { callbackHarness, keyEvent } from '../helpers/callback-harness.mjs';
const matrix = JSON.parse(readFileSync(new URL('../../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));
const feedback = Object.entries(matrix).filter(([id, row]) => row.group === 'feedback' && !['button', 'card'].includes(id));
const click = (h, label) => { const button = h.button(label); assert.ok(button, label); button.props.onClick(); };

for (const [id, { styles }] of feedback) test(`${id}: 八种材质中真实回调可操作、可取消/复位，${id === 'tooltip' ? '提示瞬态在重挂载时复位' : '同一会话跨样式保留'}`, () => {
  let shared;
  for (const style of styles) {
    const h = callbackHarness(id, style, 'en', shared); shared = h.session;
    if (id === 'alert') {
      click(h, 'Reset'); click(h, 'Retry demo'); assert.equal(shared.get('alertState'), 'resolved');
      assert.equal(h.button('Retry demo').props.disabled, true);
      click(h, 'Hide notice'); assert.equal(shared.get('alertVisible'), false);
      click(h, 'Show notice'); assert.equal(shared.get('alertVisible'), true);
    } else if (['modal', 'drawer', 'bottom-sheet'].includes(id)) {
      click(h, 'Reset demo'); click(h, 'Open demo'); assert.equal(shared.get('open'), true);
      click(h, 'Cancel'); assert.equal(shared.get('open'), false); assert.equal(shared.get('dialogChoice'), false);
      click(h, 'Open demo'); click(h, 'Confirm demo'); assert.equal(shared.get('dialogChoice'), true);
      click(h, 'Open demo'); click(h, 'Cancel'); assert.equal(shared.get('dialogChoice'), true, 'Cancel must preserve confirmed value');
      click(h, 'Open demo'); h.find((node) => node.props.role === 'dialog').props.onKeyDown(keyEvent('Escape'));
      assert.equal(shared.get('open'), false); assert.equal(shared.get('dialogOutcome'), 'cancelled');
    } else if (['dropdown', 'fab', 'split-button'].includes(id)) {
      click(h, 'Undo demo action');
      h.find((node) => node.props['aria-label'] === 'Expand demo actions').props.onClick();
      assert.equal(shared.get('open'), true); click(h, 'Create copy'); assert.equal(shared.get('menuAction'), 1); assert.equal(shared.get('open'), false);
      h.find((node) => node.props['aria-label'] === 'Expand demo actions').props.onClick(); click(h, 'Cancel'); assert.equal(shared.get('menuAction'), 1);
      if (id === 'split-button') { click(h, 'New draft'); assert.equal(shared.get('menuAction'), 0); }
      click(h, 'Undo demo action'); assert.equal(shared.get('menuAction'), -1);
    } else if (id === 'command-palette') {
      click(h, 'Reset command'); let input = h.find((node) => node.type === 'input'); input.props.onKeyDown(keyEvent('ArrowDown'));
      input = h.find((node) => node.type === 'input'); input.props.onKeyDown(keyEvent('Enter')); assert.equal(shared.get('commandResult'), 1);
      input = h.find((node) => node.type === 'input'); input.props.onChange({ target: { value: 'no-matching-result' } });
      input = h.find((node) => node.type === 'input'); input.props.onKeyDown(keyEvent('Enter')); assert.equal(shared.get('commandResult'), 1, 'Empty list cannot execute');
      input.props.onKeyDown(keyEvent('Escape')); assert.equal(shared.get('commandQuery'), '');
      click(h, 'Switch layout'); assert.equal(shared.get('commandResult'), 2);
    } else if (id === 'lightbox') {
      click(h, 'Open image demo'); const before = shared.get('index', 0); click(h, 'Previous'); assert.equal(shared.get('index'), (before + 2) % 3);
      click(h, 'Next'); assert.equal(shared.get('index'), before);
      h.find((node) => node.props.role === 'dialog').props.onKeyDown(keyEvent('ArrowRight')); assert.equal(shared.get('index'), (before + 1) % 3);
      h.find((node) => node.props.role === 'dialog').props.onKeyDown(keyEvent('Escape')); assert.equal(shared.get('open'), false);
    } else if (id === 'popover') {
      click(h, 'View atlas information'); assert.equal(shared.get('open'), true);
      h.find((node) => typeof node.props.onKeyDown === 'function').props.onKeyDown(keyEvent('Escape')); assert.equal(shared.get('open'), false);
      click(h, 'View atlas information'); click(h, 'Close information'); assert.equal(shared.get('open'), false);
    } else if (id === 'progress-bar') {
      click(h, 'Reset'); assert.equal(shared.get('pct'), 0);
      assert.ok(h.nodes().some((node) => node.props.hidden === true && node.props.style?.width === '0%'), '0% hides fill, including inherited padding and borders');
      for (let i = 0; i < 8; i += 1) click(h, 'Advance 20%'); assert.equal(shared.get('pct'), 100);
      assert.equal(h.button('Advance 20%').props.disabled, true);
      for (let i = 0; i < 8; i += 1) click(h, 'Go back 20%'); assert.equal(shared.get('pct'), 0);
    } else if (id === 'toast') {
      click(h, 'Show toast'); assert.equal(shared.get('visible'), true); click(h, 'Undo'); assert.equal(shared.get('toastUndone'), true);
      assert.equal(h.button('Undo').props.disabled, true); click(h, 'Dismiss'); assert.equal(shared.get('visible'), false);
      click(h, 'Show toast'); assert.equal(shared.get('toastUndone'), false);
    } else if (id === 'tooltip') {
      const shown = () => Boolean(h.find((node) => node.props.role === 'tooltip'));
      let trigger = h.button('Hover, focus or tap for help'); trigger.props.onFocus();
      trigger = h.button('Hover, focus or tap for help'); trigger.props.onClick(); assert.equal(shown(), true, 'First tap must not undo the preceding focus');
      trigger = h.button('Hover, focus or tap for help'); trigger.props.onKeyDown(keyEvent('Escape')); assert.equal(shown(), false);
      trigger = h.button('Hover, focus or tap for help'); trigger.props.onBlur();
      h.find((node) => typeof node.props.onPointerEnter === 'function').props.onPointerEnter({ pointerType: 'mouse' }); assert.equal(shown(), true);
      h.find((node) => typeof node.props.onPointerLeave === 'function').props.onPointerLeave({ pointerType: 'mouse' }); assert.equal(shown(), false);
    }
    const restored = callbackHarness(id, style, 'zh', shared);
    assert.match(restored.nodes().map(restored.text).join(' '), /本地交互演示/);
    assert.doesNotThrow(() => restored.nodes());
  }
});
