## A tela ficou simples. E a operação?

Um campo de conversa pode substituir várias telas e parecer uma grande simplificação. Entretanto, atrás dele podem surgir uma base duplicada, regras reescritas em instruções, integrações adicionais e uma equipe encarregada de conferir respostas. A experiência aparente ficou mais curta, mas o trabalho total pode ter aumentado.

Esse é um critério útil para avaliar IA empresarial: observar onde a complexidade foi removida, onde foi transferida e quem passou a administrá-la. Não basta contar cliques evitados. É preciso considerar correções, exceções, atualizações, investigação de falhas e dependências criadas. Uma solução pode exigir engenharia adicional e ainda valer a pena, desde que retire um esforço maior ou permita um resultado relevante que antes não era viável.

O conceito de *toil*, apresentado no livro de SRE do Google, ajuda a distinguir trabalho operacional repetitivo e automatizável de atividade que gera melhoria duradoura. A aplicação à IA é uma interpretação deste artigo: se cada resposta exige uma nova conferência improvisada, talvez a solução esteja apenas mudando o formato do trabalho repetitivo. [Google SRE — Eliminating Toil](https://sre.google/sre-book/eliminating-toil/).

## Separe interpretação de decisão de negócio

Uma arquitetura compreensível começa por atribuir responsabilidades diferentes. Interpretar uma solicitação em linguagem natural é uma tarefa. Verificar identidade, aplicar uma política e registrar uma transação são outras. O fato de essas etapas caberem na mesma conversa não significa que devam ser executadas pelo mesmo mecanismo.

Considere uma alteração de endereço em um cenário hipotético. A IA pode reconhecer que a pessoa deseja atualizar o cadastro e identificar informações ainda ausentes. O serviço de cadastro continua responsável por validar os campos, verificar autorização e aplicar a mudança. As condições para alterar um endereço devem valer também quando a solicitação vem de um formulário ou de um atendente.

Se a regra existe somente no texto de instruções do agente, surge um problema de manutenção: outras entradas do sistema podem obedecer a critérios diferentes. A recomendação aqui é manter uma autoridade clara para as regras e fazer a camada conversacional utilizar serviços com contratos explícitos. Isso reduz a necessidade de sincronizar várias interpretações da mesma política.

Não se trata de excluir o modelo de toda decisão. Algumas tarefas envolvem classificação ou avaliação contextual que não podem ser reduzidas a uma regra simples. Nesses casos, descreva a incerteza, as consequências de erro e os mecanismos de revisão. A fronteira deve ser escolhida pelo trabalho e pelo risco, não por uma preferência geral por código ou por IA.

## Construa um orçamento de complexidade

Antes de implantar uma nova camada, registre o trabalho atual e o trabalho esperado. Um inventário curto pode responder:

- Que atividade manual será reduzida ou eliminada?
- Que informação deixará de ser copiada entre sistemas?
- Que nova configuração terá de ser mantida?
- Quem investigará uma resposta incorreta ou uma ação incompleta?
- Qual componente poderá ser retirado quando a solução entrar em operação?

Essa última pergunta é especialmente esclarecedora. Se todas as etapas antigas continuam necessárias e várias novas são adicionadas, o benefício precisa ser demonstrado com cuidado. Pode haver uma justificativa temporária durante a transição, mas ela deve ter prazo, critérios de saída e um responsável.

O orçamento não precisa transformar toda dificuldade em uma nota numérica. Algumas dependências são fáceis de contar, como o número de integrações mantidas. Outras exigem julgamento, como a dificuldade de reconstruir uma decisão. O importante é tornar os compromissos visíveis para quem aprova e para quem opera.

## Um exemplo de assistência que simplifica

Imagine uma equipe fictícia que recebe solicitações longas por escrito. Hoje, a pessoa responsável lê o histórico, extrai informações relevantes, identifica o assunto e registra um resumo. Uma proposta de IA produz um rascunho estruturado dentro da ferramenta já utilizada, aponta lacunas e permite que o atendente ajuste o resultado antes de salvar.

Nesse desenho, o modelo não cria uma segunda fila de trabalho nem um cadastro paralelo. O registro aprovado continua no sistema existente. A intervenção humana tem objetivo definido: avaliar o resumo e completar o contexto. A equipe pode comparar o esforço de elaboração com o esforço de revisão e acompanhar quais partes demandam mais correção.

Agora considere uma alternativa: o assistente envia o resumo para outro painel, cria uma classificação própria e exige que alguém copie os campos de volta. Mesmo que o texto seja bom, o fluxo adiciona passagem de contexto, treinamento e reconciliação. Essa alternativa pode funcionar como experimento, mas ainda não demonstra simplificação da operação.

Os dois desenhos usam IA. A diferença está na integração com o trabalho. A pergunta de avaliação é se a nova atividade cabe no processo e se o resultado continua rastreável, não se a ferramenta consegue gerar um resumo impressionante isoladamente.

## Meça o caminho completo, incluindo a recuperação

Tempo de resposta do modelo não é tempo de resolução. Meça também conferência, correção, encaminhamento e retomada após uma falha. Observe se a equipe precisa abrir ferramentas adicionais para descobrir o que aconteceu. Um erro que demora a ser percebido pode custar mais que uma recusa explícita no momento certo.

Crie uma classificação de falhas que permita agir. Fonte desatualizada demanda curadoria; interpretação equivocada pode demandar revisão das instruções ou redução de escopo; rejeição de uma integração pode exigir correção do contrato; autorização incorreta exige investigação dos controles de acesso. Agrupar tudo como “a IA errou” impede identificar o responsável e a solução.

Uma trilha útil registra a tarefa solicitada, a fonte consultada, a ação tentada e o resultado, respeitando a necessidade de minimizar dados registrados. Não é necessário armazenar indiscriminadamente toda conversa para obter rastreabilidade. A evidência deve responder às perguntas de suporte e avaliação sem criar um novo depósito de informação sensível.

## Dê prioridade à retirada de trabalho desnecessário

Há casos em que simplificar significa remover uma aprovação redundante, corrigir uma integração ou tornar uma política mais clara. A IA pode ajudar a detectar o problema, mas não precisa ser a solução definitiva. Por isso, [automatizar um processo ruim](/blog/automatizar-processo-ruim) e adicionar inteligência sobre ele compartilham uma limitação: ambos preservam problemas que não foram examinados.

Também há limites para a automação. Uma negociação excepcional ou uma decisão com informações conflitantes pode exigir uma pessoa com autoridade e contexto. Um sistema bem desenhado reconhece essa fronteira e entrega o contexto necessário, em vez de insistir em concluir toda interação sozinho.

A redução de complexidade aparece quando a solução permite que menos esforço seja gasto para produzir e sustentar um resultado confiável. Para decidir se isso ocorreu, combine a [preparação da empresa para IA](/blog/empresa-pronta-ia) com a análise do [custo de sustentação](/blog/custo-alem-licenca). O melhor agente para uma operação pode ser aquele que executa um conjunto menor de tarefas, mas as executa dentro de fronteiras claras e sem criar trabalho oculto.
