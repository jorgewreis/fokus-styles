> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Popover

Painel flutuante com conteúdo rico (header/body/footer, pode conter
elementos interativos) — mesmo posicionamento do [Tooltip](tooltip.md),
aparência de card de superfície em vez do chip escuro.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#meu-popover">
  Mais informações
</button>
<div class="fs-popover" id="meu-popover">
  <div class="fs-popover-header">Título</div>
  <div class="fs-popover-body">Conteúdo detalhado aqui.</div>
</div>
```

## Anatomia

Gatilho (qualquer elemento) + `.fs-popover` > `.fs-popover-header`
(opcional) + `.fs-popover-body` + `.fs-popover-footer` (opcional). Slots
aditivos incluem `.fs-popover-icon`, `.fs-popover-heading`,
`.fs-popover-title`, `.fs-popover-meta`, `.fs-popover-text` e
`.fs-popover-close`. A seta (`.fs-popover-arrow`), quando fornecida no HTML, é posicionada junto ao painel.

## Variações

- **Posicionamento**: `data-placement`/`data-align` no gatilho — mesma
  convenção do [Dropdown](dropdown.md).
- **Gatilho**: `data-trigger` no elemento gatilho —
  `click` (padrão), `hover` (com pequeno atraso ao sair, pra dar tempo de
  mover o mouse até o popover), `focus` (mostra ao focar, some ao perder
  foco pra fora do trigger+popover). O runtime também reconhece `manual`,
  mas esse valor não está na união pública `PopoverOptions.trigger`.
- **Hover Card**: `.fs-popover-hover-card` — não é um componente
  separado, é este mesmo Popover com `data-trigger="hover"` e um
  modificador visual (mais largo, corpo em linha) pra conteúdo tipo
  avatar + bio.

```html
<a href="/pessoas/jorgewreis" data-fs="popover" data-fs-target="#hc-1" data-trigger="hover">@jorgewreis</a>
<div class="fs-popover fs-popover-hover-card" id="hc-1">
  <div class="fs-popover-body">
    <img src="avatar.jpg" alt="" width="40" height="40">
    <div>
      <strong>Jorge Reis</strong>
      <p>Mantenedor do Fokus Styles.</p>
    </div>
  </div>
</div>
```

## Estados

`.is-open` — controlado pelo JS. Escape, clique externo (trigger click) e
`data-fs-dismiss="popover"` fecham conforme o tipo de gatilho. Popover não é
modal: não bloqueia scroll nem cria focus trap.

## A11y

`role="dialog"` + `aria-modal="false"` no popover, `aria-controls`/
`aria-expanded` no gatilho (JS aplica automaticamente). Com
`data-trigger="click"` (padrão): `Escape` fecha e devolve foco ao gatilho;
clique fora fecha. Um elemento dentro do popover com
`data-fs-dismiss="popover"` fecha ao ser clicado (útil pra um botão "OK"
no footer).

Ao abrir outro Popover, o painel anterior é fechado para evitar sobreposição.
O posicionamento testa alternativas quando o lado solicitado não cabe na
viewport, e a seta acompanha o alinhamento do gatilho. Para conteúdo carregado
de forma assíncrona, use `aria-busy="true"` e componha um `.fs-spinner` com
texto de carregamento.

## API JS

Auto-init via `data-fs="popover"`. `Popover.getInstance(el)` (`el` é o
**gatilho**).

| Método | Descrição |
|---|---|
| `show()` | Abre, posiciona, ativa fechamento por clique fora (só no trigger `click`). |
| `hide()` | Fecha. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners e devolve o painel ao pai e posição originais; não o destrói. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:popover:shown` | Não | Depois de abrir. |
| `fs:popover:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (header),
`--fs-color-text`, `--fs-radius-md`, `--fs-shadow-md` e os tokens locais
`--fs-popover-width`, `--fs-popover-max-width`, `--fs-popover-padding-block`,
`--fs-popover-padding-inline`, `--fs-popover-gap`, `--fs-popover-radius`,
`--fs-popover-shadow`, `--fs-popover-icon-size`, `--fs-popover-heading-gap`,
`--fs-popover-footer-gap`, `--fs-popover-arrow-size` e
`--fs-popover-border-width`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#confirmar-envio">
  Enviar
</button>
<div class="fs-popover" id="confirmar-envio">
  <div class="fs-popover-header">Confirmar envio?</div>
  <div class="fs-popover-body">Não será possível editar depois de enviado.</div>
  <div class="fs-popover-footer">
    <button type="button" class="fs-btn fs-btn-sm" data-fs-dismiss="popover">Cancelar</button>
    <button type="button" class="fs-btn fs-btn-primary fs-btn-sm">Confirmar</button>
  </div>
</div>
```

Mockup: [laboratório independente do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-717fdc655e9c).

### Segurança, teclado e modos de gatilho

Popover usa o DOM já existente em `data-fs-target`; não recebe nem sanitiza
strings HTML. Inserir conteúdo não confiável nesse DOM é responsabilidade da
aplicação. `placement`, `align` e `trigger` são as opções lidas; não existe
opção `html`, `content` ou `offset` (a distância interna é 10px nesta versão).

No modo hover os listeners são apenas de mouse: foco de teclado não abre o
painel. Não use conteúdo essencial ou interativo disponível somente por hover;
prefira click/focus e forneça um nome acessível ao diálogo (`.fs-popover-header`
ou `aria-label`). O exemplo de Hover Card é complementar e precisa de uma
alternativa acessível e um destino real em vez de `href="#"` na aplicação.

`data-trigger="manual"` é reconhecido em runtime, mas não é uma opção tipada.
Nesse modo não há listener automático de Escape nem clique fora: a aplicação
precisa controlar abertura, fechamento e foco. O botão `data-fs-dismiss` ainda
é atendido. Não é equivalente ao modo click com abertura programática.

## Conteúdo complementar, não uma segunda página

Popover apresenta uma pequena região relacionada ao acionador sem bloquear toda a interface. É apropriado para ajuda contextual mais extensa que uma dica, detalhes de um item ou controles compactos. Não equivale a Modal: a pessoa pode continuar navegando na página e não há contenção do foco. Quando a tarefa precisa obrigatoriamente ser concluída ou cancelada antes de retornar ao contexto anterior, considere um diálogo modal em vez de aumentar progressivamente o popover.

Escolha click para uma abertura intencional acessível por botão. Focus serve quando o conteúdo acompanha a entrada de foco e deve permanecer durante a passagem para o painel. Hover Card é uma apresentação complementar, não um substituto acessível de um perfil ou de uma página de detalhes. Um link de perfil deve ter endereço real; o exemplo usa uma rota de contrato da aplicação que precisa existir no produto. No modo click, o handler cancela a navegação padrão do acionador, então prefira um botão quando a finalidade for somente abrir o painel.

## Estrutura sem geração de conteúdo

O seletor data-fs-target deve encontrar um painel já existente. A biblioteca não gera automaticamente header, corpo, footer ou seta, e não interpreta uma opção content. O aplicativo é dono dessa árvore e precisa inserir conteúdo seguro antes de inicializar. A classe fs-popover-arrow oferece a apresentação da seta quando seu elemento for fornecido; o simples uso de data-placement não cria esse nó.

O header é usado para estabelecer aria-labelledby e recebe um ID quando necessário. Um descendente fs-popover-text também pode fornecer aria-describedby. Se não houver header, forneça um nome acessível explícito; role dialog sozinho não diz qual informação está sendo apresentada. Evite colocar muitos controles dentro do header usado como nome, pois o nome deve identificar o painel com clareza e não reproduzir ações desconexas.

Os slots de título, metadados e ícone permitem organizar informações sem mudar o contrato de abertura. Footer é um local de composição visual: um botão Confirmar sem handler não confirma envio nem salva alterações. O exemplo de confirmação nesta página é uma demonstração estrutural. Para uma ação real, conecte lógica própria e chame hide somente quando o fluxo permitir; data-fs-dismiss fecha imediatamente e não espera respostas assíncronas.

## Foco e fechamento conforme o gatilho

Abrir não move automaticamente o foco para o primeiro controle do painel. Como existe um portal, a posição dos controles na sequência do DOM pode diferir da posição em que o painel foi escrito. Teste o percurso por Tab e, quando sua interação pedir foco inicial dentro, gerencie-o no aplicativo de maneira explícita. Não anuncie uma experiência equivalente à de Modal, pois Popover não torna o restante da página inerte.

No modo click, o acionador alterna o estado e o clique externo fecha. Escape fecha a camada elegível e devolve foco ao acionador. Um dismiss dentro do painel verifica se o foco está no conteúdo antes de tentar devolvê-lo. No modo focus, sair para fora do conjunto acionador/painel fecha; mover foco do acionador para um controle do painel não deve fechar imediatamente. Há uma limitação concreta no modo focus: se o foco estiver em um controle interno, Escape chama hide e refoca o gatilho; esse novo focus abre o painel novamente. Assim, o painel pode continuar aberto após Escape, agora com foco no gatilho. O dismiss interno tem uma guarda específica contra essa reabertura, mas o handler de Escape não. Para conteúdo interativo que dependa de fechamento previsível por Escape, prefira o modo click nesta versão e teste o percurso completo. Esta descrição registra uma limitação do runtime, não uma recomendação de preservar o defeito.

Hover mantém um atraso interno de 100ms ao sair para permitir atravessar o espaço entre acionador e painel. Esse valor não é uma opção pública. Os listeners desse modo são mouseenter/mouseleave, não uma política completa de foco ou toque. Não esconda um requisito de formulário ou uma ação exclusiva nessa composição. O modo manual reconhecido pelo runtime também não fornece a mesma infraestrutura de Escape do modo click; usá-lo exige assumir mais responsabilidades, sem ampliar a união de tipos documentada.

## Montagem e descarte do portal

Carregue os estilos e o JavaScript da mesma versão. Em bundler, use o CSS de `fokus-styles` e o export `Popover` de `fokus-styles/js`; no IIFE use `FokusStyles.Popover`. A construção manual recebe o acionador, não o painel. Consulte getInstance antes de criar para não instalar listeners duplicados após auto-init. Opções são capturadas na construção; não há método público para substituir target ou trigger durante a vida da instância.

Enquanto aberto, o posicionamento é observado e atualizado; a posição preferida pode ceder a outra quando não cabe. Dentro de um diálogo proprietário, o portal mantém o popup no contexto interativo correspondente e aplica o tema do acionador. Abertura de outro Popover fecha o anterior. Não use o componente como sistema de múltiplas janelas independentes ou como contêiner persistente de uma tarefa que não pode ser interrompida.

Dispose fecha, cancela a observação e timers, remove listeners e restaura o painel ao local original. Não destrói o conteúdo fornecido nem garante restauração de todos os atributos ARIA à versão anterior à construção. Descarte antes de remover os nós e remova separadamente handlers de ações da aplicação. Se houver trabalho assíncrono preenchendo o corpo, cancele ou ignore a resposta depois da desmontagem; o componente não controla essa requisição.

## Dimensões e validação

Os tokens de largura máxima, padding, gap e tamanho de seta permitem ajustes locais. Alterar largura não introduz rolagem ou validação do volume de conteúdo automaticamente. Teste textos traduzidos, botões que quebram linha, tema escuro e limites da viewport. aria-busy comunica uma condição, mas não bloqueia cliques nem inicia Spinner por si só. O aplicativo deve manter ocupado, erro e conteúdo final coerentes entre si. Testes DOM verificam atributos e ciclo de vida; posicionamento visual e navegação assistiva precisam de validação adicional.
