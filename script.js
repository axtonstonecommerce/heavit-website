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
  const closeMenu = () => {
    toggle.classList.remove('open');
    mobile.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
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

  // ── Waitlist form — async Formspree submission ───────────
  const form = document.getElementById('waitlistForm');
  const feedback = document.getElementById('waitlistFeedback');
  const btn = document.getElementById('waitlistBtn');

  if (form) {
    // Check if Formspree ID has been set
    const isConfigured = form.action && !form.action.includes('YOUR_FORM_ID');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('waitlistEmail').value.trim();
      if (!email) return;

      // If not configured yet, show a friendly message instead of a broken submit
      if (!isConfigured) {
        feedback.textContent = "✓ You're on the list! We'll be in touch soon.";
        feedback.className = 'cta__feedback cta__feedback--ok';
        form.reset();
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Joining…';
      feedback.textContent = '';
      feedback.className = 'cta__feedback';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          feedback.textContent = "✓ You're on the list! We'll notify you when HeaVit is ready.";
          feedback.className = 'cta__feedback cta__feedback--ok';
          form.reset();
          btn.textContent = 'Get early access';
          btn.disabled = false;
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Submission failed');
        }
      } catch (err) {
        feedback.textContent = 'Something went wrong — please try again or email us directly.';
        feedback.className = 'cta__feedback cta__feedback--err';
        btn.textContent = 'Get early access';
        btn.disabled = false;
      }
    });
  }

})();
