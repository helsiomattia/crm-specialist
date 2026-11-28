**Maturidade: Proposta.** Este artigo descreve um desenho conceitual e critérios de avaliação. Os cenários são fictícios; não declara implantação corporativa nem resultados medidos.

Esta proposta de Architecture Control Center explora uma pergunta recorrente: o que pode ser afetado se este componente mudar? A resposta exige mais que um diagrama estático. É necessário conhecer relações, responsáveis, evidências e a data em que cada informação foi confirmada.

O primeiro objetivo seria apoiar análise de impacto e investigação. A ferramenta não substituiria revisão técnica nem garantiria descoberta automática de todas as dependências.

## Delimite o catálogo inicial

Um recorte viável poderia incluir objetos, campos, Flows, classes Apex, componentes de interface e integrações de um processo. Cada item teria identificador, tipo, finalidade, responsável e ambiente.

As relações precisariam de significado explícito: lê, altera, invoca, publica evento ou depende de contrato. Uma linha genérica entre dois componentes não informa o risco de uma mudança.

Em um cenário fictício, um campo de status é utilizado por uma validação, uma automação e uma integração financeira. O mapa ajudaria a localizar esses usos e a identificar quem deve participar da avaliação.

## Registre origem e confiança

Parte das relações poderia vir de metadados; outra parte dependeria de documentação ou confirmação humana. A interface distinguiria relações detectadas, declaradas e ainda não verificadas.

Data da última coleta, versão e ambiente seriam essenciais. Um mapa de homologação não representa automaticamente produção. Uma relação antiga pode continuar válida, mas precisa de sinalização quando ultrapassar o prazo de revisão acordado.

Dependências construídas dinamicamente ou existentes fora do Salesforce podem não aparecer em uma leitura de metadados. O produto deve mostrar essa limitação de cobertura.

## Conecte integração a comportamento

O catálogo não deveria registrar apenas que dois sistemas se comunicam. Precisaria incluir direção, frequência, contrato, tratamento de falhas e responsável pela reconciliação.

Os padrões de integração de Salesforce distinguem cenários e características de interação. Essa referência ajuda a descrever o comportamento esperado, sem escolher um padrão apenas pelo nome. [Salesforce Architects — Integration Patterns](https://architect.salesforce.com/docs/architect/fundamentals/guide/integration-patterns.html)

Uma troca periódica de dados e uma chamada síncrona têm consequências diferentes para disponibilidade e consistência. A análise de impacto precisa preservar essas diferenças.

## Desenhe uma consulta de mudança

O usuário selecionaria um componente e informaria a alteração proposta. A ferramenta apresentaria dependências diretas, relações indiretas relevantes e pontos sem informação suficiente.

O resultado poderia gerar uma lista de revisão: contratos a confirmar, cenários de teste, responsáveis a consultar e documentação a atualizar. Não seria uma autorização automática para publicar a mudança.

Também seria importante evitar excesso de conexões. Filtros por processo, ambiente e tipo de relação ajudariam a manter o mapa compreensível, com acesso aos detalhes quando necessário.

## Valide com exercícios de impacto

O protótipo usaria uma arquitetura sintética com dependências conhecidas e algumas lacunas intencionais. Participantes analisariam mudanças e comparariam suas conclusões com um roteiro de referência.

Os critérios incluiriam dependências relevantes encontradas, falsos vínculos, tempo de investigação e compreensão das limitações. Um mapa visualmente impressionante, mas incapaz de distinguir relações atuais de antigas, não atenderia ao objetivo.

Para uma evolução real, seria necessário definir coleta segura, atualização, revisão e controle de acesso. A proposta teria valor se reduzisse a incerteza de forma verificável, mantendo claro quais partes da arquitetura ainda exigem investigação humana.
