# Relatório de estabilização — HM.crm

> Execução local em 20/11/2026 · Base inicial: `cc01bc849c775c6cd68d499c7f49ebdfdee06ba5` · Windows, Node 22.22.2, npm 11.14.1, Microsoft Edge headless.

## A. Resumo executivo

Os cinco achados prioritários foram confirmados no checkout e corrigidos: A-01, A-02, A-03, A-04 e A-11. Rotas diretas preservam contexto; as demos executam em origem opaca; dados, loaders, traduções e comportamentos têm testes; o workflow exige verificações; a auditoria online passou de oito pacotes sinalizados para zero.

Foram preservados conteúdo profissional, catálogo de 18 registros, as 16 demos HTML, tema, fontes, cores, disposição dos componentes e animações do produto. A comparação por hash confirmou 65 arquivos protegidos sem alteração, incluindo HTMLs, imagens, dados profissionais, locales, tema e o guia visual anterior. Em `portfolioProjects.js`, a única mudança foi a extensão do import de tokens para permitir validação pelo Node.

O checkout começou sem alterações em arquivos rastreados e com os documentos da auditoria ainda não rastreados. Esses documentos foram mantidos e receberam atualizações pontuais; os JSON da auditoria original foram preservados. Não houve commit, push, deploy nem alteração remota. As mudanças permanecem locais para revisão.

Evidências: [estado inicial](../audit/stabilization/baseline/state.json), [qualidade](../audit/stabilization/quality-results.json), [navegador](../audit/stabilization/browser-results.json), [revisão de fontes](../audit/stabilization/source-review.json) e [comparador visual interativo](../audit/stabilization/visual-comparison.html).

## B. Correções realizadas

### A-01 — Roteamento: corrigido

**Causa raiz:** App e navegação interpretavam a localização separadamente e consumiam a mesma chave de sessionStorage. A inicialização dos ScrollTriggers também podia substituir a seção antes da sincronização. Na reprodução inicial, abrir Expertise terminava na raiz, com a seção 3.607,72 px abaixo do topo.

**Arquivos:** `src/utils/routes.js`, `src/main.jsx`, `src/App.jsx`, `public/404.html`, `SectionNavigation.jsx`, `Navbar.jsx`, `PortfolioProjects.jsx`, `ProjectDetailPage.jsx` e `AboutProjectPage.jsx`.

**Solução:** parser puro compartilhado; restauração única antes de montar React; transporte de pathname/query/hash pelo parâmetro reservado `__hm_route`; migração tolerante da chave antiga; validação de origem e base; builders de URLs compartilhados; proteção da sincronização inicial contra callbacks de scroll. Navegação programática preserva histórico e cliques modificados mantêm o comportamento nativo.

**Testes e resultado:** 15 testes unitários de rotas, roundtrip do 404 real em VM e navegador em base de produção. Home, Expertise, Projetos, Contato, Sobre o projeto, projeto, coleção, skills/hash, URL desconhecida, refresh, query, Back/Forward e Ctrl+clique passaram. Acesso direto final a Expertise preservou a URL e posicionou a seção a -0,28 px do topo. React StrictMode foi exercitado no servidor de desenvolvimento, também com localStorage e sessionStorage bloqueados.

**Risco residual:** GitHub Pages foi emulado por servidor local que devolve o 404 real. A hospedagem remota não foi alterada ou testada após publicação; validar uma vez quando houver deploy autorizado.

### A-02 — Isolamento dos embeds: corrigido

**Causa raiz:** `allow-scripts allow-same-origin` permitia acesso à origem do pai; medição e wheel dependiam do DOM interno.

**Arquivos:** `src/components/sections/ProjectDetailPage.jsx`, novo `src/utils/embedBridge.js` e novo `src/data/projectEmbeds.js`. Nenhum dos 16 HTMLs foi editado.

**Solução:** sandbox somente com `allow-scripts`. Bridge injetada no documento isolado mede sua altura e encaminha wheel quando não há um ancestral interno que possa rolar. O pai confere frame emissor, origem opaca, canal, token por documento e formato exato. Somente altura inteira de 1–20.000 px e delta finito até ±1.200 px são aceitos; mensagens são agrupadas por animation frame. Não há comandos de avaliação, navegação ou acesso arbitrário ao pai. O filho exige origin exato do pai; somente o pedido de medição para a origem opaca precisa de targetOrigin `*`.

Import indisponível, erro do iframe e ausência de handshake por dez segundos usam o estado de indisponibilidade já existente. Listeners, timers e frames agendados são limpos na troca/desmontagem.

**Testes e resultado:** cinco unitários do protocolo; as 16 demos em 1440 e 390 px; abas/painéis, busca e detalhes quando existentes; Escape ou botão de fechar conforme a função original; dez seleções da coleção LWC; altura sem corte; wheel; bloqueio de DOM/storage do pai e do storage próprio; rejeição de mensagens inválidas, tokens antigos, valores excessivos e comandos inesperados. Falha de import e ausência de handshake passaram.

**Risco residual:** a origem `null` não é identidade; source e token continuam obrigatórios. Uma demo pode usar recursos de CPU do navegador e enviar mensagens dentro dos limites permitidos; isso não é um ambiente para HTML arbitrário enviado por visitantes. Continuar revisando os arquivos incorporados.

### A-03 — Testes: corrigido

**Causa raiz:** smoke dependia de strings antigas da configuração e de um loader em arquivo incorreto; lint não analisava sintaxe JSX nem cada link individualmente.

**Arquivos:** scripts de smoke/lint/formato, `scripts/validate-data.mjs`, `scripts/lib/`, `scripts/browser-test.mjs`, `tests/`, manifesto e `.gitignore`.

**Solução:** configuração Vite executada; fluxo 404 executado; loaders reais importados via Vite; validações de IDs, variantes, campos localizados, parentId, ciclos, URLs, órfãos e traduções. Babel parser verifica sintaxe JS/JSX e proteção de cada link externo. Node test runner cobre casos positivos e negativos; Playwright cobre a aplicação compilada e o desenvolvimento.

**Testes e resultado:** 29 testes unitários, 18 registros, 16 loaders executados, 103 chaves por locale e 74 chamadas estáticas de tradução verificadas. Lint, formato e smoke passaram. A falha A-10 era um falso positivo para quebra Markdown de dois espaços; a regra foi corrigida sem editar `newtext.md`.

**Risco residual:** lint continua deliberadamente limitado, sem análise semântica completa ou percentual de cobertura. Presença de tradução não prova qualidade linguística. Testes de navegador verificam os fluxos descritos, não todas as combinações de estado.

### A-04 — Pipeline: corrigido na configuração local

**Causa raiz:** workflow instalava e compilava sem gates funcionais.

**Arquivo:** `.github/workflows/deploy.yml`.

**Solução:** PR, push em main e execução manual validam instalação por lockfile, dados, lint, formato, smoke, unitários, build, navegador e audit. Nenhuma etapa usa `continue-on-error`. Upload e deploy são condicionados a main e a evento que não seja PR; deploy depende do job de validação. Permissões globais são somente leitura; escrita de Pages e OIDC ficam no job de deploy.

**Dependência técnica da ordem:** os unitários rodam antes do build; o teste de navegador roda depois para exercitar os arquivos finais de `dist`, antes de qualquer publicação.

**Testes e resultado:** comandos equivalentes foram executados localmente com sucesso. Workflow e dependências entre jobs foram revisados. A execução real no GitHub Actions/Linux e o deploy estão **não verificados**, pois não foram autorizados push ou disparo remoto.

**Risco residual:** proteção de branch, regras de aprovação, permissões da conta e infraestrutura remota não foram auditadas.

### A-11 — Dependências e ambiente: corrigido

**Causa raiz:** Vite 5 fora das séries atualmente suportadas e transitivas com advisories; documentação, ambiente local e CI divergiam na versão Node.

**Arquivos:** `package.json`, `package-lock.json`, `.nvmrc`, `vite.config.js`, workflow e documentação.

**Solução:** menor salto para uma série Vite ainda coberta por segurança, atualizações direcionadas das transitivas vulneráveis, sem `audit fix --force`. Node 22.22.2 foi validado e alinhado em `engines`, `.nvmrc`, README e Actions. Dev/preview agora escutam somente em 127.0.0.1.

**Testes e resultado:** revisão do lockfile, instalação limpa de 141 pacotes, toda a suíte, build e consultas online. Zero advisories remanescentes na árvore completa e no filtro de produção. Mais detalhes abaixo.

**Risco residual:** Vite 6.4 recebe backports de segurança, não o conjunto completo de melhorias de versões novas. Manter acompanhamento de suporte e advisories; zero alertas hoje não dispensa novas auditorias.

## C. Dependências e compatibilidade

| Pacote sinalizado | Antes | Depois | Motivo |
| --- | --- | --- | --- |
| Vite | 5.4.21 | 6.4.6 | Correções e retorno a série com suporte de segurança |
| esbuild | 0.21.5 | 0.25.12 | Dependência compatível de Vite 6 |
| @babel/core | 7.29.0 | 7.29.13 | Advisory e dependências compatíveis |
| baseline-browser-mapping | 2.10.21 | 2.11.39 | Advisory |
| browserslist | 4.28.2 | 4.29.6 | Advisory |
| nanoid | 3.3.11 | 3.3.20 | Advisory |
| postcss | 8.5.10 | 8.5.33 | Advisory |
| source-map-js | 1.2.1 | 1.2.4 | Advisory |

A consulta inicial retornou oito pacotes sinalizados: uma severidade baixa, duas moderadas e cinco altas; não são necessariamente oito vulnerabilidades independentes. O filtro `--omit=dev` já retornava zero. As duas consultas finais retornaram zero. [Antes](../audit/stabilization/dependencies-before.json), [depois](../audit/stabilization/dependencies-after.json), [produção antes](../audit/stabilization/dependencies-production-before.json), [produção depois](../audit/stabilization/dependencies-production-after.json).

A série 6.4 ainda recebe backports de segurança; a escolha evitou migrar múltiplas majors e trocar o bundler nesta missão. O plugin React 4.7.0 existente aceita Vite 6. Foram revisadas mudanças de conditions, JSON, Sass, PostCSS e CommonJS; o projeto não tem configuração customizada de conditions, Sass ou PostCSS em TS/YAML. O build, os imports `?raw` e a UI passaram na nova versão. [Política oficial do Vite](https://vite.dev/releases), [guia de migração 5 → 6](https://v6.vite.dev/guide/migration).

Node 22 permanece na linha LTS suportada na consulta desta execução. Foi mantido o patch local 22.22.2 já disponível e testado, sem alegar que seja o patch mais recente. O CI deixou Node 20 e lê a mesma `.nvmrc`. [Ciclo oficial do Node](https://nodejs.org/en/about/previous-releases).

React/React DOM 18.3.1, MUI 5.18.0, Emotion 11.14.0/11.14.1, GSAP 3.15.0, i18next 26.3.5 e react-i18next 17.0.8 permaneceram iguais. Alguns auxiliares Babel compartilhados com ferramentas da árvore Emotion foram atualizados em versões compatíveis; não se afirma que todo pacote transitivo marcado como produção ficou idêntico. O diff também inclui binários opcionais do esbuild, dados de compatibilidade, utilitários exigidos pelo Vite e realocação de YAML sem mudar sua versão. [Diff de versões do lockfile](../audit/stabilization/dependency-changes.json).

Playwright 1.65.1 foi adicionado apenas para E2E. Babel parser 7.29.2, antes transitivo, foi declarado explicitamente para o lint. Não houve troca das bibliotecas visuais.

## D. Regressões e validação final

| Verificação executada | Resultado |
| --- | --- |
| Instalação limpa pelo lockfile | Passou; 141 pacotes |
| Dados e traduções | Passou; 18 registros, 16 loaders, 103 chaves/idioma |
| Lint de sintaxe e links | Passou |
| Formato | Passou, sem editar texto editorial |
| Smoke real de Vite/404 | Passou |
| Node test runner | 29 passaram, zero falhas |
| Build Vite 6.4.6 | Passou; 1.097 módulos; maior chunk aproximadamente 172,55 kB antes de gzip |
| Navegador | Suíte completa passou; 79 registros de verificação, zero erros JavaScript na execução final |
| StrictMode e ambos os storages bloqueados | Passou no desenvolvimento |
| Teclado e wheel com animações ativas | Passou |
| 16 demos desktop/mobile e coleção | Passou |
| Import indisponível e handshake ausente | Passou |
| Auditoria online completa / produção | 0 / 0 vulnerabilidades reportadas |
| Documentação e comparador HTML | 10 páginas, links, busca, tema, impressão, menu mobile e comparação interativa aprovados |
| CI remoto, deploy e dispositivos físicos | Não executados |

Durante a adaptação para Vite 6, o servidor usado exclusivamente para validar loaders disparava a otimização de dependências do cliente e era fechado antes do scan terminar. O verificador agora desativa essa otimização desnecessária; continua executando os imports reais.

Uma execução intermediária registrou `Cannot read properties of null (reading 'useContext')`, embora os cenários terminassem. O erro não se reproduziu nas rotas com rastreamento ampliado nem na repetição da suíte completa com reconstrução forçada do cache de desenvolvimento. A causa não foi comprovada; não foi aplicado um patch especulativo nem ignorado o erro no gate. O rastreamento agora registra URL e stack; uma nova ocorrência deve bloquear a publicação e ser investigada.

Falhas iniciais do próprio teste de coleção e timeout foram corrigidas aguardando a montagem do menu e interrompendo as mensagens de handshake de forma controlada. Nenhuma funcionalidade das demos foi removida para aprovar testes.

## E. Preservação visual

Foram comparadas 38 capturas: home completa (incluindo as sete seções), Sobre o projeto, coleção LWC e as 16 demos individuais, em 1440 e 390 px. Todas mantiveram as mesmas dimensões de página.

Home mobile e Sobre o projeto em ambas as larguras tiveram igualdade exata de pixels. Nas 34 capturas de projetos/coleção não houve pixel com diferença de canal superior a 16/255; existem diferenças menores de rasterização/composição, registradas no JSON. Na home desktop, 0,08822% dos pixels superaram esse limiar, concentrados na foto decorativa lateral inferior da seção Sobre: o baseline capturou a imagem lazy ainda ausente e a execução final a capturou carregada. O componente About e as imagens estão idênticos por hash; não houve mudança de conteúdo ou estilo para obter equivalência.

As primeiras capturas de página inteira do Edge deixaram regiões fora da viewport dos frames opacos sem rasterizar. A evidência final das demos foi obtida rolando e capturando trechos visíveis, compostos sem alterar a aplicação; elementos fixos do pai aparecem somente no primeiro trecho, como na captura original de página inteira.

Condições: mesmo Edge, largura, altura inicial de 900 px, idioma PT, seed/data controladas, movimento reduzido, animações CSS suspensas para a captura e fontes externas bloqueadas nos dois conjuntos. Portanto, esta comparação usa as mesmas fontes de fallback e não certifica renderização com Google Fonts online, todos os estados animados ou navegadores diferentes. Os testes funcionais separados exercitaram animações ativas.

Não foi detectada alteração de identidade ou geometria. Não se afirma igualdade absoluta de todos os pixels. Consulte o [comparador com seletor e controle de divisão](../audit/stabilization/visual-comparison.html) e [métricas por tela](../audit/stabilization/visual-comparison.json).

Os oito documentos originais e este relatório possuem versões HTML locais. O portal e o comparador passaram na verificação de links e interações em 360, 768 e 1440 px, sem requisições externas nem erros JavaScript. [Evidência da documentação atualizada](../audit/stabilization/docs-results.json).

## Verificação objetiva adicional de segurança

| Área | Observação e classificação |
| --- | --- |
| Credenciais | Nenhuma correspondência nas assinaturas de chaves privadas, tokens e credenciais literais examinadas em src, projects, public e dist. Busca genérica por password gerou somente propriedades de bibliotecas; não eram credenciais. Limite: não é varredura completa de histórico ou serviços externos. |
| Demos e clientes | HTMLs usam empresas/contatos genéricos, métricas de exemplo e identificadores demonstrativos; não foi localizada exportação de clientes. A origem sintética de cada valor não pode ser certificada apenas pelo código. |
| URLs | Catálogo externo validado como HTTPS; mailto/tel são contatos intencionais. Strings HTTP no build são namespaces XML/SVG e schema de sitemap, não downloads inseguros. |
| Storage | Redirect protegido por try/catch; navegação e detector de idioma exercitados com ambos os storages bloqueados. |
| Terceiros | Google Fonts continua externo; não foram encontradas chamadas de API de negócio nos HTMLs. Disponibilidade e privacidade dessas fontes são dependências conhecidas, não uma exploração confirmada. |
| Build | 51 arquivos esperados; sem docs, audit, testes, scripts, .env ou source maps publicados em dist. |
| Dev server | Bind alterado de 0.0.0.0 para 127.0.0.1; exposição em rede passa a exigir opção explícita. |

Não foram consultados cabeçalhos da hospedagem, políticas da conta ou histórico Git completo. CSP e revisão ampla de acessibilidade são recomendações preventivas, não vulnerabilidades confirmadas nesta execução.

## F. Pendências priorizadas

1. **Antes de publicar:** executar o workflow no GitHub em uma mudança autorizada e conferir deep links no host real. Não verificado nesta sessão; nenhum deploy foi feito.
2. **Se o erro transitório React voltar:** preservar URL/stack e investigar antes de liberar o artefato. A suíte final passou e o gate não ignora erros.
3. **Acessibilidade e compatibilidade:** sincronizar `html[lang]` na troca de idioma (A-05); complementar A-06 com leitores de tela, conteúdo longo, zoom e dispositivos de toque físicos. Desktop/mobile aqui significam viewports automatizadas no Edge.
4. **Manutenção secundária:** A-07, dependência do otimizador de imagens; A-09, política de sitemap para coleção e previews. Não afetam a execução corrigida dos cinco achados prioritários.

A-08 foi tratado ao atualizar instruções de loaders no README e nos documentos. A-10 foi tratado na regra de formato, preservando a quebra Markdown intencional. Manter revisões periódicas de versões suportadas e advisories.

