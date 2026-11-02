> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Switch

Toggle liga/desliga 100% CSS, sobre um `<input type="checkbox">` nativo —
semanticamente é um checkbox (representa um estado booleano), só a
aparência muda. Knob **retangular arredondado**, não circular — decisão de
design deliberada (o desenho deste componente é retangular arredondado).

## Visão geral

Switch sugere uma preferência binária, como receber notificações ou habilitar uma opção de exibição. O formato de trilho e cursor comunica ligado/desligado, mas o framework não determina se a alteração é salva imediatamente ou somente ao enviar um formulário. Escolha um desses modelos e deixe-o claro no contexto; um controle que parece instantâneo não deveria depender de um botão escondido para efetivar a mudança.

Se a tarefa é selecionar itens de uma lista ou aceitar uma declaração antes de continuar, Checkbox costuma comunicar melhor esse papel. Se há três ou mais estados possíveis, um switch não é suficiente. Não use uma posição visual intermediária para representar uma terceira opção, pois este componente não possui apresentação de indeterminado.

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="notif" checked>
  <label for="notif" class="fs-switch-label">Notificações</label>
</div>
```

## Anatomia

O input nativo deve preceder imediatamente a label. A label desenha o trilho e o cursor em pseudo-elementos, enquanto o input permanece focável usando clipping visual. Uma descrição adicional pode vir depois da label e ser associada por `aria-describedby`, mas não deve separar os dois elementos necessários aos seletores adjacentes.

Com texto visível, o mesmo label funciona como área clicável e nome do controle. Sem texto, mantenha o input com nome acessível e a label associada para preservar a área visual. Evite colocar links ou outras ações dentro dessa superfície de alternância: abrir ajuda não deve inadvertidamente mudar a preferência.

`.fs-switch` (wrapper) > `.fs-switch-input` (oculto via clip) +
`.fs-switch-label` (`<label for="...">`, desenha o trilho via `::before` e
o knob via `::after`, que desliza com propriedades lógicas e `transition`).

## Variações

Os modificadores pequeno e grande são colocados no wrapper e alteram os tokens de geometria. Uma instância customizada pode ajustar trilho e cursor separadamente, mas seus deslocamentos também precisam ser coerentes. Aumentar apenas a largura do trilho não recalcula automaticamente a posição ligada; `--fs-switch-on-offset` é um token explícito.

A cor ligada representa estado, não sucesso de persistência. Em uma preferência salva remotamente, o switch pode refletir uma escolha otimista enquanto uma mensagem separada informa a espera. Não acrescente uma classe inventada de loading ao switch esperando bloqueio ou spinner: use os controles de estado da aplicação e o atributo nativo `disabled` quando necessário.

Tamanho: `.fs-switch-sm`, `.fs-switch-lg` no wrapper.

## Estados

A propriedade `checked` é a fonte de verdade corrente do controle. O atributo `checked` na marcação define a condição inicial; depois de cliques, consulte a propriedade em vez de procurar o atributo. O componente não escreve armazenamento local, preferências de conta ou tema global. Marcar “Tema escuro” só alterna esse checkbox até que a aplicação conecte a escolha a uma ação real.

Ao salvar uma preferência, defina como falhas serão tratadas: reverter a seleção, manter uma alteração pendente ou pedir nova tentativa são decisões distintas. O CSS não escolhe por você. Se bloquear temporariamente o input, preserve o rótulo e uma mensagem de estado, e restabeleça sua disponibilidade também quando a operação falhar.

O erro de validação não substitui o estado ligado/desligado. A borda de erro pode indicar que a configuração não é permitida em conjunto com outra opção, mas a aplicação deve explicar a regra e manter `aria-invalid` coerente. Não mostre apenas uma cor de erro sem instrução de correção.

checked/disabled/foco — mesmo padrão do [Checkbox](checkbox.md). O switch
também possui hover com halo sutil, active com redução discreta do thumb,
valid/invalid opcional para uso em formulário, forced colors e redução de
movimento. O trilho desligado usa superfície neutra e o thumb possui contraste
e elevação próprios. Não há apresentação própria de `indeterminate` no Switch.

## A11y

Prefira um nome estável como “Notificações por e-mail”. Trocar continuamente o nome entre “Ligar notificações” e “Desligar notificações” pode misturar ação e estado na leitura; o checkbox já expõe marcado/desmarcado. A escolha de usar explicitamente `role="switch"` exige verificar a experiência com tecnologia assistiva do produto, pois o framework não injeta nem gerencia esse papel.

O foco aparece sobre a superfície visual enquanto o input está focado. Não remova o input da ordem de Tab em favor de um handler na label: isso perderia a operação por Espaço. Verifique também mudanças de direção do texto, redução de movimento e modo de cores forçadas, sem tratar a presença das regras SCSS como prova de uma auditoria completa.

- `<input type="checkbox">` nativo — `Space` alterna, leitor de tela
  anuncia como checkbox marcado/desmarcado (não há um role "switch" nativo
  em HTML; usar `type="checkbox"` é a escolha correta e amplamente
  suportada — um `role="switch"` explícito é opcional, não aplicado pelo
  framework).
- Quando não houver texto visível ao lado (ex.: dentro de um
  [Tile](tile.md), como no exemplo abaixo), use `aria-label` no `<input>`
  em vez de deixar a `<label>` vazia.
- O Fokus Styles não injeta `role="switch"`: o contrato oficial continua
  sendo o checkbox nativo, com `Space` e anúncio de marcado/desmarcado.

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="s1" aria-label="Ativar tema escuro">
  <label for="s1" class="fs-switch-label"></label>
</div>
```

## API JS

A integração usa eventos e propriedades nativos. Ouvir `change` no input permite ler `checked` e acionar a regra de preferência do aplicativo; não há evento `fs:switch:changed`, registro de instância ou `dispose()` do framework. Ao desmontar a região, remova os listeners próprios ou utilize o cleanup do framework de aplicação.

Um reset de formulário restaura o valor padrão nativo, mas não desfaz automaticamente uma preferência já persistida em servidor. Se a página mistura opções de efeito imediato e opções de envio posterior, defina uma política de cancelamento clara. Essa diferença pertence à experiência do formulário, não aos tokens do trilho.

Nenhuma — 100% CSS.

## Tokens

A tabela distingue geometria, preenchimento, bordas, sombras e interação. Essa separação permite ajustar uma instância sem substituir todos os pseudo-elementos. Ao alterar a cor ligada, confira também a cor do cursor e sua borda; o contraste precisa permitir perceber a posição, não apenas o tom do fundo.

O deslocamento lógico acompanha RTL, mas valores customizados continuam precisando de revisão em ambas as direções. Teste as duas extremidades e o estado active, cuja escala reduz o cursor, antes de considerar a geometria concluída. Uma captura somente no estado ligado não mostra sobreposição ou recorte durante a transição.

| Token | Fallback | Uso |
|---|---|---|
| `--fs-switch-track-width` | `40px` | Largura do trilho |
| `--fs-switch-track-height` | `24px` | Altura do trilho |
| `--fs-switch-thumb-width` | `18px` | Largura do knob |
| `--fs-switch-thumb-height` | `18px` | Altura do knob |
| `--fs-switch-thumb-offset` | `3px` | Posição desligada |
| `--fs-switch-on-offset` | `19px` | Posição ligada |
| `--fs-switch-radius` | `--fs-radius-md` | Raio do trilho |
| `--fs-switch-thumb-radius` | `--fs-radius-sm` | Raio do knob |
| `--fs-switch-gap` | `--fs-space-2` | Distância até o texto |
| `--fs-switch-track-bg` | `--fs-color-subtle` | Fundo desligado |
| `--fs-switch-track-border` | `--fs-color-border-default` | Borda do trilho |
| `--fs-switch-track-checked-bg` | `--fs-color-primary` | Fundo ligado |
| `--fs-switch-thumb-bg` | `--fs-color-surface` | Fundo do knob |
| `--fs-switch-thumb-border` | `--fs-color-border-default` | Borda do knob |
| `--fs-switch-thumb-shadow` | `--fs-shadow-sm` | Elevação do knob |
| `--fs-switch-track-shadow` | Sombra interna sutil | Profundidade do trilho desligado |
| `--fs-switch-hover-ring` | Mistura de primary com transparente | Halo de hover |
| `--fs-switch-hover-shadow` | Halo baseado em `--fs-switch-hover-ring` | Sombra de hover |
| `--fs-switch-active-scale` | `0.92` | Escala do knob durante active |

## Exemplo

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="sw1">
  <label for="sw1" class="fs-switch-label">Desligado</label>
</div>
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="sw2" checked>
  <label for="sw2" class="fs-switch-label">Ligado</label>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-c6c9cce63a6b).
Uso combinado com Tile: [laboratório de conteúdo e dados](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3227cf69396b).
