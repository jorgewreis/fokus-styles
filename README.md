<div align="center">

# Fokus Styles

**Um framework CSS híbrido — componentes prontos e classes utilitárias atômicas na mesma folha de estilo, com zero dependências em tempo de execução.**

[![npm version](https://img.shields.io/npm/v/fokus-styles.svg)](https://www.npmjs.com/package/fokus-styles)
[![npm license](https://img.shields.io/npm/l/fokus-styles.svg)](LICENSE)
[![CI](https://github.com/jorgewreis/fokus-styles/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jorgewreis/fokus-styles/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fokus-styles.svg)](https://bundlephobia.com/package/fokus-styles)

[Instalação](#instalação) ·
[Por que Fokus Styles](#por-que-fokus-styles) ·
[Componentes](#componentes) ·
[Documentação](#documentação) ·
[Ecossistema Fokus Cloud](#ecossistema-fokus-cloud)

</div>

---

Fokus Styles é um framework CSS open source construído com HTML, CSS e
JavaScript nativo. Nasceu do uso recorrente do autor em projetos pessoais e
profissionais, e é distribuído publicamente como produto para qualquer
desenvolvedor que precise construir interfaces consistentes sem carregar
React, Vue, Angular, jQuery ou qualquer outra dependência de runtime.

> **Status:** `2.6.0`. O Fokus Styles consolida CSS, JavaScript, ícones, React
> e CLI em um único pacote npm. O foco atual é consolidar o núcleo CSS e os componentes
> essenciais antes de ampliar o catálogo. O framework já possui componentes
> avançados, mas eles são tratados como extensões e não definem o caminho
> recomendado para quem está começando. Veja a [política de estabilidade e
> roadmap](docs/reference/stability.md).

Este README é a **visão geral** do projeto. Para aprender a usar cada recurso em
detalhe, com exemplos completos, consulte a **[documentação completa](docs/README.md)**.

## Ecossistema Fokus Cloud

O Fokus Styles é o sistema visual que integra o ecossistema Fokus Cloud. Use
cada fonte conforme o tipo de informação que procura:

- [Fokus Cloud](https://www.fokuscloud.com.br/) — visão geral do ecossistema e
  entrada para os produtos Fokus.
- [Fokus Styles](https://styles.fokuscloud.com.br/) — documentação publicada,
  fundamentos, instalação e guias visuais/interativos de uso.
- [Repositório no GitHub](https://github.com/jorgewreis/fokus-styles) — código-fonte,
  exemplos, decisões técnicas, issues e histórico de mudanças.
- [Pacote no npm](https://www.npmjs.com/package/fokus-styles) — versões publicadas,
  metadados, distribuição e instalação do pacote.

As páginas em `docs/` são a referência versionada junto ao código; os sites
complementam essa referência com conteúdo publicado e exemplos navegáveis.

## Por que Fokus Styles

A maioria dos frameworks CSS obriga você a escolher um lado: componentes
prontos e opinativos **ou** utilitários atômicos e flexíveis. O Fokus Styles
assume os dois de propósito — é essa a filosofia híbrida que orienta toda a
arquitetura do projeto.

| | |
| --- | --- |
| **Híbrido por design** | Componentes prontos (`.fs-btn`, `.fs-card`, `.fs-modal`) e utilitários atômicos (`.fs-u-d-flex`, `.fs-u-mt-3`, `.fs-u-gx-2`) convivem na mesma folha de estilo, com uma convenção de nomes (`fs-`/`fs-u-`/`is-`) que evita colisão entre os dois mundos. |
| **Zero dependências** | Nenhuma dependência de runtime — nem framework JS, nem CDN externo para fontes. HTML, CSS e JavaScript nativo, prontos para colar direto em qualquer página. |
| **Dark mode nativo** | Suporte a tema escuro desde a primeira versão, via CSS Custom Properties e um único atributo (`data-theme="dark"`) — sem plugin, sem JS extra. |
| **Multi-marca** | `data-fs-brand="x"` troca a cor de ação primária em runtime, sem recompilar CSS — combina com `data-theme="dark"` automaticamente (ver [Theming](docs/guides/theming.md#multi-brand)). |
| **Acessibilidade não é opcional** | ARIA, foco e navegação por teclado são parte da API de todo componente interativo desde o início, não um retrofit — e um gate `axe-core` no CI garante isso a cada PR (ver [matriz de acessibilidade](docs/reference/accessibility-matrix.md)). |
| **Curva de aprendizado familiar** | Nomenclatura de classes e grid seguem convenções amplamente adotadas — quem já usou um framework CSS de componentes se sente em casa em minutos. |
| **Customização sem fork** | Toda a identidade visual (cores, espaçamento, tipografia, raios, sombras) é exposta via CSS Custom Properties — sobrescreva sem recompilar. |
| **TypeScript incluso** | `.d.ts` hand-escritos para toda a API JS pública — autocomplete e checagem de tipos sem reescrever nada em TS. |

## Instalação

Via npm:

```bash
npm install fokus-styles
```

Ou direto via CDN (jsDelivr/unpkg), sem instalar nada:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fokus.css">
<script src="https://cdn.jsdelivr.net/npm/fokus-styles/dist/js/fokus.js"></script>
```

O CSS também é distribuído em arquivos separados (`fokus-core.css`,
`fokus-components.css`, `fokus-utilities.css`, `fokus-dark.css`, além de
`layout.css`, `forms.css`, `components.css`, `helpers.css`), e o ponto de entrada Sass está disponível para
compilar com suas próprias variáveis. Detalhes em
[Instalação](docs/getting-started/installation.md) e
[Formas de uso](docs/getting-started/usage.md).

As fontes self-hosted (Plus Jakarta Sans e Source Code Pro) são distribuídas à
parte em `fonts.css`. Inclua-o **antes** do CSS principal para usá-las; sem ele,
a tipografia cai no `sans-serif`/`monospace` do sistema:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fokus.css">
```

## Início rápido

Um componente interativo se inicializa sozinho via `data-fs` — basta incluir
o CSS e o JS e escrever o HTML:

```html
<link rel="stylesheet" href="node_modules/fokus-styles/dist/css/fokus.min.css">

<button type="button" class="fs-btn fs-btn-primary" data-fs="modal" data-fs-target="#meuModal">
  Abrir modal
</button>

<div class="fs-modal" id="meuModal">
  <div class="fs-modal-dialog">
    <div class="fs-modal-content">
      <div class="fs-modal-header">
        <h3 class="fs-modal-title">Título</h3>
        <button type="button" class="fs-btn-close" data-fs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="fs-modal-body">Conteúdo do modal.</div>
    </div>
  </div>
</div>

<script src="node_modules/fokus-styles/dist/js/fokus.min.js"></script>
```

Todo componente interativo compartilha a mesma API (`.show()`, `.hide()`,
`.toggle()`, `.dispose()`, `getInstance()` e eventos DOM `fs:*`). Os
conceitos gerais estão em
[Formas de uso](docs/getting-started/usage.md#api-comum-aos-componentes-interativos).

## Componentes

O caminho recomendado começa pelo núcleo: layout, tokens, formulários,
conteúdo, navegação básica e overlays essenciais. Componentes avançados ficam
disponíveis quando o projeto realmente precisa deles.

- **Núcleo essencial:** containers, grid Flexbox (`.fs-row`/`.fs-col-*`),
  espaçamento, display, tipografia, botões, cards, alertas, badges, tabelas,
  formulários, navbar, dropdown, tabs, accordion, modal, toast, paginação e
  breadcrumbs.
- **Extensões de interface:** Stack, Cluster, Sidebar, Collapse, Offcanvas,
  Tooltip, Popover, Stepper, Input Group, Empty State, Skeleton, Spinner,
  Progress, Tag, Rating e Segmented Control.
- **Componentes avançados:** Combobox, Datepicker, DataTable, Tree View,
  Command Palette, Carousel e Upload avançado.

Cada componente tem um exemplo funcional dedicado (claro + escuro) em
[`mockup/`](mockup) — a forma mais rápida de ver o framework em ação sem
escrever nenhum código. O passo a passo de uso de cada um está na
[documentação de componentes](docs/README.md#componentes). Prefere ver tudo
já montado numa página real? [`mockup/templates/`](mockup/templates) tem 4
templates prontos pra copiar (dashboard, autenticação, landing page e painel
administrativo).

## Customização e dark mode

Todos os tokens visuais são expostos como CSS Custom Properties (prefixo
`--fs-`). Para customizar, redefina a variável no seu próprio CSS — sem
fork, sem recompilar:

```css
:root {
  --fs-color-primary: #6d28d9;
  --fs-radius-md: 10px;
}
```

O dark mode é ativado por um único atributo (`<html data-theme="dark">`), sem
JavaScript obrigatório. Detalhes em [Theming](docs/guides/theming.md)
e [Dark mode](docs/guides/dark-mode.md).

Os tokens de interação também são públicos: foco, duração, curva de transição,
altura e densidade dos controles podem ser ajustados sem alterar classes ou
recompilar o framework. A referência completa está em
[Design tokens](docs/reference/design-tokens.md).

## Integrações no mesmo pacote

`fokus-styles` inclui todos os recursos. Use subpaths somente quando precisar
de uma integração específica:

- `fokus-styles/icons` — ícones SVG Lucide tree-shakeable;
- `fokus-styles/react` — wrappers React para Modal, Dropdown e Tabs;
- `fokus-styles/cli` e o comando `fokus` — build, tema e análise;
- `fokus-styles/scss` e `fokus-styles/js` — fontes Sass e JavaScript vanilla.

## Comparação com outros frameworks

Avaliando o FokusStyles contra outras opções? [FokusStyles vs Bootstrap vs Tailwind
CSS](docs/comparison.md) — filosofia, tamanho de bundle, dependências e dark
mode nativo, com dados públicos e reproduzíveis.

## Documentação

- [`docs/README.md`](docs/README.md) — **documentação completa**: guias de
  uso, um arquivo por componente (anatomia, variações, estados, A11y, API JS,
  tokens, exemplo) e referência técnica.
- [`docs/reference/definitions.md`](docs/reference/definitions.md) — decisões de arquitetura e o
  catálogo técnico de cada componente (classes, tokens, módulos JS).
- [`docs/reference/stability.md`](docs/reference/stability.md) — níveis de
  estabilidade, escopo do núcleo e roadmap de consolidação.
- [`docs/reference/scss-architecture.md`](docs/reference/scss-architecture.md) — arquitetura dos
  módulos SCSS e do pipeline de build.
- [`docs/reference/browser-support.md`](docs/reference/browser-support.md) — alvo de
  navegadores e matriz de compatibilidade por feature moderna.
- [`docs/reference/accessibility-matrix.md`](docs/reference/accessibility-matrix.md) — teclado,
  ARIA e gestão de foco por componente.
- [`docs/reference/contrast-report.md`](docs/reference/contrast-report.md) — auditoria WCAG dos
  tokens de cor nos dois temas.
- [`docs/guides/migration-external.md`](docs/guides/migration-external.md) — migrando de outro
  framework CSS pro FokusStyles.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — como rodar o projeto localmente,
  convenções de contribuição e processo de release.
- [`CHANGELOG.md`](CHANGELOG.md) — histórico de mudanças, seguindo
  [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
  [Semantic Versioning](https://semver.org/lang/pt-BR/).

## Licença

Distribuído sob a licença [MIT](LICENSE) — uso livre em projetos pessoais,
comerciais e comunitários.

---

<div align="center">

Desenvolvido integralmente por **Jorge Wanderley Reis de Menezes** —
[jorgew.reis@outlook.com](mailto:jorgew.reis@outlook.com)

</div>
