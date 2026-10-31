import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { compile } from 'sass';
import postcss from 'postcss';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const hash = s => createHash('sha256').update(s).digest('hex');
const sorted = values => [...new Set(values)].sort();
const aliases = {alert:'alerts',badge:'badges',breadcrumb:'breadcrumbs',button:'buttons',card:'cards',table:'tables',toast:'toasts',tooltip:'tooltips'};
const formSources = {checkbox:'check-radio-switch',radio:'check-radio-switch',switch:'check-radio-switch',input:'forms','input-group':'forms',select:'forms','file-upload':'forms',range:'range','file-upload-advanced':'file-upload-advanced'};
const jsAliases = {'alert-dialog':'confirm','file-upload':'file-drop'};
const groups = {
 'Formulários': 'checkbox combobox datepicker file-upload file-upload-advanced input input-group radio range rating select segmented-control switch'.split(' '),
 'Navegação e overlays': 'accordion alert-dialog breadcrumb carousel collapse command-palette dropdown menu modal navbar nested-menu offcanvas pagination popover scrollspy stepper tabs tooltip tree-view'.split(' ')
};
const scopeOverrides = {checkbox:['fs-check'],radio:['fs-radio'],switch:['fs-switch'],input:['fs-input','fs-label','fs-form','fs-textarea'], 'input-group':['fs-input-group'],select:['fs-form-select','fs-dropdown'], 'file-upload':['fs-file'],range:['fs-range'],progress:['fs-progress','fs-spinner']};
function walk(dir) { return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e => e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]); }
function sections(markdown) {
 const parts=markdown.split(/^## /m); return parts.slice(1).map(p=>({title:p.slice(0,p.indexOf('\n')).trim(),markdown:p.slice(p.indexOf('\n')+1).trim()}));
}
function snippets(markdown,id) {
 const out=[];let section='Introdução'; let inFence=false; let lang=''; let lines=[];
 for(const line of markdown.split('\n')) {
  if(!inFence && line.startsWith('## ')) section=line.slice(3);
  if(line.startsWith('```')) {
   if(inFence) out.push({id:`${id}-snippet-${out.length+1}`,language:lang,code:lines.join('\n'),section,executable:false});
   else {lang=line.slice(3).trim();lines=[];}
   inFence=!inFence;
  } else if(inFence) lines.push(line);
 }
 if(inFence) throw new Error(`Unclosed code fence: ${id}`);
 return out;
}
function sourceEntry(p) { return {path:p,sha256:hash(read(p))}; }
function sourceFiles(id) {
 const scss=formSources[id]?`packages/fokus-components/scss/forms/_${formSources[id]}.scss`:`packages/fokus-components/scss/components/_${aliases[id]||id}.scss`;
 const files=[`docs/components/${id}.md`,scss];
 if(id==='progress') files.push('packages/fokus-components/scss/components/_spinner.scss');
 const js=`packages/fokus-js/js/${jsAliases[id]||id}.js`;
 if(fs.existsSync(path.join(root,js))) {files.push(js); const types=js.replace(/\.js$/,'.d.ts'); if(fs.existsSync(path.join(root,types))) files.push(types);}
 if(id==='progress') files.push('packages/fokus-js/js/spinner.js','packages/fokus-js/js/spinner.d.ts');
 return sorted(files);
}
function rulesFor(cssRoot,scopes) {
 const out=[];
 cssRoot.walkRules(rule=>{
  const classes=[...rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m=>m[1]);
  if(!classes.some(c=>scopes.some(scope=>c===scope||c.startsWith(`${scope}-`)))) return;
  const conditions=[]; for(let p=rule.parent;p;p=p.parent) if(p.type==='atrule') conditions.unshift(`@${p.name} ${p.params}`.trim());
  const declarations=(rule.nodes||[]).filter(n=>n.type==='decl').map(n=>({property:n.prop,value:n.value,...(n.important?{important:true}:{})}));
  if(declarations.length) out.push({selector:rule.selector,conditions,declarations});
 }); return out;
}
function fixturePath(p) {
 if(typeof p!=='string'||!p.startsWith('docs/catalog/fixtures/')||p.split('/').includes('..')) throw new Error(`Invalid fixture path ${p}`);
 return p;
}
export function generateCatalog() {
 const ids=fs.readdirSync(path.join(root,'docs/components')).filter(p=>p.endsWith('.md')).map(p=>p.slice(0,-3)).sort();
 const canonical=JSON.parse(read('docs/catalog/components.json'));
 if(JSON.stringify(ids)!==JSON.stringify(canonical)) throw new Error('Catalog IDs diverge from docs; review components.json explicitly.');
 const css=compile(path.join(root,'scss/fokus.scss'),{style:'expanded',logger:{warn(){},debug(){}}}).css;
 const cssRoot=postcss.parse(css);
 const exported=read('packages/fokus-js/js/fokus.js');
 const examples=fs.existsSync(path.join(root,'docs/catalog/examples.json'))?JSON.parse(read('docs/catalog/examples.json')):{};
 for(const id of Object.keys(examples)) if(!ids.includes(id)) throw new Error(`Orphan examples: ${id}`);
 const contracts=ids.map(id=>{
  const documentPath=`docs/components/${id}.md`; const markdown=read(documentPath); const files=sourceFiles(id);
  for(const p of files) if(!fs.existsSync(path.join(root,p))) throw new Error(`Missing source: ${p}`);
  const scss=files.filter(p=>p.endsWith('.scss')).map(read).join('\n');
  const scopes=scopeOverrides[id]||sorted([...scss.matchAll(/\.(fs-[\w-]+)/g)].map(m=>m[1].replace(/-$/,'')));
  const imports=[];
  for(const match of exported.matchAll(/export \{ ([^}]+) \} from "\.\/([^";]+)"/g)) {
   const source=`packages/fokus-js/js/${match[2]}`;
   if(files.includes(source)) for(const name of match[1].split(',').map(x=>x.trim())) imports.push({name,from:'fokus-styles/js',source});
  }
  const seen=new Set();
  const resolvedExamples=(examples[id]||[]).map(e=>{
   if(!/^[a-z0-9-]+$/.test(e.id)||seen.has(e.id)||!e.title) throw new Error(`Invalid/duplicate example: ${id}/${e.id}`); seen.add(e.id);
   const htmlCode=read(fixturePath(e.html)); const jsCode=e.js?read(fixturePath(e.js)):''; const cssCode=e.css?read(fixturePath(e.css)):'';
   if(/\b(?:import\s*\(|export\s*\*|import\s*['"])/.test(jsCode)) throw new Error(`Unsupported module loading: ${id}/${e.id}`);
   for(const m of jsCode.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)) {
    if(m[2]!=='fokus-styles/js') throw new Error(`External import: ${id}/${e.id}`);
    for(const name of m[1].split(',').map(s=>s.trim())) if(!new RegExp(`\\b${name}\\b`).test(exported)) throw new Error(`Unknown export ${name}`);
   }
   return {id:e.id,title:e.title,htmlCode,jsCode,cssCode,coverage:e.coverage||[],limitations:e.limitations||[],sources:[e.html,e.js,e.css].filter(Boolean).map(sourceEntry)};
  });
  return {id,title:markdown.match(/^# (.+)$/m)[1],group:Object.entries(groups).find(([,ids])=>ids.includes(id))?.[0]||'Conteúdo e feedback',status:'partial',
   documentation:{path:documentPath,markdown,sections:sections(markdown)},sources:files.map(sourceEntry),imports,
   runtimeEvidence:files.filter(p=>p.endsWith('.js')).map(p=>({path:p,attributes:read(p).split('\n').flatMap((line,index)=>[...line.matchAll(/(?:getAttribute|setAttribute|hasAttribute|removeAttribute)\(\s*['"]([^'"]+)['"]/g)].map(m=>({name:m[1],line:index+1,code:line.trim()}))),meaning:'Atributos lidos/escritos pela implementação; inclui estado interno e não promove cada ocorrência a opção pública. Consultar documentação e tipos.'})),
   typeDefinitions:files.filter(p=>p.endsWith('.d.ts')).map(p=>({path:p,code:read(p)})),
   cssEvidence:{scopeClasses:scopes,rules:rulesFor(cssRoot,scopes),meaning:'Regras compiladas que mencionam classes do escopo; preservar seletor completo, condições e ordem. Evidência de implementação, não garantia de que qualquer token citado funcione em qualquer estado.'},
   snippets:snippets(markdown,id),examples:resolvedExamples,
   limitations:['Documentação e código preservados da base candidata; cobertura parcial, não certificação de todas as variantes ou combinações.','Snippets históricos são trechos de referência; somente exemplos explicitamente revisados são executáveis.','Maturidade: consultar docs/reference/stability.md; presença no catálogo não promove estabilidade.']};
 });
 const inputs=sorted([...walk('packages').filter(p=>/\.(scss|js|ts)$/.test(p)&&!p.includes('/icons/')),...walk('scss'),...walk('docs/components'),...walk('docs/catalog').filter(p=>p.endsWith('.json')||p.includes('/fixtures/')),'scripts/catalog.mjs','package.json','package-lock.json']);
 const manifest=inputs.map(sourceEntry);
 return {schemaVersion:1,channel:'next',published:false,source:{baselineCommit:'218afe443936e31edd57fdca03b392ac23381d1d',digest:hash(JSON.stringify(manifest)),sassEvidenceCssSha256:hash(css),files:manifest},coverage:{components:contracts.length,withExamples:contracts.filter(c=>c.examples.length).length,examples:contracts.reduce((n,c)=>n+c.examples.length,0),complete:false},contracts};
}
export function writeOrCheck(check=false) {
 const catalog=generateCatalog(); const out=path.join(root,'docs/generated/next/catalog.json'); const content=JSON.stringify(catalog,null,2)+'\n';
 if(check) {if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==content) throw new Error('Generated catalog is stale. Run npm run docs:generate.');}
 else {fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,content);}
 console.log(`Catalog: ${catalog.coverage.components} components; ${catalog.coverage.examples} reviewed examples; next/unpublished; partial.`);
 return catalog;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) writeOrCheck(process.argv.includes('--check'));
