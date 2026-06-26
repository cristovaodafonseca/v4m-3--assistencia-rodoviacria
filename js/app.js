/* ========================================
   V4M — Client Area JavaScript
   ======================================== */

const API_BASE = '';

// ========== AUTH ==========
function getToken() {
  return localStorage.getItem('v4m_token');
}

function setToken(token) {
  localStorage.setItem('v4m_token', token);
}

function removeToken() {
  localStorage.removeItem('v4m_token');
}

function getUser() {
  const user = localStorage.getItem('v4m_user');
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem('v4m_user', JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/entrar';
    return false;
  }
  return true;
}

function logout() {
  removeToken();
  localStorage.removeItem('v4m_user');
  window.location.href = '/';
}

// ========== API HELPERS ==========
async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(API_BASE + url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

// ========== NAVBAR ==========
function getAppNavbar(currentPage) {
  const user = getUser();
  const links = [
    { href: '/dashboard', label: 'Dashboard', id: 'dashboard' },
    { href: '/solicitar', label: 'Solicitar', id: 'solicitar' },
    { href: '/historico', label: 'Histórico', id: 'historico' },
    { href: '/plano', label: 'Plano', id: 'plano' },
    { href: '/perfil', label: 'Perfil', id: 'perfil' },
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
        <a href="/dashboard" class="nav-logo">
          <span class="logo-text">V<span class="text-yellow">4</span>M</span>
        </a>
        <ul class="nav-menu">${navLinks}</ul>
        <div class="nav-user">
          <span class="nav-user-name">${user?.name || 'Utilizador'}</span>
          <button onclick="logout()" class="btn btn-outline" style="padding: 8px 16px; font-size: 0.8125rem;">Sair</button>
        </div>
        <button id="menu-btn" class="menu-btn" aria-label="Menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
      <div id="mobile-menu" class="mobile-menu">
        <ul class="mobile-menu-list">
          ${mobileNavLinks}
          <li><a href="/" class="mobile-nav-link">Área Pública</a></li>
          <li>
            <button onclick="logout()" class="btn btn-outline mobile-cta" style="margin-top: 16px;">Sair da Conta</button>
          </li>
        </ul>
      </div>
    </nav>
  `;
}

// ========== FOOTER ==========
function getAppFooter() {
  return `
    <footer id="footer">
      <div class="footer-container">
        <hr class="divider">
        <div class="footer-bottom" style="padding-top: 24px;">
          <p>&copy; 2025 V4M Angola. Todos os direitos reservados.</p>
          <div class="footer-bottom-links">
            <a href="/">Área Pública</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ========== INIT APP ==========
function initApp(currentPage) {
  if (!requireAuth()) return;

  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) navPlaceholder.innerHTML = getAppNavbar(currentPage);

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.innerHTML = getAppFooter();

  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ========== STATUS HELPERS ==========
function getStatusLabel(status) {
  const labels = {
    'pending': 'Pendente',
    'accepted': 'Aceite',
    'on_the_way': 'A caminho',
    'arrived': 'Chegou',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  };
  return labels[status] || status;
}

function getStatusColor(status) {
  const colors = {
    'pending': '#F59E0B',
    'accepted': '#3B82F6',
    'on_the_way': '#8B5CF6',
    'arrived': '#10B981',
    'completed': '#22C55E',
    'cancelled': '#EF4444'
  };
  return colors[status] || '#6B7280';
}

function getProblemLabel(type) {
  const labels = {
    'furo': 'Furo',
    'nao_liga': 'Motorizada não liga',
    'bateria': 'Bateria',
    'combustivel': 'Falta de combustível',
    'eletrico': 'Problema eléctrico',
    'outro': 'Outro'
  };
  return labels[type] || type;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
