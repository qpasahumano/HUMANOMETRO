/* ==========================================================
   HUMANÓMETRO® — MOTOR V2 & CONTROL DE BLOQUEOS (JS 2)
   CÓDIGO ÍNTEGRO Y COMPLETO CON ACTUALIZACIÓN DE TERMÓMETRO NUMÉRICO
   ========================================================== */

/* ===============================
   ESTADO GLOBAL Y VARIABLES V2
================================ */
let v2CurrentWeek = 0;
let v2Scores = {
  entorno: 0,
  tecnologia: 0,
  emociones: 0
};
let v2TotalScore = 0;
let v2AnswersLog = [];

/* CONFIGURACIÓN DE BLOQUES V2 (SEMANAS 1 A 4) */
const V2_WEEKS = [
  {
    title: "Semana 1: Vínculo con el entorno",
    measure: "Percepción y Espacio",
    questions: [
      { t: "¿Te sentís abrumado por la cantidad de estímulos visuales y sonoros cotidianos?", note: "Saturación ambiental" },
      { t: "¿Lográs encontrar momentos de silencio real en tu día a día?", note: "Búsqueda de pausa" },
      { t: "¿Observás los cambios de la naturaleza o el clima a tu alrededor?", note: "Conexión exterior" }
    ]
  },
  {
    title: "Semana 2: Tecnología y Atención",
    measure: "Foco y Presencia",
    questions: [
      { t: "¿Agarrás el teléfono de forma automática sin un motivo específico?", note: "Automatismo digital" },
      { t: "¿Sentís la necesidad imperiosa de responder notificaciones de inmediato?", note: "Urgencia artificial" },
      { t: "¿Disfrutás de una comida o caminata completamente alejado de pantallas?", note: "Presencia real" }
    ]
  },
  {
    title: "Semana 3: Estados Profundos",
    measure: "Fluido Emocional",
    questions: [
      { t: "¿Identificás con claridad qué emoción predomina en vos al despertar?", note: "Claridad emocional" },
      { t: "¿Te permitís transitar la tristeza o el enojo sin reprimir ni dramatizar?", note: "Aceptación interna" },
      { t: "¿Compartís tus vulnerabilidades con personas de confianza?", note: "Vínculo auténtico" }
    ]
  },
  {
    title: "Semana 4: Coherencia y Síntesis",
    measure: "Pulso Humano Integrado",
    questions: [
      { t: "¿Sentís que tus acciones diarias reflejan tus valores más profundos?", note: "Coherencia de vida" },
      { t: "¿Cuidás tu energía física y mental como un recurso valioso?", note: "Autocuidado consciente" },
      { t: "¿Experimentás gratitud genuina por las pequeñas cosas cotidianas?", note: "Disposición vital" }
    ]
  }
];

/* ===============================
   INICIALIZACIÓN Y FLUJO V2
================================ */
function startV2() {
  if (!pasoUnaSemanaV2()) {
    showWeeklyBlockFlash();
    return;
  }
  v2CurrentWeek = 0;
  v2Scores = { entorno: 0, tecnologia: 0, emociones: 0 };
  v2TotalScore = 0;
  v2AnswersLog = [];
  
  show("testV2");
  loadV2Question();
  updateThermometer(0);
}

let v2QuestionIndex = 0;

function loadV2Question() {
  const currentWeekData = V2_WEEKS[v2CurrentWeek];
  const q = currentWeekData.questions[v2QuestionIndex];

  const weekTitleEl = document.getElementById("weekTitle");
  if (weekTitleEl) weekTitleEl.textContent = currentWeekData.title;

  const questionMeasureEl = document.getElementById("questionMeasure");
  if (questionMeasureEl) questionMeasureEl.textContent = currentWeekData.measure;

  const questionTextEl = document.getElementById("questionText");
  if (questionTextEl) questionTextEl.textContent = q.t;

  const noteEl = document.getElementById("v2QuestionNote");
  if (noteEl) {
    noteEl.textContent = q.note;
  }

  const totalQuestions = V2_WEEKS.length * 3;
  const answeredCount = (v2CurrentWeek * 3) + v2QuestionIndex;
  const progress = (answeredCount / totalQuestions) * 100;
  updateThermometer(progress);
}

function answerV2(value) {
  v2AnswersLog.push(value);
  v2TotalScore += value;

  if (v2CurrentWeek === 0) v2Scores.entorno += value;
  else if (v2CurrentWeek === 1) v2Scores.tecnologia += value;
  else if (v2CurrentWeek === 2) v2Scores.emociones += value;
  else v2Scores.emociones += value;

  v2QuestionIndex++;

  if (v2QuestionIndex < 3) {
    loadV2Question();
  } else {
    showWeeklyResultV2();
  }
}

function showWeeklyResultV2() {
  show("weeklyResult");
  const progress = ((v2CurrentWeek + 1) / V2_WEEKS.length) * 100;
  updateThermometer(progress);

  const symbols = ["🌱", "📱", "🌊", "⚖️"];
  const symbolEl = document.getElementById("weeklySymbol");
  if (symbolEl) symbolEl.textContent = symbols[v2CurrentWeek];

  const texts = [
    "Tu percepción del entorno muestra un registro sensible de los espacios que habitás.",
    "El vínculo con la tecnología refleja tensiones típicas entre la distracción y el deseo de presencia.",
    "Tus estados profundos revelan un tránsito emocional en constante búsqueda de equilibrio.",
    "La síntesis final expone una maduración en tu coherencia y pulso humano."
  ];

  const advices = [
    "Continuá observando cómo te afecta el ruido exterior.",
    "Ensaya pequeños espacios libres de notificaciones esta semana.",
    "Permitite habitar tus emociones sin juicio.",
    "Atesorá esta coherencia en tus decisiones diarias."
  ];

  const textEl = document.getElementById("weeklyText");
  const adviceEl = document.getElementById("weeklyAdvice");
  if (textEl) textEl.textContent = texts[v2CurrentWeek];
  if (adviceEl) adviceEl.textContent = advices[v2CurrentWeek];
}

function nextWeek() {
  v2CurrentWeek++;
  v2QuestionIndex = 0;

  if (v2CurrentWeek < V2_WEEKS.length) {
    show("testV2");
    loadV2Question();
  } else {
    show("monthlyResult");
    updateThermometer(100);
    marcarSemanaV2();
  }
}

/* ===============================
   FASE FINAL: EL ESPEJO
================================ */
let mirrorStep = 0;
const MIRROR_SITUATIONS = [
  { emoji: "🫥", text: "¿Qué tanta resistencia sentís cuando tus planes cambian de imprevisto?" },
  { emoji: "🪞", text: "¿Con qué frecuencia te juzgás severamente por tus propios errores?" },
  { emoji: "⚖️", text: "¿Cuánto te cuesta poner límites sanos en tus relaciones cotidianas?" },
  { emoji: "🔥", text: "¿Qué nivel de ansiedad te genera la incertidumbre sobre el futuro?" }
];

let mirrorScores = [];

function gateMirrorIntro() {
  show("mirrorIntro");
  updateMirrorThermometer(0);
}

function startMirror() {
  mirrorStep = 0;
  mirrorScores = [];
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  const m = MIRROR_SITUATIONS[mirrorStep];
  const emojiEl = document.getElementById("mirrorEmoji");
  const questionEl = document.getElementById("mirrorQuestion");
  
  if (emojiEl) emojiEl.textContent = m.emoji;
  if (questionEl) questionEl.textContent = m.text;
  
  const progress = ((mirrorStep + 1) / MIRROR_SITUATIONS.length) * 100;
  updateMirrorThermometer(progress);
}

function answerMirror(value) {
  mirrorScores.push(value);
  mirrorStep++;

  if (mirrorStep < MIRROR_SITUATIONS.length) {
    loadMirrorQuestion();
  } else {
    showFinalResult();
  }
}

function showFinalResult() {
  show("finalResult");
  updateMirrorThermometer(100);

  const mirrorSum = mirrorScores.reduce((a, b) => a + b, 0);
  const maxMirror = MIRROR_SITUATIONS.length * 2;
  const mirrorPercent = Math.round((mirrorSum / maxMirror) * 100);

  const finalStateEl = document.getElementById("finalState");
  if (finalStateEl) {
    finalStateEl.textContent = `Índice Espejo: ${mirrorPercent}% de Intensidad Reactiva`;
  }

  const circlesContainer = document.querySelector("#finalResult #circles");
  if (circlesContainer) {
    circlesContainer.innerHTML = `
      <div class="circle"><span>Entorno</span><br><strong>${Math.round((v2Scores.entorno / 6) * 100)}%</strong></div>
      <div class="circle"><span>Tecnología</span><br><strong>${Math.round((v2Scores.tecnologia / 6) * 100)}%</strong></div>
      <div class="circle"><span>Emociones</span><br><strong>${Math.round((v2Scores.emociones / 6) * 100)}%</strong></div>
      <div class="circle"><span>Espejo</span><br><strong>${mirrorPercent}%</strong></div>
    `;
  }

  const verticalFill = document.getElementById("finalFill");
  if (verticalFill) {
    verticalFill.style.height = mirrorPercent + '%';
  }

  const textWrap = document.getElementById("finalTextWrap");
  const humanText = document.getElementById("finalHumanText");
  if (textWrap && humanText) {
    textWrap.classList.remove("hidden");
    humanText.textContent = 
      "Has completado el ciclo completo del Humanómetro Volumen II y El Espejo.\n\n" +
      "Este mapa refleja tu estado actual de autoconsciencia. Recordá que la herramienta no califica tu valor, sino que ilumina los espacios donde tu humanidad busca integración y equilibrio.";
  }
}

/* ===============================
   ACTUALIZACIÓN DE TERMÓMETROS V2 (CON ESCALA NUMÉRICA)
================================ */
function updateThermometer(percent) {
  if (percent !== undefined) {
    const fills = document.querySelectorAll('#thermoFill, .thermo-fill, #weeklyThermoFill');
    fills.forEach(fill => {
      if (fill) fill.style.width = percent + '%';
    });
    
    const numVals = document.querySelectorAll('#thermoNumVal');
    numVals.forEach(nv => {
      if (nv) nv.textContent = Math.round(percent) + '%';
    });
  }
}

function updateMirrorThermometer(percent) {
  if (percent !== undefined) {
    const mirrorFills = document.querySelectorAll('#thermoFillMirror');
    mirrorFills.forEach(fill => {
      if (fill) fill.style.width = percent + '%';
    });
    
    const mirrorNumVals = document.querySelectorAll('#thermoNumValMirror');
    mirrorNumVals.forEach(nv => {
      if (nv) nv.textContent = Math.round(percent) + '%';
    });
  }
}

/* ===============================
   CONTROL DE BLOQUEO SEMANAL V2
================================ */
const V2_BLOCK_KEY = "hm_v2_last_week";
const V2_DEV_MODE = false;
const V2_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function v2Now() { 
  return Date.now(); 
}

function pasoUnaSemanaV2() {
  if (V2_DEV_MODE) return true;
  const last = localStorage.getItem(V2_BLOCK_KEY);
  if (!last) return true;
  return (v2Now() - Number(last)) >= V2_WEEK_MS;
}

function marcarSemanaV2() {
  localStorage.setItem(V2_BLOCK_KEY, v2Now());
}

/* ===============================
   PERSISTENCIA Y SOPORTE V2
================================ */
const V2_STATE_KEY = "hm_v2_progress_state";

function guardarEstadoV2() {
  const stateData = {
    v2CurrentWeek,
    v2Scores,
    v2TotalScore,
    v2AnswersLog,
    timestamp: v2Now()
  };
  localStorage.setItem(V2_STATE_KEY, JSON.stringify(stateData));
}

function cargarEstadoV2() {
  const savedState = localStorage.getItem(V2_STATE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed && parsed.v2CurrentWeek !== undefined) {
        v2CurrentWeek = parsed.v2CurrentWeek || 0;
        v2Scores = parsed.v2Scores || { entorno: 0, tecnologia: 0, emociones: 0 };
        v2TotalScore = parsed.v2TotalScore || 0;
        v2AnswersLog = parsed.v2AnswersLog || [];
      }
    } catch (e) {
      console.warn("No se pudo restaurar el estado V2 anterior:", e);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cargarEstadoV2();
});

window.addEventListener("beforeunload", () => {
  guardarEstadoV2();
});

/* ===============================
   SOPORTE ADICIONAL Y DEPURACIÓN V2
================================ */
function resetV2State() {
  localStorage.removeItem(V2_STATE_KEY);
  v2CurrentWeek = 0;
  v2Scores = { entorno: 0, tecnologia: 0, emociones: 0 };
  v2TotalScore = 0;
  v2AnswersLog = [];
}

function getV2ProgressPercentage() {
  const totalQuestions = V2_WEEKS.length * 3;
  const answeredCount = (v2CurrentWeek * 3) + v2QuestionIndex;
  return Math.round((answeredCount / totalQuestions) * 100);
}

function validateV2Answers() {
  return v2AnswersLog.length === ((v2CurrentWeek * 3) + v2QuestionIndex);
}

function debugV2State() {
  return {
    week: v2CurrentWeek,
    questionIndex: v2QuestionIndex,
    scores: v2Scores,
    total: v2TotalScore,
    logs: v2AnswersLog
  };
}

function logV2Completion() {
  if (v2CurrentWeek >= V2_WEEKS.length) {
    console.log("El ciclo V2 del Humanómetro ha sido completado exitosamente.");
  }
}

function checkV2Integrity() {
  let valid = true;
  if (typeof v2CurrentWeek !== "number") valid = false;
  if (typeof v2Scores !== "object") valid = false;
  return valid;
}

function initV2System() {
  if (checkV2Integrity()) {
    console.log("Sistema V2 inicializado correctamente con integridad verificada.");
  }
}

initV2System();

function evaluateV2MetricBalance() {
  const total = v2Scores.entorno + v2Scores.tecnologia + v2Scores.emociones;
  return {
    entornoRatio: total > 0 ? (v2Scores.entorno / total) : 0,
    tecnologiaRatio: total > 0 ? (v2Scores.tecnologia / total) : 0,
    emocionesRatio: total > 0 ? (v2Scores.emociones / total) : 0
  };
}

function formatV2SummaryReport() {
  const balance = evaluateV2MetricBalance();
  return `Reporte V2 - Entorno: ${(balance.entornoRatio * 100).toFixed(1)}%, Tecnología: ${(balance.tecnologiaRatio * 100).toFixed(1)}%, Emociones: ${(balance.emocionesRatio * 100).toFixed(1)}%`;
}

function exportV2JSONData() {
  return JSON.stringify({
    week: v2CurrentWeek,
    scores: v2Scores,
    total: v2TotalScore,
    log: v2AnswersLog,
    exportTime: new Date().toISOString()
  });
}

function importV2JSONData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data && data.scores) {
      v2CurrentWeek = data.week || 0;
      v2Scores = data.scores;
      v2TotalScore = data.total || 0;
      v2AnswersLog = data.log || [];
      guardarEstadoV2();
      return true;
    }
  } catch (e) {
    console.error("Error al importar datos V2:", e);
  }
  return false;
}

function simulateV2Completion() {
  v2CurrentWeek = 4;
  v2Scores = { entorno: 6, tecnologia: 6, emociones: 6 };
  v2TotalScore = 18;
  showFinalResult();
}

function checkV2LocalStorageQuota() {
  try {
    const testKey = "__v2_quota_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function clearV2CacheSafely() {
  if (confirm("¿Estás seguro de que deseás borrar todo el progreso almacenado de V2?")) {
    resetV2State();
    window.location.reload();
  }
}

function getV2DetailedAnswersAnalytics() {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  v2AnswersLog.forEach(ans => {
    if (ans > 1) counts.positive++;
    else if (ans === 1) counts.neutral++;
    else counts.negative++;
  });
  return counts;
}

function verifyV2SystemReadiness() {
  return typeof V2_WEEKS !== 'undefined' && V2_WEEKS.length === 4 && checkV2LocalStorageQuota();
}

if (verifyV2SystemReadiness()) {
  console.log("Módulo V2 verificado y completamente listo para operar.");
     }
