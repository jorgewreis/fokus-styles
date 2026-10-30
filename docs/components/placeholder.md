# Placeholder

## Visão geral

`.fs-placeholder` desenha um bloco de carregamento. É apresentação CSS, não
um carregador de dados; consulte também [Skeleton](skeleton.md) para outra opção.

## Anatomia e exemplo

```html
<section aria-label="Resumo do processo" aria-busy="true">
  <p role="status">Carregando resumo…</p>
  <span class="fs-placeholder fs-placeholder-glow" style="width: 75%" aria-hidden="true"></span>
  <span class="fs-placeholder fs-placeholder-wave" style="width: 50%" aria-hidden="true"></span>
  <span class="fs-placeholder fs-placeholder-btn" aria-hidden="true"></span>
</section>
```

A largura das linhas é definida pelo consumidor; a classe base não determina
largura. Os estilos inline do exemplo são dimensões de conteúdo, não variantes
do framework. Não use o placeholder de botão como controle interativo.

## Variações

| Classe combinada com `.fs-placeholder` | Efeito |
| --- | --- |
| `.fs-placeholder-glow` | Oscilação de opacidade em 1.5s |
| `.fs-placeholder-wave` | Gradiente em movimento em 1.5s |
| `.fs-placeholder-btn` | Forma 6rem × 2.5rem e raio sm |

## Estados

Base: `min-height:1em`, fundo currentColor, opacidade .18, cursor wait.
Glow chega a .08. Em `prefers-reduced-motion:reduce`, glow/wave têm
`animation:none`. Ao concluir, substitua os placeholders pelo conteúdo e mude
`aria-busy` para false; em erro, mostre mensagem e possibilidade real de tentar
novamente. O framework não controla esse ciclo.

## A11y

Marque as formas como `aria-hidden="true"`, sem foco ou ações. Um texto de
status informa o carregamento; `aria-busy` informa atualização da região.
Leitores podem adiar anúncios dentro de região busy: se o anúncio imediato
for essencial, use a região live fora dela. Não anuncie cada forma individualmente.

## Tokens e limites

Apenas a forma de botão usa `--fs-radius-sm`; cor vem de currentColor.
Não há API JS, progress percentual ou substituição automática de conteúdo.

## Verificação

`component-docs-contract.test.js` verifica classes, formas ocultas da árvore
acessível e ausência de botões interativos. Confira carregamento/erro/sucesso e
preferência de movimento reduzido no aplicativo real.
