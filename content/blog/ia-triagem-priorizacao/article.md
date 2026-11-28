Classificar uma solicitação, definir sua prioridade e recomendar uma próxima ação são tarefas diferentes. Uma IA pode identificar o assunto corretamente e ainda sugerir uma ação inadequada. O desenho operacional precisa separar essas decisões para avaliar cada uma e limitar suas consequências.

## Escolha uma tarefa com fronteiras claras

Um primeiro uso pode sugerir a categoria de um caso a partir do texto recebido. Outro pode localizar informações relevantes para o atendente. A alteração automática de prioridade ou o envio de uma resposta exigem avaliação adicional, pois afetam o processo diretamente.

Defina entrada, saída, usuários e situações fora do escopo. Se a classificação depende de informações ausentes, a resposta aceitável pode ser “revisão necessária”. Obrigar o modelo a escolher sempre uma categoria cria certeza artificial.

O AI Risk Management Framework do NIST oferece uma referência para organizar gestão de riscos de IA ao longo de seu uso. A aplicação deve considerar o contexto e as consequências da tarefa. [NIST — AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

## Mantenha regras contratuais verificáveis

A IA pode extrair indícios de urgência, mas um SLA depende de regras, calendário, marcos e condições acordadas. O prazo oficial deve ser calculado por um mecanismo controlado e auditável.

Em um cenário fictício, a mensagem diz “preciso disso hoje”, enquanto o contrato estabelece outro prazo. O sistema pode sinalizar a urgência percebida sem alterar silenciosamente o compromisso contratual. Uma pessoa ou política autorizada decide se haverá exceção.

Da mesma forma, uma next best action é uma recomendação contextual. Ela precisa respeitar elegibilidade, permissões e restrições comerciais antes de ser apresentada ou executada.

## Construa uma amostra de avaliação útil

Selecione exemplos representativos, autorizados e com critérios de classificação revisados. Inclua mensagens curtas, ambíguas, com múltiplos assuntos e fora do domínio. Separe os dados usados para ajustar instruções daqueles usados para avaliar.

Compare com uma referência simples, como regras existentes ou a classificação humana atual. Se a proposta não melhora uma dimensão relevante, sua complexidade adicional precisa ser justificada.

Avalie erros por categoria. Confundir dois assuntos semelhantes pode ter pouco impacto; deixar de reconhecer uma situação crítica pode exigir tratamento específico. Uma média geral esconde essas diferenças.

## Avalie confiança e encaminhamento

Um número produzido pelo modelo não é automaticamente uma probabilidade calibrada. Antes de usar limiares, verifique a relação entre o sinal de confiança e os acertos observados.

Defina quando encaminhar para revisão e qual contexto acompanhará a sugestão. O revisor precisa ver a entrada, a classificação proposta e as evidências pertinentes. Revisão humana sem tempo, informação ou autoridade tende a virar confirmação automática.

Registre correções com cuidado: uma mudança feita por pressa não deve ser tratada imediatamente como verdade para treinamento.

## Introduza a automação em etapas

Comece observando recomendações sem alterar o fluxo. Depois permita sugestões revisadas e, apenas se houver evidência suficiente, avalie ações automáticas de baixo impacto e reversíveis.

Acompanhe qualidade, tempo total, retrabalho e distribuição de erros entre públicos. Monitore também alterações de linguagem, produtos e políticas que possam reduzir o desempenho.

Mantenha um caminho para interromper o uso e retornar ao processo conhecido. O benefício da IA deve aparecer no trabalho completo, incluindo revisão e correção, e não apenas no tempo de gerar uma classificação.
