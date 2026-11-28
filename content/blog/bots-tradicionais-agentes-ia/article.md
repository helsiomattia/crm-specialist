A escolha entre bot e agente começa pelo trabalho que precisa ser realizado. Um fluxo com opções explícitas pode ser adequado para uma operação previsível. Um componente generativo pode ajudar a interpretar linguagem variada. Um agente com ferramentas acrescenta capacidade de agir e, com ela, novas responsabilidades.

## Diferencie comportamento e autoridade

Um bot determinístico segue regras e transições definidas. Um componente generativo produz respostas a partir de instruções e contexto. Um agente pode selecionar ações dentro das capacidades disponibilizadas. Essas características podem coexistir na mesma experiência.

O material introdutório de Agentforce apresenta agentes configurados com escopo, instruções e ações. A disponibilidade e a configuração concreta devem ser verificadas no ambiente e na oferta utilizada. [Salesforce Trailhead — Discover Agentforce](https://trailhead.salesforce.com/content/learn/modules/agentforce-agents-quick-look/discover-agentforce-agents)

Conversar de forma natural não exige conceder autoridade para alterar registros. Uma solução pode interpretar o pedido e encaminhá-lo para um fluxo de confirmação com regras explícitas.

## Escolha um desenho híbrido

Considere um cenário fictício de alteração de endereço. A conversa identifica a intenção e coleta informações; um serviço verifica identidade e autorização; uma tela ou mensagem apresenta o novo endereço para confirmação; uma ação controlada executa a mudança.

A validação não pode depender apenas de o modelo dizer que o usuário está autorizado. O serviço que altera o dado precisa aplicar as regras de acesso e as condições de negócio.

Para perguntas sobre políticas, uma resposta fundamentada em fontes pode ser suficiente. Para exceções financeiras ou contratuais, o desenho pode exigir análise humana. O limite acompanha a consequência da ação.

## Defina níveis de autonomia por tarefa

Uma matriz simples pode separar consulta, sugestão, preparação de ação e execução. Para cada tarefa, registre quem autoriza, quais limites se aplicam e como a decisão é auditada.

Um agente pode preparar uma atualização e solicitar confirmação antes de gravá-la. Também pode executar uma ação rotineira dentro de limites previamente definidos. Essas escolhas precisam ser explícitas e verificáveis no sistema.

O NIST AI RMF propõe uma abordagem contextual para gestão de riscos. Isso apoia a avaliação de controles proporcionais ao uso, sem presumir que supervisão humana resolve qualquer risco por si só. [NIST — AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

## Planeje a transferência para uma pessoa

A transferência precisa ter destino, contexto e expectativa de continuidade. Enviar apenas o texto da conversa pode ser insuficiente; inclua intenção identificada, ações tentadas, resultados e pendências relevantes.

Diferencie transferência por solicitação do usuário, falta de conhecimento, falha técnica e situação de risco. Essas causas ajudam a avaliar a experiência e escolher melhorias.

Se não houver atendimento humano disponível, a solução deve informar a condição e oferecer um próximo passo realista. Uma mensagem genérica de encaminhamento não pode esconder que ninguém receberá o caso.

## Teste além do caminho esperado

Inclua pedidos ambíguos, instruções maliciosas em documentos, tentativas de acesso indevido, ferramentas indisponíveis e repetição da mesma ação. Verifique se o sistema interrompe a execução quando falta autorização ou confirmação.

Registre versão das instruções, ferramentas disponíveis e resultados observados, preservando apenas os dados necessários. Esse histórico permite investigar regressões após mudanças.

A melhor experiência pode combinar conversa flexível com execução restrita. O objetivo é permitir que o usuário conclua a tarefa com clareza, mantendo responsabilidade, controle e uma saída operacional quando a automação não consegue continuar.
