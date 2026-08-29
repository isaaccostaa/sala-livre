// ============================================================
// Sala Livre — App Core
// Roteador SPA, header/navegação, estado global e utilidades.
// ============================================================

// --- Estado global ---
const AppState = {
  currentPage: 'dashboard',
  selectedRoom: null,    // Sala para destacar no mapa
  showRoute: false,      // Mostrar rota até sala
  mapZoom: 1,
  selectedFloor: 1,
};

// ============================================================
// ROTEAMENTO SPA
// ============================================================
function getRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  const [page, params] = hash.split('?');
  const query = {};
  if (params) {
    params.split('&').forEach(p => {
      const [k, v] = p.split('=');
      query[k] = decodeURIComponent(v);
    });
  }
  return { page, query };
}

function navigateTo(page, params = {}) {
  let hash = '#' + page;
  const entries = Object.entries(params);
  if (entries.length) {
    hash += '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  }
  window.location.hash = hash;
}

function handleRoute() {
  const { page, query } = getRoute();
  AppState.currentPage = page;

  // Preparar estado antes de renderizar
  if (query.sala) {
    AppState.selectedRoom = query.sala;
  }
  if (query.rota === 'true') {
    AppState.showRoute = true;
  }

  renderPage(page);
  updateActiveNav(page);
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPage(page) {
  const content = document.getElementById('app-content');
  content.classList.add('page-exit');

  // Small timeout para transição
  setTimeout(() => {
    switch (page) {
      case 'dashboard': renderDashboard(); break;
      case 'mapa':      renderMap();       break;
      case 'grade':     renderSchedule();  break;
      case 'salas':     renderRooms();     break;
      case 'buscar':    renderSearch();    break;
      default:          renderDashboard(); break;
    }
    content.classList.remove('page-exit');
  }, 50);
}


// ============================================================
// HEADER / NAVEGAÇÃO
// ============================================================
function updateActiveNav(page) {
  document.querySelectorAll('.header__link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function initHeader() {
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
  const overlay = document.getElementById('nav-overlay');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    overlay.classList.toggle('visible', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  overlay.addEventListener('click', closeMobileMenu);

  // Fechar menu ao clicar em link
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Atualizar avatar
  document.getElementById('user-avatar').textContent = AppData.user.initials;
}

function closeMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('nav-overlay');
  nav.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', 'false');
}


// ============================================================
// MODAL
// ============================================================
function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = html;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Fechar ao clicar no overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Fechar com Escape
  document.addEventListener('keydown', handleModalEsc);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleModalEsc);
}

function handleModalEsc(e) {
  if (e.key === 'Escape') closeModal();
}


// ============================================================
// COMPONENTES HTML AUXILIARES
// ============================================================
function createBadge(status) {
  const label = getStatusLabel(status);
  const icon = getStatusIcon(status);
  return `<span class="badge badge--${status}" aria-label="Status: ${label}">
    <span class="badge__dot" aria-hidden="true"></span>
    ${icon} ${label}
  </span>`;
}

function createRoomCard(room) {
  const subject = getNextSubjectForRoom(room.id);
  return `
    <div class="room-card">
      <div class="room-card__header">
        <span class="room-card__id">${room.id}</span>
        ${createBadge(room.status)}
      </div>
      <div class="room-card__info">
        <span>📍 ${getBlockLabel(room.block)} — ${getFloorLabel(room.floor)}</span>
        <span>👥 Capacidade: ${room.capacity} pessoas</span>
        <span>🏷️ ${room.type}</span>
      </div>
      <div class="room-card__footer">
        ${subject ? `<span style="font-size:12px;color:var(--text-tertiary)">Próx: ${subject.name}</span>` : '<span></span>'}
        <button class="btn btn--sm btn--secondary" onclick="navigateTo('mapa', {sala: '${room.id}'})">
          Ver no mapa
        </button>
      </div>
    </div>`;
}

function svgIcon(name) {
  const icons = {
    clock: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4v4.25l3.15 1.89-.75 1.24L7 9V4h1.5z"/></svg>',
    pin: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 0C4.69 0 2 2.69 2 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.5A2.5 2.5 0 118 3a2.5 2.5 0 010 5.5z"/></svg>',
    search: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M6.5 0a6.5 6.5 0 014.383 11.174l4.221 4.221a1 1 0 01-1.414 1.414l-4.222-4.221A6.5 6.5 0 116.5 0zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/></svg>',
    close: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>',
    building: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 100-6 3 3 0 000 6z"/></svg>',
    directions: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9.01c-.78.78-.78 2.04 0 2.82l9.01 9.01c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l9.01-9.01c.78-.78.78-2.04 0-2.82zM12.01 20L4 12l8.01-8 8 8-8 8zM8 11v2h4v3l3-4-3-4v3H8z"/></svg>',
  };
  return icons[name] || '';
}


// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);

  // Rota inicial
  if (!window.location.hash) {
    window.location.hash = '#dashboard';
  }
});
