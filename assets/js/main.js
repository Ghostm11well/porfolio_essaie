/* ==========================================================================
   Johan — interactions du portfolio
   Aucune dépendance externe. Le contenu reste lisible sans JavaScript.
   ========================================================================== */

(function () {
  'use strict';

  var docEl = document.documentElement;
  var body = document.body;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('[data-header]');
  var progress = document.querySelector('[data-progress]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');
  var menuLinks = menuPanel ? Array.prototype.slice.call(menuPanel.querySelectorAll('a[href]')) : [];
  var mainContent = document.querySelector('main');
  var footer = document.querySelector('footer');
  var brandLink = document.querySelector('.brand');
  var skipLink = document.querySelector('.skip-link');
  var menuOpen = false;
  var lastFocused = null;
  var closeMenuTimer = null;

  /* ------------------------------------------------------------------------
     Année et état prêt
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-current-year]').forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  docEl.setAttribute('data-ready', '');
  docEl.classList.remove('js-fallback');

  /* ------------------------------------------------------------------------
     En-tête : état au défilement + barre de progression
     ------------------------------------------------------------------------ */
  var scrollTicking = false;

  function updateScrollUI() {
    var scrollTop = window.scrollY || window.pageYOffset;
    var scrollable = docEl.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle('is-scrolled', scrollTop > 24);
    }

    if (progress) {
      var ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }

    scrollTicking = false;
  }

  function requestScrollUpdate() {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateScrollUI();

  /* ------------------------------------------------------------------------
     Apparitions discrètes au défilement
     ------------------------------------------------------------------------ */
  var revealElements = document.querySelectorAll('[data-reveal], [data-title-reveal], [data-figure-reveal]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -5% 0px'
    });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------------
     Navigation active selon la section visible
     ------------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav__link'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          var isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, {
      rootMargin: '-42% 0px -52% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Menu mobile accessible
     ------------------------------------------------------------------------ */
  function getMenuFocusables() {
    if (!menuToggle) return menuLinks;
    return [menuToggle].concat(menuLinks);
  }

  function setPageInert(isInert) {
    if (mainContent) mainContent.inert = isInert;
    if (footer) footer.inert = isInert;
    if (brandLink) brandLink.tabIndex = isInert ? -1 : 0;
    if (skipLink) skipLink.tabIndex = isInert ? -1 : 0;
  }

  function openMenu() {
    if (!menuPanel || !menuToggle || menuOpen) return;

    window.clearTimeout(closeMenuTimer);
    menuOpen = true;
    lastFocused = document.activeElement;
    menuPanel.hidden = false;
    menuPanel.inert = false;

    window.requestAnimationFrame(function () {
      menuPanel.classList.add('is-open');
    });

    body.classList.add('menu-open');
    setPageInert(true);
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fermer le menu');
    var toggleText = menuToggle.querySelector('.menu-toggle__text');
    if (toggleText) toggleText.textContent = 'Fermer';

    window.setTimeout(function () {
      if (menuLinks[0]) menuLinks[0].focus();
    }, 80);
  }

  function closeMenu(restoreFocus) {
    if (!menuPanel || !menuToggle || !menuOpen) return;

    menuOpen = false;
    menuPanel.classList.remove('is-open');
    menuPanel.inert = true;
    body.classList.remove('menu-open');
    setPageInert(false);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    var toggleText = menuToggle.querySelector('.menu-toggle__text');
    if (toggleText) toggleText.textContent = 'Menu';

    window.clearTimeout(closeMenuTimer);
    closeMenuTimer = window.setTimeout(function () {
      if (!menuOpen) menuPanel.hidden = true;
    }, 420);

    if (restoreFocus !== false) {
      var canRestore = lastFocused &&
        lastFocused !== document.body &&
        document.contains(lastFocused) &&
        !lastFocused.closest('[inert]');
      var target = canRestore ? lastFocused : menuToggle;
      target.focus();
    }
  }

  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', function () {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuPanel.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) {
        closeMenu(false);

        window.setTimeout(function () {
          if (!menuOpen && menuToggle) {
            menuToggle.focus({ preventScroll: true });
          }
        }, 450);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!menuOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      var focusables = getMenuFocusables().filter(function (element) {
        return element && !element.disabled && element.offsetParent !== null;
      });

      if (!focusables.length) return;

      var currentIndex = focusables.indexOf(document.activeElement);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (currentIndex === -1) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && currentIndex === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && currentIndex === focusables.length - 1) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (menuOpen && window.innerWidth > 1180) {
        closeMenu(false);
      }
    });
  }

  window.addEventListener('pageshow', function () {
    if (menuOpen) closeMenu(false);
  });

  /* ------------------------------------------------------------------------
     Lumière sur le portrait
     ------------------------------------------------------------------------ */
  var lightbox = document.querySelector('#lightbox');
  var lightboxOpeners = document.querySelectorAll('[data-lightbox-open]');
  var lightboxOpener = null;

  if (lightbox && lightboxOpeners.length && typeof lightbox.showModal === 'function') {
    lightboxOpeners.forEach(function (opener) {
      opener.addEventListener('click', function (event) {
        event.preventDefault();
        if (menuOpen) closeMenu(false);
        lightboxOpener = opener;
        lightbox.showModal();
        body.classList.add('lightbox-open');
      });
    });

    var closeLightbox = lightbox.querySelector('[data-lightbox-close]');

    if (closeLightbox) {
      closeLightbox.addEventListener('click', function () {
        lightbox.close();
      });
    }

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });

    lightbox.addEventListener('close', function () {
      body.classList.remove('lightbox-open');
      if (lightboxOpener && document.contains(lightboxOpener)) {
        lightboxOpener.focus();
      }
      lightboxOpener = null;
    });
  }

  /* ------------------------------------------------------------------------
     Coordonnées fournies dans site-config.js
     ------------------------------------------------------------------------ */
  var config = window.JOHAN_CONFIG || {};
  var email = typeof config.email === 'string' ? config.email.trim() : '';
  var phone = typeof config.phone === 'string' ? config.phone.trim() : '';
  var socials = config.socials || {};
  var socialLabels = {
    linkedin: 'LinkedIn',
    instagram: 'Instagram'
  };

  if (phone) {
    document.querySelectorAll('[data-contact-phone-text]').forEach(function (element) {
      element.textContent = phone;
      element.classList.remove('is-pending');
    });
  }

  if (email) {
    document.querySelectorAll('[data-contact-email]').forEach(function (element) {
      element.classList.remove('is-pending');
      element.removeAttribute('aria-disabled');

      if (element.tagName === 'A') {
        element.setAttribute('href', 'mailto:' + email);

        var nestedText = element.querySelector('[data-contact-email-text]');
        if (nestedText) {
          nestedText.textContent = email;
        } else {
          element.textContent = email;
        }
      }
    });

    document.querySelectorAll('[data-contact-email-text]').forEach(function (element) {
      element.textContent = email;
      element.classList.remove('is-pending');
    });

    document.querySelectorAll('[data-contact-email-note]').forEach(function (element) {
      element.hidden = true;
    });
  }

  Object.keys(socialLabels).forEach(function (key) {
    var url = typeof socials[key] === 'string' ? socials[key].trim() : '';

    if (!url || !/^https?:\/\//i.test(url)) return;

    document.querySelectorAll('[data-social-slot="' + key + '"]').forEach(function (slot) {
      var link = document.createElement('a');
      link.className = 'social-slot social-slot--link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = '<span class="social-slot__name">' + socialLabels[key] +
        '</span><span class="social-slot__status">Voir le profil <span aria-hidden="true">↗</span></span>';

      slot.replaceWith(link);
    });
  });

  var footerSocials = document.querySelector('[data-footer-socials]');

  if (footerSocials) {
    var footerSocialLinks = [];

    Object.keys(socialLabels).forEach(function (key) {
      var url = typeof socials[key] === 'string' ? socials[key].trim() : '';

      if (!url || !/^https?:\/\//i.test(url)) return;

      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = socialLabels[key] + ' ↗';
      footerSocialLinks.push(link);
    });

    if (footerSocialLinks.length) {
      footerSocials.replaceChildren.apply(footerSocials, footerSocialLinks);
    }
  }
})();
