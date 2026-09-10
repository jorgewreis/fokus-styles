# Tabs

Alterna painéis de conteúdo por clique/teclado. Reusa `.fs-nav-link`
([Navbar](navbar.md)) como item — o HTML e a navegação por teclado são os
mesmos em qualquer um dos 3 estilos visuais.

## Visão geral

```html
<div class="fs-tabs" data-fs="tabs">
  <a href="#" class="fs-nav-link is-active" data-fs-target="#perfil">Perfil</a>
  <a href="#" class="fs-nav-link" data-fs-target="#seguranca">Segurança</a>
</div>
<div class="fs-tab-content">
  <div class="fs-tab-pane is-active" id="perfil">Conteúdo Perfil.</div>
  <div class="fs-tab-pane" id="seguranca">Conteúdo Segurança.</div>
</div>
```

## Anatomia

`.fs-tabs` (`data-fs="tabs"`) > `.fs-nav-link` (um por aba, `data-fs-target`
apontando pro painel) + `.fs-tab-content` > `.fs-tab-pane` (um por aba,
`id` batendo com o `data-fs-target` correspondente).

## Variações

- **Estilo**: linha (padrão, sublinhado na aba ativa), `.fs-tabs-pill`
  (chip com fundo sólido na aba ativa, sem linha), `.fs-tabs-depth` (aba
  ativa "sobe" com fundo igual ao conteúdo, sobre um backdrop neutro — como
  aba de pasta).
- **Alinhamento**: `.fs-tabs-center`, `.fs-tabs-right`; sem sufixo =
  esquerda (padrão). `.fs-tabs-fill` distribui os itens em largura igual.
- **Tamanho**: `.fs-tabs-sm`, `.fs-tabs-lg`; sem sufixo = padrão.

```html
<div class="fs-tabs fs-tabs-pill fs-tabs-center" data-fs="tabs">...</div>
<div class="fs-tabs fs-tabs-depth fs-tabs-fill fs-tabs-lg" data-fs="tabs">...</div>
```

## Estados

- `.is-active` na aba e no painel correspondente — controlado pelo JS ao
  trocar, ou definido no HTML inicial (exatamente uma aba/painel deve
  começar ativo).
- `.is-disabled` na aba — não recebe clique nem entra na navegação por
  seta.

## A11y

O JS aplica automaticamente ao inicializar: `role="tablist"` no `.fs-tabs`,
`role="tab"` + `aria-selected` + `tabindex` (roving: só a aba ativa tem
`tabindex="0"`) em cada `.fs-nav-link`, e `role="tabpanel"` +
`aria-labelledby` no painel correspondente. Nenhum desses atributos precisa
ser escrito manualmente no HTML.

Teclado (com foco numa aba): `ArrowLeft`/`ArrowRight` move e ativa a
aba anterior/próxima (pulando desabilitadas), `Home`/`End` vai pra
primeira/última.

Para separar navegação e ativação, use `data-tabs-activation="manual"` no
grupo. Nesse modo as setas apenas movem o foco; `Enter` ou `Espaço` ativa a
aba focada.

## API JS

Auto-init via `data-fs="tabs"`. `Tabs.getInstance(el)`.

| Método | Descrição |
|---|---|
| `show(tabEl)` | Ativa a aba `tabEl` (deve ser uma das `.fs-nav-link` do grupo) e o painel correspondente; desativa as demais. Não faz nada se `tabEl` já é a ativa. |
| `dispose()` | Remove os listeners de clique/teclado e desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:tab:changed` | Não | Depois de trocar de aba — `event.detail.target` traz o seletor (`data-fs-target`) da aba ativa. |

```js
const tabs = FokusStyles.Tabs.getInstance(document.getElementById("minhas-tabs"));
tabs.show(document.querySelector('[data-fs-target="#seguranca"]'));
```

## Tokens

Usa `--fs-color-border`, `--fs-color-primary` (linha/pill ativos),
`--fs-color-bg-subtle` (depth), `--fs-color-surface` (depth ativo),
`--fs-radius-sm`.

## Exemplo

```html
<div class="fs-tabs" data-fs="tabs">
  <a href="#" class="fs-nav-link is-active" data-fs-target="#tab-perfil">Perfil</a>
  <a href="#" class="fs-nav-link" data-fs-target="#tab-seguranca">Segurança</a>
  <a href="#" class="fs-nav-link is-disabled" data-fs-target="#tab-notif">Notificações</a>
</div>
<div class="fs-tab-content">
  <div class="fs-tab-pane is-active" id="tab-perfil">Conteúdo da aba Perfil.</div>
  <div class="fs-tab-pane" id="tab-seguranca">Conteúdo da aba Segurança.</div>
  <div class="fs-tab-pane" id="tab-notif">Conteúdo da aba Notificações (desabilitada).</div>
</div>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#tabs).

Além do estilo de linha, estão disponíveis `.fs-tabs-boxed`,
`.fs-tabs-toggle`, `.fs-tabs-vertical` e `.fs-tabs-scroll`. Use o modo vertical
em navegação lateral e preserve o padrão `tablist`/`tab`/`tabpanel` gerado pelo
JS.
