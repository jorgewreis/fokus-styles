# Migração para Fokus Styles 3

## Estado da release

A versão 3.0.0 está em preparação. Este guia e o manifesto do checkout não
significam que ela foi publicada. Em 10/11/2026, a consulta ao registry npm
retornou latest 2.7.0 e nenhuma versão 3.0.0. Confira novamente antes do corte.
Merge, criação de tag e publicação requerem aprovação separada.

## Por que uma versão major

O contrato declarado do pacote passa de Node >=18 para
`^22.11.0 || ^24.11.0 || >=26.0.0`. Mesmo que dependências de produção já
impedissem a instalação estrita em Node antigo, restringir o manifesto é uma
mudança de contrato visível. Node 18/20, 22 anterior a 22.11, 23, 24 anterior
a 24.11 e 25 não são admitidos.

CSS pré-compilado servido no navegador não executa Node. Já instalar o pacote
agregado inclui as dependências da CLI, mesmo com `--omit=dev`.
Desenvolver e testar o checkout exige
`^22.13.0 || ^24.11.0 || >=26.0.0`.

## Preparar a atualização

1. Confira Node/npm no ambiente local, CI e build de produção. Prefira patches
   atualizados de Node 22 ou 24, sem permanecer no piso apenas por compatibilidade.
2. Após a publicação ser confirmada, atualize deliberadamente a dependência
   para 3.0.0 e regenere o lockfile do seu aplicativo. Instale com
   `--engine-strict`; não use `--force` para ocultar incompatibilidades.
3. Teste os imports CSS/JS, compilação Sass, comandos CLI e componentes usados.
   A preparação não renomeia classes `fs-*` nem subpaths de importação.
4. Revise regressões de foco/overlays e o estado disabled de Tag após loading:
   um disabled explícito é preservado; reabilite explicitamente se necessário.
5. Confira budgets do aplicativo. O teto gzip JS do framework é 27.008 bytes;
   a medição do candidato deve ser consultada na validação da release.

## CDN e consumidores existentes

Exemplos de URL sem versão, como
`https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fokus.css`, podem seguir
a versão mais recente. Fixe uma versão já publicada e validada, por exemplo
`https://cdn.jsdelivr.net/npm/fokus-styles@2.7.0/dist/css/fokus.css`,
e atualize CSS/JS/fontes em conjunto somente após testar a versão desejada.
Não aponte produção para 3.0.0 antes de confirmar sua publicação.

A faixa npm `^2.7.0` não recebe automaticamente 3.0.0. Manter 2.7.0 fixada
não torna suas dependências compatíveis com Node antigo: seu manifesto antigo
era mais amplo que a árvore de produção. Avalie upgrade de Node primeiro.

## Evidências e limites

Consulte [compatibilidade Node](../reference/node-compatibility.md) para separar
evidências históricas dos testes do candidato. Node 26.0 testado não homologa
todas as versões futuras de Node. O smoke existente verifica tipos React,
não a execução de todas as versões do peer; ambientes além de Linux exigem
validação própria. Dependências de produção usam intervalos e são resolvidas
novamente no consumidor, sem o lockfile do repositório.

## Corte posterior

Antes de autorizar publicação, confirme versão livre no registry, CI e smoke
no SHA final, conteúdo e integridade do tarball e o dist-tag pretendido.
O push de uma tag `v*.*.*` dispara o workflow de publicação automaticamente.
Não reutilize v2.7.0. Não altere tags históricas nem publique durante a preparação.
