# Alert

Mensagem contextual persistente para informar, confirmar, orientar ou explicar
um erro relacionado à região da página. Alert é CSS-only; para feedback
transitório controlado por JavaScript, use [Toast](toast.md).

## Uso mínimo

```html
<div class="fs-alert fs-alert-success">Operação concluída com sucesso.</div>
```

O uso antigo continua válido. Variantes: `.fs-alert-primary`,
`.fs-alert-secondary`, `.fs-alert-success`, `.fs-alert-warning`,
`.fs-alert-danger` e `.fs-alert-info`.

## Visão geral

Alert permanece visível no contexto da página até que a aplicação resolva a
condição ou faça seu fechamento manual. Não é substituto de Toast nem de
Alert Dialog.

## Anatomia opcional

Os slots abaixo são opcionais. O ícone deve ser decorativo quando o texto já
comunica o estado.

```html
<div class="fs-alert fs-alert-danger" role="alert">
  <span class="fs-alert-icon" aria-hidden="true"><svg class="fs-icon" aria-hidden="true"><!-- ícone --></svg></span>
  <div class="fs-alert-content">
    <h3 class="fs-alert-heading">Não foi possível salvar</h3>
    <p class="fs-alert-text">Verifique os campos destacados e tente novamente.</p>
    <div class="fs-alert-actions">
      <button type="button" class="fs-btn fs-btn-danger fs-btn-sm">Tentar novamente</button>
      <a class="fs-alert-link" href="#detalhes">Ver detalhes</a>
    </div>
  </div>
  <button type="button" class="fs-btn-close fs-alert-close" aria-label="Fechar aviso"></button>
</div>
```

Classes: `.fs-alert-icon`, `.fs-alert-content`, `.fs-alert-heading`,
`.fs-alert-text`, `.fs-alert-actions`, `.fs-alert-link` e `.fs-alert-close`.
O fechamento é apenas composição visual; a aplicação liga sua própria lógica.

Para mensagens relacionadas, use `.fs-alert-group` no contêiner. A variante
`.fs-alert-inline` reduz a densidade para mensagens próximas a campos ou
regiões compactas. Para operações assíncronas, aplique `aria-busy="true"` e
componha um `.fs-spinner` decorativo; o Alert não desabilita ações nem gerencia
o término da operação automaticamente.

## Estados

Não há estados JavaScript próprios. Links, botões e o fechamento visual usam
seus estados nativos de foco, hover e ativação.

## Layout e tokens

O acabamento usa raio médio, borda estrutural neutra e barra semântica em
`border-inline-start`, funcionando em RTL. Textos longos quebram sem overflow
e ações usam flex-wrap em telas estreitas.

Tokens locais sobrescrevíveis: `--fs-alert-padding-block`,
`--fs-alert-padding-inline`, `--fs-alert-gap`, `--fs-alert-radius`,
`--fs-alert-border-width`, `--fs-alert-accent-width`, `--fs-alert-icon-size`,
`--fs-alert-heading-gap` e `--fs-alert-actions-gap`.

```html
<div class="fs-alert fs-alert-danger">Ocorreu um erro ao processar a solicitação.</div>
<div class="fs-alert fs-alert-warning">Atenção: essa ação não pode ser desfeita.</div>
```

## A11y

O framework não injeta ARIA, não cria ícones automaticamente e não move foco.
Use `role="status"` para atualização não urgente e `role="alert"` somente
quando a mensagem precisar ser anunciada imediatamente. O significado deve
continuar compreensível sem cor, ícone ou borda. Ícones decorativos usam
`aria-hidden="true"`; informação adicional precisa de texto equivalente.

Links e botões mantêm foco visível. Para decisão crítica use [Alert Dialog](alert-dialog.md);
para mensagem breve use Toast.

Em `forced-colors: active`, a borda semântica usa as cores do sistema e o
conteúdo continua legível sem depender do fundo tintado.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-alert-{nome}-bg`/`-text` (fundo tintado e texto) e `--fs-color-border`.
Os tokens locais acima permitem ajuste por instância.

## Exemplo

```html
<div class="fs-alert fs-alert-success" role="status">Operação concluída com sucesso.</div>
<div class="fs-alert fs-alert-danger" role="alert">Erro ao salvar as alterações.</div>
```

Mockup: [laboratório do componente](../../mockup/examples/alerts.html).
