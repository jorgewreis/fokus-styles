# Theming

Toda a identidade visual do Fokus Styles é exposta via CSS Custom Properties
(prefixo `--fs-*`) — customize redefinindo a variável no seu próprio CSS,
sem fork e sem recompilar.

## As 3 camadas de tokens

1. **Primitivo** — valores Sass em tempo de compilação
   (`packages/fokus-core/scss/settings/`): `$color-blue-500`, `$radius-md`,
   `$spacers`. Não são emitidos como CSS diretamente; só existem para gerar
   as camadas seguintes.
2. **Semântico** — CSS Custom Properties nomeadas por papel, não por valor
   (`packages/fokus-core/scss/tokens/`): `--fs-color-primary`,
   `--fs-color-bg-surface`, `--fs-color-text-primary`,
   `--fs-color-border-default`. É aqui que você customiza na prática.
3. **Componente** — alguns componentes expõem tokens próprios, com fallback
   pra um token semântico (ex.: `.fs-btn` tem `--fs-btn-bg`/`--fs-btn-color`/
   `--fs-btn-border-color`) — permite sobrescrever **uma instância**
   específica sem afetar o resto:

   ```css
   .meu-botao-especial {
     --fs-btn-bg: #6d28d9;
   }
   ```

Ver [`docs/reference/design-tokens.md`](../reference/design-tokens.md) para
a lista completa de tokens e [`docs/reference/scss-architecture.md`](../reference/scss-architecture.md)
para como as camadas se organizam em `@layer`.

## Customizando globalmente

Redefina o token semântico em `:root` (afeta todos os componentes que o
usam):

```css
:root {
  --fs-color-primary: #6d28d9;
  --fs-radius-md: 10px;
  --fs-font-sans: "Inter", sans-serif;
}
```

Isso funciona em runtime, direto no CSS final — não precisa recompilar o
Sass nem ter acesso ao código-fonte do framework.

## Cores: OKLCH com fallback automático

Os primitivos de cor são gerados em [OKLCH](https://oklch.com/), calibrados
para reproduzir o mesmo matiz do hex histórico do projeto (round-trip
hex→oklch→hex). Cada token de cor é declarado duas vezes:

```css
:root {
  --fs-color-primary: #1a61e6; /* fallback sRGB, todo navegador */
}

@supports (color: oklch(0% 0 0)) {
  :root {
    --fs-color-primary: oklch(53.6% 0.213 261.6deg); /* nativo, navegadores modernos */
  }
}
```

Navegadores sem suporte a `oklch()` ignoram o bloco `@supports` inteiro e
ficam só com o fallback — sem quebra, sem polyfill. Se você **também**
customiza uma cor em OKLCH, recomenda-se o mesmo padrão de dois valores
(fallback + `@supports`) pelo mesmo motivo. Ver
[`docs/reference/browser-support.md`](../reference/browser-support.md).

## Customizando via Sass

Para quem compila o próprio bundle (em vez de sobrescrever CSS em runtime),
os valores primitivos aceitam override na hora do `@use`:

```scss
@use "fokus-styles/scss/fokus" with (
  $radius-md: 10px,
  $font-family-sans: "Inter", sans-serif
);
```

Qualquer variável marcada `!default` nos arquivos de
`packages/fokus-core/scss/settings/` pode ser sobrescrita dessa forma.

## Escala de espaçamento e breakpoints

`$spacers` (0–5, usado pelos utilitários `.fs-u-m*`/`.fs-u-p*`/`.fs-u-g*`) e
`$breakpoints` (`xs`–`xxxl`, usado pelo grid e por todo utilitário
responsivo `.fs-u-*-{breakpoint}`) também são customizáveis via Sass — não têm
equivalente em CSS Custom Property, porque alimentam a geração de classes
(nomes de classe fixos em `.css`, não podem reagir a uma variável em
runtime). Ver [`docs/reference/design-tokens.md`](../reference/design-tokens.md).

## Multi-brand

Além de `data-theme` (claro/escuro), o FokusStyles suporta `data-fs-brand="x"` para
trocar a **cor de ação primária** em runtime, sem recompilar CSS — útil pra
produtos white-label ou múltiplas marcas sobre o mesmo design system:

```html
<html data-fs-brand="violet">
```

```html
<html data-fs-brand="violet" data-theme="dark">
```

Três presets vêm prontos em `packages/fokus-core/scss/themes/_brands.scss`,
provando que a troca funciona combinada com claro e escuro:

- `violet` — o mesmo tom do exemplo de customização acima.
- `corporate` — azul-marinho sóbrio, para aplicações internas/B2B.
- `vibrant` — laranja energético, para produtos de consumo/marketing.

Só a cor de ação primária muda por marca — `secondary`/`success`/`warning`/
`danger`/`info` continuam universais entre marcas, porque são semânticos
(sucesso é sempre verde, erro sempre vermelho, independente de qual marca
está ativa).

Pra adicionar sua própria marca, siga o mesmo padrão do arquivo de exemplo:
um bloco `[data-fs-brand="sua-marca"]` (mais o par `@supports` OKLCH e a
combinação com `[data-theme="dark"]`) redefinindo `--fs-color-primary`,
`--fs-alert-primary-bg`, `--fs-alert-primary-text` e
`--fs-feedback-primary-bg`.

**Limitação conhecida:** `.fs-btn-primary`/`.fs-badge-primary` (preenchimento
sólido) calculam a cor do texto em tempo de build via `color-contrast()` a
partir do primary **padrão** (azul) — não recalculam por marca. Escolha um
primitivo de marca escuro o bastante pro texto branco continuar legível
(como no exemplo `violet`), ou sobrescreva `--fs-btn-color`/`--fs-badge-color`
manualmente se o primitivo da sua marca for muito claro. Rode
`npm run contrast` depois de adicionar uma marca — o relatório já audita os
pares `brand violet`/`brand corporate`/`brand vibrant` como referência
(`scripts/contrast-report.scss`).

## Próximo passo

[Dark mode](dark-mode.md) — como o tema escuro usa a mesma camada de tokens.
