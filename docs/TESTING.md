# Testing — Verificações e plano de qualidade

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Validação do Blog — 20/11/2026

A inclusão do Blog passou em 34 testes unitários, 83 verificações da suíte de navegador, validação de dados/traduções (127 chaves por idioma), lint, formato, smoke e build. A navegação foi conferida em larguras de 320, 390, 768 e 1440 px. A auditoria de dependências retornou zero alertas; as versões das dependências preexistentes foram preservadas.

O novo `npm run test:blog` constrói um site com conteúdo temporário isolado para verificar listagem, busca, categorias, leitura, histórico, teclado, Markdown, metadados e idiomas. Confirma também que rascunhos não entram no JavaScript ou no sitemap. Consulte o [guia do Blog](BLOG.md), [regressão do navegador](../audit/blog/browser-results.json), [teste dos artigos](../audit/blog/blog-results.json) e [auditoria de dependências](../audit/blog/dependencies.json). O estado entregue contém zero artigos publicados e um modelo ignorado pelo catálogo. Não houve execução remota de CI ou deploy nesta entrega.

## Atualização corretiva — 20/11/2026

A validação final passou: instalação limpa; 29 testes unitários; configuração Vite e 404 executados; 18 registros, 16 loaders reais e 103 chaves por idioma; lint, formato e build. O navegador usa um servidor estático com 404 real para o build e um servidor Vite para testar React StrictMode.

A suíte cobre desktop 1440 px e viewport mobile 390 px, deep links, refresh, histórico, nova aba, storage bloqueado, isolamento, abas, buscas/detalhes, altura, wheel, dez seleções LWC, mensagens inválidas e falhas de import/handshake. Teclado e animações ativas foram verificados no desenvolvimento. Não é uma auditoria completa de acessibilidade ou de todos os dispositivos.

```bash
npm ci
npm run check
npm run build
npx playwright install chromium
npm run test:browser
npm audit --audit-level=low
npm audit --omit=dev
```

No Windows foi usado Edge via `HM_BROWSER_PATH`; no CI está configurado Chromium com `--with-deps`. Node 22.22.2 nos dois ambientes. Resultados e comparação visual: [relatório de estabilização](STABILIZATION_REPORT.md). O workflow remoto não foi acionado. A-10 era uma quebra Markdown válida interpretada como erro pelo script; o texto não precisou mudar.

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Resultado executivo

O build de produção foi executado com sucesso. O lint básico passou; smoke e formato falharam por problemas já presentes no checkout. Não existe suíte de testes de comportamento no manifesto nem gate de testes no workflow de publicação.

Ambiente desta execução: Windows/PowerShell, Node 22.22.2 e npm 11.14.1. O npm não estava no PATH; foi utilizado o CLI disponível com a instalação local do Salesforce CLI. O CI do projeto usa Node 20, portanto o build local não comprova o mesmo resultado nesse ambiente remoto.

## Matriz de evidências executadas

| Verificação | Resultado | Interpretação |
| --- | --- | --- |
| Instalação equivalente a `npm ci` | Passou; 132 pacotes instalados | Lockfile instalável neste ambiente após liberar rede |
| `node node_modules/vite/bin/vite.js build` | Passou; 1.065 módulos transformados | Mesmo entrypoint de `npm run build` |
| `node scripts/lint-basic.mjs` | Passou no baseline | Somente regras simples do script |
| `node scripts/smoke-test.mjs` | Falhou | Literal esperado de base path não corresponde à configuração condicional |
| `node scripts/format-check.mjs` | Falhou | Whitespace em `newtext.md:434` |
| Parse e comparação dos locales | Passou | 103 chaves folha por idioma; conjuntos equivalentes |
| Catálogo e loaders | Passou | 16 loaders existentes e nenhum embed sem loader |
| Simulação do redirecionamento para Expertise | Reproduziu defeito | Seção resultante `home` após consumo da chave pelo App |
| Audit online do lockfile completo | Falhou com alertas | 8 dependências: 1 baixa, 2 moderadas, 5 altas |
| Audit online com `--omit=dev` | 0 vulnerabilidades reportadas | Resultado da consulta, não certificação de segurança |

O primeiro build no sandbox foi bloqueado por `spawn EPERM` do esbuild; a repetição autorizada fora dessa restrição passou. O primeiro `npm audit` no sandbox estava offline e retornou relatório nulo; foi descartado e substituído pelas consultas online. Não confundir limitações do ambiente com defeitos da aplicação.

O maior chunk individual listado no build foi MUI, aproximadamente 169,43 kB antes de gzip. Não houve aviso de chunk acima de 500 kB nessa execução. Isso não mede o total transferido na primeira navegação nem o desempenho em rede móvel.

## Por que o smoke atual falha

O script espera o texto literal `base: '/crm-specialist/'`; o arquivo atual usa `base: command === 'build' ? '/crm-specialist/' : '/'`. O teste rejeita uma configuração que efetivamente gerou o build correto.

Há ainda uma expectativa de `loadPortfolioProjectEmbed` em `portfolioProjects.js`, função ausente na implementação atual: os loaders estão em `ProjectDetailPage.jsx`. Essa segunda incompatibilidade é visível por inspeção, mas a execução aborta antes de alcançá-la.

Corrigir apenas o literal perpetuaria o problema. A recomendação A-03 é verificar base path e resolução de demos como comportamento, incluindo falhas reais de navegação.

## Reprodução do achado de rota

```text
1. Definir pathname = /crm-specialist/
2. Definir sessionStorage[crm-specialist-redirect] = expertise
3. Executar App.getAppRoute()
4. Executar SectionNavigation.getSectionFromLocation()

Esperado: rota home, seção expertise
Observado: rota home, seção home
```

A simulação executou as funções extraídas do código real com storage e location controlados. Não substitui o teste E2E com 404 da hospedagem, mas demonstra o consumo antecipado da chave sem depender de interpretação do README.

## Plano de testes recomendado

| Camada | Casos prioritários | Critério |
| --- | --- | --- |
| Rotas | Base path, alias skills, projeto, coleção, query, hash, ID desconhecido | Resultado único e previsível sem consumo duplicado |
| Dados | IDs únicos, parent válido, campos por kind, loaders existentes | Catálogo sem registros órfãos |
| Localização | Variante regional, fallback, chave ausente, troca de idioma e `lang` | Conteúdo e semântica acompanham idioma |
| Componentes | Loading/erro de import, projeto inválido, dialog e seletor | Estado correto e saída acessível |
| E2E | Deep link, refresh, back/forward, coleção e contato | Jornada completa no base path de produção |
| Acessibilidade | Tab, foco, Escape, zoom, contraste, movimento reduzido | Controles alcançáveis e conteúdo legível |
| Segurança | DOM/storage do pai inacessível pelo embed após correção | Fronteira de isolamento comprovada |
| Desempenho | Home, primeira demo, troca de demo, cache frio e quente | Baseline documentado antes de definir orçamento |

Ferramentas de teste de componentes, E2E e acessibilidade são propostas; nenhuma suíte adicional foi instalada no manifesto do produto. Não há percentual de cobertura medido.

## Roteiro manual da aplicação

1. Em 360, 768 e 1440 px, abrir home e percorrer as sete seções.
2. Trocar PT/EN/ES; recarregar; conferir preferência, texto e atributo `lang`.
3. Abrir os seis embeds principais e os dez previews LWC; conferir carregamento, rolagem e retorno.
4. Colar diretamente as URLs de seção, projeto e `/about-project`; recarregar e usar histórico.
5. Navegar por teclado, abrir/fechar dialog, retornar foco e ativar movimento reduzido.
6. Simular recurso indisponível e storage bloqueado; verificar recuperação.
7. Conferir links de contato e projeto externo, sem enviar mensagens de teste.

Esse roteiro é uma recomendação ainda não integralmente executada na aplicação publicada.

## Qualidade no CI

Após reparar as verificações existentes, inserir no workflow: instalação por lockfile, checagem de dados e rotas, lint/formato acordados, testes relevantes, auditoria de dependências e build. Somente artefato validado deve chegar ao deploy. Definir política explícita de exceções para advisories, com responsável e prazo, em vez de ignorar toda falha.

Comandos atuais executáveis em ambiente com npm:

```bash
npm ci
node scripts/lint-basic.mjs
node scripts/format-check.mjs
node scripts/smoke-test.mjs
npm audit --package-lock-only
npm audit --package-lock-only --omit=dev
npm run build
```

Alguns comandos falham no baseline pelas causas registradas. Não afirmar que o pipeline está verde enquanto isso persistir.

## Verificação da documentação entregue

As oito páginas são geradas a partir dos oito Markdown por `node docs/build-docs.mjs`. A documentação possui CSS e scripts locais; não usa fetch nem CDN para renderizar o conteúdo, e pode ser aberta por `docs/index.html`.

As nove páginas passaram na validação em Microsoft Edge headless, abertas por `file://`, nas larguras de 360, 768 e 1440 px, sem overflow horizontal da página. Foram verificados links locais, busca e estado vazio, filtros, persistência de tema após reload, índice, cópia de código, progresso de leitura, impressão e menu mobile. Não houve erro JavaScript nem requisição HTTP externa pelo portal. A leitura sem JavaScript também foi verificada. Os detalhes ficam em [evidências da documentação](audit-documentation.json).

As caixas de checklist dos documentos são planos ou critérios, não resultados automaticamente aprovados. A validação do portal da auditoria não substitui a validação da aplicação auditada.

## Fontes

[Smoke](../scripts/smoke-test.mjs) · [Lint](../scripts/lint-basic.mjs) · [Formato](../scripts/format-check.mjs) · [Workflow](../.github/workflows/deploy.yml) · [Dependências](audit-dependencies.json) · [Security](SECURITY.md).
