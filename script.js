/* =============================================
   VISHWANATH Y ALADINNI — Portfolio JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ── DOM References ── */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  const animateEls = document.querySelectorAll('[data-animate]');

  /* ─────────────────────────────────────────
     1. THEME (Dark / Light Toggle)
  ───────────────────────────────────────── */
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);

    // Brief scale animation on the button
    themeToggle.style.transform = 'scale(0.88)';
    setTimeout(() => { themeToggle.style.transform = ''; }, 180);
  });

  /* ─────────────────────────────────────────
     2. NAVBAR — Scroll Behaviour + Active Link
  ───────────────────────────────────────── */
  function onScroll() {
    // Scroll elevation
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    // Back-to-top visibility
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) {
        currentSection = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─────────────────────────────────────────
     3. HAMBURGER MENU (mobile)
  ───────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────
     4. BACK TO TOP
  ───────────────────────────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────
     5. SCROLL ANIMATION — Intersection Observer
  ───────────────────────────────────────── */
  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for multiple elements in a section
        const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 120;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateEls.forEach(el => observer.observe(el));

  /* ─────────────────────────────────────────
     6. SKILL BARS ANIMATION
  ───────────────────────────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach((fill, i) => {
          setTimeout(() => {
            fill.classList.add('animated');
          }, i * 140);
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ─────────────────────────────────────────
     7. SMOOTH SCROLL for Nav Links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Skip bare "#" links (social buttons, placeholders) — querySelector('#') is invalid
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 68; // navbar height
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     8. CONTACT FORM — Formspree Integration
  ───────────────────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = document.getElementById('send-btn');
      const btnText = btn.querySelector('.btn-text');

      // Validate required fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        shakeMissingFields();
        return;
      }

      // Loading state
      btn.disabled = true;
      btnText.textContent = 'Sending…';

      // ── Real submission to Formspree ──
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          btn.disabled = false;
          btnText.textContent = 'Send Message';

          if (response.ok) {
            // ✅ Success — message delivered to Vishwanath's email
            formSuccess.textContent = '✅ Message sent! Vishwanath will get back to you soon.';
            formSuccess.style.cssText = 'background:rgba(0,229,196,0.1);border-color:rgba(0,229,196,0.3);color:var(--accent-2);';
            formSuccess.classList.add('show');
            contactForm.reset();
          } else {
            // ❌ Formspree returned an error
            formSuccess.textContent = '❌ Could not send. Please email directly: vishwanathalaladinni@gmail.com';
            formSuccess.style.cssText = 'background:rgba(255,85,85,0.1);border-color:rgba(255,85,85,0.3);color:#ff5555;';
            formSuccess.classList.add('show');
          }
          setTimeout(function () { formSuccess.classList.remove('show'); }, 6000);
        })
        .catch(function () {
          btn.disabled = false;
          btnText.textContent = 'Send Message';
          formSuccess.textContent = '❌ Network error. Please check your connection and try again.';
          formSuccess.style.cssText = 'background:rgba(255,85,85,0.1);border-color:rgba(255,85,85,0.3);color:#ff5555;';
          formSuccess.classList.add('show');
          setTimeout(function () { formSuccess.classList.remove('show'); }, 6000);
        });
    });
  }

  function shakeMissingFields() {
    const fields = ['name', 'email', 'message'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.style.borderColor = '#ff5555';
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.animation = '';
        }, 600);
      }
    });
  }

  // Add shake keyframes dynamically if not in CSS
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ─────────────────────────────────────────
     9. DOWNLOAD RESUME (placeholder notice)
  ───────────────────────────────────────── */
  const downloadBtn = document.getElementById('download-resume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      // Replace href with actual PDF path when ready
      showNotice('📄 Resume PDF will be available soon! Please check back later.');
    });
  }

  function showNotice(msg) {
    const notice = document.createElement('div');
    notice.style.cssText = `
      position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
      background: var(--bg-card); border: 1px solid var(--border-hover);
      color: var(--text-primary); padding: 14px 24px;
      border-radius: 12px; font-size: .9rem; font-weight: 600;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      z-index: 9999; animation: fadeIn 0.3s ease;
      max-width: 90%; text-align: center;
    `;
    notice.textContent = msg;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 4000);
  }

  /* ─────────────────────────────────────────
     10. TYPING EFFECT on hero title (subtle)
  ───────────────────────────────────────── */
  // Hero badge pulse is already in CSS, no JS needed

  /* ─────────────────────────────────────────
     11. PROJECT CARDS — Tilt on hover (subtle)
  ───────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -4;
      const rotateY = ((x - midX) / midX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     12. COUNTER ANIMATION in Hero Stats
  ───────────────────────────────────────── */
  function animateCounter(el, target, suffix, decimals) {
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = decimals ? start.toFixed(1) : Math.floor(start);
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = document.querySelectorAll('.stat-num');
        // sem counter (4th)
        if (statNums[0]) {
          const el = statNums[0];
          const txt = el.textContent;
          const num = parseFloat(txt);
          el.innerHTML = '0<sup>th</sup>';
          animateCounter({ set textContent(v) { el.innerHTML = Math.floor(v) + '<sup>th</sup>'; } }, 4, 'th', false);
        }
        // projects (6+)
        if (statNums[1]) {
          const el = statNums[1];
          el.innerHTML = '0';
          animateCounter({ set textContent(v) { el.innerHTML = Math.floor(v) + '+'; } }, 6, '+', false);
        }
        // SGPA (8.4)
        if (statNums[2]) {
          const el = statNums[2];
          el.textContent = '0.0';
          animateCounter({ set textContent(v) { el.textContent = v; } }, 8.79, '', true);
        }
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  console.log('%c Vishwanath Y Aladinni Portfolio', 'color: #4f9eff; font-size: 16px; font-weight: bold;');
  console.log('%c Built with ❤️', 'color: #00e5c4; font-size: 12px;');

})();
