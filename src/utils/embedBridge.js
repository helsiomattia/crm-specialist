export const EMBED_CHANNEL = 'hm-crm-embed-v1';
export const MAX_EMBED_HEIGHT = 20000;
export const MAX_SCROLL_DELTA = 1200;

export function createEmbedToken() {
  return Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16).padStart(8, '0')).join('');
}

export function readEmbedMessage(event, frameWindow, token) {
  const data = event.data;
  if (!frameWindow || event.source !== frameWindow || event.origin !== 'null' || !token) return null;
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length !== 4) return null;
  if (data.channel !== EMBED_CHANNEL || data.token !== token) return null;
  if (data.type === 'height' && Number.isInteger(data.height) && data.height >= 1 && data.height <= MAX_EMBED_HEIGHT) {
    return { type: 'height', height: data.height };
  }
  if (data.type === 'scroll' && Number.isFinite(data.deltaY) && Math.abs(data.deltaY) <= MAX_SCROLL_DELTA) {
    return { type: 'scroll', deltaY: data.deltaY };
  }
  return null;
}

// Serialized into the isolated document; it never reads or executes code in the parent.
function runEmbedBridge({ channel, token, parentOrigin, maxHeight, maxDelta }) {
  let scheduled = false;
  function send(payload) { window.parent.postMessage({ channel, token, ...payload }, parentOrigin); }
  function measure() {
    scheduled = false;
    const { body, documentElement } = document;
    if (!body) return;
    const height = Math.ceil(Math.max(body.scrollHeight, body.offsetHeight, body.getBoundingClientRect().height, documentElement.offsetHeight));
    send({ type: 'height', height: Math.min(maxHeight, Math.max(1, height)) });
  }
  function scheduleMeasure() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(measure); }
  }
  function hasScrollableAncestor(target, delta) {
    for (let element = target instanceof Element ? target : target?.parentElement; element && element !== document.body && element !== document.documentElement; element = element.parentElement) {
      const overflow = getComputedStyle(element).overflowY;
      if (/auto|scroll/.test(overflow) && element.scrollHeight > element.clientHeight + 1) {
        if (delta < 0 ? element.scrollTop > 0 : element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true;
      }
    }
    return false;
  }
  document.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (hasScrollableAncestor(event.target, event.deltaY)) return;
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const deltaY = Math.max(-maxDelta, Math.min(maxDelta, event.deltaY * multiplier));
    if (!Number.isFinite(deltaY)) return;
    event.preventDefault();
    send({ type: 'scroll', deltaY });
  }, { passive: false });
  window.addEventListener('message', event => {
    const data = event.data;
    if (event.source !== window.parent || event.origin !== parentOrigin) return;
    if (data && data.channel === channel && data.token === token && data.type === 'measure' && Object.keys(data).length === 3) scheduleMeasure();
  });
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('load', scheduleMeasure);
  if (window.ResizeObserver) new ResizeObserver(scheduleMeasure).observe(document.body);
  document.fonts?.ready.then(scheduleMeasure);
  scheduleMeasure();
}

export function buildEmbedDocument(html, token, parentOrigin) {
  if (typeof html !== 'string' || !html.trim()) throw new Error('Empty embed document');
  const config = JSON.stringify({ channel: EMBED_CHANNEL, token, parentOrigin, maxHeight: MAX_EMBED_HEIGHT, maxDelta: MAX_SCROLL_DELTA }).replace(/</g, '\\u003c');
  const bridge = `<script>(${runEmbedBridge.toString()})(${config});</script>`;
  return /<\/body\s*>/i.test(html) ? html.replace(/<\/body\s*>/i, `${bridge}</body>`) : `${html}${bridge}`;
}
