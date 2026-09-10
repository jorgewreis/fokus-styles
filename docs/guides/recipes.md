# Recipes de composição

Recipes são combinações recomendadas de componentes e utilitários. Elas orientam composição
consistente, acessível e responsiva sem criar novos contratos de classes.

## Card responsivo

```html
<section class="fs-container" aria-labelledby="produtos-title">
  <h2 id="produtos-title" class="fs-u-fs-h2 fs-u-mb-4">Produtos</h2>
  <div class="fs-row fs-row-cols-1 fs-row-cols-md-2 fs-row-cols-xl-3">
    <article class="fs-card">
      <div class="fs-card-body">
        <h3 class="fs-card-title">Plano essencial</h3>
        <p class="fs-card-text">Descrição curta e objetiva.</p>
        <a class="fs-btn fs-btn-primary fs-stretched-link" href="/planos/essencial">Conhecer</a>
      </div>
    </article>
  </div>
</section>
```

Não use `tabindex` no card inteiro nem aninhe links. O alvo focável deve continuar sendo o link.

## Formulário com feedback

```html
<div class="fs-form-group">
  <label for="nome">Nome completo</label>
  <input id="nome" class="fs-form-control is-invalid" aria-invalid="true" aria-describedby="nome-erro">
  <p id="nome-erro" class="fs-invalid-feedback">Informe seu nome completo.</p>
</div>
```

Mantenha label visível, mensagem persistente e associação por `aria-describedby`. Não dependa
de placeholder, tooltip ou somente da cor para comunicar erro.

## Toolbar responsiva

```html
<div class="fs-cluster fs-u-justify-content-between fs-u-gap-2" aria-label="Ações da lista">
  <h2 class="fs-u-fs-lg fs-u-m-0">Processos</h2>
  <div class="fs-cluster fs-u-gap-2">
    <button class="fs-btn fs-btn-secondary" type="button">Filtrar</button>
    <button class="fs-btn fs-btn-primary" type="button">Novo</button>
  </div>
</div>
```

## Dashboard com Grid local

```html
<section class="fs-u-grid fs-u-grid-cols-1 fs-u-grid-cols-lg-4 fs-u-gap-4">
  <article class="fs-u-col-span-lg-3">Conteúdo principal</article>
  <aside class="fs-u-col-span-lg-1" aria-label="Resumo">Resumo</aside>
</section>
```

Use Grid para composição bidimensional local; use `.fs-row` e `.fs-col-*` quando o layout
precisar seguir o sistema de gutters da página.

## Estado de carregamento

```html
<button class="fs-btn fs-btn-primary" type="button" aria-busy="true" disabled>
  <span class="fs-spinner fs-spinner-sm" aria-hidden="true"></span>
  Carregando
</button>
```

O texto deve continuar identificando a operação. Movimento contínuo deve respeitar
`prefers-reduced-motion` sem ocultar o estado de carregamento.

## Empty state

```html
<section class="fs-empty-state fs-u-text-center" aria-labelledby="empty-title">
  <h2 id="empty-title" class="fs-empty-state-title">Nenhum resultado</h2>
  <p class="fs-empty-state-text">Ajuste os filtros ou crie o primeiro registro.</p>
  <button class="fs-btn fs-btn-primary" type="button">Criar registro</button>
</section>
```

## Checklist de uma recipe

- ordem semântica do DOM preservada;
- teclado e foco visível funcionando;
- conteúdo longo testado;
- light mode, dark mode e RTL revisados;
- `forced-colors` e `prefers-reduced-motion` considerados;
- cor não é o único indicador de estado;
- classes utilitárias não substituem semântica HTML ou ARIA.
