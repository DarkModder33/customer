/* Jersey Girl's Public Adjusting LLC — Main Script */
(function () {
  'use strict';

  /* ── Burger / mobile nav ─────────────────────────────────── */
  var burger  = document.querySelector('.burger');
  var menu    = document.querySelector('.menu');
  var topbar  = document.querySelector('.topbar');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on link click (smooth scroll / navigation)
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!topbar.contains(e.target)) {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Testimonial slider ──────────────────────────────────── */
  var slides  = document.querySelectorAll('.testimonial-slider .slide');
  var dots    = document.querySelectorAll('.testimonial-slider .dot');
  var prevBtn = document.querySelector('.testimonial-slider .prev');
  var nextBtn = document.querySelector('.testimonial-slider .next');

  if (slides.length) {
    var current = 0;

    function goTo(idx) {
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    // Auto-advance every 6 s
    var autoPlay = setInterval(function () { goTo(current + 1); }, 6000);

    // Pause on hover
    var sliderEl = document.querySelector('.testimonial-slider');
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
      sliderEl.addEventListener('mouseleave', function () {
        autoPlay = setInterval(function () { goTo(current + 1); }, 6000);
      });
    }
  }

  /* ── Active nav link ─────────────────────────────────────── */
  var navLinks  = document.querySelectorAll('.menu a');
  var pageHref  = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === pageHref || (pageHref === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
      link.style.color = 'var(--navy)';
      link.style.fontWeight = '700';
    }
  });

  /* ── Smooth anchor scroll ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Contact form (index.html inline form) ───────────────── */
  var form        = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function setFieldError(id, errId, msg) {
    var el  = document.getElementById(id);
    var err = document.getElementById(errId);
    if (el)  el.classList.toggle('invalid', !!msg);
    if (err) err.textContent = msg || '';
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (document.getElementById('name')    || {}).value || '';
      var email   = (document.getElementById('email')   || {}).value || '';
      var message = (document.getElementById('message') || {}).value || '';
      name = name.trim(); email = email.trim(); message = message.trim();
      var ok = true;

      if (!name) {
        setFieldError('name', 'nameError', 'Please enter your name.');
        ok = false;
      } else { setFieldError('name', 'nameError', ''); }

      if (!email) {
        setFieldError('email', 'emailError', 'Please enter your email address.');
        ok = false;
      } else if (!validEmail(email)) {
        setFieldError('email', 'emailError', 'Please enter a valid email address.');
        ok = false;
      } else { setFieldError('email', 'emailError', ''); }

      if (!message) {
        setFieldError('message', 'messageError', 'Please enter a message.');
        ok = false;
      } else { setFieldError('message', 'messageError', ''); }

      if (ok && formSuccess) {
        formSuccess.hidden = false;
        form.reset();
        setTimeout(function () { formSuccess.hidden = true; }, 7000);
      }
    });
  }

  /* ── Animated stat counters ──────────────────────────────── */
  var statNums = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1600;
    var start    = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNums.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { io.observe(el); });
  }

  /* ── Reveal cards on scroll ──────────────────────────────── */
  var revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealItems.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('revealed'); });
  }

})();
