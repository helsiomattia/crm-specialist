# Database — Dados e persistência

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Atualização corretiva — 20/11/2026

### Conteúdo editorial versionado

O Blog usa `content/blog/<slug>/metadata.json` e Markdown, além de `content/editorial/taxonomy.json` e `backlog.json`. São seis categorias, nove séries, 18 artigos completos em revisão final e 60 pautas. Não foi adicionado banco. O contrato valida identidades, taxonomia, relações, ordem de série, idiomas, fontes, datas e autorização editorial; somente artigos aprovados entram no build público. Consulte o [guia do Blog](BLOG.md) para os campos e transições de estado.

### Catálogo de demonstrações

Os 18 registros e os 16 HTMLs foram preservados. O mapa de loaders passou para [projectEmbeds.js](../src/data/projectEmbeds.js); cada embed precisa de um loader com o mesmo ID. Não adicionar `embedHtml` ao catálogo. `npm run validate:data` executa os loaders e confere IDs, parentId, ciclos, variantes, URLs HTTPS, campos localizados e chaves nos três idiomas.

O fallback 404 agora usa a URL, sem gravar caminhos em sessionStorage. O bootstrap tolera armazenamento bloqueado e limpa a chave legada quando possível. A preferência de idioma continua com o detector i18next. Não foi criado banco nem backend. Veja o [relatório de estabilização](STABILIZATION_REPORT.md).

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Diagnóstico

O projeto não possui banco de dados. Não foram encontrados esquema SQL, migrations, ORM, servidor de API ou cliente de banco no código da aplicação. Os dados são módulos JavaScript e JSON versionados, compilados junto ao frontend.

Este documento registra esse modelo real. Nomes de objetos Salesforce, tabelas, métricas e diagramas dentro das demos são conteúdo de demonstração; não constituem um esquema persistido nem uma integração operacional com CRM.

## Inventário de fontes

| Fonte | Exportação / formato | Volume verificado | Consumo |
| --- | --- | --- | --- |
| `src/data/profile.js` | `profile` | 1 perfil | Hero, Sobre, Contato e dados compartilhados |
| `src/data/experience.js` | `experiences` | 5 registros | Experiência |
| `src/data/projects.js` | `projects`, `projectFilters` | 6 grupos de credenciais | Seção Credenciais |
| `src/data/skills.js` | `skillCategories` | 6 categorias | Expertise |
| `src/data/portfolioProjects.js` | `portfolioProjects` | 18 registros | Catálogo e detalhe |
| `src/locales/*/common.json` | JSON aninhado | 103 chaves folha por idioma | Interface PT/EN/ES |
| `projects/*.html`, `projects/lwc/*.html` | HTML, CSS e JavaScript | 16 demos mapeadas no componente | Estado e dados demonstrativos locais |

Os seis itens de `projects.js` são agrupamentos, não seis certificações individuais. O arquivo tem nome histórico de projetos, mas seu consumidor representa credenciais.

## Contratos observados

### Perfil

`name`, `firstName` e `initials` identificam o profissional. `title`, `description`, `valuePillars`, `operationalSignals`, `location` e `about` carregam conteúdo localizado. `email`, `phone`, `linkedin`, `github` e `trailblazer` são contatos públicos intencionais. `resume` e `avatar` aceitam ausência; ambos são `null` no snapshot.

`stats` contém indicadores editoriais. Os números são declarações do conteúdo do portfólio, não resultados calculados nem credenciais verificadas por esta auditoria.

### Experiências e expertise

Experiências incluem `id`, `company`, `role`, `period`, `location`, `type`, `description`, `summary`, `technologies`, `color` e, quando aplicável, `current`. Períodos são textos localizados, sem modelo de datas normalizado.

Categorias de expertise têm `id`, `title`, `icon`, `color`, `gradient`, `borderColor`, `skills` e `details`. Listas por idioma precisam manter correspondência semântica; presença de um array não prova alinhamento de posições ou qualidade da tradução.

### Catálogo de projetos

| Campo | Tipo observado | Regra de manutenção recomendada |
| --- | --- | --- |
| `id` | String | Único, estável e seguro para rota |
| `parentId` | String opcional | Apontar para coleção existente; impedir ciclos |
| `kind` | `external`, `embed` ou `collection` | Validar campos por variante |
| `title`, `description` | Objeto PT/EN/ES | Todas as línguas preenchidas |
| `status`, `action` | Objeto PT/EN/ES | Labels coerentes com a variante |
| `externalUrl` | URL, quando externo | Protocolo e destino revisados |
| `tags` | Array de strings | Tags compreensíveis e consistentes |
| `accent`, `gradient` | Strings CSS | Preferir tokens existentes |

Um projeto `embed` não contém `embedHtml` no catálogo atual: seu ID precisa estar em `PROJECT_EMBED_LOADERS` no componente de detalhe. Esse relacionamento é mantido manualmente. A instrução antiga no README precisa ser atualizada (A-08).

## Relacionamentos lógicos

```text
portfolioProjects (18)
  ├─ external (1)
  ├─ embed raiz (6) ── ID ── loader ── HTML local
  └─ collection "lwc" (1)
      └─ filhos com parentId "lwc" (10) ── ID ── loader ── HTML local

profile ── informações compartilhadas ── credenciais / seções
idioma ativo ── common.json + objetos localizados ── interface
```

Essa é uma relação entre objetos em memória, sem chaves estrangeiras aplicadas por banco. Funções `getRootPortfolioProjects`, `getPortfolioProjectsByParent` e `getPortfolioProjectById` filtram ou procuram o array local.

## Armazenamento no navegador

| Local | Chave / conteúdo | Finalidade | Observação |
| --- | --- | --- | --- |
| `localStorage` | Preferência de idioma pelo detector i18next | Reutilizar idioma entre visitas | Não é conta nem sessão autenticada |
| `sessionStorage` | `crm-specialist-redirect` | Transportar caminho do fallback 404 | Há consumo duplicado/antecipado; A-01 |
| Estado React | Seleção de projeto, dialogs, loading e altura | Interação da visita atual | Sem persistência de negócio |
| Scripts das demos | Arrays e objetos de exemplo | Simular interfaces CRM | Não foram observadas chamadas de API para alimentar esses exemplos |

Armazenamento pode falhar quando indisponível ou restringido pelo navegador. Os acessos diretos à chave de redirecionamento não possuem tratamento de exceção; incluir fallback no reparo das rotas. A documentação HTML acrescenta sua própria preferência `hm-audit-theme`, separada da aplicação.

## Qualidade, segurança e integridade

**Verificado:** 18 projetos, 16 embeds com loaders e arquivos existentes; 103 chaves de interface por idioma, sem faltas ou extras entre PT/EN/ES.

**Lacunas:** ausência de schema executável; ausência de validação de IDs únicos e `parentId` no pipeline; período profissional armazenado como texto; mistura de dados e apresentação em campos de cor; catálogo e loaders com manutenção separada.

Todo arquivo enviado no frontend deve ser tratado como público. Não adicionar dados de clientes reais, tokens, credenciais, exportações de produção ou informações internas nos objetos e HTMLs de demonstração. Os contatos profissionais já publicados no perfil não devem ser confundidos com credenciais técnicas.

## Procedimento de atualização

1. Editar o módulo proprietário do dado, mantendo IDs existentes quando houver links públicos.
2. Preencher PT/EN/ES e revisar o conteúdo, além de sua estrutura.
3. Para embed, adicionar o HTML local e seu loader; para coleção, revisar os `parentId`.
4. Confirmar que somente conteúdo publicável entrou no diff.
5. Validar dados, build, navegação e sitemap correspondente.

O histórico Git permite recuperar versões do conteúdo; não há rotina de backup de banco porque não há banco. Isso não garante backup de serviços externos nem de informações fora do repositório.

## Evolução possível

Manter arquivos estáticos atende ao uso observado. Se houver edição por pessoas não técnicas, conteúdo privado ou captura de contatos, definir antes autenticação, autorização, validação, retenção e uma API. Um futuro CMS ou banco seria nova arquitetura, sem migrations implícitas nesta documentação.

## Fontes

[Perfil](../src/data/profile.js) · [Experiências](../src/data/experience.js) · [Credenciais](../src/data/projects.js) · [Expertise](../src/data/skills.js) · [Catálogo](../src/data/portfolioProjects.js) · [i18n](../src/i18n.js) · [Security](SECURITY.md).
