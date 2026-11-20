import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';
import { getLocalizedString } from '../../utils/i18nHelper';
import { getPortfolioProjectById, getPortfolioProjectsByParent } from '../../data/portfolioProjects';
import { visualColors } from '../../theme/tokens';
import { glassSurface, glassPageGlow } from '../../theme/glass';
import { getHomeProjectsUrl as getHomeProjectsPath } from '../../utils/routes';

const DEFAULT_IFRAME_HEIGHT = 640;
import { loadPortfolioProjectEmbed } from '../../data/projectEmbeds';
import { buildEmbedDocument, createEmbedToken, readEmbedMessage, EMBED_CHANNEL, MAX_SCROLL_DELTA } from '../../utils/embedBridge';

function LwcDemoMenu({ demos, activeDemo, lang, onSelect }) {
  return (
    <Box
      component="nav"
      aria-label="Demonstrações LWC"
      sx={{
        ...glassSurface('dark'),
        color: visualColors.surfaceWhite,
        borderRadius: { xs: '20px', lg: '28px 0 0 28px' },
        minWidth: 0,
        p: { xs: 1, md: 1.2 },
        display: 'flex',
        flexDirection: { xs: 'row', lg: 'column' },
        gap: 0.65,
        overflowX: { xs: 'auto', lg: 'visible' },
        overflowY: { xs: 'hidden', lg: 'auto' },
        maxHeight: { xs: 'none', lg: 'calc(100dvh - 220px)' },
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: 8,
          width: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: alpha(visualColors.flowCyan, 0.48),
          borderRadius: 999,
        },
      }}
    >
      {demos.map((demo) => {
        const isActive = demo.id === activeDemo?.id;

        return (
          <Box
            component="button"
            key={demo.id}
            type="button"
            onClick={() => onSelect(demo.id)}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              width: { xs: 240, lg: '100%' },
              flex: { xs: '0 0 auto', lg: '0 0 auto' },
              border: 0,
              borderRadius: { xs: '15px', lg: '18px' },
              p: { xs: 1.2, md: 1.35 },
              textAlign: 'left',
              cursor: 'pointer',
              color: visualColors.surfaceWhite,
              bgcolor: isActive ? alpha(demo.accent, 0.34) : 'transparent',
              boxShadow: isActive ? `inset 4px 0 0 ${demo.accent}` : `inset 1px 0 0 ${alpha(visualColors.surfaceWhite, 0.08)}`,
              transition: 'background-color 180ms ease, box-shadow 180ms ease',
              '&:hover': {
                bgcolor: isActive ? alpha(demo.accent, 0.38) : alpha(visualColors.surfaceWhite, 0.08),
              },
              '&:focus-visible': {
                outline: `3px solid ${alpha(visualColors.flowCyan, 0.7)}`,
                outlineOffset: 2,
              },
            }}
          >
            <Typography sx={{ fontSize: '0.86rem', fontWeight: 850, lineHeight: 1.2 }}>
              {getLocalizedString(demo.title, lang)}
            </Typography>
            <Typography sx={{ mt: 0.55, color: alpha(visualColors.surfaceWhite, 0.7), fontSize: '0.68rem', lineHeight: 1.35 }}>
              {demo.tags.slice(1, 3).join(' / ')}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

function EmbeddedProjectPreview({ project, lang, t, embedHtml, embedToken, iframeHeight, iframeRef, isLoadingEmbed }) {
  return (
    <Paper
      className="embedded-html-view"
      elevation={0}
      sx={{
        borderRadius: { xs: '20px', md: '28px' },
        border: `1px solid ${alpha(project.accent, 0.24)}`,
        ...glassSurface('panel', project.accent),
        height: 'auto',
        maxHeight: 'none',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.9,
          px: { xs: 1.5, md: 2 },
          py: 1.2,
          borderBottom: '1px solid rgba(15,37,55,0.12)',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          background: `linear-gradient(90deg, ${alpha(visualColors.consoleMist, 0.78)} 0%, ${alpha(project.accent, 0.08)} 100%)`,
        }}
      >
        {['#D94A5F', visualColors.signalAmber, visualColors.successGreen].map((color) => (
          <Box key={color} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        ))}
        <Typography sx={{ ml: 0.6, fontFamily: '"Fira Code", monospace', fontSize: '0.72rem', fontWeight: 850, color: 'text.secondary' }}>
          {t('portfolioProjects.frameTitle')}
        </Typography>
      </Box>

      {embedHtml ? (
        <Box
          component="iframe"
          key={embedToken}
          ref={iframeRef}
          title={`${getLocalizedString(project.title, lang)} preview`}
          srcDoc={embedHtml}
          sandbox="allow-scripts"
          scrolling="no"
          sx={{
            display: 'block',
            width: '100%',
            height: `${iframeHeight}px`,
            maxHeight: 'none',
            border: 0,
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
            bgcolor: '#fff',
            overflow: 'hidden',
          }}
        />
      ) : (
        <Box sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', bgcolor: '#fff' }}>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
            {isLoadingEmbed ? t('portfolioProjects.loadingDemo') : t('portfolioProjects.demoUnavailable')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default function ProjectDetailPage({ projectId }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.resolvedLanguage || 'pt';
  const project = getPortfolioProjectById(projectId);
  const childProjects = project?.kind === 'collection' ? getPortfolioProjectsByParent(project.id) : [];
  const [activeCollectionProjectId, setActiveCollectionProjectId] = useState('');
  const activeCollectionProject = childProjects.find((childProject) => childProject.id === activeCollectionProjectId) || childProjects[0];
  const previewProject = project?.kind === 'collection' ? activeCollectionProject : project;
  const pageAccent = previewProject?.accent || project?.accent || visualColors.salesforceCore;
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [embedHtml, setEmbedHtml] = useState('');
  const [embedToken, setEmbedToken] = useState('');
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);

  useEffect(() => {
    if (!previewProject || previewProject.kind !== 'embed') {
      setEmbedHtml('');
      setIsLoadingEmbed(false);
      return undefined;
    }

    const token = createEmbedToken();
    setEmbedToken(token);
    let cancelled = false;
    setIsLoadingEmbed(true);
    setEmbedHtml('');

    loadPortfolioProjectEmbed(previewProject.id)
      .then((html) => {
        if (!cancelled) setEmbedHtml(buildEmbedDocument(html, token, window.location.origin));
      })
      .catch(() => {
        if (!cancelled) setEmbedHtml('');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingEmbed(false);
      });

    return () => {
      cancelled = true;
    };
  }, [previewProject]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !embedHtml || !embedToken) return undefined;

    let animationFrameId = 0;
    let nextHeight = null;
    let scrollDelta = 0;
    const failLoad = () => {
      setEmbedHtml('');
      setIsLoadingEmbed(false);
    };
    const readyTimeout = window.setTimeout(failLoad, 10000);
    const flush = () => {
      animationFrameId = 0;
      if (nextHeight !== null) {
        const height = nextHeight;
        setIframeHeight(current => Math.abs(current - height) > 1 ? height : current);
        nextHeight = null;
      }
      if (scrollDelta) window.scrollBy({ top: scrollDelta, behavior: 'auto' });
      scrollDelta = 0;
    };
    const onMessage = (event) => {
      const message = readEmbedMessage(event, iframe.contentWindow, embedToken);
      if (!message) return;
      if (message.type === 'height') {
        window.clearTimeout(readyTimeout);
        nextHeight = message.height;
      } else {
        scrollDelta = Math.max(-MAX_SCROLL_DELTA, Math.min(MAX_SCROLL_DELTA, scrollDelta + message.deltaY));
      }
      if (!animationFrameId) animationFrameId = window.requestAnimationFrame(flush);
    };
    const requestMeasure = () => {
      // Opaque frames require '*'; this message contains only a per-frame token and a measure request.
      iframe.contentWindow?.postMessage({ channel: EMBED_CHANNEL, token: embedToken, type: 'measure' }, '*');
    };
    setIframeHeight(DEFAULT_IFRAME_HEIGHT);
    window.addEventListener('message', onMessage);
    window.addEventListener('resize', requestMeasure);
    iframe.addEventListener('load', requestMeasure);
    iframe.addEventListener('error', failLoad);
    requestMeasure();
    return () => {
      window.clearTimeout(readyTimeout);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('message', onMessage);
      window.removeEventListener('resize', requestMeasure);
      iframe.removeEventListener('load', requestMeasure);
      iframe.removeEventListener('error', failLoad);
    };
  }, [embedHtml, embedToken]);

  if (!project) {
    return (
      <Box component="main" sx={{ minHeight: '100dvh', pt: 'calc(var(--header-height) + 48px)', pb: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', ...glassSurface('panel') }}>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 850 }}>
              {t('portfolioProjects.notFoundTitle')}
            </Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              {t('portfolioProjects.notFoundBody')}
            </Typography>
            <Button component="a" href={getHomeProjectsPath()} startIcon={<ArrowBackRoundedIcon />}>
              {t('portfolioProjects.backToProjects')}
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        pt: 'calc(var(--header-height) + 34px)',
        pb: { xs: 5, md: 7 },
        background: `${glassPageGlow}, linear-gradient(180deg, var(--site-bg-start) 0%, var(--site-bg-mid) 100%)`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: { xs: '-160px', md: '-80px' },
          top: { xs: 80, md: 120 },
          width: { xs: 280, md: 460 },
          height: { xs: 280, md: 460 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(pageAccent, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(36px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth={false} sx={{ maxWidth: 1220, px: 'var(--section-inline-padding)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Button component="a" href={getHomeProjectsPath()} startIcon={<ArrowBackRoundedIcon />} variant="outlined" color="primary">
            {t('portfolioProjects.backToProjects')}
          </Button>

          {project.externalUrl && (
            <Button component="a" href={project.externalUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewRoundedIcon />}>
              {getLocalizedString(project.action, lang)}
            </Button>
          )}
        </Box>

        <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          <Chip
            label={getLocalizedString(project.status, lang)}
            sx={{
              mb: 1.4,
              bgcolor: alpha(project.accent, 0.1),
              color: project.accent,
              border: `1px solid ${alpha(project.accent, 0.22)}`,
              fontWeight: 850,
            }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4.3rem' }, mb: 1, maxWidth: 900 }}>
            {getLocalizedString(project.title, lang)}
          </Typography>
          <Typography sx={{ color: 'text.primary', maxWidth: 760, fontWeight: 500, lineHeight: 1.7 }}>
            {getLocalizedString(project.description, lang)}
          </Typography>
        </Box>

        {project.kind === 'collection' ? (
          <Paper
            elevation={0}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '310px minmax(0, 1fr)' },
              gap: { xs: 1.2, lg: 0 },
              alignItems: 'stretch',
              borderRadius: { xs: '24px', lg: '30px' },
              border: `1px solid ${alpha(pageAccent, 0.24)}`,
              bgcolor: alpha(visualColors.consoleMist, 0.76),
              boxShadow: `0 28px 90px ${alpha(visualColors.commandNavy, 0.14)}`,
              overflow: 'hidden',
            }}
          >
            <LwcDemoMenu
              demos={childProjects}
              activeDemo={activeCollectionProject}
              lang={lang}
              onSelect={setActiveCollectionProjectId}
            />
            <Box sx={{ minWidth: 0, p: { xs: 1, md: 1.4, lg: 1.6 } }}>
              {activeCollectionProject ? (
                <>
                  <Box sx={{ px: { xs: 0.6, md: 1 }, py: { xs: 1, md: 1.2 }, mb: 1.1 }}>
                    <Typography sx={{ color: activeCollectionProject.accent, fontSize: '0.78rem', fontWeight: 850 }}>
                      {activeCollectionProject.tags.join(' / ')}
                    </Typography>
                    <Typography variant="h2" sx={{ mt: 0.45, mb: 0.65, fontSize: { xs: '1.7rem', md: '2.35rem' }, fontWeight: 900, lineHeight: 1.04 }}>
                      {getLocalizedString(activeCollectionProject.title, lang)}
                    </Typography>
                    <Typography sx={{ maxWidth: 720, color: 'text.primary', fontSize: { xs: '0.88rem', md: '0.96rem' }, lineHeight: 1.62, fontWeight: 520 }}>
                      {getLocalizedString(activeCollectionProject.description, lang)}
                    </Typography>
                  </Box>
                  <EmbeddedProjectPreview
                    project={activeCollectionProject}
                    lang={lang}
                    t={t}
                    embedHtml={embedHtml}
                    embedToken={embedToken}
                    iframeHeight={iframeHeight}
                    iframeRef={iframeRef}
                    isLoadingEmbed={isLoadingEmbed}
                  />
                </>
              ) : (
                <Box sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
                    {t('portfolioProjects.demoUnavailable')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        ) : (
          <EmbeddedProjectPreview
            project={project}
            lang={lang}
            t={t}
            embedHtml={embedHtml}
            embedToken={embedToken}
            iframeHeight={iframeHeight}
            iframeRef={iframeRef}
            isLoadingEmbed={isLoadingEmbed}
          />
        )}
      </Container>
    </Box>
  );
}
