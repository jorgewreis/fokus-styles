> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Modal

Diálogo sobreposto à página inteira, com focus trap, `Escape` e clique
fora pra fechar. Base do [Alert Dialog](alert-dialog.md).

## Visão geral

```html
<button type="button" class="fs-btn fs-btn-primary" data-fs="modal" data-fs-target="#meuModal">
  Abrir modal
</button>

<div class="fs-modal" id="meuModal">
  <div class="fs-modal-dialog">
    <div class="fs-modal-content">
      <div class="fs-modal-header">
        <h3 class="fs-modal-title">Título</h3>
        <button type="button" class="fs-btn-close" data-fs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="fs-modal-body">Conteúdo do modal.</div>
      <div class="fs-modal-footer">
        <button type="button" class="fs-btn" data-fs-dismiss="modal">Cancelar</button>
        <button type="button" class="fs-btn fs-btn-primary">Confirmar</button>
      </div>
    </div>
  </div>
</div>
```

`data-fs` vai no **gatilho** (o botão que abre), não no `.fs-modal` — ao
contrário da maioria dos outros componentes.

## Anatomia

Gatilho (`data-fs="modal"` + `data-fs-target`) + `.fs-modal` (overlay de
tela cheia, centraliza o conteúdo) > `.fs-modal-dialog` (limita a largura)
> `.fs-modal-content` (card visual) > `.fs-modal-header` (título +
`.fs-btn-close`, opcional) + `.fs-modal-body` (rola internamente se o
conteúdo for maior que a viewport) + `.fs-modal-footer` (ações, opcional).

## Variações

Tamanho do diálogo: `.fs-modal-sm` (320px), `.fs-modal-lg` (720px) em
`.fs-modal-dialog`; sem sufixo = 480px (padrão).

```html
<div class="fs-modal-dialog fs-modal-lg">...</div>
```

## Estados

`.is-open` no `.fs-modal` — controlado pelo JS.

**Backdrop estático** (`data-backdrop="static"` no `.fs-modal`): desativa
fechamento por `Escape` e clique fora; `data-fs-dismiss="modal"`, `hide()` e
`dispose()` ainda fecham. Use para fluxos que exigem uma decisão explícita.

```html
<div class="fs-modal" id="modalCritico" data-backdrop="static">...</div>
```

## A11y

Use `.fs-modal-sm`, `.fs-modal-lg`, `.fs-modal-xl`, `.fs-modal-fullscreen` e
`.fs-modal-scrollable` conforme o fluxo. Em telas menores o diálogo respeita safe areas.

Ao inicializar, o componente controla `aria-hidden` e, quando encontra
`.fs-modal-title`, cria automaticamente o vínculo `aria-labelledby`. Um
`id` existente no título é preservado.

`role="dialog"` + `aria-modal="true"` aplicados automaticamente. Ao abrir:
foco preso dentro do `.fs-modal-dialog` (`Tab`/`Shift+Tab` ciclam só entre
os elementos focáveis internos), primeiro elemento focável recebe foco,
scroll da página é bloqueado. Ao fechar: foco volta pro gatilho que abriu.

## API JS

Auto-init via `data-fs="modal"` **no gatilho**. `Modal.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre, trava o scroll, ativa o focus trap. |
| `hide()` | Fecha, libera o scroll, devolve o foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:modal:shown` | Não | Depois de abrir. |
| `fs:modal:hidden` | Não | Depois de fechar (inclusive via Escape/clique fora). |

## Tokens

`--fs-color-surface`, `--fs-color-text`, `--fs-color-border`,
`--fs-radius-md`, `--fs-shadow-lg`.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-danger" data-fs="modal" data-fs-target="#confirmarExclusao">
  Excluir
</button>
<div class="fs-modal" id="confirmarExclusao">
  <div class="fs-modal-dialog fs-modal-sm">
    <div class="fs-modal-content">
      <div class="fs-modal-body">
        <h3 class="fs-modal-title">Excluir item?</h3>
        <p>Essa ação não pode ser desfeita.</p>
      </div>
      <div class="fs-modal-footer">
        <button type="button" class="fs-btn" data-fs-dismiss="modal">Cancelar</button>
        <button type="button" class="fs-btn fs-btn-danger">Excluir</button>
      </div>
    </div>
  </div>
</div>
```

Para o mesmo padrão sem escrever HTML, ver [Alert Dialog](alert-dialog.md)
(`FokusStyles.confirm()`). Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-31ff26d4ef12).

## Popups dentro do diálogo

Dropdown, NestedMenu, Combobox, Datepicker, Popover e Tooltip mantêm seus
painéis dentro do diálogo proprietário, em vez de movê-los para a página
inativa atrás do modal. Isso também se aplica a Offcanvas e CommandPalette.
O tema do ancestral mais próximo (`data-fs-theme` ou `data-theme`) acompanha
o painel. `Escape` fecha primeiro o popup ativo; outro `Escape` fecha o modal.
Fechar o diálogo programaticamente também fecha seus popups internos.
O `dispose()` do Modal fecha popups ativos, mas não descarta seus controladores.
Para restaurar painéis ao pai original ou remover tooltips gerados, a aplicação
deve chamar `dispose()` em **cada popup**. Descarte esses filhos antes de remover
o DOM do diálogo; fechar o Modal não remove os registros e listeners dos filhos.

### Limites das opções desta versão

O construtor lê somente `backdrop`, e apenas o valor `"static"` altera a
política de fechamento. `{ backdrop: false }` é aceito pelos tipos, mas não
remove o fundo nem desativa Escape/clique fora; `data-backdrop="false"` também
não torna o Modal não modal. Não há opção `keyboard`, `focus` ou `html` lida
pelo construtor. Conteúdo é DOM fornecido pela aplicação, não uma string
sanitizada pelo Modal.

## Escolher um diálogo e delimitar sua responsabilidade

Modal interrompe o contexto principal para concentrar uma tarefa em uma superfície temporária. É adequado para consultar um detalhe ou editar poucos campos sem abandonar a página. Uma jornada longa, com navegação própria e necessidade de compartilhar endereço, costuma ficar mais compreensível em uma página. Para uma pergunta binária criada inteiramente por código, Alert Dialog evita manter uma árvore de diálogo permanente. Modal, por sua vez, preserva o DOM da aplicação entre aberturas: fechar não limpa campos, desfaz alterações nem cancela operações pendentes.

O overlay ocupa a tela inteira, mas quem delimita a região interativa é `.fs-modal-dialog`. Não remova esse elemento apenas porque o fundo e o conteúdo parecem funcionar sem ele: o runtime usa essa referência para foco, registro da camada e identificação de clique externo. Header e footer são opcionais; o título não deveria ser omitido sem fornecer outro nome acessível. O corpo pode conter formulários nativos, mensagens e componentes, mas a biblioteca não implementa validação ou submissão desses formulários.

## Montagem, eventos e integração com a aplicação

Em um bundler, importe o CSS com `import 'fokus-styles'` e o JavaScript com `import 'fokus-styles/js'`. Na distribuição IIFE, carregue `dist/css/fokus.css` e `dist/js/fokus.js` por URLs servidas pelo aplicativo; o objeto global usado nos exemplos é `FokusStyles`. Não carregue simultaneamente o bundle e outra cópia dos módulos para controlar o mesmo DOM. O código de integração deve executar depois que o gatilho e o destino existirem.

O registro pertence ao gatilho, não ao painel. `new FokusStyles.Modal(trigger, options)` procura imediatamente o seletor de `data-fs-target` e lança erro se não encontra o destino. Use um seletor válido e um ID exclusivo. Para reutilizar uma montagem existente, `getOrCreateInstance(trigger, options)` evita criar outra instância; opções novas não reconfiguram uma instância já registrada. As conveniências estáticas `show`, `hide` e `toggle` também recebem o gatilho. Prefira um proprietário explícito para cada diálogo em vez de construir controladores concorrentes sobre o mesmo painel.

Além dos eventos específicos da tabela, o gatilho emite `fs:show`, `fs:shown`, `fs:hide` e `fs:hidden`, com propagação. São notificações não canceláveis: `preventDefault()` não bloqueia uma abertura ou um fechamento. `shown` significa que a operação do componente ocorreu, não que uma requisição terminou ou que uma animação de terceiros terminou. Repetir `show()` enquanto aberto ou `hide()` enquanto fechado não reinicia o ciclo.

Uma ação Confirmar nos exemplos de estrutura é apenas um botão demonstrativo até receber lógica da aplicação. Para salvar, conecte um handler ao formulário, valide os dados, execute a operação e decida quando chamar `hide()`. Se houver erro, mantenha a mensagem visível e acessível no diálogo. Não use `data-fs-dismiss` em um botão cuja operação ainda pode falhar, pois o dismiss não aguarda Promises nem conhece o resultado do servidor.

## Foco, dimensões e descarte

A abertura configura a camada e o isolamento de foco; o fechamento restaura o foco ao gatilho somente quando essa camada era a superior e o gatilho continua conectado e fora de uma região inerte. Se a aplicação remover o acionador durante a tarefa, ela precisa definir um destino lógico de foco. O comportamento de diálogos empilhados não deve ser reduzido a uma regra de fechar todos com Escape: somente a camada elegível no topo reage.

Os tamanhos pequeno e grande não são as únicas opções: `.fs-modal-xl` limita a largura a 1140px; `.fs-modal-fullscreen` remove o limite e usa altura de 100%; `.fs-modal-scrollable` contém overflow no card e mantém o corpo rolável. Abaixo de 640px, o SCSS alinha o diálogo à base, elimina padding externo e amplia as larguras limitadas. Portanto, 320px ou 720px descrevem limites no layout maior, não uma largura rígida em qualquer dispositivo. Verifique conteúdo longo, teclado virtual e zoom em navegador.

Os tokens de superfície e texto controlam o card; `--fs-z-modal` posiciona a camada, `--fs-space-4` participa do espaço externo e da altura máxima, e `--fs-safe-area-top` participa do limite mobile. A borda do card usa `--fs-color-border-default` e `--fs-border-width`; separadores usam `--fs-color-border`. O escurecimento do fundo é uma cor definida no SCSS, não uma opção booleana capaz de transformar o diálogo em painel não modal.

Antes de remover a página ou substituir seus nós, chame `dispose()` na instância e remova os listeners próprios do aplicativo. Dispose fecha, desfaz listeners internos e apaga o registro, mas não apaga o HTML fornecido nem restaura todos os atributos ao estado anterior à construção. Uma remontagem deve reaproveitar ou reconstruir esse HTML conscientemente. Os testes DOM cobrem contratos de estado; a adequação do foco, do nome anunciado e da rolagem precisa ser verificada também com tecnologias assistivas e navegador reais.
