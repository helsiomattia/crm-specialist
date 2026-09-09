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

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
const DEFAULT_IFRAME_HEIGHT = 640;
const PROJECT_EMBED_LOADERS = {
  'crm-customer-360': () => import('../../../projects/customer360_generico_interativo_v4.html?raw'),
  'service-cloud-console': () => import('../../../projects/Service360_Generic_Embed_V2.html?raw'),
  'customer-journey-360': () => import('../../../projects/Customer_Journey_360_Generic.html?raw'),
  'intelligence-360': () => import('../../../projects/Intelligence360_Generic.html?raw'),
  'revenue-churn-intelligence': () => import('../../../projects/Revenue_Churn_Intelligence_Generic.html?raw'),
  'salesforce-architecture-control-center': () => import('../../../projects/Salesforce_Architecture_Control_Center_Generic.html?raw'),
  'lwc-enterprise-integration-reliability-hub': () => import('../../../projects/lwc/enterprise-integration-reliability-hub-preview.html?raw'),
  'lwc-deal-governance-center': () => import('../../../projects/lwc/deal-governance-center-preview.html?raw'),
  'lwc-customer-relationship-graph': () => import('../../../projects/lwc/customer-relationship-graph-preview.html?raw'),
  'lwc-customer-data-quality-center': () => import('../../../projects/lwc/customer-data-quality-center-preview.html?raw'),
  'lwc-lead-account-routing-studio': () => import('../../../projects/lwc/lead-account-routing-studio-preview.html?raw'),
  'lwc-intelligent-workload-routing-studio': () => import('../../../projects/lwc/intelligent-workload-routing-studio-preview.html?raw'),
  'lwc-omni-transfer-intelligence': () => import('../../../projects/lwc/omni-transfer-intelligence-preview.html?raw'),
  'lwc-pipeline-risk-inspector': () => import('../../../projects/lwc/pipeline-risk-inspector-preview.html?raw'),
  'lwc-sla-escalation-control-tower': () => import('../../../projects/lwc/sla-escalation-control-tower-preview.html?raw'),
  'lwc-unified-interaction-timeline': () => import('../../../projects/lwc/unified-interaction-timeline-preview.html?raw'),
};

function getHomeProjectsPath() {
  return `${BASE_PATH || ''}/projects${window.location.search}`;
}

function LwcDemoMenu({ demos, activeDemo, lang, onSelect }) {
  return (
    <Box
      component="nav"
      aria-label="Demonstrações LWC"
      sx={{
        bgcolor: visualColors.commandNavy,
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

function EmbeddedProjectPreview({ project, lang, t, embedHtml, iframeHeight, iframeRef, isLoadingEmbed }) {
  return (
    <Paper
      className="embedded-html-view"
      elevation={0}
      sx={{
        borderRadius: { xs: '20px', md: '28px' },
        border: `1px solid ${alpha(project.accent, 0.24)}`,
        bgcolor: 'rgba(255,255,255,0.88)',
        boxShadow: `0 24px 80px ${alpha(visualColors.commandNavy, 0.12)}`,
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
          ref={iframeRef}
          title={`${getLocalizedString(project.title, lang)} preview`}
          srcDoc={embedHtml}
          sandbox="allow-scripts allow-same-origin"
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
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);

  useEffect(() => {
    if (!previewProject || previewProject.kind !== 'embed') {
      setEmbedHtml('');
      setIsLoadingEmbed(false);
      return undefined;
    }

    const loadEmbed = PROJECT_EMBED_LOADERS[previewProject.id];
    if (!loadEmbed) {
      setEmbedHtml('');
      return undefined;
    }

    let cancelled = false;
    setIsLoadingEmbed(true);
    setEmbedHtml('');

    loadEmbed()
      .then((module) => {
        if (!cancelled) setEmbedHtml(module.default || '');
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

    if (!iframe || !embedHtml) return undefined;

    let animationFrameId = 0;
    let resizeObserver;
    let observedFrameWindow;
    let observedFrameDocument;

    const getFrameDocument = () => {
      try {
        return iframe.contentDocument || iframe.contentWindow?.document || null;
      } catch {
        return null;
      }
    };

    const syncIframeHeight = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(() => {
        const frameDocument = getFrameDocument();
        const { body, documentElement } = frameDocument || {};

        if (!body || !documentElement) return;

        const nextHeight = Math.ceil(
          Math.max(
            body.scrollHeight,
            body.offsetHeight,
            body.getBoundingClientRect().height,
            documentElement.offsetHeight,
          ),
        );
        const safeHeight = Math.max(nextHeight, 1);

        setIframeHeight((currentHeight) => (
          Math.abs(currentHeight - safeHeight) > 1 ? safeHeight : currentHeight
        ));
      });
    };

    const handleFrameWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      window.scrollBy({ top: event.deltaY, behavior: 'auto' });
    };

    const setupHeightObserver = () => {
      const frameDocument = getFrameDocument();
      const { body, documentElement, defaultView } = frameDocument || {};

      if (!body || !documentElement) return;

      resizeObserver?.disconnect();
      observedFrameWindow?.removeEventListener('resize', syncIframeHeight);
      observedFrameDocument?.removeEventListener('wheel', handleFrameWheel);

      const ResizeObserverConstructor = defaultView?.ResizeObserver || window.ResizeObserver;
      if (!ResizeObserverConstructor) {
        syncIframeHeight();
      } else {
        resizeObserver = new ResizeObserverConstructor(syncIframeHeight);
        resizeObserver.observe(body);
      }

      observedFrameWindow = defaultView;
      observedFrameDocument = frameDocument;
      observedFrameWindow?.addEventListener('resize', syncIframeHeight);
      observedFrameDocument.addEventListener('wheel', handleFrameWheel, { passive: false });
      syncIframeHeight();
    };

    setIframeHeight(DEFAULT_IFRAME_HEIGHT);
    iframe.addEventListener('load', setupHeightObserver);
    window.addEventListener('resize', syncIframeHeight);
    setupHeightObserver();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      iframe.removeEventListener('load', setupHeightObserver);
      window.removeEventListener('resize', syncIframeHeight);
      observedFrameWindow?.removeEventListener('resize', syncIframeHeight);
      observedFrameDocument?.removeEventListener('wheel', handleFrameWheel);
      resizeObserver?.disconnect();
    };
  }, [embedHtml]);

  if (!project) {
    return (
      <Box component="main" sx={{ minHeight: '100dvh', pt: 'calc(var(--header-height) + 48px)', pb: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'rgba(224,236,245,0.9)' }}>
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
        background: 'linear-gradient(180deg, var(--site-bg-start) 0%, var(--site-bg-mid) 100%)',
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
            iframeHeight={iframeHeight}
            iframeRef={iframeRef}
            isLoadingEmbed={isLoadingEmbed}
          />
        )}
      </Container>
    </Box>
  );
}
