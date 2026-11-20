Uma solicitação passa por várias pessoas, retorna para correção e termina em uma planilha. A reação parece óbvia: criar um formulário, conectar os sistemas e automatizar as aprovações. Mas o formulário pode apenas tornar mais rápida a entrada de dados desnecessários, enquanto a integração espalha inconsistências e a aprovação continua sem critério.

Automação executa uma decisão de desenho. Se essa decisão estiver errada, o sistema pode repeti-la com eficiência. A pergunta inicial, portanto, é qual parte do problema exige tecnologia e qual parte exige uma mudança no próprio processo.

## Identificar o problema antes de desenhar o fluxo

Considere um cenário hipotético de solicitação de alteração cadastral. O atendimento recebe um pedido, uma equipe intermediária confere os documentos e o backoffice realiza a mudança. O solicitante acompanha tudo por mensagens. Quando falta um documento, o pedido volta ao início, mesmo que as verificações anteriores continuem válidas.

Nesse cenário, “demora na alteração” é o sintoma. As causas possíveis são diferentes: documentos exigidos sem clareza, responsabilidade difusa, espera por disponibilidade, acesso insuficiente ou repetição de verificações. Cada causa pede uma intervenção própria. Construir uma fila automática antes de distinguir essas causas pode produzir um acompanhamento organizado de um trabalho que continua mal definido.

Eu começaria observando solicitações completas e incompletas, acompanhando também exceções. Registraria o que entrou, o que precisava sair, quem podia decidir e quais informações eram realmente necessárias. Esse levantamento deve separar o procedimento oficialmente descrito do trabalho realizado. Divergências são evidências para investigação, não prova imediata de falha individual.

## Tornar visíveis trabalho, espera e decisão

Um mapa útil diferencia execução de espera. “Em análise” pode esconder uma pessoa trabalhando, uma pendência externa, uma decisão sem responsável ou um item esquecido. Se todos esses estados forem tratados igualmente, o diagnóstico perde precisão.

Também é necessário explicitar o significado de cada passagem. Encaminhar um pedido não significa que a equipe seguinte aceitou a responsabilidade. Registrar uma alteração não significa que o cliente foi informado. Encerrar uma atividade não garante que a necessidade tenha sido resolvida.

A [especificação BPMN 2.0.2, da OMG](https://www.omg.org/spec/BPMN/2.0.2), oferece uma notação padronizada para modelagem de processos. Ela pode ajudar a estabelecer uma linguagem comum, mas o diagrama não substitui a validação do trabalho com quem o executa. Neste caso, eu usaria apenas os elementos necessários para comunicar atividades, decisões, responsabilidades e exceções; o objetivo seria tornar o raciocínio verificável.

Para cada etapa, cinco perguntas produzem um inventário inicial:

- Qual resultado torna esta etapa concluída?
- Qual informação permite tomar a decisão?
- Quem responde quando o caminho normal falha?
- Há uma verificação anterior que está sendo repetida?
- Qual consequência existiria se a etapa fosse retirada?

## Eliminar, simplificar, padronizar e então automatizar

Essa sequência é um critério de projeto proposto, não uma regra universal. Primeiro, investigar atividades que não contribuem para o resultado nem para um controle necessário. Depois, reduzir transferências, esclarecer critérios e distinguir variantes legítimas de improvisos. Só então escolher o mecanismo de execução.

No exemplo, pode fazer sentido permitir a complementação de um documento sem reiniciar todo o pedido. Uma validação de preenchimento pode ocorrer na entrada. Já uma análise que depende de interpretação pode permanecer humana, com critérios explícitos e registro da justificativa. A automação organiza o encaminhamento e a rastreabilidade sem fingir que toda decisão é determinística.

Padronizar também exige limites. Uma operação pode atender produtos, contratos ou situações com exigências diferentes. Forçar todos os casos pelo mesmo caminho pode transferir o custo para o cliente ou estimular controles paralelos. A alternativa é manter um núcleo comum, com variações nomeadas, responsáveis e condições de entrada conhecidas.

## Escolher uma fronteira de automação que possa ser sustentada

Um processo inteiro raramente precisa ser automatizado de uma vez. É possível começar por uma atividade delimitada: validar campos necessários, informar pendências ou encaminhar uma solicitação já classificada. O recorte deve permitir observar se a mudança resolveu a causa que motivou o investimento.

A decisão técnica inclui mais que o caminho de sucesso. Se a integração estiver indisponível, o item ficará aguardando, será reprocessado ou seguirá uma alternativa manual? Se uma mensagem for recebida novamente, o sistema reconhecerá o trabalho já realizado? Se alguém alterar o cadastro durante o processamento, qual versão será considerada?

Essas perguntas conectam desenho operacional e arquitetura. Não exigem adicionar mecanismos complexos a qualquer rotina, mas impedem que a simplicidade aparente da interface esconda um funcionamento frágil. A escolha entre recursos declarativos e código merece uma análise própria, aprofundada em [Flow, Apex ou LWC?](/blog/flow-apex-lwc).

## Validar com situações que desafiam o desenho

Uma demonstração em que todos os dados estão corretos prova pouco. A validação com usuários deve incluir solicitação incompleta, duplicidade, cancelamento, troca de responsável, ausência do aprovador e indisponibilidade temporária de uma dependência. As situações selecionadas precisam representar riscos plausíveis do processo, sem reproduzir dados privados.

Para cada situação, registrar resultado esperado, evidência observada e tratamento de falha. Se não houver acordo sobre o resultado esperado, existe uma decisão de negócio pendente. Desenvolver mais telas não resolve essa indefinição.

O teste também deve observar a pessoa executando a tarefa: ela compreende a pendência, encontra a informação, identifica o próximo responsável e consegue corrigir um erro? Uma automação pode estar tecnicamente correta e ainda induzir operações inadequadas por falta de contexto.

## Medir a melhoria inteira, inclusive seus efeitos laterais

O tempo de execução de uma etapa é insuficiente para avaliar o processo. Eu acompanharia o tempo total da solicitação, a proporção de pedidos devolvidos, a necessidade de intervenção manual e a recorrência do mesmo problema. Os critérios precisam ser definidos antes da mudança, com populações comparáveis.

Se o atendimento fica mais rápido, mas o backoffice passa a corrigir mais registros, parte do custo apenas mudou de lugar. Se a rotina automatizada funciona, mas depende diariamente de alguém investigando falhas sem documentação, o trabalho não desapareceu. A avaliação deve incluir esse esforço de sustentação.

Também é necessário separar efeito observado de causalidade. Uma queda no prazo pode coincidir com menor demanda ou mudança no tipo de solicitação. [Definir corretamente os indicadores](/blog/indicadores-atendimento) ajuda a evitar a atribuição de todo resultado à automação recém-entregue.

## O resultado que merece ser automatizado

Um bom candidato à automação tem propósito claro, entradas compreendidas, decisões delimitadas e tratamento de exceções proporcional ao risco. Não precisa ser perfeito, mas precisa ser suficientemente conhecido para que a execução automática não multiplique dúvidas.

O aprendizado concreto é começar pela causa operacional e escolher o menor recorte capaz de melhorar o resultado. Automatizar deve reduzir esforço e incerteza para a organização inteira. Se apenas acelera a circulação de um problema, o processo ainda precisa ser redesenhado. Para sustentar essa evolução, vale também [documentar decisões e procedimentos de forma utilizável](/blog/documentar-processos).
