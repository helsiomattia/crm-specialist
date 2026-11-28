Um deploy pode terminar com sucesso e ainda deixar uma automação dependente de configuração ausente. Também pode publicar o componente correto sobre uma alteração manual que ninguém trouxe de volta ao repositório. O processo de entrega precisa controlar mais que o transporte de arquivos.

DevOps, neste contexto, significa aproximar mudança, validação e sustentação. Git, Salesforce CLI, ambientes e testes são instrumentos dessa disciplina, não garantias isoladas de qualidade.

## Definir a fonte de verdade

A documentação do modelo de desenvolvimento da Salesforce relaciona controle de versão, recuperação e implantação de código e metadados com ambientes de desenvolvimento, integração, teste e produção. O desenho concreto deve considerar as capacidades contratadas e a estratégia da equipe. [Salesforce — Org Development Model](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-build-mdapi.html).

Estabeleça onde uma mudança começa e como chega ao repositório. Se alterações emergenciais forem feitas diretamente em uma organização, defina a reconciliação posterior. Uma diferença conhecida precisa de responsável e prazo; não deve se tornar um segundo produto informal.

Uma revisão de código deve apresentar intenção e comportamento esperado. Um conjunto de arquivos sem contexto dificulta avaliar dependências, permissões e riscos de migração.

## Organizar ambientes pela pergunta de validação

Um ambiente de desenvolvimento permite construir e testar um recorte. Um ambiente de integração verifica convivência entre mudanças. A homologação aproxima a avaliação do comportamento esperado pelo negócio. Nenhum nome de ambiente garante que ele contenha dados, configurações ou permissões representativos.

Considere uma mudança fictícia em aprovação comercial. O teste precisa de oportunidades com estados distintos, pessoas com acessos diferentes e caminhos de integração controlados. Copiar dados privados sem necessidade não melhora automaticamente a qualidade da validação.

Registre diferenças relevantes entre ambientes. Se uma dependência externa é simulada, identifique o que foi validado pelo mock e o que ainda precisa de uma prova de integração autorizada.

## Tratar metadados e dados como mudanças distintas

Implantar um componente não cria necessariamente todos os registros de configuração ou dados exigidos pelo processo. Identifique pré-requisitos, sequência e ações posteriores.

Uma mudança de campo pode exigir atualização de consumidores, migração de valores e treinamento. Uma remoção pode afetar relatórios ou integrações que não aparecem na primeira comparação. Examine dependências antes de escolher a ordem da entrega.

Use a Salesforce CLI compatível com o projeto e confira os comandos na versão instalada. Este roteiro não fixa comandos universais nem presume equivalência entre diferentes modelos de desenvolvimento.

## Projetar testes que revelem defeitos

Priorize comportamentos: alteração permitida, acesso negado, processamento em lote, falha externa e efeito de repetição. A aprovação técnica deve considerar o conjunto de mudanças, não apenas a classe recém-editada.

Inclua uma verificação após o deploy com operações proporcionais ao risco. Confirme que a função principal está disponível, que permissões estão corretas e que sinais operacionais aparecem. Evite transformar essa verificação em uma ação irreversível sobre dados reais.

Guarde evidência de qual versão foi validada e de quais testes foram executados. Um resultado antigo não certifica uma mudança posterior, mesmo quando o nome da branch continua igual.

## Planejar recuperação antes de precisar dela

Voltar código ou metadados não desfaz automaticamente dados modificados. Defina estratégias distintas para configuração, dados e integrações. Em alguns casos, corrigir adiante é mais seguro que tentar uma reversão incompleta.

O suporte precisa localizar versão, horário da mudança, sintomas, logs e responsáveis. Registre identificadores de correlação sem expor segredos. Um erro sem contexto pode consumir mais tempo de diagnóstico que a implementação original.

Quando ocorrer incidente relevante, investigue condições contribuintes e ações verificáveis. A abordagem de postmortems do Google SRE oferece uma referência para aprender com falhas sem reduzir a análise à culpabilização individual. [Google SRE — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/).

A entrega termina quando a operação consegue reconhecer e tratar seus desvios. Mantenha a [documentação utilizável](/blog/documentar-processos) junto das mudanças e preserve o raciocínio da [escolha técnica](/blog/flow-apex-lwc). Um pipeline confiável torna a mudança explicável, testável e recuperável; velocidade passa a ser consequência de um processo conhecido.
