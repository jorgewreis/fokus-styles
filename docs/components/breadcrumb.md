# Breadcrumb

Trilha de navegação hierárquica ("você está aqui"). O uso básico é 100%
CSS; auto-init opcional (`data-fs="breadcrumb"`) adiciona truncamento com
tooltip e colapso em telas pequenas.

## Visão geral

```html
<nav aria-label="breadcrumb">
  <ol class="fs-breadcrumb">
    <li class="fs-breadcrumb-item"><a href="#">Início</a></li>
    <li class="fs-breadcrumb-item"><a href="#">Categoria</a></li>
    <li class="fs-breadcrumb-item is-active">Página atual</li>
  </ol>
</nav>
```

## Anatomia

`<ol class="fs-breadcrumb">` > `<li class="fs-breadcrumb-item">` (com
`<a>` interno, exceto o último). O separador `/` entre itens é desenhado
via `::before` — não insira manualmente.

## Variações

Nenhuma variação visual (cor/tamanho); a variação é comportamental (ver
Avançado abaixo).

## Estados

`.fs-breadcrumb-item.is-active` — marca o item atual, sem link, cor de
texto normal (os demais usam `--fs-color-muted`).

## Avançado: truncamento + colapso (JS opcional)

Com `data-fs="breadcrumb"`, cada label longo trunca com reticências (CSS)
e ganha um tooltip com o texto completo **só se realmente transbordar**
(medido após as fontes carregarem, pra não errar o corte com a métrica do
fallback). Abaixo de 640px de largura de viewport, os níveis
intermediários (mantendo sempre o primeiro e o último visíveis) colapsam
num único item "…" que abre um dropdown com os links ocultos.

```html
<ol class="fs-breadcrumb" data-fs="breadcrumb" data-max-items="3">
  <li class="fs-breadcrumb-item"><a href="#">Início</a></li>
  <li class="fs-breadcrumb-item"><a href="#">Categoria de produtos muito específica</a></li>
  <li class="fs-breadcrumb-item"><a href="#">Subcategoria</a></li>
  <li class="fs-breadcrumb-item"><a href="#">Marca</a></li>
  <li class="fs-breadcrumb-item is-active">Produto atual com nome bem longo</li>
</ol>
```

`data-max-items` (padrão `4`) define quantos itens cabem antes do colapso
entrar em ação (só é avaliado abaixo do breakpoint `sm`, 640px).

## A11y

- Envolva a lista num `<nav aria-label="breadcrumb">` (ou "trilha de
  navegação") — não gerado automaticamente.
- O item "…" do colapso tem `aria-label="Mostrar níveis ocultos"` e abre um
  [Dropdown](dropdown.md) padrão, com toda a navegação por teclado dele.

## API JS

Auto-init via `data-fs="breadcrumb"` (só necessário para truncamento/
colapso — a trilha básica não precisa de JS). `Breadcrumb.getInstance(el)`.

| Método | Descrição |
|---|---|
| `dispose()` | Cancela medição pendente, descarta Tooltips próprios e dropdown, remove listener, restaura itens colapsados e desregistra a instância; é idempotente. |

Sem eventos customizados.

## Tokens

`--fs-color-muted`, `--fs-color-primary` (links), `--fs-color-text`
(item ativo). O dropdown do colapso usa os tokens de
[Dropdown](dropdown.md).

## Exemplo

```html
<nav aria-label="breadcrumb">
  <ol class="fs-breadcrumb">
    <li class="fs-breadcrumb-item"><a href="#">Início</a></li>
    <li class="fs-breadcrumb-item"><a href="#">Categoria</a></li>
    <li class="fs-breadcrumb-item is-active">Produto atual</li>
  </ol>
</nav>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#breadcrumb).

### Limites atuais do truncamento e descarte

A medição de overflow acontece uma vez, após `document.fonts.ready` (ou um
requestAnimationFrame). A media query atualiza o colapso, não recalcula todos
os tooltips quando o conteúdo ou a largura muda. `maxItems` é convertido com
`Number`, sem validação de faixa; forneça um inteiro positivo coerente. Ele é
o limiar de colapso, não a quantidade de itens mantidos: ao colapsar, ficam
primeiro, reticências e último.

**Descarte:** `dispose()` cancela o requestAnimationFrame pendente e torna
inofensivo o callback de `document.fonts.ready`, que não pode ser cancelado.
Remove os Tooltips criados pela própria instância, o dropdown de reticências,
o listener da media query e o registro. Tooltips que já existiam nos alvos
são reutilizados sem mudança de dono e não são descartados pelo Breadcrumb.
Chamadas repetidas de dispose não afetam uma nova instância no mesmo elemento.

As classes de truncamento e o `data-title` adicionados permanecem no DOM;
o descarte não restaura todo o HTML original. Recriar a instância mede o texto
novamente e cria no máximo um Tooltip por alvo sem instância existente.
A versão básica sem data-fs não inicia medição; ao desmontar a versão avançada,
chame dispose antes de remover o HTML e descarte recursos próprios da aplicação.
