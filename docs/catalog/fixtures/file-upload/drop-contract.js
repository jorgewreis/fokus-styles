import { FileDrop } from "fokus-styles/js";
const input = document.getElementById('audited-files'); const label = document.querySelector('label[for="audited-files"]'); const lock = document.getElementById('audited-lock'); const output = document.getElementById('audited-selection');
const instance = FileDrop.getInstance(label) || new FileDrop(label); const controller = new AbortController();
input.addEventListener('change', () => { output.textContent = `${input.files.length} arquivo(s) selecionado(s) localmente.`; }, { signal: controller.signal });
lock.addEventListener('click', () => { input.disabled = !input.disabled; lock.setAttribute('aria-pressed', String(input.disabled)); lock.textContent = input.disabled ? 'Desbloquear seleção' : 'Bloquear seleção'; }, { signal: controller.signal });
window.addEventListener('pagehide', () => { controller.abort(); instance.dispose(); label.classList.remove('is-dragover'); input.disabled = false; lock.setAttribute('aria-pressed', 'false'); lock.textContent = 'Bloquear seleção'; }, { once: true });
