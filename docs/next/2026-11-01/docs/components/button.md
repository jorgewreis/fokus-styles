> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Button

Botão de ação com variantes de cor, tamanho, ícone e carregamento.
As cores usam tokens de tema; customizações exigem validação de contraste.

## Visão geral

Button representa uma ação que a pessoa pode executar: salvar um rascunho, abrir um painel ou confirmar uma escolha. A decisão mais importante vem antes da cor: se o resultado é navegar para um endereço, use um link com destino definido pelo aplicativo; se é mudar o estado da tela ou enviar dados, use um botão nativo. O componente fornece a superfície visual, não decide o resultado do clique.

Reserve a variante primária para a ação principal de um contexto e use alternativas neutras ou outline para ações secundárias. A variante danger pode sinalizar consequência destrutiva, mas não implementa confirmação, autorização nem reversão. Escreva um verbo que explique o resultado, como “Excluir rascunho”, em vez de depender apenas de vermelho ou de um ícone. Os exemplos visuais desta página são demonstrações estáticas; suas ações de negócio não estão conectadas.

```html
<button type="button" class="fs-btn">Padrão</button>
<button type="button" class="fs-btn fs-btn-primary">Primary</button>
<button type="button" class="fs-btn fs-btn-outline-primary">Outline</button>
```

Use `<button>` para ações e `<a href>` para navegação. A classe é visual;
aplicá-la a um elemento genérico não fornece semântica ou interação por teclado.

## Anatomia

A classe base organiza conteúdo em linha com alinhamento central e espaçamento entre itens. Texto, ícone decorativo e indicador de carregamento podem dividir o mesmo controle sem wrappers obrigatórios. Se houver um SVG junto do texto, retire o ícone decorativo da árvore acessível; o nome deve vir do texto, não da descrição técnica do desenho.

O estilo mantém o texto em uma linha (`white-space: nowrap`). Em layouts estreitos, rótulos longos podem exigir reorganização do conjunto de ações pelo aplicativo; não há truncamento ou quebra automática específica do componente. Não coloque um link, outro botão ou campo editável dentro do botão: a superfície de ativação deve continuar única.

Um único elemento (`.fs-btn`); nenhuma marcação interna obrigatória. O
botão de fechar (`.fs-btn-close`, usado por Card/Modal/Toast/Tag) é uma
variante separada, sem texto, desenhada só com `::before`/`::after`:

```html
<button type="button" class="fs-btn-close" aria-label="Fechar"></button>
```

## Variações

Tamanho não é sinônimo de importância. Um botão pequeno pode caber em uma tabela, mas deve continuar confortável para a modalidade de entrada e a densidade da tela. Já o modificador de ícone cria uma área quadrada baseada no token de alvo de toque; ele não identifica qual ação o desenho representa. Escolha um nome acessível específico e mantenha a mesma ação reconhecível nos estados normal e ocupado.

O outline usa texto derivado de `--fs-alert-{cor}-text` no repouso e troca para o par sólido no hover/active. Portanto, personalizar somente a cor primária não descreve toda a aparência dessa variante. Compare repouso, foco e interação no tema efetivamente usado, especialmente quando o botão estiver sobre uma superfície diferente da padrão.

- **Cor sólida**: `.fs-btn-primary`, `-secondary`, `-success`, `-warning`,
  `-danger`, `-info` — fundo e texto definidos pelos pares de tokens
  `--fs-color-{cor}` / `--fs-color-on-{cor}`. Overrides de tema precisam
  preservar contraste; não há garantia automática para cores arbitrárias.
- **Cor outline**: `.fs-btn-outline-{cor}` — borda colorida e texto pelo token de alerta correspondente, fundo
  transparente; hover/active preenchem com a cor sólida.
- **Tamanho**: `.fs-btn-sm`, `.fs-btn-lg`; alturas mínimas e paddings vêm
  de `--fs-control-height{-sm|-lg}` e `--fs-control-padding-x{-sm|-lg}`.
- **Só ícone**: `.fs-btn.fs-btn-icon`, com alvo definido por
  `--fs-control-touch-target` e nome acessível obrigatório.

```html
<button type="button" class="fs-btn fs-btn-danger fs-btn-sm">Excluir</button>
<button type="button" class="fs-btn fs-btn-outline-success fs-btn-lg">Aprovar</button>
```

## Estados

`disabled`, `aria-disabled` e `.is-disabled` não são equivalentes funcionais. O atributo nativo impede a ativação de um botão; ARIA comunica indisponibilidade, e a classe apenas seleciona regras visuais. O CSS de `aria-disabled="true"` bloqueia ponteiro, mas não substitui a guarda do handler para outras formas de ativação. A política para links indisponíveis deve ser definida no aplicativo, não inferida pela aparência esmaecida.

Durante uma operação assíncrona, altere o rótulo para comunicar a espera e restaure o estado em sucesso e falha. O spinner é um pseudo-elemento e não anuncia sozinho que uma operação terminou. Preserve o texto de erro ou confirmação fora do botão quando a pessoa precisar consultá-lo depois. A proteção contra reenvio deve existir também na lógica da operação, pois CSS não controla concorrência de requisições.

- **Hover/active**: o botão base usa `--fs-btn-hover-bg` / `--fs-btn-active-bg`;
  a variante primary aplica `brightness(0.98)` / `brightness(0.95)` (escurece discretamente,
  preservando contraste AA do texto nos temas e marcas padrão).
  Outlines preenchem o fundo e trocam a cor do texto.
- **Foco**: anel via `:focus-visible` (mixin `focus-ring`).
- **Desabilitado**: atributo `disabled` (em `<button>`) ou classe
  `.is-disabled` / `aria-disabled="true"` para aparência. Em links, isso não
  substitui prevenção de ativação por teclado/JS: prefira não renderizar um
  link ativo quando indisponível.
- **Carregando**: `.is-loading` ou `aria-busy="true"` desenha spinner e bloqueia
  eventos de ponteiro. Use também `disabled` no botão e proteja a ação contra
  reenvio; remova esses estados após sucesso/erro.

```html
<button type="button" class="fs-btn fs-btn-primary" disabled>Desabilitado</button>
<button type="button" class="fs-btn fs-btn-primary" aria-busy="true" disabled>Salvando…</button>
<button type="button" class="fs-btn fs-btn-icon" aria-label="Adicionar">+</button>
```

## A11y

Em formulários, declare `type="button"` para ações auxiliares e `type="submit"` somente para o envio intencional. Essa escolha evita que um botão de abrir ajuda submeta o formulário por acidente. Não remova o foco apenas para melhorar uma captura visual: o mesmo estado é usado por quem percorre a interface sem mouse. A validação final deve incluir teclado, zoom, temas e o contraste dos pares customizados.

- `<button>` é a tag recomendada para ações (não navegação); use `<a
  href="...">` só quando o clique navega para outra URL.
- Botões só-ícone (sem texto visível) precisam de `aria-label` — o
  framework não injeta um automaticamente.
- Foco visível por padrão; não remova o anel sem substituir por outro
  indicador com contraste equivalente.

## API JS

Nenhuma — 100% CSS.

## Tokens

Os tokens locais de fundo, texto e borda permitem ajustar uma instância sem reescrever layout e tipografia. Os tokens de hover/active participam de uma etapa separada: ao criar uma cor própria, considere também esses estados, ou o botão poderá voltar à superfície neutra durante interação. A cascata e a ordem da folha do aplicativo continuam relevantes; uma declaração local não altera a semântica da variante nem garante contraste.

Componente (`--fs-btn-*`, com fallback pro semântico correspondente —
sobrescrevível por instância sem `!important`):

| Token | Fallback |
|---|---|
| `--fs-btn-bg` | `--fs-color-bg-subtle` |
| `--fs-btn-color` | `--fs-color-text-primary` |
| `--fs-btn-border-color` | `--fs-color-border-default` |

As variantes de cor (`.fs-btn-primary` etc.) sobrescrevem esses três tokens
diretamente, não `background-color`/`color`/`border-color` — ver
[`docs/reference/scss-architecture.md`](../reference/scss-architecture.md#tokens)
para o padrão. Raio: `--fs-radius-sm`.

## Exemplo

```html
<button type="button" class="fs-btn">Padrão</button>
<button type="button" class="fs-btn fs-btn-primary">Primary</button>
<button type="button" class="fs-btn fs-btn-outline-danger fs-btn-sm">Cancelar</button>
<button type="button" class="fs-btn fs-btn-success fs-btn-lg">Confirmar</button>

<style>
  .meu-botao { --fs-btn-bg: #6d28d9; --fs-btn-color: #fff; --fs-btn-border-color: #6d28d9; }
</style>
<button type="button" class="fs-btn meu-botao">Cor custom por instância</button>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-c1bf7aebd768).

## Integração e limites

Não há construtor Button, registro de instâncias, eventos `fs:button:*` ou método `dispose()`. Um componente de aplicação que escute `click` deve remover seu próprio listener quando desmontado, conforme o ciclo de vida adotado. O CSS pode permanecer carregado globalmente; não exige inicialização ao inserir novos botões no DOM.

Ao revisar uma composição, teste a ação real separadamente da aparência: um clique que apenas imprime no console não comprova persistência. Para um botão que abre um modal, o retorno de foco e a dispensa pertencem ao modal. Para um botão que envia formulário, validação e mensagens pertencem ao fluxo de formulário. Essa separação impede atribuir ao Button comportamentos que ele não contém.
