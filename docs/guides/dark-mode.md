# Dark mode

O tema escuro é nativo desde a primeira versão do framework — não é um
plugin nem exige JavaScript.

## Ativação

Um único atributo no `<html>` (ou em qualquer contêiner — o tema se aplica
por escopo, não só global):

```html
<html data-theme="dark">
```

```html
<!-- Escopo local: só este painel fica escuro -->
<div data-theme="dark">
  <div class="fs-card">...</div>
</div>
```

Não há classe `.dark`/`.fs-dark` — é sempre o atributo `data-theme="dark"`.
Remover o atributo (ou trocar pra qualquer outro valor) volta ao tema claro.

## Como funciona

`packages/fokus-core/scss/themes/_dark.scss` redefine os tokens semânticos
de cor (`--fs-color-text`, `--fs-color-surface`, `--fs-color-{primary,
success,...}`, `--fs-alert-*-bg/-text`, `--fs-feedback-*-bg`) sob o seletor
`[data-theme="dark"]`. Como todo componente já consome esses tokens via
`var()`, nenhum CSS extra por componente é necessário — trocar o atributo já
propaga a cor nova para tudo.

As cores do tema escuro não são um segundo conjunto arbitrário: primary/
secondary/success/warning/danger/info são misturados (`color.mix()`, espaço
OKLCH) a partir do mesmo primitivo do tema claro, clareando em direção ao
branco — mantém a identidade de cor entre os dois temas. Os pesos de mistura
foram calibrados para manter contraste WCAG AA (ver
[`docs/reference/contrast-report.md`](../reference/contrast-report.md) e
`npm run contrast`).

## JavaScript para alternar (opcional)

O framework não fornece um componente de "toggle de tema" pronto — é
deliberadamente simples de implementar com o que você já tem
(`.fs-switch`, ver [`../components/switch.md`](../components/switch.md)):

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="theme-toggle">
  <label for="theme-toggle" class="fs-switch-label">Tema escuro</label>
</div>
```

```js
const toggle = document.getElementById("theme-toggle");
const stored = localStorage.getItem("theme");

if (stored === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  const theme = toggle.checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});
```

Para respeitar a preferência do sistema operacional por padrão (antes de
qualquer escolha manual salva), combine com
`window.matchMedia("(prefers-color-scheme: dark)").matches` na primeira
carga.

## Customizando o tema escuro

Como qualquer outro token, redefina sob `[data-theme="dark"]` no seu
próprio CSS — carregado **depois** do CSS do FokusStyles, para vencer a cascata:

```css
[data-theme="dark"] {
  --fs-color-surface: #14151a;
}
```

## Próximo passo

[Acessibilidade](accessibility.md) — teclado, ARIA e contraste por
componente.
