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
        feedback.textContent = 'Something went wrong. Please try again, or email us directly.';
        feedback.className = 'cta__feedback cta__feedback--err';
        btn.textContent = 'Get early access';
        btn.disabled = false;
      }
    });
  }

  // ── Region-aware pricing (timezone guess → IP geolocation → manual) ──
  (function initPricing() {
    const billingSeg   = document.getElementById('billingSeg');
    const regionToggle = document.querySelector('[data-region-toggle]');
    const regionLabel  = document.querySelector('[data-region-label]');
    const basicCard    = document.querySelector('[data-plan="basic"]');
    const proCard      = document.querySelector('[data-plan="pro"]');
    if (!billingSeg || !basicCard || !proCard) return;

    const PRICING = {
      IN: {
        cur: '₹', allowMonthly: true,
        annual:  { basic: '1,499', pro: '2,499' },
        monthly: { basic: '299',   pro: '499'   },
        label: 'Showing ₹ pricing for India.',
        switchTo: 'View international ($) pricing',
        other: 'INTL',
      },
      INTL: {
        cur: '$', allowMonthly: false,
        annual:  { basic: '29.99', pro: '49.99' },
        label: 'Showing $ pricing for your region.',
        switchTo: 'View ₹ India pricing',
        other: 'IN',
      },
    };

    let region = 'IN';       // sensible default; refined below
    let billing = 'annual';  // default to the better-value option
    let userPicked = false;  // a manual region choice wins over geolocation

    const setAmt = (card, value, per, note) => {
      card.querySelector('[data-amt]').textContent = value;
      card.querySelector('[data-per]').textContent = per;
      const n = card.querySelector('[data-billnote]');
      if (n) n.textContent = note;
    };

    function render() {
      const p = PRICING[region];
      const effective = p.allowMonthly ? billing : 'annual';
      const amts = p[effective];
      const per  = effective === 'annual' ? '/year' : '/month';
      const note = effective === 'annual' ? 'Billed annually' : 'Billed monthly';
      setAmt(basicCard, p.cur + amts.basic, per, note);
      setAmt(proCard,   p.cur + amts.pro,   per, note);

      billingSeg.classList.toggle('is-hidden', !p.allowMonthly);
      billingSeg.querySelectorAll('.seg__btn').forEach((b) =>
        b.classList.toggle('is-active', b.dataset.billing === effective));

      if (regionLabel)  regionLabel.textContent  = p.label;
      if (regionToggle) regionToggle.textContent = p.switchTo;
    }

    billingSeg.querySelectorAll('.seg__btn').forEach((b) => {
      b.addEventListener('click', () => { billing = b.dataset.billing; render(); });
    });
    if (regionToggle) {
      regionToggle.addEventListener('click', () => {
        userPicked = true;
        region = PRICING[region].other;
        render();
      });
    }

    // 1) Instant best-guess from timezone (no network, not blockable)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      region = /Asia\/(Kolkata|Calcutta)/.test(tz) ? 'IN' : 'INTL';
    } catch (e) { /* keep default */ }
    render();

    // 2) Refine via IP geolocation (authoritative); ignore failures
    fetch('https://ipwho.is/?fields=country_code', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (userPicked || !d || !d.country_code) return;
        region = d.country_code === 'IN' ? 'IN' : 'INTL';
        render();
      })
      .catch(() => { /* timezone default stands */ });
  })();

})();
