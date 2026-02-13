/**
 * E-Zero - Main Application JavaScript
 * Professional Business Landing Page
 */

// ============================================
// DOM READY INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initNavHighlight();
  initContactForm();
  
  console.log('🌱 E-Zero Business Site Initialized');
});

// ============================================
// HEADER FUNCTIONALITY
// ============================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuBtn || !mobileMenu) return;
  
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = menuBtn.querySelector('i');
    
    if (mobileMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      document.body.style.overflow = 'hidden';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking a link
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const icon = menuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      scrollToSection(targetId.substring(1));
    });
  });
}

// Global scroll function
window.scrollToSection = function(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const headerOffset = 80;
  const elementPosition = section.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
  
  history.pushState(null, null, `#${sectionId}`);
};

// ============================================
// NAVIGATION HIGHLIGHT
// ============================================
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!sections.length || !navLinks.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { 
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px'
  });
  
  sections.forEach(section => observer.observe(section));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  if (!animatedElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      showNotification('Thank you! Our team will contact you within 24 hours.', 'success');
      form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Submission failed. Please try again or call us directly.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const bgColors = {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  
  const icons = {
    success: 'check-circle',
    error: 'times-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    padding: 18px 24px;
    background: ${bgColors[type] || bgColors.info};
    color: white;
    border-radius: 14px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
    font-size: 0.9375rem;
    max-width: 400px;
  `;
  
  notification.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(notification);
  
  // Add animation styles
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => notification.remove(), 400);
  }, 5000);
}

// ============================================
// IMPACT COUNTER ANIMATION
// ============================================
function initImpactCounters() {
  const impactSection = document.querySelector('.impact-section');
  if (!impactSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  
  observer.observe(impactSection);
}

function animateCounters() {
  const counters = document.querySelectorAll('.impact-value');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target || 0);
    const duration = 2500; // 2.5 seconds
    const fps = 60;
    const totalFrames = (duration / 1000) * fps;
    const increment = target / totalFrames;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Format number (e.g. 45,000)
      counter.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 1000 / fps);
  });
}

// Initialize counters with other DOM ready functions
document.addEventListener('DOMContentLoaded', initImpactCounters);

// ============================================
// GLOBAL UTILITIES
// ============================================
window.EZero = {
  scrollToSection: window.scrollToSection,
  showNotification: showNotification
};

// ============================================
// EXPORTS
// ============================================
export { showNotification };