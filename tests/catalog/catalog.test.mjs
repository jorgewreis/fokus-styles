import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { root,generateCatalog } from '../../scripts/catalog.mjs';
import { createPreviewServer, adaptModule,renderPreview } from '../../scripts/catalog-preview-server.mjs';
const catalog=generateCatalog();
test('all source documentation is preserved and generated catalog is exact',()=>{
 assert.equal(catalog.contracts.length,56);assert.equal(catalog.published,false);assert.equal(catalog.coverage.complete,false);
 assert.deepEqual(JSON.parse(fs.readFileSync(`${root}/docs/generated/next/catalog.json`,'utf8')),catalog);
 for(const c of catalog.contracts){
  assert.equal(c.documentation.markdown,fs.readFileSync(`${root}/${c.documentation.path}`,'utf8'));
  assert(c.documentation.sections.some(s=>s.title.startsWith('Estados')));assert(c.documentation.sections.some(s=>s.title.startsWith('A11y')));
  assert(c.cssEvidence.rules.length>0,`No CSS evidence ${c.id}`);
  for(const source of c.sources) assert.equal(source.sha256,createHash('sha256').update(fs.readFileSync(`${root}/${source.path}`)).digest('hex'));
  assert(c.snippets.every(s=>s.executable===false));
  for(const e of c.examples){assert.equal(e.htmlCode,fs.readFileSync(`${root}/${e.sources[0].path}`,'utf8'));assert(!/\.\.\./.test(e.htmlCode),`Incomplete HTML ${c.id}/${e.id}`);}
 }
});
test('CSS evidence retains selector and condition scope',()=>{
 const b=catalog.contracts.find(c=>c.id==='button');
 assert(b.cssEvidence.rules.some(r=>r.selector.includes(':hover')));
 assert(b.cssEvidence.rules.some(r=>r.conditions.some(c=>c.startsWith('@layer'))));
 assert(b.cssEvidence.rules.some(r=>r.declarations.some(d=>d.property==='--fs-btn-bg')));
});
test('inline module adapter rejects hidden dependencies and escapes script terminators',()=>{
 assert.match(adaptModule("import { Modal } from 'fokus-styles/js'; const s = '</script>';"),/globalThis.FokusStyles/);
 assert(!adaptModule("const x='</script>';").includes('</script>'));
 for(const code of ["import('https://example.com/x.js')","import x from 'other';","export * from 'other';"]) assert.throws(()=>adaptModule(code));
 assert.throws(()=>renderPreview({title:'x',htmlCode:'',cssCode:'</style><script>x</script>'}));
});
test('real HTTP preview server is allowlisted, no CORS, no repository disclosure',async()=>{
 const server=createPreviewServer({catalog}); await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try {
  const base=`http://127.0.0.1:${server.address().port}`;
  const index=await fetch(base);assert.equal(index.status,200);assert.equal(index.headers.get('access-control-allow-origin'),null);
  assert(index.headers.get('content-security-policy').includes("form-action 'none'"));
  for(const p of ['/package.json','/.git/config','/docs/components/modal.md','/%2e%2e/package.json','/dist/../package.json']) assert.equal((await fetch(base+p)).status,404,p);
  assert.equal((await fetch(base+'/dist/js/fokus.js')).headers.get('content-type'),'text/javascript; charset=utf-8');
  for(const c of catalog.contracts){const response=await fetch(base+`/components/${c.id}`);assert.equal(response.status,200);const html=await response.text();assert(!html.includes('allow-same-origin'));}
 } finally {server.closeAllConnections();await new Promise(r=>server.close(r));}
});
