# Code Style — Convenções e manutenção

> Auditoria de 20/11/2026 · Projeto HM.crm · Base: commit `cc01bc8`.

## Blog — 20/11/2026

Artigos são mantidos em `content/blog/<slug>/metadata.json` e `article.md`. Use `npm run blog:new -- nome-do-artigo` para criar um rascunho. O catálogo e os loaders são gerados pelo plugin em `scripts/lib/blog-content.mjs`, sem cadastro manual de componentes. Consulte o [guia do Blog](BLOG.md) para edição, publicação e testes.

## Atualização corretiva — 20/11/2026

Rotas ficam em `src/utils/routes.js`, loaders em `src/data/projectEmbeds.js` e a fronteira do iframe em `src/utils/embedBridge.js`. Manter seus testes de comportamento em `tests/`.

O manifesto oferece `validate:data`, `lint`, `format:check`, `test:smoke`, `test`, `test:browser` e `check`. O lint usa Babel para sintaxe JS/JSX, scripts inline e proteção individual de links externos; não equivale a uma análise semântica completa. O formato aceita os dois espaços intencionais de quebra Markdown; `newtext.md` foi preservado.

Use Node 22.22.2 e `npm ci`. Playwright é dependência de testes; Babel parser é dependência explícita do verificador. A pendência A-07 do otimizador de imagens ficou fora desta correção. Veja o [relatório de estabilização](STABILIZATION_REPORT.md).

> A partir da próxima seção, preserva-se o snapshot histórico do commit cc01bc8. As atualizações acima prevalecem para o comportamento atual; achados históricos não são automaticamente pendências atuais.

## Padrão observado

O projeto utiliza JavaScript ESM e JSX, componentes funcionais React e hooks. Não foi encontrado TypeScript, configuração ESLint ou Prettier. Há verificadores próprios, mas eles não equivalem a análise semântica ou formatação completa.

| Aspecto | Convenção predominante |
| --- | --- |
| Componentes e arquivos JSX | PascalCase; exportação default do componente principal |
| Funções e variáveis | camelCase |
| Constantes de configuração | UPPER_SNAKE_CASE em vários módulos |
| Strings | Aspas simples em JavaScript, duplas em atributos JSX |
| Indentação | Dois espaços |
| Final de instrução | Ponto e vírgula |
| Dados | Exports nomeados em `src/data` |
| Estilo | MUI `sx`, tema e tokens; CSS global no `App` |
| Comentários | Uso pontual de JSDoc e explicações de contexto |

São padrões encontrados, não regras impostas automaticamente em todos os arquivos. Os HTMLs de demonstração têm convenções próprias e algumas linhas muito longas.

## Responsabilidade de cada camada

- Manter estrutura visual e estado de interação em componentes.
- Manter conteúdo profissional em `src/data`; evitar novas cópias em JSX.
- Colocar textos fixos em PT/EN/ES nos arquivos `common.json`.
- Usar `getLocalizedString` e `getLocalizedStringArray` para conteúdo localizado.
- Colocar cores e formas recorrentes em `tokens.js`, com regras compartilhadas no tema.
- Extrair utilitário quando existir comportamento comum real; garantir que os consumidores o utilizem.

O último ponto importa para rotas: `src/utils/routes.js` existe, porém `App` e navegação ainda duplicam o parsing. Criar um helper sem migrar consumidores mantém duas fontes de verdade (A-01).

## React, estado e efeitos

Preferir componentes com responsabilidade identificável, valores derivados sem estado redundante e IDs estáveis como `key`. Toda assinatura de evento, timer, animação ou observer deve ter cleanup simétrico. `AnimatedBox` já usa `gsap.context()` com `ctx.revert()`; o detalhe de projeto já cancela atualizações de imports após troca de seleção.

Não consumir ou remover estado externo em funções tratadas como inicialização pura de React. A leitura destrutiva de sessionStorage em `getAppRoute` deve ser revista tanto pela perda de seção quanto pelo uso sob `StrictMode`.

Componentes extensos como `Hero`, `Contact` e `ProjectDetailPage` podem ser divididos quando a extração facilitar leitura ou teste de responsabilidade; evitar refatoração puramente cosmética durante correções pequenas.

## Internacionalização

Exemplo compatível com o catálogo atual:

```js
title: {
  pt: 'Meu projeto',
  en: 'My project',
  es: 'Mi proyecto',
},
```

Revisar labels acessíveis, loading, tooltips e mensagens vazias junto do texto visível. A equivalência de chaves não cobre strings fixas em português dentro de JSX nem garante tradução das demos.

## Inclusão de um projeto

1. Adicionar registro de ID único em `src/data/portfolioProjects.js`.
2. Definir `kind` e campos da variante: URL externa, embed ou coleção.
3. Para embed, salvar HTML em `projects/` ou `projects/lwc/` e adicionar import dinâmico ao mapa em `ProjectDetailPage.jsx`.
4. Para filho, definir `parentId` de coleção existente.
5. Preencher PT/EN/ES, tags, aparência e labels da ação.
6. Revisar isolamento, conteúdo público e interações da demo.
7. Validar navegação, acesso direto, build e eventual inclusão no sitemap.

O procedimento difere do README antigo, que ainda menciona `embedHtml` no registro. Não adicionar essa propriedade supondo que o componente atual irá consumi-la.

## Estilo seguro e acessível

Preferir elementos semânticos e controles nativos. Botões acionam comportamentos; links navegam. Manter nome acessível e foco visível, inclusive em ícones. Não aplicar parsing HTML a strings de conteúdo sem uma necessidade e uma fronteira de confiança definidas.

Para novas animações, respeitar redução de movimento e restaurar estado no cleanup. Um campo de texto, dialog ou menu não deve perder a interação para atalhos globais. Exceções exigem verificação de comportamento, não somente aparência.

## Ferramentas atuais e limitações

| Script | O que realmente faz | Limitação |
| --- | --- | --- |
| `lint-basic.mjs` | Procura referência obsoleta e combinações de target/rel | Avalia o arquivo inteiro; pode ignorar um link inseguro se outro tiver rel correto |
| `format-check.mjs` | Detecta whitespace ao final de linhas | Não normaliza nem verifica convenções completas; ignora `.mjs` |
| `smoke-test.mjs` | Busca literais e faz parse de JSON | Literais desatualizados; não testa o navegador |
| `optimize-images.mjs` | Gera WebP/AVIF com sharp | `sharp` não está declarado no manifesto |

`lint-basic` e `format-check` percorrem arquivos da documentação, mas suas listas de extensões não incluem `.mjs`. O gerador HTML desta entrega deve ter sintaxe validada com `node --check docs/build-docs.mjs`.

## Evolução recomendada

Adotar uma configuração única de lint e formato apenas em alteração dedicada, preservando escopo e evitando reformatar todo o repositório junto de uma correção funcional. Registrar versão de Node, expor scripts de qualidade no manifesto e integrar testes úteis ao CI. A ferramenta escolhida deve validar comportamento relevante ou eliminar erro recorrente.

## Critério para revisão

- [ ] Diff focado, sem apagar alterações de outras pessoas.
- [ ] Dados e textos na camada correta; PT/EN/ES considerados.
- [ ] Sem IDs órfãos ou quebra de deep links existentes.
- [ ] Eventos e observers limpos após desmontagem.
- [ ] Estados de loading, erro e conteúdo vazio tratados.
- [ ] Verificações executadas e limitações registradas com clareza.
- [ ] Mudanças de arquitetura refletidas nesta auditoria.

## Fontes

[Scripts](../scripts/lint-basic.mjs) · [Localização](../src/utils/i18nHelper.js) · [Tokens](../src/theme/tokens.js) · [Catálogo](../src/data/portfolioProjects.js) · [Architecture](ARCHITECTURE.md) · [Agents](AGENTS.md).
