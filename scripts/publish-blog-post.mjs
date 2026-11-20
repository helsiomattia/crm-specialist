import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBlogContent } from './lib/blog-content.mjs';
import { BLOG_SLUG } from '../src/utils/blog.js';

export async function publishBlogPost(root, slug, reviewer, now = new Date()) {
  if (!BLOG_SLUG.test(slug || '') || !reviewer?.trim()) throw new Error('Slug válido e revisor identificado são obrigatórios.');
  const posts = await readBlogContent(root);
  const post = posts.find(item => item.slug === slug);
  if (!post || post.status !== 'ready') throw new Error('O artigo precisa existir e estar ready, com revisões validadas.');
  const file = path.join(root, 'content/blog', slug, 'metadata.json');
  const metadata = JSON.parse(await readFile(file, 'utf8'));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  await writeFile(file, JSON.stringify({ ...metadata, status: 'published', editorialStatus: 'published', approvedBy: reviewer.trim(), publishedAt: today, reviewedAt: today }, null, 2) + '\n');
  return today;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const [slug, option, reviewer] = process.argv.slice(2);
  try {
    if (option !== '--reviewed-by' || process.argv.length !== 5) throw new Error('Uso: npm run blog:publish -- slug --reviewed-by "Nome do revisor". Execute somente após revisão factual, editorial e de confidencialidade.');
    const today = await publishBlogPost(root, slug, reviewer);
    console.log(`Artigo liberado no catálogo local: ${slug}, ${today}. Nenhum push ou deploy executado. Publique o build nessa data ou ajuste publishedAt para a data efetiva do lançamento.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
