**Maturidade: Proposta.** Este artigo descreve um desenho conceitual e critérios de avaliação. Os cenários são fictícios; não declara implantação corporativa nem resultados medidos.

Esta proposta explora uma visão de jornada que conecta interações de diferentes canais a um objetivo do cliente. Uma linha do tempo isolada mostra o que foi registrado; o Customer Journey 360 também precisaria mostrar o que está pendente, qual etapa está em andamento e onde existe uma dependência.

A experiência não pode ser inferida integralmente de cliques e chamados. Eventos são evidências parciais e precisam conviver com percepção, contexto e lacunas conhecidas.

## Escolha um percurso delimitado

O primeiro recorte poderia ser a contratação e ativação de um serviço. O percurso começaria no interesse identificado e terminaria quando o cliente pudesse utilizar a capacidade contratada. Renovação e cancelamento seriam jornadas relacionadas, mas separadas no experimento inicial.

Um cenário fictício incluiria contato comercial, proposta, contrato, envio de documentos, configuração e primeiro uso. O protótipo mostraria tanto avanços quanto retornos, evitando representar a jornada como uma sequência sempre linear.

Cada etapa teria uma condição de entrada e de conclusão. Um e-mail enviado não demonstraria que o cliente recebeu a informação necessária ou que a etapa foi concluída.

## Modele eventos e compromissos separadamente

Eventos registram ocorrências: mensagem recebida, documento aprovado ou tarefa encerrada. Compromissos representam algo que ainda precisa acontecer, com responsável e prazo. Misturar os dois dificulta identificar o próximo passo.

Cada evento precisaria de identificador, origem, momento de ocorrência, momento de recebimento e referência ao objeto relacionado. Esses campos ajudam a lidar com duplicidade e eventos atrasados.

A rastreabilidade de fontes e transformações é um tema central do PROV, padrão do W3C que pode inspirar o desenho de proveniência. [W3C — PROV Overview](https://www.w3.org/TR/prov-overview/) Sua adoção não resolve automaticamente a qualidade dos eventos; ainda seria necessário validar contratos e regras.

## Torne as lacunas visíveis

Se um canal não estiver integrado, a interface deveria informar essa ausência. Um intervalo sem eventos pode significar espera, atividade não capturada ou falha de sincronização. O painel não deve escolher uma interpretação sem evidência.

Em caso de conflito entre sistemas, mostre a divergência e o responsável por resolvê-la. Um status “ativado” em um sistema e “pendente” em outro exige investigação, não apenas uma prioridade arbitrária de exibição.

A visão consolidada também precisa respeitar escopo de acesso. Uma interação pode existir na jornada sem que seu conteúdo completo seja visível para todos os participantes.

## Avalie tarefas de coordenação

O experimento proposto pediria que usuários identificassem o próximo passo, explicassem um atraso e preparassem uma atualização para o cliente. Seriam avaliadas clareza, consistência e capacidade de localizar a evidência utilizada.

Casos de teste incluiriam evento duplicado, etapa reaberta, mudança de responsável e informação recebida fora de ordem. O desenho deve permitir corrigir interpretação sem apagar o histórico relevante.

Uma pesquisa de percepção poderia complementar o teste, mas não substituir a observação de tarefas. Preferência visual não demonstra que a coordenação ficou melhor.

## Defina o que a proposta não demonstra ainda

A simulação não validaria latência real, capacidade de processamento ou qualidade das integrações. Esses pontos dependeriam de uma etapa técnica posterior, com dados autorizados e critérios operacionais.

Para avançar, seria necessário estabelecer contratos de eventos, reconciliação, retenção e responsabilidades por cada etapa. O resultado esperado do laboratório é uma hipótese de produto compreensível e testável, com limites explícitos sobre a informação disponível e sobre as decisões que pretende apoiar.
