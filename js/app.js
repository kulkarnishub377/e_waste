// app.js - Enhanced E-Zero Application Core
import { initI18n, changeLanguage } from './i18n.js';
import { initTheme } from './theme.js';

// Global Application State
window.EZero = {
  state: {
    user: {
      id: 'user-001',
      name: 'John Doe',
      email: 'john@example.com',
      level: 7,
      points: 2450,
      recycledItems: 23,
      co2Saved: 156,
      avatar: 'JD'
    },
    notifications: [
      { 
        id: 1, 
        type: 'success', 
        title: 'Pickup Completed!', 
        message: 'Your electronics have been recycled successfully', 
        time: '2 hours ago', 
        unread: true
      },
      { 
        id: 2, 
        type: 'reward', 
        title: 'New Reward Available!', 
        message: '50% off on eco-friendly products at Green Store', 
        time: '1 day ago', 
        unread: true
      },
      { 
        id: 3, 
        type: 'achievement', 
        title: 'Level Up Achievement!', 
        message: 'You reached Level 7 - Eco Warrior! Keep going!', 
        time: '3 days ago', 
        unread: false
      }
    ],
    selectedLanguage: 'en',
    activeSection: 'home'
  },
  utils: {
    formatNumber: (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return new Intl.NumberFormat().format(num);
    },
    debounce: (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    },
    showNotification: (message, type = 'info') => {
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transition-all duration-500 transform translate-x-full max-w-sm
        ${type === 'success' ? 'bg-green-500 text-white' : 
          type === 'error' ? 'bg-red-500 text-white' : 
          type === 'warning' ? 'bg-yellow-500 text-black' : 
          type === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`;
      
      notification.innerHTML = `
        <div class="flex items-start space-x-3">
          <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
          <div class="flex-1">
            <p class="text-sm font-medium">${message}</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="text-white opacity-70 hover:opacity-100">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      document.body.appendChild(notification);
      requestAnimationFrame(() => notification.classList.remove('translate-x-full'));
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 500);
      }, 5000);
    }
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Initializing E-Zero Application...');
    
    initI18n();
    initTheme();
    initNavigation();
    initCounters();
    initDropdowns();
    initNotifications();
    initUserProfile();
    initAnimations();
    initScrollIndicator();
    await registerSW();
    
    console.log('✅ E-Zero Application Initialized Successfully!');
    // Initialize debug panel (show runtime logs when ?debug=true in URL)
    initDebugPanel();
    initIconFallback();
    initLocomotive();
    initLottieHero();
    initGSAPInteractions();
    
    // Hide loader
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
    
    setTimeout(() => {
      window.EZero.utils.showNotification('Welcome to E-Zero! 🌱', 'success');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    window.EZero.utils.showNotification('Failed to initialize app', 'error');
  }
});

// Simple GSAP micro-interactions for buttons if GSAP is available
function initGSAPInteractions() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.btn-magnetic, .group .btn-magnetic, button, .btn-outline-glow').forEach(btn => {
    btn.addEventListener('mouseenter', () => { gsap.to(btn, { scale: 1.04, duration: 0.25 }); });
    btn.addEventListener('mouseleave', () => { gsap.to(btn, { scale: 1, duration: 0.25 }); });
    btn.addEventListener('mousedown', () => { gsap.to(btn, { scale: 0.96, duration: 0.1 }); });
    btn.addEventListener('mouseup', () => { gsap.to(btn, { scale: 1.02, duration: 0.1 }); });
  });
}

// Initialize Locomotive Scroll (if available)
function initLocomotive() {
  if (typeof LocomotiveScroll === 'undefined') {
    console.warn('Locomotive Scroll not loaded');
    return;
  }
  const scrollEl = document.querySelector('[data-scroll-container]') || document.getElementById('main-content');
  if (!scrollEl) return;
  try {
    const loco = new LocomotiveScroll({ el: scrollEl, smooth: true, multiplier: 0.8, class: 'is-reveal' });
    window.locoScroll = loco;
    // Keep loco in sync with resize
    window.addEventListener('resize', () => loco.update());
    // Connect loco to gsap if available
    if (window.gsap && window.gsap.registerPlugin) {
      try {
        const ScrollTrigger = window.gsap?.ScrollTrigger || (window.gsap.registerPlugin && window.ScrollTrigger);
        // if ScrollTrigger exists as plugin, register; else skip safe
      } catch (err) {
        /* ignore - scrolltrigger not present */
      }
    }
  } catch (error) {
    console.warn('Failed to init Locomotive Scroll', error);
  }
}

// Initialize a Lottie micro-animation in the hero area
function initLottieHero() {
  if (typeof lottie === 'undefined') { console.warn('Lottie not loaded'); return; }
  const container = document.getElementById('lottie-hero');
  if (!container) return;
  try {
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets3.lottiefiles.com/packages/lf20_jcikwtux.json' // Sample Lottie animation (public)
    });
  } catch (err) {
    console.warn('Lottie init failed', err);
  }
}

function initIconFallback() {
  try {
    const testEl = document.createElement('i');
    testEl.className = 'fas fa-smile';
    testEl.style.position = 'absolute';
    testEl.style.left = '-9999px';
    document.body.appendChild(testEl);
    const fontFamily = window.getComputedStyle(testEl).getPropertyValue('font-family');
    document.body.removeChild(testEl);

    if (!fontFamily || !fontFamily.toLowerCase().includes('font awesome')) {
      console.warn('Font Awesome not detected. Adding fallback CDN link.');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css';
      document.head.appendChild(link);
    }
  } catch (error) {
    console.warn('Icon fallback detection failed:', error);
  }
}

// Navigation System
function initNavigation() {
  const navMenu = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  navMenu?.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu?.classList.toggle('hidden');
    
    const icon = navMenu.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        mobileMenu?.classList.add('hidden');
        navMenu?.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
        window.EZero.state.activeSection = targetId;
      }
    });
  });

  // Active navigation highlighting
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.remove('active', 'text-green-600');
          const linkSection = link.getAttribute('data-section') || 
                            link.getAttribute('href')?.substring(1);
          if (linkSection === id) {
            link.classList.add('active', 'text-green-600');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' });

  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
  });
}

// Counter Animations
function initCounters() {
  const counterConfigs = {
    'waste-counter': { target: 125000, suffix: 'kg' },
    'users-counter': { target: 15000, suffix: '+' },
    'co2-counter': { target: 500000, suffix: 'kg' },
    'ai-insights-counter': { target: 50000, suffix: '+' },
    'user-points': { target: 2450, suffix: '' },
    'user-level': { target: 7, suffix: '' },
    'items-recycled': { target: 23, suffix: '' },
    'co2-saved': { target: 156, suffix: '' },
    'global-waste': { target: 1200000, suffix: '' },
    'global-co2': { target: 500000, suffix: '' },
    'global-trees': { target: 250000, suffix: '' },
    'global-communities': { target: 500, suffix: '+' }
  };

  const animateCounter = (element, target, suffix, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = window.EZero.utils.formatNumber(Math.floor(current)) + suffix;
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const config = counterConfigs[entry.target.id];
        if (config) {
          animateCounter(entry.target, config.target, config.suffix);
          entry.target.classList.add('animated');
        }
      }
    });
  }, { threshold: 0.5 });

  Object.keys(counterConfigs).forEach(id => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });
}

// Dropdown Management
function initDropdowns() {
  const dropdowns = [
    'lang-dropdown',
    'notification-dropdown', 
    'user-dropdown'
  ];

  // Language selector
  document.getElementById('lang-selector')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown('lang-dropdown');
  });

  // Notification button
  document.getElementById('notification-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown('notification-dropdown');
  });

  // User menu button
  document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown('user-dropdown');
  });

  // Language options
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      if (lang) {
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        changeLanguage(lang);
        window.EZero.state.selectedLanguage = lang;
        closeAllDropdowns();
        window.EZero.utils.showNotification(`Language changed to ${lang.toUpperCase()}`, 'success');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);

  function toggleDropdown(targetId) {
    closeAllDropdowns(targetId);
    const dropdown = document.getElementById(targetId);
    if (dropdown) {
      dropdown.classList.toggle('hidden');
      // Update aria-expanded for associated button
      const button = document.querySelector(`[aria-haspopup][aria-controls='${targetId}']`) || document.querySelector(`#${targetId}`)?.previousElementSibling;
      if (button) {
        const isExpanded = !dropdown.classList.contains('hidden');
        button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
    }
  }

  function closeAllDropdowns(except) {
    dropdowns.forEach(id => {
      if (id !== except) {
        document.getElementById(id)?.classList.add('hidden');
      }
    });
  }
}

// Notifications
function initNotifications() {
  updateNotificationBadge();
  renderNotifications();
}

function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  const unreadCount = window.EZero.state.notifications.filter(n => n.unread).length;
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function renderNotifications() {
  const container = document.querySelector('#notification-dropdown .max-h-80');
  if (!container) return;
  
  container.innerHTML = window.EZero.state.notifications.map(n => `
    <div class="notification-item p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? 'bg-green-50' : ''}" 
         data-id="${n.id}">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center ${
          n.type === 'success' ? 'bg-green-100 text-green-600' :
          n.type === 'reward' ? 'bg-yellow-100 text-yellow-600' :
          'bg-blue-100 text-blue-600'
        }">
          <i class="fas ${n.type === 'success' ? 'fa-check' : n.type === 'reward' ? 'fa-gift' : 'fa-info'}"></i>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-sm">${n.title}</h4>
          <p class="text-gray-600 text-sm mt-1">${n.message}</p>
          <p class="text-gray-400 text-xs mt-2">${n.time}</p>
        </div>
        ${n.unread ? '<div class="w-2 h-2 bg-green-500 rounded-full"></div>' : ''}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      markAsRead(id);
    });
  });
}

function markAsRead(id) {
  const notification = window.EZero.state.notifications.find(n => n.id === id);
  if (notification && notification.unread) {
    notification.unread = false;
    updateNotificationBadge();
    renderNotifications();
  }
}

// User Profile
function initUserProfile() {
  const user = window.EZero.state.user;
  
  // Update user avatar and name in header
  const userButton = document.getElementById('user-menu-btn');
  if (userButton) {
    const avatar = userButton.querySelector('div.rounded-full');
    const nameElement = userButton.querySelector('.text-sm.font-semibold');
    const levelElement = userButton.querySelector('.text-xs.text-gray-500');
    
    if (avatar) avatar.textContent = user.avatar;
    if (nameElement) nameElement.textContent = user.name;
    if (levelElement) levelElement.textContent = `Level ${user.level} Eco Warrior`;
  }

  // Populate profile form if present
  const fullnameInput = document.getElementById('profile-fullname');
  const emailInput = document.getElementById('profile-email-input');
  const phoneInput = document.getElementById('profile-phone');
  const avatarEl = document.getElementById('profile-avatar');
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const levelEl = document.getElementById('profile-level');

  if (fullnameInput) fullnameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (avatarEl) avatarEl.textContent = user.avatar || (user.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD');
  if (nameEl) nameEl.textContent = user.name || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (levelEl) levelEl.textContent = `Level ${user.level}`;

  const saveBtn = document.getElementById('save-profile-btn');
  const cancelBtn = document.getElementById('cancel-profile-btn');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Update state and save to localStorage
      window.EZero.state.user.name = fullnameInput.value;
      window.EZero.state.user.email = emailInput.value;
      window.EZero.state.user.phone = phoneInput.value;
      const avatarText = (fullnameInput.value || 'User').split(' ').map(n => n[0]).join('').toUpperCase();
      window.EZero.state.user.avatar = avatarText;
      localStorage.setItem('eZero_currentUser', JSON.stringify(window.EZero.state.user));
      window.EZero.utils.showNotification('Profile updated successfully', 'success');

      // Reflect changes in header
      if (avatarEl) avatarEl.textContent = avatarText;
      if (nameEl) nameEl.textContent = fullnameInput.value;
      if (emailEl) emailEl.textContent = emailInput.value;
      if (userButton) {
        const headerName = userButton.querySelector('.text-sm.font-semibold');
        if (headerName) headerName.textContent = fullnameInput.value;
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (fullnameInput) fullnameInput.value = user.name || '';
      if (emailInput) emailInput.value = user.email || '';
      if (phoneInput) phoneInput.value = user.phone || '';
      window.EZero.utils.showNotification('Edits canceled', 'info');
    });
  }
}

// Scroll Progress Indicator
function initScrollIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-100 z-50';
  indicator.style.width = '0%';
  document.body.appendChild(indicator);
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    indicator.style.width = scrollPercent + '%';
  });
}

// Animations
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.animate-fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

// Service Worker
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ SW registered:', registration.scope);
      
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error('❌ SW registration failed:', error);
    }
  }
}

// Global error handlers to capture runtime exceptions and promise rejections
window.addEventListener('error', (e) => {
  console.error('Global uncaught error:', e.error || e.message || e);
  try { window.EZero.utils.showNotification('An error occurred: ' + (e.message || e.error?.message || 'See console'), 'error'); } catch (err) { console.error('Notification failed', err); }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  try { window.EZero.utils.showNotification('A promise rejection occurred: ' + (e.reason?.message || String(e.reason)), 'warning'); } catch (err) { console.error('Notification failed', err); }
});

// Theme toggle initialization
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Apply saved theme
  const saved = localStorage.getItem('theme');
  applyTheme(saved === 'dark');

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    applyTheme(isDark);
  });
}

// Hook theme function on start
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
});

// Global utility functions
window.scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerOffset = 100;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

window.openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
};

// Push notification handler for custom events
class PushSystem {
  constructor() {
    this.init();
  }

  init() {
    // Listen for custom events dispatched across app
    document.addEventListener('bookingConfirmed', (e) => this.onBookingConfirmed(e.detail));
    document.addEventListener('rewardEarned', (e) => this.onRewardEarned(e.detail));
    document.addEventListener('milestoneReached', (e) => this.onMilestoneReached(e.detail));
  }

  addNotification({ title, message, type = 'info' }) {
    const id = Date.now();
    const notification = { id, type, title, message, time: 'Just now', unread: true };
    window.EZero.state.notifications.unshift(notification);
    updateNotificationBadge();
    renderNotifications();
    return notification;
  }

  onBookingConfirmed(detail) {
    const title = 'Booking Confirmed! 🎉';
    const message = `Your pickup is scheduled for ${detail.date} at ${detail.time}`;
    this.addNotification({ title, message, type: 'success' });
    // Show local browser notification
    window.EZero.utils.showNotification(message, 'success');
  }

  onRewardEarned(detail) {
    const title = 'Reward Earned! 🏆';
    const message = `You earned ${detail.points} points for recycling ${detail.items} items`;
    this.addNotification({ title, message, type: 'reward' });
    window.EZero.utils.showNotification(message, 'success');
  }

  onMilestoneReached(detail) {
    const title = 'Milestone Achieved! 🌟';
    const message = `You've reached ${detail.milestone}`;
    this.addNotification({ title, message, type: 'achievement' });
    window.EZero.utils.showNotification(message, 'success');
  }
}

// Initialize push system globally
const pushSystem = new PushSystem();
window.pushSystem = pushSystem;

// Simple in-app chat widget for support (local-only mock)
class ChatSystem {
  constructor() {
    this.messages = JSON.parse(localStorage.getItem('eZero_chat') || '[]');
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.renderMessages();
  }

  createWidget() {
    // Basic chat UI
    if (document.getElementById('chat-widget')) return;
    const widget = document.createElement('div');
    widget.id = 'chat-widget';
    widget.className = 'fixed bottom-6 right-6 z-40';
    widget.innerHTML = `
      <button id="chat-toggle" class="bg-emerald-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
        <i class="fas fa-comments text-lg"></i>
      </button>
      <div id="chat-panel" class="hidden w-96 h-120 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-3 bg-emerald-600 text-white flex items-center justify-between">
          <div class="font-semibold">E-Zero Support</div>
          <button id="chat-close" class="text-white">✕</button>
        </div>
        <div id="chat-messages" style="height:320px; overflow:auto; padding:12px;"></div>
        <div class="p-3 border-t border-gray-200 flex gap-2">
          <input id="chat-input" class="flex-1 p-2 border rounded-lg" placeholder="Type a message..." />
          <button id="chat-send" class="bg-emerald-600 text-white px-3 py-2 rounded-lg">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    document.getElementById('chat-toggle').addEventListener('click', () => this.toggle());
    document.getElementById('chat-close').addEventListener('click', () => this.toggle());
    document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('chat-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    document.getElementById('chat-toggle').classList.toggle('ring-2');
    if (this.isOpen) this.scrollToBottom();
  }

  renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = '';
    this.messages.slice(-40).forEach(m => {
      const el = document.createElement('div');
      el.className = `mb-2 p-2 rounded ${m.sender === 'user' ? 'bg-emerald-600 text-white self-end' : 'bg-gray-100 text-gray-800'}`;
      el.textContent = m.content;
      container.appendChild(el);
    });
    this.scrollToBottom();
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    const message = { sender: 'user', content: input.value.trim(), time: new Date().toISOString() };
    this.messages.push(message);
    localStorage.setItem('eZero_chat', JSON.stringify(this.messages));
    input.value = '';
    this.renderMessages();
    // Simulate response
    setTimeout(() => this.addSystemMessage('Thanks for reaching out! Our team will get back to you soon.'), 800);
  }

  addSystemMessage(text) {
    const message = { sender: 'system', content: text, time: new Date().toISOString() };
    this.messages.push(message);
    localStorage.setItem('eZero_chat', JSON.stringify(this.messages));
    this.renderMessages();
  }

  scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }
}

// Initialize chat system
const chatSystem = new ChatSystem();
window.chatSystem = chatSystem;

// Debug panel to collect and display console logs for easier troubleshooting
function initDebugPanel() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get('debug')) return;

  const panel = document.createElement('div');
  panel.id = 'debug-panel';
  Object.assign(panel.style, {
    position: 'fixed', right: '8px', bottom: '8px', width: '360px', height: '240px', overflow: 'auto', zIndex: 99999,
    background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  });
  panel.innerHTML = '<strong>Debug Panel</strong><div id="debug-log" style="margin-top:6px; font-family:monospace; font-size:11px;"></div>';
  document.body.appendChild(panel);

  const logEl = panel.querySelector('#debug-log');
  const appendLog = (msg) => {
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  };

  // Capture console logs
  ['log', 'info', 'warn', 'error'].forEach(level => {
    const original = console[level];
    console[level] = function(...args) {
      try { appendLog(args.join(' ')); } catch (e) {}
      original.apply(console, args);
    };
  });

  // Capture global errors
  window.addEventListener('error', (e) => appendLog(`ERROR: ${e.message}`));
  window.addEventListener('unhandledrejection', (e) => appendLog(`UNHANDLED PROMISE REJECTION: ${e.reason?.message || e.reason}`));
}