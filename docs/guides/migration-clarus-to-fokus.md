# Migração do Clarus para o Fokus Styles

O Fokus Styles 2.0 renomeia integralmente a API pública do Clarus. Não há
aliases: atualize todos os imports, seletores, atributos e acessos ao global
JavaScript antes de remover o pacote anterior.

| Clarus 1.x | Fokus Styles 2.0 |
| --- | --- |
| `clarus-css` | `fokus-styles` |
| `clarus-icons` | `fokus-styles/icons` |
| `clarus-react` | `fokus-styles/react` |
| `clarus-cli` | `fokus-styles` com o comando `fokus` |
| `.fs-*` | `.fs-*` |
| `.u-*` | `.fs-u-*` |
| `--fs-*` | `--fs-*` |
| `data-fs*` | `data-fs*` |
| `data-fs-brand` | `data-fs-brand` |
| `window.Clarus` | `window.FokusStyles` |
| `fs:*` | `fs:*` |

## Instalação

```bash
npm uninstall clarus-css clarus-icons clarus-cli clarus-react
npm install fokus-styles
```

## Exemplo

```html
<button class="fs-btn fs-btn-primary" data-fs="modal" data-fs-target="#perfil">
  Abrir perfil
</button>

<script src="node_modules/fokus-styles/dist/js/fokus.min.js"></script>
<script>
  document.addEventListener("fs:modal:shown", () => console.log("aberto"));
</script>
```

Para React, importe `ModalTrigger`, `ModalPanel`, `DropdownTrigger`,
`DropdownMenu` e `TabList` de `fokus-styles/react`. Para ícones, importe do
barrel `fokus-styles/icons` ou de um módulo individual como
`fokus-styles/icons/check.js`.

O codemod `scripts/migrate-fokus.mjs` ajuda a converter a versão anterior do
framework. Execute-o primeiro com `--dry-run`, revise o diff e só então grave
as alterações.
