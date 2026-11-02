> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Radio

Radio button 100% CSS, mesma técnica do [Checkbox](checkbox.md) — sobre um
`<input type="radio">` nativo. Seu indicador circular distingue visualmente a escolha exclusiva.

## Visão geral

Radio representa uma escolha exclusiva entre alternativas conhecidas. Ele é especialmente útil quando comparar as opções lado a lado ajuda a decidir, como mensal ou anual. Ao contrário do checkbox, selecionar uma alternativa do mesmo grupo desmarca a anterior. Essa exclusividade vem do HTML nativo, não da proximidade visual dos wrappers.

Defina um `name` consistente para todas as opções do mesmo conjunto e nomes distintos para perguntas independentes. Dois grupos visualmente separados com o mesmo nome e pertencentes ao mesmo contexto de formulário podem interferir entre si. Os valores enviados também precisam ser distintos: `value="mensal"` e `value="anual"` comunicam a decisão; IDs apenas associam labels e não substituem os valores do formulário.

```html
<div class="fs-radio">
  <input type="radio" name="periodo" class="fs-radio-input" id="dia" checked>
  <label for="dia" class="fs-radio-label">Dia</label>
</div>
<div class="fs-radio">
  <input type="radio" name="periodo" class="fs-radio-input" id="semana">
  <label for="semana" class="fs-radio-label">Semana</label>
</div>
```

Radios do mesmo grupo compartilham `name` — seleção exclusiva é
comportamento nativo do `<input type="radio">`, sem JS.

## Anatomia

Cada opção tem um wrapper próprio e um par input/label. O input deve vir imediatamente antes da label porque os seletores de checked, disabled e foco usam adjacência. Uma legend pode nomear todo o conjunto por meio de um fieldset externo; não a insira entre o input e sua label. O círculo e o ponto são pseudo-elementos, e não nós adicionais que precisem de registro JavaScript.

A ocultação visual do input preserva sua função nativa. Trocar essa técnica por `hidden` ou `display: none` remove a base de interação que o estilo pressupõe. Se os rótulos forem longos, confira a quebra de linha e a associação entre o indicador e o texto, especialmente em listas com descrições de planos.

`.fs-radio` (wrapper) > `.fs-radio-input` (oculto via clip) +
`.fs-radio-label` (`<label for="...">`, desenha o círculo via `::before` e
o ponto interno via `::after`).

## Variações

Os tamanhos pequeno e grande mudam a escala visual da opção, mas não mudam quantas escolhas são permitidas. Coloque o modificador no wrapper `.fs-radio`, mantendo a mesma escala dentro de uma pergunta quando não houver razão explícita para diferença. A disposição horizontal ou vertical das opções pertence ao layout que contém os wrappers; não há uma opção JavaScript de orientação.

O token de raio usa 50% para distinguir a escolha exclusiva. Alterá-lo pode ser tecnicamente possível sem mudar o comportamento, mas cria uma forma menos reconhecível. Antes de personalizar a geometria, considere o custo de aprendizagem: o círculo já comunica uma convenção que o usuário conhece.

Tamanho: `.fs-radio-sm`, `.fs-radio-lg` no wrapper.

## Estados

Um grupo pode começar sem seleção, se a pergunta exigir uma decisão explícita, ou com uma alternativa padrão indicada por `checked`. Não marque várias opções do mesmo grupo como solução para um estado misto: radio não possui essa semântica. A propriedade `checked` é o estado corrente consultável pelo aplicativo, enquanto o atributo do HTML representa a configuração inicial.

A indisponibilidade deve ser individual quando apenas uma alternativa não puder ser escolhida. Use `disabled` no input e explique o motivo quando isso ajudar a decisão. A aparência desabilitada não é controle de autorização: valide a escolha recebida na camada responsável pelos dados, pois qualquer formulário pode ser alterado fora da interface.

Classes de validade e atributos ARIA reconhecidos pelo CSS coloram o indicador, mas não determinam que a pergunta foi respondida corretamente. O erro pode pertencer ao grupo, como “Escolha um período”, sem significar que cada alternativa em si é inválida. Organize a mensagem junto da pergunta e associe-a aos controles relevantes.

- **checked**, **disabled**, validação (`.is-valid`/`.is-invalid`) e foco —
  mesmo conjunto de seletores compartilhados de [Checkbox](checkbox.md),
  incluindo a ressalva sobre tokens de superfície disabled. Não existe `indeterminate` para
  radio.
- Hover e active também alteram a superfície do círculo vazio e selecionado.
- O controle acompanha `dir="rtl"`, `prefers-reduced-motion` e
  `forced-colors: active`.

## A11y

A navegação por setas deve ser testada no navegador real, incluindo entrada no grupo sem seleção e com uma opção disabled. O CSS não instala handlers de teclado; detalhes da primeira parada de Tab podem depender do navegador e da direção de navegação. Evite forçar um `tabindex` positivo ou adicionar um segundo sistema de setas sobre os radios nativos.

O texto da legend contextualiza opções curtas como “Dia” e “Semana”. Sem essa pergunta, a alternativa isolada pode não explicar o que será alterado. Use IDs únicos ao repetir o componente em linhas ou cartões, para que o clique na label nunca selecione uma opção de outra região.

- `<input type="radio">` nativo com `name` compartilhado — `ArrowUp`/
  `ArrowDown`/`ArrowLeft`/`ArrowRight` movem a seleção **dentro do grupo**
  automaticamente (comportamento do navegador, não do framework).
  `Tab`/`Shift+Tab` entram/saem do grupo conforme o comportamento nativo;
  confira a parada inicial sem seleção nos navegadores suportados.
- Sempre associe `label` via `for`/`id`.
- Agrupe opções relacionadas com `fieldset`/`legend` e associe instruções ou
  erros por `aria-describedby`.

## API JS

Para observar a escolha, escute o evento nativo `change` e consulte o valor do radio selecionado. Isso é código do aplicativo, não um evento `fs:radio:*`. Não é necessário chamar inicialização após inserir uma nova opção; a associação nativa e o CSS passam a valer quando o markup está no documento.

Se a aplicação renderiza os radios de forma controlada, derive checked do estado central e mantenha o nome do grupo estável. Atualizações programáticas não devem ser confundidas com eventos de usuário: atribuir uma propriedade não promete disparar automaticamente o handler de `change`. O cleanup limita-se aos listeners que sua aplicação criou.

Nenhuma — 100% CSS.

## Tokens

Tamanho externo e tamanho do ponto são tokens separados. Alterá-los de forma desproporcional pode fazer a seleção desaparecer visualmente ou ocupar quase todo o círculo. O gap controla a distância entre indicador e texto; não use margens arbitrárias na label para corrigir uma combinação que deveria ser resolvida por esse token.

O contraste do indicador deve ser avaliado tanto no repouso quanto selecionado. A implementação compartilha estados e preferências do sistema com Checkbox/Switch, mas o componente final ainda depende do tema, fundo e escala de texto do aplicativo. Testes DOM comprovam exclusividade e associação, não aparência ou leitura por tecnologia assistiva.

| Token | Fallback | Uso |
|---|---|---|
| `--fs-radio-size` | `18px` | Círculo externo |
| `--fs-radio-dot-size` | `8px` | Ponto selecionado |
| `--fs-radio-radius` | `50%` | Forma circular |
| `--fs-radio-gap` | `--fs-space-2` | Distância até o texto |

## Exemplo

```html
<div class="fs-radio">
  <input type="radio" name="plano" class="fs-radio-input" id="p1" checked>
  <label for="p1" class="fs-radio-label">Mensal</label>
</div>
<div class="fs-radio">
  <input type="radio" name="plano" class="fs-radio-input" id="p2">
  <label for="p2" class="fs-radio-label">Anual</label>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-c6c9cce63a6b).
