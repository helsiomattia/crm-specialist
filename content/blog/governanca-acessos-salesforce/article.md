Uma pessoa consegue abrir o aplicativo, mas não encontra o caso que precisa atender. Outra vê o registro, porém não pode alterar um campo. Um terceiro usuário continua exportando informações depois de mudar de equipe. Esses problemas pertencem a camadas diferentes; tentar resolvê-los com um perfil mais permissivo mistura diagnóstico com concessão de acesso.

Uma governança útil começa pela tarefa autorizada. A pergunta não é apenas se uma configuração permite trabalhar, mas se permite exatamente o trabalho esperado, durante o período adequado, com um responsável por revisar a decisão.

## Separar as camadas antes de conceder privilégios

Licença define elegibilidade a recursos conforme a contratação. Autenticação identifica quem está entrando; autorização determina o que essa identidade pode fazer. SSO, portanto, não substitui a definição de acesso dentro da organização.

Profiles, Permission Sets e Permission Set Groups participam das permissões de objetos e campos. Roles e mecanismos de sharing participam da visibilidade de registros. A documentação diferencia essas camadas; conceder leitura de um objeto não equivale a conceder todos os seus registros. Consulte [Salesforce — Control Who Sees What](https://help.salesforce.com/s/articleView?id=security_data_access.htm&language=en_US).

Trate essas peças como um conjunto. Um usuário pode receber a mesma capacidade por caminhos diferentes. Retirar um Permission Set isolado não prova que a capacidade desapareceu se outra atribuição continuar concedendo-a. A revisão precisa observar o acesso efetivo, incluindo exceções administrativas.

## Construir uma matriz por tarefa

Considere uma operação fictícia com atendimento, supervisão e administração. Atendimento consulta casos atribuídos e registra a resposta. Supervisão redistribui trabalho dentro de seu domínio. Administração mantém configurações e não deve usar privilégios elevados para tarefas cotidianas sem necessidade.

Para cada papel, descreva objeto, ação, campos relevantes e alcance dos registros. Acrescente justificativa, aprovador e duração quando o acesso for temporário. Evite transformar o nome do cargo em uma autorização genérica: pessoas com o mesmo cargo podem atuar em unidades com responsabilidades distintas.

Uma matriz pequena, mantida junto das mudanças de processo, é mais verificável que dezenas de perfis sem explicação. Grupos de permissões podem organizar conjuntos de trabalho; não devem esconder a origem nem a necessidade de cada privilégio.

## Tratar entrada, movimentação e saída

A admissão não encerra o ciclo. Uma mudança de função deve retirar capacidades antigas além de conceder novas. Uma substituição temporária precisa de data ou condição de encerramento. A saída exige coordenação entre identidade, sessões, integrações e responsabilidades de registros.

No cenário hipotético, alguém que deixa a supervisão mantém acesso a uma exportação ampla. O controle corretivo é revisar atribuições e testar a capacidade efetiva. O controle preventivo é vincular movimentações de pessoas a um procedimento com evidência de execução.

Contas de integração exigem análise própria. Registre finalidade, sistema consumidor, escopo de dados, responsável e procedimento de recuperação. Compartilhar uma credencial administrativa entre várias integrações dificulta revogar um consumidor sem afetar os demais.

## Testar a proibição, não somente o sucesso

Uma homologação útil verifica se o atendente consegue concluir sua tarefa e se não consegue ultrapassar seu domínio. Inclua consulta por relatório, interface e caminhos programáticos relevantes. A ausência de um botão não constitui uma proteção de dados.

Ao usar Apex, verifique explicitamente o modelo de acesso a registros, objetos e campos. A documentação recomenda declarar o modo de acesso nas operações para facilitar manutenção entre versões de API. Esse cuidado é distinto de configurar uma tela. Consulte [Salesforce — Secure Apex Classes](https://developer.salesforce.com/docs/platform/lwc/guide/apex-security).

Registre o cenário esperado antes de executar o teste. “Não deveria editar o campo financeiro de outra unidade” é verificável; “perfil parece seguro” não informa o que foi examinado. Use usuários e dados de teste representativos, sem copiar informações privadas desnecessárias.

## Revisar acessos como parte da operação

Uma revisão periódica precisa produzir decisões: manter com justificativa, restringir, retirar ou investigar. Apenas pedir que alguém marque uma planilha como revisada favorece confirmação automática. Mostre alterações recentes, privilégios relevantes e atribuições sem responsável.

Também acompanhe solicitações recorrentes de acesso emergencial. Elas podem revelar desenho de função inadequado, documentação insuficiente ou dependência indevida de administradores. O objetivo é corrigir a causa, preservando a capacidade de responder a incidentes.

A entrega mínima é uma matriz de tarefas, um fluxo de concessão e retirada, testes negativos e uma evidência de revisão. Essa estrutura conecta segurança ao [papel operacional do Salesforce](/blog/salesforce-arquitetura-operacional), sem transformar conveniência momentânea em privilégio permanente.
