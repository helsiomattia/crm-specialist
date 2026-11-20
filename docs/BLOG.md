# Blog — Estrutura e guia de publicação

> Implementado em 20/11/2026. Área integrada ao HM.crm, preservando o glassmorphism e as páginas existentes.

## O que está pronto

O Blog fica em `/blog` no desenvolvimento e `/crm-specialist/blog` no site publicado. O acesso aparece na barra de navegação e no menu de seções. Cada artigo recebe uma página em `/blog/nome-do-artigo`.

A estrutura inclui listagem por data, busca por título/resumo/tema/tags, filtros por categoria, página de leitura, autor, data, idioma e tempo estimado de leitura. A busca ignora acentos e diferenças entre maiúsculas e minúsculas. Filtros ficam na URL e são recuperados ao voltar ou atualizar a página.

Como ainda não foram fornecidos artigos, a entrega mostra uma apresentação de Blog com mensagem de próximas publicações. Busca e filtros aparecem automaticamente quando houver artigos publicados. Os textos usados nos testes são temporários e não fazem parte do site entregue.

## Criar um artigo

Na raiz do projeto, execute:

```bash
npm run blog:new -- meu-primeiro-artigo
```

Alternativa quando `npm` não estiver no PATH do terminal:

```bash
node scripts/create-blog-post.mjs meu-primeiro-artigo
```

O comando cria um rascunho sem sobrescrever pastas existentes:

```text
content/blog/
  _modelo/
    metadata.json
    article.md
  meu-primeiro-artigo/
    metadata.json
    article.md
```

Use apenas letras minúsculas sem acentos, números e hífens no nome da pasta. Esse nome é o slug do artigo. Evite alterá-lo depois de publicar, pois links compartilhados dependem dele.

## Preencher os dados

Edite `metadata.json` na pasta do artigo:

```json
{
  "title": "O título do meu artigo",
  "excerpt": "Uma apresentação curta do conteúdo e do que o leitor vai aprender.",
  "date": "2026-11-20",
  "category": "Salesforce",
  "tags": ["CRM", "Arquitetura"],
  "author": "Helsio Mattia",
  "language": "pt",
  "status": "draft"
}
```

| Campo | Regra |
| --- | --- |
| `title` | Título obrigatório, apresentado no card e na página |
| `excerpt` | Resumo obrigatório, usado na listagem e nos metadados |
| `date` | Data válida em `YYYY-MM-DD`; usada para ordenar e exibir |
| `category` | Tema obrigatório; novos temas viram filtros automaticamente |
| `tags` | Lista de palavras; pode ser vazia |
| `author` | Nome exibido como autor |
| `language` | `pt`, `en` ou `es`, conforme o idioma real do artigo |
| `status` | `draft` para rascunho; `published` para incluir no build |

A data não agenda publicação automática. O campo `status` define a inclusão no build. Artigos são listados do mais recente para o mais antigo; em datas iguais, o slug desempata a ordem.

## Escrever o conteúdo

Edite `article.md`. O título já vem dos metadados; comece com a introdução e use `##` para seções e `###` para subseções.

```markdown
Introdução do artigo, com **destaques** e *ênfase* quando necessário.

## O contexto

Explique a ideia ou o problema.

- Primeiro ponto.
- Segundo ponto.

> Uma observação que merece destaque.

[Referência](https://developer.salesforce.com/docs)
```

O leitor aceita Markdown comum: parágrafos, títulos, listas, citações, links, imagens e blocos de código cercados por três crases. HTML embutido é ignorado; não é um editor MDX. Tabelas GFM e realce de sintaxe não foram adicionados nesta etapa.

Para uma imagem, salve o arquivo, por exemplo, em `public/blog/meu-primeiro-artigo/diagrama.webp` e use `![Descrição do diagrama](/blog/meu-primeiro-artigo/diagrama.webp)`. O leitor adapta caminhos iniciados por `/` à base do GitHub Pages. Arquivos em `public` são sempre públicos no build, mesmo quando o artigo ainda é um rascunho.

## Revisar e publicar

1. Escreva o conteúdo e preencha os metadados mantendo `status: draft` durante a preparação.
2. Quando quiser revisar a página local, altere para `status: published` e execute `npm run dev`.
3. Abra `http://127.0.0.1:5173/blog/meu-primeiro-artigo` e confira desktop/celular. Para voltar a ocultar, use `draft` novamente.
4. Execute `npm run validate:data`, `npm run check` e `npm run build` antes de enviar a alteração.
5. Publique pelo fluxo de GitHub Pages já existente no projeto. A criação ou edição local do artigo, sozinha, não altera o site público.

Não é necessário registrar cada artigo em um array, criar componentes ou adicionar rotas manualmente. O build descobre as pastas, valida o conteúdo e gera o catálogo, os carregadores de Markdown e as entradas de artigos no sitemap.

## Rascunhos e idiomas

Pastas iniciadas por `_` ou `.` são ignoradas. Rascunhos válidos são conferidos pelo validador, mas seus títulos e conteúdos não entram no catálogo nem nos arquivos JavaScript do build. Seus endereços apresentam a mensagem de artigo indisponível. Esse mecanismo não torna confidencial um arquivo versionado em um repositório público.

A interface do Blog acompanha os três idiomas existentes. O texto do artigo permanece no idioma em que foi escrito; não há tradução automática. Todos os artigos publicados são listados, independentemente do idioma selecionado na interface. Para publicar traduções, crie artigos com slugs diferentes e indique o `language` correspondente.

## Organização técnica

| Arquivo | Responsabilidade |
| --- | --- |
| `content/blog/<slug>/metadata.json` | Dados editoriais |
| `content/blog/<slug>/article.md` | Conteúdo do artigo |
| `scripts/create-blog-post.mjs` | Criação do rascunho a partir do modelo |
| `scripts/lib/blog-content.mjs` | Validação no build, catálogo virtual, loaders e sitemap |
| `src/utils/blog.js` | Contrato de dados, busca e datas |
| `src/components/blog/BlogPage.jsx` | Listagem, filtros e estado inicial |
| `src/components/blog/BlogArticlePage.jsx` | Carregamento e leitura do Markdown |
| `src/components/blog/BlogLayout.jsx` | Estrutura visual, foco e metadados da página |
| `src/utils/routes.js` | URLs do Blog e integração ao histórico existente |

O Blog usa o [react-markdown](https://github.com/remarkjs/react-markdown), renderizando elementos React com HTML desativado e transformação segura de URLs. O parser e o texto de cada artigo carregam sob demanda. Não foram adicionados banco de dados, login, comentários ou painel administrativo; a edição é feita pelos arquivos do repositório.

Título, descrição, canonical e metadados sociais são atualizados no navegador. A aplicação continua sendo uma SPA: crawlers que não executam JavaScript podem receber os metadados gerais do site. O sitemap inclui as URLs publicadas, mas esta entrega não implementa pré-renderização por artigo.

## Validação

O comando `npm run validate:data` agora também confere os artigos. `npm test` inclui datas inválidas, slugs, metadados obrigatórios, busca, ordenação, exclusão de rascunhos e rotas do Blog. `npm run test:browser` inclui entrada pela aba, refresh, histórico e artigo inexistente, inclusive com storage bloqueado e em desenvolvimento.

```bash
npm run build
npm run test:browser
npm run test:blog
```

`test:blog` cria conteúdo de teste em uma pasta temporária isolada e gera um build separado. Ele verifica busca, categorias, leitura por teclado, metadados, Markdown, rolagem de código, idiomas e ausência de rascunhos no JavaScript e no sitemap. Esse conteúdo não entra no `dist` de publicação. O workflow exige esse teste antes do envio do artefato ao GitHub Pages.

Evidências locais: [teste de publicação e leitura](../audit/blog/blog-results.json) e [regressão de navegação e demonstrações](../audit/blog/browser-results.json). As capturas `blog-list-*` e `blog-article-*` em `audit/blog` usam artigos de teste identificados como tal; `blog-empty-*` mostram o estado entregue.
