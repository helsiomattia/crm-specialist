Uma interface carrega, um botão funciona e uma chamada REST retorna sucesso. Ainda assim, o processo pode falhar quando o usuário não tem acesso ao registro, quando o serviço externo demora ou quando a mesma ação é reenviada. Desenvolvimento empresarial exige um contrato que sobreviva a essas condições.

A separação entre LWC, Apex, SOQL e APIs ajuda a localizar responsabilidades. Ela não elimina a necessidade de verificar o comportamento completo, do pedido inicial ao efeito confirmado.

## A interface solicita; o serviço verifica

Considere uma alteração fictícia de endereço de entrega. O LWC apresenta os campos, explica validações e mostra o estado da solicitação. Um serviço verifica autorização e regras. Uma integração comunica a alteração ao sistema responsável pela entrega.

Não coloque a única validação de negócio no JavaScript do componente. Outros consumidores podem contornar essa interface. O serviço que aceita a operação precisa conferir suas próprias pré-condições, incluindo se o registro ainda está no estado esperado.

A tela deve distinguir solicitação recebida, processamento em andamento, conclusão e falha. Um aviso de sucesso exibido antes da confirmação externa pode prometer um resultado que ainda não ocorreu.

## Consultar com propósito e limites

SOQL deve buscar o que a operação necessita, com filtros e seleção de campos coerentes. Uma consulta ampla para simplificar o componente pode ampliar volume, exposição e custo de processamento.

Avalie o comportamento para múltiplos registros. Repetir consultas e alterações dentro de uma iteração pode tornar uma implementação funcional em exemplos pequenos inadequada para importações ou operações em lote. Considere o orçamento da transação inteira, incluindo automações acionadas.

Em Apex, acesso à classe, compartilhamento de registros e permissões de objetos e campos são dimensões que exigem verificação. A documentação de segurança trata esses cuidados e recomenda explicitar modos de acesso nas operações. [Salesforce — Secure Apex Classes](https://developer.salesforce.com/docs/platform/lwc/guide/apex-security).

## Desenhar uma API pela decisão que ela representa

Um contrato útil declara entrada, saída, identidade, erros e efeitos. Diferencie um pedido inválido de um conflito de estado e de uma indisponibilidade. O consumidor precisa saber se deve corrigir dados, atualizar sua visão ou aguardar.

No exemplo, enviar a mesma alteração duas vezes não deveria necessariamente produzir duas solicitações de entrega. Defina uma estratégia de idempotência quando a repetição puder causar efeitos duplicados. Ela depende de identificadores, armazenamento e regras do serviço; não surge apenas por usar HTTP.

Planeje timeout e confirmação tardia. Se o cliente desistiu de esperar, o servidor ainda pode concluir a operação. O suporte precisa de um caminho para consultar o resultado antes de repetir uma ação potencialmente executada.

## Tratar credenciais como configuração controlada

Named Credentials e External Credentials separam o destino de callouts dos mecanismos de autenticação e de suas permissões. A documentação atual descreve o modelo extensível e informa a descontinuação futura das credenciais legadas. Evite iniciar um desenho novo dependendo de um modelo legado sem necessidade demonstrada. [Salesforce — Get Started with Named Credentials](https://developer.salesforce.com/docs/platform/named-credentials/guide/get-started.html).

Isso não dispensa revisar escopo, usuário ou principal utilizado, rotação e acesso ao sistema externo. Uma credencial bem armazenada ainda pode conceder privilégios excessivos.

Não inclua tokens em código, exemplos de artigo, logs ou mensagens de erro. O diagnóstico deve identificar a operação e sua falha sem reproduzir material que permita executar a integração.

## Testar o contrato completo

Crie testes de sucesso e de falha: resposta vazia, resposta inválida, permissão insuficiente, indisponibilidade, concorrência e repetição. Use mocks para controlar respostas externas e cenários de integração apropriados para verificar compatibilidade real.

Os testes da interface devem observar carregamento, erro e recuperação. Se a pessoa perde o preenchimento ao receber uma falha transitória, a implementação técnica pode estar correta e a experiência continuar inadequada.

Cobertura de linhas é uma evidência limitada. Um teste que apenas percorre o código não demonstra que uma alteração não autorizada foi bloqueada ou que uma repetição foi tratada corretamente.

A entrega deve incluir contrato, testes representativos e observabilidade que permita reconstruir a tentativa. A escolha entre [Flow, Apex e LWC](/blog/flow-apex-lwc) fica mais clara quando essas responsabilidades estão definidas. O resultado esperado é um comportamento sustentável dentro da [arquitetura operacional](/blog/salesforce-arquitetura-operacional).
