export const BLOG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const BLOG_LANGUAGES = ['pt', 'en', 'es'];
export const BLOG_TYPES = ['technical', 'strategy', 'guide', 'reflection', 'architecture', 'comparison', 'decision', 'prototype', 'concept', 'series'];
export const localized = (value, language = 'pt') => typeof value === 'string' ? value : value?.[language] || value?.pt || '';

export function normalizeBlogSearch(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterBlogPosts(posts, query = '', category = '', tag = '') {
  const terms = normalizeBlogSearch(query).split(/\s+/).filter(Boolean);
  return posts.filter(post => (!category || post.category === category) && (!tag || post.tags.includes(tag))
    && terms.every(term => normalizeBlogSearch([typeof post.title === 'string' ? post.title : Object.values(post.title).join(' '),
      typeof post.excerpt === 'string' ? post.excerpt : Object.values(post.excerpt).join(' '), post.searchText || '', post.category, ...post.tags].join(' ')).includes(term)));
}

export function validBlogDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function formatBlogDate(date, language) {
  return validBlogDate(date) ? new Intl.DateTimeFormat(language, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)) : '';
}

export function isPublicPost(post) {
  return post.status === 'published' && post.editorialStatus === 'published'
    && post.confidentialityStatus === 'validated' && post.factualStatus === 'validated'
    && validBlogDate(post.publishedAt) && !!post.approvedBy?.trim();
}

function httpsSource(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password; }
  catch { return false; }
}

export function blogMetadataErrors(metadata, slug) {
  const errors = [];
  if (!BLOG_SLUG.test(slug)) errors.push('Nome da pasta deve usar letras minúsculas, números e hífens.');
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return [...errors, 'metadata.json deve conter um objeto.'];
  for (const field of ['id', 'category', 'author']) if (typeof metadata[field] !== 'string' || !metadata[field].trim()) errors.push(`${field} é obrigatório.`);
  if (metadata.slug !== slug) errors.push('slug deve corresponder à pasta.');
  for (const field of ['title', 'excerpt']) {
    for (const lang of BLOG_LANGUAGES) if (typeof metadata[field]?.[lang] !== 'string' || !metadata[field][lang].trim()) errors.push(`${field}.${lang} é obrigatório.`);
  }
  if (!['draft', 'ready', 'published'].includes(metadata.status)) errors.push('status deve ser draft, ready ou published.');
  if (!['draft', 'factual-review', 'confidentiality-review', 'public-validated', 'published'].includes(metadata.editorialStatus)) errors.push('editorialStatus inválido.');
  for (const field of ['factualStatus', 'confidentialityStatus']) if (!['review', 'validated'].includes(metadata[field])) errors.push(`${field} inválido.`);
  if (!BLOG_TYPES.includes(metadata.type)) errors.push('type inválido.');
  if (!BLOG_LANGUAGES.includes(metadata.language)) errors.push('language deve ser pt, en ou es.');
  if (!Array.isArray(metadata.languages) || !metadata.languages.includes(metadata.language) || new Set(metadata.languages).size !== metadata.languages.length || metadata.languages.some(lang => !BLOG_LANGUAGES.includes(lang))) errors.push('languages inválido.');
  if (!Array.isArray(metadata.tags) || !metadata.tags.length || metadata.tags.some(tag => typeof tag !== 'string' || !BLOG_SLUG.test(tag)) || new Set(metadata.tags).size !== metadata.tags.length) errors.push('tags deve conter slugs únicos.');
  if (!Array.isArray(metadata.relatedArticles) || metadata.relatedArticles.some(value => !BLOG_SLUG.test(value)) || metadata.relatedArticles.includes(slug) || new Set(metadata.relatedArticles).size !== metadata.relatedArticles.length) errors.push('relatedArticles inválido.');
  if (metadata.series && (!BLOG_SLUG.test(metadata.series) || !Number.isInteger(metadata.seriesOrder) || metadata.seriesOrder < 1)) errors.push('Série precisa de slug e ordem positiva.');
  if (typeof metadata.featured !== 'boolean') errors.push('featured deve ser booleano.');
  for (const field of ['publishedAt', 'updatedAt', 'reviewedAt']) if (metadata[field] != null && !validBlogDate(metadata[field])) errors.push(`${field} deve ser uma data válida em YYYY-MM-DD.`);
  if (metadata.updatedAt && metadata.publishedAt && metadata.updatedAt < metadata.publishedAt) errors.push('updatedAt antecede publishedAt.');
  if (!Array.isArray(metadata.sources) || metadata.sources.some(source => !source.title?.trim() || !httpsSource(source.url) || !validBlogDate(source.checkedAt)) || new Set(metadata.sources.map(source => source.url)).size !== metadata.sources.length) errors.push('sources precisa de título, URL HTTPS única e data de consulta.');
  if (metadata.category === 'ideias' && !['Conceito', 'Proposta', 'Protótipo', 'Demonstração', 'Implementação validada'].includes(metadata.maturity)) errors.push('Ideias precisam declarar maturidade.');
  if (metadata.maturity === 'Implementação validada' && !metadata.implementationEvidence?.trim()) errors.push('Implementação validada exige evidência.');
  if (metadata.status === 'ready' && (metadata.editorialStatus !== 'public-validated' || metadata.confidentialityStatus !== 'validated' || metadata.factualStatus !== 'validated')) errors.push('ready exige revisão factual e de confidencialidade.');
  if (metadata.status !== 'draft' && !validBlogDate(metadata.reviewedAt)) errors.push('Conteúdo revisado exige reviewedAt.');
  if (metadata.status === 'published' && !isPublicPost(metadata)) errors.push('Publicação exige aprovação identificada, data e revisões concluídas.');
  if (metadata.status !== 'published' && metadata.publishedAt != null) errors.push('Conteúdo não publicado deve manter publishedAt nulo.');
  return errors;
}
