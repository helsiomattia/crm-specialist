# Artigos do Blog

Crie uma publicação com:

```bash
npm run blog:new -- meu-primeiro-artigo
```

Se o comando `npm` não estiver disponível no terminal, use `node scripts/create-blog-post.mjs meu-primeiro-artigo`, a partir da raiz do projeto.

Edite `metadata.json` e `article.md` na pasta criada. O nome da pasta será o endereço do artigo. O modelo `_modelo` não aparece no site.

O estado inicial é `draft`. Altere para `published` para incluir o artigo no site e revisar localmente. A disponibilização no site público acontece no próximo build/deploy.

Instruções completas, exemplos e validação: [Guia do Blog](../../docs/BLOG.md) ou [versão HTML](../../docs/BLOG.html).
