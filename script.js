/* ==========================================================
   HUMANÓMETRO® — MOTOR PRINCIPAL V1 (JS 1)
   CÓDIGO COMPLETO (465 LÍNEAS ORIGINALES) CON TERMÓMETRO NUMÉRICO
   ========================================================== */

/* ===============================
   ESTADO GLOBAL Y VARIABLES V1
================================ */
let currentStep = 0;
let scores = {
  mundo: 0,
  tecnologia: 0,
  humana: 0
};
let totalScore = 0;
let answersLog = [];

/* CONFIGURACIÓN DE BLOQUES V1 */
const STEPS = [
  {
    area: "Vos ante el mundo",
    questions: [
      { t: "¿Te detenés a observar lo que ocurre a tu alrededor sin juzgarlo de inmediato?", note: "Registro del entorno" },
      { t: "¿Sentís empatía genuina ante situaciones de vulnerabilidad ajena?", note: "Conexión humana" },
      { t: "¿Te involucras activamente en mejorar tu comunidad o entorno cercano?", note: "Compromiso social" },
      { t: "¿Lográs mantener la calma frente a conflictos externos?", note: "Estabilidad emocional" }
    ]
  },
  {
    area: "Vos y la tecnología",
    questions: [
      { t: "¿Usás las pantallas de manera consciente sin perder la noción del tiempo?", note: "Control digital" },
      { t: "¿Priorizás una conversación cara a cara frente a una notificación digital?", note: "Valor del vínculo" },
      { t: "¿Podés desconectarte de dispositivos por un día entero sin ansiedad?", note: "Autonomía digital" },
      { t: "¿La tecnología amplía tus horizontes en lugar de adormecerte?", note: "Uso constructivo" }
    ]
  },
  {
    area: "Integración humana",
    questions: [
      { t: "¿Existe coherencia entre lo que pensás, decís y hacés?", note: "Coherencia interna" },
      { t: "¿Reconocés tus errores y asumís la responsabilidad sin culpar a otros?", note: "Madurez emocional" },
      { t: "¿Dedicás tiempo al autoconocimiento y la reflexión profunda?", note: "Búsqueda interior" },
      { t: "¿Sentís que tu paso por la vida deja una huella positiva en los demás?", note: "Sentido humano" }
    ]
  }
];

/* ===============================
   INICIALIZACIÓN Y FLUJO V1
================================ */
function startTest(reset = false) {
  if (reset) {
    currentStep = 0;
    scores = { mundo: 0, tecnologia: 0, humana: 0 };
    totalScore = 0;
    answersLog = [];
  }
  show("test");
  loadQuestion();
  updateThermometer(0);
}

function loadQuestion() {
  const areaIndex = Math.floor(currentStep / 4);
  const qIndex = currentStep % 4;
  const currentArea = STEPS[areaIndex];
  const q = currentArea.questions[qIndex];

  document.getElementById("areaTitle").textContent = currentArea.area;
  document.getElementById("questionText").textContent = q.t;
  document.getElementById("questionNote").textContent = q.note;

  const progress = (currentStep / 12) * 100;
  updateThermometer(progress);
}

function answer(value) {
  answersLog.push(value);
  totalScore += value;

  if (currentStep < 4) {
    scores.mundo += value;
  } else if (currentStep < 8) {
    scores.tecnologia += value;
  } else {
    scores.humana += value;
  }

  currentStep++;

  if (currentStep < 12) {
    loadQuestion();
  } else {
    showResults();
  }
}

/* ===============================
   RESULTADOS Y LECTURA V1
================================ */
function showResults() {
  show("results");
  updateThermometer(100);

  const maxPossible = 24;
  const percentage = Math.round((totalScore / maxPossible) * 100);

  document.getElementById("globalResult").textContent = `Índice de Consciencia: ${percentage}%`;

  const circlesContainer = document.getElementById("circles");
  if (circlesContainer) {
    circlesContainer.innerHTML = `
      <div class="circle"><span>Mundo</span><br><strong>${Math.round((scores.mundo / 8) * 100)}%</strong></div>
      <div class="circle"><span>Tecnología</span><br><strong>${Math.round((scores.tecnologia / 8) * 100)}%</strong></div>
      <div class="circle"><span>Integración</span><br><strong>${Math.round((scores.humana / 8) * 100)}%</strong></div>
    `;
  }

  const tipsList = document.getElementById("tips");
  if (tipsList) {
    tipsList.innerHTML = "";

    let tipsData = [];
    if (percentage < 50) {
      tipsData = [
        "Tu atención se encuentra dispersa entre estímulos externos y automatismos.",
        "Es un buen momento para pausar y evaluar tus prioridades cotidianas.",
        "La reconexión con el entorno físico y humano requiere pequeñas decisiones conscientes."
      ];
    } else if (percentage < 75) {
      tipsData = [
        "Mantenés un equilibrio razonable entre tu vida digital y tu presencia real.",
        "Hay áreas de lucidez clara, aunque persisten hábitos automáticos por pulir.",
        "Profundizar en la coherencia interna potenciará tu bienestar general."
      ];
    } else {
      tipsData = [
        "Se observa un alto nivel de presencia, coherencia y consciencia integrada.",
        "Tu vínculo con la tecnología y el entorno es maduro y equilibrado.",
        "Continuá cultivando este espacio de auto-observación y respeto humano."
      ];
    }

    tipsData.forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip;
      li.style.margin = "8px 0";
      li.style.fontSize = "0.85rem";
      li.style.color = "var(--text-dim)";
      tipsList.appendChild(li);
    });
  }

  const weeklyAccess = document.getElementById("weeklyAccess");
  if (weeklyAccess) {
    weeklyAccess.innerHTML = `<button class="btn btn-primary" onclick="initWeeklyFlow()">Iniciar Seguimiento Semanal</button>`;
  }
}

/* ===============================
   FLUJO SEMANAL V1
================================ */
let weeklyStep = 0;
const WEEKLY_QUESTIONS = [
  "¿Mantuviste espacios de silencio y desconexión real durante los últimos siete días?",
  "¿Pudiste registrar tus emociones predominantes sin reaccionar de forma impulsiva?",
  "¿Sentiste coherencia entre tus propósitos y tus acciones cotidianas?"
];

function initWeeklyFlow() {
  if (!pasoUnaSemana()) {
    showWeeklyBlockFlash();
    return;
  }
  weeklyStep = 0;
  show("weekly");
  loadWeeklyQuestion();
}

function loadWeeklyQuestion() {
  const weeklyQEl = document.getElementById("weeklyQuestion");
  if (weeklyQEl) {
    weeklyQEl.textContent = WEEKLY_QUESTIONS[weeklyStep];
  }
  updateThermometer(((weeklyStep + 1) / WEEKLY_QUESTIONS.length) * 100);
}

function weeklyAnswer(val) {
  weeklyStep++;
  if (weeklyStep < WEEKLY_QUESTIONS.length) {
    loadWeeklyQuestion();
  } else {
    showWeeklyResultScreen();
  }
}

function showWeeklyResultScreen() {
  show("weeklyResultScreen");
  marcarSemana();
  updateThermometer(100);

  const weeklyTextEl = document.getElementById("weeklyText");
  if (weeklyTextEl) {
    weeklyTextEl.textContent = 
      "El registro semanal ha quedado registrado en tu ciclo evolutivo.\n\n" +
      "La constancia en la auto-observación es lo que transforma un hábito mecánico en una elección consciente.";
  }
  
  const weeklyAdviceEl = document.getElementById("weeklyAdvice");
  if (weeklyAdviceEl) {
    weeklyAdviceEl.textContent = 
      "Volvé a ingresar la próxima semana para continuar midiendo tu pulso humano.";
  }
  
  const weeklySavedEl = document.getElementById("weeklySaved");
  if (weeklySavedEl) {
    weeklySavedEl.classList.remove("hidden");
  }
}

function weeklyWithDonation() {
  restart();
}

/* ===============================
   UTILIDADES GLOBALES Y BLOQUEOS
================================ */
function showPrivacy() {
  show("privacy");
  updateThermometer(50);
}

function restart() {
  show("start");
  updateThermometer(0);
}

function show(id) {
  const sections = [
    "start", "test", "results", "weekly", "weeklyResultScreen", "privacy",
    "v2Start", "testV2", "weeklyResult", "monthlyResult", "mirrorIntro", "mirrorTest", "finalResult"
  ];
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
}

/* ===============================
   ACTUALIZACIÓN TERMÓMETRO (CON ESCALA NUMÉRICA)
================================ */
function updateThermometer(percent) {
  if (percent !== undefined) {
    const fills = document.querySelectorAll('#thermoFill, .thermo-fill, #weeklyThermoFill, #thermoFillMirror');
    fills.forEach(fill => {
      if (fill) fill.style.width = percent + '%';
    });
    
    const numVals = document.querySelectorAll('#thermoNumVal, #thermoNumValMirror');
    numVals.forEach(nv => {
      if (nv) nv.textContent = Math.round(percent) + '%';
    });
  }
}

/* ===============================
   MECANISMO DE CONTROL SEMANAL V1 & V2
================================ */
const BLOCK_KEY = "humano_last_week";
const DEV_MODE = false; 

function getNow() { 
  return Date.now(); 
}

function pasoUnaSemana() {
  if (DEV_MODE) return true;
  const last = localStorage.getItem(BLOCK_KEY);
  if (!last) return true;
  const elapsed = getNow() - Number(last);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return elapsed >= oneWeek;
}

function marcarSemana() {
  localStorage.setItem(BLOCK_KEY, getNow());
}

function showWeeklyBlockFlash() {
  const flashEl = document.getElementById("weeklyBlockFlash");
  if (flashEl) {
    flashEl.classList.remove("hidden");
    setTimeout(() => {
      flashEl.classList.add("hidden");
    }, 1300);
  } else {
    const d = document.createElement("div");
    d.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
    d.style.cssText = `
      position:fixed;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      pointer-events:none;
      font-size:1.35rem;
      color:#eaffff;
      background:
        radial-gradient(circle, rgba(180,255,255,.28), transparent 60%),
        rgba(6,18,40,.45);
      text-shadow:
        0 0 12px rgba(140,255,240,1),
        0 0 26px rgba(140,255,240,.85);
      z-index:9999;
      animation: blockFade 1.3s ease-out forwards;
    `;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1300);
  }
}

/* ===============================
   PERSISTENCIA DE ESTADO V1 (RECUPERACIÓN)
================================ */
const STATE_KEY_V1 = "humano_v1_state";

function guardarEstadoV1() {
  const estado = {
    currentStep,
    scores,
    totalScore,
    answersLog,
    timestamp: getNow()
  };
  localStorage.setItem(STATE_KEY_V1, JSON.stringify(estado));
}

function cargarEstadoV1() {
  const guardado = localStorage.getItem(STATE_KEY_V1);
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      if (parsed && typeof parsed.currentStep === "number") {
        currentStep = parsed.currentStep;
        scores = parsed.scores || scores;
        totalScore = parsed.totalScore || totalScore;
        answersLog = parsed.answersLog || answersLog;
      }
    } catch (e) {
      console.error("Error al cargar el estado V1:", e);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cargarEstadoV1();
});

/* ===============================
   SOPORTE COMPLEMENTARIO Y EVENTOS DE CIERRE V1
================================ */
window.addEventListener("beforeunload", () => {
  guardarEstadoV1();
});

function resetV1State() {
  localStorage.removeItem(STATE_KEY_V1);
  currentStep = 0;
  scores = { mundo: 0, tecnologia: 0, humana: 0 };
  totalScore = 0;
  answersLog = [];
}

function getV1ProgressPercentage() {
  return Math.round((currentStep / 12) * 100);
}

function validateV1Answers() {
  return answersLog.length === currentStep;
}

function debugV1State() {
  return {
    step: currentStep,
    scores: scores,
    total: totalScore,
    logs: answersLog
  };
}

function logV1Completion() {
  if (currentStep >= 12) {
    console.log("El test V1 ha sido completado exitosamente.");
  }
}

function checkV1Integrity() {
  let valid = true;
  if (typeof currentStep !== "number") valid = false;
  if (typeof scores !== "object") valid = false;
  return valid;
}

function initV1System() {
  if (checkV1Integrity()) {
    console.log("Sistema V1 inicializado correctamente con integridad verificada.");
  }
}

initV1System();
