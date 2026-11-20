import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { resolveConfig } from 'vite';
import { restoreRedirect, resolveRoute } from '../src/utils/routes.js';

const production = await resolveConfig({ logLevel: 'error' }, 'build');
const development = await resolveConfig({ logLevel: 'error' }, 'serve');
assert.equal(production.base, '/crm-specialist/');
assert.equal(development.base, '/');
const script = (await readFile('public/404.html', 'utf8')).match(/<script>([\s\S]*?)<\/script>/)[1];
for (const [path, expected] of [['expertise', 'home'], ['projects', 'home'], ['contact', 'home'], ['skills', 'home'], ['about-project', 'aboutProject'], ['projects/lwc', 'project']]) {
  let location = new URL(`https://portfolio.example/crm-specialist/${path}?campaign=a%26b#anchor`);
  const original = location.href;
  const mock = {
    get location() { return { pathname: location.pathname, search: location.search, hash: location.hash, href: location.href, replace(value) { location = new URL(value, location.origin); } }; },
    get sessionStorage() { throw new Error('Storage blocked'); },
    history: { replaceState(_, __, value) { location = new URL(value, location.origin); } },
  };
  vm.runInNewContext(script, { window: mock });
  restoreRedirect(mock, '/crm-specialist');
  assert.equal(location.href, original);
  assert.equal(resolveRoute(location, '/crm-specialist').type, expected);
}
console.log('Smoke passed: real Vite configuration and 404 → bootstrap roundtrip with storage blocked.');
