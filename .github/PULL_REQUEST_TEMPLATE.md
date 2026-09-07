## O que muda e por quê

<!-- Foco no "porquê" — o "o quê" já está no diff. -->

## Checklist técnico

- [ ] `npm run lint` passa localmente.
- [ ] `npm run build` passa localmente.
- [ ] `npm test` (Vitest) passa localmente.
- [ ] `npm run test:visual` passa, ou baselines foram regeneradas
      intencionalmente (`npm run test:visual:update`) e o diff visual foi
      revisado.
- [ ] Componentes novos/alterados seguem as convenções (`.fs-*`/`.fs-u-*`/`.is-*`,
      tokens `--fs-*`, `data-fs-*`, eventos `fs:*`) — ver `docs/reference/scss-architecture.md`.
- [ ] Estados de teclado/ARIA verificados para componentes interativos
      novos/alterados.
- [ ] Mudança é **breaking**? Se sim, documentada no `CHANGELOG.md` sob
      `### Changed` com nota `**BREAKING**` e, se aplicável, no guia de
      migração (`docs/guides/migration-v1.md`).
- [ ] `CHANGELOG.md` atualizado (seção `[Unreleased]`).

## Como testar

<!-- Passos manuais, mockup(s) relevante(s) em mockup/, tema claro/escuro. -->
