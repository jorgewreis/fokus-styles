# Utility API e configuração Sass

O Fokus Styles oferece presets públicos em `fokus-styles/core`, `fokus-styles/components`,
`fokus-styles/utilities` e `fokus-styles/themes`. O arquivo `fokus-styles/config` expõe o
mapa `$fs-config` para entradas Sass customizadas.

O mixin `fs-fluid-type()` usa `clamp()` para escalar valores entre dois limites sem exigir
JavaScript. Classes utilitárias novas seguem o namespace `fs-u-*` e as classes existentes
continuam válidas dentro da linha 2.x.
