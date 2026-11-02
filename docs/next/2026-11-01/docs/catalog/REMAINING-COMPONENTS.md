> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Componentes com exemplo único: ampliação por contrato

Base 55ac61f (137 exemplos). Este lote acrescenta composições reais sem alterar
SCSS, APIs ou runtime. Cobertura permanece parcial; ter mais de um exemplo não
significa cobrir todas as variantes, estados, temas ou acessibilidade manual.

## Composições CSS e HTML nativo

- Button Group: vertical com alternâncias independentes. Handler DOM da aplicação
  atualiza aria-pressed e é removido por AbortController no pagehide; não há API de
  seleção do framework nem navegação por setas implícita.
- Close Button: abrir/fechar aviso local, atualizar aria-expanded e devolver foco
  ao opener. Não substituir pelo handler genérico o dismiss de Modal/Toast.
- Segmented Control: checkbox inclusivo, sm/lg e disabled nativo; cada filtro é
  independente, não radiogroup ou tabs disfarçado.
- Avatar: iniciais com nome, sm/lg/square. Não há status de presença ou fallback
  automático de imagem. Nenhum token de tamanho inexistente foi inventado.
- Icon Link: direção RTL herdada e LTR local, links de fragmento existentes e
  desenho de setas escolhido explicitamente; o componente não espelha SVG.
- Rating: escala completa 5→1 no DOM, sm/lg, nota inicial3 e grupo disabled.
  Radios mantêm exclusividade por name; seleção não depende de JS.

Provenance por exemplo inclui commit-base, hash do HTML e hashes de implementação.
Handlers DOM de Button Group e Close Button são identificados como demo-dom,
não como APIs Fokus. Testes executam markup/handlers reais e repetem teardown.
Testes browser/axe fornecidos só podem ser declarados aprovados após execução.

## Resultado integrado

15 exemplos novos: total 152 em 56 componentes; todos têm ao menos 2 exemplos.
Isso não muda coverage.complete=false. Complementos interativos: Offcanvas end
estático e bottom sem backdrop; Popover focus/bottom-start; Confirm warning
com texto escapado; Collapse aberto; Tag loading/recuperação e truncamento;
Carousel fade manual e estático. Contratos e limites em OVERLAY-OPTIONS.md e
MOTION-VARIANTS.md. Todos os exemplos da base137 foram preservados.
