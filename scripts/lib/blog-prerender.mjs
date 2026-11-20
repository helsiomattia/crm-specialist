import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownContent, markdownOutline } from '../../src/utils/blog-markdown.js';
import { localized, formatBlogDate } from '../../src/utils/blog.js';
import { blogSeo, articlePath, safeJson } from '../../src/utils/blog-seo.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const link = (url, text) => `<a href="${escape(url)}">${escape(text)}</a>`;

export async function prerenderBlog(root, output, posts, taxonomy) {
  const template = await readFile(path.join(output, 'index.html'), 'utf8');
  const strings = JSON.parse(await readFile(path.join(root, 'src/locales/pt/common.json'), 'utf8')).blog;
  const base = new URL(taxonomy.site).pathname.replace(/\/$/, '');
  const url = route => `${base}/${route}`;
  const card = (post, lang = 'pt') => `<article><p>${escape(localized(taxonomy.categories.find(item => item.slug === post.category).name, lang))}</p><h2>${link(url(articlePath(post, post.languages.includes(lang) ? lang : post.language)), localized(post.title, lang))}</h2><p>${escape(localized(post.excerpt, lang))}</p><p>${escape(formatBlogDate(post.publishedAt, lang))} · ${post.readingMinutes} min</p></article>`;
  const pages = [];
  const listing = (routePath, title, description, selected, extra = '') => pages.push({ routePath, seo: blogSeo({ taxonomy, title: `${title} | HM.crm`, description, routePath,
    trail: routePath === 'blog' ? [] : [{ name: title, item: new URL(routePath, taxonomy.site).href }] }), content: `<h1>${escape(title)}</h1><p>${escape(description)}</p>${extra}${selected.length ? selected.map(post => card(post)).join('') : `<p>${escape(strings.emptyDescription)}</p>`}` });
  const categoryLinks = `<nav aria-label="Categorias">${taxonomy.categories.map(item => link(url(`blog/categoria/${item.slug}`), item.name.pt)).join(' · ')}</nav>`;
  const seriesLinks = `<section><h2>${escape(strings.series)}</h2><ul>${taxonomy.series.map(item => `<li>${link(url(`blog/serie/${item.slug}`), item.name.pt)} — ${escape(item.description.pt)}</li>`).join('')}</ul></section>`;
  const tagLinks = `<section><h2>${escape(strings.topics)}</h2>${Object.entries(taxonomy.tags).map(([tag, name]) => link(url(`blog/tag/${tag}`), name.pt)).join(' · ')}</section>`;
  listing('blog', strings.title, strings.description, posts, `${categoryLinks}${seriesLinks}${tagLinks}<h2>${escape(strings.library)}</h2>`);
  for (const category of taxonomy.categories) listing(`blog/categoria/${category.slug}`, category.name.pt, category.intro.pt, posts.filter(post => post.category === category.slug), `<details><summary>${escape(strings.editorialTopics)}</summary><ul>${category.topics.map(topic => `<li>${escape(topic)}</li>`).join('')}</ul></details>`);
  for (const series of taxonomy.series) listing(`blog/serie/${series.slug}`, series.name.pt, series.description.pt, posts.filter(post => post.series === series.slug).sort((a, b) => a.seriesOrder - b.seriesOrder));
  for (const [tag, name] of Object.entries(taxonomy.tags)) listing(`blog/tag/${tag}`, name.pt, strings.description, posts.filter(post => post.tags.includes(tag)));
  for (const post of posts) for (const lang of post.languages) {
    const copy = JSON.parse(await readFile(path.join(root, `src/locales/${lang}/common.json`), 'utf8')).blog;
    const routePath = articlePath(post, lang);
    const headings = markdownOutline(post.bodies[lang]).headings;
    const body = renderToStaticMarkup(React.createElement(MarkdownContent, { content: post.bodies[lang], base, availableSlugs: posts.map(item => item.slug) }));
    const references = `<section><h2>${escape(copy.references)}</h2><ul>${post.sources.map(source => `<li>${link(source.url, source.title)} — ${escape(formatBlogDate(source.checkedAt, lang))}</li>`).join('')}</ul></section>`;
    const related = post.relatedArticles.map(slug => posts.find(item => item.slug === slug)).filter(Boolean);
    const sequence = posts.filter(item => item.series && item.series === post.series).sort((a, b) => a.seriesOrder - b.seriesOrder);
    const index = sequence.findIndex(item => item.slug === post.slug);
    const seriesNav = post.series ? `<nav aria-label="${escape(copy.readingSequence)}">${link(url(`blog/serie/${post.series}`), localized(taxonomy.series.find(item => item.slug === post.series).name, lang))}<ul>${[sequence[index - 1], sequence[index + 1]].filter(Boolean).map(item => `<li>${link(url(articlePath(item)), localized(item.title, lang))}</li>`).join('')}</ul></nav>` : '';
    const category = taxonomy.categories.find(item => item.slug === post.category);
    const breadcrumbs = `<nav aria-label="${escape(copy.breadcrumb)}">${link(url('blog'), 'Blog')} / ${link(url(`blog/categoria/${category.slug}`), localized(category.name, lang))}</nav>`;
    pages.push({ routePath, post, seo: blogSeo({ taxonomy, title: `${localized(post.title, lang)} | HM.crm`, description: localized(post.excerpt, lang), routePath, post, language: lang }),
      content: `${breadcrumbs}<article lang="${lang}"><h1>${escape(localized(post.title, lang))}</h1><p>${escape(localized(post.excerpt, lang))}</p><p>${escape(post.author)} · <time datetime="${post.publishedAt}">${escape(formatBlogDate(post.publishedAt, lang))}</time> · ${post.readingTimes[lang]} min</p>${post.updatedAt ? `<p>${escape(copy.updated)} ${escape(formatBlogDate(post.updatedAt, lang))}</p>` : ''}${post.maturity ? `<p>${escape(copy.maturity)}: ${escape(post.maturity)}</p>` : ''}<nav aria-label="${escape(copy.onThisPage)}"><ul>${headings.map(item => `<li>${link(`#${item.id}`, item.title)}</li>`).join('')}</ul></nav><div class="blog-prose">${body}</div>${references}<p>${post.tags.map(tag => link(url(`blog/tag/${tag}`), localized(taxonomy.tags[tag], lang))).join(' · ')}</p></article>${seriesNav}${related.length ? `<section><h2>${escape(copy.related)}</h2>${related.map(item => card(item, lang)).join('')}</section>` : ''}` });
  }
  const home = { title: template.match(/<title>(.*?)<\/title>/s)?.[1] || 'HM.crm', canonical: taxonomy.site, meta: {} };
  const homeMeta = [...template.matchAll(/<meta\s+(name|property)="([^"]+)"\s+content="([^"]*)"[^>]*>/g)];
  for (const [, key, name, content] of homeMeta) home.meta[`meta[${key}="${name}"]`] = content;
  for (const page of pages) {
    const { seo } = page;
    let html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(seo.title)}</title>`)
      .replace(/<html([^>]*?)lang="[^"]*"/, `<html$1lang="${seo.language}"`);
    const replacements = { description: seo.description, 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.url, 'og:type': seo.type, 'og:locale': { pt: 'pt_BR', en: 'en_US', es: 'es_ES' }[seo.language], 'twitter:title': seo.title, 'twitter:description': seo.description, robots: seo.robots };
    for (const [name, content] of Object.entries(replacements)) html = html.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*(")`), `$1${escape(content).replace(/\$/g, '$$$$')}$2`);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escape(seo.url)}$2`);
    const head = `<script type="application/json" id="hm-home-head">${safeJson(home)}</script><script type="application/ld+json" data-blog-seo>${safeJson(seo.schema)}</script>${seo.alternates.map(item => `<link rel="alternate" hreflang="${item.lang}" href="${escape(item.href)}" data-blog-seo>`).join('')}<style data-blog-static>html{scroll-behavior:auto}#blog-static{font:17px/1.8 Inter,Arial,sans-serif;color:#061827;background:#f2f7fc;max-width:1100px;margin:auto;padding:32px 24px}#blog-static article{padding:24px 0;border-bottom:1px solid #ccdce9}#blog-static h1{line-height:1.16;font-size:clamp(2rem,5vw,3.5rem)}#blog-static a{color:#0d4da5}#blog-static a:focus-visible{outline:3px solid #0d4da5;outline-offset:3px}#blog-static pre{overflow:auto;background:#e5eef6;padding:16px}#blog-static img{max-width:100%}#blog-static .blog-prose{max-width:72ch}#blog-static h2,#blog-static h3{scroll-margin-top:30px}</style>`;
    html = html.replace('</head>', `${head}</head>`).replace('<div id="root"></div>', `<div id="root"><main id="blog-static">${link(url(''), strings.backToPortfolio)} · ${link(url('blog'), strings.backToBlog)}${page.content}</main></div>`);
    const folder = path.join(output, ...page.routePath.split('/'));
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'index.html'), html);
  }
  const sitemap = await readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
  const existing = sitemap.replace(/\s*<url>\s*<loc>[^<]*\/blog(?:\/[^<]*)?<\/loc>[\s\S]*?<\/url>/g, '');
  const entries = pages.map(page => `<url><loc>${escape(page.seo.url)}</loc>${page.post ? `<lastmod>${page.post.updatedAt || page.post.publishedAt}</lastmod>` : ''}</url>`).join('\n');
  await writeFile(path.join(output, 'sitemap.xml'), existing.replace('</urlset>', `${entries}\n</urlset>`));
}
