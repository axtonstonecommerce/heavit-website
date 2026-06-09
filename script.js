/* HeaVit marketing site — interactions */
(function () {
  'use strict';

  // ── Sticky nav shadow on scroll ──────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile menu ──────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  const closeMenu = () => { toggle.classList.remove('open'); mobile.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobile.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  // ── Scroll-reveal animations ─────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ── Current year in footer ───────────────────────────────
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
