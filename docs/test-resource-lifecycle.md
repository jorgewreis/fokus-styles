# Recursos temporários de testes: propriedade e encerramento

Aplica-se a testes, homologação e ferramentas temporárias do projeto, inclusive
quando iniciados via Happier, Codex ou outro executor autorizado. Não concede
permissões novas, não altera instruções privadas do dot e não autoriza limpeza
global, produção ou remoção de dados de terceiros.

## Antes de iniciar

- Consulte executor e checkpoint existentes. Não duplique um laboratório ativo.
- Registre na tarefa/manifesto a intenção de criação: run ID, responsável, objetivo,
  recurso esperado, consumidor seguinte e evidência a preservar. Depois registre
  IDs efetivos, labels, caminhos exclusivos, horário de início e resultado.
  Não registre segredos nem copie ambientes/linhas de comando com credenciais.
- Diferencie recurso novo exclusivo, preexistente e compartilhado. Containers,
  redes e volumes novos devem ter identidade por execução e labels de dono.
  Processos Node, servidores de teste, cmd/PowerShell e navegadores precisam de
  PID, horário de criação, comando sanitizado e relação pai/filhos; PID sozinho
  pode ser reutilizado. Prefira grupo de processos ou Job Object exclusivo,
  quando disponível e permitido, sem modificar segurança do sistema.
- Defina fechamento no próprio runner (finally/trap/teardown), não só no prompt.
  Use --rm apenas quando a evidência necessária já estiver fora do container.
  Um artefato ainda consumido por outra etapa não terminou seu uso.

## Ao terminar, falhar ou interromper

1. Preserve resultados, códigos de saída e logs sanitizados fora dos recursos
   descartáveis; registre hashes quando forem necessários para comprovar coleta.
2. Confirme que todos os consumidores terminaram. Encerrar cmd/PowerShell ou ver
   o PID pai sair não comprova que Node, Chrome ou Docker CLI descendentes saíram.
   Em timeout, cancelamento ou término forçado, retenha os recursos se não puder
   comprovar a quiescência da árvore inteira.
3. Encerre graciosamente apenas processos exclusivos registrados e revalidados.
   Não mate por nome global (node/cmd/chrome), porta, prefixo genérico ou idade.
   Revalide criação/identidade antes de sinalizar um PID.
4. Remova somente recursos descartáveis próprios, dentro da autorização:
   containers primeiro, redes exclusivas depois, volumes exclusivos por último,
   após comprovar evidência e ausência de consumidores. Preserve dados reais,
   serviços permanentes, recursos compartilhados, imagens/cache usados por outros
   e alterações do checkout. Não use prune global ou limpeza de todos os parados.
5. Se uma criação/remoção tiver retorno incerto, inspecione IDs e labels antes de
   repetir. Erro de acesso/timeout não significa ausência. Não transforme nome
   parecido em prova de propriedade.
6. Verifique o resultado real: recurso próprio ausente ou processo encerrado;
   serviços protegidos preservados; evidências legíveis. Registre o que foi
   removido e o que permaneceu. Não declare limpeza só porque o comando retornou.

## Retenção e recuperação

Retenção não deve ser silenciosa ou indefinida: registre recurso exato, motivo,
dono, consumidor/dependência, evidência disponível e próxima ação verificável
para liberar ou revisar. Se falta acesso, autorização ou prova de propriedade,
pare somente a remoção afetada, preserve o recurso e informe o bloqueio.

Após falha, primeiro reconcilie o manifesto com o estado real e com a árvore de
processos; não inicie outro executor concorrente nem repita teardown incerto.
Retome a coleta e finalização em uma nova pasta de evidências, sem sobrescrever
tentativas anteriores. Recursos antigos sem prova de exclusividade exigem plano
separado. Remoção irreversível de dados não recuperáveis requer confirmação
específica; este procedimento não substitui essa exigência.

## Handoff e critério de entrega

O coordenador recebe de cada executor o inventário final e assume explicitamente
qualquer recurso que deva continuar ativo. O revisor confere preservação de
evidências, consumidores, comportamento em falhas e proteção de terceiros.
A entrega informa recursos encerrados/removidos e retenções justificadas, com
responsável e próximo passo. Instruções escritas não provam aplicação de uma
correção de código nem recarregam automaticamente sessões já em execução.
