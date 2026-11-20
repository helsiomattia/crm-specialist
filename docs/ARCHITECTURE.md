# Architecture — Estrutura e execução

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Blog — 20/11/2026

Biblioteca, categorias, tags, séries, artigos e traduções usam o parser/404 existente. O módulo `virtual:blog` contém metadados, texto para busca e loaders somente dos artigos públicos; o modo editorial local inclui revisões e é bloqueado no build. `blog-prerender.mjs` gera HTML completo para as rotas públicas, com o mesmo renderizador Markdown seguro da aplicação, metadados e sitemap. A Home permanece na SPA atual. Contrato, URLs, seleção de idiomas e limites estão no [guia do Blog](BLOG.md) e no [relatório da implementação](BLOG_IMPLEMENTATION_REPORT.md).

## Atualização corretiva — 20/11/2026

O parsing e a construção das URLs agora ficam em `src/utils/routes.js`. `restoreRedirect` executa em `main.jsx` antes da montagem React; o 404 transporta caminho, query e hash por `__hm_route`, sem depender de storage. A chave legada é migrada/limpa com tratamento de erros. App e navegação compartilham o parser puro, incluindo alias skills, histórico e cliques modificados.

Os 16 loaders ficam em `src/data/projectEmbeds.js`. O iframe usa apenas `allow-scripts`; a bridge em `src/utils/embedBridge.js` mede seu próprio documento e envia altura/rolagem limitada ao pai. O pai não lê o DOM interno.

Vite 6.4.6 e Node 22.22.2 estão alinhados com `.nvmrc` e CI. Dev/preview escutam somente em 127.0.0.1. CI: instalação por lockfile → dados → lint/formato → smoke → unitários → build → navegador → audit → artefato → deploy condicionado a main. PRs validam sem publicar. Veja o [relatório de estabilização](STABILIZATION_REPORT.md).

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Visão geral

SPA React renderizada no navegador, compilada pelo Vite e preparada para publicação estática no GitHub Pages. Não há servidor de aplicação, API de negócio, ORM ou integração Salesforce implementada. Conteúdo profissional é importado de módulos JavaScript; textos da interface vêm de JSON; demos HTML são carregadas sob demanda.

## Stack encontrada

Versões abaixo são as resolvidas no `package-lock.json`, não uma recomendação de versões atuais.

| Tecnologia | Versão resolvida | Papel |
| --- | --- | --- |
| React / React DOM | React 18.3.1 | Componentes e estado local |
| Vite | 5.4.21 | Desenvolvimento, transformação e build |
| Material UI | 5.18.0 | Componentes e tema |
| Emotion | Declarado em `package.json` | Motor de estilo do MUI |
| GSAP | 3.15.0 | Animação, scroll e triggers |
| i18next | 26.3.5 | Recursos e seleção de idioma |
| react-i18next | 17.0.8 | Integração de tradução com React |

O manifesto tem apenas `dev`, `build` e `preview`. O CI usa Node 20; o README diz Node 18 ou superior. Não há `engines` nem arquivo de versão de Node no checkout auditado. Recomenda-se alinhar documentação, ambiente local e CI após validar a toolchain.

## Mapa de execução

```text
Navegador
  └─ index.html
      └─ src/main.jsx: StrictMode + inicialização i18n
          └─ App: ThemeProvider + CssBaseline + estilos globais
              ├─ Navbar / Footer
              ├─ Home: Hero + seções lazy + SectionNavigation
              ├─ AboutProjectPage (lazy)
              └─ ProjectDetailPage (lazy)
                  ├─ Catálogo em src/data/portfolioProjects.js
                  ├─ Loaders de projects/*.html?raw
                  └─ iframe srcDoc com scripts locais

Git push em main / workflow_dispatch
  └─ GitHub Actions: npm ci → vite build → artifact dist → Pages
```

O fluxo é o que está configurado no repositório; disponibilidade e execução recente da publicação remota não foram verificadas.

## Responsabilidades por diretório

| Local | Responsabilidade |
| --- | --- |
| `src/components/layout` | Cabeçalho, rodapé e navegação por seções |
| `src/components/sections` | Conteúdo das seções e páginas de projeto |
| `src/components/ui` | Componentes visuais compartilhados |
| `src/data` | Perfil, experiências, credenciais, expertise e catálogo |
| `src/locales` | Textos PT/EN/ES da interface |
| `src/theme` | Tokens e configuração MUI |
| `src/utils` | Localização, scroll, destaque e utilitários de rota |
| `projects` | HTMLs completos de demonstração; previews LWC em subpasta |
| `images/optimized` | Fotos WebP e AVIF já versionadas |
| `public` | Favicon, OG, robots, sitemap e fallback 404 |
| `scripts` | Verificações simples e otimizador de imagens |
| `audit` | Relatórios históricos |
| `docs` | Guia visual anterior e esta auditoria em Markdown/HTML |

## Carregamento e estado

`Hero`, `Navbar` e `Footer` entram diretamente no `App`. As demais seções principais usam `lazy`/`Suspense`; a montagem da home abaixo do Hero é adiada por `requestIdleCallback` com timeout de 900 ms, ou `setTimeout` de 350 ms como fallback. Isso adia o conjunto de seções; não significa carregamento individual de cada seção ao entrar na viewport.

Cada demo possui import dinâmico de HTML com `?raw` no mapa `PROJECT_EMBED_LOADERS`. Foram verificados 16 loaders, todos com arquivos existentes e correspondência com os 16 registros `kind: 'embed'`. O componente acompanha loading, erro e cancelamento de atualizações após mudança de seleção.

O iframe usa `ResizeObserver`, medição do documento interno e `requestAnimationFrame` para ajustar altura. Essa leitura direta é uma dependência arquitetural de mesma origem: alterar o sandbox exige substituir a comunicação, conforme [Security](SECURITY.md).

## Rotas e problema confirmado A-01

| Endereço relativo ao base path | Comportamento pretendido |
| --- | --- |
| `/` | Home |
| `/about`, `/experience`, `/credentials`, `/expertise`, `/projects`, `/contact` | Home posicionada na seção |
| `/skills` ou `#skills` | Alias de Expertise |
| `/about-project` | Página sobre o projeto |
| `/projects/:projectId` | Detalhe ou coleção do catálogo |

O build usa `/crm-specialist/`; desenvolvimento usa `/`. `public/404.html` armazena o caminho em `sessionStorage` com a chave `crm-specialist-redirect` e redireciona à raiz. `App.getAppRoute()` consome e remove essa chave. Depois, `SectionNavigation.getSectionFromLocation()` tenta ler a mesma chave.

**Reprodução por simulação das funções reais:** inserir `expertise` na chave, definir pathname `/crm-specialist/`, executar `getAppRoute()` e depois `getSectionFromLocation()`. Resultado: rota `home` e seção `home`, quando a intenção era seção `expertise`. A remoção antecipada foi confirmada; a jornada hospedada completa continua exigindo teste de navegador.

Existe `src/utils/routes.js`, porém os componentes de entrada mantêm implementações próprias e não importam esse módulo. A presença do utilitário não significa roteamento centralizado. A inicialização também faz efeito colateral em armazenamento; revisar seu comportamento sob `StrictMode`.

**Recomendação:** extrair um resultado único `{ page, projectId, sectionId }`, consumir o redirecionamento uma vez fora de inicializadores que dependam de pureza, restaurar a URL canônica e compartilhar esse estado. Testar deep links, reload e histórico antes de trocar toda a estratégia de navegação.

## Internacionalização e conteúdo

O detector considera `localStorage`, navegador e tag HTML, nessa ordem, com fallback PT. `getLocalizedString` normaliza variantes regionais e cai para PT. A interface usa `common.json`; conteúdo extenso usa objetos `{ pt, en, es }` em módulos de dados.

Foram comparadas 103 chaves folha por idioma, sem diferenças de conjunto. Isso verifica estrutura, não qualidade da tradução. O seletor não sincroniza `document.documentElement.lang`, e as demos não recebem automaticamente o idioma da aplicação.

## Build e publicação

`vite.config.js` separa manualmente dependências em grupos React, MUI, Emotion, animação e i18n. A configuração de servidor usa `host: '0.0.0.0'`, porta 5173 e `strictPort: true`; limitar exposição de desenvolvimento ao contexto necessário.

O workflow de GitHub Actions faz checkout, configura Node, instala com lockfile, gera `dist`, envia o artefato e publica no ambiente `github-pages`. Permissões de Pages e OIDC estão declaradas. Não há etapa de smoke, lint, teste funcional ou auditoria de dependências.

Os arquivos em `docs` não são uma entrada do build Vite nem estão em `public`; portanto esta auditoria HTML não será publicada automaticamente pelo workflow atual. Ela pode ser aberta localmente por `docs/index.html`. Publicar documentação exige uma decisão de escopo e configuração específica.

## Decisões recomendadas

| Tema | Recomendação | Motivo |
| --- | --- | --- |
| Persistência | Manter conteúdo estático enquanto atender ao objetivo | Não há necessidade observada de banco ou backend |
| Rotas | Uma fonte de parsing e estado | Eliminar consumo concorrente e caminhos duplicados |
| Demos | Fronteira explícita entre HTML da demo e aplicação | Reduzir confiança implícita em scripts incorporados |
| Conteúdo | Contrato validável para catálogo e idiomas | Evitar IDs órfãos, traduções faltantes e loader ausente |
| Qualidade | Gates de CI antes do deploy | Tornar resultados reproduzíveis |
| Documentação | Markdown como fonte, HTML gerado | Reduzir divergência entre formatos |

São propostas; nenhuma refatoração da aplicação foi incluída nesta entrega.

## Fontes

[App](../src/App.jsx) · [Rotas](../src/utils/routes.js) · [Navegação](../src/components/layout/SectionNavigation.jsx) · [Detalhe de projeto](../src/components/sections/ProjectDetailPage.jsx) · [Vite](../vite.config.js) · [Workflow](../.github/workflows/deploy.yml) · [Database](DATABASE.md) · [Testing](TESTING.md).
