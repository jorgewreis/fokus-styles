> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Notification Center

Orquestra múltiplas instâncias de [Toast](toast.md) e mantém um histórico
com painel de notificações e contador de não-lidas — não introduz um
elemento visual novo, compõe o que já existe.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="notification-center" data-fs-target="#painel-notif" aria-label="Notificações">
  <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
  <span class="fs-notification-badge" hidden>0</span>
</button>

<div class="fs-notification-center" id="painel-notif">
  <div class="fs-notification-center-header">
    <span class="fs-notification-center-title">Notificações</span>
    <button type="button" class="fs-btn fs-btn-sm" data-notification="clear">Limpar tudo</button>
  </div>
  <ul class="fs-notification-list"></ul>
  <p class="fs-notification-empty">Nenhuma notificação.</p>
</div>
```

```js
const center = FokusStyles.NotificationCenter.getInstance(document.querySelector('[data-fs="notification-center"]'));
center.push({ title: "Sucesso", body: "Arquivo salvo.", variant: "success" });
```

## Anatomia

Gatilho (`data-fs="notification-center"` + `data-fs-target`, com
`.fs-notification-badge` opcional dentro) + `.fs-notification-center`
(painel) > `.fs-notification-center-header` (título + botão "limpar tudo",
via `data-notification="clear"`) + `.fs-notification-list` (`<ul>`,
preenchida dinamicamente) + `.fs-notification-empty` (mostrado/escondido
automaticamente conforme o histórico). O `.fs-toast-container` é criado
automaticamente se não existir um na página (ou aponte pra um existente
com `data-toast-container="#seletor"`).

## Variações

Cor por item de notificação: `.fs-notification-item-{nome}` (borda
esquerda colorida) — aplicada automaticamente a partir do `variant`
passado em `push()`. As variantes aceitas são `primary`, `secondary`,
`success`, `warning`, `danger` e `info`; valores desconhecidos usam `primary`.
Histórico local é tratado como entrada não confiável: valores que não sejam
arrays e registros sem ID textual são ignorados; campos inválidos são
normalizados. IDs são atribuídos via DOM, nunca interpretados como HTML.

## Estados

- `.fs-notification-item-unread` — aplicada automaticamente aos itens
  ainda não lidos (some ao abrir o painel — abrir marca tudo como lido).
- Persistência: `data-storage="local"` + `data-storage-key="..."` no
  gatilho grava o histórico em `localStorage` (sobrevive a reload); padrão
  é `"memory"` (perde ao recarregar a página).

```html
<button data-fs="notification-center" data-fs-target="#painel" data-storage="local" data-storage-key="minhas-notificacoes" aria-label="Notificações">
  <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
</button>
```

## A11y

`aria-haspopup="dialog"` + `aria-expanded` no gatilho, `role="region"` +
`aria-label="Notificações"` no painel (aplicados automaticamente, a menos
que você já tenha definido `aria-label` próprio). `Escape` fecha e devolve
foco ao gatilho; clique fora fecha.

## API JS

Auto-init via `data-fs="notification-center"` **no gatilho**.
`NotificationCenter.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `push({ title, body, variant, autohide, delay })` | Empilha um toast na hora e registra a notificação no histórico. Retorna o `id` do registro. |
| `remove(id)` | Remove uma notificação específica do histórico. |
| `clear()` | Remove todo o histórico. |
| `getAll()` | Retorna uma cópia do histórico atual (array de registros). |
| `open()` / `close()` / `toggle()` | Abrem/fecham o painel (abrir marca tudo como lido). |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Propriedade pública | Contrato |
|---|---|
| `history` | Array de `NotificationRecord`: `id`, `title`, `body`, `variant`, `time` e `read`. É mutável no runtime/tipos, mas alterações diretas não disparam persistência, renderização ou eventos. Prefira os métodos públicos. |
| `isOpen` | Boolean do estado lógico do painel; use `open()`/`close()`/`toggle()` para alterá-lo junto do DOM. Atribuição direta não executa esse ciclo. |
| `unreadCount` | Getter somente leitura que conta os registros cujo `read` é falso. |

`getAll()` copia o array, **não os objetos** de cada registro. Para editar uma
representação local sem afetar o histórico, copie também os registros. Não use
mutação de `history`, `isOpen` ou do retorno de `getAll()` como substituto das
operações do controlador.

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:notification:pushed` | Não | Depois de `push()` — `event.detail.record` traz o registro criado. |
| `fs:notification:opened` / `-closed` | Não | Depois de abrir/fechar o painel. |
| `fs:notification:cleared` | Não | Depois de `clear()`. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (item não
lido), `--fs-color-danger` (badge de contagem), `--fs-color-{nome}` (borda
por variante), `--fs-radius-md`, `--fs-shadow-md`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="notification-center" data-fs-target="#nc" id="nc-trigger" aria-label="Notificações">
  <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
  <span class="fs-notification-badge" hidden>0</span>
</button>
<div class="fs-notification-center" id="nc">
  <div class="fs-notification-center-header">
    <span class="fs-notification-center-title">Notificações</span>
    <button type="button" class="fs-btn fs-btn-sm" data-notification="clear">Limpar tudo</button>
  </div>
  <ul class="fs-notification-list"></ul>
  <p class="fs-notification-empty">Nenhuma notificação.</p>
</div>
<script>
  document.getElementById("nc-trigger").addEventListener("fs:notification:pushed", (e) => {
    console.log("nova notificação:", e.detail.record);
  });
</script>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3818e646af5c).

## Opções, conteúdo e ciclo de vida

As opções tipadas do construtor precedem seus atributos:

| Opção | Atributo | Padrão |
|---|---|---|
| target | data-fs-target | painel obrigatório |
| storage | data-storage | memory |
| storageKey | data-storage-key | fokus-notifications |
| toastContainer | data-toast-container | contêiner existente ou criado |

Um seletor toastContainer explícito precisa resolver elemento existente: não há
fallback se ele não encontra nada. Title/body de push são texto, escapados tanto
no histórico quanto no toast; não são um contrato de HTML rich text. Dados no
localStorage não são criptografados; não use o histórico como armazenamento de
segredos. Falha de quota/acesso mantém o histórico em memória, sem garantir
persistência. Eventos e visibilidade da UI não autorizam ações de negócio.

Clear/remove alteram histórico, não fecham toasts já visíveis. Dispose remove
listeners do centro, mas não descarta instâncias Toast criadas anteriormente.
Ao desmontar toda a composição, a aplicação deve descartar esses Toasts e seu
markup separadamente, especialmente quando autohide=false. Os nomes das opções
seguem o contrato tipado; não acesse campos de instância internos não tipados.

## Histórico local de interface, não caixa de entrada do servidor

Notification Center reúne duas experiências: feedback imediato por Toast e revisão de mensagens em um painel. Push cria o registro e abre um Toast; abrir o painel permite revisar o conjunto já conhecido pela instância. Isso não é uma integração com notificações push do navegador, WebSocket, e-mail ou API de mensagens. Para qualquer fonte remota, a aplicação busca e valida dados e decide quais eventos devem virar notificações visuais.

O histórico não é trilha de auditoria. O usuário pode limpar registros, o armazenamento pode falhar e a configuração padrão perde dados ao recarregar. Se um aviso precisa comprovar recebimento ou preservar decisões, registre isso no sistema responsável. A marcação read indica a política local “painel aberto”, não prova que a pessoa leu cada mensagem nem confirmação enviada ao servidor.

## Escolher persistência e escopo

Memory é adequado para feedback da sessão atual. Local mantém uma representação em localStorage, sob a chave configurada, mas não criptografa o conteúdo nem distingue automaticamente contas do mesmo navegador. Defina uma chave apropriada ao contexto e uma política de limpeza ao trocar de usuário. Não inclua credenciais, tokens ou informações que não deveriam permanecer em um dispositivo compartilhado.

Não há sincronização automática entre abas por eventos de storage. Duas instâncias usando a mesma chave podem manter cópias diferentes em memória e gravar uma depois da outra. Também não há paginação, limite de registros, expiração ou deduplicação de mensagens. Para volumes grandes, estabeleça uma política de retenção no aplicativo ou use uma tela especializada em vez de tratar o painel como um arquivo ilimitado.

O carregamento tolera JSON inválido e normaliza registros conhecidos, o que evita tratar armazenamento local como fonte confiável. Isso não valida o significado de um título nem autoriza uma ação de negócio. Um registro normalizado ainda é uma mensagem de interface. Falhas de persistência são absorvidas; se o produto exige saber se o dado foi salvo, essa exigência precisa de uma camada própria, pois a API não retorna confirmação de gravação.

## Painel, contador e leitura

O aplicativo fornece acionador e painel, e o construtor move o painel para document.body. Não é o mesmo mecanismo de portal com restauração utilizado por Popover. Na desmontagem, não espere que dispose devolva o painel ao pai original. Essa diferença importa em componentes de SPA que removem somente sua raiz: o painel movido pode sobreviver fora dela se o aplicativo não o remover explicitamente.

A lista é reconstruída a cada renderização. Colocar listeners diretamente em itens gerados não cria uma integração durável, porque esses nós podem ser substituídos. Prefira os eventos públicos do centro e seus métodos, ou delegação sob controle do aplicativo quando realmente necessária. O badge é opcional; sua ausência não impede a contagem lógica. Abrir marca todos os registros como lidos e atualiza a lista, inclusive quando a pessoa não percorreu todos os itens.

Uma notificação inserida enquanto o painel está aberto já recebe read true. Fechar não devolve o estado não lido, e remove não dispara um evento de remoção documentado. Clear emite fs:notification:cleared; push emite fs:notification:pushed com record; abertura e fechamento usam os nomes completos fs:notification:opened e fs:notification:closed. Esses eventos propagam no gatilho e não podem ser cancelados para bloquear a operação.

## Opções e resultados de push

O construtor recebe o acionador e opções de seletores e persistência. Push é outra interface: aceita title, body, variant, autohide e delay. Seus padrões são textos vazios, primary e autohide true; delay omitido deixa o Toast usar seu padrão. Forneça uma mensagem útil, ainda que os textos vazios sejam aceitos tecnicamente. Use uma duração finita positiva, observando a normalização do Toast, e não trate o ID retornado como identificador de uma entidade do servidor.

GetAll retorna um novo array, mas compartilha os objetos. Para criar um modelo editável separado, copie também cada registro. Alterar um objeto retornado ou o array history pode modificar dados sem atualizar badge, DOM e armazenamento; isso cria divergência difícil de rastrear. Prefira push, remove e clear para as operações previstas. Atribuir isOpen diretamente também não executa posicionamento nem listeners de fechamento.

Um seletor explícito de toastContainer que não encontra elemento não recebe fallback. Verifique o container antes da construção, especialmente em uma tela carregada por etapas. Como push registra e renderiza o histórico antes de criar o Toast, uma falha nessa criação não deve ser interpretada como uma transação revertida. Configure e teste a composição inteira antes de conectá-la a uma sequência de eventos reais.

## Foco, posicionamento e limpeza completa

O painel tem role region por padrão, embora o acionador receba aria-haspopup dialog. Não há focus trap, bloqueio de scroll ou transferência automática de foco ao abrir. Escape fecha e tenta focar o acionador; clique externo fecha. Essa implementação não deve ser anunciada como equivalente a um Modal. Avalie teclado, nome da região e navegação de seus controles na aplicação, especialmente se o centro aparece perto de outras camadas.

O posicionamento é calculado ao abrir, com preferência bottom/end e offset de 4px; não há opções públicas para isso nem observação contínua equivalente à de Popover. Mudanças de layout ou rolagem com o painel aberto exigem teste. O tema é aplicado ao painel a partir do acionador, mas os Toasts ficam no container escolhido: confirme os dois contextos ao usar temas locais.

Cada Toast gerado é descartado e removido quando seu evento hidden ocorre. Clear e remove afetam apenas o histórico; não são comandos para fechar todos os Toasts. Dispose do centro fecha o painel e remove seus listeners, mas não percorre Toasts ainda ativos nem remove o painel ou o container. Na desmontagem completa, descarte as instâncias Toast do container de propriedade da tela e remova o markup correspondente, evitando destruir mensagens de outra composição que compartilhe o mesmo container.

Carregue CSS e JavaScript da mesma distribuição: `fokus-styles` e os exports de `fokus-styles/js` em bundler, ou o bundle IIFE para os exemplos com FokusStyles. Consulte getInstance antes de uma construção manual. Os testes DOM verificam histórico, eventos e remoção; não demonstram percepção de anúncios, contraste ou posicionamento em telas reais. Trate essa validação visual e assistiva como parte da integração, não como resultado automático de ter um badge e uma lista.
