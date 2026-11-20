import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_SLUG } from '../src/utils/blog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug || !BLOG_SLUG.test(slug) || process.argv.length > 3) {
  console.error('Uso: npm run blog:new -- meu-primeiro-artigo (letras minúsculas, números e hífens).');
  process.exitCode = 1;
} else {
  const directory = path.join(root, 'content/blog', slug);
  try {
    // Non-recursive creation refuses existing articles instead of overwriting them.
    await mkdir(directory);
    const template = path.join(root, 'content/blog/_modelo');
    const metadata = JSON.parse(await readFile(path.join(template, 'metadata.json'), 'utf8'));
    metadata.slug = slug;
    metadata.id = `article-${slug}`;
    await writeFile(path.join(directory, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n', { flag: 'wx' });
    await writeFile(path.join(directory, 'article.md'), await readFile(path.join(template, 'article.md'), 'utf8'), { flag: 'wx' });
    console.log(`Rascunho criado em content/blog/${slug}. Edite metadata.json e article.md. Consulte docs/BLOG.md para revisão e publicação.`);
  } catch (error) {
    console.error(error.code === 'EEXIST' ? `A pasta ${slug} já existe. Nenhum artigo foi sobrescrito.` : error.message);
    process.exitCode = 1;
  }
}
