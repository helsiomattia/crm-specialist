# Design Style — Identidade e interface

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Atualização corretiva — 20/11/2026

A estabilização técnica preserva tema, tokens, tipografia, componentes visuais, textos e os 16 HTMLs. As correções estão na navegação e na comunicação dos embeds. O [relatório de estabilização](STABILIZATION_REPORT.md) registra as comparações em desktop/mobile e seus limites.

Os critérios abaixo continuam como referência visual. A-05 (atributo lang) e aspectos de acessibilidade fora da cobertura descrita não foram alterados silenciosamente nesta missão.

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Direção visual observada

A identidade usa a metáfora de uma sala de controle de CRM: azul escuro estrutural, superfícies claras, sinais em ciano, painéis e conteúdo técnico organizado. A assinatura é `HM.crm`. O tema global está em modo claro; não existe alternância de tema na aplicação principal.

Este documento complementa o [guia visual existente](VISUAL_STYLE_GUIDE.md), confrontando-o com [tokens](../src/theme/tokens.js), [tema MUI](../src/theme/theme.js) e [estilos globais](../src/App.jsx). O tema escuro do portal desta auditoria é um recurso da documentação.

## Paleta oficial no código

| Token | Cor | Uso |
| --- | --- | --- |
| `commandNavy` | `#061827` | Estrutura, cockpit e contraste |
| `commandNavySoft` | `#17364F` | Variação de estrutura e títulos |
| `textPrimary` | `#141D2E` | Texto principal |
| `textSecondary` | `#3F4E62` | Texto secundário |
| `salesforceCore` | `#0D4DA5` | Ações principais e estados ativos |
| `flowCyan` | `#1EACB8` | Conexões e acentos |
| `appBackground` | `#F5F7F9` | Fundo geral |
| `consoleMist` | `#E0ECF5` | Superfícies auxiliares |
| `surfaceWhite` | `#FFFFFF` | Cards e leitura |
| `signalAmber` | `#B7791F` | Marcos e automação |
| `successGreen` | `#0B8F61` | Sinais de sucesso |
| `serviceBlue` | `#0B78B6` | Contexto de atendimento |

Existem tokens legados (`salesforceLegacy`, `flowCyanLegacy`) e cores locais em componentes e projetos. As cores semânticas `success`, `warning` e `error` do tema nem sempre são iguais aos sinais de `tokens.js`; unificar significados antes de substituir valores em massa.

O gradiente corrente é `linear-gradient(135deg, #0D4DA5 0%, #1EACB8 100%)`. Texto branco sobre trechos claros de gradientes e acentos precisa de medição de contraste no contexto real; a existência do token não certifica acessibilidade.

## Tipografia e hierarquia

| Elemento | Implementação observada | Orientação de manutenção |
| --- | --- | --- |
| Corpo | Inter, com Roboto/Helvetica/Arial como fallback; peso 450 | Priorizar leitura e linhas confortáveis |
| Títulos | Pesos 720–850 no tema; tracking negativo | Manter hierarquia sem depender só do tamanho |
| Título de seção | `SectionTitle` usa `h2`; 2rem, 2.35rem e 3rem por breakpoint | Reusar a estrutura existente |
| Telemetria | Fira Code em trechos técnicos | Reservar para códigos, rotas e dados curtos |
| Botões | Sem uppercase automática, peso entre 600 e 700 | Texto deve nomear a ação |
| Labels pequenos | Há valores abaixo de 0.8rem em menus e chips | Revisar legibilidade, zoom e densidade |

O HTML carrega Inter 400/500/600/700/800 e Fira Code 400/500/600 pelo Google Fonts. Alguns pesos solicitados no tema são intermediários ou superiores aos carregados; revisar o resultado renderizado ou alinhar a fonte disponível. Não houve medição visual de todas essas combinações nesta auditoria.

## Espaçamento, forma e estados

| Propriedade | Valor atual |
| --- | --- |
| Largura máxima global | `--page-max-width: 1380px` |
| Padding horizontal de seção | `clamp(20px, 4.6vw, 76px)` |
| Padding vertical de seção | `clamp(40px, 6vh, 72px)` |
| Intervalo de cards | `clamp(14px, 1.45vw, 24px)` |
| Raio de controle | 8 px |
| Raio de card | 18 px |
| Raio de painel | 28 px |
| Raio circular | 999 px |
| Movimento rápido | 180 ms |
| Movimento normal | 240 ms |
| Movimento deliberado | 420 ms |

Cards usam borda, sombra leve e elevação curta no hover. Botões e ícones possuem foco visível. O loading de páginas e seções usa um sinal horizontal com `role="status"`; o texto de carregamento no `App` está fixo em português e deve acompanhar a internacionalização numa revisão futura.

## Componentes e composição

| Componente | Papel |
| --- | --- |
| `Navbar` e `SectionNavigation` | Marca, idioma, seções e estado da navegação |
| `SectionTitle` | Overline, título semântico, subtítulo e divisor |
| `OperationalSignal` | Vocabulário visual de operação, dados e automação |
| `AnimatedBox` | Entrada com GSAP/ScrollTrigger e cleanup |
| `Hero` | Proposta de valor, CTAs e cockpit |
| `Skills` | Mapa de capacidades e dialog de detalhe |
| `PortfolioProjects` | Cards dos projetos de primeiro nível |
| `ProjectDetailPage` | Navegação da coleção e iframe da demo |

Os HTMLs em `projects/` têm estilos próprios, incluindo inline handlers e scripts. Eles não herdam automaticamente o tema MUI nem as preferências de idioma da aplicação.

## Acessibilidade e movimento

**Observado:** `prefers-reduced-motion` nos estilos globais e em animações; títulos de seção visíveis; `aria-pressed` no seletor de idioma; título no iframe; limpeza de observers e listeners em vários componentes.

**Achados:** A-05 — o documento raiz continua `pt-BR` após troca de idioma. A-06 — `SectionNavigation` intercepta wheel e teclas em desktop a partir de 1024 px quando movimento reduzido está desligado; `ProjectDetailPage` redireciona wheel do iframe ao documento pai. As proteções existentes para alvos interativos não substituem teste com conteúdo longo e tecnologias assistivas.

**Recomendado:** sincronizar `lang`; verificar contraste, zoom de 200%, ordem de foco, fechamento e retorno de foco nos dialogs, gesto de trackpad e navegação interna das demos. Não declarar conformidade de acessibilidade com base apenas na leitura do JSX.

## Checklist de aceite visual

- [ ] Layout validado em 360, 768 e 1440 px, com textos PT/EN/ES.
- [ ] Foco e nomes acessíveis verificados em links, botões e seletor de idiomas.
- [ ] Tabelas, menus LWC e drawers utilizáveis sem corte das ações.
- [ ] Redução de movimento preserva conteúdo e interação.
- [ ] Textos e ações mantêm legibilidade com zoom e alto contraste.
- [ ] Loading, conteúdo indisponível e projeto desconhecido têm saída clara.
- [ ] Fontes e imagens em falha não impedem leitura e contato.

Checklist é plano de validação; caixas abertas não representam testes aprovados.

## Manutenção

Adicionar cores recorrentes em `tokens.js`, regras gerais em `theme.js`, textos fixos nos três `common.json` e conteúdo profissional em `src/data`. Evitar duplicar valores semânticos entre CSS global e `sx`. Registrar exceções das demos em vez de tentar aplicar o tema React a documentos isolados sem revisão.

Para atualizar a versão HTML desta documentação, executar `node docs/build-docs.mjs`. O gerador utiliza os oito Markdown como fonte e preserva o guia visual anterior.

## Referências

[Tema](../src/theme/theme.js) · [Tokens](../src/theme/tokens.js) · [SectionTitle](../src/components/ui/SectionTitle.jsx) · [AnimatedBox](../src/components/ui/AnimatedBox.jsx) · [Testing](TESTING.md) · [PRD](PRD.md).
