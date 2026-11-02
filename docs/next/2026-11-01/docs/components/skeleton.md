> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Skeleton

Placeholder de carregamento — 100% CSS, sem JS (você troca pelo conteúdo
real quando os dados chegam).

## Visão geral

```html
<div class="fs-skeleton fs-skeleton-text"></div>
<div class="fs-skeleton fs-skeleton-text"></div>
<div class="fs-skeleton fs-skeleton-circle" style="width: 48px; height: 48px;"></div>
```

## Anatomia

`.fs-skeleton` (base — cor + animação de pulso) combinado com uma forma:
`.fs-skeleton-text` (linha de texto, 1em de altura; o elemento que é o último filho de seu pai automaticamente encolhe para 80% de largura, imitando o fim de um
parágrafo), `.fs-skeleton-circle` (avatar), `.fs-skeleton-rect` (bloco/
imagem). Tamanho de circle/rect é livre — defina `width`/`height` via
`style` inline ou classe própria.

## Variações

`.fs-skeleton-wave` — em vez de pulsar a opacidade inteira, varre um
brilho da esquerda pra direita (substitui a animação padrão, não combine
os dois).

```html
<div class="fs-skeleton fs-skeleton-rect fs-skeleton-wave" style="width: 100%; height: 120px;"></div>
```

## Estados

Nenhum — é ele mesmo um estado (de carregamento) de outro conteúdo.
Anima infinitamente enquanto presente no DOM; remova/substitua quando os
dados reais chegarem.

## A11y

As variantes `.fs-skeleton-card`, `.fs-skeleton-table` e `.fs-skeleton-avatar` são visuais;
indique a região em atualização com `aria-busy="true"` e forneça uma mensagem textual de status quando necessário. O atributo não é, sozinho, um anúncio completo.

A animação para automaticamente sob `prefers-reduced-motion: reduce`
(fica estática, sem pulso/varredura). Se o carregamento for anunciado a
leitores de tela, envolva o conjunto de skeletons num contêiner com
`aria-busy="true"` (e finalize ao trocar pelo conteúdo real) — não aplicado
automaticamente.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-subtle` (cor de base), `--fs-radius-sm`/`-md`.

## Exemplo

```html
<div class="fs-tile" aria-busy="true">
  <div class="fs-skeleton fs-skeleton-circle" style="width: 40px; height: 40px;"></div>
  <div class="fs-tile-body" style="width: 100%;">
    <div class="fs-skeleton fs-skeleton-text" style="width: 60%;"></div>
    <div class="fs-skeleton fs-skeleton-text"></div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-93d85e5f7c85).

## Escolha e significado do carregamento

Skeleton representa aproximadamente a forma de um conteúdo que ainda não está disponível. Seu valor está em preservar a organização esperada de uma área, não em simular que dados já foram carregados. Use linhas para texto, um círculo para uma identificação visual e um retângulo para uma imagem quando essas regiões realmente fizerem parte do resultado. Uma composição complexa de formas não melhora a experiência se a resposta final tiver estrutura completamente diferente.

O componente não conhece a duração da operação. O pulso de 1,5 segundo e a varredura de 1,6 segundo se repetem independentemente de rede, cache ou processamento. Não interprete o número de ciclos como progresso. Se há uma medida confiável de conclusão, use uma apresentação de progresso apropriada; se houve falha, substitua o skeleton por uma mensagem de erro, em vez de mantê-lo animando indefinidamente.

### Formas e dimensões

A base fornece fundo, raio e animação. A classe text define uma linha de um em, com largura total; quando esse elemento é literalmente o último filho de seu pai, a largura passa a 80%. Isso não significa “última linha reconhecida de qualquer sequência”: se houver outro elemento depois, o seletor de último filho não se aplica. Defina a estrutura intencionalmente e verifique o resultado junto do conteúdo que acompanha as linhas.

Circle modifica o raio, mas precisa receber dimensões. Rect modifica o raio para a escala média, sem descobrir sozinho a largura e altura da futura imagem. Avatar é diferente: fornece 2.5rem nas duas dimensões. Card fornece uma composição em grid com gap, padding e altura mínima de dez rem; Table fornece altura e margem de uma linha visual. Nenhuma dessas variantes cria dados, cabeçalhos ou linhas reais de tabela.

Wave substitui o pulso da base por um pseudo-elemento que percorre a superfície. O overflow é ocultado para manter o brilho dentro da forma. Não coloque conteúdo importante dentro de um skeleton animado esperando que seja tratado como resultado final: a área serve de placeholder visual e será substituída pela aplicação. As dimensões devem aproximar o conteúdo esperado sem exigir uma cópia exata de cada palavra.

## Integração e lifecycle

Não há classe JavaScript Skeleton, auto-init ou método `finish`. A aplicação decide quando exibir, atualizar e remover as formas. Ao iniciar uma nova consulta, considere se é necessário apagar os resultados anteriores ou se uma indicação de atualização preserva melhor o contexto. Não remova um campo focado ou uma ação disponível apenas para fazer a tela inteira parecer carregando.

Ao concluir, troque a composição por dados reais e finalize `aria-busy` se ele tiver sido aplicado. Em uma resposta vazia, mostre uma explicação de ausência de itens; em erro, ofereça um caminho real de recuperação. Esses estados são distintos. Uma resposta antiga que chega depois de uma consulta mais recente também deve ser tratada pelo aplicativo, porque o CSS não possui controle de concorrência.

### Acessibilidade do estado

As formas são decorativas e não devem criar paradas de foco. Ocultá-las da árvore acessível evita que leitores tentem interpretar uma sequência de blocos sem informação. Uma mensagem textual pode informar o que está sendo carregado; `aria-busy` indica que uma região está em atualização, mas não é uma mensagem verbal completa por si só. Se o anúncio precisar ocorrer imediatamente, avalie manter o status fora da região ocupada, pois anúncios dentro dela podem ser adiados.

A preferência de movimento reduzido desativa o pulso e a animação do pseudo-elemento wave. Isso preserva a forma estática até que os dados cheguem. Confira a aplicação inteira, já que animações de ancestrais ou de outros componentes podem continuar existindo. Nenhuma pessoa deve depender de perceber movimento para entender que a operação está pendente.

### Limites de revisão

Teste carregamento lento, retorno instantâneo, erro, lista vazia e repetição da consulta. Verifique se a substituição não provoca salto excessivo de layout e se os nomes acessíveis dos controles continuam coerentes. O componente não determina um tempo mínimo de exibição: manter um skeleton depois de os dados estarem prontos exige uma justificativa de experiência, não é um requisito do framework. Medidas, seletores e estados de movimento podem ser testados no CSS; conforto visual e anúncio real exigem revisão em navegador e tecnologia assistiva.
