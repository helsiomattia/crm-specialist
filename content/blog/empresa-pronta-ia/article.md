## A primeira decisão acontece antes da escolha do modelo

Uma empresa pode conseguir demonstrar um assistente convincente e ainda não estar preparada para operá-lo. Na demonstração, a pergunta é conhecida, a base foi selecionada e alguém acompanha cada resposta. No trabalho diário, aparecem solicitações ambíguas, informações desatualizadas, permissões diferentes e pessoas que precisam resolver problemas com pressa. A distância entre esses ambientes é parte do projeto.

Preparação para IA não significa atingir uma maturidade abstrata em todos os departamentos. Significa reunir condições suficientes para um uso específico, com consequências conhecidas e capacidade de interrompê-lo. Um assistente que sugere títulos para documentos exige controles diferentes de um agente autorizado a alterar contratos. Tratar ambos como a mesma iniciativa produz exigências desproporcionais em um caso e controles insuficientes no outro.

O AI RMF 1.0 do NIST organiza a gestão de riscos em quatro funções: governar, mapear, medir e gerenciar. O documento apresenta essas funções como atividades contínuas, sem impor uma sequência universal. A análise abaixo propõe uma aplicação prática ao contexto empresarial; não é uma certificação de prontidão nem uma reprodução integral do framework. [NIST — AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/).

## Defina o trabalho que precisa melhorar

Comece com uma frase verificável: quem realiza qual tarefa, com qual dificuldade e para produzir qual resultado? “Implementar IA no atendimento” não responde a isso. “Ajudar atendentes a encontrar a orientação vigente sobre devoluções, apresentando a fonte para conferência” delimita usuário, ação e evidência esperada.

Essa formulação permite comparar alternativas. Talvez organizar os documentos e melhorar a busca resolva a maior parte do problema. Talvez uma regra determinística seja suficiente para classificar solicitações estruturadas. A IA torna-se candidata quando existe uma dificuldade concreta que sua capacidade de interpretar ou produzir linguagem pode ajudar a resolver, dentro dos limites do processo.

Também é necessário escolher o que ficará fora. No exemplo de devoluções, o assistente pode localizar a política, mas não conceder exceções comerciais. Registrar essa fronteira evita que a conveniência da conversa seja confundida com autoridade para decidir.

## Faça cinco verificações antes do piloto

### Conhecimento que possa ser sustentado

Liste os documentos que fundamentarão as respostas. Para cada conjunto, identifique responsável, público autorizado, versão vigente e procedimento de atualização. Pergunte como uma política retirada deixará de aparecer nos resultados. A pergunta relevante não é quantos arquivos foram carregados, mas quem responderá quando duas fontes entrarem em conflito.

Uma equipe pode começar com um domínio pequeno e confiável. Isso costuma ser mais útil para aprender do que conectar um repositório inteiro sem entender sua qualidade. A organização do conhecimento discutida em [uma plataforma que conecta pessoas, processos e sistemas](/blog/plataforma-conhecimento) é parte dessa preparação.

### Identidade e autorização independentes da conversa

Defina quem pode consultar cada informação e executar cada ação. A identificação de uma intenção pelo modelo não deve conceder acesso. Se uma ferramenta consulta pedidos, o serviço responsável precisa verificar se o usuário pode acessar aquele pedido, independentemente do texto enviado ao assistente.

Separe autorização técnica de aprovação de negócio. Um usuário pode ter acesso ao sistema e ainda precisar de aprovação para uma mudança específica. Essa distinção deve permanecer verdadeira mesmo quando a interface se torna conversacional.

### Processo com exceções explícitas

Desenhe o caminho esperado e os desvios mais relevantes: informação ausente, conflito entre fontes, falha de integração e pedido fora do escopo. Para cada desvio, determine como continuar, encaminhar ou encerrar. “Encaminhar para uma pessoa” só é uma resposta operacional quando há fila, contexto e responsável definidos.

### Avaliação que possa refutar a proposta

Prepare situações de teste antes de ajustar instruções. Inclua perguntas comuns, linguagem imprecisa, documentos contraditórios e pedidos que devem ser recusados. Registre o comportamento esperado e a justificativa. Preserve um conjunto separado para avaliar mudanças; testar apenas os exemplos usados durante o ajuste cria uma impressão frágil de qualidade.

### Responsabilidade após a entrega

Defina quem acompanha resultados, investiga reclamações, atualiza conteúdo e decide suspender uma ação. Reserve capacidade para isso. Um projeto que possui equipe apenas até a demonstração não tem um modelo operacional completo.

## Um piloto ilustrativo de consulta a políticas

Considere uma organização fictícia com uma base de orientações para atendimento. O problema escolhido é o tempo gasto procurando a política correta. O piloto atende um grupo restrito, consulta apenas documentos revisados e apresenta trechos de referência. A pessoa continua responsável pela resposta enviada ao cliente. Não há alteração automática de registros.

Antes do teste, a equipe registra como a consulta funciona sem o assistente. Durante o piloto, observa tempo de localização, correções necessárias, documentos não encontrados e situações em que a ferramenta pareceu útil, mas apontou a política errada. Uma resposta rápida não conta como sucesso se exigir investigação posterior para desfazer o erro.

Os critérios de interrupção são definidos antecipadamente. Por exemplo: qualquer evidência de acesso a documento fora do perfil autorizado suspende o caminho afetado até investigação. A proposta não depende de uma porcentagem genérica de acerto. Ela combina gravidade, exposição e capacidade de recuperação, conforme o uso pretendido.

O piloto também precisa produzir aprendizado sobre o processo. Se as dúvidas mais frequentes surgem porque a política é contraditória, o resultado correto pode ser revisar a política. Criar novas instruções para contornar continuamente a contradição transfere o problema para uma camada menos visível.

## Como decidir entre avançar, restringir e adiar

Avançar faz sentido quando a tarefa é delimitada, as evidências são verificáveis, o risco residual é compreendido e existe capacidade operacional para acompanhar o uso. Restringir é apropriado quando o benefício aparece em uma parte do escopo, mas ações mais amplas ainda não têm controles suficientes. Adiar é uma decisão válida quando faltam responsáveis, fontes confiáveis ou condições de recuperar falhas.

Evite transformar essas opções em uma nota única. Uma média alta pode esconder um impedimento grave: excelente experiência de uso não compensa ausência de autorização. Use critérios eliminatórios para condições indispensáveis e comparações graduais para os demais aspectos.

Inclua os custos de avaliação, curadoria, integração e suporte na análise. O custo por solicitação ao modelo é apenas uma parcela. O artigo sobre [custos além da licença](/blog/custo-alem-licenca) aprofunda essa diferença entre contratação e sustentação.

## Prontidão é capacidade de aprender com controle

Uma empresa está pronta para determinado uso de IA quando consegue explicar o problema, delimitar a atuação, avaliar o resultado e assumir suas consequências. Não precisa prever toda ocorrência futura, mas precisa reconhecer sinais de falha e responder a eles.

A primeira entrega pode ser uma base menor e melhor organizada, um processo mais claro ou um piloto com escopo reduzido. Esses resultados não representam atraso na inovação. Eles tornam possível decidir com evidências se a IA realmente [reduz a complexidade da operação](/blog/ia-reduzir-complexidade).
