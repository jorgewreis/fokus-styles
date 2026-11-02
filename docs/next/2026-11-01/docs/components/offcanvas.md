> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Offcanvas

Painel deslizante de qualquer borda da tela (menu lateral mobile, carrinho,
filtros) — mesmo focus trap/`Escape`/clique-fora do [Modal](modal.md), mas
não cobre a tela inteira.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="offcanvas" data-fs-target="#meuPainel">
  Abrir menu
</button>

<div class="fs-offcanvas fs-offcanvas-start" id="meuPainel">
  <div class="fs-offcanvas-header">
    <h3 class="fs-offcanvas-title">Menu</h3>
    <button type="button" class="fs-btn-close" data-fs-dismiss="offcanvas" aria-label="Fechar"></button>
  </div>
  <div class="fs-offcanvas-body">Conteúdo do painel.</div>
</div>
```

`data-fs` vai no gatilho, como no Modal.

## Anatomia

Gatilho + `.fs-offcanvas` (painel, `position: fixed`, fora da viewport até
abrir) > `.fs-offcanvas-header` (título + `.fs-btn-close`, opcional) +
`.fs-offcanvas-body` (rola internamente) + `.fs-offcanvas-footer`
(opcional). Um `.fs-offcanvas-backdrop` é criado/removido dinamicamente
pelo JS a cada abertura (não escreva no HTML).

## Variações

Borda de entrada — obrigatório escolher uma:

- `.fs-offcanvas-start` — esquerda, 320px de largura.
- `.fs-offcanvas-end` — direita, 320px de largura.
- `.fs-offcanvas-top` — topo, 40vh de altura.
- `.fs-offcanvas-bottom` — base, 40vh de altura.

## Estados

`.is-open` — controlado pelo JS, anima via `transform`/`transition`
(desativada automaticamente sob `prefers-reduced-motion: reduce`).

**Backdrop**: `data-backdrop="false"` no `.fs-offcanvas` remove o
backdrop visual; o painel permanece modal, com foco preso, isolamento do
conteúdo externo e scroll bloqueado. `data-backdrop="static"` mantém o backdrop mas desativa
`Escape`/clique-fora (dismiss e chamadas `hide()`/`dispose()` ainda fecham) — mesma
semântica do Modal.

## A11y

Ao inicializar, o componente controla `aria-hidden` e, quando encontra
`.fs-offcanvas-title`, cria automaticamente o vínculo `aria-labelledby`. Um
`id` existente no título é preservado.

`role="dialog"` + `aria-modal="true"` aplicados automaticamente. Foco
preso dentro do painel enquanto aberto, movido pro primeiro elemento
focável (com um pequeno atraso técnico pra garantir que a transição de
`visibility` já rodou — o painel usa `visibility: hidden` em vez de
`display: none` pra poder animar). Ao fechar, foco volta pro gatilho.

## API JS

Auto-init via `data-fs="offcanvas"` **no gatilho**. `Offcanvas.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre, cria o backdrop (se aplicável), trava scroll, ativa focus trap. |
| `hide()` | Fecha, remove o backdrop, libera scroll, devolve foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:offcanvas:shown` | Não | Depois de abrir. |
| `fs:offcanvas:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-surface`, `--fs-color-text`, `--fs-color-border`,
`--fs-shadow-lg`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="offcanvas" data-fs-target="#filtros">Filtros</button>
<div class="fs-offcanvas fs-offcanvas-end" id="filtros" data-backdrop="static">
  <div class="fs-offcanvas-header">
    <h3 class="fs-offcanvas-title">Filtros</h3>
    <button type="button" class="fs-btn-close" data-fs-dismiss="offcanvas" aria-label="Fechar"></button>
  </div>
  <div class="fs-offcanvas-body">...</div>
  <div class="fs-offcanvas-footer">
    <button type="button" class="fs-btn fs-btn-primary" data-fs-dismiss="offcanvas">Aplicar</button>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-cc9f00486afa).

### Opção backdrop: limite da versão atual

Use o atributo `data-backdrop="false"` no painel para omitir o backdrop visual.
Embora os tipos aceitem `{ backdrop: false }`, o runtime compara com a string
`"false"`: o booleano false **não** desativa o backdrop nesta versão e tem
precedência sobre o atributo. `"static"` é a opção que bloqueia Escape/clique
fora; não há opção `keyboard` separada. Isto documenta o comportamento atual,
não amplia o contrato de tipos nem corrige o runtime.

## Escolha do painel e contexto da tarefa

Offcanvas mantém visualmente a relação com a página enquanto traz uma tarefa para uma borda: filtros, resumo de carrinho e navegação compacta são exemplos comuns. Apesar de ocupar somente parte da tela, o controlador é modal. O restante da interface não deve continuar sendo operado enquanto o painel está aberto. Para uma coluna permanentemente disponível no desktop, não confunda aparência de sidebar com o ciclo de foco e isolamento deste controlador.

Escolha a borda de acordo com a organização do produto, não para representar estados de sucesso ou erro. Start e end são classes que, nesta implementação, usam posições físicas esquerda e direita; não presuma inversão automática por direção de escrita. Top e bottom usam altura de 40vh, enquanto as laterais usam 320px. Conteúdo que excede a área disponível deve permanecer no corpo rolável, evitando deslocar o botão de fechamento para uma posição impossível de alcançar.

## Estrutura que permanece e estrutura temporária

O aplicativo fornece painel, título, corpo e controles; o controlador cria apenas o backdrop quando necessário. Não escreva um segundo backdrop no HTML, pois ele não será necessariamente gerenciado pela instância. O header e o footer separam informações e ações, mas não são exigências de um formulário. Coloque o formulário e seus nomes de campos segundo a semântica HTML, e não atribua submissão a um botão apenas por ele estar no footer.

O botão Aplicar do exemplo usa dismiss para demonstrar fechamento. Ele não lê filtros nem consulta resultados. Para implementar filtros de verdade, mantenha um estado editável no formulário e conecte a ação à consulta da aplicação; feche somente no momento adequado ao fluxo. Cancelar também não restaura valores automaticamente: fechar deixa os nós e seus valores no DOM. Se aplicar e cancelar têm consequências diferentes, a aplicação precisa preservar um rascunho ou restabelecer os valores anteriores.

## Construção e atualização

O CSS pode ser importado por `import 'fokus-styles'` em um bundler e o JavaScript por `import 'fokus-styles/js'`. Os exemplos com `FokusStyles` pressupõem o bundle IIFE servido pelo projeto. Instancie somente após inserir o gatilho e o destino. `new FokusStyles.Offcanvas(trigger, options)` procura o destino imediatamente e lança erro quando ele não existe. Use ID exclusivo e seletor válido; o registro é associado ao gatilho.

`getOrCreateInstance(trigger, options)` reaproveita uma instância existente sem reaplicar opções. As funções estáticas `show(trigger, options)`, `hide(trigger)` e `toggle(trigger, options)` são conveniências sobre esse registro. Não crie duas instâncias manualmente para o mesmo gatilho. O auto-init também reconhece `data-fs-toggle="offcanvas"`, sempre no acionador, com `data-fs-target` apontando ao painel.

Os eventos específicos são emitidos no gatilho com propagação. Existem ainda as notificações genéricas `fs:show`, `fs:shown`, `fs:hide` e `fs:hidden`; elas não são canceláveis. Shown ocorre durante a operação de abertura, antes de ser possível tratar a transição visual como concluída. O foco inicial é ativado após dois requestAnimationFrame, por causa de visibility e do processamento da renderização. Não use o evento como promessa de que o primeiro controle já recebeu foco naquele mesmo instante.

## Responsividade não substitui gerenciamento de estado

`.fs-offcanvas-responsive` define largura limitada por `min(100%, 420px)`, útil para evitar uma lateral maior que a viewport. `.fs-offcanvas-lg` altera posição, dimensões, visibilidade e sombra a partir de 1024px. Essas regras são CSS; o JavaScript não observa o breakpoint para desligar automaticamente aria-hidden, o isolamento ou o bloqueio de scroll. Portanto, uma composição que vira navegação permanente no desktop exige gerenciamento explícito da aplicação, além da classe visual.

O seletor de backdrop oculto no layout grande depende de um backdrop irmão adjacente; o controlador anexa seu backdrop ao body. Não trate esse seletor como garantia universal de que a transição entre tamanhos manterá toda a experiência sincronizada. Se precisar desse padrão, teste abertura no mobile, redimensionamento, retorno ao mobile e navegação por teclado, ou prefira estruturas separadas com ciclo de vida claramente controlado.

O token `--fs-z-offcanvas` define a camada do painel, e o backdrop fica um nível abaixo. Superfície, texto, separadores e sombra usam os tokens listados. Largura, duração de transição e dimensões internas aparecem como valores no SCSS, não como opções do construtor. Alterar cores não modifica a política de foco; remover o backdrop visual também não torna a tela de fundo interativa.

## Fechar e desmontar sem deixar uma camada ativa

Antes de remover painel ou gatilho, chame `dispose()`. O método fecha se necessário, remove o backdrop gerado, desfaz listeners e elimina o registro. Listeners do aplicativo e operações de filtro continuam sob responsabilidade da tela. O descarte não remove o painel nem seus atributos acrescentados durante a construção. Uma nova montagem não deve depender de que todo o HTML tenha sido restaurado ao estado inicial.

Ao fechar a camada superior, o foco volta ao gatilho apenas se ele ainda estiver conectado e não estiver dentro de uma região inerte. Se o painel iniciar uma navegação que substitui esse gatilho, escolha outro ponto lógico de foco. Testes automatizados de DOM verificam classe, ARIA e registro; transições, rolagem, uso com teclado virtual e percepção por leitor de tela exigem validação em navegador, especialmente na composição responsiva.
