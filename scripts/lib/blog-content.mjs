import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { blogMetadataErrors } from '../../src/utils/blog.js';

export async function readBlogContent(root, contentDirectory = 'content/blog') {
  const directory = path.resolve(root, contentDirectory);
  const posts = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const slug = entry.name;
    const folder = path.join(directory, slug);
    let metadata;
    try { metadata = JSON.parse(await readFile(path.join(folder, 'metadata.json'), 'utf8')); }
    catch (error) { throw new Error(`Blog / ${slug}: metadata.json inválido ou ausente. ${error.message}`); }
    const errors = blogMetadataErrors(metadata, slug);
    if (errors.length) throw new Error(`Blog / ${slug}: ${errors.join(' ')}`);
    const markdown = await readFile(path.join(folder, 'article.md'), 'utf8');
    if (!markdown.trim()) throw new Error(`Blog / ${slug}: article.md está vazio.`);
    // Export only the documented fields. Draft text never enters the public manifest.
    posts.push({ slug, title: metadata.title, excerpt: metadata.excerpt, category: metadata.category,
      author: metadata.author, date: metadata.date, language: metadata.language, tags: metadata.tags,
      status: metadata.status, readingMinutes: Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 220)) });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function blogContentPlugin({ directory = 'content/blog' } = {}) {
  const virtualId = 'virtual:blog';
  const resolvedId = `\0${virtualId}`;
  let root;
  return {
    name: 'hm-blog-content',
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) {
      if (id !== resolvedId) return undefined;
      const posts = (await readBlogContent(root, directory)).filter(post => post.status === 'published');
      return `export const posts = ${JSON.stringify(posts)};\nexport const articleLoaders = {${posts.map(post => `${JSON.stringify(post.slug)}: () => import(${JSON.stringify(`${path.resolve(root, directory, post.slug, 'article.md').replace(/\\/g, '/')}?raw`)}).then(module => module.default)`).join(',')}};`;
    },
    configureServer(server) {
      const contentPath = `${path.resolve(root, directory)}${path.sep}`;
      server.watcher.add(contentPath);
      const reload = file => {
        if (!path.resolve(file).startsWith(contentPath)) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload);
      server.httpServer?.once('close', () => { server.watcher.off('add', reload).off('change', reload).off('unlink', reload); });
    },
    async writeBundle(output) {
      if (!output.dir) return;
      const sitemap = await readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
      const site = sitemap.match(/<loc>(https?:\/\/[^<]+\/)<\/loc>/)?.[1];
      if (!site) throw new Error('Blog: URL principal ausente no sitemap.');
      const posts = (await readBlogContent(root, directory)).filter(post => post.status === 'published');
      const entries = posts.map(post => `  <url>\n    <loc>${new URL(`blog/${post.slug}`, site).href}</loc>\n    <lastmod>${post.date}</lastmod>\n  </url>\n`).join('');
      await writeFile(path.join(output.dir, 'sitemap.xml'), sitemap.replace('</urlset>', `${entries}</urlset>`));
    },
  };
}
