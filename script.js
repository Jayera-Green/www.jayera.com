/**
 * JAYERA Global - Main JavaScript
 * AI-Powered Agroforestry MRV Platform
 * Version: 3.1.0
 */

// ===== GLOBAL CONFIG =====
const AppConfig = {
  version: '3.1.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr', 'pt', 'hi', 'sw'],
  analytics: {
    enabled: true,
    provider: 'plausible' // privacy-focused
  }
};

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    }
  });
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Re-initialize animations for new page
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
  
  // Track page view (analytics placeholder)
  if (AppConfig.analytics.enabled) {
    console.log(`[Analytics] Page view: ${pageName}`);
    // In production: plausible(pageName) or GA4 event
  }
}

// ===== LANGUAGE SWITCHER =====
function changeLanguage(lang) {
  // Update UI indicators
  document.querySelector('.lang-btn span').textContent = lang.toUpperCase();
  document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  // In production: load language JSON and update all text content
  console.log(`[i18n] Language changed to: ${lang}`);
  
  // Show confirmation
  const messages = {
    en: 'Language updated to English',
    es: 'Idioma actualizado a Español',
    fr: 'Langue mise à jour en Français',
    pt: 'Idioma atualizado para Português',
    hi: 'भाषा अंग्रेज़ी में अपडेट की गई',
    sw: 'Lugha imesasishwa kwa Kiingereza'
  };
  
  showAlert(messages[lang] || 'Language updated', 'success');
  
  // Store preference
  localStorage.setItem('jayera_lang', lang);
}

// ===== ALERT SYSTEM =====
function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existing = document.querySelector('.global-alert');
  if (existing) existing.remove();
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `global-alert alert-${type}`;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  alert.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0.25rem;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(alert);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => alert.remove(), 300);
    }
  }, 5000);
}

// Add keyframes for alert animations
const alertStyle = document.createElement('style');
alertStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100px); opacity: 0; }
  }
`;
document.head.appendChild(alertStyle);

// ===== FORM HANDLERS =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showAlert('Thank you! We\'ll be in touch within 24 hours.', 'success');
        form.reset();
        
        // Analytics
        if (AppConfig.analytics.enabled) {
          console.log('[Analytics] Form submission:', form.querySelector('select')?.value || 'contact');
        }
      } catch (error) {
        showAlert('Oops! Something went wrong. Please try again.', 'error');
        console.error('Form submission error:', error);
      } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  });
});

// ===== TAB & INTERACTION HANDLERS =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab, .farmer-tab, .filter-btn, .scenario-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      const navLinks = document.querySelector('.nav-links');
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'white';
      navLinks.style.padding = '1rem';
      navLinks.style.boxShadow = 'var(--shadow-lg)';
      navLinks.style.zIndex = '999';
    });
  }
});

// ===== ANIMATIONS INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      once: true,
      offset: 100
    });
  }
  
  // Check for saved language preference
  const savedLang = localStorage.getItem('jayera_lang');
  if (savedLang && AppConfig.supportedLanguages.includes(savedLang)) {
    changeLanguage(savedLang);
  }
  
  // Initialize charts if on dashboard
  if (document.getElementById('carbonChart')) {
    initCharts();
  }
  
  // Prefetch critical pages for faster navigation
  const criticalPages = ['about', 'solutions', 'getstarted'];
  criticalPages.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `#${page}`;
    document.head.appendChild(link);
  });
});

// ===== CHARTS (Dashboard Preview) =====
function initCharts() {
  // Carbon Chart
  const carbonCtx = document.getElementById('carbonChart');
  if (carbonCtx && window.Chart) {
    new Chart(carbonCtx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [{
          label: 'CO₂ Sequestered (tons)',
          data: [5000, 15000, 45000, 120000, 380000, 680000],
          borderColor: '#4a7c4e',
          backgroundColor: 'rgba(74, 124, 78, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: value => (value/1000) + 'K' }
          }
        }
      }
    });
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// ===== SERVICE WORKER REGISTRATION (PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production: send to error monitoring service (Sentry, etc.)
});

// ===== KEYBOARD SHORTCUTS (Power Users) =====
document.addEventListener('keydown', (e) => {
  // Escape: close modals/alerts
  if (e.key === 'Escape') {
    document.querySelectorAll('.global-alert').forEach(alert => alert.remove());
  }
  
  // Ctrl/Cmd + K: focus search (if implemented)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search-box input')?.focus();
  }
});

// ===== PRINT OPTIMIZATION =====
window.addEventListener('beforeprint', () => {
  document.body.classList.add('printing');
});
window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});