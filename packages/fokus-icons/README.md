# Módulo interno de ícones do Fokus Styles

[Site e guias do Fokus Styles](https://styles.fokuscloud.com.br/) ·
[Fokus Cloud](https://www.fokuscloud.com.br/) ·
[GitHub](https://github.com/jorgewreis/fokus-styles) ·
[npm](https://www.npmjs.com/package/fokus-styles)

Fonte interna dos ícones SVG opcionais do [Fokus Styles](https://github.com/jorgewreis/fokus-styles) —
1994 ícones do conjunto [Lucide](https://lucide.dev) (licença ISC),
gerados em dois formatos, sem nenhuma dependência em runtime.

Instalação e uso completo: [`docs/guides/icons.md`](https://github.com/jorgewreis/fokus-styles/blob/main/docs/guides/icons.md)
no repositório principal.

## Instalação

```bash
npm install fokus-styles
```

## Uso — SVG puro (zero JS)

```html
<div class="fs-icon-check"><!-- cole o conteúdo de svg/check.svg aqui --></div>
```

Ou resolva os arquivos por `fokus-styles/svg/*.svg` no seu bundler
(`<img src="...">`, `background-image`, etc.).

## Uso — módulo JS (tree-shakeable)

```js
import check from "fokus-styles/icons/check.js";

document.querySelector("#slot").innerHTML = check;
```

Ou, via o barrel (nomes em camelCase, `arrow-right` → `arrowRight`):

```js
import { arrowRight, check } from "fokus-styles/icons";
```

Cada ícone já vem com `class="fs-icon"` e `stroke="currentColor"` — a cor
acompanha o `color` do CSS herdado; tamanho/cor customizados via a classe
utilitária `.fs-icon` do `fokus-styles` (ou seu próprio CSS).

## Licença

Código deste pacote (script de geração, `index.js`): MIT (ver `LICENSE`).
Os ícones em si são do projeto [Lucide](https://lucide.dev), licença ISC
(ver `LICENSE-LUCIDE.txt`) — parte deles é derivada do projeto Feather
(MIT), atribuição preservada no mesmo arquivo.
