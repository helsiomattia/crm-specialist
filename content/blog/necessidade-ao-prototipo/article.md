**Maturidade: Proposta.** Apresento aqui um método de trabalho proposto para transformar uma necessidade operacional em um protótipo avaliável. O texto não afirma que esse método tenha produzido resultados específicos em empresas. O cenário utilizado é hipotético.

“Precisamos de um painel” parece um pedido claro, mas deixa questões essenciais abertas. Quem vai utilizá-lo? Qual decisão está difícil? Quais informações faltam? O que deveria acontecer depois de identificar um problema? Começar pela tela pode produzir uma solução visualmente convincente para uma necessidade ainda mal compreendida.

Meu método proposto parte da decisão e avança até a interação. Cada etapa produz uma evidência pequena que permite continuar, reformular ou interromper o trabalho. O protótipo é um instrumento de investigação; sua aparência não deve ser confundida com prontidão para operar.

## 1. Reescrever o pedido como uma dificuldade observável

Considere uma supervisão hipotética que quer “enxergar melhor as filas”. A frase pode esconder falta de atualização, dificuldade para comparar demandas ou ausência de autoridade para redistribuir trabalho. Um painel resolveria apenas parte dessas situações.

Eu reformularia o pedido assim: “a pessoa responsável precisa identificar solicitações que exigem intervenção e compreender qual ação pode tomar”. Em seguida, buscaria exemplos do trabalho: quando a dúvida aparece, quais informações são consultadas, quem participa e o que acontece enquanto a decisão não é tomada.

Esse levantamento deveria registrar fatos observados separadamente de interpretações. “A pessoa consultou três fontes” é uma observação. “Uma tela única resolverá o problema” é uma hipótese. A distinção protege o desenho contra a certeza prematura.

## 2. Explicitar a hipótese e a condição de abandono

A hipótese do protótipo poderia ser: “reunir sinais de prioridade e contexto do atendimento ajuda a supervisão a identificar a próxima intervenção”. Ela precisa ser suficientemente delimitada para que um teste revele algo útil.

Também definiria o que faria a proposta ser descartada. Se a pessoa encontra o problema, mas não pode agir porque a responsabilidade não está definida, a interface pode não ser a principal intervenção necessária. Se os dados não representam a situação atual, aumentar o destaque visual pode apenas acelerar uma decisão inadequada.

O [guia de fase alpha do GOV.UK](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works) recomenda testar pressupostos de maior risco e construir apenas o necessário para explorá-los. Uso essa orientação como referência de descoberta: o recorte deve enfrentar a incerteza principal, sem tentar antecipar uma aplicação completa.

## 3. Desenhar a decisão antes dos componentes

Antes de escolher cards, tabelas ou gráficos, eu descreveria a sequência: perceber uma situação, compreender seu contexto, comparar alternativas, agir e verificar o efeito. Essa sequência revela quais informações pertencem à visão inicial e quais podem aparecer quando a pessoa aprofunda a análise.

No exemplo, um alerta sem contexto pode gerar interrupções desnecessárias. Um número agregado pode esconder o item que exige ação. Uma lista extensa pode dificultar a identificação do que mudou. A composição da tela deve responder a essas tensões, sem presumir que mais informação produz automaticamente melhor decisão.

Também definiria os estados que desafiam o desenho: nenhum item, dado desatualizado, falha de carregamento, permissão insuficiente e ausência de ação disponível. Esses estados fazem parte da experiência. Deixá-los para depois cria uma demonstração que funciona apenas quando tudo está favorável.

## 4. Escolher a fidelidade necessária

Um desenho em papel pode esclarecer organização e vocabulário. Uma tela navegável pode testar a sequência de ações. Um protótipo em HTML pode explorar comportamento responsivo, foco e leitura com maior realismo. A escolha depende da pergunta, não de uma preferência fixa por ferramentas.

O [guia de prototipação do GOV.UK](https://www.gov.uk/service-manual/design/making-prototypes) apresenta diferentes formas de protótipo e recomenda adequar a forma à necessidade de pesquisa. Nesta proposta, isso significa evitar investimento em integração real quando a dúvida principal ainda é se a pessoa compreende a informação apresentada.

Por outro lado, um desenho estático não responde bem a uma dúvida sobre interação com muitos estados. Nesse caso, elevar a fidelidade pode ser necessário. O custo adicional se justifica quando permite observar um comportamento que o artefato anterior não consegue representar.

## 5. Construir um cenário sintético coerente

Os dados de demonstração precisam ser fictícios e identificados como tal, mas não podem ser escolhidos apenas para favorecer a proposta. Eu incluiria situações comuns, ambiguidades e exceções que desafiassem a leitura.

No painel hipotético, haveria uma fila com alta demanda, outra com poucos itens complexos e um item cuja informação estivesse desatualizada. Não atribuiria resultados reais a esses exemplos. A finalidade seria testar se a pessoa distingue quantidade, urgência e confiabilidade da informação.

Também manteria separação clara entre ações simuladas e ações reais. Um botão de redistribuição poderia demonstrar a consequência esperada sem alterar qualquer sistema. Se o protótipo fosse compartilhado para avaliação, essa limitação precisaria estar visível, evitando que alguém o interpretasse como ferramenta operacional.

## 6. Observar tarefas, registrar evidências e revisar

Eu proporia uma tarefa como: “identifique uma situação que merece intervenção e explique sua decisão”. Durante a observação, evitaria ensinar o caminho. A explicação da pessoa ajudaria a entender se a interface comunica a lógica pretendida ou se ela está compensando lacunas com conhecimento prévio.

O registro deveria separar comportamento, interpretação e alteração proposta. Se alguém ignora um indicador, a causa pode ser falta de destaque, incompreensão do termo ou irrelevância para a decisão. Mudar a cor antes de investigar pode corrigir a hipótese errada.

Depois, priorizaria as revisões que afetam compreensão, segurança da decisão e execução da tarefa. Preferências visuais também podem ser consideradas, mas não deveriam deslocar problemas que impedem o uso. Uma nova rodada precisaria verificar se a alteração resolveu o problema identificado sem introduzir outro.

## 7. Decidir o que o protótipo autoriza concluir

Uma avaliação favorável pode indicar que o conceito é compreensível em determinadas condições. Ela não comprova desempenho em produção, qualidade das integrações, segurança completa ou retorno financeiro. Essas questões precisam de evidências próprias antes de uma implementação.

Ao encerrar o ciclo, eu produziria um registro com hipótese, público observado, cenários utilizados, limitações, decisões e questões ainda abertas. Esse material sustentaria a escolha entre desenvolver, investigar mais ou abandonar a solução. A [priorização de projetos](/blog/priorizar-projetos) passa a contar com evidências, em vez de depender apenas do entusiasmo gerado pela demonstração.

O valor de um protótipo está no que permite aprender antes de assumir compromissos maiores. Um resultado útil pode ser descobrir que a necessidade exige ajustar o processo, e não construir uma tela. As propostas de [plataforma de conhecimento](/blog/plataforma-conhecimento) e [mapa de chatbot](/blog/mapa-chatbot) são exemplos de conceitos que devem atravessar essa mesma disciplina antes de receberem o rótulo de implementação validada.
