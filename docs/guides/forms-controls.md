# Forms & Controls

O Fokus Styles trata campos e controles como elementos semânticos nativos com
uma camada visual consistente. A classe não substitui `label`, `name`,
`value`, validação nativa, ARIA ou o gerenciamento de foco da aplicação.

## Contrato visual comum

`fs-form-control`, `fs-form-textarea`, `fs-form-date` e `fs-form-time` usam os
tokens `--fs-control-*`. As variantes disponíveis são `xs`, `sm`, `lg` e
`xl`; use `md` (sem sufixo) para o tamanho padrão. Os tamanhos não devem ser
usados para esconder mensagens ou reduzir alvos de toque essenciais.

```html
<label class="fs-form-label" for="email">E-mail</label>
<input class="fs-form-control" id="email" name="email" type="email"
       autocomplete="email" aria-describedby="email-help">
<p class="fs-form-text" id="email-help">Usaremos este endereço apenas para contato.</p>
```

Para erro, associe a mensagem ao controle e informe o estado sem depender só
de cor:

```html
<input class="fs-form-control is-invalid" id="cpf" aria-invalid="true"
       aria-describedby="cpf-error">
<p class="fs-invalid-feedback" id="cpf-error">Informe um CPF válido.</p>
```

## Botões

Use `button` para ações e `a` para navegação. `fs-btn-icon` é reservado a
botões com ícone e exige `aria-label` quando não houver texto visível.
`aria-busy="true"` ou `.is-loading` bloqueia a interação e exibe um indicador;
a aplicação deve manter um nome acessível estável.

```html
<button class="fs-btn fs-btn-primary" type="submit" aria-busy="true">
  <span>Salvar</span>
</button>
<button class="fs-btn fs-btn-icon" type="button" aria-label="Fechar">
  <svg aria-hidden="true" viewBox="0 0 24 24">...</svg>
</button>
```

Não use apenas `aria-disabled` em controles que precisam continuar operáveis:
prefira `disabled` em `button` e explique o motivo quando a ação estiver
indisponível.

## Input group

`fs-input-group` pode combinar campo, select, botão e `fs-input-group-text`.
Addons que explicam o campo devem ser referenciados por `aria-describedby`;
ícones decorativos devem ter `aria-hidden="true"`. Use
`fs-input-group-stack-sm` quando o grupo horizontal não tiver espaço suficiente.

## Checkbox, radio e switch

Mantenha o `input` nativo associado a um `label` e use `fieldset`/`legend`
para grupos. O switch visual continua sendo um checkbox nativo; não adicione
`role="switch"` sem também implementar integralmente o contrato de teclado e
estado ARIA.

```html
<fieldset class="fs-form-fieldset">
  <legend>Notificações</legend>
  <div class="fs-switch">
    <input class="fs-switch-input" id="alerts" type="checkbox" name="alerts">
    <label class="fs-switch-label" for="alerts">Receber alertas</label>
  </div>
</fieldset>
```

Estados `is-valid`, `is-invalid`, `aria-invalid` e `:indeterminate` são
visuais; a aplicação continua responsável por definir o valor e o significado
do estado.

## Range

`fs-form-range` preserva o teclado do `input[type="range"]`. Use `output` com
`for` para expor o valor atualizado e, quando o valor tiver uma unidade ou
formatação, use `aria-valuetext` na camada de aplicação. Variantes `xs`, `sm`,
`lg`, `xl` e `fs-form-range-vertical` estão disponíveis.

## Segment control

Use radios com o mesmo `name` para escolha exclusiva e checkboxes para escolha
inclusiva. Botões com `aria-pressed` também são aceitos quando a lógica for
controlada pela aplicação. O controle possui variante vertical e mantém foco
visível no item ativo.

## Date e time

`fs-form-date` e `fs-form-time` são contratos visuais para inputs nativos.
Eles preservam o date/time picker do navegador, localização do sistema e
validação nativa. Use `fs-datepicker` somente quando o produto realmente
precisar de calendário customizado; o componente deve manter `aria-live` no
título, `aria-current="date"` no dia atual, foco de teclado e botões nativos.

## Refinamentos técnicos

- `color-scheme`, `accent-color` e `appearance` são usados como
  melhorias progressivas, com fallback nativo.
- `forced-colors: active` mantém bordas, thumb de range e seleção legíveis.
- A regra `prefers-reduced-motion` reduz o spinner de loading; não remova a
  indicação de que uma operação ainda está em andamento.
- Não aplique truncamento a valores editáveis nem esconda erro, label ou ajuda
  essencial.
- Valide controles em zoom, RTL, teclado, tema escuro e mensagens longas.
