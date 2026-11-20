import {
  Box,
  Typography,
  alpha,
} from '@mui/material';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { profile } from '../../data/profile';
import { visualColors, visualGradients } from '../../theme/tokens';
import { glassSurface } from '../../theme/glass';
import { scrollToSection } from '../../utils/scrollToSection';
import { getHomeUrl as getHomePath, getBlogUrl, isPlainLeftClick, navigateToUrl } from '../../utils/routes';

export default function Navbar({ activePage }) {
  const { t } = useTranslation();
  return (
    <Box
      component="nav"
      aria-label="HM.crm"
      sx={{
        position: 'fixed',
        zIndex: 1200,
        left: { xs: 12, md: 16 },
        top: { xs: 12, md: '50%' },
        transform: { xs: 'none', md: 'translateY(-50%)' },
        width: { xs: 'auto', md: 58 },
        p: { xs: 0.7, md: 0.8 },
        borderRadius: { xs: '999px', md: '22px' },
        border: `1px solid ${alpha(visualColors.commandNavy, 0.14)}`,
        ...glassSurface('floating'),
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: 'center',
        gap: { xs: 0.85, md: 1 },
      }}
    >
      <Box
        component="a"
        href={getHomePath()}
        onClick={(event) => {
          if (!isPlainLeftClick(event)) return;
          event.preventDefault();
          navigateToUrl(getHomePath());
          scrollToSection('home', { duration: 0.38 });
        }}
        aria-label="Ir para o início"
        sx={{
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'grid',
          placeItems: 'center',
          width: 40,
          height: 40,
          borderRadius: { xs: '999px', md: '15px' },
          background: visualGradients.crmFlow,
          color: visualColors.surfaceWhite,
          boxShadow: `0 10px 24px ${alpha(visualColors.salesforceCore, 0.2)}`,
          flexShrink: 0,
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 14px 30px ${alpha(visualColors.salesforceCore, 0.24)}`,
          },
          '&:focus-visible': {
            outline: `3px solid ${alpha(visualColors.salesforceCore, 0.26)}`,
            outlineOffset: 3,
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '0.78rem',
            fontWeight: 850,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          {profile.initials}
        </Typography>
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 2,
          height: 28,
          borderRadius: 999,
          background: `linear-gradient(180deg, ${alpha(visualColors.commandNavy, 0.16)}, ${alpha(visualColors.flowCyan, 0.52)})`,
        }}
      />

      <LanguageSwitcher orientation="horizontal" sx={{ display: { xs: 'flex', md: 'none' } }} />
      <LanguageSwitcher orientation="vertical" sx={{ display: { xs: 'none', md: 'flex' } }} />
      <Box
        component="a"
        href={getBlogUrl()}
        aria-current={activePage === 'blog' ? 'page' : undefined}
        onClick={event => {
          if (!isPlainLeftClick(event)) return;
          event.preventDefault();
          navigateToUrl(getBlogUrl());
        }}
        sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 0.5, alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: { xs: 60, md: 40 }, px: { xs: 0.5, md: 0 }, borderRadius: '12px', color: 'primary.main', bgcolor: activePage === 'blog' ? 'rgba(13,77,165,0.12)' : 'transparent', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 750, '&:hover': { bgcolor: 'rgba(13,77,165,0.1)' }, '&:focus-visible': { outline: '3px solid #0D4DA5', outlineOffset: 2 } }}
      >
        <MenuBookRoundedIcon sx={{ fontSize: 19 }} />
        {t('nav.blog')}
      </Box>
    </Box>
  );
}
