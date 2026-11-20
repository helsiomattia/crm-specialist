import { useEffect, useState } from 'react';
import { Box, Button, Chip, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { useTranslation } from 'react-i18next';
import { posts } from 'virtual:blog';
import BlogLayout, { followBlogLink, useBlogMetadata } from './BlogLayout';
import { glassSurface } from '../../theme/glass';
import { filterBlogPosts, formatBlogDate } from '../../utils/blog';
import { getBlogArticleUrl, getHomeProjectsUrl, navigateToUrl } from '../../utils/routes';

function readFilters() {
  const params = new URLSearchParams(window.location.search);
  return { query: params.get('q') || '', category: params.get('category') || '' };
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState(readFilters);
  useEffect(() => {
    const update = () => setFilters(readFilters());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  useBlogMetadata(`${t('nav.blog')} | HM.crm`, t('blog.description'));
  const categories = [...new Set(posts.map(post => post.category))].sort((a, b) => a.localeCompare(b));
  const visible = filterBlogPosts(posts, filters.query, filters.category);
  const updateFilters = next => {
    setFilters(next);
    const url = new URL(window.location.href);
    for (const [key, value] of [['q', next.query], ['category', next.category]]) {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    navigateToUrl(url.href, { replace: true, notify: false });
  };
  return (
    <BlogLayout title={t('blog.title')}>
      <Typography sx={{ color: 'text.secondary', maxWidth: 740, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.8, mb: { xs: 4, md: 6 } }}>{t('blog.description')}</Typography>
      {posts.length === 0 ? (
        <Paper elevation={0} sx={{ ...glassSurface('panel'), border: '1px solid rgba(255,255,255,0.9)', borderRadius: '28px', p: { xs: 3, md: 6 }, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Box sx={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: '16px', color: 'primary.main', bgcolor: 'rgba(13,77,165,0.08)', mb: 3 }}><EditNoteRoundedIcon sx={{ fontSize: 32 }} /></Box>
          <Typography component="h2" variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1.5 }}>{t('blog.emptyTitle')}</Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 620, lineHeight: 1.8, mb: 3 }}>{t('blog.emptyDescription')}</Typography>
          <Button component="a" href={getHomeProjectsUrl('')} onClick={followBlogLink} variant="outlined">{t('blog.exploreProjects')}</Button>
        </Paper>
      ) : (
        <>
          <Paper elevation={0} sx={{ ...glassSurface('panel'), border: '1px solid white', borderRadius: '22px', p: { xs: 2, md: 3 }, mb: 4 }}>
            <TextField fullWidth label={t('blog.search')} value={filters.query} onChange={event => updateFilters({ ...filters, query: event.target.value })} inputProps={{ maxLength: 160 }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '12px' } }} />
            <Box role="group" aria-label={t('blog.categories')} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['', ...categories].map(category => <Chip key={category} component="button" type="button" clickable label={category || t('blog.allCategories')} aria-pressed={filters.category === category} color={filters.category === category ? 'primary' : 'default'} onClick={() => updateFilters({ ...filters, category })} sx={{ height: 36, fontSize: '0.875rem', px: 0.5, ...(filters.category === category ? { color: '#fff' } : {}) }} />)}
            </Box>
          </Paper>
          <Typography role="status" aria-live="polite" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>{t('blog.results', { count: visible.length })}</Typography>
          {visible.length === 0 ? (
            <Paper elevation={0} sx={{ ...glassSurface('card'), borderRadius: '22px', p: 4 }}>
              <Typography component="h2" variant="h5" sx={{ mb: 1 }}>{t('blog.noResults')}</Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>{t('blog.noResultsDescription')}</Typography>
              <Button onClick={() => updateFilters({ query: '', category: '' })} variant="outlined">{t('blog.clearFilters')}</Button>
            </Paper>
          ) : <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3 }}>
            {visible.map(post => <Paper key={post.slug} component="article" elevation={0} lang={post.language} sx={{ ...glassSurface('card'), p: { xs: 3, md: 3.5 }, border: '1px solid white', borderRadius: '24px', display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'box-shadow 180ms ease', '&:hover': { boxShadow: '0 16px 36px rgba(13,77,165,0.12)' } }}>
              <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 750, mb: 2 }}>{post.category}</Typography>
              <Typography component="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.65rem' }, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.025em', mb: 1.5, overflowWrap: 'anywhere' }}>
                <Box component="a" href={getBlogArticleUrl(post.slug)} onClick={followBlogLink} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' }, '&:focus-visible': { outline: '3px solid #0D4DA5', outlineOffset: 4 } }}>{post.title}</Box>
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3, flex: 1, overflowWrap: 'anywhere' }}>{post.excerpt}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>{post.tags.map(tag => <Chip key={tag} label={tag} sx={{ height: 'auto', minHeight: 28, fontSize: '0.875rem', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.4 } }} />)}</Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: 1 }}><time dateTime={post.date}>{formatBlogDate(post.date, i18n.resolvedLanguage || 'pt')}</time><span aria-hidden="true">·</span><span>{t('blog.readingTime', { count: post.readingMinutes })}</span></Typography>
            </Paper>)}
          </Box>}
        </>
      )}
    </BlogLayout>
  );
}
