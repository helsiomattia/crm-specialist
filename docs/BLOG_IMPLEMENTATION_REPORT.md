# Blog profissional HM.crm — Relatório de implementação

> Entrega local de 20/11/2026. Escopo: missão do Blog profissional enviada em anexo. Nenhum commit, push, deploy ou publicação externa foi executado.

## 1. Resultado executivo

O Blog foi ampliado para uma biblioteca editorial integrada à aplicação existente: seis categorias, nove séries, filtros, busca no corpo dos textos, paginação, leitura com índice, referências e navegação contextual. Foram escritos 18 artigos originais completos em português e estruturadas 60 pautas adicionais, com recortes e roteiros próprios.

Os 18 textos somam 19.480 palavras extraídas do Markdown, entre 1.024 e 1.129 por artigo. Permanecem em `ready`, com revisão técnica e de confidencialidade registrada e revisão final do autor pendente. `publishedAt` é nulo em todos eles. Não foram inventados histórico de publicação, experiências pessoais, certificações, clientes, resultados ou implantações.

Para ver a biblioteca preenchida, execute `npm run blog:preview` e abra `http://127.0.0.1:5173/blog`. A prévia local é identificada e não pode ser exportada como build editorial. O build público contém somente conteúdo aprovado; neste estado, exibe a estrutura editorial e seus estados vazios. O [guia de manutenção](BLOG.md) explica como revisar e liberar cada artigo.

## 2. Diagnóstico e arquitetura adotada

O checkout inicial estava limpo. A aplicação já tinha React 18, Vite 6, MUI, Emotion, GSAP e i18next, um Blog inicial sem artigos publicados, renderização Markdown e rotas centralizadas. O conteúdo original do Blog era apenas um modelo ignorado pelo catálogo. O baseline passou em validação de dados, lint, formato, smoke, 34 testes unitários, build e 57 verificações de navegação.

As auditorias antigas foram tratadas como histórico. Perfil, experiência, competências e credenciais do código atual orientaram o posicionamento editorial; os novos textos usam o nome do autor e os temas já sustentados pelo portfólio, sem acrescentar uma nova biografia factual. Os currículos e seus componentes de download foram preservados byte a byte. A tentativa adicional de extração de texto dos PDFs não pôde ser executada porque este ambiente não possui Python/Poppler disponíveis; nenhuma nova afirmação biográfica depende dessa extração.

O conteúdo continua versionado em Markdown e JSON. O plugin Vite descobre artigos, valida metadados e relações, seleciona os publicáveis e produz o módulo virtual usado pela interface. O texto de busca é limitado aos artigos disponíveis no ambiente; o Markdown integral continua carregado sob demanda. Não foi criado backend, banco, CMS, autenticação ou integração remota.

O build também gera HTML estático para o Blog, suas coleções e os artigos aprovados. Foi necessário porque alterar somente metatags após a execução do JavaScript não disponibilizava o corpo completo a clientes sem JavaScript. O mesmo renderizador Markdown seguro atende aos dois caminhos. A Home permanece com sua arquitetura original; a geração estática se limita ao Blog.

## 3. Arquivos criados e alterados

| Grupo | Arquivos principais e finalidade |
| --- | --- |
| Conteúdo novo | 18 pastas em `content/blog/`, cada uma com `article.md` e `metadata.json` |
| Planejamento | `content/editorial/taxonomy.json`, `backlog.json` e `STRATEGY.md` |
| Interface | `BlogPage.jsx`, `BlogArticlePage.jsx`, `BlogLayout.jsx`, novos `BlogCards.jsx` e `BlogSeo.jsx` |
| Regras compartilhadas | `src/utils/blog.js`, novos `blog-markdown.js` e `blog-seo.js` |
| Build | `scripts/lib/blog-content.mjs` e novo `blog-prerender.mjs` |
| Operação editorial | `create-blog-post.mjs`, novos `publish-blog-post.mjs` e `validate-editorial.mjs`, modelo e README do conteúdo |
| Integração existente | `src/utils/routes.js`, seleção das páginas do Blog em `src/App.jsx` e chaves `blog` de PT/EN/ES |
| Manifesto | Scripts `blog:preview`, `blog:publish`, `blog:validate`; declaração direta de `unified` e `remark-parse`, já presentes como transitivas |
| Testes | `tests/blog.test.mjs`, `tests/routes.test.mjs`, `tests/helpers/blog-fixture.mjs`, `scripts/blog-browser-test.mjs` e validação de dados |
| Documentação | Guia e relatório do Blog, notas atuais nos documentos técnicos, HTML e índice de busca regenerados |
| Evidências | `audit/editorial-blog/`: baseline, inventário, preservação, testes, capturas e verificação final |

Nenhuma versão de pacote preexistente foi atualizada para essa funcionalidade. As dependências adicionais declaradas são `unified` 11.0.5 e `remark-parse` 11.0.0, usadas diretamente para interpretar a árvore Markdown, gerar índice e contar o conteúdo.

## 4. Categorias e séries

| Categoria | Slug | Artigos completos | Pautas |
| --- | --- | --- | --- |
| Salesforce & CRM | `salesforce` | 3 | 10 |
| Gestão & Liderança | `gestao` | 3 | 10 |
| Processos & Operações | `processos` | 3 | 10 |
| Ideias & Projetos | `ideias` | 3 | 10 |
| Inovação & Inteligência Artificial | `inovacao` | 3 | 10 |
| Administração & Estratégia Empresarial | `administracao` | 3 | 10 |

Cada categoria possui nomes, descrição e introdução PT/EN/ES, inventário de assuntos, tags, destaque e listagem filtrável. O inventário de assuntos permanece identificado como português, com termos técnicos preservados. As séries conectam artigos entre categorias, com ordem explícita e navegação anterior/próxima.

As nove séries são Arquitetura Salesforce na prática; Service Cloud e operações; Da necessidade de negócio à solução; Gestão de processos empresariais; Decisões de arquitetura e trade-offs; Inteligência artificial com responsabilidade; Administração orientada a dados; Laboratório de ideias e protótipos; Evolução de carreira e liderança técnica. O [plano editorial](../content/editorial/STRATEGY.md) descreve as sequências e expansões propostas.

## 5. Os 18 artigos completos

| ID | Artigo | Palavras |
| --- | --- | --- |
| HM-001 | [Salesforce não é apenas um CRM: é parte da arquitetura operacional de uma empresa.](../content/blog/salesforce-arquitetura-operacional/article.md) | 1.099 |
| HM-002 | [O que existe por trás de um atendimento omnichannel bem estruturado.](../content/blog/atendimento-omnichannel/article.md) | 1.082 |
| HM-003 | [Flow, Apex ou LWC? Como decidir sem criar complexidade desnecessária.](../content/blog/flow-apex-lwc/article.md) | 1.024 |
| HM-004 | [Tecnologia não entrega valor sozinha: a importância de entender o negócio.](../content/blog/tecnologia-valor-negocio/article.md) | 1.032 |
| HM-005 | [Como priorizar projetos quando tudo parece urgente.](../content/blog/priorizar-projetos/article.md) | 1.059 |
| HM-006 | [Liderança técnica não começa com um cargo de liderança.](../content/blog/lideranca-tecnica/article.md) | 1.039 |
| HM-007 | [Automatizar um processo ruim não resolve o problema.](../content/blog/automatizar-processo-ruim/article.md) | 1.103 |
| HM-008 | [O que seus indicadores de atendimento realmente estão medindo?](../content/blog/indicadores-atendimento/article.md) | 1.100 |
| HM-009 | [Como documentar processos sem transformar conhecimento em burocracia.](../content/blog/documentar-processos/article.md) | 1.094 |
| HM-010 | [Uma plataforma de gestão do conhecimento para conectar pessoas, processos e sistemas.](../content/blog/plataforma-conhecimento/article.md) | 1.076 |
| HM-011 | [Como um mapa interativo pode revelar a complexidade de um chatbot.](../content/blog/mapa-chatbot/article.md) | 1.065 |
| HM-012 | [Da necessidade operacional ao protótipo: meu método para desenhar soluções.](../content/blog/necessidade-ao-prototipo/article.md) | 1.073 |
| HM-013 | [Antes de implementar IA, descubra se sua empresa está pronta.](../content/blog/empresa-pronta-ia/article.md) | 1.098 |
| HM-014 | [Agentforce ou Amazon Connect? A decisão vai além da tecnologia.](../content/blog/agentforce-amazon-connect/article.md) | 1.096 |
| HM-015 | [A IA deve reduzir a complexidade da operação, não criar outra camada.](../content/blog/ia-reduzir-complexidade/article.md) | 1.112 |
| HM-016 | [A estratégia empresarial precisa conversar com a arquitetura tecnológica.](../content/blog/estrategia-arquitetura/article.md) | 1.115 |
| HM-017 | [Por que o custo de uma solução vai muito além do preço da licença.](../content/blog/custo-alem-licenca/article.md) | 1.129 |
| HM-018 | [Dados não geram decisões: pessoas, processos e contexto geram.](../content/blog/dados-decisoes/article.md) | 1.084 |

Os textos desenvolvem problema, raciocínio, aplicação, alternativas e consequências empresariais. As fontes primárias incluem Salesforce, AWS, NIST, OMG, W3C, Google, Scrum Guides, GOV.UK e Open Group. Cada referência está registrada com título, endereço e data de consulta, e vinculada à afirmação relevante no corpo. A comparação de plataformas explicita a nomenclatura atual Amazon Connect Customer; evita inventar preços e equivalências de oferta.

Houve revisão independente dos 12 artigos de Processos, Ideias, IA e Administração, além da conferência dos respectivos autores de redação. Foram conferidos os exemplos de média e denominadores, o cenário de custo total e seus cálculos, nomenclatura de produtos, ausência de H1 duplicado, maturidade das propostas e ausência de alegações de implantação. Isso não substitui a aprovação final de Helsio Mattia.

## 6. Backlog editorial

O [backlog JSON](../content/editorial/backlog.json) contém os 60 títulos adicionais solicitados, exatamente dez por categoria. Cada pauta tem ID, slug, título, categoria, tags, objetivo específico, público, problema, ângulo editorial, roteiro, palavras-chave, prioridade, estado e série.

Todas estão em `idea`; nenhuma é contabilizada como artigo completo ou exposta na biblioteca pública. IDs e slugs são únicos. As prioridades P1/P2/P3 organizam a investigação e as dependências de leitura, sem simular um calendário de publicação. A estratégia mantém as pautas separadas dos textos concluídos e explica como associar uma pauta a um futuro artigo.

## 7. Estados e confidencialidade

Há distinção explícita entre rascunho, revisão factual pendente, revisão de confidencialidade pendente, público validado para aprovação e publicado. Um artigo publicado exige aprovação identificada, data válida e as duas validações concluídas. O build recusa metadados contraditórios.

Os artigos entregues estão em `ready` e `public-validated`, com `publishedAt: null`. Ideias e Projetos usam Conceito ou Proposta, inclusive o método proposto pelo autor; não são apresentados como implantações comprovadas. Os exemplos são hipotéticos e os números ilustrativos são identificados como sintéticos.

A seleção pública usa uma lista explícita de campos: notas internas e campos adicionais não documentados não são exportados. Título, corpo e índice de busca de conteúdo ainda não liberado foram procurados nos artefatos de teste e estavam ausentes. Links relacionados só apontam para artigos disponíveis no ambiente; links no corpo para textos ainda não públicos são apresentados sem destino clicável.

## 8. Rotas e idiomas

Foram implementadas `/blog`, `/blog/categoria/:slug`, `/blog/tag/:slug`, `/blog/serie/:slug`, `/blog/:slug` e `/blog/idioma/:language/:slug`. Todas respeitam `/crm-specialist/` em produção. URLs de categorias, tags e séries são estáveis, independentemente do idioma da interface.

O original usa a rota curta. Traduções integrais recebem rota própria e canonical próprio; apenas idiomas com arquivo completo cadastrado aparecem em `hreflang`. Trocar a interface para EN/ES mantém o original PT quando não há tradução integral e apresenta aviso explícito. As 18 entregas atuais não simulam artigos completos em EN/ES.

Busca e filtros mantêm estado na URL; a biblioteca pagina em grupos de 12. Categoria, tag, série, artigo inexistente e tradução indisponível têm tratamento específico. A navegação mantém histórico, cliques modificados, acesso direto e refresh; o mecanismo 404 existente continua atendendo rotas não materializadas.

## 9. SEO, acessibilidade e apresentação

Os documentos estáticos incluem conteúdo completo, H1 único, hierarquia de seções, referências, links internos, canonical, Open Graph, Twitter, BreadcrumbList e BlogPosting nos artigos. Foram abertos no navegador com JavaScript desativado e retornaram HTTP 200 com conteúdo legível. A verificação cobriu biblioteca, categoria, tag, série, artigo e uma tradução sintética isolada.

O sitemap inclui somente artigos aprovados e suas traduções efetivas, além das coleções editoriais. Busca/paginação e páginas inválidas recebem `noindex` na aplicação. O compartilhamento copia a URL canônica; se a área de transferência não puder ser usada, a URL fica disponível em texto para cópia manual.

O visual reutiliza MUI e as superfícies glass existentes. O corpo longo recebe fundo mais opaco, largura de leitura limitada e entrelinha confortável. TOC, links, formulários e paginação são acessíveis por teclado; títulos recebem foco na navegação e possuem âncoras estáveis. Não foram acrescentadas animações de entrada ou imagens decorativas genéricas. As preferências de movimento/transparência seguem o tema existente.

Capturas verificadas: [biblioteca desktop](../audit/editorial-blog/validation/editorial-index-1440.png), [biblioteca mobile](../audit/editorial-blog/validation/editorial-index-390.png), [leitura desktop](../audit/editorial-blog/validation/editorial-article-1440.png) e [leitura mobile](../audit/editorial-blog/validation/editorial-article-390.png).

## 10. Testes executados e preservação

| Verificação | Resultado observado |
| --- | --- |
| Baseline antes da implementação | Dados, lint, formato, smoke, 34 unitários, build e 57 verificações de rotas aprovados |
| Inventário editorial | 18 artigos completos, 60 pautas, seis categorias, nove séries e relações válidas |
| Testes unitários atuais | 38 aprovados, incluindo liberação editorial e data no fuso de São Paulo |
| Suíte completa do site | 93 verificações aprovadas, zero erros registrados |
| Suíte específica do Blog | Publicação isolada, segurança, SEO sem JavaScript e fluxos de leitura aprovados |
| Leitura real | Os 18 artigos carregados e inspecionados pelo teste de navegador |
| Responsividade | 320, 390, 768 e 1440 px sem overflow horizontal nos cenários verificados |
| Idiomas | Navegação PT/EN/ES, fallback identificado e tradução sintética com URL própria |
| Dependências | Consulta online do npm audit: zero vulnerabilidades reportadas |
| Preservação | 48 arquivos protegidos idênticos ao baseline; traduções fora de `blog` idênticas |
| Documentação HTML | 167 links conferidos; busca, Ctrl+K/Escape, tema, impressão e layout desktop/mobile aprovados |

Evidências: [baseline](../audit/editorial-blog/baseline.json), [navegação inicial](../audit/editorial-blog/baseline-browser/browser-results.json), [inventário](../audit/editorial-blog/content-validation.json), [preservação](../audit/editorial-blog/preservation.json), [regressão completa](../audit/editorial-blog/regression/browser-results.json), [suíte editorial](../audit/editorial-blog/validation/blog-browser-results.json), [comandos finais](../audit/editorial-blog/final-checks.json), [dependências](../audit/editorial-blog/dependency-audit.json) e [documentação](../audit/editorial-blog/docs-validation.json).

A revisão dos HTMLs identificou que Escape podia apenas limpar o campo de busca e manter o diálogo aberto no navegador testado. O manipulador da documentação agora fecha explicitamente o diálogo e devolve o foco ao botão de busca; a interação foi revalidada.

Os arquivos protegidos abrangem seções existentes, navegação lateral, tema, dados profissionais, demonstrações, currículos e arquivos públicos. O ajuste em `App.jsx` se limita a encaminhar os parâmetros das novas rotas do Blog. As versões de dependências preexistentes foram mantidas. Não houve execução remota do workflow nem teste em uma publicação real do GitHub Pages.

## 11. Limites e riscos conhecidos

Os 18 artigos precisam da revisão final do autor antes da liberação. As validações automáticas não certificam fatos, autoria ou confidencialidade por análise semântica. Referências externas foram consultadas, mas podem mudar após a data registrada; disponibilidade e licenciamento de produtos exigem nova conferência quando relevantes.

EN/ES possuem navegação, títulos e resumos revisados, com fallback para o corpo PT. Traduções integrais ficam para uma etapa editorial própria. As páginas estáticas de categorias e séries podem estar sem artigos enquanto o lote inicial permanece em revisão. Isso é refletido por um estado vazio, sem fabricar conteúdo publicado.

Busca e filtros interativos dependem de JavaScript; leitura e links públicos não. O índice de busca cresce com o volume de artigos e poderá exigir carregamento separado no futuro. A geração estática usa uma apresentação de leitura simplificada até a aplicação React assumir as interações. A imagem social genérica existente foi preservada; não houve garantia de indexação, ranking ou prévia em serviços externos.

Os testes usaram Chromium/Edge automatizado no Windows, incluindo viewport mobile e o teste existente de toque. Não equivalem a uma auditoria completa WCAG, leitor de tela ou matriz de navegadores/dispositivos físicos. A preservação visual das outras áreas é sustentada pela identidade dos arquivos de conteúdo/estilo e pela regressão funcional; não foi produzida uma comparação pixel a pixel de todas as páginas nesta missão.

## 12. Continuidade recomendada

Revisar o primeiro lote na prévia editorial, ajustar a voz quando necessário e aprovar os textos escolhidos para o lançamento. Registrar datas de publicação reais e executar os comandos do [guia](BLOG.md) antes de publicar. O fluxo local não envia alterações ao GitHub.

Depois, desenvolver pautas em lotes pequenos, priorizando perguntas concretas e relações com os textos existentes. Produzir traduções integrais somente com revisão técnica equivalente. Se a biblioteca crescer significativamente, medir o custo de carregar o índice de busca antes de adotar uma solução mais complexa. Backend, CMS e novas integrações devem depender de uma necessidade demonstrada.
