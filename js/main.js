/* ========================================
   V4M — Main JavaScript
   ======================================== */

// ========== WHATSAPP LINK ==========
const WHATSAPP_NUMBER = '244944730715';
const WHATSAPP_MESSAGE = 'Ol%C3%A1%2C%20preciso%20de%20assist%C3%AAncia%20com%20a%20minha%20motorizada.';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// ========== COMPONENTS ==========

// Detect base path for correct routing
function getBasePath() {
  const path = window.location.pathname;
  if (path.endsWith('.html') || path.includes('.')) {
    return '';
  }
  return '';
}

function getNavbar(currentPage) {
  const base = getBasePath();
  const links = [
    { href: base + 'index.html', label: 'Início', id: 'inicio' },
    { href: base + 'sobre.html', label: 'Sobre', id: 'sobre' },
    { href: base + 'servicos.html', label: 'Serviços', id: 'servicos' },
    { href: base + 'cobertura.html', label: 'Cobertura', id: 'cobertura' },
    { href: base + 'planos.html', label: 'Planos', id: 'planos' },
    { href: base + 'faq.html', label: 'FAQ', id: 'faq' },
    { href: base + 'contactos.html', label: 'Contactos', id: 'contactos' },
  ];

  const navLinks = links.map(link => {
    const isActive = link.id === currentPage;
    return `<li><a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a></li>`;
  }).join('');

  const mobileNavLinks = links.map(link => {
    const isActive = link.id === currentPage;
    return `<li><a href="${link.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">${link.label}</a></li>`;
  }).join('');

  return `
    <nav id="navbar">
      <div class="nav-container">
        <a href="/" class="nav-logo">
          <span class="logo-text">V<span class="text-yellow">4</span>M</span>
        </a>
        <ul class="nav-menu" id="nav-menu">
          ${navLinks}
        </ul>
        <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener" class="btn btn-primary nav-cta">
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Solicitar Assistência
        </a>
        <button id="menu-btn" class="menu-btn" aria-label="Menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
      <div id="mobile-menu" class="mobile-menu">
        <ul class="mobile-menu-list">
          ${mobileNavLinks}
          <li>
            <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener" class="btn btn-primary mobile-cta">
              Solicitar Assistência
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `;
}

function getFooter() {
  const base = getBasePath();
  return `
    <footer id="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${base}index.html" class="nav-logo">
              <span class="logo-text">V<span class="text-yellow">4</span>M</span>
            </a>
            <p class="footer-slogan">Nunca fique parado.<br>Assistência rápida para motorizadas em Luanda.</p>
          </div>
          <div class="footer-links">
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="${base}sobre.html">Sobre</a></li>
              <li><a href="${base}servicos.html">Serviços</a></li>
              <li><a href="${base}planos.html">Planos</a></li>
              <li><a href="${base}contactos.html">Contactos</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li><a href="tel:+244944730715">+244 944 730 715</a></li>
              <li><a href="mailto:geral@v4mangola.com">geral@v4mangola.com</a></li>
            </ul>
            <h4 class="mt-16">Horário</h4>
            <ul>
              <li>Assistência: <span class="text-yellow">24h / 7 dias</span></li>
              <li>Comercial: <span class="text-yellow">08h – 20h</span></li>
            </ul>
          </div>
          <div class="footer-social">
            <h4>Siga-nos</h4>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="TikTok">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <hr class="divider">
        <div class="footer-bottom">
          <p>&copy; 2025 V4M Angola. Todos os direitos reservados.</p>
          <div class="footer-bottom-links">
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Utilização</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function getWhatsAppButton() {
  return `
    <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener" id="whatsapp-btn" aria-label="WhatsApp">
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  `;
}

// ========== INIT ==========
function initComponents(currentPage) {
  // Inject navbar
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = getNavbar(currentPage);
  }

  // Inject footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = getFooter();
  }

  // Inject WhatsApp button
  const whatsappPlaceholder = document.getElementById('whatsapp-placeholder');
  if (whatsappPlaceholder) {
    whatsappPlaceholder.innerHTML = getWhatsAppButton();
  }

  // Init navbar scroll
  initNavbarScroll();

  // Init mobile menu
  initMobileMenu();

  // Init FAQ accordions
  initFAQ();

  // Init scroll reveal
  initScrollReveal();
}

// ========== NAVBAR SCROLL ==========
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ========== FAQ ==========
function initFAQ() {
  document.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector('.faq-icon');
      const isOpen = content.classList.contains('show');

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('show'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0)');
      document.querySelectorAll('.faq-toggle').forEach(b => b.setAttribute('aria-expanded', 'false'));

      // Toggle current
      if (!isOpen) {
        content.classList.add('show');
        icon.style.transform = 'rotate(180deg)';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ========== SCROLL REVEAL ==========
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ========== SMOOTH SCROLL ==========
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    const offset = 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});
