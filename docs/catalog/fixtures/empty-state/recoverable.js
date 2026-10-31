const controller = new AbortController();
const empty = document.getElementById('feedback-empty');
document.getElementById('feedback-toggle').addEventListener('click', () => {
 empty.hidden = !empty.hidden;
 document.getElementById('feedback-results').hidden = !empty.hidden;
 document.getElementById('feedback-status').textContent = empty.hidden ? '1 resultado disponível.' : 'Nenhum resultado.';
}, { signal: controller.signal });
window.addEventListener('pagehide', () => controller.abort(), { once: true });
