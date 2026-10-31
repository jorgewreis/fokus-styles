# Limites documentais de dados e lifecycle

Base 2132738, sem alterar runtime, tipos, fixtures ou contagem. Seis documentos
corrigidos: DataTable (filtro/ordenação/pageSize e divergência tipada), TreeView
(valor de ramos/disabled), Toast (classe inexistente, configuração e sobreposição
de pausas), Tag (proteção CSS/disabled), Carousel (índices) e NestedMenu (disabled).
Collapse foi revisado: nenhum desvio principal entre contrato documentado e
runtime encontrado. Seus eventos pós-transição e dispose permanecem coerentes.

Sete regressões registram o comportamento real e os avisos documentais. Não são
endosso de limitações como NaN, opt-in visual ou pausa sobreposta: eventuais
correções futuras de runtime devem rever testes e docs em conjunto.

Build, docs:check, 16 testes de catálogo e 168 testes focais aprovados. Os dois
registros de fixture-provenance e dois de navigation-provenance que guardam
hash dos Markdown modificados foram renovados (auditRows históricos intactos); hashes JS/SCSS não mudaram.
Nenhum teste browser adicional neste lote exclusivamente documental. Nenhum
push, PR, deploy ou release. Gates integrados completos pertencem ao coordenador.
