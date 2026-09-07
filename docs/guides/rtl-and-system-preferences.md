# RTL e preferências do sistema

## Visão geral

O Fokus Styles 2.4 mantém os componentes em fluxo lógico e oferece o preset
`fokus-styles/rtl.css` para documentos com `dir="rtl"`. O preset complementa
a folha principal e preserva `margin-inline`, `padding-inline`, `inset-inline`
e `border-inline-*`.

```html
<html dir="rtl" data-fs-theme="auto">
  <link rel="stylesheet" href="fokus-styles/dist/css/fokus.css">
  <link rel="stylesheet" href="fokus-styles/dist/css/fokus-rtl.css">
</html>
```

## Estados de sistema

O framework respeita `prefers-reduced-motion`, `prefers-contrast: more`,
`forced-colors: active` e `prefers-color-scheme`. Em alto contraste, bordas e
foco passam a usar espessuras maiores; em forced colors, ações preservam
`ButtonText` e o foco usa `Highlight`.

## A11y

O atributo `dir` deve ser aplicado ao documento ou ao contêiner que define o
fluxo de leitura. Use `dir="auto"` quando a direção do texto inserido não for
conhecida.
