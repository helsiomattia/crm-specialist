# PRD — Product Requirements Document

> Auditoria de 20/11/2026 · Projeto HM.crm / crm-specialist · Base: commit `cc01bc8`.

## Atualização corretiva — 20/11/2026

### Extensão editorial — Blog profissional

O Blog passou a ter seis categorias, nove séries, busca no corpo, filtros por categoria/tag, leitura com índice e páginas estáticas geradas no build. A entrega editorial inclui 18 textos completos em português, em revisão final do autor, e 60 pautas distintas. Os textos não foram publicados automaticamente. Requisitos, arquitetura, evidências e limites estão no [relatório do Blog](BLOG_IMPLEMENTATION_REPORT.md); o fluxo de manutenção está no [guia editorial](BLOG.md). Home, dados profissionais, tema e demos foram preservados.

### Estabilização anterior

As correções de A-01 (rotas), A-02 (isolamento), A-03 (testes), A-04 (CI) e A-11 (dependências) foram implementadas e verificadas localmente. O escopo continua sendo o mesmo portfólio, com 18 registros, 16 demos e três idiomas. Consulte o [relatório de estabilização](STABILIZATION_REPORT.md) para resultados, versões, comparação visual e limites. Nenhum push ou deploy foi executado.

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Visão do produto

O HM.crm é o portfólio profissional de Helsio Mattia. Apresenta experiência em Salesforce CRM, arquitetura de soluções, Service Operations, automação, integração, dados e governança. A aplicação combina uma página de apresentação em três idiomas com uma biblioteca de demonstrações interativas.

O repositório contém um site estático React. As telas de CRM são simulações em HTML; não representam uma conexão com uma organização Salesforce. Referências a Apex, LWC, objetos, permissões e indicadores dentro das demos descrevem o cenário demonstrado, não serviços implementados neste repositório.

## Método e alcance da auditoria

Foram inspecionados código, dados, traduções, tema, demos, configuração de build, workflow de publicação e scripts de verificação. O estado inicial do Git estava limpo. Os resultados executados estão em [Testing](TESTING.md). A auditoria anterior de setembro foi usada como histórico, com revalidação no código atual.

- **Observado:** comportamento ou estrutura diretamente presente no código.
- **Verificado:** resultado de comando ou simulação executada nesta auditoria.
- **Recomendado:** proposta ainda não implementada.
- **Não verificado:** depende de execução, produção, acesso ou medição não concluída.

Esta entrega documenta o projeto; os problemas encontrados continuam no código da aplicação. Não foram auditadas organizações Salesforce, contas de hospedagem, configurações remotas ou todos os destinos externos.

## Usuários e necessidades

| Público | Necessidade | Jornada principal |
| --- | --- | --- |
| Recrutamento | Entender posicionamento, trajetória e credenciais | Início → Experiência → Credenciais → Contato |
| Liderança de CRM e tecnologia | Avaliar capacidade de resolver problemas | Sobre → Expertise → Projetos → Demo |
| Parceiros e clientes | Conhecer o trabalho e iniciar uma conversa | Projetos → Contato → Canal externo |
| Mantenedor | Atualizar conteúdo sem duplicar interface | Dados e traduções → Build → Revisão → Publicação |

Esses públicos são inferidos da apresentação e dos canais do site; não há pesquisa de usuários anexada nem métricas de conversão implementadas.

## Escopo atual

| Capacidade | Estado observado | Evidência |
| --- | --- | --- |
| Sete seções da página inicial | Início, Sobre, Experiência, Credenciais, Expertise, Projetos e Contato | `src/App.jsx` |
| Três idiomas | PT, EN e ES; fallback PT e preferência local | `src/i18n.js` |
| Catálogo de projetos | 18 registros; 8 itens de primeiro nível | `src/data/portfolioProjects.js` |
| Demonstrações | 16 embeds: 6 demos CRM e 10 previews na coleção LWC | `ProjectDetailPage.jsx` |
| Projeto externo | Salesforce Skill Shine | `portfolioProjects.js` |
| Conteúdo profissional | 5 experiências, 6 grupos de credenciais, 6 categorias de expertise | `src/data/` |
| Contato | Links para canais externos e protocolos de contato | `Contact.jsx`, `profile.js` |
| Página sobre o projeto | Rota `/about-project` | `App.jsx`, `AboutProjectPage.jsx` |
| Currículo para download | Campo previsto; desativado por `resume: null` | `profile.js`, `Hero.jsx` |
| Publicação | Workflow de build e deploy para GitHub Pages | `.github/workflows/deploy.yml` |

## Requisitos funcionais e aceite

| ID | Requisito | Critério de aceite proposto | Situação |
| --- | --- | --- | --- |
| RF-01 | Apresentar posicionamento e trajetória | As sete seções têm título, conteúdo e navegação utilizável | Implementado; revisão visual de produção pendente |
| RF-02 | Alternar idiomas | Todos os textos de interface mudam; preferência persiste; idioma do HTML acompanha | Parcial: `lang` permanece PT no documento raiz |
| RF-03 | Abrir projetos | Cada ID resolve para link, coleção ou demo; ID inválido mostra retorno seguro | Implementado; validar fluxo completo no navegador |
| RF-04 | Abrir URLs diretamente | Refresh, nova aba e retorno preservam a seção/projeto em `/crm-specialist/` | Lacuna confirmada no consumo do redirecionamento |
| RF-05 | Navegar pela coleção LWC | Dez previews selecionáveis, com carregamento e indisponibilidade tratados | Implementado no componente |
| RF-06 | Iniciar contato | Cada link abre o canal indicado sem envio automático pelo site | Implementado no código |
| RF-07 | Manter conteúdo multilíngue | Chaves de interface equivalentes e conteúdo por idioma revisado | 103 chaves equivalentes por idioma; revisão linguística pendente |
| RF-08 | Explicar o projeto | Página técnica acessível pelo menu e por URL | Implementado; deep link requer teste integrado |

## Requisitos não funcionais

| ID | Objetivo | Critério proposto, ainda sem certificação |
| --- | --- | --- |
| RNF-01 | Acessibilidade | Navegação por teclado, foco perceptível, sem bloqueio em dialogs e idioma correto |
| RNF-02 | Responsividade | Validar 360, 768 e 1440 px; tabelas e demos não cortam ações |
| RNF-03 | Desempenho | Medir carregamento inicial e das demos; definir orçamento após baseline reproduzível |
| RNF-04 | Isolamento | HTML incorporado não acessa o documento pai nem seus dados de armazenamento |
| RNF-05 | Reprodutibilidade | Instalação por lockfile e build limpo com versão de Node documentada |
| RNF-06 | Qualidade | Pipeline executa verificações de comportamento antes da publicação |
| RNF-07 | Manutenibilidade | Rotas, tokens e contratos de dados têm uma fonte clara de verdade |

Não há baseline de Core Web Vitals, cobertura de testes ou disponibilidade operacional nesta auditoria. Esses valores não devem ser preenchidos com estimativas de aprovação.

## Registro consolidado de achados

P1 indica correção prioritária pelo impacto funcional ou pela fronteira de confiança; P2 indica melhoria planejada. Prioridade de manutenção não equivale a classificação CVSS.

| ID | Prioridade | Achado | Próxima ação e aceite |
| --- | --- | --- | --- |
| A-01 | P1 | `App` remove o redirecionamento antes de `SectionNavigation` lê-lo | Centralizar leitura; acesso direto a `/expertise` deve chegar à seção |
| A-02 | P1 | Iframe combina scripts e mesma origem | Isolar origem/permissões; verificar que a demo não lê o pai |
| A-03 | P1 | Smoke test depende de literal e função que não refletem o código atual | Testar comportamento; smoke válido executado no CI |
| A-04 | P1 | CI publica sem executar lint, smoke ou testes de comportamento | Adicionar etapas após corrigir baseline e impedir deploy em falha |
| A-05 | P2 | Idioma do elemento HTML não acompanha o seletor | Atualizar `document.documentElement.lang` e verificar PT/EN/ES |
| A-06 | P2 | Navegação desktop e embeds interceptam rolagem/teclas | Validar conteúdo longo, trackpad, teclado, dialogs e movimento reduzido |
| A-07 | P2 | Otimizador de imagens importa `sharp`, ausente do manifesto | Declarar ferramenta e comando; regeneração reproduzível |
| A-08 | P2 | README descreve `embedHtml` no catálogo, mas loaders estão no componente | Atualizar instruções e validar cadastro + loader |
| A-09 | P2 | Sitemap não inclui coleção LWC nem seus dez previews | Definir páginas indexáveis e sincronizar metadados e sitemap |
| A-10 | P2 | Checagem de formato falha em `newtext.md:434` | Corrigir whitespace em alteração específica |
| A-11 | P1 | Audit online aponta 8 dependências vulneráveis na árvore completa | Atualizar toolchain com revisão de compatibilidade e revalidar |

O status das dependências e os limites da análise estão em [Security](SECURITY.md). Não se reaplicam automaticamente os resultados da auditoria anterior.

## Sequência recomendada

1. Resolver A-01 e atualizar o smoke com cenários de seção, projeto e fallback.
2. Tratar A-02 preservando carregamento, altura e interação das demos.
3. Integrar verificações confiáveis ao CI, com falha bloqueando o deploy.
4. Corrigir idioma, revisar teclado/rolagem e atualizar cadastro de projetos e sitemap.
5. Medir experiência real e só então estabelecer metas de desempenho e conversão.

Autenticação, cadastro de clientes, envio de formulário, APIs Salesforce, banco de dados, CMS e analytics não fazem parte do produto implementado. Exigem novo escopo antes de se tornarem requisitos.

## Indicadores sugeridos

Como evolução opcional, medir abertura de demo, clique de contato e falha de carregamento. Hoje não há instrumentação desses eventos. Antes de adicionar coleta, definir finalidade, dados mínimos, acesso e retenção. Indicadores comerciais não podem ser inferidos dos números fictícios das demos.

## Fontes e documentos relacionados

- [README do projeto](../README.md), [entrada da aplicação](../src/App.jsx) e [catálogo](../src/data/portfolioProjects.js).
- [Architecture](ARCHITECTURE.md), [Database](DATABASE.md), [Design Style](DESIGN_STYLE.md).
- [Security](SECURITY.md), [Code Style](CODE_STYLE.md), [Testing](TESTING.md), [Agents](AGENTS.md).
- [Abrir auditoria interativa](index.html).
