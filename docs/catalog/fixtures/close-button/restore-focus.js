const controller = new AbortController();
const open = document.getElementById('open-local-panel'); const close = document.getElementById('close-local-panel'); const panel = document.getElementById('local-panel');
open.addEventListener('click', () => { panel.hidden = false; open.setAttribute('aria-expanded', 'true'); close.focus(); }, { signal: controller.signal });
close.addEventListener('click', () => { panel.hidden = true; open.setAttribute('aria-expanded', 'false'); open.focus(); }, { signal: controller.signal });
window.addEventListener('pagehide', () => controller.abort(), { once: true });
