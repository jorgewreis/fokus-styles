# Button

Botão de ação, base visual (cor de contraste automática, tamanhos) para
badges, alertas, tags e tabelas.

## Visão geral

```html
<button type="button" class="fs-btn">Padrão</button>
<button type="button" class="fs-btn fs-btn-primary">Primary</button>
<button type="button" class="fs-btn fs-btn-outline-primary">Outline</button>
```

Funciona em `<button>`, `<a>` ou qualquer elemento — a classe é puramente
visual, sem exigir uma tag específica.

## Anatomia

Um único elemento (`.fs-btn`); nenhuma marcação interna obrigatória. O
botão de fechar (`.fs-btn-close`, usado por Card/Modal/Toast/Tag) é uma
variante separada, sem texto, desenhada só com `::before`/`::after`:

```html
<button type="button" class="fs-btn-close" aria-label="Fechar"></button>
```

## Variações

- **Cor sólida**: `.fs-btn-primary`, `-secondary`, `-success`, `-warning`,
  `-danger`, `-info` — fundo colorido, texto com contraste calculado
  automaticamente (`color-contrast()`, garante AA).
- **Cor outline**: `.fs-btn-outline-{cor}` — borda e texto coloridos, fundo
  transparente; hover/active preenchem com a cor sólida.
- **Tamanho**: `.fs-btn-sm` (30px), `.fs-btn-lg` (46px); sem sufixo = 38px
  (padrão).

```html
<button type="button" class="fs-btn fs-btn-danger fs-btn-sm">Excluir</button>
<button type="button" class="fs-btn fs-btn-outline-success fs-btn-lg">Aprovar</button>
```

## Estados

- **Hover/active**: `filter: brightness()` (escurece), sem redeclarar cor.
- **Foco**: anel via `:focus` (mixin `focus-ring`).
- **Desabilitado**: atributo `disabled` (em `<button>`) ou classe
  `.is-disabled` (funciona em qualquer elemento, inclusive `<a>`, que não
  aceita `disabled` nativamente).

```html
<button type="button" class="fs-btn fs-btn-primary" disabled>Desabilitado</button>
<a href="#" class="fs-btn is-disabled">Link desabilitado</a>
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
