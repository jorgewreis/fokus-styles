import { TreeView } from "fokus-styles/js";
const element=document.querySelector('[data-fs="tree-view"]');
const selected=event=>{document.getElementById('tree-status').textContent=`Selecionado: ${event.detail.value}`;};
element.addEventListener('fs:tree:selected',selected);
const instance=TreeView.getInstance(element) ?? new TreeView(element);
window.addEventListener('pagehide',()=>{instance.dispose();element.removeEventListener('fs:tree:selected',selected);},{once:true});
