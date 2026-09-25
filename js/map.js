// ============================================================
// Sala Livre — Mapa Interativo
// Renderização do campus, seleção de salas, rotas, zoom.
// ============================================================

// Posições das salas no mapa (em pixels, relativo ao campus 900x650)
const MAP_POSITIONS = {
  // Bloco A - 1º andar
  'A101': { block: 'A', slot: 1 },
  'A102': { block: 'A', slot: 2 },
  'A103': { block: 'A', slot: 3 },
  'A104': { block: 'A', slot: 4 },
  'A105': { block: 'A', slot: 5 },
  // Bloco A - 2º andar
  'A201': { block: 'A', slot: 1 },
  'A202': { block: 'A', slot: 2 },
  'A203': { block: 'A', slot: 3 },
  // Bloco B - 1º andar
  'B101': { block: 'B', slot: 1 },
  'B102': { block: 'B', slot: 2 },
  'B103': { block: 'B', slot: 3 },
  'B104': { block: 'B', slot: 4 },
  'B105': { block: 'B', slot: 5 },
  // Bloco B - 2º andar
  'B201': { block: 'B', slot: 1 },
  'B202': { block: 'B', slot: 2 },
  'B203': { block: 'B', slot: 3 },
  // Labs
  'LAB01': { block: 'Labs', slot: 'lab1' },
  'LAB02': { block: 'Labs', slot: 'lab2' },
  'LAB03': { block: 'Labs', slot: 'lab3' },
};

// Waypoints para rotas (coordenadas absolutas no campus 900x650)
// Perfeitamente alinhados: Entrada → Caminho Principal → Corredor Externo → Acesso ao Bloco → Corredor Interno → Sala
const ROUTE_WAYPOINTS = {
  entrance:       { x: 450, y: 635 },
  mainPath:       { x: 450, y: 374 },
  crossLeft:      { x: 158, y: 374 },
  crossRight:     { x: 455, y: 374 },
  blockADoor:     { x: 158, y: 338 },
  blockBDoor:     { x: 455, y: 338 },
  labsDoor:       { x: 135, y: 405 },
  bibDoor:        { x: 415, y: 405 },
  adminDoor:      { x: 650, y: 405 },
  // Corredores internos e entradas de sala no Bloco A
  blockA_corridor:{ x: 158, y: 150 },
  blockA_top:     { x: 90,  y: 100 },
  blockA_topR:    { x: 210, y: 100 },
  blockA_mid:     { x: 90,  y: 175 },
  blockA_midR:    { x: 210, y: 175 },
  blockA_bot:     { x: 158, y: 250 },
  // Corredores internos e entradas de sala no Bloco B
  blockB_corridor:{ x: 455, y: 150 },
  blockB_top:     { x: 385, y: 100 },
  blockB_topR:    { x: 505, y: 100 },
  blockB_mid:     { x: 385, y: 175 },
  blockB_midR:    { x: 505, y: 175 },
  blockB_bot:     { x: 455, y: 250 },
};

// Rotas pré-definidas (sequência de waypoints)
const ROOM_ROUTES = {
  'A101': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_top'],
  'A102': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_topR'],
  'A103': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_mid'],
  'A104': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_midR'],
  'A105': ['entrance','mainPath','crossLeft','blockADoor','blockA_bot'],
  'A201': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_top'],
  'A202': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_topR'],
  'A203': ['entrance','mainPath','crossLeft','blockADoor','blockA_corridor','blockA_mid'],
  'B101': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_top'],
  'B102': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_topR'],
  'B103': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_mid'],
  'B104': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_midR'],
  'B105': ['entrance','mainPath','crossRight','blockBDoor','blockB_bot'],
  'B201': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_top'],
  'B202': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_topR'],
  'B203': ['entrance','mainPath','crossRight','blockBDoor','blockB_corridor','blockB_mid'],
  'LAB01':['entrance','mainPath','crossLeft','labsDoor'],
  'LAB02':['entrance','mainPath','crossLeft','labsDoor'],
  'LAB03':['entrance','mainPath','crossLeft','labsDoor'],
};


// ============================================================
// RENDER MAP PAGE
// ============================================================
function renderMap() {
  const floor = AppState.selectedFloor;

  document.getElementById('app-content').innerHTML = `
    <div class="map-page" id="page-map">

      <!-- Toolbar -->
      <div class="map-page__toolbar">
        <div class="map-page__search">
          <div class="input-group">
            <span class="input-group__icon">${svgIcon('search')}</span>
            <input class="input" type="text" placeholder="Buscar sala..."
                   id="map-search" oninput="searchRoomOnMap()" aria-label="Buscar sala no mapa">
          </div>
        </div>

        <div class="map-page__floors">
          <button class="map-page__floor-btn ${floor === 0 ? 'active' : ''}" onclick="changeFloor(0)">Térreo</button>
          <button class="map-page__floor-btn ${floor === 1 ? 'active' : ''}" onclick="changeFloor(1)">1º andar</button>
          <button class="map-page__floor-btn ${floor === 2 ? 'active' : ''}" onclick="changeFloor(2)">2º andar</button>
        </div>

        <div class="map-page__legend">
          <div class="map-page__legend-item">
            <span class="map-page__legend-dot map-page__legend-dot--livre"></span> Livre
          </div>
          <div class="map-page__legend-item">
            <span class="map-page__legend-dot map-page__legend-dot--ocupada"></span> Ocupada
          </div>
          <div class="map-page__legend-item">
            <span class="map-page__legend-dot map-page__legend-dot--reservada"></span> Reservada
          </div>
        </div>
      </div>

      <!-- Legenda mobile -->
      <div class="map-page__legend-mobile">
        <div class="map-page__legend-item">
          <span class="map-page__legend-dot map-page__legend-dot--livre"></span> Livre
        </div>
        <div class="map-page__legend-item">
          <span class="map-page__legend-dot map-page__legend-dot--ocupada"></span> Ocupada
        </div>
        <div class="map-page__legend-item">
          <span class="map-page__legend-dot map-page__legend-dot--reservada"></span> Reservada
        </div>
      </div>

      <!-- Map View Container (Map + Side Panel overlay) -->
      <div class="map-view-container">
        <!-- Map container -->
        <div class="map-container" id="map-container">
          <div class="map-container__zoom">
            <button class="map-container__zoom-btn" onclick="zoomMap(1)" aria-label="Aumentar zoom">+</button>
            <button class="map-container__zoom-btn" onclick="zoomMap(-1)" aria-label="Diminuir zoom">−</button>
            <button class="map-container__zoom-btn" onclick="zoomMap(0)" aria-label="Resetar zoom" style="font-size:12px">⟲</button>
          </div>

          <div class="map-wrapper" id="map-wrapper">
            <div class="campus" id="campus">

              <!-- SVG route overlay -->
              <svg class="map-route-svg" id="route-svg" viewBox="0 0 900 650" preserveAspectRatio="xMidYMid meet">
                <path class="route-path" id="route-path" d=""/>
              </svg>

              <!-- Route banner -->
              <div class="route-banner" id="route-banner">
                <div class="route-banner__icon">${svgIcon('directions')}</div>
                <span id="route-banner-text">Rota: Entrada → ...</span>
                <button class="route-banner__close" onclick="clearRoute()" aria-label="Fechar rota">✕</button>
              </div>

              <!-- Outdoor Area Details: Gardens, Plaza, Trees, Benches -->
              <div class="campus__garden campus__garden--1"></div>
              <div class="campus__garden campus__garden--2"></div>
              
              <div class="campus__plaza">
                <span class="campus__plaza-label">⛲ Praça de Convivência</span>
              </div>

              <span class="campus__tree" style="top:3%; left:2%">🌳</span>
              <span class="campus__tree" style="top:3%; left:30%">🌳</span>
              <span class="campus__tree" style="top:54%; left:2%">🌳</span>
              <span class="campus__tree" style="top:54%; left:95%">🌳</span>
              <span class="campus__tree" style="top:76%; left:30%">🌳</span>
              <span class="campus__tree" style="top:76%; left:58%">🌳</span>
              <span class="campus__tree" style="top:92%; left:40%">🌳</span>
              <span class="campus__tree" style="top:92%; left:57%">🌳</span>

              <span class="campus__bench" style="top:53%; left:12%">🪑</span>
              <span class="campus__bench" style="top:53%; left:60%">🪑</span>
              <span class="campus__bench" style="top:76%; left:10%">🪑</span>

              <!-- Pathways -->
              <div class="campus__path campus__path--main-v"></div>
              <div class="campus__path campus__path--h1"></div>
              <div class="campus__path campus__path--left-v"></div>
              <div class="campus__path campus__path--right-v"></div>
              <div class="campus__path campus__path--to-labs"></div>
              <div class="campus__path campus__path--to-bib"></div>
              <div class="campus__path campus__path--to-admin"></div>
              <div class="campus__path campus__path--lower-h"></div>
              <div class="campus__path campus__path--entrance"></div>

              <!-- Entrance -->
              <div class="campus__entrance" id="map-entrance">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 0l5 9H3l5-9z"/></svg>
                ENTRADA PRINCIPAL
              </div>

              <!-- Block A -->
              <div class="building building--block-a" id="building-block-a">
                <span class="building__label">BLOCO A</span>
                <div class="building__door-marker" style="bottom:-8px; left:50%; transform:translateX(-50%);">🚪 Acesso A</div>
                <div class="building__corridor"></div>
                <div class="building__stairs">🪜 Escadas</div>
                <div id="rooms-block-a">
                  ${renderBlockRooms('A', floor)}
                </div>
              </div>

              <!-- Block B -->
              <div class="building building--block-b" id="building-block-b">
                <span class="building__label">BLOCO B</span>
                <div class="building__door-marker" style="bottom:-8px; left:50%; transform:translateX(-50%);">🚪 Acesso B</div>
                <div class="building__corridor"></div>
                <div class="building__stairs">🪜 Escadas</div>
                <div id="rooms-block-b">
                  ${renderBlockRooms('B', floor)}
                </div>
              </div>

              <!-- Labs -->
              <div class="building building--labs" id="building-labs">
                <span class="building__label">LABORATÓRIOS</span>
                <div class="building__door-marker" style="top:-8px; left:50%; transform:translateX(-50%);">🚪 Ent. Labs</div>
                <div id="rooms-labs">
                  ${renderLabRooms()}
                </div>
              </div>

              <!-- Biblioteca -->
              <div class="building building--biblioteca">
                <span class="building__label">BIBLIOTECA</span>
                <div class="building__door-marker" style="top:-8px; left:50%; transform:translateX(-50%);">🚪 Ent. Bib</div>
                <div class="building__icon">
                  <span class="building__icon-emoji">📚</span>
                  <span class="building__icon-text">Acervo & Estudo</span>
                </div>
              </div>

              <!-- Administração -->
              <div class="building building--admin">
                <span class="building__label">ADMINISTRATIVO</span>
                <div class="building__door-marker" style="top:-8px; left:50%; transform:translateX(-50%);">🚪 Secretaria</div>
                <div class="building__icon">
                  <span class="building__icon-emoji">🏛️</span>
                  <span class="building__icon-text">Atendimento</span>
                </div>
              </div>

              <!-- Refeitório -->
              <div class="building building--refeitorio">
                <span class="building__label">REFEITÓRIO</span>
                <div class="building__icon">
                  <span class="building__icon-emoji">🍽️</span>
                </div>
              </div>

              <!-- WC -->
              <div class="building building--wc">
                <span class="building__label">WC</span>
                <div class="building__icon">
                  <span class="building__icon-emoji" style="font-size:16px">🚻</span>
                </div>
              </div>

              <!-- Quadra -->
              <div class="building building--quadra">
                <span class="building__label">QUADRA POLIESPORTIVA</span>
                <div class="building__icon">
                  <span class="building__icon-emoji">⚽</span>
                </div>
              </div>

              <!-- Estacionamento -->
              <div class="building building--estacionamento">
                <span class="building__label">ESTACIONAMENTO</span>
                <div class="building__icon">
                  <span class="building__icon-emoji">🚗 🚙 🅿️</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Detail panel (Side Panel on Desktop / Bottom Sheet on Mobile) -->
        <div class="map-detail" id="map-detail">
          <!-- Preenchido ao clicar em sala -->
        </div>
      </div>
    </div>`;

  // Pós-renderização: verificar se deve destacar sala
  setTimeout(() => {
    if (AppState.selectedRoom) {
      const roomId = AppState.selectedRoom;
      AppState.selectedRoom = null;

      // Verificar se a sala está no andar atual
      const room = getRoomById(roomId);
      if (room && room.floor !== AppState.selectedFloor) {
        changeFloor(room.floor);
        setTimeout(() => highlightAndSelectRoom(roomId), 200);
      } else {
        highlightAndSelectRoom(roomId);
      }
    }
  }, 100);
}


// ============================================================
// RENDERIZAR SALAS NOS BLOCOS
// ============================================================
function renderBlockRooms(block, floor) {
  const prefix = block + (floor === 0 ? '' : floor);
  const rooms = AppData.rooms.filter(r => r.block === block && r.floor === floor);

  if (rooms.length === 0 && floor === 0) {
    return `<div class="building__icon" style="padding-top:20px">
      <span class="building__icon-text" style="font-size:11px;color:var(--text-tertiary)">Selecione um andar<br>para ver as salas</span>
    </div>`;
  }

  let html = '';
  rooms.forEach((room, i) => {
    const slotNum = MAP_POSITIONS[room.id]?.slot || (i + 1);
    html += `
      <div class="room room--${slotNum}" 
           id="room-${room.id}"
           data-room="${room.id}"
           onclick="selectRoom('${room.id}')"
           role="button" tabindex="0"
           aria-label="Sala ${room.id}, ${getStatusLabel(room.status)}">
        <span class="room__status-dot room__status-dot--${room.status}" title="${getStatusLabel(room.status)}"></span>
        <span class="room__id">${room.id}</span>
      </div>`;
  });
  return html;
}

function renderLabRooms() {
  const labs = AppData.rooms.filter(r => r.block === 'Labs');
  let html = '';
  labs.forEach(room => {
    const slotId = MAP_POSITIONS[room.id]?.slot || 'lab1';
    html += `
      <div class="room room--${slotId}"
           id="room-${room.id}"
           data-room="${room.id}"
           onclick="selectRoom('${room.id}')"
           role="button" tabindex="0"
           aria-label="Sala ${room.id}, ${getStatusLabel(room.status)}">
        <span class="room__status-dot room__status-dot--${room.status}" title="${getStatusLabel(room.status)}"></span>
        <span class="room__id" style="font-size:9px">${room.id}</span>
      </div>`;
  });
  return html;
}


// ============================================================
// SELECIONAR SALA
// ============================================================
function selectRoom(roomId) {
  const room = getRoomById(roomId);
  if (!room) return;

  // Remover seleção anterior
  document.querySelectorAll('.room.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.room.highlight').forEach(el => el.classList.remove('highlight'));

  // Selecionar nova
  const roomEl = document.getElementById('room-' + roomId);
  if (roomEl) roomEl.classList.add('selected');

  // Mostrar painel de detalhes
  showRoomDetail(room);
}

function highlightAndSelectRoom(roomId) {
  const roomEl = document.getElementById('room-' + roomId);
  if (roomEl) {
    roomEl.classList.add('highlight');
    roomEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Também selecionar
    setTimeout(() => selectRoom(roomId), 300);
  }
}


// ============================================================
// PAINEL DE DETALHES
// ============================================================
function showRoomDetail(room) {
  const subject = getNextSubjectForRoom(room.id);
  const detail = document.getElementById('map-detail');

  detail.innerHTML = `
    <div class="map-detail__header">
      <div>
        <div class="map-detail__title">Sala ${room.id}</div>
        <div class="map-detail__location">${getBlockLabel(room.block)} — ${getFloorLabel(room.floor)}</div>
      </div>
      <button class="map-detail__close" onclick="closeRoomDetail()" aria-label="Fechar detalhes">
        ${svgIcon('close')}
      </button>
    </div>

    <div class="map-detail__grid">
      <div class="map-detail__item">
        <div class="map-detail__item-label">Status</div>
        <div class="map-detail__item-value">${createBadge(room.status)}</div>
      </div>
      <div class="map-detail__item">
        <div class="map-detail__item-label">Capacidade</div>
        <div class="map-detail__item-value">${room.capacity} pessoas</div>
      </div>
      <div class="map-detail__item">
        <div class="map-detail__item-label">Tipo</div>
        <div class="map-detail__item-value">${room.type}</div>
      </div>
    </div>

    ${subject ? `
    <div class="map-detail__next-class">
      <div class="map-detail__next-class-label">Próxima aula</div>
      <h4>${subject.name}</h4>
      <p>${subject.professor} · ${getTimeRange(subject)}</p>
    </div>` : ''}

    <div class="map-detail__actions">
      <button class="btn btn--primary" onclick="showRoute('${room.id}')">
        ${svgIcon('directions')} Como chegar
      </button>
      <button class="btn btn--secondary" onclick="closeRoomDetail()">
        Fechar
      </button>
    </div>`;

  detail.classList.add('visible');
}

function closeRoomDetail() {
  const detail = document.getElementById('map-detail');
  detail.classList.remove('visible');
  document.querySelectorAll('.room.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.room.highlight').forEach(el => el.classList.remove('highlight'));
}


// ============================================================
// TROCAR ANDAR
// ============================================================
function changeFloor(floor) {
  AppState.selectedFloor = floor;

  // Atualizar botões
  document.querySelectorAll('.map-page__floor-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === floor);
  });

  // Re-renderizar salas nos blocos
  const roomsA = document.getElementById('rooms-block-a');
  const roomsB = document.getElementById('rooms-block-b');
  if (roomsA) roomsA.innerHTML = renderBlockRooms('A', floor);
  if (roomsB) roomsB.innerHTML = renderBlockRooms('B', floor);

  // Labs sempre visíveis (são no térreo), mas dimmed quando não é térreo
  const labsBuilding = document.getElementById('building-labs');
  if (labsBuilding) {
    labsBuilding.style.opacity = floor === 0 ? '1' : '0.6';
  }

  // Limpar detalhes e rota
  closeRoomDetail();
  clearRoute();
}


// ============================================================
// BUSCAR SALA NO MAPA
// ============================================================
function searchRoomOnMap() {
  const query = document.getElementById('map-search').value.toUpperCase().trim();

  // Limpar destaques
  document.querySelectorAll('.room.highlight').forEach(el => el.classList.remove('highlight'));

  if (!query) return;

  // Procurar sala
  const room = getRoomById(query);
  if (room) {
    // Mudar para o andar correto
    if (room.floor !== AppState.selectedFloor) {
      changeFloor(room.floor);
      setTimeout(() => highlightAndSelectRoom(room.id), 200);
    } else {
      highlightAndSelectRoom(room.id);
    }
  }
}


// ============================================================
// ROTA SVG
// ============================================================
function showRoute(roomId) {
  clearRoute();

  const waypoints = ROOM_ROUTES[roomId];
  if (!waypoints || waypoints.length < 2) return;

  // Gerar path SVG
  const points = waypoints.map(w => ROUTE_WAYPOINTS[w]);
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    // Usar curvas suaves para parecer mais natural
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    if (Math.abs(dx) > 10 && Math.abs(dy) > 10) {
      // Diagonal → usar curva
      const midX = prev.x + dx * 0.5;
      d += ` Q ${prev.x + dx * 0.3} ${prev.y} ${midX} ${prev.y + dy * 0.5}`;
      d += ` Q ${curr.x - dx * 0.3} ${curr.y} ${curr.x} ${curr.y}`;
    } else {
      d += ` L ${curr.x} ${curr.y}`;
    }
  }

  const pathEl = document.getElementById('route-path');
  pathEl.setAttribute('d', d);

  // Calcular comprimento para animação
  const pathLength = pathEl.getTotalLength();
  pathEl.style.strokeDasharray = pathLength;
  pathEl.style.strokeDashoffset = pathLength;

  // Trigger animation
  requestAnimationFrame(() => {
    pathEl.classList.add('animate');
    pathEl.style.strokeDashoffset = '0';
    pathEl.style.transition = `stroke-dashoffset ${Math.min(pathLength / 300, 3)}s ease`;
  });

  // Mostrar banner
  const banner = document.getElementById('route-banner');
  const room = getRoomById(roomId);
  document.getElementById('route-banner-text').textContent =
    `Rota: Entrada → Sala ${roomId} (${getBlockLabel(room.block)}, ${getFloorLabel(room.floor)})`;
  banner.classList.add('visible');

  // Scroll para ver a rota
  document.getElementById('map-container').scrollTo({ top: 0, behavior: 'smooth' });
}

function clearRoute() {
  const pathEl = document.getElementById('route-path');
  if (pathEl) {
    pathEl.classList.remove('animate');
    pathEl.setAttribute('d', '');
    pathEl.style.strokeDashoffset = '';
    pathEl.style.transition = '';
  }

  const banner = document.getElementById('route-banner');
  if (banner) banner.classList.remove('visible');
}


// ============================================================
// ZOOM
// ============================================================
function zoomMap(direction) {
  const wrapper = document.getElementById('map-wrapper');
  if (!wrapper) return;

  if (direction === 0) {
    AppState.mapZoom = 1;
  } else {
    AppState.mapZoom = Math.max(0.6, Math.min(2, AppState.mapZoom + direction * 0.2));
  }

  wrapper.style.transform = `scale(${AppState.mapZoom})`;
  wrapper.style.transformOrigin = 'top left';

  // Ajustar dimensões mínimas para scroll
  if (AppState.mapZoom > 1) {
    wrapper.style.minWidth = (900 * AppState.mapZoom) + 'px';
    wrapper.style.minHeight = (650 * AppState.mapZoom) + 'px';
  } else {
    wrapper.style.minWidth = '900px';
    wrapper.style.minHeight = '650px';
  }
}
