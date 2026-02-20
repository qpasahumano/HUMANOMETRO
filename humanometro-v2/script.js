/* ===============================
   REFERENCIAS DOM
================================ */
const areaTitle = document.getElementById("areaTitle");
const questionText = document.getElementById("questionText");
const questionNote = document.getElementById("questionNote");
const thermoFill = document.getElementById("thermoFill");

const circles = document.getElementById("circles");
const tips = document.getElementById("tips");
const globalResult = document.getElementById("globalResult");
const weeklyAccess = document.getElementById("weeklyAccess");

const weeklyQuestion = document.getElementById("weeklyQuestion");
const weeklyThermoFill = document.getElementById("weeklyThermoFill");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");
const weeklySaved = document.getElementById("weeklySaved");

/* ===============================
   ESTADO PERSISTENTE
================================ */
const HM_STATE_KEY = "hm_v1_state";

function saveState(extra = {}) {
  const state = {
    mode,
    currentModule,
    currentQuestion,
    modules,
    scores,
    responseProfile,
    weeklyIndex,
    weeklyScores,
    lastSection: document.querySelector("section:not(.hidden)")?.id || "start",
    timestamp: Date.now(),
    ...extra
  };
  localStorage.setItem(HM_STATE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(HM_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearState() {
  localStorage.removeItem(HM_STATE_KEY);
}

/* ===============================
   VARIABLES PRINCIPALES
================================ */
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

let responseProfile = {
  no: 0,
  maybe: 0,
  yes: 0,
  total: 0
};

/* ===============================
   CONTEO SEMANAL
================================ */
let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "Cuando viviste alguna incomodidad o tensión emocional esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
  "Ante diferencias o tensiones con alguna persona esta semana, ¿intentaste comprender lo que el otro podía estar sintiendo?",
  "Frente a emociones densas surgidas en la semana con algún vínculo, ¿lograste soltarlas sin quedarte atrapado en ellas?"
];

/* ===============================
   BLOQUEO + REANUDACIÓN — CONFIG
================================ */
const DEV_MODE = false;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* 🔧 AJUSTE: se elimina bloqueo viejo que interfería */
const BLOCK_KEY_RECORRIDO_V1 = "hm_v1_block_recorrido";
const BLOCK_KEY_VOLVE_PRONTO_V1 = "hm_v1_block_volve_pronto";

/* ===============================
   DESTELLO BLOQUEO
================================ */
function showWeeklyBlockFlash() {
  const el = document.getElementById("weeklyBlockFlash");
  if (!el) return;
  el.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 1400);
}

/* ===============================
   REANUDACIÓN AUTOMÁTICA
================================ */
(function resumeIfWaiting() {

  const saved = loadState();
  if (!saved) return;

  mode = saved.mode;
  currentModule = saved.currentModule;
  currentQuestion = saved.currentQuestion;
  modules = saved.modules || [];
  scores = saved.scores || {};
  responseProfile = saved.responseProfile || responseProfile;
  weeklyIndex = saved.weeklyIndex || 0;
  weeklyScores = saved.weeklyScores || [];

  if (modules.length && currentModule >= modules.length) {
    showResults();
    return;
  }

  showSection(saved.lastSection || "start");

  if (saved.lastSection === "test") {
    showQuestion();
    updateThermometer();
  }

  if (saved.lastSection === "weekly") {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
    weeklyThermoFill.style.width =
      Math.round((weeklyScores.length / WEEKLY_QUESTIONS.length) * 100) + "%";
  }

})();

/* ===============================
   ACCESO RECORRIDO MENSUAL
================================ */
function weeklyWithDonation() {

  if (!DEV_MODE) {
    const lastRecorrido = localStorage.getItem(BLOCK_KEY_RECORRIDO_V1);
    if (lastRecorrido && Date.now() - Number(lastRecorrido) < WEEK_MS) {
      showWeeklyBlockFlash();
      return;
    }
  }

  startWeekly();
}

/* ===============================
   INICIO BLOQUE SEMANAL
================================ */
function startWeekly() {

  weeklyScores = [];
  weeklyIndex = 0;

  weeklyThermoFill.style.width = "0%";
  weeklySaved.classList.add("hidden");

  showSection("weekly");
  weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];

  saveState({ lastSection: "weekly" });
}

function weeklyAnswer(value) {

  weeklyScores.push(value);
  weeklyIndex++;

  weeklyThermoFill.style.width =
    Math.round((weeklyScores.length / WEEKLY_QUESTIONS.length) * 100) + "%";

  saveState({ weeklyIndex, weeklyScores });

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    showWeeklyResultScreen();
  } else {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function showWeeklyResultScreen() {

  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  if (avg < 0.8) {
    weeklyText.innerText =
      "Esta semana mostró una desconexión entre intención y acción.";
    weeklyAdvice.innerText =
      "Observar tus reacciones sin juzgar puede ayudarte a recuperar coherencia.";
  } else if (avg < 1.5) {
    weeklyText.innerText =
      "Tu humanidad estuvo presente, pero de forma fluctuante.";
    weeklyAdvice.innerText =
      "Sostener la atención consciente puede estabilizar tu respuesta emocional.";
  } else {
    weeklyText.innerText =
      "Mostraste coherencia humana y presencia consciente esta semana.";
    weeklyAdvice.innerText =
      "Continuar actuando desde la empatía refuerza tu equilibrio interno.";
  }

  saveWeekly();

  showSection("weeklyResultScreen");
  saveState({ lastSection: "weeklyResultScreen" });
}

function saveWeekly() {

  const history = JSON.parse(localStorage.getItem("humanometro_semanal") || "[]");
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  history.push({
    date: new Date().toISOString().slice(0, 10),
    score: avg
  });

  localStorage.setItem("humanometro_semanal", JSON.stringify(history));
  weeklySaved.classList.remove("hidden");

  /* 🔒 BLOQUEO SE MARCA SOLO AQUÍ */
  if (!DEV_MODE) {
    localStorage.setItem(BLOCK_KEY_RECORRIDO_V1, Date.now());
  }
}

/* ===============================
   TEST PRINCIPAL
================================ */
const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estuviste emocionalmente presente con tu familia?", n: "Aquí se mide presencia, no perfección." },
    { q: "¿Escuchaste sin juzgar?", n: "Se mide apertura." },
    { q: "¿Expresaste afecto sin que te lo pidan?", n: "Se mide intención." }
  ]},
  { name: "Social", questions: [
    { q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchaste opiniones distintas a la tuya?", n: "Se mide tolerancia." },
    { q: "¿Actuaste con empatía en espacios públicos?", n: "Conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estuviste presente para tus amistades?", n: "Presencia real." },
    { q: "¿Cuidaste el vínculo aun sin coincidir?", n: "Cuidado del lazo." },
    { q: "¿Escuchaste sin imponer tu visión?", n: "Respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generaste buen clima laboral aun sin estar cómodo?", n: "Responsabilidad humana." },
    { q: "¿Respetaste a tus compañeros?", n: "Trato consciente." },
    { q: "¿Evitaste sobrecargar a otros?", n: "Conciencia colectiva." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconociste a los animales como seres sensibles?", n: "Empatía." },
    { q: "¿Cuidaste el entorno donde vivís?", n: "Conciencia cotidiana." },
    { q: "¿Reduciste tu impacto cuando estuvo a tu alcance?", n: "Intención posible." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Tomaste decisiones desde la conciencia?", n: "Atención interna." },
    { q: "¿Fuiste coherente entre pensamiento y acción?", n: "Alineación." },
    { q: "¿Asumiste responsabilidad por tu impacto?", n: "Madurez emocional." }
  ]}
];

function startTest(isPremium) {

  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m => scores[m.name] = 0);

  currentModule = 0;
  currentQuestion = 0;
  responseProfile = { no:0, maybe:0, yes:0, total:0 };

  showSection("test");
  showQuestion();
  updateThermometer();
  saveState({ lastSection: "test" });
}

function showQuestion() {
  const m = modules[currentModule];
  areaTitle.innerText = m.name;
  questionText.innerText = m.questions[currentQuestion].q;
  questionNote.innerText = m.questions[currentQuestion].n;
}

function answer(v) {

  scores[modules[currentModule].name] += v;

  if (v === 0) responseProfile.no++;
  else if (v === 1) responseProfile.maybe++;
  else if (v === 2) responseProfile.yes++;
  responseProfile.total++;

  currentQuestion++;

  if (currentQuestion >= modules[currentModule].questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  saveState({ currentModule, currentQuestion, scores, responseProfile });

  currentModule >= modules.length ? showResults() : showQuestion();
  updateThermometer();
}

/* ===============================
   RESULTADOS
================================ */
function showResults() {

  showSection("results");
  circles.innerHTML = "";
  tips.innerHTML = "";
  weeklyAccess.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const p = Math.round(scores[m.name] / max * 100);
    total += p;

    circles.innerHTML += `
      <div class="circle ${p < 40 ? "low" : p < 70 ? "mid" : "high"}">
        <strong>${p}%</strong>
        <small>${m.name}</small>
      </div>`;

    if (mode === "premium") {
      tips.innerHTML += `<li>${premiumFeedback(m.name, p)}</li>`;
    }
  });

  const avg = Math.round(total / modules.length);
  globalResult.innerText = "Humanidad global: " + avg + "%";

  if (mode === "common") {
    tips.innerHTML = `<li>${commonFeedback(avg)}</li>`;
  }

  if (mode === "premium") {
    weeklyAccess.innerHTML =
      `<button class="premium" onclick="weeklyWithDonation()">Recorrido mensual</button>`;
  }

  saveState({ lastSection: "results", finalAvg: avg });
}

/* ===============================
   DEVOLUCIONES
================================ */
function commonFeedback(avg) {
  if (avg < 40)
    return "Se observa una desconexión entre intención y acción. Reconocerlo abre un proceso de conciencia.";
  if (avg < 70)
    return "Tu humanidad está presente, aunque con fluctuaciones. La observación consciente puede estabilizarla.";
  return "Existe coherencia entre lo que sentís, pensás y hacés. Tu humanidad se expresa con claridad.";
}

function premiumFeedback(area, p) {
  if (p < 40)
    return `En ${area}, hay carencia de coherencia interna. Detenerte a observar tu reacción puede generar un cambio profundo.`;
  if (p < 70)
    return `En ${area}, existe intención consciente, pero aún inestable. Sostener la presencia fortalece tu accionar.`;
  return `En ${area}, tu conducta refleja conciencia, responsabilidad y humanidad activa.`;
}

/* ===============================
   TERMÓMETRO
================================ */
function updateThermometer() {

  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule)
      .reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  thermoFill.style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

/* ===============================
   NAVEGACIÓN
================================ */
function restart() {

  if (!DEV_MODE) {
    const lastVolver = localStorage.getItem(BLOCK_KEY_VOLVE_PRONTO_V1);
    if (lastVolver && Date.now() - Number(lastVolver) < WEEK_MS) {
      showWeeklyBlockFlash();
      return;
    }
    localStorage.setItem(BLOCK_KEY_VOLVE_PRONTO_V1, Date.now());
  }

  clearState();
  showSection("start");
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {

  ["start","test","results","weekly","weeklyResultScreen","privacy"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");
}

function goToV2() {
  window.location.href = "./humanometro-v2/";
}
