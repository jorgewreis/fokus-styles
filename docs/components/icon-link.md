# Icon link

## Visão geral

`.fs-icon-link` alinha texto e SVG com flex inline e espaçamento de .5em.
O link continua sendo navegação HTML normal; nenhuma inicialização JS é necessária.

## Anatomia e exemplo

```html
<a class="fs-icon-link" href="/documentacao">
  Ver documentação
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
</a>
```

O SVG é decorativo; o texto fornece o nome e o destino do link. Substitua o
href por uma rota existente. O componente dimensiona SVGs em 1em × 1em;
ícones em img/fontes não recebem essa regra.

## Estados

No hover o SVG se desloca .15em na direção do texto: à direita em LTR e
à esquerda em RTL. `:dir(rtl)` respeita a direção herdada e um `dir="ltr"`
local dentro de uma seção RTL. O componente não espelha o desenho do SVG;
escolha um ícone apropriado à direção e ao significado do link.

Não há transição definida no componente. Com `prefers-reduced-motion: reduce`,
o deslocamento não é aplicado e `transition` é desativada.

## A11y

Mantenha o texto visível, o foco do link e o contraste apropriado ao fundo.
Use `<button>` para ações sem navegação, com o componente Button adequado.
Não use um ícone sozinho sem fornecer nome acessível.

## Tokens e limites

Não há tokens próprios: tamanho e espaço são relativos à fonte. Cor e foco
vêm dos estilos de link/contexto. Não há variantes ou API JS próprias.

## Verificação

`component-docs-contract.test.js` confere classes, texto e SVG decorativo.
`icon-link.test.js` valida as regras compiladas. `icon-link.spec.mjs` verifica
hover, direção herdada/local e troca de preferência de movimento no navegador.
