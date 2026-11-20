## A pergunta contém três responsabilidades diferentes

Quando uma necessidade chega como “precisamos de uma tela para resolver isso”, escolher a tecnologia cedo demais costuma limitar a análise. A tela pode precisar apenas orientar uma pessoa. Pode também executar uma decisão de negócio, consultar informações externas e iniciar um processamento que continua depois que o usuário fecha a página.

Flow, Apex e Lightning Web Components podem participar da mesma solução, mas não representam a mesma responsabilidade. LWC é um framework para construir interfaces personalizadas com HTML e JavaScript. Flow oferece automação declarativa e experiências guiadas; Apex permite implementar lógica programática na plataforma. [Salesforce Developers — LWC](https://developer.salesforce.com/docs/platform/lwc/guide) e [Salesforce Architects — Record-Triggered Automation](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html).

A pergunta inicial deveria ser: qual comportamento precisamos entregar, em que contexto ele será executado e quem conseguirá mantê-lo? A escolha da ferramenta vem depois dessa decomposição.

## Um pedido, três camadas de decisão

Considere um cenário hipotético: um atendente solicita uma revisão de condição comercial. Ele precisa selecionar registros, justificar a solicitação e acompanhar o resultado. A empresa quer garantir que a regra também seja respeitada quando o pedido vier de uma integração.

Há pelo menos três decisões distintas. A primeira é a experiência de interação: quais informações aparecem e como o usuário corrige erros. A segunda é a política: quais condições permitem a solicitação. A terceira é a execução: quais registros mudam, quais sistemas são acionados e como uma falha será tratada.

Colocar toda a política em JavaScript na tela deixaria outros caminhos de entrada sem a mesma proteção. Repetir a política em vários Flows e classes também criaria risco de divergência. A recomendação arquitetural é localizar a responsabilidade pela decisão e fornecer interfaces adequadas para seus diferentes consumidores. O desenho concreto pode combinar ferramentas, desde que não multiplique versões da regra.

## Quando começar por Flow

Um processo guiado com etapas claras, campos conhecidos e condições compreensíveis pode ser um bom candidato a uma abordagem declarativa. A hipótese a validar é que a equipe conseguirá entender, testar e alterar o fluxo sem transformar o diagrama em uma rede de dependências difíceis de rastrear.

No exemplo, um Screen Flow pode ser suficiente para coletar a justificativa e orientar a pessoa. Isso não dispensa revisar a experiência: mensagens de erro, retomada de preenchimento, informações obrigatórias e comportamento em telas pequenas continuam sendo requisitos do produto.

Para automações disparadas por registros, o guia oficial recomenda avaliar a densidade de automação e a complexidade das interações. Também apresenta combinações de Flow com Apex invocável. Essa orientação não deve ser reduzida a uma contagem isolada de elementos visuais: o comportamento acumulado no objeto precisa ser compreendido. [Guia de decisão para automação](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered.html).

A limitação prática aparece quando uma alteração pequena exige inspecionar muitos caminhos, efeitos indiretos ou operações repetidas. Nesse ponto, dividir responsabilidades pode ser mais importante que insistir no mecanismo original.

## Quando Apex pode tornar o desenho mais claro

Apex pode ser apropriado quando o problema exige controle programático que a equipe consegue expressar e testar com mais clareza em código. Isso inclui algoritmos específicos, contratos reutilizáveis e tratamento detalhado de operações. Não significa que toda regra complexa deva ser transferida integralmente para uma única classe.

No cenário proposto, uma rotina que avalia um conjunto de solicitações poderia receber entradas bem definidas e devolver resultados por item. A interface ou o Flow permaneceria responsável pela experiência, enquanto a rotina concentraria uma decisão compartilhada. O contrato deve distinguir recusa de negócio de falha técnica: “solicitação não elegível” exige uma resposta diferente de “não foi possível consultar a origem”.

A plataforma aplica limites de execução a transações Apex. Implementações precisam considerar processamento em lote, consultas, alterações de registros e os demais componentes participantes; escrever código não elimina essas restrições. Os valores e exceções devem ser conferidos na referência vigente, evitando projetar com números memorizados. [Salesforce Developers — Execution Governors and Limits](https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-gov-limits.html).

## Quando LWC resolve um problema de experiência

Uma interface personalizada se justifica quando existe uma necessidade de interação que merece o custo de desenvolvimento e manutenção. Comparar registros lado a lado, representar dependências ou oferecer uma manipulação específica pode exigir algo além de um formulário convencional.

Antes de escolher LWC, descreva o ganho esperado em termos observáveis. A pessoa deixará de alternar entre várias telas? Conseguirá identificar uma inconsistência antes de enviar a solicitação? Terá feedback compreensível sobre uma operação demorada? Um protótipo pode testar essas hipóteses antes da implementação definitiva.

O investimento traz obrigações: acessibilidade, estados de carregamento, navegação por teclado, responsividade e recuperação de erro. Uma tela visualmente sofisticada que perde dados durante uma falha pode piorar o processo. Consulte também o método de [passar da necessidade ao protótipo](/blog/necessidade-ao-prototipo).

## Segurança e execução precisam ser explícitas

Nenhuma escolha de interface substitui a revisão de acesso aos dados. A orientação oficial para Apex diferencia segurança de registros, objetos e campos, e o comportamento padrão pode variar conforme a versão de API. Portanto, declare e teste o modelo de acesso adotado, em vez de depender de uma suposição sobre defaults. [Salesforce Developers — Secure Apex Classes](https://developer.salesforce.com/docs/platform/lwc/guide/apex-security.html).

Teste a solução com permissões representativas e com entradas fora do caminho visual previsto. Inclua valores ausentes, registros alterados por outra pessoa e tentativas repetidas. Se uma operação for assíncrona, defina como o usuário descobre o resultado e como a equipe identifica trabalhos pendentes ou falhos.

Uma decisão pode ser registrada em poucas linhas: responsabilidade, mecanismo escolhido, alternativas descartadas, restrições conhecidas e condição para revisão. Esse registro deve sobreviver à pessoa que fez a primeira implementação.

## Escolher pelo custo de sustentar o comportamento

A comparação final precisa incluir a capacidade da equipe, frequência de mudanças, reutilização, observabilidade e consequências de falha. Um desenho declarativo pouco compreendido pode ser mais caro que código bem organizado. Uma solução em código também pode ser um investimento desnecessário quando uma configuração simples atende ao requisito.

O objetivo é reduzir a distância entre a intenção de negócio e o comportamento executado. Separe experiência, decisão e execução; escolha o mecanismo adequado para cada responsabilidade; teste os caminhos que poderiam contornar a regra. Essa disciplina conecta a escolha técnica ao [papel do Salesforce na operação](/blog/salesforce-arquitetura-operacional), sem transformar preferência por ferramentas em critério de arquitetura.
