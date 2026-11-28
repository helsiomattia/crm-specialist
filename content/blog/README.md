# Artigos do Blog

Crie uma publicação com:

```bash
npm run blog:new -- meu-primeiro-artigo
```

Se o comando `npm` não estiver disponível no terminal, use `node scripts/create-blog-post.mjs meu-primeiro-artigo`, a partir da raiz do projeto.

Edite `metadata.json` e `article.md` na pasta criada. O nome da pasta será o endereço do artigo. O modelo `_modelo` não aparece no site.

O estado inicial é `draft`. Use `npm run blog:preview` para revisar localmente. A liberação exige revisão factual e de confidencialidade, estado `ready` e aprovação identificada com `npm run blog:publish -- slug --reviewed-by "Nome do revisor"`. Esse comando altera apenas o catálogo local; não faz push ou deploy.

Em 28/11/2026, a biblioteca reúne 58 artigos em `published`: os 18 originais preservados e 40 novos textos. O conteúdo está disponível no catálogo local e no build de produção; a liberação não faz deploy remoto. Os corpos são originais em português, com títulos e resumos PT/EN/ES.

O [mapa de cobertura](../editorial/coverage-2026-11-28.json) relaciona as 67 linhas do arquivo fornecido aos artigos existentes e novos, explicitando o escopo de cada relação. A cobertura é introdutória e aplicada; não representa um tutorial exaustivo de cada recurso. Os sete novos artigos de projetos estão identificados como propostas.

Das 60 pautas em `content/editorial/backlog.json`, 18 foram associadas a artigos concluídos e 42 continuam como ideias. As demais publicações novas derivam do mapa ampliado de conhecimento. Categorias, tags e nove séries são mantidas em `content/editorial/taxonomy.json`. A revisão e os hashes dos originais estão em [audit/editorial-expansion](../../audit/editorial-expansion/README.md).

Instruções completas, exemplos e validação: [Guia do Blog](../../docs/BLOG.md) ou [versão HTML](../../docs/BLOG.html).
