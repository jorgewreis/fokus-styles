# Tile

Linha compacta ícone + título/subtítulo + ações, para listas de
opções/configurações/itens (sinergia visual com
[Notification Center](notification-center.md) e [Empty State](empty-state.md)).

## Visão geral

```html
<div class="fs-tile">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Relatório mensal.pdf</p>
    <p class="fs-tile-subtitle">2.4 MB · Atualizado há 2h</p>
  </div>
  <div class="fs-tile-actions">
    <button type="button" class="fs-btn fs-btn-sm">Abrir</button>
  </div>
</div>
```

## Anatomia

`.fs-tile` > `.fs-tile-icon` (ícone SVG — [`fokus-styles/icons`](../guides/icons.md)
recomendado — ou imagem, largura fixa) +
`.fs-tile-body` (`.fs-tile-title` + `.fs-tile-subtitle`, opcional, ambos
truncam com reticências se não couberem) + `.fs-tile-actions` (opcional —
botões, switch, badge).

## Variações

- **Ações à direita** (padrão) ou **embaixo**: adicione
  `.fs-tile-actions-bottom` no `.fs-tile` para `.fs-tile-actions` quebrar
  para uma segunda linha, alinhada à direita.
- **Clicável**: `.fs-tile-clickable` + [`.fs-stretched-link`](card.md#fs-card-clickable)
  num link dentro do `.fs-tile-body` — o tile inteiro fica clicável/focável
  sem aninhar um `<a>` ao redor de tudo.
- **Tamanho**: `.fs-tile-sm`, `.fs-tile-lg`; sem sufixo = padrão.

```html
<div class="fs-tile fs-tile-actions-bottom">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Plano expira em 3 dias</p>
  </div>
  <div class="fs-tile-actions">
    <button type="button" class="fs-btn fs-btn-outline-secondary fs-btn-sm">Depois</button>
    <button type="button" class="fs-btn fs-btn-primary fs-btn-sm">Renovar</button>
  </div>
</div>

<div class="fs-tile fs-tile-clickable">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title"><a href="/perfil" class="fs-stretched-link">Jorge Reis</a></p>
    <p class="fs-tile-subtitle">Ver perfil</p>
  </div>
</div>
```

## Estados

Nenhum próprio — hover/focus da variante clicável reusa o mesmo padrão do
[Card clicável](card.md#fs-card-clickable) (`:hover`/`:focus-within`, borda
+ sombra).

## A11y

- Título/subtítulo truncados (`text-overflow: ellipsis`) escondem texto
  visualmente, mas o conteúdo continua no DOM/acessível — se o truncamento
  for crítico, considere `title="..."` no elemento pra tooltip nativo.
- Na variante clicável, o link dentro de `.fs-tile-body` é o elemento
  focável real — o `::after` do stretched-link só expande a área de
  clique, não tira o foco do link.

## API JS

Nenhuma — 100% CSS.

## Tokens

Sem tokens de componente próprios — usa `--fs-color-border`,
`--fs-color-surface`, `--fs-color-bg-subtle` (ícone), `--fs-color-text`,
`--fs-color-muted`, `--fs-radius-md`, `--fs-shadow-sm` (hover clicável).

## Exemplo

```html
<div class="fs-tile">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Tema escuro</p>
    <p class="fs-tile-subtitle">Alterna a aparência da interface</p>
  </div>
  <div class="fs-tile-actions">
    <div class="fs-switch">
      <input type="checkbox" class="fs-switch-input" id="tile-theme" checked aria-label="Ativar tema escuro">
      <label for="tile-theme" class="fs-switch-label"></label>
    </div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/content-data.html#tile).
