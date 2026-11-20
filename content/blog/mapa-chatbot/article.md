**Maturidade: Proposta.** O mapa descrito aqui é uma proposta de ferramenta para análise de conversas e dependências. Não corresponde a uma implantação corporativa validada. Todos os fluxos e situações apresentados são hipotéticos.

Um chatbot pode parecer simples para quem usa: escolher um assunto, informar alguns dados e receber uma resposta. Para quem mantém o serviço, essa conversa pode atravessar regras de elegibilidade, integrações, horários, filas, autenticação e transferências. Uma mudança aparentemente pequena pode afetar caminhos que não aparecem na tela principal do editor.

Um mapa interativo teria valor se ajudasse a investigar essas relações. O objetivo não seria produzir um desenho impressionante, mas permitir que diferentes pessoas respondessem perguntas concretas sobre comportamento, dependências e riscos de mudança.

## O que uma árvore de perguntas não mostra

Uma árvore representa bem certas sequências de escolha, mas a conversa real pode retornar a etapas anteriores, retomar uma sessão, receber uma falha externa ou transferir o atendimento. O usuário também pode abandonar o fluxo antes de chegar a um encerramento previsto.

Considere um cenário hipotético de consulta de solicitação. O bot identifica a intenção, solicita autenticação, consulta um sistema e decide entre apresentar o resultado ou oferecer transferência. Se a consulta falhar, o comportamento depende de uma política: tentar novamente, informar indisponibilidade ou encaminhar para apoio. Essas transições são parte do produto, ainda que não correspondam a uma pergunta visível.

O mapa precisaria representar estados, transições e dependências. Uma etapa teria um propósito; uma transição teria uma condição; uma dependência indicaria um recurso necessário. Misturar tudo em caixas iguais reduziria a capacidade de análise.

## Definir a informação antes de escolher a visualização

Eu começaria por um modelo com identificador, nome, tipo, descrição, condição de entrada e responsável. Uma etapa de integração acrescentaria contrato de entrada e saída em nível conceitual, comportamento diante de falha e referência para a documentação autorizada. O mapa público de demonstração não conteria endpoints internos, credenciais ou dados de clientes.

As transições seriam igualmente importantes: origem, destino, condição e motivo. Um caminho sem condição clara pode indicar ambiguidade; uma etapa sem saída pode representar um encerramento intencional ou um problema de desenho. A ferramenta deveria destacar a diferença como questão para revisão, sem concluir automaticamente que toda irregularidade é um defeito.

A [BPMN 2.0.2, da OMG](https://www.omg.org/spec/BPMN/2.0.2), é uma referência de notação para processos. Um mapa de chatbot pode aproveitar o princípio de explicitar eventos e decisões, mas não deve se declarar um modelo BPMN válido se usar símbolos e regras próprios. A linguagem adotada precisa ser documentada para não criar uma falsa interoperabilidade.

## Três perguntas que justificariam a interação

Primeira: “o que depende desta integração?”. Ao selecionar um recurso, o mapa mostraria os caminhos que o utilizam e os tratamentos de falha conhecidos. Isso ajudaria a discutir o impacto de uma indisponibilidade ou alteração de contrato.

Segunda: “como uma pessoa chega à transferência?”. A visualização destacaria os caminhos de encaminhamento e as informações que deveriam acompanhar a conversa. Essa análise aproximaria o desenho do bot da [arquitetura de atendimento omnichannel](/blog/atendimento-omnichannel), incluindo a continuidade após a automação.

Terceira: “o que mudou entre duas versões?”. Em vez de comparar apenas imagens, o produto apresentaria alterações em etapas, condições e dependências. Uma mudança de texto não teria o mesmo significado de uma mudança no critério de decisão. A revisão deveria permitir identificar essas diferenças sem esconder nenhuma delas.

## Mostrar caminhos sem sobrecarregar a pessoa

Exibir tudo ao mesmo tempo pode transformar o mapa em uma rede ilegível. Proponho uma visão inicial por assunto, com expansão progressiva de detalhes. Filtros por integração, responsabilidade e tipo de etapa ajudariam a investigar uma pergunta específica. Uma trilha indicaria onde a pessoa está e como voltar ao contexto anterior.

O mapa também deveria oferecer uma representação textual equivalente. A [WCAG 2.2, do W3C](https://www.w3.org/TR/WCAG22/), inclui requisitos para operação por teclado e para evitar dependência exclusiva da cor. Para esta proposta, isso significa permitir navegar entre etapas, consultar suas relações e identificar estados sem exigir arrastar um canvas ou distinguir apenas tons coloridos.

Uma lista de etapas com filtros pode ser mais eficiente que o grafo para certas tarefas. As duas formas deveriam compartilhar o mesmo modelo de dados. Assim, a visualização gráfica seria uma alternativa de exploração, não uma barreira para acessar a informação.

## Separar desenho esperado de execução observada

O mapa de configuração descreve o que deveria acontecer. Registros de execução mostram o que ocorreu em determinadas condições. São perspectivas complementares, mas não intercambiáveis. Uma transição possível pode nunca ter sido usada; uma sequência observada pode refletir uma versão anterior.

Uma evolução futura poderia associar métricas agregadas às etapas, desde que existissem permissão, qualidade de dados e vínculo com a versão correta. Na proposta inicial, eu usaria apenas números sintéticos claramente identificados, evitando qualquer aparência de desempenho real.

Mesmo com dados confiáveis, maior volume não significa maior importância. Um caminho raro pode tratar uma situação crítica. Já um caminho muito utilizado pode representar uma tarefa simples. A avaliação precisaria combinar frequência, consequência e contexto, sem reduzir prioridade à espessura de uma linha.

## Testar a proposta com uma mudança delimitada

O protótipo inicial poderia conter um fluxo fictício de consulta, uma integração e uma transferência. A tarefa seria avaliar o impacto de tornar um campo obrigatório. As pessoas precisariam localizar quem coleta o dado, quem o utiliza e como o caminho se comporta quando a informação está ausente.

O teste observaria se a ferramenta ajuda a encontrar essas relações e se gera interpretações incorretas. Comentários como “o mapa ficou bonito” seriam secundários. O aprendizado relevante seria saber se a decisão ficou mais compreensível e quais dependências continuaram invisíveis.

Também seria importante testar a atualização do modelo. Se cada pequena alteração exigir redesenho manual extenso, o mapa poderá ficar desatualizado rapidamente. Uma eventual importação deveria preservar origem e versão, apontando elementos não reconhecidos em vez de descartá-los silenciosamente.

## O mapa como instrumento de revisão

Uma ferramenta desse tipo não garante qualidade do chatbot. Ela torna determinadas perguntas mais fáceis de investigar e pode revelar lacunas que exigem discussão. O valor está na relação entre representação, evidência e decisão.

Antes de construir uma plataforma ampla, eu validaria um recorte com uma tarefa realista e critérios de observação definidos. A mesma disciplina aparece no [método de desenvolvimento de protótipos](/blog/necessidade-ao-prototipo): a interface deve tornar uma hipótese testável. Nesse caso, a hipótese é que tornar dependências visíveis melhora a revisão de mudanças na conversa.
