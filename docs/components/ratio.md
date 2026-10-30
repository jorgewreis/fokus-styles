# Ratio

## Visão geral

`.fs-ratio` reserva espaço proporcional à largura. O padrão é 16:9, usando
um pseudo-elemento com padding percentual. Não é um controle de reprodução.

## Anatomia e exemplo

```html
<div class="fs-ratio fs-ratio-4x3">
  <img src="/imagens/escritorio.jpg" alt="Sala de atendimento do escritório">
</div>
```

Use um único filho de mídia direto. Todos os filhos diretos ficam absolutos,
com largura/altura 100% e `object-fit:cover`. Coloque legendas fora do frame,
para não sobrepor mídia. Substitua o caminho por uma imagem do aplicativo.

## Variações

| Classe | `--fs-ratio` (altura / largura × 100%) |
| --- | --- |
| `.fs-ratio-1x1` | 100% |
| `.fs-ratio-4x3` | 75% |
| `.fs-ratio-16x9` | 56.25% |
| `.fs-ratio-21x9` | 42.857% |

Exemplo de proporção personalizada 3:2 (não é classe pronta):

```html
<div class="fs-ratio" style="--fs-ratio: 66.6667%">
  <img src="/imagens/paisagem.jpg" alt="Vista da orla de Ilhéus">
</div>
```

## Estados

A proporção permanece durante carregamento/redimensionamento. Não há estado
de erro ou loaded. `object-fit:cover` pode recortar imagens; `iframe` ocupa o
frame mas o conteúdo remoto não é recortado/controlado por object-fit.

## A11y

Imagens precisam de alt apropriado; iframes precisam de title que explique seu
conteúdo. Vídeos devem oferecer controles e legendas quando aplicável. O frame
não injeta nenhuma dessas informações e não resolve acessibilidade da mídia.

## Tokens e limites

`--fs-ratio` aceita percentual, não a string `16/9`. O container precisa de
largura disponível no layout. Não há JavaScript nem detecção automática da
proporção intrínseca; para altura natural, use responsive-media.

## Verificação

`component-docs-contract.test.js` confere classes, filho único e alt dos exemplos.
Confira recorte, legendas e redimensionamento no navegador com mídia real.
