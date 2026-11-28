**Maturidade: Proposta.** Este artigo descreve um desenho conceitual e critérios de avaliação. Os cenários são fictícios; não declara implantação corporativa nem resultados medidos.

O Revenue & Churn Intelligence proposto aqui reuniria informações para investigar crescimento, renovação e perda de clientes. O objetivo inicial seria explicar variações e orientar conversas, sem apresentar previsões como certezas ou atribuir resultados a um produto ainda não validado.

Receita crescente pode esconder perda de clientes pequenos compensada por poucos contratos maiores. Um painel precisa permitir enxergar composição e concentração, além do total.

## Defina as unidades de análise

Antes de criar gráficos, estabeleça se a análise considera clientes, contratos, assinaturas ou receita recorrente. Uma organização pode ter vários contratos, e o encerramento de um deles não significa necessariamente perda do cliente.

Defina também período, moeda, tratamento de descontos, expansão, redução e cancelamento. A taxa de churn de clientes e a perda de receita respondem a perguntas diferentes; não devem compartilhar rótulos ambíguos.

Em um cenário sintético, uma carteira começa com cem clientes e perde cinco no período. A taxa de perda daquela base é 5%, segundo essa definição. Novos clientes adquiridos durante o período precisam de tratamento separado para não ocultar o movimento da coorte inicial.

## Combine resultado e contexto

A proposta teria uma visão de composição da receita, uma análise de coortes e uma lista de contas que merecem investigação. Cada número poderia ser aberto até os registros que o compõem, respeitando permissões.

A confiabilidade depende de dados adequados à finalidade, com atenção à completude, consistência e atualização. O framework de qualidade de dados do GOV.UK oferece critérios para essa avaliação. [GOV.UK — The Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework)

Contratos sem data de renovação ou motivos de cancelamento preenchidos de forma inconsistente seriam mostrados como limitações. O painel não deveria distribuir automaticamente casos desconhecidos entre categorias para completar gráficos.

## Use sinais explicáveis

Queda de uso, aumento de incidentes, atraso em implantação e troca de patrocinador podem ser sinais a investigar. Nenhum deles prova isoladamente intenção de cancelamento.

Uma recomendação apresentaria os sinais, a janela observada e a ação sugerida, como revisar adoção ou confirmar objetivos. O responsável poderia registrar se a hipótese foi útil, incorreta ou inconclusiva.

O sistema também precisaria considerar sinais contraditórios. Um cliente pode reduzir uso por sazonalidade e manter satisfação alta. A ausência de contexto aumenta o risco de intervenções comerciais inadequadas.

## Teste a utilidade antes de modelar previsão

O primeiro protótipo poderia usar regras transparentes e dados fictícios. Participantes receberiam contas com perfis distintos e explicariam quais ações escolheriam e por quê.

Uma etapa posterior, com histórico autorizado, exigiria separar o momento da previsão do conhecimento futuro. Usar informações registradas após o cancelamento criaria vazamento de dados e uma avaliação artificialmente favorável.

Compare a proposta com uma referência simples e acompanhe falsos alertas, casos relevantes não identificados e custo da intervenção. Acurácia isolada pode ser pouco informativa quando o evento é raro.

## Conecte recomendações a responsabilidades

Cada alerta precisaria de dono, prazo e critério de encerramento. Caso contrário, a organização ganharia uma nova fila de notificações sem capacidade de agir.

O experimento seria considerado promissor se ajudasse usuários a formular hipóteses melhores e escolher intervenções coerentes, sem esconder incerteza. Isso ainda não demonstraria redução de churn ou aumento de receita; esses efeitos dependeriam de avaliação posterior e de fatores que ultrapassam o painel.
