# Responsive

## Visão geral

Composições responsivas com `.fs-stack`, `.fs-cluster`, `.fs-stack-md-row`,
`.fs-responsive-media` e `.fs-btn-group-responsive`. Use o CSS completo para
incluir também Button, Button group e Table quando combinados nos exemplos.

## Anatomia e exemplos

Pilha que vira linha a partir de 640px:

```html
<div class="fs-stack fs-stack-md-row" style="--fs-stack-gap: 1rem">
  <label for="busca-contatos">Buscar contatos</label>
  <input id="busca-contatos" type="search">
  <button type="button" class="fs-btn">Buscar</button>
</div>
```

Grupo que quebra em várias linhas conforme o espaço disponível:

```html
<div class="fs-cluster" style="--fs-cluster-gap: .75rem">
  <a href="/contatos">Contatos</a>
  <a href="/processos">Processos</a>
  <a href="/escritorio">Escritório</a>
</div>
<div class="fs-button-group fs-btn-group-responsive" role="group" aria-label="Ações">
  <button type="button" class="fs-btn">Salvar</button>
  <button type="button" class="fs-btn">Cancelar</button>
</div>
```

Tabela rolável sem alterar a semântica das células:

```html
<p id="ajuda-tabela">Se necessário, role horizontalmente para ler todas as colunas.</p>
<div class="fs-table-responsive" tabindex="0" role="region" aria-label="Processos" aria-describedby="ajuda-tabela">
  <table>
    <caption>Processos em acompanhamento</caption>
    <thead><tr><th scope="col">Número</th><th scope="col">Responsável</th></tr></thead>
    <tbody><tr><td>Exemplo 001</td><td>Érica</td></tr></tbody>
  </table>
</div>
```

## Estados e breakpoints

- `.fs-stack`: coluna, gap `--fs-stack-gap` (fallback `--fs-space-3`).
- `.fs-stack-md-row`: linha e itens centralizados a partir de **640px**.
- `.fs-cluster`: flex wrap em qualquer largura, gap `--fs-cluster-gap`
  (fallback `--fs-space-2`). Não requer breakpoint.
- `.fs-btn-group-responsive`: abaixo de 640px, coluna e botões com largura 100%;
  combine com uma base flex como `.fs-button-group`.
- `.fs-responsive-media`: width 100%, height auto, object-fit cover.
- `.fs-table-responsive`: Table fornece overflow-x auto em todas as larguras;
  Responsive o reforça abaixo de 640px. O nome “md” desta classe não deve ser
  interpretado como breakpoint configurável: aqui o SCSS usa 640px literal.

## A11y

A ordem DOM não muda. Teste Tab, leitura, zoom de 200%, textos longos e RTL;
a presença das classes não garante ausência de overflow em qualquer composição.
Dê nome ao contêiner rolável focável e mantenha caption/headers da tabela.
Não esconda informação essencial para caber em telas estreitas.

## Limites e efeitos globais

Este módulo também ajusta Modal/Offcanvas abaixo de 640px (largura, margens,
raio) e bordas de alguns componentes em forced-colors. Não é um grid completo
nem oferece API JS. Revise efeitos ao importar somente partes do framework.

## Verificação

`component-docs-contract.test.js` confere classes, labels e tabela dos exemplos.
Layout, zoom, RTL e rolagem por teclado requerem verificação em navegador.
