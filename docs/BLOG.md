# Blog HM.crm — Guia editorial e de manutenção

> Implementação local de 20/11/2026. Este guia substitui o contrato inicial do Blog; as auditorias anteriores continuam preservadas como histórico.

## O que está disponível

A biblioteca reúne seis categorias, nove séries, 18 artigos completos em português e 60 pautas adicionais. Os artigos têm títulos e resumos em PT/EN/ES, referências verificadas, tags e relações entre assuntos. O corpo completo permanece em português; traduções de títulos não são apresentadas como traduções integrais.

Os 18 textos estão em `ready`: revisão técnica e de confidencialidade concluída, revisão final do autor pendente. Não receberam datas fictícias nem foram liberados no catálogo público. O backlog é planejamento, não conteúdo publicado. Consulte o [relatório da implementação](BLOG_IMPLEMENTATION_REPORT.md), o [plano editorial](../content/editorial/STRATEGY.md) e o [inventário estruturado](../content/editorial/backlog.json).

## Abrir a prévia editorial

Na raiz do projeto:

```bash
npm run blog:preview
```

Abra `http://127.0.0.1:5173/blog`. Se a porta estiver ocupada, use `npm run blog:preview -- --port 5175` e abra a porta informada. Essa modalidade exibe os textos locais em revisão, com aviso e `noindex`. O servidor escuta em loopback. O build com `--mode editorial` é bloqueado para impedir a exportação acidental da prévia.

`npm run dev` e `npm run build` usam somente artigos publicados e aprovados. Enquanto nenhum texto for liberado, mostram as seis categorias e os estados vazios da biblioteca. Isso permite revisar o conteúdo sem confundir revisão com publicação.

Se o npm não estiver disponível no PATH do Windows, o equivalente da prévia é `node node_modules/vite/bin/vite.js --mode editorial`. Para criação, use `node scripts/create-blog-post.mjs meu-artigo`.

## Organização dos arquivos

| Local | Responsabilidade |
| --- | --- |
| `content/blog/<slug>/article.md` | Corpo no idioma original |
| `content/blog/<slug>/metadata.json` | Contrato editorial do artigo |
| `content/blog/<slug>/article.en.md` | Tradução integral em inglês, quando revisada |
| `content/blog/<slug>/article.es.md` | Tradução integral em espanhol, quando revisada |
| `content/blog/_modelo/` | Modelo ignorado pelo catálogo |
| `content/editorial/taxonomy.json` | Categorias, introduções, assuntos, tags e séries |
| `content/editorial/backlog.json` | Pautas com objetivos, público, problema, recorte e roteiro |
| `content/editorial/STRATEGY.md` | Sequências e critérios editoriais |
| `scripts/lib/blog-content.mjs` | Descoberta, validação e seleção de conteúdo público |
| `scripts/lib/blog-prerender.mjs` | HTML estático e sitemap de produção |
| `src/utils/blog-markdown.js` | Mesmo renderizador seguro para React e HTML estático |
| `src/components/blog/` | Biblioteca, leitura, cards, layout e SEO |

Não há banco, CMS, login, API ou serviço externo para armazenar artigos. Conteúdo e revisão são versionados junto do projeto. A prévia é parte da mesma aplicação React/Vite.

## Categorias e tipos

| Categoria | Slug |
| --- | --- |
| Salesforce & CRM | `salesforce` |
| Gestão & Liderança | `gestao` |
| Processos & Operações | `processos` |
| Ideias & Projetos | `ideias` |
| Inovação & Inteligência Artificial | `inovacao` |
| Administração & Estratégia Empresarial | `administracao` |

Cada artigo tem uma categoria principal e tags transversais cadastradas na taxonomia. Não escreva o nome visível da categoria no campo `category`: use o slug. As tags também usam slugs estáveis e nomes localizados. A página de categoria apresenta sua introdução, assuntos previstos, destaque, biblioteca e filtros.

Os formatos aceitos são `technical`, `strategy`, `guide`, `reflection`, `architecture`, `comparison`, `decision`, `prototype`, `concept` e `series`. Correspondem a artigo técnico, análise estratégica, guia, reflexão, estudo de arquitetura, comparação, framework de decisão, projeto/protótipo, artigo conceitual e série educacional. O tipo orienta a escrita; não obriga todos os textos a seguirem o mesmo roteiro.

## Criar ou editar um artigo

```bash
npm run blog:new -- nome-do-artigo
```

O comando cria a pasta e um rascunho com ID e slug próprios. Recusa sobrescrever artigos existentes e rejeita caminhos inválidos. Edite os dois arquivos criados. O `slug` deve coincidir com a pasta e permanecer estável depois da publicação. Mudá-lo quebra links existentes; uma alteração de URL exige planejamento de redirecionamento.

Use `##` para as seções e `###` para subseções: a página já fornece o H1. Parágrafos, listas, citações, links, imagens e blocos de código usam Markdown comum. HTML arbitrário é ignorado. Não são executados componentes MDX, scripts ou código de artigos. Tabelas GFM não fazem parte do parser atual; use listas claras ou desenvolva suporte específico com testes antes de adotar esse formato.

O índice é extraído da árvore Markdown. Títulos iguais recebem IDs distintos; linhas dentro de blocos de código não viram entradas. O tempo de leitura deriva das palavras do corpo efetivamente carregado, usando 220 palavras por minuto como estimativa editorial, não como medida individual do leitor.

## Metadados e estados

O modelo completo está em [metadata.json](../content/blog/_modelo/metadata.json). Campos essenciais:

- Identidade: `id`, `slug`, `author`, `category`, `type`, `tags`.
- Idiomas: `language` original, `languages` com corpos completos disponíveis, `title` e `excerpt` com PT/EN/ES.
- Revisão: `status`, `editorialStatus`, `factualStatus`, `confidentialityStatus`, `reviewedAt`, `approvedBy`.
- Datas: `publishedAt` e `updatedAt`; nulas antes da publicação e quando não há revisão posterior.
- Navegação: `featured`, `series`, `seriesOrder`, `relatedArticles`.
- Evidência: `sources`, `maturity` e, se aplicável, `implementationEvidence`.

| Situação | status | editorialStatus | Catálogo público |
| --- | --- | --- | --- |
| Rascunho | `draft` | `draft` | Excluído |
| Revisão factual pendente | `draft` | `factual-review` | Excluído |
| Revisão de confidencialidade pendente | `draft` | `confidentiality-review` | Excluído |
| Público e validado, aguardando autor | `ready` | `public-validated` | Excluído |
| Publicado e aprovado | `published` | `published` | Incluído |

`ready` exige `factualStatus` e `confidentialityStatus` iguais a `validated`. `published` exige também revisor identificado e data válida. Qualquer dúvida factual ou de privacidade exige manter o artigo fora da publicação. O validador rejeita metadados contraditórios; não basta trocar uma única palavra para liberar um texto não revisado.

## Revisão obrigatória antes da liberação

1. Ler o artigo integralmente e confirmar que expressa uma posição que o autor deseja assinar.
2. Conferir afirmações externas nas fontes primárias, incluindo versões, limitações e nomenclatura atual dos produtos.
3. Distinguir fato documentado, interpretação e exemplo hipotético. Conferir cálculos sintéticos e suas unidades.
4. Remover clientes não autorizados, IDs reais, métricas privadas, regras proprietárias, configurações de produção, código corporativo e credenciais.
5. Confirmar que nenhum protótipo aparece como implantação ou resultado comprovado. Na categoria Ideias, declarar Conceito, Proposta, Protótipo, Demonstração ou Implementação validada; a última classificação exige evidência explícita.
6. Revisar título, resumo, links, referências, conclusão e qualidade da leitura. Atualizar as duas validações e marcar `ready` somente quando concluídas.
7. Identificar a aprovação final e executar as verificações técnicas antes do lançamento.

Os controles automáticos verificam contratos e exclusão de conteúdo. Não conseguem certificar a veracidade de todas as afirmações nem reconhecer toda informação confidencial. A leitura editorial é indispensável.

## Liberar para publicação

Após a revisão final, execute na data planejada para o lançamento:

```bash
npm run blog:publish -- nome-do-artigo --reviewed-by "Nome do revisor"
npm run check
npm run build
npm run test:blog
```

O comando exige `ready`, registra aprovação e a data corrente em America/Sao_Paulo, e libera o texto no catálogo local. Não faz commit, push ou deploy. A data precisa coincidir com a publicação efetiva: se o lançamento for adiado, ajuste `publishedAt` antes do build que será publicado. Não atribua datas antigas para simular histórico.

Para corrigir um artigo já publicado, mantenha `publishedAt` e atualize `updatedAt` com a revisão real. Refaça a revisão quando a mudança afetar fatos ou privacidade. Para retirar um texto, use estado não publicado e `publishedAt: null`; o próximo build o remove do catálogo, do HTML gerado e do sitemap. Não reutilize uma URL removida para um assunto diferente.

## Referências e relações

Cada fonte tem `title`, URL HTTPS e `checkedAt`. Cite-a também perto da afirmação no Markdown, usando um link descritivo. A lista de referências da página é gerada dos metadados. Datas de consulta registram a revisão executada; não garantem que o destino continuará disponível ou inalterado.

Links internos no corpo usam `/blog/slug`. O renderizador aplica o base path do ambiente. `relatedArticles` contém slugs existentes, escolhidos por complementar o raciocínio. Não inclua o próprio artigo. Conteúdos ainda não públicos não aparecem nos relacionados; links no corpo para esses textos viram texto sem link no build público. A prévia local permite navegar entre todos os textos em revisão.

Uma série tem slug cadastrado e posições `seriesOrder` positivas e únicas. A navegação anterior/próxima considera os artigos disponíveis no ambiente e sua ordem, sem expor rascunhos em produção. As nove séries e suas sequências estão no [plano editorial](../content/editorial/STRATEGY.md).

## Traduções e política de URLs

| Rota relativa | Conteúdo |
| --- | --- |
| `/blog` | Biblioteca e índices de categorias, tags e séries |
| `/blog/categoria/:slug` | Categoria |
| `/blog/tag/:slug` | Tag |
| `/blog/serie/:slug` | Série em ordem de leitura |
| `/blog/:slug` | Artigo no idioma original |
| `/blog/idioma/en/:slug` | Tradução integral em inglês cadastrada |
| `/blog/idioma/es/:slug` | Tradução integral em espanhol cadastrada |

Em produção, todas recebem o prefixo `/crm-specialist`. O idioma da interface continua seguindo o seletor existente e sua preferência local; não muda a URL do original. Quando não existe tradução integral, a leitura mantém o idioma original, com aviso traduzido e `lang` correto. Cards podem mostrar títulos e resumos traduzidos, identificando o original em português.

Para disponibilizar uma tradução, escreva e revise integralmente `article.en.md` ou `article.es.md`, revise os metadados correspondentes e só então acrescente o idioma a `languages`. O build exige o arquivo não vazio. Não cadastre traduções parciais. A rota traduzida é estável e possui canonical próprio. `hreflang` inclui somente idiomas com corpo disponível; as 18 entregas atuais têm apenas PT. O índice editorial de assuntos das categorias é identificado como português nas três interfaces.

## SEO e publicação estática

O build gera `index.html` nas rotas públicas do Blog. Esses documentos contêm título, descrição, conteúdo semântico completo, links, canonical, Open Graph, Twitter, BreadcrumbList e, nos artigos, BlogPosting. O mesmo renderizador Markdown atende ao navegador e ao HTML estático, impedindo uma interpretação diferente de HTML arbitrário. O navegador substitui o conteúdo estático pela aplicação React para filtros e demais interações; não há migração da Home para SSR.

O sitemap conserva as páginas existentes e inclui biblioteca, categorias, tags, séries e artigos aprovados, além das traduções completas. Artigos não publicados não entram no HTML, JavaScript, busca ou sitemap. Filtros e paginação de busca usam canonical da coleção e `noindex`; rotas inválidas também recebem `noindex` na aplicação. Acesso direto e refresh funcionam com os diretórios estáticos e o transporte 404 existente.

Busca e filtros requerem JavaScript. Sem JavaScript, os documentos gerados continuam oferecendo leitura e navegação por links. A imagem social genérica do site foi preservada; não foi criado um serviço de geração de imagens por artigo. Indexação e aparência em redes sociais dependem de terceiros e não foram garantidas por este teste local.

## Manter o backlog

Cada pauta possui ID, slug, título, categoria, tags, objetivo, público, problema, ângulo editorial, roteiro, palavras-chave, prioridade, estado e série. `P1`, `P2` e `P3` indicam ordem editorial, sem prometer datas.

Estados disponíveis: `idea`, `planned`, `drafting`, `completed` e `cancelled`. Ao transformar uma pauta em artigo, preserve seu registro e associe `articleSlug` ao novo artigo; atualize o estado. Essa associação permite reutilizar o slug planejado sem criar uma colisão silenciosa. O artigo tem ID próprio e passa pelo fluxo editorial completo. Pautas nunca entram no módulo público do Blog.

## Validar alterações

```bash
npm run blog:validate
npm run check
npm run build
npm run test:blog
npm run test:browser
node docs/build-docs.mjs
```

`blog:validate` verifica o inventário, IDs, slugs, categorias, tags, relações, séries, datas, idiomas e backlog. `test:blog` constrói conteúdo sintético isolado, testa HTML sem JavaScript, publicação, exclusão de conteúdo, segurança Markdown e fluxos de leitura; também abre os 18 artigos reais em uma prévia local. O teste completo do site cobre navegação, menu lateral e as 16 demonstrações existentes.

No Windows testado, use `HM_BROWSER_PATH=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. No CI, o workflow instala Chromium. Resultados reais desta entrega, limites de cobertura e capturas estão no [relatório](BLOG_IMPLEMENTATION_REPORT.md). A documentação HTML é regenerada a partir do Markdown; não editar somente o HTML.
