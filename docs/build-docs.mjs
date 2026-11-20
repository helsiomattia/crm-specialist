import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const documents = [
  { file: 'PRD', title: 'PRD', subtitle: 'Produto e requisitos', category: 'Produto', description: 'Objetivos, público, escopo, critérios de aceite e registro consolidado de achados.' },
  { file: 'DESIGN_STYLE', title: 'Design Style', subtitle: 'Identidade e interface', category: 'Experiência', description: 'Paleta, tipografia, componentes, movimento e critérios de acessibilidade.' },
  { file: 'ARCHITECTURE', title: 'Architecture', subtitle: 'Estrutura e execução', category: 'Engenharia', description: 'Stack, camadas, carregamento, rotas, build e publicação.' },
  { file: 'DATABASE', title: 'Database', subtitle: 'Dados e persistência', category: 'Engenharia', description: 'Arquivos de conteúdo, contratos, relações e armazenamento no navegador.' },
  { file: 'SECURITY', title: 'Security', subtitle: 'Segurança e confiança', category: 'Engenharia', description: 'Isolamento das demos, dependências e limites da avaliação de segurança.' },
  { file: 'CODE_STYLE', title: 'Code Style', subtitle: 'Convenções e manutenção', category: 'Engenharia', description: 'Organização do código, React, tradução e fluxo para novos projetos.' },
  { file: 'TESTING', title: 'Testing', subtitle: 'Verificação e qualidade', category: 'Operação', description: 'Resultados executados, falhas reproduzidas e plano de testes.' },
  { file: 'AGENTS', title: 'Agents', subtitle: 'Guia para agentes', category: 'Operação', description: 'Contexto, instruções de manutenção e critérios de conclusão.' },
];
const supplements = [
  { file: 'STABILIZATION_REPORT', title: 'Estabilização', subtitle: 'Correções e evidências', category: 'Operação', description: 'Resultado da correção de rotas, sandbox, testes, pipeline e dependências, com comparação visual e limites explícitos.' },
  { file: 'GLASS_VISUAL_REVIEW', title: 'Revisão visual', subtitle: 'Glassmorphism e validação', category: 'Experiência', description: 'Material visual, preservação de conteúdo e geometria, comparação em três larguras e validação local.' },
  { file: 'BLOG', title: 'Blog', subtitle: 'Artigos e publicação', category: 'Operação', description: 'Como criar artigos em Markdown, preencher os metadados, revisar rascunhos e publicar pelo fluxo existente.' },
];
const findings = [
  ['A-01', 'P1', 'Redirecionamento consumido antes da seção', 'Corrigido: parser único, bootstrap e histórico testados.', 'ARCHITECTURE'],
  ['A-02', 'P1', 'Isolamento dos embeds insuficiente', 'Corrigido: origem opaca, protocolo limitado e 16 demos verificadas.', 'SECURITY'],
  ['A-03', 'P1', 'Smoke test desatualizado', 'Corrigido: validações reais, 29 unitários e suíte de navegador.', 'TESTING'],
  ['A-04', 'P1', 'CI sem gates de testes', 'Corrigido na configuração: publicação depende dos gates; execução remota pendente.', 'TESTING'],
  ['A-05', 'P2', 'Idioma do HTML não acompanha a interface', 'Sincronizar o atributo lang ao trocar idioma.', 'DESIGN_STYLE'],
  ['A-06', 'P2', 'Intercepção de rolagem e teclado', 'Validar conteúdo longo, foco e interação de demos.', 'DESIGN_STYLE'],
  ['A-07', 'P2', 'Otimizador sem dependência declarada', 'Declarar sharp e tornar a geração reproduzível.', 'CODE_STYLE'],
  ['A-08', 'P2', 'Instruções antigas para cadastrar embeds', 'Atualizado: catálogo e mapa de loaders documentados.', 'DATABASE'],
  ['A-09', 'P2', 'Sitemap sem coleção LWC', 'Definir indexação da coleção e dos dez previews.', 'PRD'],
  ['A-10', 'P2', 'Whitespace no baseline', 'Corrigido no verificador: quebra Markdown intencional preservada.', 'TESTING'],
  ['A-11', 'P1', 'Dependências de tooling sinalizadas', 'Corrigido: Vite 6.4.6 e transitivas; auditoria online com zero alertas.', 'SECURITY'],
];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = value => value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*#]/g, '').trim();

function inline(source) {
  const fragments = [];
  const stash = html => `\u0000${fragments.push(html) - 1}\u0000`;
  let text = source.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escape(code)}</code>`));
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawUrl) => {
    if (/^(?:javascript|data|vbscript):/i.test(rawUrl)) throw new Error('Unsupported link scheme');
    const url = [...documents, ...supplements].some(d => `${d.file}.md` === rawUrl) ? rawUrl.replace(/\.md$/, '.html') : rawUrl;
    return stash(`<a href="${escape(url)}">${escape(label)}</a>`);
  });
  text = escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => fragments[Number(i)]);
}

function markdown(source) {
  const lines = source.replace(/\r/g, '').split('\n');
  const html = [], headings = [], sections = [];
  const ids = new Set();
  let section = { title: 'Visão geral', id: 'document-title', text: '' };
  sections.push(section);
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim() || /^# /.test(line)) { i++; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
      i++;
      html.push(`<div class="code-block"><div class="code-toolbar"><span>${escape(language || 'texto')}</span><button type="button" class="copy-code" hidden>Copiar código</button></div><pre><code>${escape(code.join('\n'))}</code></pre></div>`);
      section.text += ` ${code.join(' ')}`;
      continue;
    }
    const heading = line.match(/^(#{2,3}) (.+)$/);
    if (heading) {
      const baseId = slug(clean(heading[2]));
      let id = baseId, number = 2;
      while (ids.has(id)) id = `${baseId}-${number++}`;
      ids.add(id);
      const level = heading[1].length;
      headings.push({ level, id, title: clean(heading[2]) });
      html.push(`<h${level} id="${id}" tabindex="-1">${inline(heading[2])}<a class="heading-anchor" href="#${id}" aria-label="Link para ${escape(clean(heading[2]))}">#</a></h${level}>`);
      section = { title: clean(heading[2]), id, text: '' };
      sections.push(section);
      i++; continue;
    }
    if (line.startsWith('> ')) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith('> ')) quote.push(lines[i++].slice(2));
      html.push(`<blockquote>${inline(quote.join(' '))}</blockquote>`);
      section.text += ` ${quote.join(' ')}`;
      continue;
    }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++].split('|').slice(1, -1).map(v => v.trim()));
      const [header, , ...body] = rows;
      html.push(`<div class="table-wrap" tabindex="0" role="region" aria-label="Tabela: ${escape(section.title)}"><table><thead><tr>${header.map(c => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr>${row.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      section.text += ` ${rows.flat().join(' ')}`;
      continue;
    }
    if (/^(?:- |\d+\. )/.test(line)) {
      const ordered = /^\d+\./.test(line), tag = ordered ? 'ol' : 'ul';
      const items = [];
      while (i < lines.length && (ordered ? /^\d+\. / : /^- /).test(lines[i])) {
        const item = lines[i++].replace(/^(?:- |\d+\. )/, '');
        section.text += ` ${item}`;
        items.push(/^\[ \] /.test(item) ? `<li class="check-item"><span class="check-box" aria-hidden="true"></span><span><span class="sr-only">Pendente: </span>${inline(item.slice(4))}</span></li>` : `<li>${inline(item)}</li>`);
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^(?:#|>|\||```|- |\d+\. )/.test(lines[i])) paragraph.push(lines[i++]);
    if (!paragraph.length) throw new Error(`Unsupported Markdown: ${lines[i]}`);
    html.push(`<p>${inline(paragraph.join(' '))}</p>`);
    section.text += ` ${paragraph.join(' ')}`;
  }
  return { html: html.join('\n'), headings, sections };
}

function shell(title, active, content, toc = '') {
  return `<!doctype html>
<html lang="pt-BR" data-theme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="description" content="Auditoria técnica e de produto do portfólio HM.crm, baseada no código do projeto."><title>${escape(title)} · Auditoria HM.crm</title><link rel="stylesheet" href="assets/audit.css"><script src="assets/search-index.js" defer></script><script src="assets/audit.js" defer></script></head>
<body>
<a class="skip-link" href="#main">Pular para o conteúdo</a>
<aside class="sidebar" id="navigation"><a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">HM<span>·</span></span><span>HM.crm<small>Documentação do projeto</small></span></a><p class="nav-label">Auditoria técnica</p><nav aria-label="Documentos"><a class="nav-overview${active === 'index' ? ' active' : ''}" ${active === 'index' ? 'aria-current="page"' : ''} href="index.html">Visão geral</a><div class="nav-divider"></div>${documents.map(d => `<a href="${d.file}.html" class="nav-document${active === d.file ? ' active' : ''}" ${active === d.file ? 'aria-current="page"' : ''}><span>${d.title}</span><small>${d.subtitle}</small></a>`).join('')}</nav><div class="sidebar-foot"><span class="version-label">SNAPSHOT DO CÓDIGO</span><strong>cc01bc8</strong><span>20 novembro 2026</span><small>Arquivos locais · PT-BR</small></div></aside>
<div class="page-shell"><header class="topbar"><div class="breadcrumb"><button id="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" hidden>Menu</button><a href="index.html">Auditoria</a><span aria-hidden="true">/</span><span>${escape(title)}</span></div><div class="topbar-actions"><button id="search-open" type="button" hidden>Buscar <kbd>Ctrl K</kbd></button><button id="theme-toggle" type="button" aria-pressed="false" hidden>Tema escuro</button><button id="print-page" type="button" hidden>Imprimir</button></div></header><div class="reading-track" aria-hidden="true"><span id="reading-progress"></span></div><main id="main" tabindex="-1" class="${toc ? 'document-layout' : 'overview-layout'}">${content}${toc}</main><footer class="page-footer"><span>HM.crm · Auditoria de 20/11/2026</span><span>Auditoria histórica e correções verificadas localmente.</span><a href="#main">Voltar ao início</a></footer></div>
<dialog id="search-dialog" aria-labelledby="search-title"><form method="dialog" class="search-top"><h2 id="search-title">Buscar na auditoria</h2><button aria-label="Fechar busca">Fechar</button></form><label class="sr-only" for="search-input">Pesquisar na documentação</label><input id="search-input" type="search" placeholder="Rotas, sandbox, dados, testes…" autocomplete="off"><p id="search-count" role="status">Digite para buscar na documentação.</p><div id="search-results"></div><p class="search-hint">Busca local · use Tab para percorrer os resultados · Esc fecha</p></dialog><div id="notice" class="notice" role="status" aria-live="polite"></div>
<noscript><p class="noscript">A leitura e os links funcionam sem JavaScript. Ative-o para usar busca, filtros e alternância de tema.</p></noscript>
</body></html>\n`;
}

const indexContent = `<section class="overview-hero"><div><p class="eyebrow">HM.crm / Portfólio profissional</p><h1 id="document-title">O projeto,<br><span>por dentro.</span></h1><p class="hero-lead">Uma auditoria de produto e engenharia, organizada em oito documentos. Entenda o que existe, o que foi verificado e o que precisa evoluir.</p><div class="hero-links"><a class="primary-link" href="PRD.html">Ler a visão de produto</a><a class="text-link" href="STABILIZATION_REPORT.html">Relatório de estabilização</a></div><p class="snapshot">20/11/2026 <span>·</span> Commit <code>cc01bc8</code> <span>·</span> React + Vite</p></div><aside class="verdict"><span class="eyebrow">Leitura do cenário</span><h2>Correções verificadas.<br> Validação local.</h2><p>Portfólio multilíngue com demonstrações locais. Sem backend ou banco de dados.</p><dl><div><dt>Build de produção</dt><dd class="status success">Aprovado</dd></div><div><dt>Smoke e formato</dt><dd class="status success">Aprovados</dd></div><div><dt>Dependências · árvore completa</dt><dd class="status success">0 alertas</dd></div></dl><a href="SECURITY.html">Consultar contexto de segurança</a></aside></section>
<section class="metrics" aria-label="Escopo verificado"><div><strong>08</strong><span>documentos completos</span></div><div><strong>16</strong><span>demos com loaders válidos</span></div><div><strong>03</strong><span>idiomas · 103 chaves cada</span></div><div><strong>11</strong><span>achados na auditoria original</span></div></section>
<section class="library" aria-labelledby="library-title"><div class="section-intro"><div><p class="eyebrow">Biblioteca da auditoria</p><h2 id="library-title">Escolha um ponto de entrada.</h2></div><p>Conteúdo completo em HTML.<br>Markdown disponível em cada documento.</p></div><div class="doc-grid">${documents.map(d => `<a class="doc-card" href="${d.file}.html"><span class="doc-category">${d.category}</span><h3>${d.title}</h3><p>${d.description}</p><span class="card-footer">${d.subtitle}<span class="format-label">HTML + MD</span></span></a>`).join('')}</div></section>
<section class="findings" aria-labelledby="findings-title"><div class="section-intro"><div><p class="eyebrow">Registro dos achados</p><h2 id="findings-title">Histórico e situação atual.</h2></div><div class="filters" role="group" aria-label="Filtrar achados por prioridade" hidden><button type="button" data-filter="all" aria-pressed="true">Todos · 11</button><button type="button" data-filter="P1" aria-pressed="false">P1 · 5</button><button type="button" data-filter="P2" aria-pressed="false">P2 · 6</button></div></div><p class="section-note">Prioridades da auditoria original. A-01, A-02, A-03, A-04 e A-11 foram corrigidos localmente; A-08 e A-10 também foram tratados. Consulte o relatório de estabilização para evidências, limites e pendências.</p><p id="finding-count" class="sr-only" role="status">11 achados exibidos.</p><div class="finding-list">${findings.map(([id, priority, title, action, file]) => `<article class="finding" data-priority="${priority}"><span class="finding-id">${id}</span><span class="priority ${priority.toLowerCase()}">${priority}</span><div><h3><a href="${file}.html">${title}</a></h3><p>${action}</p></div></article>`).join('')}</div></section>
<section class="method"><div><p class="eyebrow">Como interpretar</p><h2>Clareza sobre a evidência.</h2><p>A auditoria descreve o checkout local e verificações datadas. Publicação remota, métricas reais e validação completa de acessibilidade têm limites explícitos nos documentos.</p></div><dl><div><dt>Observado</dt><dd>Estrutura e comportamento presentes no código.</dd></div><div><dt>Verificado</dt><dd>Resultado de comando ou simulação executada.</dd></div><div><dt>Recomendado</dt><dd>Proposta de evolução ainda não implementada.</dd></div><div><dt>Não verificado</dt><dd>Depende de medição ou validação adicional.</dd></div></dl></section>`;

await mkdir(path.join(root, 'assets'), { recursive: true });
const searchIndex = [];
for (const [index, doc] of [...documents, ...supplements].entries()) {
  const source = await readFile(path.join(root, `${doc.file}.md`), 'utf8');
  const rendered = markdown(source);
  const words = source.split(/\s+/).length;
  const previous = documents[index - 1], next = documents[index + 1];
  const content = `<div class="document-main"><header class="document-header"><p class="eyebrow">${doc.category} / ${doc.subtitle}</p><h1 id="document-title">${doc.title}</h1><p class="document-lead">${doc.description}</p><div class="document-meta"><span>20/11/2026</span><span>${Math.max(1, Math.ceil(words / 200))} min de leitura</span><a href="${doc.file}.md" download>Baixar Markdown</a></div></header><article class="prose" aria-label="${escape(doc.title)} completo">${rendered.html}</article><nav class="document-pagination" aria-label="Próximo documento">${previous ? `<a href="${previous.file}.html"><small>Anterior</small>${previous.title}</a>` : '<a href="index.html"><small>Início</small>Visão geral</a>'}${next ? `<a href="${next.file}.html"><small>Próximo</small>${next.title}</a>` : '<a href="index.html"><small>Biblioteca</small>Visão geral</a>'}</nav></div>`;
  const toc = `<aside class="toc"><details open><summary>Neste documento</summary><nav aria-label="Índice do documento">${rendered.headings.filter(h => h.level === 2).map(h => `<a href="#${h.id}">${escape(h.title)}</a>`).join('')}</nav></details><a class="toc-source" href="${doc.file}.md" download>Versão Markdown</a><p>Base histórica: <code>cc01bc8</code><br>Correções locais em 20/11/2026</p></aside>`;
  await writeFile(path.join(root, `${doc.file}.html`), shell(doc.title, doc.file, content, toc));
  searchIndex.push(...rendered.sections.filter(s => s.text.trim()).map(s => ({ doc: doc.title, title: s.title, url: `${doc.file}.html#${s.id}`, text: clean(s.text).replace(/\s+/g, ' ').trim() })));
}
await writeFile(path.join(root, 'index.html'), shell('Visão geral', 'index', indexContent));
await writeFile(path.join(root, 'assets/search-index.js'), `window.AUDIT_SEARCH_INDEX = ${JSON.stringify(searchIndex).replace(/</g, '\\u003c')};\n`);
console.log(`Gerados ${documents.length} documentos e ${supplements.length} relatório HTML, índice e ${searchIndex.length} seções pesquisáveis.`);
