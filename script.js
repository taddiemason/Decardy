// Route legacy URL paths to the correct section on page load.
(function () {
  const pathMap = {
    'contact':            '#contact',
    'contact-us':         '#contact',
    'quality':            '#quality',
    'quality-assurance':  '#quality',
    'services':           '#services',
    'secondary-services': '#services',
    'our-services':       '#services',
    'about':              '#about',
    'about-us':           '#about',
    'gallery':            '#gallery',
    'our-work':           '#gallery',
    'portfolio':          '#gallery',
    'why-zinc':           '#why-zinc',
    'zinc':               '#why-zinc',
    'zinc-die-casting':   '#why-zinc',
    'spotlight':          '#examples',
    'projects':           '#examples',
  };

  const segment = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
  const anchor = pathMap[segment];
  if (anchor) {
    window.addEventListener('load', function () {
      const target = document.querySelector(anchor);
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        setTimeout(function () {
          window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
        }, 150);
      }
    });
  }
})();

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
        }
    });
});

// Scroll-driven: navbar shadow + active nav link
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Add shadow class on scroll
    navbar.classList.toggle('scrolled', scrolled > 40);

    // Active nav link tracking
    let current = '';
    const navHeight = navbar.offsetHeight;
    sections.forEach(section => {
        if (scrolled >= section.offsetTop - navHeight - 80) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Parallax on hero
    if (scrolled < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        const heroGraphic = document.querySelector('.hero-graphic');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = String(1 - scrolled / 600);
        }
        if (heroGraphic) {
            heroGraphic.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
    }
}, { passive: true });

// Fade-up scroll animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transition = `opacity 0.55s ease ${i * 0.04}s, transform 0.55s ease ${i * 0.04}s`;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '60px' });

document.querySelectorAll('.fade-up').forEach(el => {
    fadeObserver.observe(el);
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#059669';
            contactForm.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.floating-card').forEach(card => {
        card.style.animation = 'none';
    });
}

// ISO PDF hover preview
(function () {
    const popup = document.getElementById('pdf-popup');
    const frame = document.getElementById('pdf-popup-frame');
    const title = document.getElementById('pdf-popup-title');
    const closeBtn = popup.querySelector('.pdf-popup-close');

    const MARGIN = 16;
    let hideTimer = null;
    let currentCard = null;

    const labelMap = {
        '9001': 'ISO 9001:2015 Certificate',
        '13485': 'ISO 13485:2016 Certificate',
    };

    function positionPopup(card) {
        const rect = card.getBoundingClientRect();
        const popupW = popup.offsetWidth;
        const popupH = popup.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let left = rect.right + MARGIN;
        if (left + popupW > vw - MARGIN) left = rect.left - popupW - MARGIN;
        left = Math.max(MARGIN, Math.min(left, vw - popupW - MARGIN));

        let top = rect.top + rect.height / 2 - popupH / 2;
        top = Math.max(MARGIN, Math.min(top, vh - popupH - MARGIN));

        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
    }

    function showPopup(card) {
        clearTimeout(hideTimer);
        const pdfSrc = card.dataset.pdf;
        const key = pdfSrc.includes('13485') ? '13485' : '9001';
        if (currentCard !== card) {
            currentCard = card;
            frame.src = pdfSrc;
            title.textContent = labelMap[key];
        }
        popup.classList.add('visible');
        popup.setAttribute('aria-hidden', 'false');
        positionPopup(card);
    }

    function hidePopup() {
        hideTimer = setTimeout(() => {
            popup.classList.remove('visible');
            popup.setAttribute('aria-hidden', 'true');
            currentCard = null;
        }, 200);
    }

    document.querySelectorAll('.iso-card').forEach(card => {
        card.addEventListener('mouseenter', () => showPopup(card));
        card.addEventListener('mouseleave', hidePopup);
    });

    popup.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    popup.addEventListener('mouseleave', hidePopup);

    closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimer);
        popup.classList.remove('visible');
        popup.setAttribute('aria-hidden', 'true');
        currentCard = null;
    });

    window.addEventListener('resize', () => {
        if (currentCard && popup.classList.contains('visible')) positionPopup(currentCard);
    });
})();
