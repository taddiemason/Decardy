// Route legacy URL paths to the correct section on page load.
// This handles any URL the worker didn't redirect (e.g. browser-cached 200s).
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
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Fade in sections on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '100px'
});

// Add fade effect to service cards, gallery items, and sections
document.querySelectorAll('.service-card, .stat-card, .gallery-item').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    fadeObserver.observe(card);
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success message
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';

            // Reset form
            contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Consolidated scroll event handler
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const hero = document.querySelector('.hero');
const heroContent = hero?.querySelector('.hero-content');
const heroGraphic = hero?.querySelector('.hero-graphic');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Navbar background change on scroll
    if (scrolled > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }

    // Add active state to nav links based on scroll position
    let current = '';
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrolled >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Parallax effect on hero section
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }

    if (heroGraphic && scrolled < window.innerHeight) {
        heroGraphic.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Prevent layout shift by preloading critical resources
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.floating-card').forEach(card => {
        card.style.animation = 'none';
    });
}

console.log('%c🚀 Decardy Website', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies', 'color: #00cec9; font-size: 14px;');

// ISO PDF hover preview
(function () {
    const popup = document.getElementById('pdf-popup');
    const frame = document.getElementById('pdf-popup-frame');
    const title = document.getElementById('pdf-popup-title');
    const closeBtn = popup.querySelector('.pdf-popup-close');

    const MARGIN = 16; // px gap from card
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

        // Prefer right of card, fall back to left
        let left = rect.right + MARGIN;
        if (left + popupW > vw - MARGIN) {
            left = rect.left - popupW - MARGIN;
        }
        // Clamp left
        left = Math.max(MARGIN, Math.min(left, vw - popupW - MARGIN));

        // Vertically center on card, then clamp
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
            const absoluteUrl = new URL(pdfSrc, window.location.origin).href;
            frame.src = 'https://docs.google.com/viewer?url=' + encodeURIComponent(absoluteUrl) + '&embedded=true';
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
        if (currentCard && popup.classList.contains('visible')) {
            positionPopup(currentCard);
        }
    });
})();
