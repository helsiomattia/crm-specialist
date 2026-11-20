import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioProjects } from '../src/data/portfolioProjects.js';
import { PROJECT_EMBED_LOADERS, loadPortfolioProjectEmbed } from '../src/data/projectEmbeds.js';
import { portfolioErrors, localeErrors } from '../scripts/lib/data-validation.mjs';

const ids = Object.keys(PROJECT_EMBED_LOADERS);
test('current catalog has all 18 entries and 16 embeds', () => {
  assert.equal(portfolioProjects.length, 18);
  assert.equal(ids.length, 16);
  assert.deepEqual(portfolioErrors(portfolioProjects, ids), []);
});
test('duplicate IDs, invalid parents, cycles and missing loaders are detected', () => {
  assert.match(portfolioErrors([...portfolioProjects, portfolioProjects[0]], ids).join(' '), /duplicate/);
  const invalidParent = structuredClone(portfolioProjects);
  invalidParent[1].parentId = 'missing';
  assert.match(portfolioErrors(invalidParent, ids).join(' '), /parentId/);
  const cycle = structuredClone(portfolioProjects);
  cycle.find(item => item.id === 'lwc').parentId = 'lwc';
  assert.match(portfolioErrors(cycle, ids).join(' '), /cycle/);
  assert.match(portfolioErrors(portfolioProjects, ids.slice(1)).join(' '), /missing loader/);
  assert.match(portfolioErrors(portfolioProjects, [...ids, 'orphan']).join(' '), /orphan loader/);
});
test('localized content and external URL schemes are required', () => {
  const projects = structuredClone(portfolioProjects);
  projects[0].externalUrl = 'javascript:alert(1)';
  projects[1].title.en = '';
  const errors = portfolioErrors(projects, ids).join(' ');
  assert.match(errors, /HTTPS/);
  assert.match(errors, /title.en/);
});
test('missing and extra translation keys are reported', () => {
  const good = { pt: { a: { b: 'x' } }, en: { a: { b: 'y' } }, es: { a: { b: 'z' } } };
  assert.deepEqual(localeErrors(good, ['a.b']), []);
  good.en.a.b = '';
  good.es.extra = 'extra';
  const errors = localeErrors(good, ['a.b', 'missing']).join(' ');
  assert.match(errors, /en: missing a.b/);
  assert.match(errors, /extra/);
  assert.match(errors, /missing missing/);
});
test('loaders propagate failure, reject empty data and missing IDs', async () => {
  assert.equal(await loadPortfolioProjectEmbed('valid', { valid: async () => ({ default: '<html>demo</html>' }) }), '<html>demo</html>');
  await assert.rejects(loadPortfolioProjectEmbed('toString'), /No embed loader/);
  await assert.rejects(loadPortfolioProjectEmbed('empty', { empty: async () => ({ default: '' }) }), /Empty embed/);
  await assert.rejects(loadPortfolioProjectEmbed('broken', { broken: async () => { throw new Error('network failed'); } }), /network failed/);
});
