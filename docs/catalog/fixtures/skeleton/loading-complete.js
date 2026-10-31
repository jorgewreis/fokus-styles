const controller = new AbortController();
const region = document.getElementById('feedback-region');
const button = document.getElementById('feedback-toggle');
button.addEventListener('click', () => {
 const busy = region.getAttribute('aria-busy') !== 'true';
 region.setAttribute('aria-busy', String(busy));
 document.getElementById('feedback-loading').hidden = !busy;
 document.getElementById('feedback-loaded').hidden = busy;
 document.getElementById('feedback-status').textContent = busy ? 'Carregando conteúdo…' : 'Conteúdo disponível.';
}, { signal: controller.signal });
window.addEventListener('pagehide', () => controller.abort(), { once: true });
