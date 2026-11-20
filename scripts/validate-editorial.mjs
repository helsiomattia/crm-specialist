import { writeFile } from 'node:fs/promises';
import { readBlogContent, validateEditorial } from './lib/blog-content.mjs';

const root = process.cwd();
const report = await validateEditorial(root, await readBlogContent(root));
if (process.argv.includes('--report')) await writeFile('audit/editorial-blog/content-validation.json', JSON.stringify({ date: '2026-11-20', ...report }, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
