import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoute, restoreRedirect, isPlainLeftClick, REDIRECT_QUERY_KEY, REDIRECT_STORAGE_KEY } from '../src/utils/routes.js';

const base = '/crm-specialist';
const origin = 'https://portfolio.example';
const route = (path) => resolveRoute(new URL(`${origin}${base}/${path}`), base);

for (const [input, section] of [['', 'home'], ['expertise', 'expertise'], ['projects', 'projects'], ['contact', 'contact'], ['skills', 'expertise'], ['#skills', 'expertise'], ['unknown', 'home'], ['projects/id/extra', 'home'], ['%E0%A4', 'home']]) {
  test(`section route: ${input || '/'}`, () => assert.deepEqual(route(input), { type: 'home', sectionId: section }));
}
test('project and about-project are not home sections', () => {
  assert.deepEqual(route('projects/crm-customer-360?from=site#demo'), { type: 'project', projectId: 'crm-customer-360' });
  assert.deepEqual(route('about-project'), { type: 'aboutProject' });
  assert.deepEqual(route('projects/unknown'), { type: 'project', projectId: 'unknown' });
});
test('development root and production base are independent', () => {
  assert.equal(resolveRoute(new URL(`${origin}/expertise`), '').sectionId, 'expertise');
  assert.equal(resolveRoute(new URL(`${origin}/crm-specialist-other/expertise`), base).sectionId, 'home');
});
function browserFor(href, { blocked = false, legacy = null } = {}) {
  let location = new URL(href);
  const entries = new Map(legacy ? [[REDIRECT_STORAGE_KEY, legacy]] : []);
  const calls = [];
  return {
    get location() { return location; },
    get sessionStorage() {
      if (blocked) throw new Error('SecurityError');
      return { getItem: key => entries.get(key), removeItem: key => entries.delete(key) };
    },
    history: { replaceState: (_, __, value) => { calls.push(value); location = new URL(value, origin); } }, calls, entries,
  };
}
test('404 transport preserves section, query, hash with storage blocked', () => {
  const target = `${base}/expertise?filter=a%26b#skills`;
  const browser = browserFor(`${origin}${base}/?${REDIRECT_QUERY_KEY}=${encodeURIComponent(target)}`, { blocked: true });
  restoreRedirect(browser, base);
  assert.equal(browser.location.href, origin + target);
  assert.deepEqual(resolveRoute(browser.location, base), { type: 'home', sectionId: 'expertise' });
  const before = browser.location.href;
  restoreRedirect(browser, base);
  assert.equal(browser.location.href, before);
  assert.equal(browser.calls.length, 1);
});
test('repeated route resolution does not consume legacy storage', () => {
  const browser = browserFor(`${origin}${base}/?q=one`, { legacy: 'projects/lwc' });
  restoreRedirect(browser, base);
  const first = resolveRoute(browser.location, base);
  assert.deepEqual(resolveRoute(browser.location, base), first);
  assert.deepEqual(first, { type: 'project', projectId: 'lwc' });
  assert.equal(browser.entries.size, 0);
  assert.equal(browser.location.search, '?q=one');
});
test('404 transport rejects outside origins, paths and backslashes', () => {
  for (const unsafe of ['//attacker.example/x', 'https://attacker.example/x', '/outside/path', '/\\attacker.example/x']) {
    const browser = browserFor(`${origin}${base}/?${REDIRECT_QUERY_KEY}=${encodeURIComponent(unsafe)}`);
    restoreRedirect(browser, base);
    assert.equal(browser.location.href, `${origin}${base}/`);
  }
});
test('modified and middle clicks keep native new-tab behavior', () => {
  assert.equal(isPlainLeftClick({ button: 0 }), true);
  for (const event of [{button:1}, {button:0,ctrlKey:true}, {metaKey:true}, {shiftKey:true}, {altKey:true}, {defaultPrevented:true}]) assert.equal(isPlainLeftClick(event), false);
});
