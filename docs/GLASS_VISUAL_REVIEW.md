# Glassmorphism — Revisão visual do HM.crm

> Validação local de 20/11/2026. Escopo autorizado: melhorar o visual sem alterar estrutura ou textos.

## Resultado

O site recebeu superfícies de vidro claro, bordas iluminadas, reflexos graduais e sombras em azul. Navegação, painéis, cards, diálogo de expertise e molduras das demonstrações compartilham o mesmo material. O fundo ganhou variações suaves em azul e ciano; os rótulos coloridos dos projetos e o botão principal ganharam tons mais escuros para leitura.

Abrir o [comparativo interativo de antes e depois](../audit/glass/index.html). Ele oferece dez páginas/seções em três larguras, com controle deslizante e seleção de versão.

## Limites da alteração

Foram preservados o conteúdo, a ordem das seções, o HTML/JSX estrutural, os tamanhos, os espaçamentos, as fontes, as rotas e os comportamentos. As 16 demonstrações HTML, imagens, traduções e dados não foram editados. Não houve alteração de dependências ou publicação nesta revisão.

A análise de AST comparou 19 arquivos JSX com a base Git, excluindo apenas atributos e propriedades de estilo `sx` e `style`. A comparação SHA-256 confirmou 72 arquivos protegidos, normalizando quebras de linha de arquivos de texto. Evidência: [integridade](../audit/glass/integrity.json).

## Material visual

O arquivo [glass.js](../src/theme/glass.js) centraliza estilos de superfície, sem definir geometria ou tipografia. A aplicação ocorre no [tema MUI](../src/theme/theme.js), nos componentes de apresentação e nos [estilos globais](../src/App.jsx).

| Material | Aplicação | Desfoque padrão | Até 599 px |
| --- | --- | --- | --- |
| `floating` | Navegação, menu e diálogo | 22 px | 12 px |
| `panel` | Painéis, contato e molduras | 16 px | 8 px |
| `card` | Cards internos | Nenhum | Nenhum |
| `dark` | Painéis técnicos escuros | 16 px | 8 px |

Cards usam transparência e reflexos sem acrescentar uma segunda camada de blur dentro do painel. O desfoque menor no celular limita a intensidade do efeito; não foi medido ganho de desempenho em dispositivo físico.

Com `prefers-reduced-transparency: reduce` ou `prefers-contrast: more`, as superfícies adotam fundo sólido e removem o desfoque. Existe também fallback por `@supports` para ausência de `backdrop-filter`. A preferência de movimento reduzido já existente foi preservada.

## Verificação executada

| Verificação | Resultado |
| --- | --- |
| Vite: build de produção | Aprovado |
| Dados e traduções | 18 entradas, 16 loaders, 103 chaves por idioma, 74 chamadas estáticas |
| Lint, formato e smoke | Aprovados |
| Testes unitários | 29 aprovados |
| Suíte de navegador existente | 79 verificações aprovadas, sem erros registrados |
| Comparação visual | 30 cenários; textos e seções idênticos |
| Geometria | Nenhuma diferença acima de 1 px nos elementos medidos |
| Overflow horizontal | Ausente nos 30 cenários |
| Preferências e interação | 11 verificações adicionais aprovadas |

A suíte de navegador cobriu rotas, atualização direta, histórico, novas abas, seleção da coleção LWC, as 16 demos em desktop/mobile, mensagens do iframe, falhas controladas, armazenamento indisponível e desenvolvimento com StrictMode. Evidência: [resultado do navegador](../audit/glass/browser-results.json).

As capturas cobrem início, sobre, experiência, credenciais, expertise, projetos, contato, sobre o projeto, LWC e Customer 360, em 1440, 768 e 390 px de largura e 1000 px de altura. Texto e geometria foram comparados automaticamente; telas representativas também passaram por inspeção visual. Evidência: [comparações](../audit/glass/comparison.json).

O diálogo de expertise foi aberto com Enter e fechado com Escape, com devolução de foco ao botão. Foram verificadas a troca dos três idiomas, a ausência de overflow e a substituição do material por fundo sólido sob as preferências emuladas. Evidência: [acessibilidade e preferências](../audit/glass/accessibility.json).

## Contraste e alcance da validação

| Amostra | Contraste calculado |
| --- | --- |
| Texto principal sobre `#DCE9F6` | 13,68:1 |
| Texto secundário sobre `#DCE9F6` | 6,87:1 |
| Azul de texto sobre `#DCE9F6` | 6,49:1 |
| Branco sobre início do gradiente do botão | 7,32:1 |
| Branco sobre fim do gradiente do botão | 4,71:1 |

Essas cinco amostras usam as cores declaradas. Não constituem varredura de todos os pixels, estados e textos do site. Os testes usam Edge/Chromium local, sem certificação completa WCAG, teste em Safari/Firefox ou medição em aparelho físico. O fallback de ausência de suporte foi inspecionado no CSS; as preferências de transparência e contraste foram efetivamente emuladas no navegador.

Capturas antes/depois bloqueiam fontes e recursos externos para usar as mesmas condições locais, com movimento reduzido. Não são um teste de disponibilidade desses serviços. A revisão preserva os achados históricos ainda aplicáveis da auditoria, incluindo o atributo `lang` da aplicação.

## Manutenção

Alterar o material em `src/theme/glass.js`; evitar duplicar receitas de blur em cada card. Manter os tokens de geometria existentes e revisar novamente capturas quando uma alteração visual afetar largura, altura ou fonte. O [guia visual](VISUAL_STYLE_GUIDE.md) registra a direção atual; a auditoria técnica original permanece como histórico.

Comandos executados com Node 22.22.2: `node scripts/validate-data.mjs`, `node scripts/lint-basic.mjs`, `node scripts/format-check.mjs`, `node scripts/smoke-test.mjs`, `node --test tests/*.test.mjs` e `node node_modules/vite/bin/vite.js build`. A suíte `scripts/browser-test.mjs` usou Edge instalado e `HM_TEST_OUTPUT=audit/glass`. O comando agregado `npm run check` esbarrou na ausência de npm no PATH desta sessão; seus verificadores foram executados diretamente e passaram.

## Referências de implementação

O material usa o comportamento documentado de [backdrop-filter — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), com fallback para [preferência de transparência reduzida — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency). As amostras de leitura usam como referência o critério de [contraste mínimo — W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
