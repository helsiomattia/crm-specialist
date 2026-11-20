## Uma comparação precisa começar pelo trabalho

“Agentforce ou Amazon Connect?” parece uma pergunta de seleção de software, mas pode reunir decisões de naturezas diferentes. A organização pretende melhorar um canal de contato, executar ações sobre registros de CRM, apoiar atendentes, substituir uma infraestrutura existente ou reorganizar toda a jornada? Sem separar essas necessidades, a comparação tende a premiar a demonstração mais convincente, não a alternativa mais adequada.

Há uma atualização de nomenclatura relevante: na documentação consultada, a AWS chama de **Amazon Connect Customer** o produto anteriormente denominado Amazon Connect e utiliza Amazon Connect para um conjunto mais amplo de soluções. Este artigo mantém a expressão conhecida no título, mas analisa o contexto de atendimento descrito naquele guia. O escopo de qualquer avaliação comercial deve registrar o produto e a oferta exatos. [AWS — What is Connect Customer?](https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html).

A documentação introdutória da Salesforce descreve agentes que relacionam instruções e ações a tarefas, enquanto o guia da AWS apresenta recursos de comunicação, roteamento e administração da operação de atendimento. Essas descrições ajudam a localizar responsabilidades; não demonstram equivalência entre planos, canais ou condições de contratação. [Salesforce Trailhead — Discover Agentforce](https://trailhead.salesforce.com/content/learn/modules/agentforce-agents-quick-look/discover-agentforce-agents), [AWS — visão do produto](https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html).

## Separe as decisões que a pergunta esconde

Uma avaliação útil distingue pelo menos quatro camadas. A primeira recebe e mantém o contato: canal, sessão, disponibilidade e encaminhamento. A segunda interpreta a solicitação e conduz a interação. A terceira consulta ou altera sistemas de negócio. A quarta acompanha qualidade, custo, permissões e incidentes.

Uma plataforma pode atender várias dessas camadas, mas isso precisa ser comprovado para o cenário contratado. A pergunta central passa a ser: onde cada responsabilidade ficará e que fronteiras terão de ser integradas? Duas ferramentas podem disputar um mesmo papel em um desenho e se complementar em outro.

Essa decomposição evita dois atalhos. O primeiro é presumir que estar próximo dos dados do CRM resolve automaticamente toda necessidade do contact center. O segundo é presumir que controlar o canal resolve a autorização e a consistência das transações realizadas em outros sistemas. Em ambos os casos, parte importante da arquitetura continua exigindo decisão.

## Desenhe uma jornada antes de preencher a matriz

Considere um cenário inteiramente hipotético: uma pessoa solicita a alteração de um compromisso de atendimento. O serviço precisa identificar o solicitante, localizar o compromisso, verificar regras de alteração, apresentar opções e registrar a confirmação. Se não houver disponibilidade ou a integração falhar, a solicitação deve seguir para atendimento humano com o contexto necessário.

Nesse desenho, marque a origem oficial de cada informação. Quem possui a agenda? Qual serviço aplica a regra de elegibilidade? Quem gera a confirmação? Qual identificador permite investigar uma tentativa? O modelo pode interpretar “preciso mudar o horário”, mas essa interpretação não substitui a validação da alteração pelo sistema responsável.

Somente depois compare como cada alternativa executaria a jornada completa. Inclua as ferramentas complementares, o trabalho de integração e as tarefas que continuam manuais. Uma comparação restrita à conversa inicial não representa o custo nem a qualidade do serviço entregue.

## Critérios que mudam a decisão

**Proximidade dos processos existentes.** Avalie onde estão as regras, os dados e a equipe que mantém o serviço. Aproveitar componentes existentes pode reduzir duplicações; também pode preservar um desenho problemático. A proximidade é vantagem quando o componente é adequado e sustentável, não apenas porque já está contratado.

**Integração e consistência.** Verifique limites, tratamento de falhas, repetição segura de solicitações e reconciliação entre sistemas. Peça evidências de como uma tentativa parcialmente concluída será identificada. Se a confirmação não chegar ao usuário, repetir a mensagem não deve necessariamente repetir a operação de negócio.

**Transferência para pessoas.** Examine o que chega ao atendente: intenção, informações verificadas, ações tentadas e motivo do encaminhamento. Confirme quem assume a solicitação e como o cliente acompanha a continuidade. A transferência deve ser testada como parte normal da jornada, não como uma exceção improvisada ao final do projeto.

**Governança e capacidade de operação.** Identifique quem altera instruções, configura ações, concede acesso e investiga erros. Uma solução pode ser tecnicamente viável e operacionalmente inadequada para a equipe disponível. Considere treinamento, suporte e dependência de especialistas externos.

**Economia do serviço.** Compare cenários de utilização e todos os componentes necessários. Não há preço universal por atendimento que possa ser inferido de uma página de produto. Contratos, regiões, canais, integrações e padrões de uso precisam entrar na avaliação concreta.

## Faça uma prova comparável, não duas demonstrações diferentes

Entregue às alternativas o mesmo conjunto de situações, com dados sintéticos e critérios definidos previamente. Além do caminho esperado, inclua solicitação ambígua, informação desatualizada, acesso indevido, serviço indisponível e desistência durante a interação. Registre também o esforço necessário para preparar, corrigir e manter cada cenário.

Separe critérios obrigatórios de critérios graduais. Uma condição indispensável de acesso ou continuidade deve ser atendida; não deve desaparecer dentro de uma média ponderada. Para os demais critérios, documente pesos e justificativas. Se os pesos mudarem depois da demonstração, registre por que mudaram.

Avalie resolução correta e continuidade do atendimento, não apenas fluidez da linguagem. Inclua tempo de recuperação, qualidade do contexto transferido e capacidade de explicar uma ação. Os testes precisam revelar quando a alternativa deve recusar, solicitar esclarecimento ou encaminhar, além de mostrar quando funciona bem.

## Três desenhos possíveis e seus compromissos

Um desenho concentrado na plataforma que já sustenta o processo pode reduzir fronteiras e facilitar a manutenção por uma equipe existente. O compromisso é aceitar suas limitações e verificar se os canais e requisitos operacionais realmente cabem nela.

Um desenho que concentra a experiência de contato em outra plataforma pode atender melhor determinadas necessidades da operação. Em contrapartida, precisa tornar explícita a ligação com registros, permissões e regras mantidos em outros sistemas. Essa ligação passa a ser parte permanente do produto.

Um desenho combinado pode preservar responsabilidades especializadas, desde que haja uma razão concreta para isso. A combinação adiciona contratos, observabilidade e coordenação entre equipes. Não deve ser escolhida apenas para evitar uma decisão difícil sobre qual componente é responsável por determinada regra.

## O resultado esperado é uma arquitetura defensável

A decisão final deve caber em um registro claro: problema, alternativas, requisitos eliminatórios, evidências da prova, custos considerados, limitações aceitas e condições para reavaliar. Isso permite que outra pessoa compreenda por que a solução foi escolhida mesmo depois de mudanças nos produtos.

Não existe um vencedor independente do contexto. Existe uma distribuição de responsabilidades mais ou menos adequada à operação. Para aprofundar a avaliação, conecte a seleção de plataforma ao desenho do [atendimento omnichannel](/blog/atendimento-omnichannel), à [prontidão para IA](/blog/empresa-pronta-ia) e ao [custo total da solução](/blog/custo-alem-licenca). A tecnologia escolhida deve tornar esse desenho executável e sustentável.
