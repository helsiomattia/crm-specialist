import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEmbedDocument, readEmbedMessage, createEmbedToken, EMBED_CHANNEL } from '../src/utils/embedBridge.js';

const source = {};
const token = 'a-valid-frame-token';
const data = { channel: EMBED_CHANNEL, token, type: 'height', height: 820 };
const event = payload => ({ source, origin: 'null', data: payload });
test('only the selected opaque frame and current token are accepted', () => {
  assert.deepEqual(readEmbedMessage(event(data), source, token), { type: 'height', height: 820 });
  assert.equal(readEmbedMessage({ ...event(data), source: {} }, source, token), null);
  assert.equal(readEmbedMessage({ ...event(data), origin: 'https://example.org' }, source, token), null);
  assert.equal(readEmbedMessage(event(data), source, 'old-token'), null);
  assert.equal(readEmbedMessage(event(data), null, token), null);
});
test('invalid messages and arbitrary commands are ignored', () => {
  for (const value of [null, [], 'height', {}, { ...data, extra: 'run' }, { ...data, type: 'navigate' }, { ...data, height: Infinity }, { ...data, height: NaN }, { ...data, height: -1 }, { ...data, height: 20001 }, { ...data, height: 12.5 }, { ...data, height: '820' }]) assert.equal(readEmbedMessage(event(value), source, token), null);
});
test('scroll is finite and bounded', () => {
  assert.deepEqual(readEmbedMessage(event({ channel: EMBED_CHANNEL, token, type: 'scroll', deltaY: -80 }), source, token), { type: 'scroll', deltaY: -80 });
  for (const deltaY of [Infinity, -Infinity, NaN, 1201, -1201, '80']) assert.equal(readEmbedMessage(event({ channel: EMBED_CHANNEL, token, type: 'scroll', deltaY }), source, token), null);
});
test('bridge keeps original HTML and does not inject configuration as markup', () => {
  const html = '<html><body><h1>Demo</h1><script>window.demo=true;</script></body></html>';
  const result = buildEmbedDocument(html, '</script><img src=x>', 'https://portfolio.example');
  assert.ok(result.includes('<h1>Demo</h1><script>window.demo=true;</script>'));
  assert.equal(result.includes('<img src=x>'), false);
  assert.ok(result.endsWith('</body></html>'));
  assert.throws(() => buildEmbedDocument('', token, 'https://portfolio.example'));
});
test('frame tokens are independent per document', () => {
  assert.match(createEmbedToken(), /^[a-f0-9]{32}$/);
  assert.notEqual(createEmbedToken(), createEmbedToken());
});
