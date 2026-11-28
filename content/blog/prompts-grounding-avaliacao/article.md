Um prompt empresarial é parte de um sistema, com dados, ferramentas e regras de acesso. Melhorar sua redação pode ajudar, mas não corrige uma fonte errada nem concede confiabilidade automática à resposta. O trabalho precisa combinar instruções claras com avaliação e controles externos.

## Descreva a tarefa e o limite

Comece pelo resultado esperado, público, formato e condições de recusa ou encaminhamento. Informe o que o assistente pode concluir a partir das fontes e o que depende de outra decisão.

Em um cenário fictício de apoio a atendentes, a tarefa é resumir a política aplicável e indicar a fonte. O assistente não pode criar uma exceção comercial nem afirmar que uma alteração foi executada sem confirmação do sistema.

Exemplos ajudam a mostrar o formato desejado, mas precisam incluir diversidade e casos difíceis. Um único exemplo perfeito pode induzir respostas semelhantes mesmo quando o contexto exige outro comportamento.

## Use grounding com propósito

Grounding fornece contexto para relacionar a resposta à situação e às informações relevantes. O Prompt Builder do Salesforce permite incorporar recursos do ambiente aos templates, conforme o tipo de configuração. [Salesforce — Ground Prompt Templates with Salesforce Resources](https://help.salesforce.com/s/articleView?id=sf.prompt_builder_ground_template.htm&language=en_US&type=5)

Defina quais informações são necessárias e por quê. Incluir o histórico completo de um cliente pode aumentar custo, exposição e ruído sem melhorar a tarefa.

Separe instruções de conteúdo consultado. Um documento recuperado pode conter texto que tenta alterar o comportamento do assistente. Esse conteúdo deve ser tratado como dado a analisar, e os controles de execução precisam existir fora da linguagem do prompt.

## Crie um conjunto de avaliação

Reúna casos normais, ambiguidades, ausência de informação, fontes conflitantes, conteúdo desatualizado e tentativas de indução. Use dados sintéticos ou autorizados e documente a resposta aceitável.

A avaliação pode verificar correção factual, aderência às fontes, completude, formato e respeito aos limites. Nem toda tarefa tem uma única frase correta; critérios e rubricas permitem comparar respostas diferentes.

O NIST AI RMF oferece uma referência para tratar avaliação e gestão de riscos como atividades contínuas. [NIST — AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) A aplicação prática exige escolher critérios relacionados às consequências do uso específico.

## Compare versões sem escolher apenas exemplos favoráveis

Versione instruções, configurações relevantes e conjunto de casos. Ao alterar o prompt, compare resultados no mesmo material e examine regressões, não apenas melhorias.

Uma resposta mais curta pode omitir uma condição importante. Uma resposta mais detalhada pode introduzir afirmações sem fonte. Consistência de estilo não demonstra consistência factual.

Quando houver variabilidade, repita casos críticos de forma proporcional ao risco e observe a distribuição dos resultados. Uma execução bem-sucedida não garante comportamento estável em todas as situações.

## Defina o caminho para incerteza

O assistente deve conseguir informar que não encontrou base suficiente, pedir um dado necessário ou encaminhar a questão. Esses comportamentos precisam ser avaliados como resultados válidos.

A revisão humana deve apresentar contexto e evidências, permitindo contestação. Se o usuário precisa abrir várias telas para verificar uma sugestão, pode acabar aceitando-a por conveniência.

Depois da disponibilização, acompanhe correções, reclamações e mudanças nas fontes. Mantenha uma forma de interromper ou reverter uma configuração que produza respostas inadequadas.

Prompt engineering útil não se resume a encontrar uma formulação sofisticada. É estabelecer um contrato de comportamento, testar suas limitações e manter o sistema coerente quando contexto, dados e necessidades mudam.
