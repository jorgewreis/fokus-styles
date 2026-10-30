# Button

Botão de ação com variantes de cor, tamanho, ícone e carregamento.
As cores usam tokens de tema; customizações exigem validação de contraste.

## Visão geral

```html
<button type="button" class="fs-btn">Padrão</button>
<button type="button" class="fs-btn fs-btn-primary">Primary</button>
<button type="button" class="fs-btn fs-btn-outline-primary">Outline</button>
```

Use `<button>` para ações e `<a href>` para navegação. A classe é visual;
aplicá-la a um elemento genérico não fornece semântica ou interação por teclado.

## Anatomia

Um único elemento (`.fs-btn`); nenhuma marcação interna obrigatória. O
botão de fechar (`.fs-btn-close`, usado por Card/Modal/Toast/Tag) é uma
variante separada, sem texto, desenhada só com `::before`/`::after`:

```html
<button type="button" class="fs-btn-close" aria-label="Fechar"></button>
```

## Variações

- **Cor sólida**: `.fs-btn-primary`, `-secondary`, `-success`, `-warning`,
  `-danger`, `-info` — fundo e texto definidos pelos pares de tokens
  `--fs-color-{cor}` / `--fs-color-on-{cor}`. Overrides de tema precisam
  preservar contraste; não há garantia automática para cores arbitrárias.
- **Cor outline**: `.fs-btn-outline-{cor}` — borda e texto coloridos, fundo
  transparente; hover/active preenchem com a cor sólida.
- **Tamanho**: `.fs-btn-sm`, `.fs-btn-lg`; alturas mínimas e paddings vêm
  de `--fs-control-height{-sm|-lg}` e `--fs-control-padding-x{-sm|-lg}`.
- **Só ícone**: `.fs-btn.fs-btn-icon`, com alvo definido por
  `--fs-control-touch-target` e nome acessível obrigatório.

```html
<button type="button" class="fs-btn fs-btn-danger fs-btn-sm">Excluir</button>
<button type="button" class="fs-btn fs-btn-outline-success fs-btn-lg">Aprovar</button>
```

## Estados

- **Hover/active**: o botão base usa `--fs-btn-hover-bg` / `--fs-btn-active-bg`;
  a variante primary aplica `brightness(0.98)` / `brightness(0.95)` (escurece discretamente,
  preservando contraste AA do texto nos temas e marcas padrão).
  Outlines preenchem o fundo e trocam a cor do texto.
- **Foco**: anel via `:focus-visible` (mixin `focus-ring`).
- **Desabilitado**: atributo `disabled` (em `<button>`) ou classe
  `.is-disabled` / `aria-disabled="true"` para aparência. Em links, isso não
  substitui prevenção de ativação por teclado/JS: prefira não renderizar um
  link ativo quando indisponível.
- **Carregando**: `.is-loading` ou `aria-busy="true"` desenha spinner e bloqueia
  eventos de ponteiro. Use também `disabled` no botão e proteja a ação contra
  reenvio; remova esses estados após sucesso/erro.

```html
<button type="button" class="fs-btn fs-btn-primary" disabled>Desabilitado</button>
<button type="button" class="fs-btn fs-btn-primary" aria-busy="true" disabled>Salvando…</button>
<button type="button" class="fs-btn fs-btn-icon" aria-label="Adicionar">+</button>
```

## A11y

- `<button>` é a tag recomendada para ações (não navegação); use `<a
  href="...">` só quando o clique navega para outra URL.
- Botões só-ícone (sem texto visível) precisam de `aria-label` — o
  framework não injeta um automaticamente.
- Foco visível por padrão; não remova o anel sem substituir por outro
  indicador com contraste equivalente.

## API JS

Nenhuma — 100% CSS.

## Tokens

Componente (`--fs-btn-*`, com fallback pro semântico correspondente —
sobrescrevível por instância sem `!important`):

| Token | Fallback |
|---|---|
| `--fs-btn-bg` | `--fs-color-bg-subtle` |
| `--fs-btn-color` | `--fs-color-text-primary` |
| `--fs-btn-border-color` | `--fs-color-border-default` |

As variantes de cor (`.fs-btn-primary` etc.) sobrescrevem esses três tokens
diretamente, não `background-color`/`color`/`border-color` — ver
[`docs/reference/scss-architecture.md`](../reference/scss-architecture.md#tokens)
para o padrão. Raio: `--fs-radius-sm`.

## Exemplo

```html
<button type="button" class="fs-btn">Padrão</button>
<button type="button" class="fs-btn fs-btn-primary">Primary</button>
<button type="button" class="fs-btn fs-btn-outline-danger fs-btn-sm">Cancelar</button>
<button type="button" class="fs-btn fs-btn-success fs-btn-lg">Confirmar</button>

<style>
  .meu-botao { --fs-btn-bg: #6d28d9; --fs-btn-color: #fff; --fs-btn-border-color: #6d28d9; }
</style>
<button type="button" class="fs-btn meu-botao">Cor custom por instância</button>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#button).
