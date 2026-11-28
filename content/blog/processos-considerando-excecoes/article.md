O fluxo principal descreve o que fazer quando tudo chega no formato e no momento esperados. A operação real também recebe documentos incompletos, integrações indisponíveis, pedidos duplicados e decisões conflitantes. Se essas situações não têm tratamento, cada pessoa inventa uma solução e a qualidade passa a depender da memória individual.

## Construa um catálogo de exceções

Comece pelos incidentes e dúvidas recorrentes. Para cada situação, registre gatilho, impacto, frequência, responsável e resposta atual. Diferencie erro de entrada, indisponibilidade técnica, regra ambígua e situação legítima fora do padrão.

Essa separação orienta a solução. Uma validação pode evitar um campo obrigatório vazio; não resolve uma política comercial contraditória. Um procedimento de contingência ajuda durante indisponibilidade; não substitui a correção de uma falha frequente.

Priorize pelo efeito e pela recorrência, considerando também casos raros de alto impacto. O catálogo deve ser curto o suficiente para orientar trabalho e completo o suficiente para cobrir os riscos relevantes.

## Desenhe controles na etapa adequada

Um controle preventivo busca impedir a ocorrência; um controle de detecção identifica o problema; um controle de recuperação orienta a retomada. Use combinações proporcionais ao risco.

Em um cenário fictício de importação de clientes, a validação de identificadores atua antes da carga, a reconciliação compara o resultado e o procedimento de correção trata divergências. Conferir apenas a mensagem de sucesso da ferramenta não demonstra que todos os registros esperados foram processados.

Documente quem pode liberar uma exceção, quais justificativas são aceitas e quando a decisão deve ser revista. Uma aprovação permanente para contornar uma regra pode indicar que a própria regra precisa mudar.

## Escreva runbooks executáveis por pessoas

Um runbook deve informar quando usar o procedimento, quais acessos são necessários, como diagnosticar, quais passos são seguros e quando interromper. Inclua resultados esperados e condições de escalonamento.

Evite instruções como “corrigir a integração” ou “limpar os registros”. Descreva a verificação necessária e os limites de atuação. Para ações que alteram dados, exija identificação do conjunto afetado, avaliação de impacto e estratégia de recuperação compatível com o ambiente.

Teste o documento com alguém que não participou de sua elaboração. Se essa pessoa precisa adivinhar o significado de um passo, o procedimento ainda depende de conhecimento implícito.

## Produza evidências úteis para auditoria

Registre evento, horário, responsável, decisão e referência ao objeto afetado. A proveniência de dados ajuda a entender de onde uma informação veio e quais transformações sofreu, tema tratado pelo modelo PROV do W3C. [W3C — PROV Overview](https://www.w3.org/TR/prov-overview/)

Rastreabilidade não exige armazenar conteúdo sensível indiscriminadamente. Defina acesso, retenção e necessidade de cada evidência. Um log que expõe credenciais ou dados pessoais pode criar um problema maior que a falta de registro.

## Feche o ciclo de aprendizado

Após um incidente, investigue condições que permitiram a falha e avalie a eficácia dos controles. A prática de postmortems apresentada pelo Google SRE incentiva aprendizado sem culpabilização. [Google SRE — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)

Transforme conclusões em ações pequenas, com dono e prazo. Atualize o runbook quando o procedimento mudar e retire versões obsoletas dos pontos de uso. Acompanhe recorrência e tempo de recuperação para verificar se as ações ajudaram.

Um processo robusto não promete eliminar qualquer exceção. Ele permite reconhecer situações fora do padrão, agir dentro de limites claros e aprender com os resultados sem depender de improvisação silenciosa.
