import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Breadcrumbs, Button, Chip, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { posts, articleLoaders, taxonomy, editorialPreview } from 'virtual:blog';
import BlogLayout, { followBlogLink } from './BlogLayout';
import BlogCards from './BlogCards';
import BlogSeo from './BlogSeo';
import { glassSurface } from '../../theme/glass';
import { localized, formatBlogDate } from '../../utils/blog';
import { articlePath, blogSeo } from '../../utils/blog-seo';
import { MarkdownContent, markdownOutline } from '../../utils/blog-markdown';
import { BASE_PATH, getBlogUrl, getBlogCollectionUrl, getBlogTranslationUrl } from '../../utils/routes';

const prose = { fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.9, overflowWrap: 'anywhere', color: 'text.primary', '& > :first-of-type': { mt: 0 },
  '& h2, & h3, & h4': { lineHeight: 1.3, mt: 4.5, mb: 2, scrollMarginTop: 110, letterSpacing: '-.025em' }, '& h2': { fontSize: { xs: '1.55rem', md: '1.9rem' } }, '& h3': { fontSize: '1.35rem' }, '& p, & ul, & ol': { my: 2 },
  '& a': { color: 'primary.main', textUnderlineOffset: 3 }, '& a:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 3 }, '& li': { mb: 1 }, '& img': { maxWidth: '100%', height: 'auto' },
  '& pre': { overflowX: 'auto', p: 2, bgcolor: '#E5EEF6', borderRadius: 2, fontSize: '.85em', whiteSpace: 'pre', maxWidth: '100%' }, '& code': { fontFamily: 'monospace' }, '& blockquote': { mx: 0, px: 2.5, borderLeft: '3px solid', borderColor: 'primary.main', color: 'text.secondary' } };

export default function BlogArticlePage({ slug, language }) {
  const { t, i18n } = useTranslation();
  const uiLanguage = (i18n.resolvedLanguage || 'pt').split('-')[0];
  const candidate = posts.find(item => item.slug === slug);
  const post = candidate && (!language || candidate.languages.includes(language)) ? candidate : null;
  const contentLanguage = language || post?.language || 'pt';
  const key = `${slug}:${contentLanguage}`;
  const [state, setState] = useState({ key: '', content: '', error: false });
  const [retry, setRetry] = useState(0);
  const [shared, setShared] = useState('');
  useEffect(() => {
    let cancelled = false;
    setShared('');
    if (!post || !Object.hasOwn(articleLoaders, key)) return undefined;
    setState({ key, content: '', error: false });
    articleLoaders[key]().then(content => { if (!cancelled) setState({ key, content, error: false }); })
      .catch(() => { if (!cancelled) setState({ key, content: '', error: true }); });
    return () => { cancelled = true; };
  }, [post, key, retry]);
  const content = state.key === key ? state.content : '';
  const outline = useMemo(() => markdownOutline(content).headings, [content]);
  useEffect(() => {
    if (content && window.location.hash) {
      try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }); } catch { /* Invalid fragments do not interrupt reading. */ }
    }
  }, [content]);
  const title = post ? localized(post.title, contentLanguage) : t('blog.notFound');
  const excerpt = post ? localized(post.excerpt, contentLanguage) : t('blog.notFoundDescription');
  const category = taxonomy.categories.find(item => item.slug === post?.category);
  const sequence = post?.series ? posts.filter(item => item.series === post.series).sort((a, b) => a.seriesOrder - b.seriesOrder) : [];
  const position = sequence.findIndex(item => item.slug === slug);
  const series = taxonomy.series.find(item => item.slug === post?.series);
  const related = post ? post.relatedArticles.map(value => posts.find(item => item.slug === value)).filter(Boolean) : [];
  const share = async () => {
    const url = new URL(post ? articlePath(post, contentLanguage) : `blog/${slug}`, taxonomy.site).href;
    try { await navigator.clipboard.writeText(url); setShared(t('blog.linkCopied')); }
    catch { setShared(url); }
  };
  return <BlogLayout title={title} article routeKey={key}>
    <BlogSeo seo={blogSeo({ taxonomy, title: `${title} | HM.crm`, description: excerpt, routePath: post ? articlePath(post, contentLanguage) : `blog/${slug}`, post, language: contentLanguage, noindex: !post || editorialPreview })} />
    {!post ? <Typography>{excerpt}</Typography> : <>
      <Breadcrumbs aria-label={t('blog.breadcrumb')} sx={{ mb: 3 }}><a href={getBlogUrl()} onClick={followBlogLink}>Blog</a><a href={getBlogCollectionUrl('categoria', post.category)} onClick={followBlogLink}>{localized(category.name, uiLanguage)}</a><Typography color="text.primary">{t('blog.article')}</Typography></Breadcrumbs>
      <Typography component="p" lang={contentLanguage} sx={{ maxWidth: '78ch', fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary', mb: 3 }}>{excerpt}</Typography>
      <Typography sx={{ mb: 1, fontWeight: 700 }}>{post.author}</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: '.9rem' }}>{post.publishedAt ? `${t('blog.published')} ${formatBlogDate(post.publishedAt, uiLanguage)}` : t('blog.awaitingPublication')} · {t('blog.readingTime', { count: post.readingTimes[contentLanguage] })}{post.updatedAt ? ` · ${t('blog.updated')} ${formatBlogDate(post.updatedAt, uiLanguage)}` : ''}</Typography>
      {post.maturity && <Chip label={`${t('blog.maturity')}: ${t(`blog.maturities.${post.maturity}`)}`} variant="outlined" sx={{ mb: 2 }} />}
      {uiLanguage !== contentLanguage && <Alert severity="info" sx={{ mb: 3 }}>{t('blog.originalNotice', { language: new Intl.DisplayNames([uiLanguage], { type: 'language' }).of(contentLanguage) })}</Alert>}
      {post.languages.length > 1 && <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>{post.languages.map(lang => <Button key={lang} component="a" href={getBlogTranslationUrl(post, lang)} onClick={followBlogLink}>{new Intl.DisplayNames([uiLanguage], { type: 'language' }).of(lang)}</Button>)}</Box>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 4 }}>{post.tags.map(tag => <Chip key={tag} component="a" href={getBlogCollectionUrl('tag', tag)} onClick={followBlogLink} clickable label={localized(taxonomy.tags[tag], uiLanguage)} variant="outlined" />)}<Button onClick={share}>{t('blog.copyLink')}</Button><Typography role="status" sx={{ overflowWrap: 'anywhere', fontSize: '.85rem' }}>{shared}</Typography></Box>
      {state.key === key && state.error ? <Alert severity="error" action={<Button onClick={() => setRetry(value => value + 1)}>{t('blog.retry')}</Button>}>{t('blog.loadError')}</Alert> : !content ? <Typography role="status">{t('blog.loading')}</Typography> : <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 250px' }, gap: 3, alignItems: 'start' }}>
        <Box component="nav" aria-label={t('blog.onThisPage')} sx={{ gridColumn: { lg: 2 }, gridRow: { lg: 1 }, position: { lg: 'sticky' }, top: 28, ...glassSurface('card'), p: 2.5, border: '1px solid rgba(13,77,165,0.14)', borderRadius: 3, maxHeight: { lg: 'calc(100vh - 56px)' }, overflowY: 'auto' }}><Typography sx={{ fontWeight: 800, mb: 2 }}>{t('blog.onThisPage')}</Typography><Box component="ol" lang={contentLanguage} sx={{ m: 0, pl: 2.5 }}>{outline.map(item => <Box component="li" key={item.id} sx={{ mb: 1.2, ml: item.depth > 2 ? 1 : 0, fontSize: '.85rem', lineHeight: 1.6 }}><a href={`#${item.id}`} onClick={() => document.getElementById(item.id)?.focus({ preventScroll: true })}>{item.title}</a></Box>)}</Box></Box>
        <Paper component="article" lang={contentLanguage} elevation={0} sx={{ ...glassSurface('card'), bgcolor: 'rgba(250,253,255,.94)', p: { xs: 2.5, sm: 4, md: 5 }, border: '1px solid rgba(13,77,165,0.14)', borderRadius: 4, minWidth: 0, gridColumn: { lg: 1 }, gridRow: { lg: 1 } }}>
          <Box className="blog-prose" sx={{ ...prose, maxWidth: '72ch', mx: 'auto' }}><MarkdownContent content={content} base={BASE_PATH} availableSlugs={posts.map(item => item.slug)} /></Box>
          <Box component="section" sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}><Typography component="h2" variant="h5" sx={{ mb: 2, fontWeight: 800 }}>{t('blog.references')}</Typography><Box component="ul" sx={{ pl: 2.5 }}>{post.sources.map(source => <Box component="li" key={source.url} sx={{ mb: 1.5, overflowWrap: 'anywhere', lineHeight: 1.7 }}><a href={source.url} rel="noopener noreferrer">{source.title}</a><Typography component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: '.8rem' }}>{t('blog.sourceChecked')} {formatBlogDate(source.checkedAt, uiLanguage)}</Typography></Box>)}</Box></Box>
        </Paper>
      </Box>}
      {series && <Box component="nav" aria-label={t('blog.readingSequence')} sx={{ ...glassSurface('panel'), p: 3, border: '1px solid rgba(13,77,165,0.14)', borderRadius: 4, mt: 4 }}><Typography component="h2" variant="h5" sx={{ mb: 2 }}><a href={getBlogCollectionUrl('serie', series.slug)} onClick={followBlogLink}>{localized(series.name, uiLanguage)}</a></Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>{[[sequence[position - 1], 'previousArticle'], [sequence[position + 1], 'nextArticle']].map(([item, label]) => item && <Button key={label} component="a" href={getBlogTranslationUrl(item, uiLanguage)} onClick={followBlogLink} sx={{ maxWidth: { md: '48%' }, textAlign: 'left', display: 'block' }}>{t(`blog.${label}`)}<br />{localized(item.title, uiLanguage)}</Button>)}</Box></Box>}
      {!!related.length && <Box component="section" sx={{ mt: 5 }}><Typography component="h2" variant="h4" sx={{ fontWeight: 800, mb: 3 }}>{t('blog.related')}</Typography><BlogCards posts={related} /></Box>}
    </>}
  </BlogLayout>;
}
