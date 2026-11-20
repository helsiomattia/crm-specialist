import { localized } from './blog.js';

export const articlePath = (post, language = post.language) => language === post.language ? `blog/${post.slug}` : `blog/idioma/${language}/${post.slug}`;

export function blogSeo({ taxonomy, title, description, routePath = 'blog', post, language = 'pt', noindex = false, trail = [] }) {
  const url = new URL(routePath, taxonomy.site).href;
  const crumbs = [{ name: 'HM.crm', item: taxonomy.site }, { name: 'Blog', item: new URL('blog', taxonomy.site).href }, ...trail];
  if (post) {
    const category = taxonomy.categories.find(item => item.slug === post.category);
    crumbs.push({ name: localized(category.name, language), item: new URL(`blog/categoria/${category.slug}`, taxonomy.site).href }, { name: localized(post.title, language), item: url });
  }
  const schema = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })) }];
  if (post && !noindex) schema.push({ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`, mainEntityOfPage: url,
    headline: title.replace(/ \| HM\.crm$/, ''), description, inLanguage: language, author: { '@type': 'Person', name: post.author, url: taxonomy.site },
    datePublished: post.publishedAt, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), articleSection: localized(taxonomy.categories.find(item => item.slug === post.category).name, language), keywords: post.tags.join(', ') });
  return { title, description, url, language, type: post ? 'article' : 'website', robots: noindex ? 'noindex, follow' : 'index, follow', schema,
    alternates: post && !noindex ? post.languages.map(lang => ({ lang, href: new URL(articlePath(post, lang), taxonomy.site).href })) : [] };
}

export const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
