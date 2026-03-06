/**
 * E-Zero - Main Application JavaScript
 * Django Version - Professional Business Landing Page
 */

// ============================================
// DOM READY INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initImpactCounters();
  initNotifications();
  console.log('🌱 E-Zero Django App Initialized');
});

// ============================================
// HEADER FUNCTIONALITY
// ============================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.querySelector('i').className = 'fas fa-bars';
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Global scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.scrollToSection = scrollToSection;

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}

// ============================================
// IMPACT COUNTER ANIMATION
// ============================================
function initImpactCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const impactSection = document.querySelector('.impact-section');
  if (impactSection) {
    observer.observe(impactSection);
  }
}

function animateCounters() {
  document.querySelectorAll('.impact-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 16);
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function initNotifications() {
  // Auto-dismiss notifications after 5 seconds
  document.querySelectorAll('.notification').forEach((notif, index) => {
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100%)';
      setTimeout(() => notif.remove(), 300);
    }, 5000 + (index * 500));
  });
}

function showNotification(message, type = 'info') {
  const container = document.querySelector('.notification-container') || (() => {
    const c = document.createElement('div');
    c.className = 'notification-container';
    document.body.appendChild(c);
    return c;
  })();

  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}
window.showNotification = showNotification;

// ============================================
// FAQ TOGGLE
// ============================================
function toggleFaq(button) {
  const faqItem = button.parentElement;
  const isOpen = faqItem.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Toggle current
  if (!isOpen) {
    faqItem.classList.add('active');
  }
}
window.toggleFaq = toggleFaq;
