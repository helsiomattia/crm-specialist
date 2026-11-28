Um requisito não está pronto apenas porque cabe em um cartão. Ele precisa permitir que negócio, desenvolvimento e validação reconheçam o mesmo comportamento esperado. A distância entre essas interpretações costuma aparecer no UAT, quando a solução já foi construída e corrigir o entendimento fica mais caro.

## Descubra o problema antes da tela

Converse com quem executa o trabalho, observe exemplos e identifique regras, exceções e decisões. “Adicionar um botão para priorizar” pode esconder um problema de urgência, falta de informação ou ordenação inadequada. A solução depende de qual desses problemas existe.

Registre objetivo, público, situação atual e evidência de sucesso. Inclua restrições relevantes, como perfis de acesso e integrações disponíveis. Se a regra ainda depende de uma decisão de negócio, mantenha essa incerteza visível.

Uma história pode ajudar a expressar usuário, necessidade e benefício, mas não substitui detalhes essenciais. O Scrum Guide não exige o formato de histórias de usuário; sua referência central é o gerenciamento do Product Backlog e do trabalho em direção ao objetivo. [Schwaber e Sutherland — The Scrum Guide](https://scrumguides.org/scrum-guide.html)

## Escreva critérios observáveis

Considere um exemplo fictício: supervisores precisam redistribuir casos quando um atendente fica indisponível. Um critério útil define quem pode executar a ação, quais casos são elegíveis, o que muda e o que é registrado.

“Redistribuição funcionando corretamente” não permite um teste claro. Prefira condições como: um usuário autorizado consegue transferir um caso aberto para uma fila permitida; o histórico identifica a origem e o destino; uma tentativa sem permissão é recusada sem alterar o responsável.

Inclua cenários de ausência de dados, registros encerrados, falha de integração e repetição da ação. Não é necessário enumerar qualquer situação imaginável, mas as exceções relevantes precisam entrar no acordo antes da implementação.

## Diferencie critérios e padrão de qualidade

Critérios de aceitação descrevem o comportamento daquele item. A Definition of Done estabelece condições de qualidade compartilhadas para o incremento. Uma demanda pode atender ao cenário principal e ainda não estar concluída se faltarem controles ou verificações exigidos pelo time.

Em equipes que usam Kanban, explicite políticas de entrada, movimentação e conclusão. Em Scrum, mantenha os compromissos e eventos coerentes com o framework. Misturar práticas pode funcionar, desde que ninguém use nomes conhecidos para esconder regras indefinidas.

## Prepare o UAT durante a descoberta

O teste de aceitação pelo usuário precisa de participantes representativos, ambiente adequado, dados sintéticos ou autorizados e roteiro ligado aos processos reais. Defina quem pode aceitar a entrega e como serão tratados os problemas encontrados.

Separe defeito, dúvida e nova necessidade. Um defeito viola o comportamento acordado; uma necessidade adicional pode exigir nova priorização. Essa distinção não serve para rejeitar feedback, mas para tornar transparente o impacto sobre prazo e escopo.

Registre evidências: cenário, resultado esperado, resultado observado e decisão. Evite uma aprovação genérica sem indicar o que foi exercitado.

## Use o feedback para melhorar o próximo ciclo

Depois da validação, examine quais dúvidas poderiam ter sido resolvidas antes. Muitos defeitos de acesso sugerem participação insuficiente dos perfis reais; muitos problemas de fluxo indicam cenários excessivamente isolados.

A aceitação encerra uma etapa, mas a observação após a disponibilização continua necessária. Acompanhe uso, erros e efeito no processo. Uma entrega tecnicamente aceita pode exigir ajustes quando encontra o volume, as interrupções e as exceções da rotina.
