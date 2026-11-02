> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

## Propósito e escolha da proporção

Ratio ajuda a reservar uma área visual estável antes de uma mídia terminar de carregar. Isso é útil em galerias, capas e incorporações cuja forma deve permanecer coerente entre itens. A proporção descreve a relação entre largura e altura do quadro, não o formato do arquivo e muito menos sua qualidade. Uma imagem panorâmica dentro de um quadro quadrado pode ocupar o espaço corretamente e ainda assim perder conteúdo importante pelo recorte.

Escolha a forma a partir do uso da mídia. Uma capa editorial pode aceitar recorte; uma captura de tela com texto ou um documento digitalizado pode precisar ser mostrado por inteiro. Se a altura natural da imagem deve ser preservada, a classe de mídia responsiva pode ser mais apropriada. Não use Ratio para impor uma altura arbitrária a conteúdo textual que precisa crescer com tradução, zoom ou mensagens de erro.

### Como a área é calculada

O contêiner tem largura de 100% e posicionamento relativo. Um pseudo-elemento cria a altura por padding percentual, usando `--fs-ratio` com fallback de `56.25%`. O valor corresponde à altura dividida pela largura, multiplicada por cem: 9 dividido por 16 produz 56,25%. A propriedade espera um percentual válido para esse cálculo, não uma expressão textual como `16/9`.

Todos os filhos diretos são posicionados absolutamente, com os quatro lados no limite do quadro e dimensões de 100%. Por isso, duas mídias ou uma mídia e uma legenda como irmãos diretos se sobrepõem; não formam uma sequência vertical. Use um único filho de mídia e coloque legenda, controles adicionais e descrição fora do quadro. O componente não é um gerenciador de camadas e não decide qual filho deve aparecer acima.

## Integração de imagens e incorporações

Para imagens, `object-fit: cover` preenche a área sem distorcer a proporção intrínseca, recortando o que exceder. A posição de interesse pode exigir um `object-position` definido pela aplicação. Não altere o texto alternativo para descrever uma parte da imagem que deixou de estar visível sem primeiro conferir se esse recorte é realmente adequado à informação transmitida.

Um `iframe` pode ocupar o quadro, mas o CSS externo não controla o layout ou a acessibilidade da página remota. A incorporação exige avaliação própria de origem, permissões e privacidade. Ratio não configura sandbox, consentimento, título, legendas nem reprodução automática. Esses aspectos pertencem ao elemento incorporado e à política do aplicativo.

## API JS

Não existe construtor Ratio, detecção de dimensões, evento loaded ou observador do tamanho da mídia. A adaptação à largura é feita pelo layout CSS. O aplicativo pode reagir a eventos nativos de imagem ou vídeo, mas precisa tratar falhas e remover seus próprios listeners quando necessário. A presença de uma área reservada não significa que o recurso foi encontrado ou está pronto para uso.

### Acessibilidade e conteúdo essencial

O quadro visual não cria um nome acessível. Imagens informativas precisam de texto alternativo coerente, vídeos podem precisar de legendas e descrições, e iframes precisam de um título que identifique seu conteúdo. Uma legenda editorial visível complementa essas informações, mas não substitui automaticamente a alternativa apropriada ao tipo de mídia.

Confira também a ordem do conteúdo: a legenda depois da mídia deve continuar depois dela no DOM. Evite inserir texto essencial como uma segunda camada absoluta sem verificar sobreposição, foco e contraste. Se houver controles nativos de vídeo, teste se permanecem utilizáveis na menor largura prevista; uma proporção correta não garante espaço suficiente para todos os controles.

### Limites de revisão

O contêiner precisa receber largura útil de seu layout pai. A classe não define largura máxima nem garante que uma imagem pequena fique nítida quando ampliada. Verifique carregamento lento, arquivo ausente, diferentes proporções e recortes em telas estreitas. As medidas podem ser confirmadas no CSS, mas nitidez, enquadramento e funcionamento da mídia devem ser avaliados com os arquivos reais, não apenas com um bloco colorido de teste.
