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
de referência. Reposiciona automaticamente se não couber. A posição efetiva
fica em `data-placement` no Tooltip gerado.

Também são aceitos alinhamentos compostos, como `top-start`, `top-end`,
`bottom-start`, `bottom-end`, `left-start` e `right-end`. A forma manual
equivalente é `{ placement: "top", align: "start" }`. Use `data-offset` ou
`offset` para controlar a distância entre o gatilho e a dica.

```html
<button class="fs-btn" data-fs="tooltip" data-placement="right" title="Mais opções">⋮</button>
```

## Estados

`.is-open` — controlado pelo JS ao mostrar/esconder; não defina
manualmente.

### Delays e touch

Use `data-show-delay` e `data-hide-delay` para evitar abertura acidental:

```html
<button data-fs="tooltip" data-show-delay="300" data-hide-delay="100"
  title="Ajuda complementar">Ajuda</button>
```

O Tooltip também responde a foco e ponteiro. Em touch, toque fora fecha a dica.
Escape fecha sem mover o foco. Tooltips concorrentes são fechados quando uma
nova dica é aberta.

Sem configuração, a abertura é imediata; use `data-show-delay` para evitar
aberturas acidentais em interações com ponteiro. O foco de teclado abre
imediatamente. Elementos `disabled` não
recebem foco nem eventos nativos: envolva-os em um elemento focável quando
precisar explicar seu estado.

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

O componente também expõe tokens locais como `--fs-tooltip-max-width`,
`--fs-tooltip-padding-block`, `--fs-tooltip-padding-inline`,
`--fs-tooltip-radius`, `--fs-tooltip-shadow` e `--fs-tooltip-arrow-size`.
Eles podem ser sobrescritos por instância sem alterar tokens globais.

## Exemplo

```html
<button type="button" class="fs-btn-close" data-fs="tooltip" title="Fechar" aria-label="Fechar"></button>
```

O Tooltip não deve conter links ou botões e não substitui label, texto de erro
ou instrução essencial; nesses casos use conteúdo visível ou Popover.

Quando o gatilho já possui `aria-describedby`, o Tooltip acrescenta somente o
próprio ID e restaura a lista original ao executar `dispose()`.

Mockup: [laboratório independente do componente](../../mockup/examples/tooltip.html).
