import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { portfolioProjects } from '../src/data/portfolioProjects.js';
import { PROJECT_EMBED_LOADERS } from '../src/data/projectEmbeds.js';
import { portfolioErrors, localeErrors, flattenKeys } from './lib/data-validation.mjs';
import { listFiles } from './lib/files.mjs';
import { readBlogContent, validateEditorial } from './lib/blog-content.mjs';

assert.equal(portfolioProjects.length, 18, 'Unexpected catalog size; review intentional changes');
assert.equal(Object.keys(PROJECT_EMBED_LOADERS).length, 16);
assert.deepEqual(portfolioErrors(portfolioProjects, Object.keys(PROJECT_EMBED_LOADERS)), []);
const resources = {};
for (const language of ['pt', 'en', 'es']) resources[language] = JSON.parse(await readFile(`src/locales/${language}/common.json`, 'utf8'));
const requiredKeys = new Set();
for (const file of await listFiles('src')) {
  if (!/\.jsx?$/.test(file)) continue;
  for (const match of (await readFile(file, 'utf8')).matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) requiredKeys.add(match[1]);
}
assert.deepEqual(localeErrors(resources, [...requiredKeys]), []);
const blogPosts = await readBlogContent(process.cwd());
const editorial = await validateEditorial(process.cwd(), blogPosts);
console.log(`Blog passed: ${editorial.published} published, ${editorial.ready} ready for author review, ${blogPosts.filter(post => post.status === 'draft').length} drafts; ${editorial.backlog} backlog entries (${editorial.backlogCompleted} completed, ${editorial.backlogOpen} open).`);

// Execute the real Vite loaders, rather than searching for a function name in source text.
const server = await createServer({ logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null } });
try {
  const { loadPortfolioProjectEmbed } = await server.ssrLoadModule('/src/data/projectEmbeds.js');
  for (const project of portfolioProjects.filter(item => item.kind === 'embed')) {
    const html = await loadPortfolioProjectEmbed(project.id);
    assert.match(html, /<html[\s>]/i, `${project.id}: full HTML document expected`);
    assert.match(html, /<body[\s>]/i);
  }
} finally { await server.close(); }
console.log(`Data passed: 18 projects, 16 executed loaders, ${flattenKeys(resources.pt).length} keys per locale, ${requiredKeys.size} static translation calls.`);
