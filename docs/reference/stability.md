# Estabilidade e roadmap

Este documento define como o Fokus Styles evolui. A existência de um componente
no repositório não significa que ele tenha o mesmo nível de maturidade do
núcleo.

## Direção estratégica

O Fokus Styles está em fase de consolidação. A prioridade é tornar o núcleo CSS
pequeno, previsível, acessível e fácil de adotar. Novos componentes só devem
entrar no núcleo quando houver uso real, API documentada, testes funcionais,
regressão visual e validação de acessibilidade.

O objetivo não é competir pela maior quantidade de componentes, mas oferecer
uma base confiável para páginas institucionais, sistemas administrativos e
aplicações web construídas com HTML, CSS e JavaScript nativo.

## Resumo para consumidores

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

## Níveis de estabilidade

### Núcleo essencial

É o caminho recomendado para novos projetos e recebe prioridade de manutenção:

- tokens, reset, temas e dark mode;
- containers, grid e utilitários básicos;
- tipografia, espaçamento e estados visuais;
- botões, cards, alertas, badges e tabelas;
- inputs, select, checkbox, radio e switch;
- navbar, dropdown, tabs, accordion, modal, toast, paginação e breadcrumbs.

Mudanças nesses recursos exigem revisão de compatibilidade, documentação de
migração quando necessário e cobertura de testes correspondente.

### Extensões de interface

São componentes prontos e úteis, mas não bloqueiam o uso do núcleo:

- Stack, Cluster, Sidebar e recursos avançados de layout;
- Collapse, Offcanvas, Tooltip, Popover e Alert Dialog;
- Stepper, Input Group, Empty State, Skeleton, Spinner e Progress;
- Tag, Rating, Segmented Control, Timeline e upload básico.

### Componentes avançados

Atendem casos específicos e permanecem sob observação de uso e manutenção:

- Combobox e Datepicker;
- DataTable;
- Tree View e Command Palette;
- Carousel;
- Upload avançado e integrações de gráficos.

Esses recursos não devem ser usados como argumento para aumentar o escopo do
núcleo sem evidência de necessidade recorrente.

### Ecossistema opcional

`fokus-styles/icons`, `fokus-styles/cli` e `fokus-styles/react` são subpaths
opcionais do mesmo pacote **para uso/importação**, não pacotes npm separados.
O CSS e o JavaScript nativo prontos não exigem dependências externas no navegador.
Já `npm install fokus-styles` instala `sass`, `postcss`, `cssnano` e
`autoprefixer` como dependências obrigatórias da ferramenta CLI, mesmo se o
consumidor usar apenas CSS. React é um peer opcional, necessário somente para
`fokus-styles/react`; o núcleo não o exige. Separar a ferramenta em outro pacote
é uma possibilidade futura, não o comportamento atual.

## Roadmap de consolidação

1. Corrigir e uniformizar a documentação pública e os exemplos.
2. Garantir que cada componente essencial tenha API, estados, acessibilidade,
   tokens e exemplo mínimo documentados.
3. Validar o núcleo em Chromium, Firefox e WebKit, além de testes manuais de
   teclado e leitores de tela.
4. Criar documentação visual com busca, exemplos executáveis e templates de
   sistemas reais.
5. Medir adoção e bugs antes de promover componentes avançados ao núcleo.

## Critério para promover um componente

Um componente avançado só deve ser promovido quando cumprir todos estes
critérios:

- necessidade recorrente em projetos reais;
- API pública estável e consistente com `data-fs`, `fs:*` e `window.FokusStyles`;
- documentação de anatomia, estados, tokens e teclado;
- testes unitários, visuais e de acessibilidade;
- comportamento verificado nos navegadores definidos pelo projeto;
- impacto de bundle conhecido e registrado.

## Regra para novas funcionalidades

Antes de criar um novo componente, prefira compor recursos existentes. A
adição deve resolver um problema recorrente, não apenas completar um catálogo.
