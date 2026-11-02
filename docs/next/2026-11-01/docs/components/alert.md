> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

O trecho a seguir é uma demonstração visual: retry e fechamento exigem handlers da aplicação; `/operacoes/detalhes` é uma rota contratual que o produto deve implementar.

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
      <a class="fs-alert-link" href="/operacoes/detalhes">Ver detalhes</a>
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

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-308bd4200624).

## Escolher uma mensagem que permaneça no contexto

Alert faz sentido quando a informação precisa continuar disponível enquanto a pessoa compreende ou corrige uma situação. Um aviso sobre um formulário incompleto, uma orientação sobre documentos necessários ou um resultado associado a uma seção podem permanecer perto do conteúdo afetado. Toast atende feedback transitório; Alert Dialog pede decisão. Apesar de compartilharem a palavra alerta, esses três componentes têm responsabilidades distintas e não são variações de um mesmo controlador.

O texto deve explicar o que aconteceu e qual é o próximo passo possível. Uma mensagem genérica de erro sem indicação de recuperação frequentemente obriga a pessoa a repetir uma tentativa que continuará falhando. Não transforme o alerta em depósito de mensagens técnicas do servidor: converta a falha para o contexto da tarefa, preservando detalhes técnicos em um local apropriado quando necessários. A cor danger não fornece essa explicação por si só.

## Anatomia como ferramenta de leitura

Um alerta simples pode conter só texto. Use heading e text quando houver uma distinção real entre resumo e explicação; não adicione cabeçalho apenas para ocupar espaço. O nível do heading deve acompanhar a hierarquia da página. A classe fs-alert-heading estiliza o elemento escolhido, mas não corrige uma sequência de títulos semanticamente inadequada. O contêiner content cresce dentro do layout flex, deixando ícone e fechamento com dimensões próprias.

O slot actions acomoda botões e links e permite quebra de linha. Um link leva a uma rota ou a um alvo existente; um botão executa uma ação local conectada pela aplicação. A anatomia acima demonstra apresentação, não implementa Tentar novamente nem Fechar. Substitua a rota de exemplo pelo destino real e conecte o handler antes de apresentar esses controles como disponíveis. Não acrescente data-fs-dismiss esperando que Alert compartilhe o mecanismo de Toast: não existe controlador de fechamento deste componente.

## Variações e estados visuais

As seis variantes semânticas combinam cor de texto, fundo e destaque na borda inicial. Escolha a variante segundo o significado da mensagem, mantendo um vocabulário consistente no produto. Primary ou info podem comunicar orientação; warning pede atenção; danger descreve falha ou risco. Essas escolhas são convenções da interface, não regras de validação que o CSS aplica aos dados.

A classe fs-alert-inline reduz padding, espaçamento e dimensões do ícone para regiões compactas. Ela não associa automaticamente o alerta a um input. Para uma mensagem de campo, a aplicação fornece um ID e o vincula por aria-describedby quando apropriado. O contêiner fs-alert-group apenas organiza várias mensagens em grid com espaçamento; não define prioridades nem une seus anúncios em uma única região acessível.

Aria-busy true e is-loading alteram cursor e opacidade das ações. Não desabilitam botões, não bloqueiam envio duplicado e não iniciam uma operação assíncrona. Se a ação deve ficar indisponível, use o estado nativo do botão e mantenha o modelo da aplicação coerente. Remova o estado ocupado ao concluir ou falhar; um spinner permanentemente ativo comunica trabalho que talvez não exista mais.

## Anúncio e fechamento responsável

Um conteúdo que já está presente no carregamento da página não precisa necessariamente de anúncio urgente. Role alert deve ser reservado para mudanças importantes que precisam ser anunciadas imediatamente; status é mais apropriado para atualizações não urgentes. Não empilhe várias regiões assertivas em uma validação de formulário sem testar o resultado: os anúncios podem competir. O framework não escolhe essa política porque não conhece a urgência da informação.

Remover um alerta não resolve a condição que o originou. Se o usuário fecha uma mensagem sobre uma restrição ainda ativa, mantenha a explicação necessária em outro local ou permita recuperá-la. Quando o botão de fechar tinha foco, defina um destino lógico antes de remover seu nó. Para alertas puramente informativos, pode ser melhor não oferecer dispensa e deixar que desapareçam apenas quando a condição terminar.

## Personalização e limites de integração

O CSS pode ser carregado pelo import de `fokus-styles` no bundler ou pelo arquivo compilado servido pelo aplicativo. Nenhum JavaScript de Alert precisa ser importado, e não existe instância para dispose. Porém, se a aplicação instala handlers em seus botões, ela continua responsável por removê-los na desmontagem. A ausência de controlador não torna esses listeners automaticamente gerenciados pelo framework.

Os tokens locais permitem ajustar densidade sem alterar todas as mensagens da aplicação. Revise em conjunto padding, gap e tamanho do ícone para evitar uma composição desequilibrada. As variantes usam tokens próprios de fundo e texto; trocar só um deles pode reduzir contraste. Forced colors tem regras específicas, mas isso não comprova a legibilidade de toda personalização. Valide textos longos, zoom, links, foco e orientação RTL no contexto final. O CSS oferece apresentação; não sanitiza conteúdo, não executa retry e não armazena a preferência de dispensa.
