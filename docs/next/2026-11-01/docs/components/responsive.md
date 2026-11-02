> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

## Escolha de uma composição responsiva

Este módulo reúne padrões pequenos de layout, não um sistema que redesenha automaticamente qualquer página. Stack organiza uma sequência em coluna; Cluster permite que itens ocupem várias linhas quando faltar espaço; Media preserva a altura natural de uma mídia com largura fluida. Escolha o padrão a partir da relação entre os elementos, em vez de começar por um nome de breakpoint. Um formulário precisa manter labels e campos compreensíveis mesmo quando sua disposição muda.

A ordem do DOM permanece a mesma. A passagem de coluna para linha não deve ser usada para corrigir uma ordem de leitura inadequada no HTML. Escreva os controles na sequência em que devem ser lidos e percorridos por teclado; depois ajuste sua apresentação. Se uma ação aparece antes do campo que modifica apenas por conveniência visual, a reorganização responsiva pode tornar essa inconsistência ainda mais evidente.

## Variações e medidas efetivas

`.fs-stack-md-row` aplica linha e alinhamento central a partir de 640px. O nome contém “md”, mas a regra usa esse valor literal: não deduza outro limite a partir de uma escala externa de breakpoints. O intervalo abaixo de 640px é tratado por regras até 639.98px. A responsividade depende da largura da viewport, não de uma container query que observe a largura de cada card.

Cluster usa quebra flexível em qualquer largura e não espera um evento de JavaScript. Ele é útil para pequenos grupos de links, filtros ou ações cujos comprimentos variam. A quebra não garante que um filho muito largo caiba: um conteúdo com largura mínima rígida ou uma palavra inquebrável pode continuar produzindo overflow. Revise os filhos e não atribua ao contêiner a capacidade de reduzir arbitrariamente qualquer conteúdo.

O grupo responsivo de botões acrescenta regras para coluna e largura total em telas estreitas, mas precisa de uma base de agrupamento coerente. Seus handlers, disponibilidade e estados permanecem os mesmos. No exemplo, os botões ilustram a composição; salvar e cancelar exigem implementação da aplicação. A mudança de largura não define o que cada ação faz nem impede submissão indevida se o tipo do botão estiver incorreto.

## API JS

Não há construtor Responsive, evento de breakpoint ou observador de redimensionamento do framework para essas classes. O CSS reage às media queries. Se a aplicação possui lógica que depende da largura, ela precisa manter essa lógica separada e coerente, sem supor que uma mudança visual dispara automaticamente um evento de componente. Evite duplicar conteúdo só para mostrar duas versões da mesma ação sem controlar foco e leitura.

### Tabelas e mídia

O contêiner de tabela pode permitir rolagem horizontal sem transformar linhas em cards nem retirar a relação entre cabeçalhos e células. Dê à região rolável um nome quando ela for focável e preserve caption, `th` e `scope`. Oferecer rolagem é diferente de esconder colunas: não descarte informação essencial para fazer uma captura parecer mais limpa em uma largura pequena.

A mídia responsiva recebe largura de 100% e altura automática. Ela acompanha a proporção intrínseca, ao contrário de Ratio, que reserva uma proporção escolhida. O `object-fit: cover` não cria sozinho uma altura fixa. Imagens ainda precisam de texto alternativo e de arquivos adequados à resolução; a classe não gera formatos, variantes de resolução ou lazy loading.

## Tokens e efeitos de importação

Os gaps podem ser personalizados por `--fs-stack-gap` e `--fs-cluster-gap`, com fallbacks dos tokens gerais de espaço. Não há tokens locais para tornar o breakpoint variável em runtime. O módulo também altera outros componentes em condições específicas: Modal e Offcanvas recebem ajustes em telas estreitas, e Card, Dropdown, Modal, Offcanvas e Toast recebem borda e remoção de sombra em forced-colors. Isso deve ser considerado ao importar apenas partes do framework.

### Verificação e limites

Teste larguras próximas ao limite, zoom, RTL, textos traduzidos e navegação por Tab. Não há garantia automática de ausência de rolagem horizontal em toda composição. Confira também a direção local de elementos e a ordem das ações após a quebra. Testes de regras podem confirmar os valores literais e a existência dos seletores; a distribuição real, a legibilidade de tabelas e o funcionamento de gestos de rolagem precisam ser observados no navegador com conteúdo representativo.
