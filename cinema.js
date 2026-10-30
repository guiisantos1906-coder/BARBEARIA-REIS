// Recursos visuais e PWA: separados do código de reservas.
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('reisIntro');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) intro?.remove();
  intro?.addEventListener('animationend', (event) => {
    if (event.target === intro) intro.remove();
  });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));
  }
  let promptInstalacao;
  const botaoInstalar = document.getElementById('installReisApp');
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); promptInstalacao = event;
    botaoInstalar.hidden = false;
  });
  botaoInstalar?.addEventListener('click', async () => {
    if (!promptInstalacao) return;
    promptInstalacao.prompt();
    await promptInstalacao.userChoice;
    promptInstalacao = null;
    botaoInstalar.hidden = true;
  });
  window.addEventListener('appinstalled', () => { botaoInstalar.hidden = true; });
});
