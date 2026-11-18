/**
* Template Name: Style
* Template URL: https://bootstrapmade.com/style-bootstrap-portfolio-template/
* Updated: Jul 02 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  const selectBody = document.querySelector('body');
  const selectHeader = document.querySelector('#header');
  const logoLink = document.querySelector('.navmenu .logo');
  const navmenulinks = document.querySelectorAll('.navmenu a');
  let scrollTop = document.querySelector('.scroll-top');
  let scrollRaf = 0;

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    if (!selectBody || !selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  /**
   * Scroll top button visibility
   */
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  function onScrollFrame() {
    scrollRaf = 0;
    toggleScrolled();
    toggleScrollTop();
  }

  function requestScrollUpdate() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(onScrollFrame);
  }

  document.addEventListener('scroll', requestScrollUpdate, { passive: true });

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const mobileNavToggleIcon = mobileNavToggleBtn ? mobileNavToggleBtn.querySelector('i') : null;

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    if (mobileNavToggleIcon) {
      mobileNavToggleIcon.classList.toggle('bi-list');
      mobileNavToggleIcon.classList.toggle('bi-x');
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      const configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      let config;
      try {
        config = JSON.parse(configElement.innerHTML.trim());
      } catch (error) {
        return;
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  /**
   * Defer non-critical widgets until after LCP / main-thread idle time.
   */
  window.addEventListener('load', aosInit);

  function initDeferredWidgets() {
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }

    const selectTyped = document.querySelector('.typed');
    if (selectTyped && typeof Typed !== 'undefined') {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',').map((item) => item.trim());
      new Typed('.typed', {
        strings: typed_strings,
        contentType: 'null',
        loop: true,
        startDelay: 250,
        smartBackspace: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        showCursor: false
      });
    }

    document.querySelectorAll('.skills-animation').forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function (direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });

          if (item.dataset.countersStarted !== 'true') {
            const skillCounters = item.querySelectorAll('.skill-purecounter');
            skillCounters.forEach((counter) => counter.classList.add('purecounter'));
            if (skillCounters.length && typeof PureCounter !== 'undefined') {
              new PureCounter();
            }
            item.dataset.countersStarted = 'true';
          }

          this.destroy();
        }
      });
    });

    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }

    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      const isotopeContainer = isotopeItem.querySelector('.isotope-container');
      if (!isotopeContainer || typeof imagesLoaded === 'undefined' || typeof Isotope === 'undefined') return;

      let initIsotope;
      imagesLoaded(isotopeContainer, function () {
        initIsotope = new Isotope(isotopeContainer, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
          const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (activeFilter) {
            activeFilter.classList.remove('filter-active');
          }
          this.classList.add('filter-active');
          if (!initIsotope) return;
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          aosInit();
        }, false);
      });
    });

    initSwiper();

    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initDeferredWidgets);
  } else {
    setTimeout(initDeferredWidgets, 500);
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function () {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop, 10),
            behavior: 'smooth'
          });
        }, 100);
      }
    } else if (logoLink && window.scrollY < 200) {
      logoLink.setAttribute('aria-current', 'page');
    }
  });

  /**
   * Navmenu Scrollspy via IntersectionObserver (avoids forced reflow from offsetTop reads)
   */
  function setActiveNavLink(activeLink) {
    navmenulinks.forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'true');
      if (logoLink) logoLink.removeAttribute('aria-current');
      return;
    }

    if (logoLink && window.scrollY < 200) {
      logoLink.setAttribute('aria-current', 'page');
    }
  }

  const sectionLinks = [];
  navmenulinks.forEach((link) => {
    if (!link.hash) return;
    const section = document.querySelector(link.hash);
    if (!section) return;
    sectionLinks.push({ link, section });
  });

  if ('IntersectionObserver' in window && sectionLinks.length) {
    const visible = new Map();

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.set(entry.target.id, entry.intersectionRatio);
        } else {
          visible.delete(entry.target.id);
        }
      });

      let bestId = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      const match = sectionLinks.find(({ section }) => section.id === bestId);
      setActiveNavLink(match ? match.link : null);
    }, {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sectionLinks.forEach(({ section }) => spyObserver.observe(section));
  } else {
    // Fallback for very old browsers
    function navmenuScrollspy() {
      let activeLink = null;
      const position = window.scrollY + 200;
      sectionLinks.forEach(({ link, section }) => {
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          activeLink = link;
        }
      });
      setActiveNavLink(activeLink);
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        toggleScrolled();
        toggleScrollTop();
        navmenuScrollspy();
      });
    }, { passive: true });
  }

})();
