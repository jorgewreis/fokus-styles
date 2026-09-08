# Tag

Badge dismissível — reusa [Badge](badge.md) e `.fs-btn-close`
([Button](button.md)) mais o JS mínimo pra remover do DOM ao clicar no "x".

## Visão geral

```html
<span class="fs-badge fs-tag" data-fs="tag">
  Frontend
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Frontend"></button>
</span>
```

## Anatomia

`.fs-badge.fs-tag` (mesmo elemento, duas classes — Tag é um refinamento de
Badge, não um componente separado) contendo texto + `.fs-btn-close` com
`data-fs-dismiss="tag"`.

## Variações

- **Cor**: as mesmas de [Badge](badge.md) (`.fs-badge-{cor}`).
- **Tamanho**: apenas o tamanho padrão. Tags são controles compactos de
  remoção; usar uma única densidade evita variações de alvo e de texto em
  filtros e formulários.
- **Ícones**: envolva um SVG de `fokus-styles/icons` em `.fs-tag-icon` antes
  de `.fs-tag-label` para ícone inicial ou use `.fs-tag-icon-end` depois do
  texto para indicar um estado. O contêiner do ícone usa a mesma dimensão
  visual do botão de fechamento; `--fs-tag-icon-size`,
  `--fs-tag-icon-glyph-size`, `--fs-tag-icon-gap` e `--fs-tag-icon-color`
  permitem ajustes locais. O
  ícone é decorativo (`aria-hidden="true"`) quando o texto já descreve a tag;
  nunca use uma Tag somente com ícone como padrão.
- **Texto longo**: use `.fs-tag-truncate` na tag e `.fs-tag-label` no texto.
  Defina `--fs-tag-max-inline-size` conforme o contexto; o texto integral
  continua no DOM e pode ser exposto em `title` como apoio visual.
- **Agrupamento**: `.fs-tag-group` (flex + wrap) no contêiner pai,
  une tags lado a lado com separadores translúcidos; o botão de remoção só é
  revelado em hover ou foco, evitando ruído visual. A reserva simétrica de
  espaço para o botão mantém o texto visualmente centralizado; o fundo da tag
  inteira sinaliza o hover.
- **Protegida**: `.fs-tag-protected` desativa interação com `pointer-events:
  none`; substitua o botão por `.fs-tag-lock` e o ícone `shield-check` de
  `fokus-styles/icons` quando a tag não puder ser removida.
- **Overflow**: `.fs-tag-overflow` é um `<button>` compacto e transparente,
  sem borda, com o ícone `tags` em `primary` centralizado; ele representa tags
  não exibidas.
  Conecte-o a um popover ou a uma lista expandida e mantenha `aria-expanded`
  sincronizado com essa interface.

O botão de fechamento usa `--fs-tag-close-size` e `--fs-tag-close-gap`, herda
o raio do Badge e é a única ação de remoção. A Tag inteira não é um botão.

```html
<div class="fs-tag-group">
  <span class="fs-badge fs-tag" data-fs="tag">Design<button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover"></button></span>
  <span class="fs-badge fs-tag" data-fs="tag">Frontend<button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover"></button></span>
</div>
```

## Estados

Botão de dispensa é transparente no repouso; tem hover (fundo sutil) e
`:active` (leve "afundar", feedback tátil antes da remoção assíncrona). Ao
receber foco pelo teclado, a tag inteira também recebe um anel de foco para
ficar distinguível em agrupamentos densos.

Para uma operação assíncrona, aplique `aria-busy="true"` e `.is-loading`, ou
use `Tag.setLoading(true)`. Inclua um `.fs-spinner` depois de `.fs-tag-label`:
o estado pendente usa fundo `warning`, texto e spinner pretos. O botão de
remoção é desabilitado até que o estado seja removido.

## A11y

- `.fs-btn-close` **precisa** de `aria-label` descritivo (ex.: "Remover tag
  Frontend", não só "Remover") — é um botão só-ícone.
- A remoção só acontece ao clicar no botão de fechar, nunca ao clicar na
  tag inteira — evita remoção acidental.
- Se o botão de fechar estiver focado quando a Tag for removida, o foco vai
  para a próxima Tag do mesmo grupo; se não houver, vai para a anterior.
  Remoções programáticas sem foco no botão não movem o foco.
- Ícones com significado próprio precisam ser acompanhados por texto ou
  descrição acessível; não dependa apenas do desenho ou da cor.
- Para tags truncadas, mantenha a string completa dentro de `.fs-tag-label`;
  ela continua disponível para tecnologias assistivas. `title` é apenas uma
  ajuda adicional para ponteiro.
- O botão `.fs-tag-overflow` requer um nome acessível descritivo, como
  `aria-label="Mostrar mais 3 tags"`.

## API JS

Auto-init via `data-fs="tag"`. `Tag.getInstance(el)`.

| Método | Descrição |
|---|---|
| `dismiss()` | Dispara `fs:tag:dismissed` (cancelável); se não cancelado, remove o elemento do DOM e retorna `true`. Retorna `false` se estiver carregando ou se o evento for cancelado. |
| `setLoading(loading)` | Alterna `.is-loading`, `aria-busy` e o estado desabilitado do botão de remoção. |
| `dispose()` | Remove o listener de clique e desregistra a instância (não remove o elemento). |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:tag:dismissed` | Sim | Antes de remover — `event.preventDefault()` cancela a remoção. |

## Tokens

Usa os tokens de [Badge](badge.md) e expõe tokens locais para composição:
`--fs-tag-icon-size`, `--fs-tag-icon-glyph-size`, `--fs-tag-icon-gap`, `--fs-tag-icon-color`,
`--fs-tag-close-size` e `--fs-tag-close-gap`.

## Exemplo

```html
<div class="fs-tag-group">
  <span class="fs-badge fs-badge-primary fs-tag" data-fs="tag">
    Urgente
    <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Urgente"></button>
  </span>
  <span class="fs-badge fs-badge-danger fs-tag" data-fs="tag">
    Bloqueado
    <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Bloqueado"></button>
  </span>
</div>
```

```html
<span class="fs-badge fs-tag fs-tag-truncate" style="--fs-tag-max-inline-size: 20rem;" data-fs="tag">
  <span class="fs-tag-icon" aria-hidden="true"><!-- SVG de fokus-styles/icons --></span>
  <span class="fs-tag-label">Revisão de acessibilidade e compatibilidade entre navegadores</span>
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Revisão de acessibilidade e compatibilidade entre navegadores"></button>
</span>

<button type="button" class="fs-badge fs-tag fs-tag-overflow" aria-label="Mostrar mais 3 tags" aria-expanded="false">
  <svg class="fs-icon" aria-hidden="true"><!-- SVG tags de fokus-styles/icons --></svg>
</button>

<span class="fs-badge fs-tag is-loading" data-fs="tag" aria-busy="true">
  <span class="fs-tag-label">Salvando</span>
  <span class="fs-spinner" aria-hidden="true"></span>
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Salvando" disabled></button>
</span>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#tag).
