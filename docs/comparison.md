# Fokus Styles vs Bootstrap vs Tailwind CSS

Esta página existe para ajudar quem está avaliando o FokusStyles a decidir com
dados, não com marketing. Os três frameworks resolvem o mesmo problema
(estilizar uma interface web) com filosofias diferentes — nenhum dos três é
estritamente "melhor", e o objetivo aqui é deixar os trade-offs explícitos
para você decidir qual encaixa no seu projeto.

> **Metodologia.** Todo número abaixo é público e reproduzível: versões
> fixadas, arquivos publicados oficialmente (npm/CDN), medidos com o mesmo
> método usado no próprio CI do FokusStyles (`gzip`, nível de compressão 9 —
> ver `scripts/size.mjs`). Onde um dado não pôde ser medido de forma
> justa (caso do Tailwind, explicado abaixo), isso é declarado
> explicitamente em vez de omitido ou estimado. Fontes ao final da página.

## Filosofia e arquitetura

| | Fokus Styles | Bootstrap | Tailwind CSS |
|---|---|---|---|
| Paradigma | Componentes prontos (`.fs-btn`, `.fs-card`...) **+** utilitários atômicos (`.fs-u-*`) | Componentes prontos (`.btn`, `.card`...) + utilitários auxiliares | Utilitários atômicos puros — sem componentes visuais prontos |
| Passo de build obrigatório | Não — CSS/JS prontos via `<link>`/`<script>`, Sass é opcional | Não — CSS/JS prontos via CDN, Sass é opcional | **Sim** — motor JIT precisa escanear seu HTML/JS em build time (CLI ou PostCSS) para gerar as classes usadas |
| JS de componentes incluso | Sim — vanilla JS próprio (dropdown, modal, datepicker, datatable...) | Sim — vanilla JS próprio desde a v5 (antes exigia jQuery) | **Não** — é um framework de CSS puro; qualquer interatividade (abrir modal, dropdown) é responsabilidade do seu próprio JS |
| Motor de cor | Tokens semânticos em OKLCH (`color-mix()`) | Sass `map` + variáveis CSS (sRGB) | Paleta de utilitários fixa (sRGB), customizável via config |
| Tema escuro | Nativo desde o dia 1 — ver seção dedicada abaixo | Nativo desde a 5.3 (2023) | Requer variante `dark:` por utilidade — ver seção dedicada abaixo |
| Alvo de navegador | Moderno (piso Safari/iOS 16.4) — [detalhes](reference/browser-support.md) | Amplo (inclui navegadores mais antigos) | Depende do CSS gerado; suporte amplo por padrão |

## Tamanho de bundle (gzip)

Medido localmente a partir dos arquivos **publicados oficialmente** de
cada projeto (nível de compressão gzip 9, igual ao gate de CI do FokusStyles).

| Distribuição | Arquivo medido | Bruto | Gzip |
|---|---|---:|---:|
| **Fokus Styles** — bundle completo (todos os componentes) | `fokus.min.css` (medido em 2026-07-08) | 115.045 B | **18.607 B** (~18,2 KB) |
| **FokusStyles JS** — bundle completo (todos os componentes) | `fokus.min.js` (medido em 2026-07-08) | 89.458 B | **18.996 B** (~18,6 KB) |
| **Bootstrap CSS** — bundle completo | `bootstrap.min.css@5.3.8` (jsDelivr) | 232.111 B | **30.786 B** (~30,1 KB) |
| **Bootstrap JS** — bundle completo (inclui Popper) | `bootstrap.bundle.min.js@5.3.8` (jsDelivr) | 80.496 B | **23.707 B** (~23,2 KB) |
| **Tailwind CSS** — bundle "completo" | Não existe mais desde a v3 (ver nota) | — | ver nota |

**Nota sobre o Tailwind:** desde a v3 o Tailwind não publica um bundle CSS
fixo — o motor JIT gera só as classes efetivamente usadas no seu projeto, então
"o tamanho do Tailwind" não é uma pergunta com resposta única do jeito que
é para FokusStyles/Bootstrap (comparar um número fixo contra o deles seria
enganoso). Os dois números públicos que o próprio time do Tailwind
divulga, para contexto:

- **Catálogo completo sem purge** (todas as utilidades geradas, cenário
  que não existe em produção): 3.645,2 KB descomprimido / **294,2 KB**
  gzip / 72,8 KB brotli — número da própria documentação da v2 (a v3+ não
  publica mais esse número porque não gera mais um build "completo" por
  padrão).
- **Build de produção típico, já purgado**: "menos de 10 KB, mesmo em
  projetos grandes", segundo a documentação oficial — com o exemplo do
  Netflix Top 10 citado em **6,5 KB**.

Ou seja: o Tailwind tende a ficar **menor** que FokusStyles/Bootstrap em produção
(porque só embarca o que você de fato usa), mas ao custo de exigir um passo
de build por projeto — o número final depende do seu HTML, não é uma
constante do framework.

## Dependências

| | Fokus Styles | Bootstrap | Tailwind CSS |
|---|---|---|---|
| Dependência de runtime | Nenhuma | Nenhuma no CSS; JS de dropdown/tooltip/popover depende do **Popper** (já embarcado em `bootstrap.bundle.js`) | Nenhuma (não há JS de componente) |
| Ferramenta de build necessária | Nenhuma (Sass só se você quiser customizar tokens) | Nenhuma (Sass só se você quiser customizar) | **Sim** — CLI própria ou plugin PostCSS, sempre |
| jQuery | Nunca precisou | Não precisa desde a v5 (precisava até a v4) | Não se aplica (sem JS de componente) |

## Tema escuro nativo

| | Fokus Styles | Bootstrap | Tailwind CSS |
|---|---|---|---|
| Mecanismo | Atributo `data-theme="dark"`, redefine tokens semânticos uma vez — todo componente já herda via `var()` | Atributo `data-bs-theme="dark"` (desde a 5.3), mesmo princípio de redefinição de tokens | Variante `dark:` aplicada **individualmente em cada classe utilitária** (`bg-white dark:bg-gray-800`); por padrão segue `prefers-color-scheme`, alternância manual exige configurar um seletor customizado |
| Custo de adoção | Um atributo, zero JS obrigatório | Um atributo, zero JS obrigatório | Precisa duplicar `dark:*` em cada utilidade tocada pelo tema — sem redefinição central de tokens |
| Toggle pronto | Não fornece um widget de toggle — [guia com o snippet de ~10 linhas](guides/dark-mode.md) | Não fornece um widget de toggle | Não fornece um widget de toggle |

## Suporte a navegadores e features modernas

O FokusStyles mira um alvo deliberadamente mais moderno que o Bootstrap (que
mantém compatibilidade mais ampla). Isso é uma troca real — ver a matriz
completa de feature × navegador mínimo × fallback em
[`reference/browser-support.md`](reference/browser-support.md) em vez de
repetir a tabela aqui.

## Migrando de um para o outro

Já decidiu migrar? [`guides/migration-external.md`](guides/migration-external.md)
tem a tabela de equivalência de classes/componentes e o que não migra 1:1
(API JS, escala de espaçamento, grid flexbox vs. CSS Grid).

## Benchmarks de performance ao vivo

> ⏳ **Pendente de metodologia.** Esta página não inclui benchmarks de
> performance em runtime (tempo de parse/render, Core Web Vitals em uma
> página real, etc.) — não por esquecimento, mas porque um benchmark
> justo desse tipo depende de metodologia controlada (mesmo hardware,
> mesma página de teste, mesma versão de cada framework, sem viés de
> quem escreve o teste) que ainda não foi definida. Preferimos deixar
> isso marcado como pendente a publicar números que pareçam rigorosos
> sem ser.

## Quando cada um costuma encaixar melhor

- **Fokus Styles**: você quer componentes prontos (não só utilitários) e
  dark mode nativo, sem passo de build obrigatório, mirando navegadores
  modernos, e o pacote publicado ligeiramente maior que um Tailwind
  purgado é aceitável em troca de zero configuração.
- **Bootstrap**: você precisa de suporte a navegadores mais antigos que
  o piso do FokusStyles, ou já tem um ecossistema/time acostumado ao
  Bootstrap.
- **Tailwind CSS**: você quer o menor CSS possível em produção e não se
  importa em escrever/ler classes utilitárias longas por elemento, tem
  um passo de build no fluxo do projeto, e prefere montar seus próprios
  componentes (ou usar uma lib de componentes por cima, tipo shadcn/ui).

## Fontes

- [Bootstrap — Introdução (dependência do Popper)](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Bootstrap — Color modes (`data-bs-theme`)](https://getbootstrap.com/docs/5.3/customize/color-modes/)
- `bootstrap@5.3.8` — `dist/css/bootstrap.min.css` e `dist/js/bootstrap.bundle.min.js`, via jsDelivr (medido em 2026-07-08)
- [Tailwind CSS v3 — Optimizing for Production (build típico &lt;10 KB, exemplo Netflix)](https://v3.tailwindcss.com/docs/optimizing-for-production)
- [Tailwind CSS v2 — Optimizing for Production (build completo sem purge)](https://v2.tailwindcss.com/docs/optimizing-for-production)
- [Tailwind CSS — Dark Mode (variante `dark:`)](https://tailwindcss.com/docs/dark-mode)
- [`docs/reference/size-baseline.json`](reference/size-baseline.json) — baseline de tamanho do FokusStyles (medido em 2026-07-07)
