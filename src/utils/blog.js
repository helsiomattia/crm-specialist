export const BLOG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeBlogSearch(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterBlogPosts(posts, query = '', category = '') {
  const terms = normalizeBlogSearch(query).split(/\s+/).filter(Boolean);
  return posts.filter(post => (!category || post.category === category)
    && terms.every(term => normalizeBlogSearch([post.title, post.excerpt, post.category, ...post.tags].join(' ')).includes(term)));
}

export function formatBlogDate(date, language) {
  return new Intl.DateTimeFormat(language, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

export function blogMetadataErrors(metadata, slug) {
  const errors = [];
  if (!BLOG_SLUG.test(slug)) errors.push('Nome da pasta deve usar letras minúsculas, números e hífens.');
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return [...errors, 'metadata.json deve conter um objeto.'];
  for (const field of ['title', 'excerpt', 'category', 'author']) {
    if (typeof metadata[field] !== 'string' || !metadata[field].trim()) errors.push(`${field} é obrigatório.`);
  }
  if (!['draft', 'published'].includes(metadata.status)) errors.push('status deve ser draft ou published.');
  if (!['pt', 'en', 'es'].includes(metadata.language)) errors.push('language deve ser pt, en ou es.');
  if (!Array.isArray(metadata.tags) || metadata.tags.some(tag => typeof tag !== 'string' || !tag.trim())) errors.push('tags deve ser uma lista de textos.');
  const date = typeof metadata.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(metadata.date) ? new Date(`${metadata.date}T12:00:00Z`) : null;
  if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== metadata.date) errors.push('date deve ser uma data válida em YYYY-MM-DD.');
  return errors;
}
