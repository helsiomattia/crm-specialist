import { Box, Chip, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { taxonomy } from 'virtual:blog';
import { glassSurface } from '../../theme/glass';
import { formatBlogDate, localized } from '../../utils/blog';
import { getBlogCollectionUrl, getBlogTranslationUrl } from '../../utils/routes';
import { followBlogLink } from './BlogLayout';

export default function BlogCards({ posts, featured = false }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'pt').split('-')[0];
  return <Box sx={{ display: 'grid', gridTemplateColumns: featured ? '1fr' : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
    {posts.map(post => {
      const category = taxonomy.categories.find(item => item.slug === post.category);
      return <Paper component="article" key={post.slug} elevation={0} sx={{ ...glassSurface(featured ? 'panel' : 'card'), p: { xs: 3, md: featured ? 5 : 3.5 }, border: '1px solid rgba(13,77,165,0.14)', borderRadius: 4, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box component="a" href={getBlogCollectionUrl('categoria', category.slug)} onClick={followBlogLink} sx={{ color: 'primary.main', fontWeight: 750, fontSize: '.85rem', mb: 1.5 }}>{localized(category.name, lang)}</Box>
        <Typography component={featured ? 'h2' : 'h3'} sx={{ fontSize: featured ? { xs: '1.65rem', md: '2.25rem' } : '1.4rem', fontWeight: 800, lineHeight: 1.22, mb: 2 }}>
          <Box component="a" href={getBlogTranslationUrl(post, lang)} onClick={followBlogLink} sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline' }, '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 4 } }}>{localized(post.title, lang)}</Box>
        </Typography>
        <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: '75ch', mb: 2 }}>{localized(post.excerpt, lang)}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .75, mb: 2 }}>{post.tags.map(tag => <Chip key={tag} label={localized(taxonomy.tags[tag], lang)} component="a" href={getBlogCollectionUrl('tag', tag)} onClick={followBlogLink} clickable size="small" variant="outlined" />)}</Box>
        <Typography sx={{ color: 'text.secondary', fontSize: '.82rem', mt: 'auto' }}>{post.publishedAt ? formatBlogDate(post.publishedAt, lang) : t('blog.awaitingPublication')} · {t('blog.readingTime', { count: post.readingMinutes })}{!post.languages.includes(lang) ? ` · ${t('blog.originalPt')}` : ''}</Typography>
      </Paper>;
    })}
  </Box>;
}
