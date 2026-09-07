# Tooltip

Rótulo curto que aparece ao passar o mouse ou focar um elemento —
substitui o `title` nativo do navegador (lento, sem estilo, inacessível a
teclado em alguns navegadores).

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="tooltip" title="Copiar para a área de transferência">
  Copiar
</button>
```

O texto vem do atributo `title` (ou `data-title`) — o JS o remove do DOM
na inicialização (pra não duplicar com o tooltip nativo do navegador) e o
recria como conteúdo do tooltip.

## Anatomia

Gerado inteiramente pelo JS: `.fs-tooltip` (`role="tooltip"`) >
`.fs-tooltip-arrow` + `.fs-tooltip-inner` (texto). Não escreva essa
marcação manualmente — só o elemento de referência com `title`/`data-fs="tooltip"`.

## Variações

`data-placement` (`top` — padrão, `bottom`, `left`, `right`) no elemento
de referência. Reposiciona automaticamente se não couber.

```html
<button class="fs-btn" data-fs="tooltip" data-placement="right" title="Mais opções">⋮</button>
```

## Estados

`.is-open` — controlado pelo JS ao mostrar/esconder; não defina
manualmente.

## A11y

O JS aplica `aria-describedby` no elemento de referência, apontando pro
`id` do tooltip — leitor de tela anuncia o conteúdo ao focar o elemento.
Mostra em `mouseenter`/`focus`, esconde em `mouseleave`/`blur`/`Escape` —
funciona por mouse e por teclado igualmente (ao contrário do `title`
nativo, que só mostra no hover).

## API JS

Auto-init via `data-fs="tooltip"` **ou** instanciação manual
(`new FokusStyles.Tooltip(el, { title, placement })` — útil quando o texto vem
de outro lugar, não de um atributo estático; é assim que
[Breadcrumb](breadcrumb.md) anexa tooltips a labels truncados).
`Tooltip.getInstance(el)`.

| Método | Descrição |
|---|---|
| `show()` | Mostra o tooltip, posicionado relativo à referência. |
| `hide()` | Esconde. |
| `toggle()` | Alterna. |
| `dispose()` | Remove listeners, `aria-describedby` e o elemento do tooltip do DOM; desregistra a instância. |

| Evento (no elemento de referência) | Cancelável | Quando |
|---|---|---|
| `fs:tooltip:shown` | Não | Depois de mostrar. |
| `fs:tooltip:hidden` | Não | Depois de esconder. |

## Tokens

`--fs-tooltip-bg`, `--fs-tooltip-text`, `--fs-radius-sm`.

## Exemplo

```html
<button type="button" class="fs-btn-close" data-fs="tooltip" title="Fechar" aria-label="Fechar"></button>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#tooltip).
