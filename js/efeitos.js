/* ═══════════════════════════════════════════
   AGROTECH — EFEITOS DOS CARDS
   1) holofote que segue o mouse dentro do card
   2) cards aparecem suavemente ao rolar a pagina
   Arquivo independente: nao mexe no main.js.
═══════════════════════════════════════════ */
(function () {
  'use strict';

  var SELETOR = '.feat-card, .mat-card, .member-card, .ref-card, .spec-card';
  var semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function iniciar() {
    var cards = document.querySelectorAll(SELETOR);
    if (!cards.length) return;

    /* ── 1. holofote seguindo o mouse ── */
    var temMouse = window.matchMedia('(hover: hover)').matches;
    if (temMouse && !semAnimacao) {
      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
        card.addEventListener('mouseleave', function () {
          card.style.setProperty('--mx', '50%');
          card.style.setProperty('--my', '0%');
        });
      });
    }

    /* ── 2. revelar ao rolar ── */
    if (semAnimacao || !('IntersectionObserver' in window)) return;

    cards.forEach(function (card) { card.classList.add('fx-reveal'); });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var alvo = entrada.target;
        var atraso = (Number(alvo.dataset.fxOrdem) || 0) * 70;
        setTimeout(function () { alvo.classList.add('fx-in'); }, atraso);
        obs.unobserve(alvo);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    /* ordem dentro de cada grade, pra entrarem em cascata */
    document.querySelectorAll('.features-grid, .mat-grid, .team-grid, .ref-grid, .specs-grid')
      .forEach(function (grade) {
        Array.prototype.forEach.call(grade.children, function (filho, i) {
          if (filho.matches(SELETOR)) filho.dataset.fxOrdem = i;
        });
      });

    cards.forEach(function (card) { obs.observe(card); });

    /* rede de segurança: se algo falhar, mostra tudo depois de 2,5s */
    setTimeout(function () {
      document.querySelectorAll('.fx-reveal:not(.fx-in)').forEach(function (c) {
        c.classList.add('fx-in');
      });
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
