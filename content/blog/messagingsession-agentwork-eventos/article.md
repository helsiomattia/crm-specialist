Uma conversa de mensageria passa por bot, fila, atendente e especialista. No fim do dia, um relatório conta uma sessão, outro conta duas atribuições e um terceiro não encontra o registro pendente. Os números podem descrever o mesmo percurso sem estarem necessariamente errados.

A investigação precisa começar pela unidade observada. Conversa, tentativa de distribuição, trabalho atribuído e necessidade do cliente são entidades diferentes. Unificá-las em uma única contagem impede explicar o que aconteceu.

## O que cada entidade permite observar

MessagingSession participa do modelo de sessões de mensageria. Consulte seus campos e relacionamentos na referência da versão aplicável antes de montar consultas ou integrações. A existência da sessão, isoladamente, não prova resolução nem atendimento humano contínuo. [Salesforce — MessagingSession](https://developer.salesforce.com/docs/platform/object-reference/references/standard-objects/object-messagingsession.html).

PendingServiceRouting, ou PSR, representa informação transitória de roteamento. AgentWork registra trabalho encaminhado a um possível atendente. A documentação descreve a remoção do PSR quando o trabalho é aceito; por isso, ele não deve ser tratado como um histórico permanente e completo de espera. [Salesforce — Understand the Details of the Routing Lifecycle](https://help.salesforce.com/s/articleView?id=omnichannel_psr_lifecycle.htm&language=en_US&type=0).

Essa distinção muda o desenho analítico. Se é necessário reconstruir uma sequência, defina quais eventos e registros serão coletados de forma autorizada, por quanto tempo e com quais relações. Consultar o estado atual não recupera automaticamente estados anteriores.

## Construir uma linha do tempo antes do dashboard

Considere um cenário fictício: às 10h o cliente pede uma pessoa; às 10h02 surge uma atribuição; às 10h03 o trabalho é aceito; às 10h04 chega a primeira resposta humana. Depois, às 10h10, há transferência para um especialista.

A espera até atribuição é diferente da espera até aceitação e da espera percebida até resposta. No exemplo, são dois, três e quatro minutos desde o pedido. Nenhum desses números deve ser apresentado como “tempo de espera” sem dizer quais eventos foram usados.

A transferência acrescenta outro trecho. Preserve o identificador da jornada, a etapa, a origem e o destino quando o modelo permitir. Antes de somar durações, confira se os intervalos se sobrepõem e se a conversa foi retomada depois de uma pausa do cliente.

## Presença não significa capacidade ilimitada

Um status de presença informa elegibilidade dentro do desenho de roteamento. A capacidade configurada limita distribuição conforme as regras adotadas; não mede diretamente atenção, complexidade ou produtividade humana.

Ao configurar competências, prioridades e disponibilidade, faça três perguntas: quais pessoas podem receber o item, por que determinado item vem antes de outro e o que acontece quando ninguém é elegível. Uma restrição aparentemente razoável pode deixar uma demanda parada durante todo um turno.

Teste recusa, timeout, ausência de habilidade e troca de presença. Verifique também a volta ao fluxo após indisponibilidade. Se a equipe precisa editar registros manualmente para destravar situações comuns, a exceção já faz parte do produto e merece desenho explícito.

## Separar canais e preservar o contexto

WhatsApp e Messaging for In-App and Web não devem ser tratados como canais idênticos apenas porque ambos apresentam mensagens. Confirme políticas, recursos, configurações e ciclos de sessão do canal contratado, sem transportar regras de um canal para outro.

Na transição bot–humano, proponha um pacote mínimo: intenção identificada, informações confirmadas, ações tentadas, motivo da transferência e pendência atual. Não inclua dados sensíveis que o destinatário não precisa utilizar.

O atendente deve distinguir informação fornecida pelo cliente de inferência do bot e de dado confirmado em sistema. Um resumo fluente que mistura essas origens pode acelerar uma decisão incorreta. Também é necessário definir quem assume o compromisso enquanto a transferência ainda não foi aceita.

## Evitar duplicações na análise

Uma junção entre sessões e vários registros de trabalho pode repetir campos da sessão. Somar um valor depois dessa junção pode multiplicar o resultado. Valide cardinalidade e granularidade antes de construir totais.

Faça a conferência com algumas jornadas sintéticas cujo resultado esperado seja conhecido. Inclua duas transferências, uma atribuição recusada e uma retomada em outro dia. Se o modelo não permite relacionar todos os trechos com segurança, declare cobertura parcial.

O objetivo não é encontrar uma tabela que explique tudo. É construir uma interpretação verificável entre eventos e responsabilidades. A base conceitual está em [atendimento omnichannel](/blog/atendimento-omnichannel); o uso desses dados em decisões depende do contrato definido para cada [indicador operacional](/blog/indicadores-atendimento).
