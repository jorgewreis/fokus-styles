> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Catálogo canônico `next` — reconstrução verificável

Este catálogo é um candidato **não publicado** e de **cobertura parcial**.
Não representa o npm 2.7.0 publicado, nem certifica produção ou WCAG.

## Fontes preservadas

As 56 páginas originais em `../components/` continuam intactas. O artefato
`../generated/next/catalog.json` mantém integralmente seu Markdown, seções e
blocos de código. Cada bloco histórico é explicitamente `executable: false`:
fragmentos com reticências, seletores externos e dependências contextuais não
são promovidos automaticamente a exemplos completos.

A geração compila o Sass real e registra seletores completos, declarações,
ordem e condições (`@media`, `@layer`, etc.). Essas regras são evidência de
implementação: mencionar um token não garante efeito em todo estado. Não se
remove escopo de hover, ancestral ou media query. As definições TypeScript e
imports são preservados a partir das fontes reais. A política de maturidade
permanece em `../reference/stability.md`; não há promoção implícita.

## Atualizar e verificar

```bash
npm ci --engine-strict
npm run build
npm run docs:generate
npm run docs:check
npm run test:catalog
npm run docs:preview
```

O servidor local em `http://127.0.0.1:8890` só expõe catálogo, páginas,
previews e os dois bundles necessários. Não expõe o repositório, não adiciona
CORS e usa CSP sem conexões/formulários externos. Previews ficam em iframes
`sandbox="allow-scripts"`, sem `allow-same-origin`. Só imports nomeados de
`fokus-styles/js` são adaptados para o IIFE; a fonte copiada permanece original.

## Novos exemplos

`examples.json` associa IDs de componentes a fixtures HTML/JS/CSS completas
em `fixtures/`. Cada exemplo declara sua cobertura e limites. O gerador
confere imports, caminhos e hashes. Testar visualmente, teclado, estados e
teardown antes de declarar um caso coberto. Componentes sem fixture revisada
aparecem como pendentes, não como aprovados.

## Recuperação de 31/10/2026

O workspace anterior não estava disponível após reinicialização. Esta é uma
**nova reconstrução**, não a recuperação dos commits `bf10aac`/`f9d771e` nem
uma repetição comprovada dos 127 exemplos anteriormente preparados. Usa a
base remota PR41 `218afe4`, documentação existente e o relatório comparativo
preservado; números de cobertura e evidência devem refletir esta árvore.
