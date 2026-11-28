O aviso de armazenamento próximo do limite costuma provocar uma busca urgente por registros antigos. Mas antiguidade, sozinha, não diz se um registro pode ser removido. Ele pode explicar uma decisão, sustentar uma obrigação ou manter relacionamentos utilizados por relatórios e integrações.

Otimizar plataforma exige separar consumo, utilidade e responsabilidade. A redução de custo deve preservar o que a operação precisa compreender e executar, com uma política explícita para o que deixa de permanecer no ambiente principal.

## Inventariar antes de escolher a intervenção

A Salesforce diferencia armazenamento de dados e de arquivos, com alocações dependentes da edição e de licenças. A documentação é a referência para identificar quais componentes entram em cada medida e quais condições se aplicam. Não use uma tabela antiga como promessa de capacidade. [Salesforce — Data and File Storage Allocations](https://help.salesforce.com/s/articleView?id=limits.htm&language=en_US&type=5).

Comece por um inventário: objetos com maior crescimento, arquivos e versões, registros de integração, histórico operacional e responsáveis. Relacione consumo atual com tendência, não apenas com o total de hoje.

Considere uma organização fictícia cujo crescimento vem principalmente de anexos repetidos. Apagar Cases antigos pode reduzir pouco o consumo relevante e destruir contexto de atendimento. O diagnóstico precisa localizar o mecanismo que gera o volume.

## Definir retenção pela finalidade

Para cada classe de informação, descreva uso operacional, necessidade histórica, dependências e responsável pela decisão de retenção. Exigências contratuais e legais devem ser confirmadas pelas áreas competentes; este roteiro não estabelece prazos jurídicos.

Uma política pode distinguir conteúdo ativo, histórico consultável e material elegível para descarte. Defina como reconhecer cada estado e como tratar exceções. Uma data de criação não representa necessariamente a última utilização ou o encerramento de uma obrigação.

Também identifique cópias. Mover informação para outro repositório sem controlar quem mantém o original pode aumentar, em vez de reduzir, exposição e inconsistência.

## Distinguir backup, arquivamento e exclusão

Backup apoia recuperação sob condições definidas. Arquivamento preserva acesso histórico segundo uma política. Exclusão remove informação do escopo atingido. Uma capacidade não deve ser presumida a partir da outra.

Antes de arquivar, teste a consulta necessária: quem pode localizar o registro, quais relacionamentos continuam compreensíveis e em quanto tempo a informação pode ser recuperada. Uma exportação que ninguém consegue interpretar é uma saída de dados, não necessariamente uma solução de arquivo.

Antes de excluir, verifique dependências e critérios de seleção em ambiente apropriado. Produza uma amostra revisável, estime impacto, defina autorização e registre o resultado. O artigo recomenda um processo de decisão; não executa nem sugere uma exclusão indiscriminada.

## Revisar licenças pelo trabalho autorizado

Uma licença deve ser compatível com as funções que a pessoa ou integração precisa realizar. Login recente é apenas um sinal: pode haver uso sazonal, automações ou acesso indireto que exijam investigação.

Mapeie capacidades necessárias, recursos contratados, permissões efetivas e responsáveis. Confirme regras de contratação e de reatribuição vigentes antes de recomendar mudanças. Diminuir licença sem verificar funcionalidade pode transferir custo para trabalho manual ou interromper um processo.

Não trate conta desativada, licença disponível e integração desnecessária como sinônimos. Cada situação exige identificar dependências, propriedade dos dados e procedimento de transição.

## Comparar economia com esforço de sustentação

A análise deve incluir custo de arquivo, consultas, exportação, recuperação, manutenção e eventual saída. O princípio de custo total considera o esforço para operar componentes, além do preço de contratação. [AWS Well-Architected — Analyze total cost of ownership](https://docs.aws.amazon.com/wellarchitected/latest/framework/cost05-bp03.html).

No cenário fictício, manter uma réplica externa pode reduzir consumo na plataforma e criar uma integração permanente. Compare esse custo com remover duplicações na origem, revisar anexos ou ajustar a política de geração de dados. A alternativa mais sofisticada não é automaticamente a mais econômica.

A entrega mínima é um inventário de crescimento, uma política por classe de informação e uma revisão de licenças apoiada em tarefas. Acompanhe se a intervenção resolveu a causa e se o histórico continua utilizável. Essa disciplina complementa a análise de [custo além da licença](/blog/custo-alem-licenca) e preserva o [papel do CRM na operação](/blog/salesforce-arquitetura-operacional).
