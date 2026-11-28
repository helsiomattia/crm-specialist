import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Button, IconButton, ThemeProvider, Typography, createTheme } from '@mui/material';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { useTranslation } from 'react-i18next';
import { editorialPreview } from 'virtual:blog';
import LanguageSwitcher from '../LanguageSwitcher';
import theme from '../../theme/theme';
import { visualColors } from '../../theme/tokens';
import { profile } from '../../data/profile';
import { getBlogUrl, getHomeUrl, getSectionUrl, isPlainLeftClick, navigateToUrl } from '../../utils/routes';
import './blog.css';

export function followBlogLink(event) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  navigateToUrl(event.currentTarget.href);
}

export default function BlogLayout({ title, children, article = false, routeKey = 'blog', hero }) {
  const { t } = useTranslation();
  const heading = useRef(null);
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('hm-blog-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  });
  const blogTheme = useMemo(() => createTheme(theme, {
    palette: { mode, primary: { main: mode === 'dark' ? '#9ac2ff' : visualColors.salesforceCore },
      text: { primary: mode === 'dark' ? '#edf3ff' : visualColors.textPrimary, secondary: mode === 'dark' ? '#b6c4dc' : visualColors.textSecondary },
      background: { default: mode === 'dark' ? '#101b30' : '#f7f9fd', paper: mode === 'dark' ? '#17243b' : '#ffffff' },
      action: { active: mode === 'dark' ? '#b6c4dc' : '#4d5d75' },
      divider: mode === 'dark' ? '#33435f' : '#dce3ef' },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundColor: mode === 'dark' ? '#17243b' : '#ffffff' } } },
      MuiChip: { styleOverrides: { root: { color: mode === 'dark' ? '#edf3ff' : visualColors.textPrimary } } },
    },
  }), [mode]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.querySelector('h1')?.focus({ preventScroll: true });
  }, [routeKey]);
  const toggleTheme = () => setMode(current => {
    const next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('hm-blog-theme', next); } catch { /* Theme still works without storage. */ }
    return next;
  });
  return <ThemeProvider theme={blogTheme}>
    <div className="blog-shell" data-theme={mode}>
      <a className="blog-skip" href="#blog-main">{t('blog.editorial.skip')}</a>
      <header className="blog-header">
        <div className="blog-width blog-header-inner">
          <a className="blog-brand" href={getHomeUrl('')} onClick={followBlogLink} aria-label={t('blog.backToPortfolio')}>HM<span>.crm</span></a>
          <span className="blog-brand-line">{t('blog.editorial.signature')}</span>
          <nav className="blog-global-nav" aria-label="HM.crm">
            {[['home', 'home'], ['about', 'about'], ['portfolioProjects', 'projects']].map(([key, section]) => <a key={key} href={getSectionUrl(section, '')} onClick={followBlogLink}>{t(`nav.${key}`)}</a>)}
            <a href={getBlogUrl()} onClick={followBlogLink} aria-current="page">{t('nav.blog')}</a>
            <a href={getSectionUrl('contact', '')} onClick={followBlogLink}>{t('nav.contact')}</a>
          </nav>
          <div className="blog-header-tools">
            <IconButton onClick={toggleTheme} aria-label={t(`blog.editorial.${mode === 'light' ? 'darkTheme' : 'lightTheme'}`)} sx={{ color: '#e3ecff' }}>{mode === 'light' ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}</IconButton>
            <LanguageSwitcher sx={{ gap: .5 }} />
          </div>
        </div>
      </header>
      <main id="blog-main" ref={heading} className={article ? 'blog-reading' : ''}>
        {editorialPreview && <div className="blog-width"><Alert severity="info" sx={{ my: 2 }}>{t('blog.previewNotice')}</Alert></div>}
        {hero || <div className="blog-width blog-reading-heading">
          <Button component="a" href={getBlogUrl()} onClick={followBlogLink} sx={{ mb: 3 }}>{t('blog.backToBlog')}</Button>
          <Typography component="p" className="blog-eyebrow" sx={{ mb: 2 }}>{t('blog.eyebrow')}</Typography>
          <Typography tabIndex={-1} component="h1" sx={{ maxWidth: 980, fontSize: { xs: '2rem', md: '3.3rem' }, lineHeight: 1.14, letterSpacing: '-.04em', fontWeight: 800, overflowWrap: 'anywhere' }}>{title}</Typography>
        </div>}
        <Box className="blog-width blog-body">{children}</Box>
      </main>
      <footer className="blog-footer">
        <div className="blog-width blog-footer-inner">
          <a className="blog-brand" href={getHomeUrl('')} onClick={followBlogLink}>HM<span>.crm</span></a>
          <span className="blog-footer-caption">{t('blog.editorial.footer')}</span>
          <div className="blog-social"><a href={profile.linkedin} aria-label="LinkedIn"><LinkedIn fontSize="small" /></a><a href={profile.github} aria-label="GitHub"><GitHub fontSize="small" /></a></div>
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </footer>
    </div>
  </ThemeProvider>;
}
