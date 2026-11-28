Uma ferramenta de IA pode sugerir código rapidamente, mas a velocidade de geração não demonstra adequação ao sistema. O ganho depende de quanto trabalho correto ela ajuda a concluir, incluindo entendimento, revisão, testes e sustentação.

## Escolha tarefas com resultado verificável

Boas tarefas iniciais têm escopo claro: explicar um fluxo existente, propor casos de teste, localizar uma dependência ou implementar uma alteração pequena com critérios de aceitação. Pedidos amplos como “melhorar toda a arquitetura” dificultam avaliar o resultado.

Forneça contexto suficiente sobre padrões do repositório, versões, restrições e comportamento esperado. Evite enviar segredos ou dados de clientes quando não forem necessários e autorizados.

A documentação do GitHub sobre recursos de IA para segurança e qualidade descreve capacidades e limitações que exigem uso responsável. A saída deve ser tratada como material a verificar. [GitHub — Responsible use of security and quality AI features](https://docs.github.com/en/code-security/responsible-use/security-and-quality-ai-features)

## Use diagnóstico como hipótese

Ao analisar um erro, peça que a ferramenta diferencie observação e hipótese. Uma mensagem de falha pode apontar para permissão, contrato de dados, versão ou estado do ambiente; o texto gerado não deve escolher uma causa sem evidência.

Em um cenário fictício, uma integração falha apenas para determinado perfil. Antes de alterar a lógica, compare permissões, dados de entrada e execução em contextos equivalentes. Uma correção que amplia acesso pode esconder o sintoma e criar outro problema.

Registre o que confirmou ou descartou cada hipótese. Isso torna o diagnóstico reutilizável e evita repetir tentativas sem aprendizado.

## Revise código pelas consequências

Confira contratos, tratamento de erros, acesso, desempenho e compatibilidade. Em Apex, por exemplo, uma sugestão precisa considerar processamento em lote e limites da plataforma. Em LWC, precisa respeitar o modelo de dados e as responsabilidades entre cliente e servidor.

Não aceite uma biblioteca ou API apenas porque o exemplo parece plausível. Verifique se existe na versão utilizada e se o repositório permite sua adoção.

A revisão também deve procurar alterações fora do escopo. Uma ferramenta pode modificar formatação, dependências ou comportamento adjacente para facilitar a solução; essas mudanças precisam de justificativa.

## Valide metadados e implantação no ambiente correto

No Salesforce, metadados e código dependem de configurações e recursos do ambiente. O modelo de desenvolvimento documentado pela Salesforce ajuda a organizar recuperação, versionamento e implantação. [Salesforce — Org Development Model](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-build-mdapi.html)

Uma análise estática pode identificar problemas, mas não substitui validação no destino apropriado. Verifique dependências, permissões, recursos disponíveis e testes exigidos antes da publicação.

Mantenha diferenças revisáveis no controle de versão. Alterações pequenas facilitam entender o que foi gerado e recuperar o estado anterior quando necessário.

## Faça testes que possam encontrar erros reais

Derive cenários do comportamento esperado, incluindo falhas e limites relevantes. Um teste que repete a mesma suposição do código pode confirmar uma implementação incorreta.

Quando a IA gerar testes, revise os dados, asserções e condições de execução. Verifique se o teste falharia diante do defeito que pretende prevenir. Cobertura numérica não demonstra, sozinha, qualidade de verificação.

Após a entrega, acompanhe sinais operacionais e documentação. O código aceito passa a ser responsabilidade da equipe, independentemente de quem ou do que produziu a primeira versão.

A IA ajuda quando reduz esforço sem transferir incerteza para produção. O critério de sucesso é uma mudança compreendida, validada e sustentável dentro do contexto real do projeto.
