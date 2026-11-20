# Estratégia editorial do Blog HM.crm

> Plano de 20/11/2026. Os títulos, categorias, tags e séries usam a taxonomia de `taxonomy.json`. Esta estratégia organiza conteúdo local e não autoriza push, deploy ou publicação externa.

## Posicionamento e público

O Blog aproxima arquitetura Salesforce, gestão, processos, experimentação e administração empresarial. Sua pergunta recorrente é como uma decisão tecnológica altera o trabalho, a experiência do cliente, o custo de sustentação e a capacidade da organização de aprender.

Os leitores prioritários são administradores Salesforce, analistas de negócio e processos, líderes técnicos e gestores que participam de decisões sobre sistemas. O texto deve apresentar contexto suficiente para a colaboração entre esses públicos, mantendo precisão nos pontos técnicos. Explicar um termo não exige simplificar sua consequência.

Cada artigo tem uma categoria principal. Tags descrevem assuntos transversais; séries oferecem uma sequência de aprendizagem. Uma série pode atravessar categorias sem criar novas categorias ou duplicar o artigo. A navegação entre séries deve preservar a diferença entre um texto completo e uma pauta que ainda será desenvolvida.

## Inventário e estados

O lote inicial contém 18 artigos completos em português, organizados em três por categoria. Seus metadados incluem títulos e resumos PT/EN/ES; isso não equivale a uma tradução integral do corpo. Os artigos estão em `status: ready`, sem data de publicação, aguardando revisão final do autor. A revisão técnica e de confidencialidade registrada não substitui essa leitura final de posicionamento e autoria.

O arquivo `backlog.json` contém exatamente 60 oportunidades adicionais, dez por categoria, com os títulos solicitados no anexo. Cada item possui ID, slug, tags, objetivo, público, problema, ângulo, roteiro, palavras-chave, prioridade, estado e série. Todas as oportunidades permanecem em `status: idea`. Elas não devem aparecer como artigos publicados, receber data fictícia ou ser contadas como textos concluídos.

Ao transformar uma pauta em artigo, o ID `IDEA-*` continua sendo uma referência de planejamento. O artigo recebe metadados próprios e passa pelo fluxo completo de validação. A existência de um roteiro não satisfaz os critérios de profundidade, precisão e segurança editorial.

## As nove séries

| Série | Sequência dos artigos completos | Próximos aprofundamentos propostos |
| --- | --- | --- |
| Arquitetura Salesforce na prática | [Papel operacional do Salesforce](../blog/salesforce-arquitetura-operacional/article.md) → [Flow, Apex ou LWC](../blog/flow-apex-lwc/article.md) | IDEA-005: modelagem de objetos; IDEA-006: manutenção de automações; IDEA-008: governança de acessos. |
| Service Cloud e operações | [Atendimento omnichannel](../blog/atendimento-omnichannel/article.md) | IDEA-002: entidades e eventos; IDEA-001: medição da espera; IDEA-003: filas; IDEA-004: capacidade. |
| Da necessidade de negócio à solução | [Tecnologia e valor de negócio](../blog/tecnologia-valor-negocio/article.md) → [Da necessidade ao protótipo](../blog/necessidade-ao-prototipo/article.md) | IDEA-011: requisitos; IDEA-013: funcionalidades e resultados; IDEA-019: colaboração entre áreas. |
| Gestão de processos empresariais | [Antes de automatizar](../blog/automatizar-processo-ruim/article.md) → [Documentação utilizável](../blog/documentar-processos/article.md) | IDEA-021: gargalos; IDEA-025: padronização; IDEA-027: exceções; IDEA-029: transição operacional. |
| Decisões de arquitetura e trade-offs | [Priorização](../blog/priorizar-projetos/article.md) → [Agentforce e Amazon Connect](../blog/agentforce-amazon-connect/article.md) → [Custo além da licença](../blog/custo-alem-licenca/article.md) | IDEA-017: riscos e dependências; IDEA-049: determinismo e IA; IDEA-055: investimentos. |
| Inteligência artificial com responsabilidade | [Preparação para IA](../blog/empresa-pronta-ia/article.md) → [Complexidade operacional](../blog/ia-reduzir-complexidade/article.md) | IDEA-041: bots e agentes; IDEA-042: dados; IDEA-044: supervisão; IDEA-043: conhecimento. |
| Administração orientada a dados | [Indicadores de atendimento](../blog/indicadores-atendimento/article.md) → [Estratégia e arquitetura](../blog/estrategia-arquitetura/article.md) → [Contexto e decisões](../blog/dados-decisoes/article.md) | IDEA-051: estratégia e execução; IDEA-058: qualidade de dados; IDEA-060: mensuração de iniciativas. |
| Laboratório de ideias e protótipos | [Plataforma de conhecimento](../blog/plataforma-conhecimento/article.md) → [Mapa de chatbot](../blog/mapa-chatbot/article.md) | IDEA-033: laboratório; IDEA-031: painel operacional; IDEA-035: mapa de dependências. |
| Evolução de carreira e liderança técnica | [Liderança técnica](../blog/lideranca-tecnica/article.md) | IDEA-014: conhecimento e liderança; IDEA-018: desenvolvimento profissional; IDEA-010: evolução para arquitetura. |

Os aprofundamentos são propostas de sequência, não datas comprometidas. O campo `series` do backlog determina o agrupamento atual; o `seriesOrder` de cada artigo completo determina sua posição na leitura. Uma pauta pode ser replanejada conforme as perguntas dos leitores, desde que a decisão não deixe links ou sequências inconsistentes.

## Lotes pequenos e decisões de prioridade

P1 identifica fundamentos ou decisões com dependências diretas no lote inicial. P2 aprofunda aplicações e contextos específicos. P3 indica temas exploratórios cuja redação depende de investigação adicional ou de documentação de produto suficientemente estável. A prioridade não mede o valor absoluto do tema nem promete uma data de entrega.

O primeiro lote de expansão pode concentrar-se em entidades de atendimento, requisitos e qualidade dos dados: IDEA-002, IDEA-011 e IDEA-058. São pontes entre conceitos já apresentados e decisões concretas. Antes de iniciar outro lote, concluir a revisão factual, a revisão do autor e os ajustes identificados nos textos em andamento.

Comparações de plataformas e temas sobre evolução da IA exigem verificação da documentação no momento da redação. Disponibilidade, nomenclatura, licenciamento e limites não devem ser tratados como permanentes. Quando a evidência não permitir uma afirmação, delimitar o cenário ou manter o texto em revisão.

## Critérios para desenvolver uma pauta

1. Formular a dificuldade empresarial e a decisão que o leitor poderá discutir melhor.
2. Investigar conceitos e funcionalidades em fontes primárias; registrar URL, escopo e data de consulta.
3. Construir um exemplo hipotético coerente, com números sintéticos identificados quando necessários.
4. Explicar alternativas, limitações e consequências de manutenção, adoção ou operação.
5. Revisar o raciocínio e retirar repetições, clichês e afirmações não sustentadas.
6. Escolher links internos que complementem a decisão discutida, inclusive entre categorias.
7. Revisar confidencialidade e autoria antes de permitir publicação.

A preferência por 900 a 1.600 palavras é uma orientação de profundidade. Não justifica repetir argumentos nem acrescentar seções que não desenvolvam o assunto. O roteiro do backlog é uma hipótese de organização: durante a escrita, pode ser alterado para tornar o raciocínio mais claro.

## Privacidade, maturidade e autoria

Antes de marcar um conteúdo como publicável, confirmar ausência de clientes não autorizados, identificadores reais, dados operacionais privados, configurações sensíveis, regras proprietárias, código corporativo e credenciais. Generalização não transforma automaticamente um caso privado em exemplo autorizado. Quando houver dúvida, o conteúdo permanece fora da publicação.

Propostas de produto devem declarar Conceito, Proposta, Protótipo, Demonstração ou Implementação validada conforme a evidência existente. Uma tela navegável não prova adoção empresarial, segurança de produção ou resultado financeiro. Textos em primeira pessoa precisam ser confirmados pelo autor e não podem criar uma trajetória ou realização que as fontes do projeto não sustentem.

A revisão do autor deve verificar posição defendida, vocabulário, pertinência dos exemplos e limites das afirmações. Datas de publicação são preenchidas somente no fluxo de publicação efetiva; revisão e preparação são eventos distintos. Textos novos não recebem datas passadas para simular histórico editorial.

## Idiomas e manutenção

O português é o idioma original deste lote. Títulos e resumos localizados ajudam a navegação EN/ES, enquanto a ausência de corpo traduzido exige aviso explícito de leitura no original. Uma tradução integral só deve ser disponibilizada após revisão de significado, terminologia, referências e metadados.

Depois da publicação, correções relevantes devem preservar a rastreabilidade da revisão. Verificar links externos e afirmações dependentes de produto quando o texto voltar a ser divulgado ou quando houver mudança conhecida no assunto. Comentários ou dados de audiência só podem orientar o plano quando estiverem realmente disponíveis; este documento não presume uma ferramenta de analytics ou um público já medido.

A manutenção deve favorecer perguntas úteis e coerência entre artigos. O indicador editorial central é se cada texto oferece uma análise defensável para uma decisão concreta. Quantidade de pautas, extensão dos textos e volume de acessos, isoladamente, não demonstram essa qualidade.
