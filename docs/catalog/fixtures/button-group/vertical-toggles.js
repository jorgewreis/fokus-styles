const controller = new AbortController();
for (const button of document.querySelectorAll('#vertical-toggles button')) button.addEventListener('click', () => button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true')), { signal: controller.signal });
window.addEventListener('pagehide', () => controller.abort(), { once: true });
