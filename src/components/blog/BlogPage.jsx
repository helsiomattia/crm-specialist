import { useEffect, useMemo, useRef, useState } from 'react';
import { Breadcrumbs, Button, Chip, InputAdornment, MenuItem, Pagination, TextField, Typography, useMediaQuery } from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import CloudOutlined from '@mui/icons-material/CloudOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import PersonOutline from '@mui/icons-material/PersonOutline';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { posts, taxonomy, editorialPreview } from 'virtual:blog';
import BlogLayout, { followBlogLink } from './BlogLayout';
import BlogCards from './BlogCards';
import BlogSeo from './BlogSeo';
import { filterBlogPosts, localized } from '../../utils/blog';
import { blogSeo } from '../../utils/blog-seo';
import { BASE_PATH, getBlogCollectionUrl, getBlogUrl, getSectionUrl, isPlainLeftClick, navigateToUrl } from '../../utils/routes';
import { profile } from '../../data/profile';
import portrait from '../../../images/optimized/mepic-4.webp';

const categoryIcons = [CloudOutlined, PeopleOutline, SettingsOutlined, LightbulbOutlined, AutoAwesomeOutlined, TrendingUpOutlined];
function readFilters() {
  const params = new URLSearchParams(window.location.search);
  return { query: params.get('q') || '', category: params.get('category') || '', tag: params.get('tag') || '', page: Math.max(1, Number.parseInt(params.get('page'), 10) || 1), view: params.get('view') === 'all' ? 'all' : '' };
}

export default function BlogPage({ collection, slug }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'pt').split('-')[0];
  const [filters, setFilters] = useState(readFilters);
  const desktop = useMediaQuery('(min-width:1100px)');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [allSeries, setAllSeries] = useState(false);
  const search = useRef(null);
  useEffect(() => {
    const update = () => setFilters(readFilters());
    update(); window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, [collection, slug]);
  useEffect(() => {
    const shortcut = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); search.current?.focus();
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const record = collection === 'categoria' ? taxonomy.categories.find(item => item.slug === slug)
    : collection === 'serie' ? taxonomy.series.find(item => item.slug === slug)
      : collection === 'tag' && Object.hasOwn(taxonomy.tags, slug) ? { name: taxonomy.tags[slug] } : null;
  const missing = !!collection && !record;
  const title = missing ? t('blog.collectionNotFound') : record ? localized(record.name, lang) : t('blog.title');
  const description = localized(record?.intro || record?.description, lang) || t('blog.editorial.description');
  const routePath = collection ? `blog/${collection}/${slug}` : 'blog';
  useEffect(() => {
    if (window.location.hash !== '#blog-series') return undefined;
    const frame = requestAnimationFrame(() => document.getElementById('blog-series')?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [routePath]);
  const candidates = useMemo(() => collection === 'serie' ? posts.filter(post => post.series === slug).sort((a, b) => a.seriesOrder - b.seriesOrder) : posts, [collection, slug]);
  const category = collection === 'categoria' ? slug : filters.category;
  const tag = collection === 'tag' ? slug : filters.tag;
  const visible = filterBlogPosts(candidates, filters.query, category, tag);
  const pageCount = Math.max(1, Math.ceil(visible.length / 12));
  const page = Math.min(filters.page, pageCount);
  const hasFilters = !!(filters.query || filters.category || filters.tag);
  const overview = !collection && !hasFilters && filters.view !== 'all' && filters.page === 1;
  const featured = overview ? visible.find(post => post.featured) : null;
  const recent = visible.filter(post => post.slug !== featured?.slug).slice(0, 3);
  const shown = overview ? recent : visible.slice((page - 1) * 12, page * 12);
  const popularTags = useMemo(() => Object.keys(taxonomy.tags).map(key => ({ key, count: posts.filter(post => post.tags.includes(key)).length })).filter(item => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 8), []);
  const updateFilters = (next, { root = false } = {}) => {
    const value = { ...filters, ...next };
    const url = new URL(root ? getBlogUrl() : window.location.href, window.location.origin);
    for (const [key, field] of [['q', 'query'], ['category', 'category'], ['tag', 'tag'], ['page', 'page'], ['view', 'view']]) {
      if (value[field] && !(key === 'page' && value.page === 1)) url.searchParams.set(key, value[field]); else url.searchParams.delete(key);
    }
    setFilters(value);
    setNavigationOpen(false);
    navigateToUrl(url.href, { replace: !root, notify: root });
  };
  const reset = () => updateFilters({ query: '', category: '', tag: '', page: 1, view: '' }, { root: !!collection });
  const allArticles = getBlogUrl('?view=all');
  const tagSelect = <TextField select fullWidth size="small" label={t('blog.tags')} value={tag} disabled={collection === 'tag'} onChange={event => updateFilters({ tag: event.target.value, page: 1 })}>
    <MenuItem value="">{t('blog.allTags')}</MenuItem>{Object.entries(taxonomy.tags).map(([key, name]) => <MenuItem key={key} value={key}>{localized(name, lang)}</MenuItem>)}
  </TextField>;
  const hero = <section className="blog-hero" aria-labelledby="blog-title">
    <img className="blog-hero-image" src={`${BASE_PATH}/images/blog/mountains.webp`} alt="" width="1800" height="900" fetchPriority="high" />
    <div className="blog-width blog-hero-content">
      <p className="blog-eyebrow">{t('blog.editorial.eyebrow')}</p>
      <h1 id="blog-title" tabIndex={-1}>{record || missing ? title : <>{t('blog.editorial.titleStart')} <span>{t('blog.editorial.titleEnd')}</span></>}</h1>
      <p className="blog-hero-description">{missing ? t('blog.notFoundDescription') : description}</p>
      {!missing && <TextField className="blog-search" inputRef={search} fullWidth type="search" value={filters.query} placeholder={t('blog.editorial.searchPlaceholder')} onChange={event => updateFilters({ query: event.target.value, page: 1 })}
        inputProps={{ 'aria-label': t('blog.search'), 'aria-keyshortcuts': 'Control+k Meta+k' }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment>, endAdornment: <InputAdornment position="end"><kbd>Ctrl K</kbd></InputAdornment> }} />}
    </div>
  </section>;
  return <BlogLayout title={title} routeKey={routePath} hero={hero}>
    <BlogSeo seo={blogSeo({ taxonomy, title: `${record || missing ? title : t('nav.blog')} | HM.crm`, description, routePath, language: lang, noindex: missing || editorialPreview || hasFilters || page > 1,
      trail: record ? [{ name: title, item: new URL(routePath, taxonomy.site).href }] : [] })} />
    {collection && <Breadcrumbs aria-label={t('blog.breadcrumb')} sx={{ mb: 3 }}><a href={getBlogUrl()} onClick={followBlogLink}>Blog</a><Typography color="text.primary">{title}</Typography></Breadcrumbs>}
    {!missing && <>
      <div className="blog-editorial-grid">
        <aside className="blog-sidebar">
          <details open={desktop || navigationOpen} onToggle={event => { if (!desktop) setNavigationOpen(event.currentTarget.open); }}>
            <summary>{t('blog.editorial.explore')}<ExpandMore /></summary>
            <nav aria-label={t('blog.editorial.navigation')}>
              <p className="blog-nav-label">{t('blog.editorial.explore')}</p>
              <button className={overview ? 'is-active' : ''} aria-pressed={overview} onClick={reset}><HomeOutlined />{t('blog.editorial.overview')}</button>
              <a className={!overview && !collection && !hasFilters ? 'is-active' : ''} href={allArticles} onClick={followBlogLink}><LayersOutlined />{t('blog.backToBlog')}</a>
              <a href={`${getBlogUrl()}#blog-series`} onClick={event => {
                if (!isPlainLeftClick(event)) return;
                if (!collection) { event.preventDefault(); document.getElementById('blog-series')?.scrollIntoView({ behavior: 'instant' }); setNavigationOpen(false); }
                else followBlogLink(event);
              }}><MenuBookOutlined />{t('blog.editorial.collections')}</a>
              <div className="blog-nav-group">
                <p className="blog-nav-label">{t('blog.editorial.themes')}</p>
                {taxonomy.categories.map((item, index) => {
                  const Icon = categoryIcons[index % categoryIcons.length];
                  return <button key={item.slug} className={category === item.slug ? 'is-active' : ''} aria-pressed={category === item.slug} onClick={() => updateFilters({ category: category === item.slug ? '' : item.slug, page: 1 }, { root: !!collection })}>
                    <Icon /><span>{localized(item.name, lang)}</span><span className="blog-count">{posts.filter(post => post.category === item.slug).length}</span>
                  </button>;
                })}
              </div>
              <div className="blog-nav-group blog-sidebar-note"><MenuBookOutlined /><p>{t('blog.editorial.sidebarNote')}</p><span>{t('blog.editorial.articleCount', { count: posts.length })}</span></div>
            </nav>
          </details>
        </aside>
        <div className="blog-editorial-main">
          {record?.topics && <details className="blog-scope"><summary>{t('blog.editorialTopics')}</summary><ul lang="pt">{record.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></details>}
          {featured && <section aria-labelledby="blog-featured"><h2 id="blog-featured" className="blog-section-title">{t('blog.editorial.featured')}</h2><BlogCards posts={[featured]} featured /></section>}
          <section aria-labelledby="blog-library" className="blog-library-section">
            <div className="blog-section-heading"><h2 id="blog-library" className="blog-section-title">{overview ? t('blog.editorial.recent') : collection === 'serie' ? t('blog.readingSequence') : t('blog.library')}</h2>
              {overview && <a href={allArticles} onClick={followBlogLink}>{t('blog.editorial.viewAll')}</a>}
            </div>
            {!overview && <div className="blog-filter-toolbar">{tagSelect}</div>}
            {(hasFilters || collection) && <div className="blog-active-filters">
              {filters.query && <Chip label={filters.query} onDelete={() => updateFilters({ query: '', page: 1 })} size="small" />}
              {category && <Chip label={localized(taxonomy.categories.find(item => item.slug === category)?.name, lang) || category} onDelete={() => updateFilters({ category: '', page: 1 }, { root: collection === 'categoria' })} size="small" />}
              {tag && <Chip label={localized(taxonomy.tags[tag], lang) || tag} onDelete={() => updateFilters({ tag: '', page: 1 }, { root: collection === 'tag' })} size="small" />}
              <Button size="small" onClick={reset}>{t('blog.clearFilters')}</Button>
            </div>}
            <p className={overview ? 'sr-only' : 'blog-result-count'} role="status" aria-live="polite">{t('blog.results', { count: visible.length })}</p>
            {!visible.length ? <div className="blog-empty"><SearchOutlined /><h3>{hasFilters ? t('blog.noResults') : t('blog.emptyTitle')}</h3><p>{hasFilters ? t('blog.noResultsDescription') : t('blog.emptyDescription')}</p></div>
              : <BlogCards posts={shown} />}
            {!overview && pageCount > 1 && <Pagination count={pageCount} page={page} onChange={(_, next) => { updateFilters({ page: next }); document.getElementById('blog-library')?.scrollIntoView({ behavior: 'instant' }); }} getItemAriaLabel={(type, number) => type === 'page' ? t('blog.pageNumber', { number }) : t(`blog.pagination.${type}`)} sx={{ mt: 3 }} />}
            {overview && <a className="blog-library-link" href={allArticles} onClick={followBlogLink}>{t('blog.editorial.browseLibrary', { count: posts.length })}</a>}
          </section>
        </div>
        <aside className="blog-right-rail" aria-label={t('blog.editorial.discover')}>
          <section className="blog-contact-panel">
            <MailOutline /><h2>{t('blog.editorial.contactTitle')}</h2><p>{t('blog.editorial.contactDescription')}</p>
            <a href={`mailto:${profile.email}`}>{t('blog.editorial.contactAction')}</a>
          </section>
          {overview && <section className="blog-rail-panel"><h2><AutoAwesomeOutlined />{t('blog.editorial.popularTopics')}</h2>
            <div className="blog-topic-links">{popularTags.map(({ key }) => <button key={key} onClick={() => updateFilters({ tag: key, page: 1 })}>{localized(taxonomy.tags[key], lang)}</button>)}</div>
            <div className="blog-tag-select">{tagSelect}</div>
          </section>}
          <section className="blog-rail-panel blog-author"><h2><PersonOutline />{t('blog.editorial.aboutAuthor')}</h2>
            <div className="blog-author-identity"><img src={portrait} alt={profile.name} width="56" height="56" loading="lazy" /><div><strong>{profile.name}</strong><span>{localized(profile.title, lang)}</span></div></div>
            <p>{t('blog.editorial.authorDescription')}</p><a href={getSectionUrl('about', '')} onClick={followBlogLink}>{t('blog.editorial.aboutAction')}</a>
          </section>
        </aside>
      </div>
      {!collection && <section className="blog-series-section" aria-labelledby="blog-series">
        <div className="blog-section-heading"><div><h2 id="blog-series" className="blog-section-title">{t('blog.editorial.seriesTitle')}</h2><p>{t('blog.editorial.seriesDescription')}</p></div><button className="blog-series-toggle" aria-expanded={allSeries} aria-controls="blog-series-grid" onClick={() => setAllSeries(value => !value)}>{t(`blog.editorial.${allSeries ? 'fewerSeries' : 'allSeries'}`, { count: taxonomy.series.length })}</button></div>
        <div className="blog-series-grid" id="blog-series-grid">{taxonomy.series.slice(0, allSeries ? undefined : 6).map((series, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];
          return <a key={series.slug} className={`blog-series-card blog-series-tone-${index % 6}`} href={getBlogCollectionUrl('serie', series.slug)} onClick={followBlogLink}>
            <Icon /><h3>{localized(series.name, lang)}</h3><p>{localized(series.description, lang)}</p><span><MenuBookOutlined />{t('blog.editorial.articleCount', { count: posts.filter(post => post.series === series.slug).length })}</span>
          </a>;
        })}</div>
      </section>}
    </>}
  </BlogLayout>;
}
