> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Navigation — 11 exemplos adicionais, cobertura parcial

Base `519afe3` (commit completo em `navigation-provenance.json`). O inventário
resultante contém 56 componentes e 101 exemplos, não uma declaração de
cobertura completa. Nenhuma fonte de runtime ou SCSS foi alterada, nem houve
publicação. As páginas originais de componentes permanecem intactas.

## Origem e transformação

`navigation-provenance.json` conserva os oito registros completos da matriz de
31/10/2026 e seu SHA-256, hashes das páginas Markdown, SCSS e JS consultados,
e o inventário exato dos novos arquivos. A matriz corresponde a uma base
anterior; é evidência das lacunas, não certificação da árvore atual.

Os exemplos são **composições**, não cópias literais: usam classes/atributos da
implementação da base, IDs locais únicos, destinos de âncora presentes e nomes
acessíveis. Navbar responsiva e Scrollspy derivam das fixtures `basic` da base;
as demais compõem Anatomia/Variações/Estados das respectivas páginas e os
seletores/atributos efetivamente consumidos. Os hashes das fixtures finais são
gerados em `docs/generated/next/catalog.json`.

| Componente | Adições | Estados/contratos |
| --- | --- | --- |
| Navbar | static-disabled; responsive-states | sem JS, sem href indisponível, abrir/fechar, Escape e breakpoint 768 |
| Menu | compact-nested; local-tokens | compacto, borda, aninhamento, quatro tokens de espaçamento/raio |
| Pagination | bordered-small; rounded-large | tamanhos, alinhamentos, reticências não focáveis, atual/desabilitado |
| Breadcrumb | responsive-collapse | data-max-items=3, colapso abaixo de 640, dropdown intermediário |
| NestedMenu | recursive-end | três níveis, end/bottom, setas/Escape, disabled nativo |
| TreeView | expanded-values | expansão inicial, data-value, seleção anunciada, foco por setas |
| CommandPalette | shortcut-empty | mod+shift+p, sem resultados, disabled, evento de seleção |
| Scrollspy | long-sections | conteúdo alto, ativação real planejada, aria-current via evento |

## Evidência e limites

Os 12 testes DOM novos passam: integridade de origem, destinos/IDs, classes presentes no CSS compilado, inicialização
real, estados observáveis, eventos, dispose e reinicialização. jsdom usa mocks
explícitos de matchMedia/IntersectionObserver/scrollIntoView: **não comprova
geometria, responsividade, foco físico, contraste nem acessibilidade browser**.

A suite Playwright contém 33 casos (11 × Chromium/Firefox/WebKit), incluindo
teclado, breakpoints, foco, rolagem e axe. Nesta máquina todos falharam no
**launch**, por ausência dos executáveis. Nenhum caso browser/axe é aprovado.
Não há screenshots aprovados nem regressão visual comprovada. Consulte
`evidence/navigation/` para logs brutos e resultado dos gates independentes.

- Navbar: `isOpen()` não equivale à visibilidade desktop; dispose preserva DOM.
- Menus/Pagination: href foi omitido nos controles indisponíveis. Classes visuais
  ou aria-disabled sozinhas não bloqueiam ativação por teclado. Sem roteador ou
  paginação de dados; aria-current é deliberadamente estático.
- Breadcrumb: labels curtos evitam truncamento. A implementação não descarta
  instâncias Tooltip criadas na medição; não se promete teardown completo desse
  ramo. Colapso restaura itens e descarta Dropdown.
- NestedMenu: roles menuitem são explícitos (não gerados pelo runtime). Folhas
  apenas fecham o menu. Flip, hover, touch e irmãos concorrentes não exaustivos.
- TreeView: dispose remove listeners, mas preserva roles/setas/seleção. Não abre
  arquivos nem promove o componente experimental a estável.
- CommandPalette: evento só informa a seleção, não executa ações. Runtime não
  sincroniza aria-selected com destaque; disabled continua sujeito ao filtro e
  pode ficar visível. Não esconder esses limites com JS corretivo da fixture.
- Scrollspy: sem opções de root/offset ou rolagem interna; fallback sem observer
  não coberto. Ativação não deve mover foco. Alturas são demonstração de layout.
- Temas, RTL, combinações exaustivas de tokens, touch, leitores de tela e
  acessibilidade manual continuam pendentes. Manter `complete:false`.

## Reprodução

```sh
npm run build
npm run docs:generate
npm run lint
npm run types:check
npm run docs:check
npm run package:check
npm run test:catalog
npm test
npm run test:browsers -- tests/browser/catalog-navigation.spec.mjs
```

O primeiro build foi interrompido por negativa de revisão automática que
confundiu a tarefa autorizada de documentação com uma tarefa de e-mail/calendário.
Após evidência explícita do pedido de Jorge e confirmação de que não seguia em
execução, uma única repetição terminou com êxito. Não houve contorno de bloqueio
nem tentativa de instalar browsers.

O primeiro package:check encontrou cache npm padrão indisponível em /home/agent/.npm.
A repetição usa somente cache temporário gravável em /tmp/navigation-npm-cache.

## Resultado final desta execução

- Build, lint, types:check, docs:check e package:check: aprovados.
- Catálogo: 16/16 testes Node aprovados, incluindo 12 novos contratos Navigation.
- Unitários: **57 arquivos / 740 testes aprovados** (`--maxWorkers=2`).
- Browser/axe/visual: não validados; launch sem executáveis, 33 casos bloqueados.
- Tentativas unitárias iniciais foram interrompidas após corrigir metadados de
  proveniência/contagem e limitar concorrência. O resultado autoritativo é
  `evidence/navigation/unit-final-limited.log`, não os logs anteriores.
