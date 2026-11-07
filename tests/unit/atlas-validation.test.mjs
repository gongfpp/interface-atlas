import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAtlasText } from '../../src/lib/atlas-forms.ts';

test('必填标题不能只含空白，非空中文和英文均可用', () => {
  for (const value of ['', '   ', '\n\t', '\u3000']) assert.equal(validateAtlasText(value, true, 48), 'required');
  for (const value of ['标题', 'Title', ' Title ']) assert.equal(validateAtlasText(value, true, 48), null);
});
test('长度上限接受边界值，可选字段不误报空白', () => {
  assert.equal(validateAtlasText('a'.repeat(48), true, 48), null);
  assert.equal(validateAtlasText('a'.repeat(49), true, 48), 'length');
  assert.equal(validateAtlasText('', false, 48), null);
  assert.equal(validateAtlasText('a'.repeat(200), true, -1), null);
});
