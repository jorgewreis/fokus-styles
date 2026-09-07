# API JavaScript

Os módulos vanilla são SSR-safe quando importados e expõem instâncias idempotentes por
`getOrCreateInstance`. Modal, Theme, Navbar, Scrollspy e FormValidation também oferecem
destruição explícita com `dispose()`.

Os eventos comuns são `fs:show`, `fs:shown`, `fs:hide` e `fs:hidden`. Atributos declarativos
usam `data-fs-toggle`, `data-fs-target`, `data-fs-dismiss`, `data-fs-placement` e
`data-fs-theme`.
