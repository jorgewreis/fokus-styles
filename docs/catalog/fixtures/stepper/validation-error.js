import { Stepper } from "fokus-styles/js";
const el = document.querySelector('[data-fs="stepper"]');
const instance = Stepper.getInstance(el) ?? new Stepper(el);
const controller = new AbortController();
const status = document.getElementById('feedback-status');
const confirmation = document.getElementById('feedback-confirm');
el.addEventListener('fs:stepper:beforechange', event => {
 if (confirmation && event.detail.from === 0 && event.detail.to > 0 && !confirmation.checked) {
  event.preventDefault(); instance.setError(0); status.textContent = 'Erro: confirme os dados antes de avançar.'; confirmation.focus();
 } else instance.setError(0, false);
}, { signal: controller.signal });
el.addEventListener('fs:stepper:changed', event => { status.textContent = `Etapa ${event.detail.to + 1} de 3.`; }, { signal: controller.signal });
el.addEventListener('fs:stepper:completed', () => { status.textContent = 'Todas as etapas concluídas.'; }, { signal: controller.signal });
window.addEventListener('pagehide', () => { controller.abort(); instance.dispose(); }, { once: true });
