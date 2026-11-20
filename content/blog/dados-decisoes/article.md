## Um painel não escolhe o que fazer

Uma organização pode reunir indicadores detalhados e continuar tomando decisões por pressão, hábito ou preferência. O problema nem sempre está na ferramenta de análise. Pode estar na ausência de uma pergunta clara, na indefinição de responsabilidade ou no fato de que ninguém combinou o que acontecerá quando um indicador mudar.

Dados participam da decisão ao descrever acontecimentos, revelar diferenças e permitir testar hipóteses. Eles não definem sozinhos o objetivo desejado, a tolerância a risco ou o compromisso entre alternativas. Essas escolhas dependem de pessoas e do contexto em que atuam.

O Government Data Quality Framework do Reino Unido trata qualidade como adequação ao propósito e ressalta que ela vai além da limpeza de dados. Essa distinção é relevante: um conjunto pode ser tecnicamente consistente e ainda não responder à pergunta de gestão. A proposta deste artigo é conectar qualidade, interpretação e ação em um ciclo prático. [GOV.UK — The Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework).

## Comece pela decisão que o indicador deve apoiar

Antes de pedir um dashboard, complete uma frase: “precisamos decidir se devemos fazer determinada mudança, observando estas condições”. Essa formulação obriga a distinguir curiosidade de necessidade operacional. Ela também permite descobrir quando uma decisão exige informação que ainda não é coletada.

Considere uma operação fictícia de atendimento. A pergunta “qual foi o tempo médio?” produz um número, mas não estabelece o que fazer com ele. “Precisamos entender se a espera aumentou por distribuição de demanda, capacidade disponível ou falha no encaminhamento” orienta uma investigação. Cada hipótese exige recortes e evidências diferentes.

Nem todo indicador precisa disparar uma ação automática. Alguns servem para explorar, outros para acompanhar compromissos e outros para detectar desvios. O problema surge quando um indicador exploratório é utilizado como prova conclusiva, ou quando um alerta não possui responsável capaz de agir.

## Escreva o significado antes de desenhar o gráfico

Uma definição operacional deve informar unidade observada, evento de início, evento de término, período, exclusões e fonte. “Solicitação”, “contato” e “cliente” podem representar contagens diferentes. Uma pessoa pode iniciar vários contatos sobre a mesma solicitação; misturar essas unidades altera a interpretação do resultado.

Pense em um exemplo sintético: um relatório mostra que 80 de 100 solicitações encerradas cumpriram determinado prazo. Isso descreve **80% das solicitações encerradas naquele conjunto**. Não demonstra que 80% das solicitações recebidas no período foram resolvidas no prazo, pois as ainda abertas podem estar fora do denominador. A diferença muda a conclusão de gestão.

Registre também como o tempo é contado. Horário corrido, horário de operação e períodos de espera por informações respondem a perguntas distintas. Não existe uma definição universalmente correta fora do objetivo da medição. Existe uma definição que precisa ser compreendida e aplicada de forma consistente.

O artigo sobre [indicadores de atendimento](/blog/indicadores-atendimento) aprofunda essas escolhas. No nível de gestão, a consequência é simples: um número sem contrato de significado não deveria sustentar uma cobrança ou uma mudança de processo sem investigação adicional.

## Dê espaço para a incerteza e para o contexto

Um resultado agregado pode esconder situações muito diferentes. Examine segmentos relevantes, como tipo de solicitação, canal, período e etapa da jornada. Esses recortes devem ajudar a explicar o fenômeno; não devem ser escolhidos apenas para produzir uma narrativa favorável.

Também é necessário perguntar o que mudou na coleta. Um campo obrigatório, uma nova classificação ou uma alteração de integração podem modificar a série sem que a operação tenha mudado da mesma forma. Mantenha um registro dessas alterações para que quem analisa saiba distinguir mudança de comportamento de mudança de medição.

Ausência de dados não significa ausência de problema. Uma redução de registros pode indicar menor demanda, falha de captura ou migração para outro canal. Antes de comemorar a queda, confira cobertura e atualização. Uma pessoa próxima da operação pode perceber o desvio antes que ele apareça no painel; essa observação é uma hipótese a investigar, não um motivo para ignorar a evidência quantitativa.

## Transforme a leitura em uma hipótese verificável

Suponha, em outro cenário hipotético, que o tempo de espera aumente após uma mudança de roteamento. A coincidência temporal justifica investigar, mas não comprova a causa. A demanda pode ter mudado, a equipe pode ter recebido casos mais complexos ou a disponibilidade pode ter variado.

Formule uma hipótese específica: determinado tipo de solicitação está sendo encaminhado para uma equipe sem a capacidade necessária. Identifique evidências que a sustentariam e evidências que a enfraqueceriam. Compare situações semelhantes e avalie outras explicações antes de alterar toda a operação.

Se houver condições para um experimento controlado, defina previamente a intervenção, os grupos ou períodos comparados e os critérios de avaliação. Quando isso não for viável, documente as limitações da comparação. A honestidade sobre incerteza melhora a decisão; não precisa impedir toda ação.

## Feche o ciclo com responsabilidade e acompanhamento

Uma reunião orientada a dados pode terminar com um registro curto: observação, hipótese, decisão, responsável, prazo e sinal esperado de resultado. Se a decisão for não agir, registre também o motivo e a condição que levará à reavaliação. Essa prática evita repetir indefinidamente a mesma discussão.

Acompanhe efeitos indesejados. Uma iniciativa para reduzir tempo de atendimento pode aumentar retrabalho se incentivar encerramentos prematuros. Uma redução do backlog pode esconder reclassificação de solicitações. Escolha indicadores complementares de qualidade e continuidade para verificar se o objetivo foi alcançado sem transferir o problema.

Não atribua automaticamente o resultado à intervenção. Revise se as condições permaneceram comparáveis e se o mecanismo esperado realmente ocorreu. A pergunta “o que aprendemos?” deve incluir hipóteses rejeitadas e efeitos que não apareceram. Isso torna o conhecimento acumulado útil para a próxima decisão.

## A infraestrutura de dados precisa de uma infraestrutura de gestão

Ferramentas de integração e visualização são importantes, mas precisam estar acompanhadas de definições, responsáveis e rotinas de decisão. A organização deve saber quem corrige uma fonte, quem aprova a mudança de um indicador e quem pode executar a ação decorrente da análise.

Essa estrutura não exige que toda dúvida percorra um comitê. Pode começar com um pequeno conjunto de indicadores relevantes, um glossário mantido e uma rotina de revisão. A [documentação de processos](/blog/documentar-processos) ajuda a preservar o contexto sem transformar conhecimento em burocracia.

Uma cultura orientada a dados aparece quando as pessoas conseguem explicar por que decidiram, que evidência utilizaram e o que as faria mudar de posição. Os dados tornam o raciocínio examinável; processos e responsabilidades permitem transformá-lo em ação. A ligação com a [estratégia empresarial](/blog/estrategia-arquitetura) garante que esse esforço responda a objetivos que importam para a organização e para quem utiliza seus serviços.
