import { useEffect, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Button, Chip, MenuItem, Pagination, Paper, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { posts, taxonomy, editorialPreview } from 'virtual:blog';
import BlogLayout, { followBlogLink } from './BlogLayout';
import BlogCards from './BlogCards';
import BlogSeo from './BlogSeo';
import { glassSurface } from '../../theme/glass';
import { filterBlogPosts, localized } from '../../utils/blog';
import { blogSeo } from '../../utils/blog-seo';
import { getBlogCollectionUrl, getBlogUrl, navigateToUrl } from '../../utils/routes';

function readFilters() {
  const params = new URLSearchParams(window.location.search);
  return { query: params.get('q') || '', category: params.get('category') || '', tag: params.get('tag') || '', page: Math.max(1, Number.parseInt(params.get('page'), 10) || 1) };
}
const panel = { ...glassSurface('card'), p: { xs: 2.5, md: 3 }, border: '1px solid rgba(13,77,165,0.14)', borderRadius: 4 };

export default function BlogPage({ collection, slug }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'pt').split('-')[0];
  const [filters, setFilters] = useState(readFilters);
  useEffect(() => {
    const update = () => setFilters(readFilters());
    update(); window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, [collection, slug]);
  const record = collection === 'categoria' ? taxonomy.categories.find(item => item.slug === slug)
    : collection === 'serie' ? taxonomy.series.find(item => item.slug === slug)
      : collection === 'tag' && Object.hasOwn(taxonomy.tags, slug) ? { name: taxonomy.tags[slug] } : null;
  const missing = !!collection && !record;
  const title = missing ? t('blog.collectionNotFound') : record ? localized(record.name, lang) : t('blog.title');
  const description = localized(record?.intro || record?.description, lang) || t('blog.description');
  const routePath = collection ? `blog/${collection}/${slug}` : 'blog';
  const candidates = useMemo(() => collection === 'serie' ? posts.filter(post => post.series === slug).sort((a, b) => a.seriesOrder - b.seriesOrder) : posts, [collection, slug]);
  const visible = filterBlogPosts(candidates, filters.query, collection === 'categoria' ? slug : filters.category, collection === 'tag' ? slug : filters.tag);
  const pageCount = Math.max(1, Math.ceil(visible.length / 12));
  const page = Math.min(filters.page, pageCount);
  const hasFilters = !!(filters.query || filters.category || filters.tag);
  const featured = (!collection || collection === 'categoria') && !hasFilters && page === 1 ? visible.find(post => post.featured) : null;
  const updateFilters = next => {
    const value = { ...filters, ...next };
    setFilters(value);
    const url = new URL(window.location.href);
    for (const [key, field] of [['q', 'query'], ['category', 'category'], ['tag', 'tag'], ['page', 'page']]) {
      if (value[field] && !(key === 'page' && value.page === 1)) url.searchParams.set(key, value[field]); else url.searchParams.delete(key);
    }
    navigateToUrl(url.href, { replace: true, notify: false });
  };
  return <BlogLayout title={title} article={!!collection} routeKey={routePath}>
    <BlogSeo seo={blogSeo({ taxonomy, title: `${record || missing ? title : t('nav.blog')} | HM.crm`, description, routePath, language: lang, noindex: missing || editorialPreview || hasFilters || page > 1,
      trail: record ? [{ name: title, item: new URL(routePath, taxonomy.site).href }] : [] })} />
    {collection && <Breadcrumbs aria-label={t('blog.breadcrumb')} sx={{ mb: 2 }}><a href={getBlogUrl()} onClick={followBlogLink}>Blog</a><Typography color="text.primary">{title}</Typography></Breadcrumbs>}
    <Typography sx={{ maxWidth: '78ch', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.8, color: 'text.secondary', mb: 4 }}>{missing ? t('blog.notFoundDescription') : description}</Typography>
    {!missing && <>
      {!collection && <Box component="section" aria-labelledby="blog-categories" sx={{ mb: 5 }}>
        <Typography id="blog-categories" component="h2" variant="h5" sx={{ mb: 2, fontWeight: 800 }}>{t('blog.exploreCategories')}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>{taxonomy.categories.map(category => <Paper key={category.slug} component="a" href={getBlogCollectionUrl('categoria', category.slug)} onClick={followBlogLink} elevation={0} sx={{ ...panel, textDecoration: 'none', color: 'text.primary', '&:hover': { borderColor: 'primary.main' }, '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main' } }}>
          <Typography component="h3" sx={{ fontWeight: 800, fontSize: '1rem', mb: 1 }}>{localized(category.name, lang)}</Typography><Typography sx={{ fontSize: '.88rem', lineHeight: 1.6, color: 'text.secondary' }}>{localized(category.description, lang)}</Typography>
        </Paper>)}</Box>
      </Box>}
      {record?.topics && <Box component="details" sx={{ ...panel, mb: 4 }}><Box component="summary" sx={{ cursor: 'pointer', fontWeight: 750 }}>{t('blog.editorialTopics')}</Box><Box component="ul" lang="pt" sx={{ columns: { xs: 1, md: 2 }, pl: 2.5, mb: 0 }}>{record.topics.map(topic => <Box component="li" key={topic} sx={{ mb: .75, breakInside: 'avoid' }}>{topic}</Box>)}</Box></Box>}
      {featured && <Box component="section" aria-label={t('blog.featured')} sx={{ mb: 5 }}><Typography component="p" sx={{ color: 'primary.main', fontSize: '.85rem', fontWeight: 750, mb: 1.5 }}>{t('blog.featured')}</Typography><BlogCards posts={[featured]} featured /></Box>}
      <Box component="section" aria-labelledby="blog-library" sx={{ mb: 6 }}>
        <Typography id="blog-library" component="h2" variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{collection === 'serie' ? t('blog.readingSequence') : t('blog.library')}</Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3 }}>{collection === 'serie' ? t('blog.seriesHint') : t('blog.libraryHint')}</Typography>
        <Paper elevation={0} sx={{ ...panel, mb: 3 }}>
          <TextField fullWidth type="search" label={t('blog.search')} value={filters.query} onChange={event => updateFilters({ query: event.target.value, page: 1 })} sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
            <TextField select fullWidth label={t('blog.categories')} value={collection === 'categoria' ? slug : filters.category} disabled={collection === 'categoria'} onChange={event => updateFilters({ category: event.target.value, page: 1 })}><MenuItem value="">{t('blog.allCategories')}</MenuItem>{taxonomy.categories.map(category => <MenuItem key={category.slug} value={category.slug}>{localized(category.name, lang)}</MenuItem>)}</TextField>
            <TextField select fullWidth label={t('blog.tags')} value={collection === 'tag' ? slug : filters.tag} disabled={collection === 'tag'} onChange={event => updateFilters({ tag: event.target.value, page: 1 })}><MenuItem value="">{t('blog.allTags')}</MenuItem>{Object.entries(taxonomy.tags).map(([key, name]) => <MenuItem key={key} value={key}>{localized(name, lang)}</MenuItem>)}</TextField>
          </Box>
        </Paper>
        <Typography role="status" aria-live="polite" sx={{ mb: 2, color: 'text.secondary' }}>{t('blog.results', { count: visible.length })}</Typography>
        {!visible.length ? <Paper elevation={0} sx={panel}><Typography component="h3" variant="h5" sx={{ mb: 1 }}>{hasFilters ? t('blog.noResults') : t('blog.emptyTitle')}</Typography><Typography sx={{ color: 'text.secondary', mb: 2 }}>{hasFilters ? t('blog.noResultsDescription') : t('blog.emptyDescription')}</Typography>{hasFilters && <Button variant="outlined" onClick={() => updateFilters({ query: '', category: '', tag: '', page: 1 })}>{t('blog.clearFilters')}</Button>}</Paper>
          : <BlogCards posts={visible.slice((page - 1) * 12, page * 12)} />}
        {pageCount > 1 && <Pagination count={pageCount} page={page} onChange={(_, next) => { updateFilters({ page: next }); document.getElementById('blog-library')?.scrollIntoView({ behavior: 'instant' }); }} getItemAriaLabel={(type, number) => type === 'page' ? t('blog.pageNumber', { number }) : t(`blog.pagination.${type}`)} sx={{ mt: 3 }} />}
      </Box>
      {!collection && <Box component="section" aria-labelledby="blog-series" sx={{ mb: 5 }}><Typography id="blog-series" component="h2" variant="h4" sx={{ fontWeight: 800, mb: 3 }}>{t('blog.series')}</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>{taxonomy.series.map(series => <Paper key={series.slug} elevation={0} sx={panel}><Typography component="h3" sx={{ fontWeight: 800, mb: 1 }}><a href={getBlogCollectionUrl('serie', series.slug)} onClick={followBlogLink}>{localized(series.name, lang)}</a></Typography><Typography sx={{ color: 'text.secondary', fontSize: '.9rem', lineHeight: 1.7 }}>{localized(series.description, lang)}</Typography></Paper>)}</Box></Box>}
      {!collection && <Box component="section" aria-labelledby="blog-tags"><Typography id="blog-tags" component="h2" variant="h5" sx={{ mb: 2, fontWeight: 800 }}>{t('blog.topics')}</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{Object.entries(taxonomy.tags).map(([tag, name]) => <Chip key={tag} component="a" href={getBlogCollectionUrl('tag', tag)} label={localized(name, lang)} onClick={followBlogLink} clickable variant="outlined" />)}</Box></Box>}
    </>}
  </BlogLayout>;
}
