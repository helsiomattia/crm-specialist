(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const themeButton = $('#theme-toggle');
  const storageKey = 'hm-audit-theme';
  let savedTheme;
  try { savedTheme = localStorage.getItem(storageKey); } catch { /* Leitura continua sem armazenamento. */ }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.textContent = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem(storageKey, theme); } catch { /* Preferência funciona apenas nesta página. */ }
  });

  const menu = $('#menu-toggle'), navigation = $('#navigation');
  menu.hidden = false;
  function closeMenu() {
    navigation.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    navigation.inert = window.innerWidth <= 800;
  }
  closeMenu();
  menu.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    navigation.inert = !open && window.innerWidth <= 800;
    menu.setAttribute('aria-expanded', String(open));
    if (open) navigation.querySelector('a').focus();
  });
  document.addEventListener('click', event => { if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menu.focus(); }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  const printButton = $('#print-page');
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());

  const filterGroup = $('.filters');
  if (filterGroup) {
    filterGroup.hidden = false;
    $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
      $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const filter = button.dataset.filter;
      let shown = 0;
      $$('.finding').forEach(item => { item.hidden = filter !== 'all' && item.dataset.priority !== filter; if (!item.hidden) shown++; });
      $('#finding-count').textContent = `${shown} achados exibidos.`;
    }));
  }

  const dialog = $('#search-dialog'), input = $('#search-input'), results = $('#search-results'), count = $('#search-count');
  const searchButton = $('#search-open');
  const entries = (window.AUDIT_SEARCH_INDEX || []).map(entry => ({ ...entry, normalized: normalize(`${entry.doc} ${entry.title} ${entry.text}`) }));
  let searchTimer;
  function search() {
    results.replaceChildren();
    const query = normalize(input.value.trim()), terms = query.split(/\s+/).filter(Boolean);
    if (!query) { count.textContent = 'Digite para buscar nos oito documentos.'; return; }
    const matches = entries.filter(entry => terms.every(term => entry.normalized.includes(term))).sort((a, b) => Number(normalize(b.title).includes(query)) - Number(normalize(a.title).includes(query)));
    const visible = matches.slice(0, 40);
    count.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'seção encontrada' : 'seções encontradas'}${matches.length > 40 ? ' · mostrando as primeiras 40' : ''}.` : 'Nenhum resultado. Tente outra palavra, como rotas, dados ou testes.';
    for (const entry of visible) {
      const link = document.createElement('a'); link.className = 'search-result'; link.href = entry.url;
      const label = document.createElement('span'); label.textContent = entry.doc;
      const title = document.createElement('strong'); title.textContent = entry.title;
      const snippet = document.createElement('p');
      const at = Math.max(0, normalize(entry.text).indexOf(terms[0]));
      const start = Math.max(0, at - 65);
      snippet.textContent = `${start ? '…' : ''}${entry.text.slice(start, start + 220)}${entry.text.length > start + 220 ? '…' : ''}`;
      link.append(label, title, snippet);
      link.addEventListener('click', () => dialog.close());
      results.append(link);
    }
  }
  function openSearch() { closeMenu(); if (!dialog.open) dialog.showModal(); input.focus(); search(); }
  if (typeof dialog.showModal === 'function') {
    searchButton.hidden = false;
    searchButton.addEventListener('click', openSearch);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dialog.open) { event.preventDefault(); dialog.close(); searchButton.focus(); return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    });
    input.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(search, 100); });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  }

  let noticeTimer;
  function notify(message) { $('#notice').textContent = message; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { $('#notice').textContent = ''; }, 3500); }
  $$('.copy-code').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const code = button.closest('.code-block').querySelector('pre code');
      try {
        if (!navigator.clipboard) throw new Error('Clipboard indisponível');
        await navigator.clipboard.writeText(code.textContent);
        notify('Código copiado.');
      } catch {
        const selection = window.getSelection(), range = document.createRange();
        range.selectNodeContents(code); selection.removeAllRanges(); selection.addRange(range);
        notify('Código selecionado. Use Ctrl+C para copiar.');
      }
    });
  });

  const tocLinks = $$('.toc nav a');
  const headings = $$('.prose h2');
  const tocDetails = $('.toc details');
  if (tocDetails && window.innerWidth <= 1240) tocDetails.open = false;
  let scheduled = false;
  function updateReading() {
    scheduled = false;
    const remaining = document.documentElement.scrollHeight - window.innerHeight;
    $('#reading-progress').style.width = `${remaining > 0 ? Math.min(100, Math.max(0, window.scrollY / remaining * 100)) : 100}%`;
    let active;
    for (const heading of headings) { if (heading.getBoundingClientRect().top <= 160) active = heading.id; }
    tocLinks.forEach(link => {
      if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleReading() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); } }
  window.addEventListener('scroll', scheduleReading, { passive: true });
  window.addEventListener('resize', scheduleReading);
  window.addEventListener('load', scheduleReading);
  updateReading();
})();
