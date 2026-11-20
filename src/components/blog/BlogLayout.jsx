import { useEffect, useRef } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { glassPageGlow } from '../../theme/glass';
import { getBlogUrl, getHomeUrl, isPlainLeftClick, navigateToUrl } from '../../utils/routes';

export function followBlogLink(event) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  navigateToUrl(event.currentTarget.href);
}

export function useBlogMetadata(title, description, slug = '', missing = false) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute('href');
    const url = new URL(`blog${slug ? `/${encodeURIComponent(slug)}` : ''}`, previousCanonical || window.location.origin).href;
    const updates = [
      ['meta[name="description"]', description], ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description], ['meta[property="og:url"]', url],
      ['meta[property="og:type"]', slug && !missing ? 'article' : 'website'],
      ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', description],
      ['meta[name="robots"]', missing ? 'noindex, follow' : 'index, follow'],
    ].map(([selector, value]) => {
      const node = document.querySelector(selector);
      const previous = node?.getAttribute('content');
      node?.setAttribute('content', value);
      return { node, previous };
    });
    document.title = title;
    canonical?.setAttribute('href', url);
    return () => {
      document.title = previousTitle;
      if (previousCanonical) canonical?.setAttribute('href', previousCanonical);
      updates.forEach(({ node, previous }) => { if (previous !== null && previous !== undefined) node?.setAttribute('content', previous); });
    };
  }, [title, description, slug, missing]);
}

export default function BlogLayout({ title, children, article = false, routeKey = 'blog' }) {
  const { t } = useTranslation();
  const heading = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.focus({ preventScroll: true });
  }, [routeKey]);
  return (
    <Box component="main" id="blog-main" sx={{ minHeight: 'calc(100svh - 100px)', pt: { xs: 12, md: 6 }, pb: { xs: 7, md: 10 }, pl: { md: '88px' }, pr: { md: 3 }, background: `${glassPageGlow}, linear-gradient(180deg, var(--site-bg-start), var(--site-bg-end))` }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4 } }}>
        <Button component="a" href={article ? getBlogUrl() : getHomeUrl('')} onClick={followBlogLink} variant="outlined" sx={{ mb: { xs: 4, md: 6 } }}>
          {article ? t('blog.backToBlog') : t('blog.backToPortfolio')}
        </Button>
        <Typography component="p" sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 750, mb: 1.5, letterSpacing: '0.08em' }}>{t('blog.eyebrow')}</Typography>
        <Typography ref={heading} tabIndex={-1} component="h1" sx={{ maxWidth: 900, fontSize: article ? { xs: '2rem', md: '3.4rem' } : { xs: '2.8rem', md: '4.6rem' }, letterSpacing: '-0.045em', lineHeight: 1.1, fontWeight: 850, mb: 2.5, overflowWrap: 'anywhere', '&:focus': { outline: 'none' } }}>{title}</Typography>
        {children}
      </Container>
    </Box>
  );
}
