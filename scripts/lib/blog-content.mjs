import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { blogMetadataErrors, isPublicPost, BLOG_SLUG, localized } from '../../src/utils/blog.js';
import { markdownOutline } from '../../src/utils/blog-markdown.js';

export async function readTaxonomy(root) {
  return JSON.parse(await readFile(path.join(root, 'content/editorial/taxonomy.json'), 'utf8'));
}

export async function readBlogContent(root, contentDirectory = 'content/blog') {
  const directory = path.resolve(root, contentDirectory);
  const taxonomy = await readTaxonomy(root);
  const posts = [];
  const ids = new Set();
  const seriesOrders = new Set();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const slug = entry.name;
    const folder = path.join(directory, slug);
    let metadata;
    try { metadata = JSON.parse(await readFile(path.join(folder, 'metadata.json'), 'utf8')); }
    catch (error) { throw new Error(`Blog / ${slug}: metadata.json inválido ou ausente. ${error.message}`); }
    const errors = blogMetadataErrors(metadata, slug);
    if (ids.has(metadata.id)) errors.push('ID duplicado.');
    ids.add(metadata.id);
    if (!taxonomy.categories.some(item => item.slug === metadata.category)) errors.push('Categoria desconhecida.');
    if (metadata.tags?.some(tag => !Object.hasOwn(taxonomy.tags, tag))) errors.push('Tag desconhecida.');
    if (metadata.series) {
      if (!taxonomy.series.some(item => item.slug === metadata.series)) errors.push('Série desconhecida.');
      const position = `${metadata.series}/${metadata.seriesOrder}`;
      if (seriesOrders.has(position)) errors.push('Posição de série duplicada.');
      seriesOrders.add(position);
    }
    if (metadata.publishedAt > new Date().toISOString().slice(0, 10)) errors.push('Data de publicação futura.');
    if (metadata.status !== 'draft' && !metadata.sources?.length) errors.push('Conteúdo revisado precisa registrar fontes.');
    if (errors.length) throw new Error(`Blog / ${slug}: ${errors.join(' ')}`);
    const bodies = {};
    const readingTimes = {};
    const wordCounts = {};
    for (const language of metadata.languages) {
      const file = language === metadata.language ? 'article.md' : `article.${language}.md`;
      const markdown = await readFile(path.join(folder, file), 'utf8');
      if (!markdown.trim()) throw new Error(`Blog / ${slug}: ${file} está vazio.`);
      bodies[language] = markdown;
      const words = markdownOutline(markdown).text.trim().split(/\s+/).length;
      wordCounts[language] = words;
      readingTimes[language] = Math.max(1, Math.ceil(words / 220));
    }
    posts.push({ ...metadata, bodies, readingTimes, wordCounts, readingMinutes: readingTimes[metadata.language],
      searchText: Object.values(bodies).map(body => markdownOutline(body).text).join(' ') });
  }
  const slugs = new Set(posts.map(post => post.slug));
  for (const post of posts) {
    for (const slug of post.relatedArticles) if (!slugs.has(slug)) throw new Error(`Blog / ${post.slug}: artigo relacionado inexistente: ${slug}.`);
    for (const body of Object.values(post.bodies)) {
      const links = [...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)(?:[)#?])/g)];
      for (const [, slug] of links) if (!slugs.has(slug)) throw new Error(`Blog / ${post.slug}: link interno inexistente: ${slug}.`);
    }
  }
  return posts.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.id.localeCompare(b.id));
}

export async function validateEditorial(root, posts) {
  const taxonomy = await readTaxonomy(root);
  const backlog = JSON.parse(await readFile(path.join(root, 'content/editorial/backlog.json'), 'utf8'));
  const ids = new Set(posts.map(post => post.id));
  const slugs = new Set();
  const articleSlugs = new Set(posts.map(post => post.slug));
  for (const item of backlog) {
    if (ids.has(item.id) || slugs.has(item.slug) || !BLOG_SLUG.test(item.slug)) throw new Error(`Backlog inválido: ${item.id}`);
    ids.add(item.id); slugs.add(item.slug);
    for (const field of ['id', 'title', 'objective', 'audience', 'problem', 'angle']) if (!item[field]?.trim()) throw new Error(`Backlog ${item.id}: ${field} ausente.`);
    for (const field of ['tags', 'outline', 'keywords']) if (!Array.isArray(item[field]) || !item[field].length) throw new Error(`Backlog ${item.id}: ${field} ausente.`);
    if (!taxonomy.categories.some(category => category.slug === item.category) || item.tags.some(tag => !Object.hasOwn(taxonomy.tags, tag))) throw new Error(`Backlog ${item.id}: taxonomia inválida.`);
    if (!['P1', 'P2', 'P3'].includes(item.priority) || !['idea', 'planned', 'drafting', 'completed', 'cancelled'].includes(item.status)) throw new Error(`Backlog ${item.id}: estado inválido.`);
    if (item.series && !taxonomy.series.some(series => series.slug === item.series)) throw new Error(`Backlog ${item.id}: série desconhecida.`);
    if (item.articleSlug && !articleSlugs.has(item.articleSlug)) throw new Error(`Backlog ${item.id}: artigo associado inexistente.`);
    if (articleSlugs.has(item.slug) && item.articleSlug !== item.slug) throw new Error(`Backlog ${item.id}: associe explicitamente articleSlug ao artigo já criado.`);
  }
  for (const kind of ['categories', 'series']) {
    const unique = new Set();
    for (const item of taxonomy[kind]) {
      if (!BLOG_SLUG.test(item.slug) || unique.has(item.slug)) throw new Error(`Taxonomia: slug inválido ${item.slug}`);
      unique.add(item.slug);
      for (const lang of ['pt', 'en', 'es']) if (!item.name[lang] || !item.description[lang]) throw new Error(`Taxonomia: tradução ausente ${item.slug}`);
    }
  }
  return { articles: posts.length, published: posts.filter(isPublicPost).length, ready: posts.filter(post => post.status === 'ready').length, backlog: backlog.length,
    backlogCompleted: backlog.filter(item => item.status === 'completed').length,
    backlogOpen: backlog.filter(item => !['completed', 'cancelled'].includes(item.status)).length,
    categories: taxonomy.categories.map(category => ({ slug: category.slug, articles: posts.filter(post => post.category === category.slug).length, ideas: backlog.filter(item => item.category === category.slug).length })),
    words: posts.map(post => ({ slug: post.slug, title: localized(post.title), words: post.wordCounts.pt, status: post.status })) };
}

function publicRecord(post, visible) {
  const fields = ['id', 'slug', 'title', 'excerpt', 'category', 'type', 'author', 'language', 'languages', 'tags', 'status', 'publishedAt', 'updatedAt', 'featured', 'series', 'seriesOrder', 'maturity', 'sources', 'readingTimes', 'readingMinutes', 'wordCounts', 'searchText'];
  const record = Object.fromEntries(fields.map(field => [field, post[field]]));
  return { ...record, relatedArticles: post.relatedArticles.filter(slug => visible.has(slug)) };
}

export function blogContentPlugin({ directory = 'content/blog' } = {}) {
  const virtualId = 'virtual:blog';
  const resolvedId = `\0${virtualId}`;
  let root, editorial = false;
  return {
    name: 'hm-blog-content',
    configResolved(config) {
      root = config.root;
      if (config.command === 'build' && config.mode === 'editorial') throw new Error('Revisão editorial é somente local; build editorial bloqueado.');
      editorial = config.command === 'serve' && config.mode === 'editorial';
    },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) {
      if (id !== resolvedId) return undefined;
      const taxonomy = await readTaxonomy(root);
      const selected = (await readBlogContent(root, directory)).filter(post => editorial || isPublicPost(post));
      const visible = new Set(selected.map(post => post.slug));
      const posts = selected.map(post => publicRecord(post, visible));
      const loaders = selected.flatMap(post => post.languages.map(language => {
        const file = language === post.language ? 'article.md' : `article.${language}.md`;
        return `${JSON.stringify(`${post.slug}:${language}`)}: () => import(${JSON.stringify(`${path.resolve(root, directory, post.slug, file).replace(/\\/g, '/')}?raw`)}).then(module => module.default)`;
      }));
      return `export const posts = ${JSON.stringify(posts)};\nexport const taxonomy = ${JSON.stringify(taxonomy)};\nexport const editorialPreview = ${editorial};\nexport const articleLoaders = {${loaders.join(',')}};`;
    },
    configureServer(server) {
      const paths = [path.resolve(root, directory), path.join(root, 'content/editorial')];
      server.watcher.add(paths);
      const reload = file => {
        if (!paths.some(folder => path.resolve(file).startsWith(`${folder}${path.sep}`))) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload);
      server.httpServer?.once('close', () => { server.watcher.off('add', reload).off('change', reload).off('unlink', reload); });
    },
    async writeBundle(output) {
      if (!output.dir) return;
      const { prerenderBlog } = await import('./blog-prerender.mjs');
      await prerenderBlog(root, output.dir, (await readBlogContent(root, directory)).filter(isPublicPost), await readTaxonomy(root));
    },
  };
}
