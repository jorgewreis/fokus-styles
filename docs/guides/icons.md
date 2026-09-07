# Ícones

O Fokus Styles inclui ícones como subpath opcional — ícone é conteúdo, não
estilo, e o bundle principal não importa nenhum deles. Use
`fokus-styles/icons`, com 1994 ícones SVG do conjunto
[Lucide](https://lucide.dev) (licença ISC), mais uma classe utilitária
`.fs-icon` no `fokus-styles` (sempre disponível, custo desprezível) pro
dimensionamento.

## Instalação

```bash
npm install fokus-styles
```

Zero dependências em runtime — o subpath contém apenas arquivos `.svg` e módulos
`.js` gerados; `lucide-static` é usado apenas para gerar o pacote, nunca é
instalado por quem consome o `fokus-styles`.

## Uso — SVG puro (zero JS)

Cada ícone pode ser resolvido como `fokus-styles/svg/<nome>.svg`, já
com `class="fs-icon"` aplicada. Copie o conteúdo direto no seu HTML:

```html
<button type="button" class="fs-btn fs-btn-primary">
  <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  Salvar
</button>
```

Essa é a forma recomendada: nenhuma dependência de build, o SVG já nasce
otimizado (sem comentários, sem atributos redundantes).

## Uso — módulo JS (tree-shakeable)

Se seu projeto já usa um bundler (Vite, esbuild, Rollup, webpack), importe
só os ícones que usa — cada um é um módulo próprio, então o restante dos
1994 nunca entra no seu bundle final:

```js
import check from "fokus-styles/icons/check.js";

document.querySelector("#status-icon").innerHTML = check;
```

Ou pelo barrel, com nomes em camelCase (`arrow-right` → `arrowRight`):

```js
import { arrowRight, check } from "fokus-styles/icons";
```

O pacote é publicado com `"sideEffects": false`, então bundlers modernos
eliminam os ícones não usados mesmo importando do barrel — mas prefira o
caminho direto (`fokus-styles/icons/check.js`) se seu bundler não fizer
tree-shaking de barrels corretamente.

## Dimensionamento e cor — `.fs-icon`

```html
<svg class="fs-icon fs-icon-lg" ...>...</svg>
```

| Classe | Tamanho |
|---|---|
| `.fs-icon` (padrão) | `1em` × `1em` — acompanha o `font-size` do elemento ao redor |
| `.fs-icon-xs` | 12px |
| `.fs-icon-sm` | 16px |
| `.fs-icon-lg` | 32px |
| `.fs-icon-xl` | 48px |

Cor: os ícones usam `stroke="currentColor"` — herdam a cor do texto
automaticamente. Para uma cor diferente do texto ao redor, aplique `color`
no elemento (ou num ancestral) como faria com qualquer texto.

## Ícones em componentes com JS

Componentes como [Combobox](../components/combobox.md) ou
[Command Palette](../components/command-palette.md) não têm nenhuma
integração especial com `fokus-styles/icons` — você cola o SVG (ou injeta via
módulo JS) dentro da marcação normal do componente, exatamente como faria
com qualquer outro conteúdo:

```html
<li class="fs-dropdown-item" data-value="download">
  <svg class="fs-icon" ...>...</svg>
  Baixar arquivo
</li>
```

## Licença

O código de geração do pacote é MIT (mesma licença do FokusStyles). Os ícones
em si são do projeto Lucide, licença ISC — parte deles derivada do
projeto Feather (MIT). Ambos os avisos de copyright são distribuídos junto
do pacote (`LICENSE`/`LICENSE-LUCIDE.txt` em `node_modules/fokus-styles/packages/fokus-icons/`
depois de instalado).

Mockup: [`mockup/foundations.html#icons`](../../mockup/foundations.html#icons).
