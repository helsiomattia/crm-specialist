import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { whitespaceErrors } from './lib/quality.mjs';

const root = process.cwd();
const ignored = new Set(['.git', '.npm', 'node_modules', 'dist', 'test-results', 'playwright-report']);
const ignoredFiles = new Set(['projects/NewProjs.txt']);
const checkedExtensions = new Set(['.js', '.jsx', '.mjs', '.json', '.md', '.html', '.css', '.yml', '.xml', '.txt']);
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
    const relativePath = path.relative(root, fullPath).replace(/\\/g, '/');
    if (ignoredFiles.has(relativePath)) continue;

    const content = await readFile(fullPath, 'utf8');
    errors.push(...whitespaceErrors(content, relativePath));
  }
}

await walk(root);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Format check passed.');
