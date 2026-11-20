# Artigos do Blog

Crie uma publicação com:

```bash
npm run blog:new -- meu-primeiro-artigo
```

Se o comando `npm` não estiver disponível no terminal, use `node scripts/create-blog-post.mjs meu-primeiro-artigo`, a partir da raiz do projeto.

Edite `metadata.json` e `article.md` na pasta criada. O nome da pasta será o endereço do artigo. O modelo `_modelo` não aparece no site.

O estado inicial é `draft`. Use `npm run blog:preview` para revisar localmente. A liberação exige revisão factual e de confidencialidade, estado `ready` e aprovação identificada com `npm run blog:publish -- slug --reviewed-by "Nome do revisor"`. Esse comando altera apenas o catálogo local; não faz push ou deploy.

Os 18 artigos iniciais estão completos e em `ready`, aguardando revisão final do autor. As 60 pautas adicionais ficam em `content/editorial/backlog.json` e não são artigos publicados. Categorias, tags e nove séries são mantidas em `content/editorial/taxonomy.json`.

Instruções completas, exemplos e validação: [Guia do Blog](../../docs/BLOG.md) ou [versão HTML](../../docs/BLOG.html).
