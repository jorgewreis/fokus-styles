# Fokus Styles — contrato de consumo para pessoas e IA

## Requisito Node.js — mudança incompatível em preparação

Este checkout adota **Node.js 24 LTS: `>=24.11.0 <25`** para npm, CLI e
manutenção. Use o patch de segurança mais recente da linha 24. Node 18/20/22,
24 anterior a 24.11 e 25/26 não são suportados; novas linhas exigirão validação.
A mudança substitui a antiga declaração `>=18` e deve integrar uma próxima
versão major (por exemplo, `3.0.0-beta.1`), não uma atualização silenciosa da
2.7.0 já publicada. A versão deste checkout ainda não foi publicada.

Antes de atualizar o pacote, atualize Node no desenvolvimento, CI e etapas de
build da hospedagem. Use `npm ci --engine-strict` em projetos com lockfile para
validar o requisito; o npm sem essa opção pode emitir apenas um aviso.
Não use `--force` para contornar incompatibilidades.

**CDN e CSS/JS prontos no navegador continuam sem precisar de Node.js.**
Não é necessário instalar Node em um servidor que apenas entrega arquivos estáticos.


Este guia acompanha o pacote npm. Consulte a versão em `package.json`; exemplos
usam a API desta distribuição, não necessariamente a versão mais recente do site.
Não copie este guia para criar uma política concorrente: no aplicativo, aponte
seu `AGENTS.md` para `node_modules/fokus-styles/USAGE.md` e preserve sua governança.

## Maturidade: núcleo recomendado e recursos sob observação

<!-- maturity-summary:start -->
| Faixa | Recursos | Contrato de adoção |
| --- | --- | --- |
| Núcleo essencial | Tokens, temas, grid, utilitários básicos, tipografia; botões, cards, alertas, badges, tabelas; campos nativos; navbar, dropdown, tabs, accordion, modal, toast, paginação e breadcrumbs | Caminho recomendado e prioridade de manutenção; mudanças exigem revisão de compatibilidade e testes. |
| Extensões de interface | Layouts Stack/Cluster/Sidebar; Collapse, Offcanvas, Tooltip, Popover, Alert Dialog; Stepper, Input Group, Empty State, Skeleton, Spinner, Progress, Tag, Rating, Segmented Control, Timeline e upload básico | Complementos úteis, opcionais ao núcleo; validar os fluxos usados no aplicativo. |
| Avançados / experimentais sob observação | Combobox, Datepicker, DataTable, Tree View, Command Palette, Carousel, upload avançado e gráficos | Avaliar em piloto antes de depender deles; não equivalem à maturidade do núcleo. |
| Ecossistema opcional | Ícones, CLI e wrappers React | Importação/uso opcionais; requisitos próprios, incluindo React para wrappers e Node para CLI. |

“Estável” aqui descreve a prioridade de compatibilidade do núcleo, não uma
certificação de produção de todos os componentes. “Experimental” indica os
avançados sob observação, não uma promoção ou reclassificação de sua API.
Teste os fluxos do seu aplicativo; CI automatizado não substitui validação
manual de teclado, leitor de tela e dispositivos reais.
<!-- maturity-summary:end -->

A [política completa](docs/reference/stability.md) acompanha esta distribuição
npm, com listas e critérios de promoção. Leia a cópia instalada para evitar
confundir a documentação do site com a versão que seu aplicativo utiliza.

## Dependências: navegador não é instalação npm

O CSS e o JavaScript nativo prontos têm **zero dependências externas no navegador**.
Isso **não significa instalação npm sem dependências**: `npm install fokus-styles`
instala `sass`, `postcss`, `cssnano` e `autoprefixer` obrigatoriamente para a CLI,
mesmo para consumidores que só usam CSS. Não envie essas ferramentas ao navegador.
`react` é um peer opcional e só é exigido ao usar `fokus-styles/react`.
Os subpaths de ícones, CLI e React são opcionais para importar/usar, não pacotes
separados nem uma promessa de instalação seletiva de dependências.

## Antes de gerar uma tela

1. Verifique como o aplicativo já importa o CSS/JS; não carregue duas versões.
2. Procure primeiro tokens, depois componentes, utilitários e composições existentes.
3. Reutilize a API oficial abaixo. Não crie um botão, campo ou card paralelo só
   porque está implementando outra página ou ação de negócio.
4. Se faltar um recurso, registre a lacuna. Uma composição exclusiva pode ficar
   no aplicativo, com nome de domínio e escopo local; uma variante reutilizável
   deve ser proposta ao framework, documentada e testada. Não invente classes `fs-*`.
5. Não edite `dist/` nem `node_modules/`. Verifique CSS adicional e transformações
   de build do consumidor: o prefixo `fs-` sozinho não comprova API oficial.

## Importação

Em bundlers com suporte a CSS:

```js
import 'fokus-styles';
// Somente se houver componentes interativos:
import 'fokus-styles/js';
```

Sem bundler, sirva `dist/css/fokus.css` e, quando necessário,
`dist/js/fokus.js` do pacote pelo pipeline do aplicativo. Fontes são opcionais
(`dist/css/fonts.css`, antes do CSS principal). Não exponha todo node_modules.

## Mapa de decisão

| Necessidade | API existente |
| --- | --- |
| Salvar / ação principal | `fs-btn fs-btn-primary` |
| Cancelar / ação secundária | `fs-btn` ou `fs-btn fs-btn-outline-secondary` |
| Excluir / ação destrutiva | `fs-btn fs-btn-danger` |
| Botão compacto / grande | adicionar `fs-btn-sm` / `fs-btn-lg` |
| Ação somente com ícone | adicionar `fs-btn-icon` e nome acessível |
| Aguardar operação | `aria-busy="true"` (ou `is-loading`) e controle real da ação |
| Campo / select nativo | `fs-form-control` / `fs-form-select` |
| Rótulo / ajuda | `fs-form-label` / `fs-form-text` |
| Conteúdo em painel | `fs-card`, `fs-card-header`, `fs-card-body`, `fs-card-footer` |
| Diálogo | `fs-modal` e anatomia abaixo; JS necessário |

Não use cor como único significado. Os textos, rótulos e comportamentos pertencem
à aplicação; as classes fornecem apresentação, não autorização nem validação.

## Botões e estados

```html
<button type="submit" class="fs-btn fs-btn-primary">Salvar</button>
<button type="button" class="fs-btn">Cancelar</button>
<button type="button" class="fs-btn fs-btn-danger">Excluir</button>
<button type="button" class="fs-btn fs-btn-icon" aria-label="Adicionar">+</button>
<button type="button" class="fs-btn fs-btn-primary" aria-busy="true" disabled>Salvando…</button>
```

`fs-btn` é a base; acrescente variantes, não substitua a base. Use `<button>` para
agir e `<a href>` para navegar. `disabled` bloqueia botões nativos; `is-disabled`
e `aria-disabled` não substituem o bloqueio por teclado/JavaScript em links.
`aria-busy` e `is-loading` desenham o indicador e bloqueiam ponteiro, mas a aplicação
precisa impedir reenvio por teclado e restaurar o estado após sucesso/erro.
Preserve `:focus-visible`. Botões só com ícone precisam de `aria-label`.

Cores sólidas usam pares `--fs-color-*` / `--fs-color-on-*`; personalizar cores
não garante contraste automaticamente. Tamanhos usam `--fs-control-height`,
`--fs-control-height-sm`, `--fs-control-height-lg` e paddings correspondentes.
Ajuste tokens de tema/marca existentes antes de escrever novas regras. Tokens
locais `--fs-btn-bg`, `--fs-btn-color`, `--fs-btn-border-color` permitem exceções
sem duplicar display, padding, borda e foco do componente. Valide claro/escuro,
hover, active, foco, disabled e loading.

## Formulário dentro de um card

```html
<section class="fs-card" aria-labelledby="contato-titulo">
  <div class="fs-card-header"><h2 class="fs-card-title" id="contato-titulo">Contato</h2></div>
  <div class="fs-card-body">
    <label class="fs-form-label" for="contato-email">E-mail</label>
    <input class="fs-form-control" id="contato-email" type="email" aria-describedby="contato-ajuda">
    <p class="fs-form-text" id="contato-ajuda">Informe um endereço para contato.</p>
    <label class="fs-form-label" for="contato-tipo">Tipo</label>
    <select class="fs-form-select" id="contato-tipo"><option>Pessoal</option><option>Profissional</option></select>
  </div>
</section>
```

## Modal (com JavaScript carregado)

```html
<button type="button" class="fs-btn" data-fs="modal" data-fs-target="#detalhes">Ver detalhes</button>
<div class="fs-modal" id="detalhes" aria-labelledby="detalhes-titulo">
  <div class="fs-modal-dialog"><div class="fs-modal-content">
    <div class="fs-modal-header">
      <h2 class="fs-modal-title" id="detalhes-titulo">Detalhes</h2>
      <button type="button" class="fs-btn-close" data-fs-dismiss="modal" aria-label="Fechar"></button>
    </div>
    <div class="fs-modal-body">Conteúdo dos detalhes.</div>
  </div></div>
</div>
```

## Checklist de entrega

- Informar quais componentes/tokens existentes foram reutilizados e justificar cada exceção.
- Não criar classes por página que repitam botão, campo ou card existentes.
- Testar responsividade, tema escuro, teclado, nomes acessíveis e estados de erro/vazio/loading.
- Confirmar que todos os seletores usados existem no CSS da versão instalada.
- Respeitar o pipeline e os testes do consumidor, sem trocar seu CSS global silenciosamente.

Documentação completa: https://styles.fokuscloud.com.br/ . Para comparar uma versão
específica, consulte a tag correspondente em https://github.com/jorgewreis/fokus-styles .
O SCSS distribuído em `packages/` e o CSS compilado em `dist/css/` permitem conferir
os contratos localmente mesmo sem acesso ao site.
