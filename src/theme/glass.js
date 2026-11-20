import { alpha, darken } from '@mui/material/styles';
import { visualColors } from './tokens';

// Material only: these styles never set dimensions, spacing or typography.
export function glassSurface(kind = 'card', accent = visualColors.salesforceCore) {
  const floating = kind === 'floating';
  const dark = kind === 'dark';
  const panel = kind === 'panel';
  const solid = dark ? '#102D46' : '#F2F7FC';
  const opaque = {
    backgroundColor: solid,
    backgroundImage: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    borderColor: dark ? '#6D90AD' : '#819CB7',
  };
  return {
    backgroundColor: dark ? 'rgba(9,30,49,0.90)' : floating ? 'rgba(246,251,255,0.76)' : panel ? 'rgba(227,240,251,0.52)' : 'rgba(247,251,255,0.76)',
    backgroundImage: dark
      ? 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 48%, rgba(30,172,184,0.12))'
      : `linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.18) 48%, ${alpha(accent, panel ? 0.075 : 0.035)} 100%)`,
    borderColor: dark ? 'rgba(188,222,249,0.24)' : 'rgba(255,255,255,0.88)',
    boxShadow: dark
      ? '0 20px 52px rgba(6,24,39,0.18), inset 0 1px 0 rgba(255,255,255,0.16)'
      : `0 ${floating ? 12 : panel ? 18 : 8}px ${floating ? 36 : panel ? 48 : 24}px ${alpha('#173F6A', floating ? 0.14 : panel ? 0.09 : 0.065)}, inset 0 1px 0 rgba(255,255,255,0.98), inset 0 -1px 0 ${alpha(accent, 0.06)}`,
    // Nested cards use a translucent finish without a second blur/compositing layer.
    backdropFilter: kind === 'card' ? 'none' : floating ? 'var(--glass-floating-filter)' : 'var(--glass-panel-filter)',
    WebkitBackdropFilter: kind === 'card' ? 'none' : floating ? 'var(--glass-floating-filter)' : 'var(--glass-panel-filter)',
    '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': opaque,
    '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more)': opaque,
  };
}

// Preserve each accent hue while giving small labels a darker reading color.
export const glassInk = color => darken(color, 0.32);

export const glassPageGlow = 'radial-gradient(ellipse at 92% 12%, rgba(73,171,224,0.15), transparent 54%), radial-gradient(ellipse at 4% 85%, rgba(86,121,208,0.10), transparent 52%)';
