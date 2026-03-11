/* CustomerHub – main script */

(function () {
  'use strict';

  // ── Footer year ────────────────────────────────────────────────────────────
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav link on scroll ──────────────────────────────────────────────
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollY = window.scrollY;
    sections.forEach(function (section) {
      var top = section.offsetTop - 80;
      var bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + section.id);
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  // ── Animate cards on scroll (IntersectionObserver) ────────────────────────
  var animateItems = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animateItems.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animateItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show all items
    animateItems.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Animated stat counters ─────────────────────────────────────────────────
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1500;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // ── Contact form validation ────────────────────────────────────────────────
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function setError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(errorId);
    if (field) field.classList.toggle('invalid', !!message);
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      var valid = true;

      if (!name) {
        setError('name', 'nameError', 'Please enter your name.');
        valid = false;
      } else {
        setError('name', 'nameError', '');
      }

      if (!email) {
        setError('email', 'emailError', 'Please enter your email address.');
        valid = false;
      } else if (!validateEmail(email)) {
        setError('email', 'emailError', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('email', 'emailError', '');
      }

      if (!message) {
        setError('message', 'messageError', 'Please enter a message.');
        valid = false;
      } else {
        setError('message', 'messageError', '');
      }

      if (valid && formSuccess) {
        formSuccess.hidden = false;
        form.reset();
        setTimeout(function () {
          formSuccess.hidden = true;
        }, 6000);
      }
    });
  }
})();
