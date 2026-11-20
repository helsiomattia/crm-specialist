# Security — Segurança e fronteiras de confiança

## Extensão editorial — 20/11/2026

Markdown usa `react-markdown`, HTML desativado e transformação segura de URLs, tanto no React quanto na geração estática. Rascunhos, conteúdos confidenciais e artigos `ready` são excluídos dos arquivos públicos, busca e sitemap; o build editorial é bloqueado. O estado publicado exige aprovação identificada e revisões factual/de confidencialidade. A checagem automática não substitui a análise humana do conteúdo. Evidências e limites: [relatório do Blog](BLOG_IMPLEMENTATION_REPORT.md).

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Atualização corretiva — 20/11/2026

A-02: iframe com `sandbox="allow-scripts"`, origem opaca e token aleatório por documento. O pai exige `event.source`, origem `null`, canal, token e formato exato. Somente altura inteira entre 1 e 20.000 px ou delta finito até 1.200 px são aceitos; atualizações são agrupadas por frame. A origem `null` sozinha não identifica o emissor. O filho envia ao origin exato do pai; pedidos de medição ao frame opaco usam `*` sem dados sensíveis. Não há comandos arbitrários nem leitura direta do DOM interno pelo pai.

Falha de import, erro do iframe ou ausência de handshake por dez segundos exibem o estado de indisponibilidade existente. As 16 demos passaram em desktop/mobile com testes de isolamento, interação, altura, mensagens inválidas e rolagem. Tokens rejeitam mensagens de instâncias antigas; não autorizam outras operações.

A-11: Vite 6.4.6 e transitivas corrigidas. Auditoria online final: zero vulnerabilidades reportadas na árvore completa e com `--omit=dev`. O servidor Vite escuta somente em 127.0.0.1; o lint inspeciona links individualmente e o pipeline bloqueia advisories de severidade baixa ou superior. Isso não certifica ausência de falhas. Veja [auditoria atual](../audit/stabilization/dependencies-after.json), [produção](../audit/stabilization/dependencies-production-after.json) e [relatório de estabilização](STABILIZATION_REPORT.md).

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Conclusão

A aplicação é uma vitrine pública estática, sem autenticação, API de negócio ou banco. Os principais pontos de atenção são a execução de HTML incorporado com acesso à mesma origem e a cadeia de dependências de desenvolvimento. A auditoria não demonstra exploração ativa nem certifica ausência de vulnerabilidades.

**Consulta online do lockfile:** 8 dependências sinalizadas — 1 baixa, 2 moderadas e 5 altas. Com `--omit=dev`, o npm retornou 0 vulnerabilidades reportadas. Ambos os resultados são de 20/11/2026 e representam a base consultada, não uma garantia sobre segurança em produção. Evidência: [relatório JSON](audit-dependencies.json).

## Superfícies e limites

| Superfície | Entrada / confiança | Proteção observada | Limite |
| --- | --- | --- | --- |
| Conteúdo React | Arquivos locais revisados | Renderização de strings pelo React | URLs e futura entrada externa ainda precisam de validação |
| HTML de demos | Arquivos locais importados com `?raw` | Iframe com atributo sandbox | Scripts + mesma origem enfraquecem isolamento |
| Rotas | Pathname, hash e sessionStorage | Parsing manual | Duplicação, consumo antecipado e falta de tratamento de storage |
| Dependências | Registro npm e lockfile | `npm ci` no CI | Lockfile preserva versões também quando vulneráveis |
| Publicação | Push em main e execução manual | Actions, Pages e OIDC | Proteção de branch e acessos remotos não inspecionados |
| Recursos externos | Google Fonts e links públicos | Fontes explicitadas no HTML | Disponibilidade e metadados de requisição dependem de terceiros |

## A-02 — Isolamento insuficiente dos embeds

**Prioridade P1; risco alto se conteúdo não confiável for incorporado.** `ProjectDetailPage.jsx` utiliza `srcDoc={embedHtml}` e `sandbox="allow-scripts allow-same-origin"`. O pai acessa o documento interno para medir altura e interceptar wheel.

A combinação de scripts e mesma origem permite que conteúdo incorporado de mesma origem acesse o pai e comprometa a proteção pretendida pelo sandbox. A documentação do elemento descreve explicitamente essa limitação. [Referência MDN sobre iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).

Hoje os arquivos vêm do próprio repositório; não foi encontrada entrada de HTML fornecida por visitantes. A exploração exige, por exemplo, alteração maliciosa de uma demo ou futura incorporação de fonte não confiável. Isso reduz a exposição atual, mas não torna o sandbox uma fronteira de segurança efetiva.

**Recomendação:** escolher origem separada para demos ou remover `allow-same-origin`, adaptando a comunicação. Não remover a permissão isoladamente: a leitura de `contentDocument` e o cálculo de altura atual deixariam de funcionar.

Se houver comunicação via `postMessage`, validar `event.source`, formato, tipo de mensagem e limites de altura. Em origem própria, validar também a origem exata; em sandbox de origem opaca, a origem pode ser `null` e não serve como identidade. Tratar cada frame como emissor restrito e não aceitar comandos de navegação ou execução arbitrária.

**Aceite:** as 16 demos mantêm interação e tamanho utilizável; tentativas de ler DOM/storage do pai são bloqueadas; mensagens inválidas não alteram layout nem navegação.

## A-11 — Dependências sinalizadas

| Pacote sinalizado | Severidade retornada | Contexto nesta árvore |
| --- | --- | --- |
| `@babel/core` | Baixa | Transformação de código |
| `baseline-browser-mapping` | Moderada | Tooling de compatibilidade |
| `browserslist` | Alta | Tooling de compatibilidade |
| `esbuild` | Moderada | Build e desenvolvimento |
| `vite` | Alta | Toolchain; inclui propagação de dependência vulnerável |
| `nanoid` | Alta | Dependência transitiva do tooling no filtro analisado |
| `postcss` | Alta | Processamento CSS |
| `source-map-js` | Alta | Processamento de source maps |

A tabela contabiliza pacotes sinalizados, não oito explorações independentes: alguns registros agregam múltiplos advisories e dependências transitivas. O relatório JSON contém os detalhes, intervalos afetados e referências retornadas pelo registro.

**Prioridade P1.** Planejar atualização da toolchain em mudança própria, revisar diffs do lockfile e executar build e testes. O npm propõe atualização major de Vite para resolver toda a árvore; isso exige revisão de compatibilidade. Não foi executado `npm audit fix` nem alterado o manifesto nesta entrega.

Uma execução inicial no sandbox retornou zero enquanto `offline=true`, com relatório nulo. Esse resultado foi descartado. Os números acima vieram de consultas explícitas online. O comando `npm audit` consulta o registro e seu código de saída sinaliza vulnerabilidades; ele não substitui teste de exploração. [Documentação npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/).

## Controles existentes

- Lockfile versionado e instalação por `npm ci` no workflow.
- `.gitignore` cobre `.env`, `.env.*`, logs, cache e `node_modules`.
- Textos React renderizados como conteúdo, sem `dangerouslySetInnerHTML` encontrado em `src`.
- Demos escolhidas por mapa local de loaders, sem download de HTML de URL fornecida pelo visitante.
- Cleanup de listeners e observers em componentes, reduzindo efeitos residuais entre visitas.
- Links externos com medidas de relacionamento em vários componentes; o lint atual não verifica cada elemento individualmente.

A busca estática não é varredura completa de segredos. O histórico Git inteiro, arquivos remotos e configurações da conta não foram auditados.

## Recomendações adicionais

| Prioridade | Medida | Critério de conclusão |
| --- | --- | --- |
| P1 | Validar conteúdo de demos antes de incorporar | Somente fontes revisadas e dados demonstrativos |
| P1 | Incluir gates de segurança e comportamento no CI | Falha relevante impede publicação |
| P2 | Tratar indisponibilidade de storage | Página abre e navega com armazenamento bloqueado |
| P2 | Rever exposição do servidor Vite | Interface de rede e acesso adequados ao ambiente de desenvolvimento |
| P2 | Definir política de conteúdo e recursos externos | Avaliar CSP com Emotion, Google Fonts e scripts das demos antes de aplicá-la |
| P2 | Revisar links e dados publicados | Somente destinos esperados e conteúdo autorizado |

Não foi localizada uma política CSP no HTML raiz ou configuração equivalente no repositório. Cabeçalhos efetivos do host não foram consultados; não se afirma que todos os cabeçalhos de produção estejam ausentes.

## Dados, privacidade e incidentes

Nome, trajetória e contatos são conteúdo público intencional. A preferência de idioma e o caminho de redirecionamento ficam no navegador. Não foi observado coletor de analytics nem formulário de envio próprio em `src`. A fonte externa gera requisições a terceiros; avaliar hospedagem local de fontes se isso for requisito do produto.

Caso um segredo seja publicado, remover do código não basta: revogar ou rotacionar a credencial no serviço de origem, avaliar histórico e artefatos e registrar a correção. Não incluir credenciais, dados reais de clientes ou exportações de produção em demos e documentos. Esta orientação não representa parecer jurídico de conformidade.

## Revalidação

```bash
npm ci
npm audit --package-lock-only
npm audit --package-lock-only --omit=dev
npm run build
```

Executar com rede efetiva e registrar data, saída e versão da ferramenta. Confirmar o contexto de cada advisory e o uso real do pacote antes de concluir impacto no visitante.

## Fontes

[Iframe e loaders](../src/components/sections/ProjectDetailPage.jsx) · [Manifesto](../package.json) · [Lockfile](../package-lock.json) · [Workflow](../.github/workflows/deploy.yml) · [Relatório executado](audit-dependencies.json) · [Testing](TESTING.md).
