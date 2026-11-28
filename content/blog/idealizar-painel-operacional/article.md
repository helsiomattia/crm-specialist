**Maturidade: Proposta.** Este artigo descreve um desenho conceitual e critérios de avaliação. Os cenários são fictícios; não declara implantação corporativa nem resultados medidos.

Um painel operacional pode reunir muitos números e ainda deixar o supervisor sem saber onde agir. Esta proposta parte de uma pergunta mais específica: qual intervenção reduz o risco de uma demanda ficar sem atendimento adequado nas próximas horas?

O desenho combina visibilidade de equipes, pessoas, filas e distribuição de trabalho. A priorização é uma regra de negócio visível, sujeita a revisão; o nome “inteligente” não pressupõe aprendizado de máquina.

## Usuários e decisões

O supervisor precisa localizar concentração de demanda e redistribuir trabalho. O atendente precisa entender sua próxima ação. O gestor precisa enxergar padrões que exigem ajuste de capacidade. Cada público recebe uma visão compatível com sua responsabilidade e seu acesso.

A tela inicial poderia destacar itens sem responsável, solicitações próximas do limite de atendimento e filas com crescimento persistente. Um detalhe permitiria investigar motivo, canal, idade, competência exigida e histórico de transferências.

Dados individuais não precisam aparecer para todos. A visão executiva pode trabalhar com agregados, enquanto a intervenção operacional exige acesso mais restrito ao caso.

## Uma prioridade que possa ser explicada

Em um cenário fictício, a ordem considera prazo restante, impacto, dependências e tempo de espera. Cada item mostra quais fatores contribuíram para sua posição. A regra deve evitar que uma categoria de clientes fique indefinidamente no fim da fila.

O modelo não deve usar qualquer dado disponível apenas porque existe. Atributos precisam ter justificativa operacional e revisão de consequências. Um valor comercial alto, por exemplo, não elimina compromissos de atendimento assumidos com outros públicos.

Antes de automatizar distribuição, a proposta apresenta recomendações ao supervisor. Ele pode aceitar, ajustar ou recusar, registrando motivos que ajudem a melhorar a regra.

## Dados e estados necessários

O painel precisaria integrar solicitações, eventos de roteamento, disponibilidade, capacidade e calendário de serviço. Cada indicador exibiria momento da última atualização e definição de cálculo. Dados atrasados devem produzir um aviso visível, não uma aparência de tempo real.

É importante distinguir espera na fila, trabalho atribuído e atendimento em andamento. A mesma solicitação pode passar por diferentes estados; somá-los sem um modelo temporal produz dupla contagem.

Uma simulação inicial usaria dados sintéticos com casos normais, picos, ausência de especialistas e transferências repetidas. Não seria necessário conectar produção para avaliar a compreensão da interface.

## Experimento e critérios de avaliação

Prototipar permite testar uma ideia antes de investir em sua implementação completa. O GOV.UK apresenta diferentes formas de protótipo conforme a pergunta a explorar. [GOV.UK — Making prototypes](https://www.gov.uk/service-manual/design/making-prototypes)

O teste proposto pediria aos participantes que identificassem três riscos e escolhessem uma intervenção. Seriam observados tempo de interpretação, consistência entre decisões e compreensão das justificativas.

A avaliação também incluiria falhas: atualização interrompida, ausência de capacidade e prioridade contestada. O painel precisa continuar honesto sobre o que sabe e permitir atuação humana quando a recomendação não for suficiente.

## Limites para uma evolução

Uma etapa posterior poderia simular regras com eventos históricos autorizados e comparar distribuição, espera e concentração de carga. Isso exigiria controlar diferenças de volume e perfil dos casos; uma melhora aparente não demonstraria causalidade por si só.

A proposta estaria pronta para discussão de implementação quando usuários reconhecessem as decisões apoiadas, as fontes fossem viáveis e os limites de responsabilidade estivessem claros. Até lá, o resultado é um desenho testável, sem promessa de ganho medido ou de operação já implantada.
