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

No hover o SVG recebe `transform: translateX(.15em)`. Não há transição definida
no componente. A media query de movimento reduzido desativa `transition`, mas
**não remove esse deslocamento**. Não considere a animação inteiramente
neutralizada só por usar essa classe.

## A11y

Mantenha o texto visível, o foco do link e o contraste apropriado ao fundo.
Use `<button>` para ações sem navegação, com o componente Button adequado.
Não use um ícone sozinho sem fornecer nome acessível.

## Tokens e limites

Não há tokens próprios: tamanho e espaço são relativos à fonte. Cor e foco
vêm dos estilos de link/contexto. O deslocamento usa X físico, não direção
lógica: em RTL continua indo à direita. Não há variantes ou API JS próprias.

## Verificação

`component-docs-contract.test.js` confere classes, texto e SVG decorativo.
Confira hover, foco, RTL e preferência de movimento reduzido no navegador.
