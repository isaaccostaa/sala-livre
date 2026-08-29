// ============================================================
// Sala Livre — Dados Fictícios
// Todas as estruturas de dados mockadas para o protótipo.
// Futuramente serão substituídas por chamadas ao backend/API.
// ============================================================

const AppData = {

  // --- Usuário logado (simulado) ---
  user: {
    name: 'Lucas',
    initials: 'LS',
    course: 'Engenharia de Software',
    semester: 5
  },

  // --- Estatísticas gerais do campus ---
  stats: {
    free: 35,
    occupied: 12,
    reserved: 4,
    labsAvailable: 6
  },

  // --- Salas ---
  rooms: [
    // Bloco A — 1º Andar
    { id: 'A101', block: 'A', floor: 1, capacity: 40, type: 'Sala de aula', status: 'ocupada' },
    { id: 'A102', block: 'A', floor: 1, capacity: 35, type: 'Sala de aula', status: 'livre' },
    { id: 'A103', block: 'A', floor: 1, capacity: 45, type: 'Sala de aula', status: 'ocupada' },
    { id: 'A104', block: 'A', floor: 1, capacity: 30, type: 'Sala de aula', status: 'reservada' },
    { id: 'A105', block: 'A', floor: 1, capacity: 60, type: 'Auditório', status: 'livre' },
    // Bloco A — 2º Andar
    { id: 'A201', block: 'A', floor: 2, capacity: 40, type: 'Sala de aula', status: 'livre' },
    { id: 'A202', block: 'A', floor: 2, capacity: 35, type: 'Sala de aula', status: 'ocupada' },
    { id: 'A203', block: 'A', floor: 2, capacity: 25, type: 'Laboratório', status: 'livre' },
    // Bloco B — 1º Andar
    { id: 'B101', block: 'B', floor: 1, capacity: 35, type: 'Sala de aula', status: 'reservada' },
    { id: 'B102', block: 'B', floor: 1, capacity: 40, type: 'Sala de aula', status: 'livre' },
    { id: 'B103', block: 'B', floor: 1, capacity: 30, type: 'Sala de aula', status: 'ocupada' },
    { id: 'B104', block: 'B', floor: 1, capacity: 35, type: 'Sala de aula', status: 'livre' },
    { id: 'B105', block: 'B', floor: 1, capacity: 25, type: 'Laboratório', status: 'livre' },
    // Bloco B — 2º Andar
    { id: 'B201', block: 'B', floor: 2, capacity: 35, type: 'Sala de aula', status: 'reservada' },
    { id: 'B202', block: 'B', floor: 2, capacity: 40, type: 'Sala de aula', status: 'livre' },
    { id: 'B203', block: 'B', floor: 2, capacity: 30, type: 'Laboratório', status: 'ocupada' },
    // Laboratórios — Térreo
    { id: 'LAB01', block: 'Labs', floor: 0, capacity: 25, type: 'Laboratório de Informática', status: 'livre' },
    { id: 'LAB02', block: 'Labs', floor: 0, capacity: 25, type: 'Laboratório de Informática', status: 'ocupada' },
    { id: 'LAB03', block: 'Labs', floor: 0, capacity: 20, type: 'Laboratório de Redes', status: 'livre' },
  ],

  // --- Grade de aulas do semestre ---
  subjects: [
    { id: 1,  name: 'Cálculo III',              professor: 'Prof. Carlos Santos',    room: 'A101', day: 'segunda', time: '08:00', duration: 2, color: '#6366f1' },
    { id: 2,  name: 'Engenharia de Software',    professor: 'Prof. João Silva',       room: 'A102', day: 'segunda', time: '20:30', duration: 2, color: '#14b8a6' },
    { id: 3,  name: 'Estrutura de Dados',        professor: 'Profa. Lucia Ferreira',  room: 'B102', day: 'terca',   time: '08:00', duration: 2, color: '#f59e0b' },
    { id: 4,  name: 'Banco de Dados',            professor: 'Profa. Maria Oliveira',  room: 'B103', day: 'terca',   time: '14:00', duration: 2, color: '#ef4444' },
    { id: 5,  name: 'Redes de Computadores',     professor: 'Prof. Ana Costa',        room: 'B101', day: 'quarta',  time: '10:00', duration: 2, color: '#8b5cf6' },
    { id: 6,  name: 'Sistemas Operacionais',     professor: 'Prof. Roberto Lima',     room: 'A103', day: 'quarta',  time: '20:30', duration: 2, color: '#ec4899' },
    { id: 7,  name: 'Inteligência Artificial',   professor: 'Prof. Pedro Mendes',     room: 'A201', day: 'quinta',  time: '16:00', duration: 2, color: '#0ea5e9' },
    { id: 8,  name: 'Compiladores',              professor: 'Profa. Fernanda Souza',  room: 'B201', day: 'quinta',  time: '14:00', duration: 2, color: '#f97316' },
    { id: 9,  name: 'Projeto Integrador',        professor: 'Prof. João Silva',       room: 'LAB01', day: 'sexta', time: '10:00', duration: 2, color: '#06b6d4' },
    { id: 10, name: 'Física II',                 professor: 'Prof. Ricardo Alves',    room: 'A104', day: 'sexta',  time: '08:00', duration: 2, color: '#84cc16' },
    { id: 11, name: 'Programação Web',           professor: 'Prof. André Santos',     room: 'LAB02', day: 'segunda', time: '14:00', duration: 2, color: '#a855f7' },
    { id: 12, name: 'Matemática Discreta',       professor: 'Profa. Carla Lima',      room: 'B104', day: 'terca',   time: '16:00', duration: 2, color: '#64748b' },
  ],

  // --- Cursos disponíveis ---
  courses: [
    { name: 'Engenharia de Software', semesters: 8 },
    { name: 'Ciência da Computação',  semesters: 8 },
    { name: 'Sistemas de Informação', semesters: 8 },
    { name: 'Engenharia Elétrica',    semesters: 10 },
    { name: 'Administração',          semesters: 8 },
    { name: 'Engenharia Civil',       semesters: 10 },
  ],

  // --- Próxima aula do usuário (atalho para dashboard / modo perdido) ---
  nextClass: {
    subject: 'Engenharia de Software',
    professor: 'Prof. João Silva',
    time: '20:30',
    room: 'A102',
    block: 'A',
    floor: 1,
    building: 'Bloco A',
    floorLabel: '1º andar'
  },

  // --- Dias da semana (auxiliar) ---
  weekDays: [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca',   label: 'Terça' },
    { key: 'quarta',  label: 'Quarta' },
    { key: 'quinta',  label: 'Quinta' },
    { key: 'sexta',   label: 'Sexta' },
  ],

  // --- Time slots para grade (auxiliar) ---
  timeSlots: ['08:00', '10:00', '14:00', '16:00', '20:30'],
};


// ============================================================
// Funções auxiliares para consulta dos dados
// ============================================================

function getRoomById(id) {
  return AppData.rooms.find(r => r.id === id);
}

function getRoomsByFloor(floor) {
  return AppData.rooms.filter(r => r.floor === floor);
}

function getRoomsByBlock(block) {
  return AppData.rooms.filter(r => r.block === block);
}

function getSubjectsByDay(day) {
  return AppData.subjects.filter(s => s.day === day);
}

function getSubjectByRoom(roomId) {
  return AppData.subjects.find(s => s.room === roomId);
}

function getNextSubjectForRoom(roomId) {
  return AppData.subjects.find(s => s.room === roomId);
}

function searchData(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { rooms: [], subjects: [], professors: [] };

  const rooms = AppData.rooms.filter(r =>
    r.id.toLowerCase().includes(q) ||
    r.type.toLowerCase().includes(q) ||
    ('bloco ' + r.block).toLowerCase().includes(q)
  );

  const subjects = AppData.subjects.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.professor.toLowerCase().includes(q) ||
    s.room.toLowerCase().includes(q)
  );

  const professors = [...new Set(
    AppData.subjects
      .filter(s => s.professor.toLowerCase().includes(q))
      .map(s => s.professor)
  )];

  return { rooms, subjects, professors };
}

function getStatusLabel(status) {
  const labels = { livre: 'Livre', ocupada: 'Ocupada', reservada: 'Reservada' };
  return labels[status] || status;
}

function getStatusIcon(status) {
  const icons = { livre: '✓', ocupada: '✕', reservada: '◉' };
  return icons[status] || '';
}

function getFloorLabel(floor) {
  if (floor === 0) return 'Térreo';
  return floor + 'º andar';
}

function getBlockLabel(block) {
  if (block === 'Labs') return 'Laboratórios';
  return 'Bloco ' + block;
}
