Um agente pode responder com fluência e ainda utilizar o cliente errado, uma política antiga ou um documento fora do escopo do usuário. Preparar dados para IA exige tratar identidade, significado, atualização e acesso como partes do mesmo problema.

## Resolva identidade antes de personalizar

Uma organização pode ter vários registros da mesma pessoa ou empresa, com identificadores e vínculos diferentes. A unificação precisa de regras documentadas e avaliação de conflitos. Juntar registros incorretamente pode ser mais prejudicial que manter uma duplicidade conhecida.

Defina quais campos representam correspondência forte, quais servem apenas como indícios e quando uma revisão é necessária. Preserve a origem e a possibilidade de investigar como uma relação foi formada.

No contexto Salesforce, o nome Data Cloud permanece em materiais e configurações, enquanto a documentação atual apresenta Data 360. A referência de retrievers utilizada neste artigo segue essa nomenclatura atual. [Salesforce — Retrieve Data](https://help.salesforce.com/s/articleView?id=data.c360_a_ai_retriever.htm&language=en_US&type=5)

## Separe dados estruturados e conhecimento

Dados estruturados ajudam a consultar estado, contratos e relações. Documentos podem explicar políticas, procedimentos e exceções. As duas fontes têm ciclos de atualização e formas de validação diferentes.

Um campo de status precisa de definição e sistema responsável. Uma política precisa de versão, vigência e público autorizado. A qualidade deve ser avaliada conforme o uso, incluindo consistência e atualidade. [GOV.UK — The Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework)

Evite conectar um repositório inteiro antes de entender quem mantém o conteúdo. Uma base menor, com responsabilidade clara, pode ser mais adequada para um primeiro domínio.

## Entenda o papel de RAG e retrievers

Retrieval-Augmented Generation combina recuperação de informação com geração de resposta. No Salesforce, retrievers podem buscar dados relevantes em índices e fornecer contexto para prompts. [Salesforce — Retrieve Data](https://help.salesforce.com/s/articleView?id=data.c360_a_ai_retriever.htm&language=en_US&type=5)

Recuperar um trecho não prova que ele responde à pergunta ou que está correto. O desenho precisa avaliar tanto a seleção das fontes quanto a resposta produzida a partir delas.

Segmentação de documentos, filtros, metadados e quantidade de resultados influenciam o contexto. Essas escolhas devem ser testadas com perguntas representativas, e não apenas com exemplos que já se sabe onde encontrar.

## Preserve permissões em todo o percurso

O usuário deve receber apenas informações compatíveis com seu acesso. Verifique controles na origem, na recuperação e na apresentação. Um filtro aplicado somente depois que conteúdo restrito entrou no contexto pode ser insuficiente para o desenho de segurança.

Teste perfis com permissões diferentes e perguntas que tentem acessar informações de outra conta. Inclua documentos removidos, mudança de acesso e resultados armazenados em cache.

Referências às fontes ajudam a conferir respostas, mas não substituem autorização. Um link pode revelar a existência de um documento mesmo quando seu conteúdo não deveria estar acessível.

## Avalie recuperação e resposta separadamente

Em um cenário fictício de políticas de devolução, a avaliação deve verificar se o documento vigente foi recuperado, se a condição aplicável foi identificada e se a resposta respeitou o limite de atuação.

Inclua perguntas sem resposta disponível. Nesses casos, reconhecer insuficiência e encaminhar pode ser o comportamento correto. Forçar uma conclusão apenas para aumentar a taxa de respostas produzidas reduz confiabilidade.

Mantenha um conjunto de avaliação versionado e repita os casos relevantes após mudanças de conteúdo, índice ou instruções. Dados para IA exigem manutenção contínua: o conhecimento da organização muda, e a capacidade de detectar essa mudança faz parte da solução.
