// Global UI Interactions
document.addEventListener('DOMContentLoaded', () => {
  setupStickyHeader();
  setupMobileMenu();
  setupScrollReveal();
  setupBackToTop();
  setupNewsletter();
});

// 1. Sticky Navigation Header
function setupStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('py-3', 'shadow-gold-glow');
      header.classList.remove('py-6');
    } else {
      header.classList.remove('py-3', 'shadow-gold-glow');
      header.classList.add('py-6');
    }
  });
}

// 2. Mobile Menu Toggle
function setupMobileMenu() {
  const menuBtn = document.getElementById('btn-menu-toggle');
  const closeBtn = document.getElementById('btn-menu-close');
  const drawer = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (!drawer || !menuBtn) return;

  const openMenu = () => {
    drawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    document.body.classList.add('modal-active');
  };

  const closeMenu = () => {
    drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('modal-active');
  };

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

// 3. Scroll Reveal Observer
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animation triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => observer.observe(reveal));
}

// 4. Back To Top Button
function setupBackToTop() {
  const btn = document.getElementById('btn-back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-5');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-5');
    }
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 5. Newsletter Signups
function setupNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        if (typeof cartSystem !== 'undefined') {
          cartSystem.showToast('Subscription successful! Check your inbox.');
        } else {
          alert('Subscription successful! Thank you.');
        }
        input.value = '';
      }
    });
  });
}
