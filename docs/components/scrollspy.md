# Scrollspy

## Visão geral

`data-fs="scrollspy"` destaca o link da seção atualmente visível e pode ser usado em navegação lateral.

## Estados

O módulo JS aplica `.is-active` e emite `fs:scrollspy:activate`.

## A11y

Use uma navegação nomeada, mantenha foco visível e não remova a indicação textual do destino.

Os destinos são âncoras da mesma página (`href="#id"`) e precisam corresponder a
elementos existentes. Como são links HTML nativos, permanecem acessíveis por
Tab e Enter; Scrollspy não instala um modelo de teclado próprio. O componente
atualiza a classe `.is-active`, mas não move o foco e não remove essa classe
durante `dispose()`.

## API JS

`Scrollspy` é uma API JavaScript pública, exportada por `fokus-styles/js`.
O auto-init encontra elementos existentes com `[data-fs="scrollspy"]` durante
o carregamento do módulo (ou em `DOMContentLoaded`). Elementos inseridos depois
devem ser inicializados com `Scrollspy.getOrCreateInstance(element)`.

`getInstance(element)` retorna a instância atual; `activate(section)` marca o
link correspondente com `.is-active` e emite o evento bubbling `fs:scrollspy:activate` com
`detail: { section }`; `dispose()` desconecta o `IntersectionObserver` ou
remove o listener de scroll do fallback e limpa o registro. O fallback é usado
quando `IntersectionObserver` não está disponível.

```js
import { Scrollspy } from "fokus-styles/js";

const nav = document.querySelector('[data-fs="scrollspy"]');
const scrollspy = Scrollspy.getOrCreateInstance(nav);
nav.addEventListener("fs:scrollspy:activate", ({ detail }) => {
  console.log("Seção ativa:", detail.section.id);
});
```
