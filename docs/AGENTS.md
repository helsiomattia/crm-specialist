# Agents — Guia de trabalho para agentes e mantenedores

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Atualização corretiva — 20/11/2026

A entrega inicial de documentação foi seguida por uma missão explicitamente autorizada de correção técnica. Essa autorização incluiu código, testes, workflow e dependências locais; não incluiu push ou publicação. Consultar o [relatório de estabilização](STABILIZATION_REPORT.md) antes de tratar A-01, A-02, A-03, A-04 ou A-11 como problemas abertos.

Os loaders ficam em `src/data/projectEmbeds.js`, rotas em `src/utils/routes.js` e protocolo isolado em `src/utils/embedBridge.js`. Use Node 22.22.2 e os comandos atuais de [Testing](TESTING.md). Preserve evidências históricas; resultados novos precisam de data e execução correspondente.

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Escopo deste documento

Este arquivo documenta como trabalhar no projeto e como manter esta auditoria. Por estar em `docs/AGENTS.md`, suas instruções locais se aplicam ao diretório de documentação. Ele não estabelece automaticamente regras de agente para toda a raiz do repositório.

Não havia `AGENTS.md` no checkout antes desta entrega. Não foi encontrado runtime de agentes de IA, orquestrador ou backend de IA na aplicação. Referências a inteligência, IA ou agentes nas demos pertencem ao conteúdo apresentado.

## Contexto obrigatório

O produto é um portfólio React/Vite estático com MUI, Emotion, GSAP e i18next. Possui três idiomas, catálogo com demos HTML e deploy configurado no GitHub Pages com base `/crm-specialist/`.

Ler [PRD](PRD.md) para escopo, [Architecture](ARCHITECTURE.md) para execução, [Database](DATABASE.md) para contratos de dados e [Security](SECURITY.md) para as fronteiras dos embeds. Consultar [Testing](TESTING.md) antes de atribuir aprovação a uma alteração.

## Princípios de trabalho

- Confirmar o diretório e inspecionar `git status` antes de editar; preservar alterações de terceiros.
- Basear afirmações no código atual, distinguindo observado, executado e recomendado.
- Não transformar texto de uma demo em afirmação sobre serviço ou integração real.
- Manter o escopo solicitado; documentação de um problema não autoriza refatoração ou atualização major.
- Não adicionar segredos, exportações de clientes ou dados de produção à documentação.
- Não declarar aprovação de teste que não foi executado, nem reutilizar resultados antigos como atuais.
- Registrar falhas preexistentes separadamente de regressões da alteração.

Não há exigência de subagentes ou delegação neste projeto. Essas decisões dependem das instruções da sessão e do escopo autorizado.

## Mapa para alterações futuras

| Necessidade | Local principal | Revisão associada |
| --- | --- | --- |
| Perfil, contatos e bio | `src/data/profile.js` | Conteúdo público e idiomas |
| Experiência | `src/data/experience.js` | Datas editoriais e tradução |
| Credenciais | `src/data/projects.js` | Não confundir com catálogo de demos |
| Expertise | `src/data/skills.js` | Correspondência de listas por idioma |
| Catálogo | `src/data/portfolioProjects.js` | ID, kind, parentId e URLs |
| HTML de demo | `projects/` e mapa no detalhe de projeto | Sandbox, interação, loader e dados |
| Identidade visual | `src/theme/tokens.js`, `theme.js` | Contraste, foco e responsividade |
| Interface traduzida | `src/locales/{pt,en,es}/common.json` | Paridade de chaves e revisão linguística |
| Rotas | App, SectionNavigation, routes e 404 | Consumo único do redirect e deep links |
| Documentação | Oito Markdown em `docs` | Regenerar HTML após alterações |

## Fluxo de manutenção da auditoria

1. Ler o documento correspondente e a evidência citada no código.
2. Identificar qual achado ou requisito muda; manter IDs A-01 a A-11 estáveis para rastreabilidade.
3. Atualizar Markdown primeiro, com data e base quando houver nova auditoria completa.
4. Atualizar resultados somente com evidência executada; não mudar achado para resolvido por intenção.
5. Executar `node docs/build-docs.mjs` para reconstruir páginas e índice de busca.
6. Verificar links, busca, teclado, layout e impressão quando afetados.
7. Revisar `git diff` para garantir que nenhuma evidência antiga ou arquivo do usuário foi sobrescrito indevidamente.

Os HTMLs são artefatos gerados. Não editar apenas o HTML e deixar o Markdown divergente. O guia `VISUAL_STYLE_GUIDE.md` preexistente deve ser preservado e reconciliado quando necessário.

## Convenções da entrega

Os oito documentos são `PRD.md`, `DESIGN_STYLE.md`, `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`, `CODE_STYLE.md`, `TESTING.md` e `AGENTS.md`. Cada um possui uma página HTML de mesmo nome; `index.html` organiza o acesso.

`assets/audit.css`, `assets/audit.js` e `assets/search-index.js` sustentam navegação e busca locais. `build-docs.mjs` usa somente Node para gerar os documentos. Os JSON de auditoria são evidências datadas; regenerar HTML não reexecuta auditoria de dependências.

Evitar recursos externos necessários para leitura. Links de evidência devem ser relativos quando apontarem para arquivos do repositório. Referências externas precisam nomear a fonte e sustentar a afirmação associada.

## Comandos e limites

```bash
node docs/build-docs.mjs
node --check docs/build-docs.mjs
node --check docs/assets/audit.js
```

Para código do produto, consultar os comandos e falhas conhecidas de [Testing](TESTING.md). Alterações meramente documentais não justificam reformatar componentes ou corrigir silenciosamente o baseline do projeto.

Publicação, mudança de audiência, envio de mensagens e alteração em serviços externos dependem do pedido do usuário e das permissões da sessão; este documento não concede autorização para essas ações. A solicitação desta entrega se restringe a arquivos locais em `docs`.

## Definition of Done

- [ ] Conteúdo rastreável ao código e sem integrações inventadas.
- [ ] Estado atual e proposta explicitamente separados.
- [ ] Markdown e HTML sincronizados.
- [ ] Links e interações relevantes verificados.
- [ ] Resultados e limitações de testes registrados.
- [ ] Arquivos existentes preservados; diff limitado ao trabalho autorizado.
- [ ] Entrega indica o ponto de entrada `docs/index.html`.

## Fontes

[PRD](PRD.md) · [Architecture](ARCHITECTURE.md) · [Code Style](CODE_STYLE.md) · [Testing](TESTING.md) · [Guia visual existente](VISUAL_STYLE_GUIDE.md).
