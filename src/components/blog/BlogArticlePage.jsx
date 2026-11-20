import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import { posts, articleLoaders } from 'virtual:blog';
import BlogLayout, { followBlogLink, useBlogMetadata } from './BlogLayout';
import { glassSurface } from '../../theme/glass';
import { formatBlogDate } from '../../utils/blog';
import { BASE_PATH, getBlogUrl } from '../../utils/routes';

function articleUrl(url) {
  const safe = defaultUrlTransform(url);
  // Root-relative author links work on both Vite root and GitHub Pages base.
  if (safe.startsWith('/') && !safe.startsWith('//') && BASE_PATH && !safe.startsWith(`${BASE_PATH}/`)) return `${BASE_PATH}${safe}`;
  return safe;
}

const markdownComponents = {
  h1: ({ children }) => <h2>{children}</h2>,
  img: ({ node: _node, ...props }) => <img {...props} loading="lazy" decoding="async" />,
};

export default function BlogArticlePage({ slug }) {
  const { t, i18n } = useTranslation();
  const post = posts.find(item => item.slug === slug);
  const [content, setContent] = useState({ slug: '', markdown: '', error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setContent({ slug, markdown: '', error: false });
    if (post && Object.hasOwn(articleLoaders, slug)) articleLoaders[slug]().then(markdown => {
      if (!cancelled) setContent({ slug, markdown, error: false });
    }).catch(() => { if (!cancelled) setContent({ slug, markdown: '', error: true }); });
    return () => { cancelled = true; };
  }, [slug, attempt, post]);
  useBlogMetadata(`${post?.title || t('blog.notFound')} | HM.crm`, post?.excerpt || t('blog.notFoundDescription'), slug, !post);
  const current = content.slug === slug ? content : { markdown: '', error: false };
  return (
    <BlogLayout article routeKey={slug} title={post?.title || t('blog.notFound')}>
      {!post ? <Paper elevation={0} sx={{ ...glassSurface('panel'), borderRadius: '24px', p: 4 }}>
        <Typography sx={{ color: 'text.secondary', mb: 3 }}>{t('blog.notFoundDescription')}</Typography>
        <Button component="a" href={getBlogUrl()} onClick={followBlogLink} variant="outlined">{t('blog.backToBlog')}</Button>
      </Paper> : <Box component="article" lang={post.language}>
        <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' }, lineHeight: 1.8, color: 'text.secondary', maxWidth: 850, mb: 3 }}>{post.excerpt}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 700, color: 'text.primary' }}>{post.author}</Typography>
          <time dateTime={post.date}>{formatBlogDate(post.date, i18n.resolvedLanguage || 'pt')}</time>
          <span>{t('blog.readingTime', { count: post.readingMinutes })}</span>
          <span>{new Intl.DisplayNames([i18n.resolvedLanguage || 'pt'], { type: 'language' }).of(post.language)}</span>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>{[post.category, ...new Set(post.tags.filter(tag => tag !== post.category))].map(tag => <Chip key={tag} label={tag} sx={{ fontSize: '0.875rem', height: 'auto', minHeight: 28, '& .MuiChip-label': { py: 0.4, whiteSpace: 'normal' } }} />)}</Box>
        <Paper elevation={0} sx={{ ...glassSurface('card'), border: '1px solid white', borderRadius: '28px', p: { xs: 2.5, sm: 4, md: 6 }, maxWidth: 960 }}>
          {current.error ? <Alert severity="error" action={<Button color="inherit" onClick={() => setAttempt(value => value + 1)}>{t('blog.retry')}</Button>}>{t('blog.loadError')}</Alert>
            : !current.markdown ? <Typography role="status">{t('blog.loading')}</Typography>
              : <Box className="blog-prose" sx={{ maxWidth: '72ch', mx: 'auto', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.9, overflowWrap: 'anywhere', '& > :first-child': { mt: 0 }, '& > :last-child': { mb: 0 }, '& h2, & h3, & h4': { lineHeight: 1.3, letterSpacing: '-0.02em', mt: '2em', mb: '0.8em', color: 'text.primary' }, '& h2': { fontSize: '1.75em' }, '& h3': { fontSize: '1.3em' }, '& p, & ul, & ol': { mb: '1.3em' }, '& li': { mb: 0.6 }, '& a': { color: 'primary.main', textUnderlineOffset: '4px' }, '& a:focus-visible': { outline: '3px solid #0D4DA5', outlineOffset: 3 }, '& blockquote': { ml: 0, mr: 0, borderLeft: '3px solid #087F91', pl: 2.5, color: 'text.secondary' }, '& pre': { maxWidth: '100%', overflowX: 'auto', bgcolor: '#102D46', color: '#edf6ff', p: 2.5, borderRadius: '14px', fontSize: '0.875rem', lineHeight: 1.7 }, '& code': { fontFamily: '"Fira Code", monospace', fontSize: '0.9em' }, '& :not(pre) > code': { bgcolor: 'rgba(13,77,165,0.08)', borderRadius: '4px', px: 0.5 }, '& img': { maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '12px' }, '& hr': { border: 0, borderTop: '1px solid #a9bdd2', my: 4 } }}>
                <Markdown skipHtml urlTransform={articleUrl} components={markdownComponents}>{current.markdown}</Markdown>
              </Box>}
        </Paper>
      </Box>}
    </BlogLayout>
  );
}
