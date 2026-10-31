import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './catalog.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function adaptModule(code) {
 const adapted=code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]fokus-styles\/js['"];?/g,(_,names)=>{
  if(!names.split(',').every(name=>/^[A-Za-z_$][\w$]*$/.test(name.trim()))) throw new Error('Only named imports supported');
  return `const {${names}} = globalThis.FokusStyles;`;
 });
 if(/\b(?:import|export)\s*(?:[({*]|['"]|\w)/.test(adapted)) throw new Error('Unsupported module graph');
 return adapted.replace(/<\/script/gi,'<\\/script');
}
function shell(title,content) {return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${escape(title)} — Fokus Styles next</title><style>body{font:1rem/1.55 system-ui;max-width:76rem;margin:auto;padding:1.25rem;color:#172033;background:#fff}a{color:#3730a3}pre{overflow:auto;background:#f3f4f6;padding:1rem;white-space:pre-wrap;overflow-wrap:anywhere}iframe{width:100%;height:30rem;border:1px solid #64748b}li{margin:.4rem 0}code{overflow-wrap:anywhere}</style><main><a href="/">Catálogo next</a><h1>${escape(title)}</h1><p>Candidato não publicado; cobertura parcial. Não é o pacote npm 2.7.0 publicado.</p>${content}</main></html>`;}
export function renderPreview(example) {
 const code=adaptModule(example.jsCode||'');
 if(/<\/(?:style)/i.test(example.cssCode||'')) throw new Error('Unsafe style terminator');
 return `<!doctype html><html lang="pt-BR" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(example.title)}</title><link rel="stylesheet" href="/dist/css/fokus.css"><style>body{padding:1rem;min-height:20rem}${example.cssCode||''}</style></head><body>${example.htmlCode}<script src="/dist/js/fokus.js"></script><script type="module">${code}\ndocument.documentElement.dataset.previewReady='true';</script></body></html>`;
}
export function createPreviewServer({catalog=JSON.parse(fs.readFileSync(path.join(root,'docs/generated/next/catalog.json'),'utf8'))}={}) {
 const contracts=new Map(catalog.contracts.map(c=>[c.id,c]));
 return http.createServer((req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'");
  const send=(status,type,body)=>{res.writeHead(status,{'Content-Type':type});res.end(body);};
  if(req.method!=='GET'&&req.method!=='HEAD') return send(405,'text/plain; charset=utf-8','Method not allowed');
  let pathname;try{pathname=new URL(req.url,'http://localhost').pathname;}catch{return send(400,'text/plain; charset=utf-8','Bad request');}
  try {
   if(pathname==='/') return send(200,'text/html; charset=utf-8',shell('56 componentes',`<ul>${catalog.contracts.map(c=>`<li><a href="/components/${c.id}">${escape(c.title)}</a> — ${c.examples.length} exemplos revisados</li>`).join('')}</ul>`));
   if(pathname==='/catalog.json') return send(200,'application/json; charset=utf-8',JSON.stringify(catalog));
   if(['/dist/css/fokus.css','/dist/js/fokus.js'].includes(pathname)) {
    const p=path.join(root,pathname.slice(1));
    if(!fs.existsSync(p)) return send(404,'text/plain; charset=utf-8','Build required');
    return send(200,pathname.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8',fs.readFileSync(p));
   }
   const component=pathname.match(/^\/components\/([a-z0-9-]+)$/);
   if(component&&contracts.has(component[1])) {
    const c=contracts.get(component[1]);
    return send(200,'text/html; charset=utf-8',shell(c.title,`<p>${escape(c.group)}</p><h2>Exemplos revisados</h2>${c.examples.length?c.examples.map(e=>`<section><h3>${escape(e.title)}</h3><iframe title="${escape(c.title+' — '+e.title)}" sandbox="allow-scripts" src="/previews/${c.id}/${e.id}"></iframe><details><summary>Código HTML</summary><pre tabindex="0"><code>${escape(e.htmlCode)}</code></pre></details>${e.jsCode?`<details><summary>Código JavaScript</summary><pre tabindex="0"><code>${escape(e.jsCode)}</code></pre></details>`:''}${e.cssCode?`<details><summary>CSS de composição</summary><pre tabindex="0"><code>${escape(e.cssCode)}</code></pre></details>`:''}</section>`).join(''):'<p>Exemplo executável ainda pendente de revisão.</p>'}<h2>Documentação preservada</h2><pre tabindex="0">${escape(c.documentation.markdown)}</pre><h2>Limites</h2><ul>${c.limitations.map(l=>`<li>${escape(l)}</li>`).join('')}</ul>`));
   }
   const preview=pathname.match(/^\/previews\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
   if(preview){const e=contracts.get(preview[1])?.examples.find(e=>e.id===preview[2]);if(e)return send(200,'text/html; charset=utf-8',renderPreview(e));}
   send(404,'text/plain; charset=utf-8','Not found');
  } catch {send(500,'text/plain; charset=utf-8','Preview rendering failed');}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT||8890);createPreviewServer().listen(port,'127.0.0.1',()=>console.log(`Catalog preview http://127.0.0.1:${port}`));
}
