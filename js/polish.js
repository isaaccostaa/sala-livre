// ============================================================
// Sala Livre — Polimento visual
// Contadores animados, entrada escalonada, ripple nos botões
// e sombra do header ao rolar. Não altera a lógica do app.
// ============================================================

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Contadores animados (0 → valor) ---
  function animateCounter(el) {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target) || reduceMotion) return;

    const duration = 900;
    const start = performance.now();
    el.textContent = '0';

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // --- Entrada escalonada: marca os blocos principais da página ---
  function staggerReveal(root) {
    const page = root.querySelector('.page');
    if (!page) return;
    const selectors = [
      '.dashboard__greeting', '.dashboard__next-class', '.stat-card',
      '.dashboard__lost', '.room-card',
    ];
    page.querySelectorAll(selectors.join(',')).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', Math.min(i, 12));
    });
  }

  function enhance(root) {
    staggerReveal(root);
    root.querySelectorAll('.stat-card__value').forEach(animateCounter);
  }

  // O app troca o conteúdo de #app-content a cada rota; observamos a troca.
  function watchContent() {
    const content = document.getElementById('app-content');
    if (!content) return;
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (content.querySelector('.reveal')) return; // já processado
        enhance(content);
      });
    }).observe(content, { childList: true });
    enhance(content);
  }

  // --- Ripple nos botões ---
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn || reduceMotion) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const dot = document.createElement('span');
      dot.className = 'ripple';
      dot.style.width = dot.style.height = size + 'px';
      dot.style.left = (e.clientX - rect.left - size / 2) + 'px';
      dot.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    });
  }

  // --- Header: sombra mais forte ao rolar ---
  function initHeaderScroll() {
    const header = document.getElementById('app-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    watchContent();
    initRipple();
    initHeaderScroll();
  });
})();
