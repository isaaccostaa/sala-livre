// ============================================================
// Sala Livre — Páginas
// Dashboard, Grade de Aulas, Salas, Buscar
// ============================================================


// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const nc = AppData.nextClass;
  const s = AppData.stats;

  document.getElementById('app-content').innerHTML = `
    <div class="page" id="page-dashboard">

      <!-- Saudação -->
      <div class="dashboard__greeting">
        <h1>Olá, ${AppData.user.name} 👋</h1>
        <p>Encontre sua sala e organize seu dia.</p>
      </div>

      <!-- Próxima aula -->
      <div class="dashboard__next-class">
        <div class="dashboard__next-class-header">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z"/></svg>
          Próxima aula
        </div>
        <h2>${nc.subject}</h2>
        <div class="dashboard__next-class-details">
          <span class="dashboard__next-class-detail">
            ${svgIcon('clock')} ${nc.time}
          </span>
          <span class="dashboard__next-class-detail">
            ${svgIcon('pin')} Sala ${nc.room}
          </span>
          <span class="dashboard__next-class-detail">
            ${svgIcon('building')} ${nc.building} — ${nc.floorLabel}
          </span>
        </div>
        <button class="btn btn--primary" onclick="navigateTo('mapa', {sala: '${nc.room}'})">
          ${svgIcon('pin')} Ver no mapa
        </button>
      </div>

      <!-- Estatísticas -->
      <div class="dashboard__stats">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--free" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clip-rule="evenodd"/></svg></div>
          <div class="stat-card__value">${s.free}</div>
          <div class="stat-card__label">Salas livres</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--occ" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" clip-rule="evenodd"/></svg></div>
          <div class="stat-card__value">${s.occupied}</div>
          <div class="stat-card__label">Salas ocupadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--res" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.4.8l3 2a1 1 0 101.2-1.6L11 9.5V6z" clip-rule="evenodd"/></svg></div>
          <div class="stat-card__value">${s.reserved}</div>
          <div class="stat-card__label">Reservadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--lab" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 000 2h1v4.6L3.4 15.2A2 2 0 005.1 18h9.8a2 2 0 001.7-2.8L12 8.6V4h1a1 1 0 100-2H7zm3 4h0v3.2l.3.5 1.7 2.8H8l1.7-2.8.3-.5V6z"/></svg></div>
          <div class="stat-card__value">${s.labsAvailable}</div>
          <div class="stat-card__label">Labs disponíveis</div>
        </div>
      </div>

      <!-- Está perdido? -->
      <div class="dashboard__lost">
        <div class="dashboard__lost-content">
          <h3>🧭 Está perdido?</h3>
          <p>Encontre rapidamente onde será sua próxima aula.</p>
          <button class="btn btn--primary btn--pulse" onclick="openLostMode()">
            Encontrar minha sala
          </button>
        </div>
      </div>
    </div>`;
}


// ============================================================
// GRADE DE AULAS
// ============================================================
function renderSchedule() {
  const days = AppData.weekDays;
  const timeSlots = AppData.timeSlots;

  // Montar grid da grade
  let gridHTML = '';

  // Header row
  gridHTML += `<div class="schedule__time-header"></div>`;
  days.forEach(d => {
    gridHTML += `<div class="schedule__day-header">${d.label}</div>`;
  });

  // Time rows
  timeSlots.forEach(time => {
    gridHTML += `<div class="schedule__time">${time}</div>`;
    days.forEach(d => {
      const subject = AppData.subjects.find(s => s.day === d.key && s.time === time);
      if (subject) {
        gridHTML += `
          <div class="schedule__cell">
            <div class="schedule__card" 
                 style="background: ${subject.color}12; border-color: ${subject.color}" 
                 onclick="navigateTo('mapa', {sala: '${subject.room}'})"
                 role="button" tabindex="0"
                 aria-label="${subject.name}, ${time}, Sala ${subject.room}">
              <span class="schedule__card-name">${subject.name}</span>
              <span class="schedule__card-prof">${subject.professor}</span>
              <span class="schedule__card-room">📍 ${subject.room}</span>
            </div>
          </div>`;
      } else {
        gridHTML += `<div class="schedule__cell"></div>`;
      }
    });
  });

  // Mobile tabs + cards
  let mobileTabsHTML = days.map((d, i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-day="${d.key}" onclick="filterScheduleDay('${d.key}', this)">${d.label}</button>`
  ).join('');

  let mobileCardsHTML = '';
  days.forEach(d => {
    const daySubjects = getSubjectsByDay(d.key);
    daySubjects.sort((a, b) => a.time.localeCompare(b.time));
    daySubjects.forEach(sub => {
      mobileCardsHTML += `
        <div class="schedule__mobile-card" 
             data-day="${d.key}" 
             style="border-color: ${sub.color}; ${d.key !== 'segunda' ? 'display:none' : ''}"
             onclick="navigateTo('mapa', {sala: '${sub.room}'})"
             role="button" tabindex="0">
          <div class="schedule__mobile-card-name">${sub.name}</div>
          <div class="schedule__mobile-card-prof">${sub.professor}</div>
          <div class="schedule__mobile-card-meta">
            <span>${svgIcon('clock')} ${sub.time}</span>
            <span>${svgIcon('pin')} ${sub.room}</span>
          </div>
        </div>`;
    });
  });

  document.getElementById('app-content').innerHTML = `
    <div class="page" id="page-schedule">
      <div class="schedule__header">
        <div>
          <h1 class="section-title">Grade de Aulas</h1>
          <p class="section-subtitle">Clique em uma disciplina para ver a sala no mapa.</p>
        </div>
      </div>

      <!-- Mobile day tabs -->
      <div class="schedule__days-mobile">${mobileTabsHTML}</div>

      <!-- Desktop grid -->
      <div class="schedule__grid">${gridHTML}</div>

      <!-- Mobile card list -->
      <div class="schedule__mobile-list">${mobileCardsHTML}</div>
    </div>`;
}

function filterScheduleDay(day, btnEl) {
  // Atualizar chip ativo
  document.querySelectorAll('.schedule__days-mobile .chip').forEach(c => c.classList.remove('active'));
  btnEl.classList.add('active');

  // Mostrar/esconder cards
  document.querySelectorAll('.schedule__mobile-card').forEach(card => {
    card.style.display = card.dataset.day === day ? '' : 'none';
  });
}


// ============================================================
// SALAS
// ============================================================
function renderRooms() {
  const blocks = [...new Set(AppData.rooms.map(r => r.block))];
  const floors = [...new Set(AppData.rooms.map(r => r.floor))].sort();
  const types = [...new Set(AppData.rooms.map(r => r.type))];

  const blockOptions = blocks.map(b => `<option value="${b}">${getBlockLabel(b)}</option>`).join('');
  const floorOptions = floors.map(f => `<option value="${f}">${getFloorLabel(f)}</option>`).join('');
  const typeOptions = types.map(t => `<option value="${t}">${t}</option>`).join('');

  document.getElementById('app-content').innerHTML = `
    <div class="page" id="page-rooms">
      <h1 class="section-title">Salas</h1>
      <p class="section-subtitle">Consulte todas as salas disponíveis no campus.</p>

      <!-- Filtros -->
      <div class="rooms__filters">
        <div class="rooms__search">
          <div class="input-group">
            <span class="input-group__icon">${svgIcon('search')}</span>
            <input class="input" type="text" placeholder="Pesquisar sala..." 
                   id="rooms-search" oninput="filterRooms()" aria-label="Pesquisar sala">
          </div>
        </div>
        <div class="rooms__filter-row">
          <select class="select" id="filter-block" onchange="filterRooms()" aria-label="Filtrar por bloco">
            <option value="">Todos os blocos</option>
            ${blockOptions}
          </select>
          <select class="select" id="filter-floor" onchange="filterRooms()" aria-label="Filtrar por andar">
            <option value="">Todos os andares</option>
            ${floorOptions}
          </select>
          <select class="select" id="filter-type" onchange="filterRooms()" aria-label="Filtrar por tipo">
            <option value="">Todos os tipos</option>
            ${typeOptions}
          </select>
          <select class="select" id="filter-status" onchange="filterRooms()" aria-label="Filtrar por status">
            <option value="">Todos os status</option>
            <option value="livre">✓ Livre</option>
            <option value="ocupada">✕ Ocupada</option>
            <option value="reservada">◉ Reservada</option>
          </select>
        </div>
      </div>

      <!-- Grid de salas -->
      <div class="rooms__grid" id="rooms-grid">
        ${AppData.rooms.map(r => createRoomCard(r)).join('')}
      </div>
    </div>`;
}

function filterRooms() {
  const query = document.getElementById('rooms-search').value.toLowerCase().trim();
  const block = document.getElementById('filter-block').value;
  const floor = document.getElementById('filter-floor').value;
  const type = document.getElementById('filter-type').value;
  const status = document.getElementById('filter-status').value;

  const filtered = AppData.rooms.filter(r => {
    if (query && !r.id.toLowerCase().includes(query) && !r.type.toLowerCase().includes(query)) return false;
    if (block && r.block !== block) return false;
    if (floor && r.floor !== parseInt(floor)) return false;
    if (type && r.type !== type) return false;
    if (status && r.status !== status) return false;
    return true;
  });

  const grid = document.getElementById('rooms-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p>Nenhuma sala encontrada com os filtros selecionados.</p>
      </div>`;
  } else {
    grid.innerHTML = filtered.map(r => createRoomCard(r)).join('');
  }
}


// ============================================================
// BUSCAR
// ============================================================
function renderSearch() {
  document.getElementById('app-content').innerHTML = `
    <div class="page" id="page-search">
      <div class="search__hero">
        <h1>Buscar</h1>
        <p>Encontre salas, disciplinas, professores ou laboratórios.</p>
        <div class="search__input-wrapper">
          <div class="input-group">
            <span class="input-group__icon">${svgIcon('search')}</span>
            <input class="input" type="text" id="search-input"
                   placeholder="Busque por sala, professor, disciplina ou laboratório..."
                   oninput="performSearch()" aria-label="Buscar">
          </div>
        </div>
        <div class="search__chips">
          <button class="chip" onclick="quickSearch('Laboratório')">🔬 Laboratórios</button>
          <button class="chip" onclick="quickSearch('livre')">🟢 Salas livres</button>
          <button class="chip" onclick="quickSearch('Bloco A')">🏢 Bloco A</button>
          <button class="chip" onclick="quickSearch('Bloco B')">🏢 Bloco B</button>
          <button class="chip" onclick="quickSearch('João Silva')">👨‍🏫 Prof. João Silva</button>
        </div>
      </div>

      <div class="search__results" id="search-results">
        <!-- Resultados aparecerão aqui -->
      </div>
    </div>`;
}

function quickSearch(term) {
  const input = document.getElementById('search-input');
  input.value = term;
  performSearch();
  input.focus();
}

function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  const resultsContainer = document.getElementById('search-results');

  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  const results = searchData(query);
  let html = '';
  let totalResults = 0;

  // Disciplinas encontradas
  if (results.subjects.length > 0) {
    html += `<div class="search__section-title">📚 Disciplinas (${results.subjects.length})</div>`;
    results.subjects.forEach(sub => {
      totalResults++;
      html += `
        <div class="search-result">
          <div class="search-result__info">
            <h3>${sub.name}</h3>
            <p>${sub.professor}</p>
            <div class="search-result__meta">
              <span>${svgIcon('clock')} ${getDayLabel(sub.day)} — ${sub.time}</span>
              <span>${svgIcon('pin')} Sala ${sub.room}</span>
            </div>
          </div>
          <button class="btn btn--sm btn--primary" onclick="navigateTo('mapa', {sala: '${sub.room}'})">
            Ver no mapa
          </button>
        </div>`;
    });
  }

  // Salas encontradas
  if (results.rooms.length > 0) {
    html += `<div class="search__section-title">🏫 Salas (${results.rooms.length})</div>`;
    results.rooms.forEach(room => {
      totalResults++;
      html += `
        <div class="search-result">
          <div class="search-result__info">
            <h3>Sala ${room.id}</h3>
            <p>${getBlockLabel(room.block)} — ${getFloorLabel(room.floor)}</p>
            <div class="search-result__meta">
              <span>👥 ${room.capacity} pessoas</span>
              <span>${getStatusIcon(room.status)} ${getStatusLabel(room.status)}</span>
            </div>
          </div>
          <button class="btn btn--sm btn--primary" onclick="navigateTo('mapa', {sala: '${room.id}'})">
            Ver no mapa
          </button>
        </div>`;
    });
  }

  if (totalResults === 0) {
    html = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p>Nenhum resultado encontrado para "${query}".</p>
      </div>`;
  } else {
    html = `<div class="search__count">${totalResults} resultado${totalResults > 1 ? 's' : ''} encontrado${totalResults > 1 ? 's' : ''}</div>` + html;
  }

  resultsContainer.innerHTML = html;
}

function getDayLabel(key) {
  const day = AppData.weekDays.find(d => d.key === key);
  return day ? day.label : key;
}
