# Documentação do Fokus Styles

Esta documentação acompanha o Fokus Styles do primeiro uso à referência técnica.
Comece pelo caminho recomendado, consulte um guia quando precisar adaptar o
sistema e use as páginas de componentes como contratos de HTML, CSS, JavaScript
e acessibilidade.

## Fontes oficiais

O Fokus Styles faz parte do ecossistema Fokus Cloud. Estas fontes se
complementam e devem ser consultadas em conjunto:

- [Fokus Cloud](https://www.fokuscloud.com.br/) — visão do ecossistema e dos
  produtos que compartilham a base Fokus.
- [Fokus Styles](https://styles.fokuscloud.com.br/) — documentação publicada,
  fundamentos, instalação e guias visuais/interativos.
- [GitHub](https://github.com/jorgewreis/fokus-styles) — implementação,
  exemplos executáveis, issues, decisões e histórico versionado.
- [npm](https://www.npmjs.com/package/fokus-styles) — pacote público, versões
  disponíveis e instruções de instalação/distribuição.

Esta pasta é a referência técnica versionada do repositório. O site do Fokus
Styles é a camada publicada e navegável; o portal Fokus Cloud contextualiza o
framework dentro do ecossistema. Quando houver diferença, a implementação e
os testes da versão consultada no GitHub definem o comportamento efetivo.

## Caminho recomendado

1. [Instalação](getting-started/installation.md) — pacotes, CDN, bundles,
   fontes e importação via Sass.
2. [Formas de uso](getting-started/usage.md) — nomenclatura, auto-init,
   eventos e API comum dos componentes interativos.
3. [Theming](guides/theming.md) — tokens, marcas, Sass e customização em
   runtime.
4. [Acessibilidade](guides/accessibility.md) — foco, teclado, ARIA, contraste
   e movimento reduzido.
5. [Estabilidade e roadmap](reference/stability.md) — maturidade e escopo de
   cada grupo de recursos.

## Guias

- [Dark mode](guides/dark-mode.md)
- [Layout avançado](guides/layout-advanced.md)
- [Ícones](guides/icons.md)
- [Gráficos](guides/charts.md)
- [Utilitários de impressão](guides/print.md)
- [Utility API](guides/utility-api.md)
- [Recipes de composição](guides/recipes.md)
- [Forms & Controls](guides/forms-controls.md)
- [Matriz de utilitários](reference/utility-matrix.md)
- [Suporte a navegadores](reference/browser-support.md)
- [Migração para v1](guides/migration-v1.md)
- [Migração de outro framework](guides/migration-external.md)

## Componentes

### Núcleo essencial

[Button](components/button.md) · [Card](components/card.md) · [Alert](components/alert.md) ·
[Badge](components/badge.md) · [Table](components/table.md) · [Input](components/input.md) ·
[Select](components/select.md) · [Checkbox](components/checkbox.md) · [Radio](components/radio.md) ·
[Switch](components/switch.md) · [Navbar](components/navbar.md) · [Dropdown](components/dropdown.md) ·
[Tabs](components/tabs.md) · [Accordion](components/accordion.md) · [Modal](components/modal.md) ·
[Toast](components/toast.md) · [Pagination](components/pagination.md) · [Breadcrumb](components/breadcrumb.md)

### Extensões de interface

[Collapse](components/collapse.md) · [Offcanvas](components/offcanvas.md) · [Tooltip](components/tooltip.md) ·
[Popover](components/popover.md) · [Stepper](components/stepper.md) · [Tag](components/tag.md) ·
[Rating](components/rating.md) · [Segmented Control](components/segmented-control.md) ·
[Empty State](components/empty-state.md) · [Skeleton](components/skeleton.md) ·
[Spinner & Progress](components/progress.md) · [Tile](components/tile.md)

### Recursos avançados

[Combobox](components/combobox.md) · [Datepicker](components/datepicker.md) · [DataTable](components/datatable.md) ·
[Tree View](components/tree-view.md) · [Nested Menu](components/nested-menu.md) ·
[Command Palette](components/command-palette.md) · [Carousel](components/carousel.md) ·
[File Upload](components/file-upload.md) · [Upload avançado](components/file-upload-advanced.md) ·
[Timeline](components/timeline.md)

Cada página de componente segue o contrato editorial: visão geral, anatomia,
variações, estados, acessibilidade, API JS quando aplicável, tokens, exemplo e
limitações. Os exemplos funcionais ficam nos [laboratórios de
`mockup/`](../mockup/README.md); o [`kitchen-sink.html`](../mockup/kitchen-sink.html)
é um smoke test visual e não substitui a referência detalhada de cada seção.

## Referência técnica

- [Design tokens](reference/design-tokens.md)
- [Arquitetura SCSS](reference/scss-architecture.md)
- [Suporte a navegadores](reference/browser-support.md)
- [Matriz de acessibilidade](reference/accessibility-matrix.md)
- [Auditoria de qualidade dos componentes](reference/component-quality-audit.md)
- [Relatório de contraste](reference/contrast-report.md)
- [Baseline de tamanho](reference/size-baseline.json)
- [Definições do projeto](reference/definitions.md)
- [Matriz de utilitários](reference/utility-matrix.md)
- [Estabilidade e roadmap](reference/stability.md)
- [Checklist de release](reference/release-checklist.md)

## Ecossistema, templates e contribuição

Os recursos opcionais do mesmo pacote estão documentados nos guias de
[ícones](guides/icons.md), [theming](guides/theming.md) e
[migração para Fokus Styles](guides/migration-clarus-to-fokus.md). Os templates em [`mockup/templates/`](../mockup/templates)
mostram combinações completas para landing page, autenticação, dashboard e
administração.

Leia o [guia de contribuição](contributing/contributing.md) antes de alterar
SCSS, JavaScript, documentação ou snapshots. Uma mudança pública deve manter
implementação, exemplo, documentação e testes alinhados; `npm run docs:check`
verifica parte desse contrato automaticamente.
