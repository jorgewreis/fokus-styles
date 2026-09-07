# Módulo interno React do Fokus Styles

**Subpath opcional — não faz parte do núcleo recomendado.**

Wrapper React fino para o [Fokus Styles](https://github.com/jorgewreis/fokus-styles)
— cada componente aplica `data-fs`/classes e delega comportamento (foco,
teclado, posicionamento, overlay) inteiramente pro JS vanilla já existente
em `fokus-styles/js/*`. Não reimplementa nada: os componentes deste pacote
só instanciam a classe vanilla correspondente sobre o elemento que o React
renderiza, e a desfazem (`dispose()`) no unmount.

**Só React nesta versão.** Vue/Svelte ficam de fora até haver uso real
validando o padrão — este pacote serve de molde pra replicar depois.

**Cobertura parcial, deliberada**: `Modal`, `Dropdown` e `Tabs` — os dois
formatos de contrato que os demais componentes de `fokus-js` seguem
(gatilho+painel vs. raiz única), suficientes pra provar o padrão. Os
demais componentes seguem o mesmo molde; abra uma issue se precisar de um
específico.

## Instalação

```bash
npm install fokus-styles react react-dom
```

## Modal

```jsx
import { ModalTrigger, ModalPanel } from "fokus-styles/react";

function Example() {
  return (
    <>
      <ModalTrigger target="#meu-modal" className="fs-btn fs-btn-primary">
        Abrir modal
      </ModalTrigger>

      <ModalPanel id="meu-modal">
        <div className="fs-modal-header">
          <h3 className="fs-modal-title">Título</h3>
        </div>
        <div className="fs-modal-body">Conteúdo do modal.</div>
      </ModalPanel>
    </>
  );
}
```

## Dropdown

```jsx
import { DropdownTrigger, DropdownMenu } from "fokus-styles/react";

function Example() {
  return (
    <div className="fs-dropdown">
      <DropdownTrigger target="#meu-menu" className="fs-btn" placement="bottom" align="start">
        Opções
      </DropdownTrigger>
      <DropdownMenu id="meu-menu">
        <a href="#" className="fs-dropdown-item">Editar</a>
        <a href="#" className="fs-dropdown-item">Excluir</a>
      </DropdownMenu>
    </div>
  );
}
```

## Tabs

```jsx
import { TabList } from "fokus-styles/react";

function Example() {
  return (
    <>
      <TabList>
        <a href="#" className="fs-nav-link is-active" data-fs-target="#perfil">Perfil</a>
        <a href="#" className="fs-nav-link" data-fs-target="#seguranca">Segurança</a>
      </TabList>
      <div className="fs-tab-content">
        <div className="fs-tab-pane is-active" id="perfil">Conteúdo Perfil.</div>
        <div className="fs-tab-pane" id="seguranca">Conteúdo Segurança.</div>
      </div>
    </>
  );
}
```

## Limitação conhecida

`TabList` (e, em geral, qualquer wrapper sobre um componente vanilla que lê
seus filhos uma vez na construção) não re-escaneia sozinho se a lista de
filhos mudar dinamicamente depois do mount. Troque a prop `key` do
componente pra forçar um remount quando a lista de abas mudar de verdade.

## Licença

MIT
