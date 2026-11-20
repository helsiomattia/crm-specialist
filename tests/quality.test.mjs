import test from 'node:test';
import assert from 'node:assert/strict';
import { javascriptErrors, whitespaceErrors } from '../scripts/lib/quality.mjs';

test('syntax and JSX errors are detected', () => {
  assert.ok(javascriptErrors('const a = ;', 'bad.js').length);
  assert.ok(javascriptErrors('const a = <div>', 'bad.jsx').length);
  assert.deepEqual(javascriptErrors('export const A = () => <div />;', 'good.jsx'), []);
});
test('one safe link does not hide another unsafe link', () => {
  const source = 'const A = () => <><a target="_blank" rel="noopener noreferrer" /><a target="_blank" /></>;';
  assert.equal(javascriptErrors(source, 'links.jsx').length, 1);
});
test('conditional external links preserve their protections', () => {
  assert.deepEqual(javascriptErrors('const A = () => <a target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} />;', 'links.jsx'), []);
});
test('Markdown hard breaks are valid; accidental whitespace is not', () => {
  assert.deepEqual(whitespaceErrors('line  \nnext\n', 'content.md'), []);
  assert.equal(whitespaceErrors('line \n', 'content.md').length, 1);
  assert.equal(whitespaceErrors('const x = 1;  \n', 'code.js').length, 1);
});
