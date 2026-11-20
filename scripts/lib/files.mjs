import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function listFiles(directory, ignored = new Set(['.git', '.npm', 'node_modules', 'dist', 'test-results', 'playwright-report'])) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(file, ignored));
    else result.push(file);
  }
  return result;
}
