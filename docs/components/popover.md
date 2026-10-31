# Popover

Painel flutuante com conteúdo rico (header/body/footer, pode conter
elementos interativos) — mesmo posicionamento do [Tooltip](tooltip.md),
aparência de card de superfície em vez do chip escuro.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#meu-popover">
  Mais informações
</button>
<div class="fs-popover" id="meu-popover">
  <div class="fs-popover-header">Título</div>
  <div class="fs-popover-body">Conteúdo detalhado aqui.</div>
</div>
```

## Anatomia

Gatilho (qualquer elemento) + `.fs-popover` > `.fs-popover-header`
(opcional) + `.fs-popover-body` + `.fs-popover-footer` (opcional). Slots
aditivos incluem `.fs-popover-icon`, `.fs-popover-heading`,
`.fs-popover-title`, `.fs-popover-meta`, `.fs-popover-text` e
`.fs-popover-close`. A seta (`.fs-popover-arrow`) é posicionada junto ao painel.

## Variações

- **Posicionamento**: `data-placement`/`data-align` no gatilho — mesma
  convenção do [Dropdown](dropdown.md).
- **Gatilho**: `data-trigger` no elemento gatilho —
  `click` (padrão), `hover` (com pequeno atraso ao sair, pra dar tempo de
  mover o mouse até o popover), `focus` (mostra ao focar, some ao perder
  foco pra fora do trigger+popover). O runtime também reconhece `manual`,
  mas esse valor não está na união pública `PopoverOptions.trigger`.
- **Hover Card**: `.fs-popover-hover-card` — não é um componente
  separado, é este mesmo Popover com `data-trigger="hover"` e um
  modificador visual (mais largo, corpo em linha) pra conteúdo tipo
  avatar + bio.

```html
<a href="#" data-fs="popover" data-fs-target="#hc-1" data-trigger="hover">@jorgewreis</a>
<div class="fs-popover fs-popover-hover-card" id="hc-1">
  <div class="fs-popover-body">
    <img src="avatar.jpg" alt="" width="40" height="40">
    <div>
      <strong>Jorge Reis</strong>
      <p>Mantenedor do Fokus Styles.</p>
    </div>
  </div>
</div>
```

## Estados

`.is-open` — controlado pelo JS. Escape, clique externo (trigger click) e
`data-fs-dismiss="popover"` fecham conforme o tipo de gatilho. Popover não é
modal: não bloqueia scroll nem cria focus trap.

## A11y

`role="dialog"` + `aria-modal="false"` no popover, `aria-controls`/
`aria-expanded` no gatilho (JS aplica automaticamente). Com
`data-trigger="click"` (padrão): `Escape` fecha e devolve foco ao gatilho;
clique fora fecha. Um elemento dentro do popover com
`data-fs-dismiss="popover"` fecha ao ser clicado (útil pra um botão "OK"
no footer).

Ao abrir outro Popover, o painel anterior é fechado para evitar sobreposição.
O posicionamento testa alternativas quando o lado solicitado não cabe na
viewport, e a seta acompanha o alinhamento do gatilho. Para conteúdo carregado
de forma assíncrona, use `aria-busy="true"` e componha um `.fs-spinner` com
texto de carregamento.

## API JS

Auto-init via `data-fs="popover"`. `Popover.getInstance(el)` (`el` é o
**gatilho**).

| Método | Descrição |
|---|---|
| `show()` | Abre, posiciona, ativa fechamento por clique fora (só no trigger `click`). |
| `hide()` | Fecha. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners e devolve o painel ao pai e posição originais; não o destrói. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:popover:shown` | Não | Depois de abrir. |
| `fs:popover:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (header),
`--fs-color-text`, `--fs-radius-md`, `--fs-shadow-md` e os tokens locais
`--fs-popover-width`, `--fs-popover-max-width`, `--fs-popover-padding-block`,
`--fs-popover-padding-inline`, `--fs-popover-gap`, `--fs-popover-radius`,
`--fs-popover-shadow`, `--fs-popover-icon-size`, `--fs-popover-heading-gap`,
`--fs-popover-footer-gap`, `--fs-popover-arrow-size` e
`--fs-popover-border-width`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#confirmar-envio">
  Enviar
</button>
<div class="fs-popover" id="confirmar-envio">
  <div class="fs-popover-header">Confirmar envio?</div>
  <div class="fs-popover-body">Não será possível editar depois de enviado.</div>
  <div class="fs-popover-footer">
    <button type="button" class="fs-btn fs-btn-sm" data-fs-dismiss="popover">Cancelar</button>
    <button type="button" class="fs-btn fs-btn-primary fs-btn-sm">Confirmar</button>
  </div>
</div>
```

Mockup: [laboratório independente do componente](../../mockup/examples/popover.html).

### Segurança, teclado e modos de gatilho

Popover usa o DOM já existente em `data-fs-target`; não recebe nem sanitiza
strings HTML. Inserir conteúdo não confiável nesse DOM é responsabilidade da
aplicação. `placement`, `align` e `trigger` são as opções lidas; não existe
opção `html`, `content` ou `offset` (a distância interna é 10px nesta versão).

No modo hover os listeners são apenas de mouse: foco de teclado não abre o
painel. Não use conteúdo essencial ou interativo disponível somente por hover;
prefira click/focus e forneça um nome acessível ao diálogo (`.fs-popover-header`
ou `aria-label`). O exemplo de Hover Card é complementar e precisa de uma
alternativa acessível e um destino real em vez de `href="#"` na aplicação.

`data-trigger="manual"` é reconhecido em runtime, mas não é uma opção tipada.
Nesse modo não há listener automático de Escape nem clique fora: a aplicação
precisa controlar abertura, fechamento e foco. O botão `data-fs-dismiss` ainda
é atendido. Não é equivalente ao modo click com abertura programática.
