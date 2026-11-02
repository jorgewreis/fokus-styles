> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Tooltip

Rótulo curto que aparece ao passar o mouse ou focar um elemento —
substitui o `title` nativo do navegador (lento, sem estilo, inacessível a
teclado em alguns navegadores).

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="tooltip" title="Copiar para a área de transferência">
  Copiar
</button>
```

O texto vem de `title`, depois `data-title`, depois `options.title` (nessa
precedência). O JS remove somente `title`, evitando o tooltip nativo, e
insere o texto com `textContent`: tags HTML não são interpretadas.

## Anatomia

Gerado inteiramente pelo JS: `.fs-tooltip` (`role="tooltip"`) >
`.fs-tooltip-arrow` + `.fs-tooltip-inner` (texto). Não escreva essa
marcação manualmente — só o elemento de referência com `title`/`data-fs="tooltip"`.

## Variações

`data-placement` (`top` — padrão, `bottom`, `left`, `right`) no elemento
de referência. Reposiciona automaticamente se não couber. A posição efetiva
fica em `data-placement` no Tooltip gerado.

Também são aceitos alinhamentos compostos, como `top-start`, `top-end`,
`bottom-start`, `bottom-end`, `left-start` e `right-end`. A forma manual
equivalente é `{ placement: "top", align: "start" }`. Use `data-offset` ou
`offset` para controlar a distância entre o gatilho e a dica.

```html
<button type="button" class="fs-btn" data-fs="tooltip" data-placement="right" title="Mais opções">⋮</button>
```

## Estados

`.is-open` — controlado pelo JS ao mostrar/esconder; não defina
manualmente.

### Delays e touch

Use `data-show-delay` e `data-hide-delay` para evitar abertura acidental:

```html
<button type="button" data-fs="tooltip" data-show-delay="300" data-hide-delay="100"
  title="Ajuda complementar">Ajuda</button>
```

O Tooltip também responde a foco e ponteiro. Em touch, toque fora fecha a dica.
Escape fecha sem mover o foco. Tooltips concorrentes são fechados quando uma
nova dica é aberta.

Sem configuração, a abertura é imediata; use `data-show-delay` para evitar
aberturas acidentais em interações com ponteiro. O foco de teclado abre
imediatamente. Elementos `disabled` não
recebem foco nem eventos nativos: envolva-os em um elemento focável quando
precisar explicar seu estado.

## A11y

O JS aplica `aria-describedby` no elemento de referência, apontando pro
`id` do tooltip — leitor de tela anuncia o conteúdo ao focar o elemento.
Mostra em `pointerenter`/`focus`, esconde em `pointerleave`/`blur`/`Escape` —
funciona por mouse e por teclado igualmente (ao contrário do `title`
nativo, que só mostra no hover).

## API JS

Auto-init via `data-fs="tooltip"` **ou** instanciação manual
(`new FokusStyles.Tooltip(el, { title, placement })` — útil quando o texto vem
de outro lugar, não de um atributo estático; é assim que
[Breadcrumb](breadcrumb.md) anexa tooltips a labels truncados).
`Tooltip.getInstance(el)`.

As opções do construtor são capturadas na inicialização:

| Opção | Atributo / padrão e precedência |
|---|---|
| `title` | Texto usado somente quando `title` e `data-title` estão ausentes; consulte a ressalva sobre atributos vazios abaixo. |
| `placement` | Opção, depois `data-placement`, depois `"top"`; aceita as posições e combinações tipadas descritas acima. |
| `align` | Opção, depois `data-align`, depois alinhamento da posição composta ou `"center"`. |
| `offset` | Opção, depois `data-offset`; padrão 8 pixels. |
| `showDelay` | Opção, depois `data-show-delay`; padrão 0 milissegundos. |
| `hideDelay` | Opção, depois `data-hide-delay`; padrão 0 milissegundos. |

Para offset/delays, valores vazios, negativos ou não finitos voltam ao padrão;
números finitos não negativos, inclusive zero, são aceitos. Opções não nulas
têm precedência sobre atributos. Foco/toque de abertura ignoram `showDelay`,
e `show()`/`hide()` diretos não aguardam esses timers de interação.

| Método | Descrição |
|---|---|
| `show()` | Mostra o tooltip, posicionado relativo à referência. |
| `hide()` | Esconde. |
| `toggle()` | Alterna. |
| `dispose()` | Remove listeners e a caixa do tooltip, restaura o `aria-describedby` original e desregistra a instância. |

| Evento (no elemento de referência) | Cancelável | Quando |
|---|---|---|
| `fs:tooltip:shown` | Não | Depois de mostrar. |
| `fs:tooltip:hidden` | Não | Depois de esconder. |

## Tokens

`--fs-tooltip-bg`, `--fs-tooltip-text`, `--fs-radius-sm`.

O componente também expõe tokens locais como `--fs-tooltip-max-width`,
`--fs-tooltip-padding-block`, `--fs-tooltip-padding-inline`,
`--fs-tooltip-radius`, `--fs-tooltip-shadow` e `--fs-tooltip-arrow-size`.
Eles podem ser sobrescritos por instância sem alterar tokens globais.

## Exemplo

```html
<button type="button" class="fs-btn-close" data-fs="tooltip" title="Fechar" aria-label="Fechar"></button>
```

O Tooltip não deve conter links ou botões e não substitui label, texto de erro
ou instrução essencial; nesses casos use conteúdo visível ou Popover.

Quando o gatilho já possui `aria-describedby`, o Tooltip acrescenta somente o
próprio ID e restaura a lista original ao executar `dispose()`.

Mockup: [laboratório independente do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-93f16136704e).

### Precedência e reinicialização

Um `title=""` existente não cai para `data-title` ou `options.title`: gera erro
de texto ausente. O mesmo vale para `data-title=""` quando title não existe.
Ao usar `options.title`, remova atributos conflitantes. Não há opção `html`.

`dispose()` restaura o `aria-describedby` original, mas não restaura `title`.
Para recriar uma instância que tinha apenas title, forneça novamente o texto
por atributo ou opção; não suponha que `new Tooltip(el)` continuará funcionando
após o primeiro dispose. `data-title` não é removido pelo componente.

## Decidir o que cabe em uma dica

Tooltip acrescenta uma explicação curta a um controle que já é compreensível e operável sem ela. Pode esclarecer uma abreviação ou detalhar o efeito de um comando, mas não deve ser o único local que informa um requisito de formulário. Quem navega por toque ou usa ampliação pode não encontrar a mesma sequência de hover observada no desktop. Mantenha instruções essenciais no fluxo da página e use a dica como informação complementar.

Um botão com apenas um ícone ainda precisa de nome próprio, por exemplo aria-label. `aria-describedby` acrescenta uma descrição, não substitui o nome da ação. Evite repetir mecanicamente o mesmo texto em label, aria-label e dica: isso pode produzir anúncios redundantes. Para um comando “Copiar”, a dica pode explicar o objeto copiado, enquanto o texto do botão identifica a ação. O componente não implementa a cópia nem verifica a disponibilidade da área de transferência.

## Dois elementos com proprietários diferentes

O aplicativo fornece a referência; a biblioteca fornece a caixa, o texto e a seta. O tooltip existe no DOM desde a construção, embora comece fechado. Ele é montado por portal no contexto apropriado do acionador. Não procure a caixa obrigatoriamente como filha do botão e não mova seus nós manualmente: isso pode quebrar posicionamento, tema e limpeza. Para encontrar uma referência acessível no teste, use o ID acrescentado a aria-describedby.

A caixa gerada recebe role tooltip e texto literal por textContent. Uma string com tags não vira conteúdo rico. Se precisar de links, uma lista de ações ou de um botão, escolha Popover ou conteúdo visível: Tooltip não transfere foco para a caixa nem oferece navegação interna. Sua ausência de focus trap é intencional; ele descreve o elemento que já possui foco.

## Posicionamento e configurações capturadas

A posição desejada é uma preferência, não uma coordenada garantida. O motor calcula alternativas quando a caixa não cabe e acompanha mudanças de posição enquanto está aberta. Isso não torna qualquer texto longo legível: uma dica que exige leitura de vários parágrafos provavelmente está modelada no componente errado. Confira os extremos da viewport, controles em áreas roláveis e zoom antes de fixar uma direção nos testes visuais.

As posições compostas separam lado e alinhamento. `bottom-start`, por exemplo, pede o lado inferior com alinhamento inicial; uma opção align explícita tem precedência sobre o alinhamento derivado. Os atributos do gatilho configuram a intenção, enquanto o atributo data-placement da caixa gerada reflete o lado calculado. Não escreva CSS que dependa de o lado solicitado ser sempre o efetivo.

Texto e opções são lidos na construção. Mudar title depois não equivale a atualizar a instância, e pode até reintroduzir a dica nativa do navegador. Não há método público setTitle. Para trocar uma descrição de forma previsível, descarte a instância, forneça novamente o texto e crie outra depois que o novo conteúdo estiver disponível. Em TypeScript, use somente as propriedades e opções declaradas; referências internas à caixa e timers não são API pública garantida.

## Integração sem listeners duplicados

Os exemplos declarativos exigem CSS e JavaScript da mesma distribuição. Em bundler, importe `fokus-styles` para estilos e `Tooltip` de `fokus-styles/js` se precisar controlar a montagem manual. Com o IIFE servido pelo aplicativo, use `FokusStyles.Tooltip`. Depois de inserir a referência, consulte getInstance antes de construir manualmente; uma montagem declarativa já pode ter criado o controlador. Não há getOrCreateInstance tipado nesta classe.

Hover usa os delays configurados; foco abre imediatamente para não esconder informação de quem percorre controles por teclado. Sair e entrar rapidamente limpa timers pendentes. Chamadas diretas show e hide são imediatas em relação a esses atrasos de interação, mas não garantem que o navegador tenha concluído pintura e reposicionamento. Os eventos shown e hidden propagam no acionador e não são canceláveis. Eles indicam mudança do componente, não conclusão da ação que o botão executa.

No toque, pointerdown abre imediatamente e outro toque no mesmo acionador pode fechar a dica; toque externo também fecha. Esse comportamento não substitui um botão de ajuda persistente quando a informação precisa ficar disponível. O controlador também fecha a dica anterior ao abrir outra, portanto não use vários tooltips como uma legenda simultânea de campos. Para essa necessidade, renderize descrições visíveis associadas aos respectivos inputs.

## Tema e ciclo de vida

Os tokens locais de largura, padding, raio, sombra e seta descrevem a caixa, não uma API de conteúdo. O contexto de tema é aplicado ao painel no portal; personalizações dependentes exclusivamente de uma relação CSS pai-filho com o botão podem deixar de valer. Verifique o seletor e o elemento efetivamente estilizado antes de concluir que um token não funciona. Um fundo customizado exige revisar legibilidade do texto e da seta, inclusive em temas alternativos.

Dispose fecha, cancela timers, remove listeners da referência e do documento, remove a caixa e restaura o aria-describedby capturado inicialmente. Isso significa que alterações posteriores feitas por outra integração nesse atributo podem ser sobrescritas no descarte; organize um proprietário claro para a composição das descrições. O title original não é restaurado. Se quiser voltar ao comportamento nativo, a aplicação deve recolocá-lo deliberadamente, depois do descarte.

Uma auditoria DOM pode comprovar texto literal, vínculo por ID e remoção de nós. Não comprova contraste, ausência de recorte, tempo confortável de leitura ou anúncio consistente por leitor de tela. Inclua foco visível, Escape, entrada e saída rápida de ponteiro e contexto dentro de Modal nos testes do aplicativo; a dica deve continuar complementar mesmo quando uma dessas formas de interação não estiver disponível.
