Um Flow pequeno pode funcionar isoladamente e produzir efeitos difíceis de explicar quando encontra outras automações no mesmo objeto. O problema costuma aparecer meses depois, quando ninguém sabe qual caminho alterou o registro ou por que uma integração recebeu duas solicitações.

Manutenibilidade depende de contratos e responsabilidades. Antes de adicionar outro Flow, inventarie o comportamento existente e identifique a decisão que precisa mudar. A quantidade de elementos no canvas é apenas um sinal; dependências invisíveis podem tornar um diagrama curto bastante complexo.

## Separar interação, decisão e execução

Um Screen Flow orienta uma pessoa durante uma tarefa. Uma automação disparada por registro reage a mudanças. Apex invocável pode oferecer uma capacidade programática a um fluxo. Escolher entre essas peças exige entender o contexto de execução e o custo de manutenção.

O guia arquitetural de automação considera complexidade, densidade de automação e possibilidades de combinação entre recursos declarativos e código. Não existe uma regra universal baseada apenas no número de Flows. Consulte [Salesforce Architects — Record-Triggered Automation](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html).

Considere uma solicitação fictícia de desconto. A tela coleta justificativa; uma política determina elegibilidade; uma execução registra a decisão e inicia o encaminhamento. A política não deveria existir somente na tela se integrações também puderem solicitar o mesmo desconto.

## Definir um contrato pequeno e explícito

Documente entradas, pré-condições, resultado e efeitos. “Recebe uma oportunidade válida e devolve elegibilidade e motivo” é um contrato mais útil que “faz validações”. Defina o significado de valores ausentes e se uma recusa de negócio é diferente de um erro técnico.

Para ações invocáveis, pense em coleções de entradas e resultados por item, conforme o contrato suportado. Não presuma execução individual em cenários de importação ou processamento em lote. A solução precisa ser avaliada junto das operações realizadas por outras automações na mesma transação.

Dê nomes que expressem intenção. Um subfluxo reutilizável deve ter uma responsabilidade estável; extrair qualquer grupo de elementos apenas para diminuir o desenho pode criar dependências sem melhorar a compreensão.

## Desenhar o caminho de falha

Uma falha de consulta externa não significa que o pedido foi recusado pela política. Mostre estados diferentes para elegibilidade negativa, entrada inválida e indisponibilidade. Essa separação orienta tanto o usuário quanto quem presta suporte.

No exemplo, a solicitação pode ficar aguardando confirmação de uma integração. Defina se haverá nova tentativa, qual evidência permite identificar o processamento anterior e quando alguém deve intervir. Repetir um fluxo inteiro sem verificar efeitos já produzidos pode duplicar trabalho.

Use os mecanismos de falha disponíveis em cada elemento de forma consciente, sem supor que capturam qualquer condição. O tratamento precisa registrar informação útil e evitar gravar segredos ou dados pessoais desnecessários no diagnóstico.

## Testar comportamento acumulado

Homologue criação, alteração posterior, alteração sem mudança relevante e processamento de vários registros. Inclua valores ausentes, permissão insuficiente e outro componente modificando o mesmo dado.

Também avalie reentrada: o Flow altera algo que dispara novamente um comportamento relacionado? Uma condição baseada em transição de estado pode ser mais apropriada que uma condição que permanece verdadeira indefinidamente. A decisão concreta depende da regra e deve ser demonstrada com teste.

O critério de aprovação deve descrever o resultado final e os efeitos colaterais permitidos. “O Flow terminou” não comprova que uma integração foi chamada uma única vez nem que o usuário recebeu uma mensagem compreensível.

## Preparar mudança e sustentação

Mantenha versão, responsável, dependências e cenários de teste junto da entrega. Antes de ativar uma revisão, verifique os consumidores do contrato e a compatibilidade com registros em andamento. Uma mudança de significado pode exigir transição, não apenas substituição de uma versão.

Defina como desativar o comportamento com segurança e como identificar itens afetados. Voltar à versão anterior não desfaz automaticamente alterações de dados já realizadas. Recuperação operacional precisa de um procedimento próprio.

A evolução saudável reduz surpresa. Cada automação deve permitir explicar por que executou, o que decidiu e como recuperar uma falha. O artigo [Flow, Apex ou LWC](/blog/flow-apex-lwc) ajuda a escolher mecanismos; a revisão do [processo antes de automatizar](/blog/automatizar-processo-ruim) determina se a regra merece ser executada.
