Uma solicitação pode ser um Case, uma Opportunity ou um objeto customizado, dependendo do que a palavra significa no processo. A semelhança entre campos não resolve a escolha. O modelo precisa representar um conceito com ciclo de vida, responsabilidade e relações compreensíveis.

Começar pelo nome da tabela costuma antecipar a decisão. Comece pelo trabalho: quem cria a informação, quem pode alterá-la, o que caracteriza conclusão e quais capacidades da plataforma precisam reconhecer aquele registro.

## Descobrir a entidade por seu comportamento

Considere uma empresa fictícia que vende serviços e recebe pedidos de mudança depois da contratação. A oportunidade acompanha a negociação. A solicitação de mudança acompanha uma decisão posterior, com análise, aprovação e execução. Colocar tudo na mesma entidade pode misturar previsão comercial com obrigação operacional.

Por outro lado, criar um objeto customizado para qualquer diferença pode duplicar funções já atendidas por objetos padrão. A pergunta é se o conceito preserva o significado esperado do objeto e consegue aproveitar suas capacidades sem uma coleção de exceções artificiais.

Registre dois ou três cenários concretos antes de escolher. Se o mesmo registro precisar representar coisas incompatíveis, talvez existam entidades distintas ou uma fronteira ainda não compreendida.

## Avaliar o custo de cada alternativa

Um objeto padrão pode facilitar o uso de funcionalidades que dependem dele. Isso não autoriza supor que qualquer recurso estará disponível em qualquer edição ou licença. Verifique as condições do ambiente e os relacionamentos suportados.

Um objeto customizado oferece liberdade de modelagem, mas traz responsabilidade por relatórios, segurança, automações, integração, experiência e manutenção. A escolha deve considerar esse conjunto, e não apenas a rapidez de criar campos.

Descreva também o custo de desfazer a decisão. Migrar registros, reconstruir relacionamentos e alterar consumidores pode ser mais trabalhoso que a configuração inicial. Quando houver incerteza relevante, use dados sintéticos para validar o modelo antes de carregar o acervo.

## Relacionamentos expressam obrigações

Pergunte se um registro pode existir sem seu associado, se há múltiplos vínculos, quem controla acesso e como exclusões devem ser tratadas. Essas perguntas orientam a avaliação de lookup, master-detail e eventuais entidades de associação.

Não escolha o tipo de relacionamento apenas para obter um totalizador conveniente. Verifique suas consequências documentadas sobre propriedade, compartilhamento, dependência e exclusão no cenário real. Um vínculo estrutural difícil de remover pode ser inadequado para uma relação temporária de negócio.

Mantenha identificadores de integração com significado e unicidade definidos. Um código recebido de outro sistema não é automaticamente uma identidade global. Pode exigir composição com origem, unidade ou contexto para evitar colisões.

## Definir autoridade e atualização

A documentação de integração distingue padrões de processos, dados e virtualização. Isso permite avaliar quando consultar a origem, quando replicar informações e quando coordenar uma operação, sem pressupor que todo dado deve morar fisicamente no CRM. [Salesforce Architects — Integration Patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns.html).

No exemplo, a condição financeira pode pertencer ao ERP enquanto o acompanhamento da negociação pertence ao Salesforce. Estabeleça quem altera o valor oficial, como outros sistemas o consultam e qual defasagem é aceitável. Um campo copiado sem informação de atualização pode induzir uma aprovação incorreta.

A qualidade deve ser avaliada conforme a finalidade, princípio tratado no [GOV.UK — The Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework). Um cadastro suficiente para contato comercial pode ser insuficiente para conciliação financeira. O modelo precisa reconhecer essa diferença.

## Escala também nasce no desenho

Antes de implementar, estime volume, crescimento, concentração de registros e tipos de consulta. Pense nos caminhos de acesso mais utilizados e nas atualizações em massa. Limites e capacidade precisam ser conferidos na documentação vigente, evitando números memorizados.

Um campo de status genérico pode facilitar a primeira entrega e dificultar a investigação de estados intermediários. Já um histórico excessivamente detalhado pode ampliar custos e complexidade sem apoiar decisões. Escolha o nível de evidência necessário para operar e auditar o processo.

A revisão final deve incluir um pequeno glossário, um desenho de relacionamentos, exemplos de ciclo de vida e contratos com sistemas externos. Quando pessoas de negócio e tecnologia conseguem explicar o mesmo registro da mesma maneira, o modelo começa a cumprir seu papel. Essa clareza sustenta a [arquitetura operacional](/blog/salesforce-arquitetura-operacional) e torna os [indicadores mais interpretáveis](/blog/dados-decisoes).
