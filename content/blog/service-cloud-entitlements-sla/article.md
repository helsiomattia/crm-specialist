Configurar um prazo no Service Cloud parece simples até que a operação discorde sobre quando a contagem começa, quais pausas são legítimas e o que significa resolver a solicitação. Um contador tecnicamente correto pode representar um compromisso diferente daquele comunicado ao cliente.

O trabalho deve começar pela política de serviço. A configuração é uma tradução dessa política; não é o lugar para inventar condições que as áreas responsáveis ainda não decidiram.

## Distinguir demanda, cobertura e marco

Um Case representa uma demanda de atendimento no desenho adotado. Entitlement representa o direito de suporte definido para determinado contexto. Um milestone representa uma etapa mensurável do compromisso, como resposta inicial ou resolução.

Na plataforma, entitlement processes organizam marcos e regras aplicáveis a registros de suporte. A documentação orienta criar os milestones antes de incluí-los no processo. O contrato exato depende dos recursos disponíveis na organização. Consulte [Salesforce — Create an Entitlement Process](https://help.salesforce.com/s/articleView?id=entitlements_process_create.htm&language=en_US&type=0).

Essas peças não são equivalentes. Ter um Case não demonstra automaticamente que há cobertura contratual; completar um marco de resposta não comprova solução do problema. Nomear cada responsabilidade evita que um relatório misture etapas distintas.

## Escrever o relógio em linguagem de negócio

Considere uma empresa fictícia que promete primeira resposta humana em duas horas úteis. O pedido chega às 17h30, e o atendimento termina às 18h. Se o expediente seguinte começa às 8h e não há feriado, o vencimento esperado seria às 9h30 desse próximo expediente. São horários ilustrativos, não uma configuração recomendada para qualquer contrato.

Esse exemplo obriga a registrar calendário, fuso, feriados, evento inicial e critério de conclusão. Também exige decidir como lidar com mudanças de prioridade e transferências. Uma mensagem automática de recebimento não deveria encerrar um marco de resposta humana por acidente.

Para resolução, defina a política de pausa por dependência externa. Uma espera pode suspender um relógio interno sem desaparecer da experiência total do cliente. Mantenha as duas leituras quando necessário e deixe a diferença visível nos indicadores.

## Relacionar filas e responsabilidade

Filas organizam o trabalho, mas uma demanda não deve ficar sem responsabilidade porque mudou de fila. Defina quem acompanha o compromisso durante encaminhamento, recusa, ausência de especialistas e encerramento de expediente.

A supervisão precisa enxergar itens próximos do limite, itens vencidos e itens cuja configuração não permitiu calcular corretamente o prazo. “Sem relógio” é um estado de qualidade de dados, não um atendimento dentro da meta.

Separe escalonamento funcional de escalonamento gerencial. O primeiro busca conhecimento ou autorização necessários à solução. O segundo informa impacto e mobiliza decisão. Transferir o mesmo Case repetidamente sem esclarecer o impedimento pode aumentar o atraso.

## Homologar os caminhos difíceis

Monte uma coleção de cenários sintéticos antes de ativar o processo:

- Entrada dentro e fora do horário útil, incluindo feriado.
- Mudança de prioridade após parte do prazo transcorrer.
- Reabertura de solicitação e nova ocorrência do mesmo problema.
- Falta de entitlement ou associação incorreta.
- Transferência perto do vencimento.
- Correção de um registro encerrado por engano.

Para cada caso, registre vencimento esperado, estado do marco e responsável pela intervenção. Não presuma que reabrir, pausar ou reassociar um registro produzirá o comportamento desejado sem verificar a configuração utilizada.

Teste também alertas. Um aviso precisa chegar a alguém com capacidade de agir e conter contexto suficiente. Uma sequência de notificações sem ação definida apenas distribui a preocupação.

## Medir produtividade sem perder qualidade

Quantidade de Cases encerrados ajuda a observar volume, mas não demonstra qualidade ou capacidade comparável. Tipos de demanda, complexidade e dependências mudam o esforço necessário.

Combine cumprimento de prazo com recontato, retrabalho e motivos de escalonamento. Preserve os itens ainda abertos na análise apropriada: avaliar apenas encerrados pode esconder o estoque mais atrasado. O artigo sobre [indicadores de atendimento](/blog/indicadores-atendimento) explica essa fronteira.

A implantação deveria terminar com política versionada, cenários testados, painéis com definições claras e procedimento para corrigir associações erradas. O ganho é a capacidade de explicar o compromisso e intervir antes de rompê-lo. A continuidade entre canais permanece uma decisão adicional, discutida em [atendimento omnichannel](/blog/atendimento-omnichannel).
