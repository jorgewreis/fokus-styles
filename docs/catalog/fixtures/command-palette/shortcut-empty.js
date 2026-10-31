import { CommandPalette } from "fokus-styles/js";
const element=document.querySelector('[data-fs="command-palette"]');
const selected=event=>{document.getElementById('command-status').textContent=`Selecionado: ${event.detail.value}`;};
element.addEventListener('fs:command-palette:selected',selected);
const instance=CommandPalette.getInstance(element) ?? new CommandPalette(element);
window.addEventListener('pagehide',()=>{instance.dispose();element.removeEventListener('fs:command-palette:selected',selected);},{once:true});
