> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Toast

Notificação flutuante e temporária para confirmar uma ação não bloqueante.
Para mensagens persistentes no contexto da página use [Alert](alert.md); para
histórico e revisão posterior use [Notification Center](notification-center.md).

## Visão geral

```html
<div class="fs-toast-container">
  <div class="fs-toast fs-toast-success" data-fs="toast" data-delay="4000">
    <div class="fs-toast-header">
      <span>Sucesso</span>
      <button type="button" class="fs-btn-close" data-fs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="fs-toast-body">Operação concluída com sucesso.</div>
  </div>
</div>
```

O Toast é inicializado pelo atributo `data-fs="toast"`, mas só aparece quando
`.show()` é chamado. O container é fixo, empilha mensagens e usa propriedades
lógicas para funcionar em RTL e respeitar áreas seguras móveis.

## Anatomia

O trecho a seguir é uma demonstração visual: Desfazer exige handler da aplicação e `/operacoes/detalhes` é uma rota contratual que o produto deve implementar.

`.fs-toast-container` contém um ou mais `.fs-toast`. Dentro dele, os slots
opcionais são `.fs-toast-header`, `.fs-toast-icon`, `.fs-toast-heading`,
`.fs-toast-title`, `.fs-toast-meta`, `.fs-toast-body`, `.fs-toast-actions`,
`.fs-toast-link`, `.fs-toast-close` e `.fs-toast-progress`.

```html
<div class="fs-toast fs-toast-success" data-fs="toast" data-delay="5000" data-toast-progress="true">
  <div class="fs-toast-header">
    <span class="fs-toast-icon" aria-hidden="true">✓</span>
    <div class="fs-toast-heading">
      <strong class="fs-toast-title">Arquivo salvo</strong>
      <span class="fs-toast-meta">Agora</span>
    </div>
    <button type="button" class="fs-btn-close fs-toast-close" data-fs-dismiss="toast" aria-label="Fechar aviso de arquivo salvo"></button>
  </div>
  <div class="fs-toast-body">O documento foi salvo com sucesso.</div>
  <div class="fs-toast-actions">
    <button type="button" class="fs-btn fs-btn-sm fs-btn-success">Desfazer</button>
    <a href="/operacoes/detalhes" class="fs-toast-link">Ver detalhes</a>
  </div>
  <div class="fs-toast-progress" aria-hidden="true"></div>
</div>
```

O ícone é fornecido pelo consumidor e deve ser decorativo quando o texto já
explicar o estado. Ações usam Button; o fechamento continua sendo o único
controle obrigatório da dispensa.

## Variações e estados

Variantes: `.fs-toast-primary`, `.fs-toast-secondary`, `.fs-toast-success`,
`.fs-toast-warning`, `.fs-toast-danger` e `.fs-toast-info`.

- `data-delay="4000"` define o tempo de auto-dismiss em milissegundos;
- `data-autohide="false"` mantém o Toast aberto;
- `data-toast-progress="true"` exibe a barra de tempo quando o auto-dismiss está ativo;
- hover, foco e interação pausam o timer e a barra de progresso;
- `prefers-reduced-motion` elimina a animação contínua do progresso.

## Estados

O Toast começa oculto; a propriedade `isOpen` acompanha a exibição, sem classe
`.is-open` aplicada pelo runtime. Pode ser pausado por hover ou foco. `hide()` e auto-dismiss cancelam o timer e ocultam
o elemento sem transferir foco.

## A11y

O JavaScript aplica `role="status"` e `aria-live="polite"`. O Toast não move
foco automaticamente e não deve usar `aria-live="assertive"` por padrão.
Botões de fechamento precisam de `aria-label` específico; links e ações devem
ter nomes compreensíveis. Ícones decorativos usam `aria-hidden="true"` e não
substituem texto.

Use `data-autohide="false"` para erros que exigem ação. Não use Toast para
decisões críticas, conteúdo extenso ou mensagens que precisam permanecer no
contexto da região afetada.

## API JS

```js
const toast = FokusStyles.Toast.getInstance(document.querySelector(".fs-toast"));
toast.show();
toast.hide();
toast.toggle();
toast.dispose();
```

Eventos preservados: `fs:toast:shown` e `fs:toast:hidden`. O componente pausa
o auto-dismiss durante hover e foco, sem transferir foco para outro Toast.

## Configuração e limites de pausa

Os atributos delay/autohide são capturados na construção; não há objeto de opções
JS. `data-delay` ausente, zero ou não numérico usa 4000 ms por causa do fallback;
valores negativos/não finitos não são validados. Forneça duração finita positiva.
Somente a string exata `data-autohide="false"` desliga o fechamento automático.

Hover e foco são causas independentes de pausa: o timer só retoma quando
ambas terminam. Mover o foco entre descendentes não retoma o auto-dismiss.
O tempo restante e o indicador de progresso consideram apenas o tempo ativo,
sem contar duas vezes o período anterior à pausa nem reiniciar a duração.
`hide()` limpa as causas e uma nova abertura inicia a duração completa.
Para mensagens com ações que não podem expirar, use autohide=false.

`dispose()` cancela timers/transição e remove listeners, mas não equivale a
`hide()` nem remove o elemento da página. A aplicação administra sua remoção.

## Tokens

Container: `--fs-toast-offset`, `--fs-toast-gap`, `--fs-toast-width` e
`--fs-toast-max-width`. Instância: `--fs-toast-padding-block`,
`--fs-toast-padding-inline`, `--fs-toast-gap`, `--fs-toast-radius`,
`--fs-toast-shadow`, `--fs-toast-icon-size`, `--fs-toast-title-gap`,
`--fs-toast-actions-gap`, `--fs-toast-border-width` e
`--fs-toast-progress-height`.

## Mockup

[Laboratório independente do Toast](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-1b32f2dea22e).

## Uma mensagem depois da ação, não a própria ação

Toast é útil para confirmar uma operação que pode ser compreendida sem interromper a pessoa: um documento salvo ou uma preferência atualizada. Não use seu aparecimento como sinal de que o servidor concluiu a tarefa se ainda existe uma requisição pendente. A aplicação deve chamar show quando souber qual resultado comunicar. Erros de formulário que exigem localizar um campo devem permanecer próximos do campo ou em um resumo persistente, não desaparecer após alguns segundos.

O componente mostra e esconde uma instância existente; ele não mantém fila de notificações nem histórico por conta própria. O container empilha elementos visualmente, mas isso não estabelece prioridade, limite de quantidade ou deduplicação. Em uma tela com muitas operações, o aplicativo precisa decidir quais mensagens consolidar e quantas exibir ao mesmo tempo. Use Notification Center quando houver necessidade de revisar registros posteriormente, observando os limites dessa composição.

## Construir conteúdo compreensível

O header pode reunir título, metadados e botão de fechar; o body explica o resultado. Ações e links são opcionais e pertencem ao aplicativo. Um botão Desfazer só deve ser mostrado como ação real depois de receber um handler que efetivamente reverta a operação. Os trechos de anatomia são demonstrações visuais e não implementam desfazer. A rota de detalhes no exemplo é um contrato do produto, não uma página criada pelo componente.

A variante semântica colore o aviso, mas o texto precisa comunicar o mesmo significado. “Arquivo salvo” funciona sem depender do verde; um símbolo isolado não basta. O ícone pode ser decorativo quando repete esse texto. Dê ao fechamento um nome que identifique o aviso, sobretudo quando vários estão empilhados. Essa escolha reduz ambiguidade sem criar várias regiões de anúncio urgente.

## Inicialização não é exibição

Em bundler, carregue `fokus-styles` para CSS e importe `Toast` de `fokus-styles/js` para controle manual. No IIFE servido pelo aplicativo, a classe está em `FokusStyles.Toast`. O construtor recebe o próprio elemento fs-toast, define role status e aria-live polite, registra listeners e o deixa com display none. O atributo data-fs solicita a inicialização, mas não chama show automaticamente.

O exemplo de API pressupõe que getInstance encontrou a montagem declarativa. Se a tela acabou de inserir o elemento, crie a instância manualmente depois de verificar esse registro, em vez de chamar show em undefined. Não há opções de construtor para duração ou autohide: são atributos lidos durante a construção. Mudar data-delay depois não atualiza a duração capturada. Para uma configuração diferente, descarte e remonte conscientemente.

Show e hide usam o helper de transição de altura. A propriedade isOpen muda durante a chamada; os eventos específicos shown e hidden são enviados após a transição concluída, e uma transição cancelada pode não emitir sua notificação final. Existem ainda fs:show, fs:shown, fs:hide e fs:hidden genéricos. Não são eventos canceláveis. Se a aplicação precisa remover o DOM ao ocultar, escute hidden e considere também o caminho de desmontagem direta, que pode cancelar a transição.

## Tempo de leitura e interação

Autohide é uma conveniência para mensagens curtas, não uma regra de acessibilidade aplicável a qualquer conteúdo. Use uma duração finita positiva e autohide false quando a mensagem exige ação. Zero não significa permanecer indefinidamente: o fallback do construtor o transforma em 4000ms. A string false no atributo é a maneira prevista para desligar a expiração; não use valores como 0 ou não esperando o mesmo resultado.

Hover e foco pausam por motivos independentes. Se o ponteiro sair enquanto um botão interno continua focado, o aviso permanece pausado. Quando as duas causas cessam, o contador retoma pelo tempo restante. Isso não equivale a uma promessa de que qualquer clique em qualquer lugar estende a duração: os listeners efetivos são mouseenter, mouseleave, focusin e focusout. Para uma ação importante, não dependa apenas dessas pausas transitórias.

A barra opcional representa o tempo restante do aviso, não o progresso da operação anunciada. Ela só é atualizada quando data-toast-progress é true e autohide está ativo. Mantenha-a decorativa para não confundir com um progressbar de upload. Um novo show depois de hide reinicia a duração; show repetido enquanto já aberto não reinicia o timer. Se precisar renovar uma mensagem, defina um fluxo explícito de fechamento e reabertura.

## Tema, foco e descarte

Os tokens de container controlam largura, distância das bordas e separação entre avisos. Os tokens de instância controlam composição interna. Ajuste largura máxima considerando textos longos e telas pequenas; não use largura para esconder informação necessária. A redução de movimento altera a apresentação, mas não transforma o timer em persistente. Verifique também se o container não cobre controles essenciais ou botões de navegação da aplicação.

Toast não captura foco nem o transfere ao ocultar. Se uma ação interna remover o aviso enquanto ela está focada, o aplicativo deve escolher um destino lógico de foco. Dispose cancela timers e transições e remove listeners, mas não fecha nem remove o elemento como uma operação visual completa. Ao desmontar, remova também o markup sob sua responsabilidade e handlers próprios. Não deixe uma notificação visível sem controlador depois do descarte.

## Exemplo de ciclo de uso

Em uma montagem manual com IIFE já carregado e um elemento existente, use `const aviso = FokusStyles.Toast.getInstance(el) ?? new FokusStyles.Toast(el)` e chame `aviso.show()` somente após obter o resultado que será comunicado. Ao desmontar a região, chame `aviso.dispose()` e remova el se ele foi criado pela aplicação. Essa sequência ilustra o ciclo da interface; não efetua nenhuma operação de rede. Testes em DOM podem verificar estado e timers, mas não comprovam que o anúncio foi ouvido ou que a duração é confortável no contexto real.
