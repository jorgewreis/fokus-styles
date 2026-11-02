> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Input

Campos de formulário de texto — 100% CSS, sobre elementos nativos
(`<input>`, `<textarea>`, `<select>`). Ver também
[Checkbox](checkbox.md)/[Radio](radio.md)/[Switch](switch.md) para
controles booleanos, e [Select customizado](select.md) para um `<select>`
com dropdown estilizado.

## Visão geral

Use os controles nativos quando a tarefa consiste em digitar, revisar ou escolher um valor simples de formulário. A camada CSS uniformiza a apresentação, enquanto `type`, `name`, `required`, `autocomplete`, `min`, `max` e demais atributos HTML continuam responsáveis pelo contrato nativo aplicável. Um campo bonito sem `name` pode ser editável e ainda assim não integrar a serialização do formulário.

Escolha o tipo pelo dado, não pela aparência: e-mail, senha e busca têm expectativas próprias de teclado, preenchimento e privacidade. Placeholder serve como exemplo breve, não como rótulo permanente. A classe visual não transforma texto livre em uma data validada nem oferece máscara ou normalização. Para calendários customizados e seletores com comportamento adicional, consulte as páginas específicas antes de acrescentar atributos de auto-init.

```html
<div class="fs-form-col">
  <label for="nome" class="fs-form-label">Nome completo</label>
  <input type="text" class="fs-form-control" id="nome" placeholder="Seu nome">
</div>
```

## Anatomia

O rótulo deve permanecer legível quando o valor já estiver preenchido. A composição em coluna organiza rótulo, campo e ajuda sem impor validação. O helper de linha permite quebra e espaçamento entre colunas; não é um sistema de regras de formulário. IDs únicos são necessários quando o mesmo componente de aplicação se repete, para que clicar no rótulo foque o campo certo.

Para texto multilinha, existe também `.fs-form-textarea`: ela define altura automática, mínimo de 96px, padding vertical e redimensionamento vertical. Aplicar apenas `.fs-form-control` a uma textarea reaproveita a base, mas não acrescenta essas regras específicas. Os aliases `.fs-form-date` e `.fs-form-time` compartilham a base visual; o tipo HTML ainda determina o comportamento nativo.

Feedback por combinador de irmãos exige que a mensagem venha depois do elemento com a classe de validação e compartilhe o mesmo pai. Envolver a mensagem em outro contêiner muda essa relação e impede a regra de exibição. A associação por `aria-describedby` é separada: um texto pode estar visualmente perto e continuar sem associação programática.

- `.fs-form-control` — em `<input>`/`<textarea>`.
- `.fs-form-select` — versão estática (sem JS) de um `<select>`
  estilizado visualmente; a seta por `::after` não é garantia de renderização em selects nativos. Para dropdown customizado
  completo, ver [Select](select.md).
- `.fs-form-label` — rótulo (associe via `for`/`id`).
- `.fs-form-text` — texto de apoio, sempre visível.
- `.fs-valid-feedback`/`.fs-invalid-feedback` — texto de apoio que só
  aparece quando o input tem `.is-valid`/`.is-invalid` (via combinador de
  irmãos gerais `~` — precisam estar depois do input no DOM).
- `.fs-form-row`/`.fs-form-col` — helpers de layout (linha/coluna) pra
  organizar label + campo + texto de apoio.

```html
<div class="fs-form-col">
  <label for="email" class="fs-form-label">E-mail</label>
  <input type="email" class="fs-form-control is-invalid" id="email" aria-invalid="true" aria-describedby="email-erro">
  <div class="fs-invalid-feedback" id="email-erro">E-mail inválido.</div>
</div>
```

## Variações

Os modificadores de altura usam tokens de controle, não valores que o aplicativo deva presumir imutáveis. O valor padrão do tema não é um limite universal: alterar tokens ou a distribuição de tema pode mudar a medida. Já as classes `fs-form-size-*` possuem larguras fixas no SCSS; antes de usá-las em telas estreitas, teste se o conjunto com rótulo e ajuda cabe no contêiner.

A folha também inclui `.fs-floating-label`, cuja label é posicionada no topo do wrapper e cujo controle ganha altura e padding próprios. Trata-se de posicionamento CSS, não de um controlador que anima o rótulo conforme o campo fica vazio. Mantenha a associação `for`/`id`; posição visual não cria semântica.

- **Tamanho**: `.fs-form-control-xs`, `.fs-form-control-sm`,
  `.fs-form-control-lg`, `.fs-form-control-xl` (idem para `.fs-form-select`);
  sem sufixo = altura definida por `--fs-control-height`. Tamanhos estão no SCSS; não são opções JS.
- **Largura**: `.fs-form-size-{sm|md|lg|xl|xxl}` — larguras fixas
  (120px–360px) pra campos que não devem esticar 100%.

```html
<input type="text" class="fs-form-control fs-form-control-sm fs-form-size-sm" aria-label="Texto">
```

## Estados

Atributos de disponibilidade devem corresponder ao fluxo de dados. `readonly` preserva a possibilidade de consultar e copiar um valor em tipos que o suportam; `disabled` torna o controle indisponível e altera sua participação no formulário nativo. Uma classe de cor não substitui nenhum dos dois. Explique por que um campo está bloqueado quando isso não for evidente no contexto.

O SCSS também reconhece `aria-invalid="true"`/`"false"` em controles e os pseudoelementos de validade sob `.fs-was-validated .fs-form-control`. Isso muda a borda, mas não produz mensagens. O seletor que mostra `.fs-invalid-feedback` continua dependente de `.is-invalid`; atribuir somente ARIA não faz aparecer automaticamente aquele bloco. Sincronize apresentação, descrição do erro e validação real na aplicação, sem anunciar sucesso antes de efetivamente verificar o valor.

- `:focus-visible` — anel de foco (mixin `focus-ring`).
- `:disabled` — cor muted, fundo sutil, opacidade reduzida.
- `:read-only` — fundo sutil, cursor padrão (não indica edição).
- `.is-valid`/`.is-invalid` — borda verde/vermelha + ativa o
  `.fs-valid-feedback`/`.fs-invalid-feedback` correspondente.

## A11y

No exemplo de e-mail inválido, complete a integração com um ID na mensagem e `aria-describedby` no campo; use também `aria-invalid="true"` quando o erro estiver confirmado. Não comunique falha somente pela borda vermelha. Uma instrução útil explica como corrigir, por exemplo o formato esperado, sem substituir o rótulo.

Verifique o foco por teclado e a leitura das mensagens na ordem do formulário. Um `select` nativo e o Select customizado não possuem exatamente a mesma estrutura de foco; adotar o customizado é uma decisão de interação, não apenas trocar uma classe. A folha básica não injeta atributos ARIA, anúncios live ou resumo de erros.

- Sempre associe `.fs-form-label` ao campo via `for`/`id`.
- Associe o texto de apoio (`.fs-form-text`, `.fs-valid-feedback`) ao
  campo via `aria-describedby` — não é automático (o `id` do texto de
  apoio é definido por você).
- `.fs-form-select` estático não tem teclado/ARIA customizados — é a
  aparência de um `<select>` nativo real, herda tudo do navegador.

## API JS

Nenhuma — 100% CSS. Para o `<select>` com dropdown customizado (JS), ver
[Select](select.md).

## Tokens

A base atual usa diretamente `--fs-control-bg`, `--fs-control-border-color`, `--fs-control-radius`, `--fs-control-height`, `--fs-control-padding-x` e `--fs-control-transition`. Placeholder usa `--fs-control-placeholder-color`; disabled usa `--fs-control-disabled-opacity`. Esses pontos de extensão são mais precisos que sobrescrever todos os campos por seletores globais. Feedback utiliza ainda pares de texto de alerta e `--fs-feedback-success-bg`/`--fs-feedback-danger-bg`.

Ao personalizar um formulário isolado, mantenha os overrides no contêiner apropriado e teste os diferentes tipos utilizados. Algumas interfaces nativas são desenhadas pelo navegador e não ficam integralmente sob controle desses tokens. O tema pode orientar `color-scheme`, mas não promete que popups do sistema operacional terão a mesma aparência em todos os ambientes.

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-color-muted`, `--fs-color-subtle` (disabled/read-only),
`--fs-color-success`/`--fs-color-danger` (validação), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-form-col">
  <label for="senha" class="fs-form-label">Senha</label>
  <input type="password" class="fs-form-control is-valid" id="senha" aria-describedby="senha-ok">
  <div class="fs-valid-feedback" id="senha-ok">Senha forte.</div>
</div>
```

Mockups: [`mockup/forms.html#input`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-03251d5c36b1),
[laboratório de formulários](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-03251d5c36b1).
