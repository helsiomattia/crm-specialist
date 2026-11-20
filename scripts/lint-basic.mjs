import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { javascriptErrors } from './lib/quality.mjs';

const root = process.cwd();
const ignored = new Set(['.git', '.npm', 'node_modules', 'dist', 'test-results', 'playwright-report']);
const checkedExtensions = new Set(['.js', '.jsx', '.mjs', '.html']);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!checkedExtensions.has(path.extname(entry.name))) continue;
    const content = await readFile(fullPath, 'utf8');
    const relativePath = path.relative(root, fullPath);

    if (path.extname(entry.name) !== '.html') {
      errors.push(...javascriptErrors(content, relativePath));
    } else {
      for (const script of content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (!/type=["']application\//i.test(script[1])) errors.push(...javascriptErrors(script[2], relativePath));
      }
      for (const link of content.matchAll(/<a\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
        if (/target=["']_blank["']/.test(link[0]) && !/rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/.test(link[0])) errors.push(`${relativePath}: external link without noopener noreferrer`);
      }
    }
  }
}

await walk(root);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Lint passed: JavaScript/JSX syntax, inline scripts and external link protections.');
