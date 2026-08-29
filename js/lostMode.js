// ============================================================
// Sala Livre — Modo Aluno Perdido
// Modal interativo em duas etapas para localizar a próxima aula.
// ============================================================

function openLostMode() {
  const coursesOptions = AppData.courses.map(c =>
    `<option value="${c.name}" ${c.name === AppData.user.course ? 'selected' : ''}>${c.name}</option>`
  ).join('');

  openModal(`
    <button class="modal__close" onclick="closeModal()" aria-label="Fechar">
      ${svgIcon('close')}
    </button>

    <div id="lost-mode-content">
      <!-- Etapa 1: Seleção -->
      <div id="lost-step-1">
        <div class="modal__icon">🧭</div>
        <h2 class="modal__title">Modo Aluno Perdido</h2>
        <p class="modal__text">Vamos encontrar sua próxima aula. Informe seu curso e semestre abaixo.</p>

        <div class="modal__field">
          <label class="modal__label" for="lost-course">Curso</label>
          <select class="select" id="lost-course" style="width:100%">
            ${coursesOptions}
          </select>
        </div>

        <div class="modal__field">
          <label class="modal__label" for="lost-semester">Semestre</label>
          <select class="select" id="lost-semester" style="width:100%">
            <option value="1">1º semestre</option>
            <option value="2">2º semestre</option>
            <option value="3">3º semestre</option>
            <option value="4">4º semestre</option>
            <option value="5" selected>5º semestre</option>
            <option value="6">6º semestre</option>
            <option value="7">7º semestre</option>
            <option value="8">8º semestre</option>
          </select>
        </div>

        <button class="btn btn--primary btn--lg" style="width:100%;margin-top:8px" onclick="findMyClass()">
          Encontrar minha aula
        </button>
      </div>
    </div>
  `);
}


function findMyClass() {
  const nc = AppData.nextClass;

  // Animação de transição entre etapas
  const content = document.getElementById('lost-mode-content');
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';
  content.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    content.innerHTML = `
      <div id="lost-step-2">
        <div class="modal__icon" style="background: var(--green-bg);">✅</div>
        <h2 class="modal__title">Sua próxima aula</h2>
        <p class="modal__text">Encontramos sua aula! Veja os detalhes abaixo.</p>

        <div class="modal__result">
          <div class="modal__result-subject">${nc.subject}</div>
          <div class="modal__result-info">
            <span>${svgIcon('clock')} ${nc.time}</span>
            <span>${svgIcon('pin')} Sala ${nc.room}</span>
            <span>🏢 ${nc.building} — ${nc.floorLabel}</span>
          </div>
        </div>

        <button class="btn btn--primary btn--lg" style="width:100%" onclick="goToRoomFromLostMode('${nc.room}')">
          ${svgIcon('directions')} Me mostrar no mapa
        </button>

        <button class="btn btn--ghost" style="width:100%;margin-top:8px" onclick="closeModal()">
          Fechar
        </button>
      </div>`;

    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 300);
}


function goToRoomFromLostMode(roomId) {
  closeModal();
  AppState.selectedRoom = roomId;
  navigateTo('mapa', { sala: roomId });
}
