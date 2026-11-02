> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

## Escolha e propósito

Icon Link serve para apresentar um destino textual acompanhado de um pequeno símbolo, como uma seta ou um ícone de documento. O texto continua sendo a informação principal. Use essa composição quando o ícone reforça uma ideia já clara, não para esconder uma descrição longa atrás de um desenho ambíguo. Para uma ação que salva dados, abre um painel ou modifica estado sem navegar, escolha um botão e seu contrato de interação, em vez de fabricar um link sem destino.

A classe utiliza flex inline, portanto o conjunto participa do fluxo de texto como uma unidade com alinhamento interno. O espaço de `.5em` acompanha a dimensão da fonte. O SVG recebe largura e altura de `1em`, sem encolher dentro do flex; esse dimensionamento não se aplica automaticamente a imagens externas, fontes de ícone ou elementos arbitrários. Caso use outra tecnologia visual, trate suas dimensões como uma composição do aplicativo.

## Variações

Não há variantes prontas de cor, tamanho, abertura em nova aba ou posição do ícone. O resultado depende da tipografia herdada e da ordem dos filhos no HTML. Posicionar o SVG antes do texto é uma escolha de markup, não uma opção JavaScript. Preserve a sequência de leitura e confira se o símbolo escolhido ainda faz sentido nessa posição.

O deslocamento em hover é um detalhe de apresentação, não um indicador de navegação em andamento. Em uma direção RTL herdada, o movimento vai para a esquerda; em uma seção local marcada LTR, o seletor acompanha a direção efetiva. O desenho do ícone não é espelhado pelo CSS. Uma seta pode precisar de outro caminho SVG, enquanto um símbolo de download normalmente mantém seu significado independentemente da direção do texto.

## Integração com navegação real

O `href` deve apontar para uma rota ou recurso existente. No exemplo, `/documentacao` representa uma rota implementada pela aplicação, não uma página criada pelo componente. Os comportamentos normais de copiar endereço, abrir outra aba e usar o histórico continuam sendo responsabilidade do link e do navegador. Se um roteador interceptar a navegação, teste os gestos modificadores e o histórico segundo o contrato desse roteador.

Abrir uma nova aba, baixar um arquivo ou acessar um site externo são decisões distintas. Não acrescente esses comportamentos só porque há uma seta. Quando forem necessários, comunique o destino e a mudança de contexto de forma apropriada. O componente não valida URLs, não impede acesso a páginas restritas e não substitui as permissões de uma rota.

## API JS

Não existe construtor IconLink, auto-init, evento de seleção ou método de descarte. Nenhum listener é necessário para o movimento em hover. A preferência de movimento reduzido é tratada em CSS: o transform só é aplicado na condição `no-preference`, e a outra condição retira transições do SVG. Isso não desativa animações que a aplicação tenha colocado em outro ancestral ou dentro do próprio arquivo SVG.

### Nome, foco e detalhes visuais

Um SVG decorativo recebe `aria-hidden="true"` e não precisa repetir o nome do texto. `focusable="false"` explicita que o desenho não deve criar uma segunda parada de foco. Se o símbolo comunica informação que o texto não contém, escreva essa informação também de modo acessível, em vez de confiar que o leitor reconhecerá o ícone.

A classe não acrescenta um anel de foco próprio nem garante cor adequada em qualquer superfície. Preserve o estilo de link do contexto e verifique seu foco por teclado. Não remova o texto visível em telas pequenas para economizar espaço sem planejar um nome acessível e um alvo de interação adequado.

### Verificação de integração

Confira o link com mouse, teclado, toque, zoom e direção de escrita. Teste a URL final e não apenas o aspecto do ícone. O movimento de `.15em` não usa uma transição definida neste componente; se o produto exigir animação gradual, essa personalização precisa respeitar movimento reduzido. Os testes de CSS podem confirmar os seletores e medidas, mas a legibilidade da composição e a efetiva navegação precisam ser verificadas na tela em que ela será usada.
