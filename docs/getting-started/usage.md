# Formas de uso

## Convenção de nomenclatura

| Prefixo | Papel | Exemplo |
|---|---|---|
| `.fs-*` | Componente (estrutura/aparência) | `.fs-btn`, `.fs-card`, `.fs-modal` |
| `.fs-u-*` | Utilitário atômico | `.fs-u-d-flex`, `.fs-u-mt-3`, `.fs-u-gx-2` |
| `.is-*` | Estado, controlado por você ou por JS | `.is-active`, `.is-disabled`, `.is-open` |
| `--fs-*` | Token CSS (Custom Property) | `--fs-color-primary`, `--fs-radius-md` |
| `data-fs` | Auto-init de componente interativo | `data-fs="modal"` |
| `data-fs-target`/`data-fs-dismiss` | Alvo/dispensa de componente interativo | `data-fs-target="#meuModal"` |
| `fs:*` | Evento DOM customizado disparado por um componente | `fs:modal:shown` |

Essa separação existe para o framework nunca colidir com classes de outras
bibliotecas/CSS na mesma página — ver
[`docs/reference/scss-architecture.md`](../reference/scss-architecture.md#cascade-layers-layer)
para como isso se reflete em cascade layers.

## Auto-init de componentes interativos

Todo componente que precisa de JavaScript se inicializa sozinho ao carregar
a página, a partir do atributo `data-fs="<nome>"` no elemento raiz — não é
preciso chamar `new FokusStyles.Algo(...)` manualmente:

```html
<button type="button" class="fs-btn" data-fs-target="#meuModal">Abrir</button>

<div class="fs-modal" data-fs="modal" id="meuModal">
  <div class="fs-modal-dialog">
    <div class="fs-modal-content">
      <div class="fs-modal-body">Conteúdo.</div>
    </div>
  </div>
</div>

<script src="dist/js/fokus.js"></script>
```

O auto-init roda em `DOMContentLoaded` (ou imediatamente, se o script for
carregado depois que o DOM já terminou) e é idempotente — chamar de novo não
cria uma segunda instância no mesmo elemento.

## API comum aos componentes interativos

A maioria segue a mesma forma, acessível via `getInstance()`:

```js
const modal = FokusStyles.Modal.getInstance(document.getElementById("meuModal"));
modal.show();
modal.hide();
modal.toggle();
modal.dispose(); // remove listeners e o registro da instância
```

- `getInstance(el)` — retorna a instância já criada para aquele elemento
  (`undefined` se não houver, ou se `data-fs` nunca esteve presente e você
  precisa instanciar manualmente com `new FokusStyles.Nome(el)`).
- `show()`/`hide()`/`toggle()` — nem todo componente tem os três (ex.:
  Tabs usa `show(tabEl)` para trocar a aba ativa; Tag só tem `dismiss()`).
  Ver a página de cada componente em [Componentes](../README.md#componentes)
  para a API exata.
- `dispose()` — remove os listeners e desregistra a instância; o elemento
  em si não é removido do DOM (exceto onde a própria natureza do componente
  implica remoção, como `Tag.dismiss()`).

Uma exceção à regra: **Alert Dialog** não usa `data-fs`/`getInstance()` — é
100% programático, via `FokusStyles.confirm({ title, message, ... })`, que
retorna uma Promise. Ver
[`../components/alert-dialog.md`](../components/alert-dialog.md).

## Eventos

Componentes disparam eventos DOM customizados, no padrão
`fs:<componente>:<ação>` (particípio: `shown`/`hidden`/`changed`...),
sempre com `bubbles: true` — escute no documento ou em qualquer ancestral:

```js
document.addEventListener("fs:modal:shown", (event) => {
  console.log("modal aberto:", event.target);
});
```

Alguns eventos são **canceláveis** (`cancelable: true`) — chamar
`event.preventDefault()` no handler impede a ação (ex.: `fs:tag:dismissed`
cancela a remoção da tag). A documentação de cada componente lista quais
eventos existem e se são canceláveis.

## Import via ES modules

Além do bundle IIFE (`dist/js/fokus.js`, global `FokusStyles`), os módulos
individuais são importáveis via `fokus-styles/js/*`:

```js
import { Modal } from "fokus-styles/js/modal.js";
```

Útil para bundlers que fazem tree-shaking — importar só o que usa em vez do
JS inteiro.

## Próximo passo

[Componentes](../README.md#componentes) — catálogo completo, ou
[Theming](../guides/theming.md) para customizar cores/tipografia/raio sem
fork.
