import { useEffect } from 'react';
import { safeJson } from '../../utils/blog-seo';

const tags = seo => ({
  'meta[name="description"]': seo.description, 'meta[property="og:title"]': seo.title,
  'meta[property="og:description"]': seo.description, 'meta[property="og:url"]': seo.url,
  'meta[property="og:type"]': seo.type, 'meta[name="twitter:title"]': seo.title,
  'meta[property="og:locale"]': { pt: 'pt_BR', en: 'en_US', es: 'es_ES' }[seo.language],
  'meta[name="twitter:description"]': seo.description, 'meta[name="robots"]': seo.robots,
});

export default function BlogSeo({ seo }) {
  const serialized = safeJson(seo);
  useEffect(() => {
    const data = JSON.parse(serialized);
    const snapshot = document.getElementById('hm-home-head');
    const home = snapshot ? JSON.parse(snapshot.textContent) : null;
    const previousTitle = home?.title || document.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = home?.canonical || canonical?.getAttribute('href');
    const previousLanguage = document.documentElement.lang;
    const changes = Object.entries(tags(data)).map(([selector, content]) => {
      const node = document.querySelector(selector);
      const previous = home?.meta?.[selector] ?? node?.getAttribute('content');
      node?.setAttribute('content', content);
      return { node, previous };
    });
    document.querySelectorAll('[data-blog-seo]').forEach(node => node.remove());
    const json = document.createElement('script');
    json.type = 'application/ld+json'; json.dataset.blogSeo = ''; json.textContent = safeJson(data.schema);
    document.head.append(json);
    const links = data.alternates.map(item => {
      const link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = item.lang; link.href = item.href; link.dataset.blogSeo = ''; document.head.append(link); return link;
    });
    document.title = data.title;
    document.documentElement.lang = data.language;
    canonical?.setAttribute('href', data.url);
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
      if (previousCanonical) canonical?.setAttribute('href', previousCanonical);
      changes.forEach(({ node, previous }) => { if (previous != null) node?.setAttribute('content', previous); });
      json.remove(); links.forEach(link => link.remove());
    };
  }, [serialized]);
  return null;
}
