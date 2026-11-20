export const BASE_PATH = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
export const ABOUT_PROJECT_ROUTE = 'about-project';
export const REDIRECT_STORAGE_KEY = 'crm-specialist-redirect';
export const REDIRECT_QUERY_KEY = '__hm_route';
export const SECTION_IDS = ['home', 'about', 'experience', 'credentials', 'expertise', 'projects', 'contact'];

function sectionId(value) {
  const id = value === 'skills' ? 'expertise' : value;
  return SECTION_IDS.includes(id) ? id : null;
}

export function stripBasePath(pathname, basePath = BASE_PATH) {
  if (!basePath) return pathname;
  if (pathname === basePath) return '/';
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : null;
}

// Pure URL interpretation: no storage reads, safe under React StrictMode.
export function resolveRoute(location, basePath = BASE_PATH) {
  const home = { type: 'home', sectionId: 'home' };
  const relativePath = stripBasePath(location.pathname, basePath);
  if (relativePath === null) return home;
  let parts;
  let hash;
  try {
    parts = relativePath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).map(decodeURIComponent);
    hash = decodeURIComponent((location.hash || '').replace(/^#/, ''));
  } catch { return home; }
  if (parts.length === 2 && parts[0] === 'projects' && /^[a-z0-9-]+$/.test(parts[1])) {
    return { type: 'project', projectId: parts[1] };
  }
  if (parts.length === 1 && parts[0] === ABOUT_PROJECT_ROUTE) return { type: 'aboutProject' };
  if (parts.length === 1 && parts[0] === 'blog') return { type: 'blog' };
  if (parts.length === 2 && parts[0] === 'blog' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parts[1])) {
    return { type: 'blogArticle', slug: parts[1] };
  }
  if (parts.length > 1) return home;
  return { type: 'home', sectionId: sectionId(hash) || sectionId(parts[0]) || 'home' };
}

// Run before mounting React. Query transport works even when storage is blocked.
export function restoreRedirect(browser = window, basePath = BASE_PATH) {
  const current = new URL(browser.location.href);
  const forwarded = current.searchParams.get(REDIRECT_QUERY_KEY);
  let legacy;
  try {
    legacy = browser.sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    browser.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  } catch { /* Storage is optional; the 404 query transport is sufficient. */ }
  let target = null;
  if (forwarded !== null) {
    current.searchParams.delete(REDIRECT_QUERY_KEY);
    if (forwarded.startsWith('/') && !forwarded.startsWith('//') && !forwarded.includes('\\') && forwarded.length <= 8192) {
      const candidate = new URL(forwarded, current.origin);
      if (candidate.origin === current.origin && stripBasePath(candidate.pathname, basePath) !== null) target = candidate;
    }
    target ||= current;
  } else if (legacy && stripBasePath(current.pathname, basePath) === '/') {
    // Compatibility with tabs opened by an older 404.html.
    if (/^[a-z0-9/-]+$/i.test(legacy)) {
      target = new URL(`${basePath}/${legacy.replace(/^\/+/, '')}${current.search}${current.hash}`, current.origin);
    }
  }
  if (target) browser.history.replaceState(null, '', `${target.pathname}${target.search}${target.hash}`);
}

export function getAppRouteFromLocation(location = window.location) {
  return resolveRoute(location);
}

export function getSectionFromLocation(location = window.location) {
  return resolveRoute(location).sectionId || null;
}

export function getHomeUrl(search = window.location.search) {
  return `${BASE_PATH}/${search}`;
}

export function getSectionUrl(id, search = window.location.search) {
  const resolved = sectionId(id) || 'home';
  return `${BASE_PATH}/${resolved === 'home' ? '' : resolved}${search}`;
}

export function getProjectUrl(projectId, search = window.location.search) {
  return `${BASE_PATH}/projects/${encodeURIComponent(projectId)}${search}`;
}

export function getHomeProjectsUrl(search = window.location.search) {
  return getSectionUrl('projects', search);
}

export function getAboutProjectUrl(search = window.location.search) {
  return `${BASE_PATH}/${ABOUT_PROJECT_ROUTE}${search}`;
}

export function getBlogUrl(search = '') {
  return `${BASE_PATH}/blog${search}`;
}

export function getBlogArticleUrl(slug) {
  return `${BASE_PATH}/blog/${encodeURIComponent(slug)}`;
}

export function isPlainLeftClick(event) {
  return !event.defaultPrevented && (event.button === undefined || event.button === 0) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function navigateToUrl(url, { replace = false, notify = true } = {}) {
  const nextUrl = new URL(url, window.location.origin);
  if (nextUrl.origin !== window.location.origin || stripBasePath(nextUrl.pathname) === null) return false;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const nextRelativeUrl = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  if (currentUrl === nextRelativeUrl) return false;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', nextRelativeUrl);
  if (notify) window.dispatchEvent(new Event('popstate'));
  return true;
}
