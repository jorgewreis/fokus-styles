# Módulo interno CLI do Fokus Styles

[Site e guias do Fokus Styles](https://styles.fokuscloud.com.br/) ·
[Fokus Cloud](https://www.fokuscloud.com.br/) ·
[GitHub](https://github.com/jorgewreis/fokus-styles) ·
[npm](https://www.npmjs.com/package/fokus-styles)

**CLI opcional no mesmo pacote — não é necessária para usar o núcleo CSS.**

CLI oficial do [Fokus Styles](https://github.com/jorgewreis/fokus-styles) — três
comandos que empacotam ferramentas já usadas internamente pelo framework,
pra qualquer projeto consumidor.

## Instalação

```bash
npm install --save-dev fokus-styles
```

## Comandos

### `fokus build`

Compila um entry-point `.scss` com o mesmo pipeline usado internamente pelo
FokusStyles (Sass → Autoprefixer → cssnano opcional), sem exigir que o
consumidor monte a própria toolchain de build.

```bash
fokus build src/app.scss -o dist/app.css --minify
```

### `fokus theme`

Gera um preset de marca (`data-fs-brand`) em **CSS puro** (`color-mix()`),
pronto pra incluir depois do CSS do FokusStyles — mesma fórmula de mistura usada
em `packages/fokus-core/scss/themes/_brands.scss`, sem dependência de Sass.
Também define `--fs-btn-color`/`--fs-badge-color` automaticamente (escolhe
branco ou preto pelo contraste com a cor primary), evitando a limitação
conhecida de `.fs-btn-primary`/`.fs-badge-primary` documentada em
[`docs/guides/theming.md#multi-brand`](../../docs/guides/theming.md#multi-brand).

```bash
fokus theme acme --primary "#2563eb" -o dist/brand-acme.css
```

### `fokus analyze`

Mostra o tamanho bruto e gzip de um ou mais arquivos CSS/JS — versão
genérica (sem budgets fixos) de `scripts/size.mjs`.

```bash
fokus analyze dist/app.css dist/app.js
```

## Licença

MIT
