console.log("SCRIPT NUEVO CARGADO - FECHA HOY");

/* ===============================
   ESTADO GENERAL
=============================== */
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   MÓDULOS BASE
=============================== */
const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name: "Social", questions: [
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas a la tuya?",
    "¿Actuás con empatía en espacios públicos?"
  ]},
  { name: "Amistad", questions: [
    "¿Estás presente para tus amistades?",
    "¿Sos leal incluso cuando no estás de acuerdo?",
    "¿Escuchás sin imponer tu visión?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name: "Planeta", questions: [
    "¿Respetás a los animales como seres vivos?",
    "¿Cuidás el entorno donde vivís?",
    "¿Reducís tu impacto ambiental cuando podés?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

/* ===============================
   INICIO DEL TEST
=============================== */
function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m => scores[m.name] = 0);

  currentModule = 0;
  currentQuestion = 0;

  showSection("test");
  showQuestion();
  updateThermometer();
}

/* ===============================
   PREGUNTAS
=============================== */
function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(value) {
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) {
    showResults();
  } else {
    showQuestion();
    updateThermometer();
  }
}

/* ===============================
   RESULTADOS
=============================== */
function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let percents = [];
  let areasBelow100 = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push(percent);
    total += percent;

    if (percent < 100) {
      areasBelow100.push(m.name);
    }

    const div = document.createElement("div");
    div.className =
      "circle " +
      (percent < 40 ? "low" : percent < 70 ? "mid" : "high");

    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...percents) - Math.min(...percents));
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, areasBelow100);
}

/* ===============================
   CONSEJOS (LÓGICA CORREGIDA)
=============================== */
function renderTips(global, areasBelow100) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  // Caso 1: todo 100% → NO dar consejos
  if (areasBelow100.length === 0) {
    tips.innerHTML =
      "<li>Estás en el buen camino. Mantené esta coherencia humana.</li>";
    return;
  }

  // Caso 2: una o más áreas < 100%
  const listado = areasBelow100.join(", ");
  tips.innerHTML =
    `<li>Observá con más presencia las áreas: <strong>${listado}</strong>. Ahí hay oportunidades reales de crecimiento humano.</li>`;
}

/* ===============================
   TERMÓMETRO
=============================== */
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules
      .slice(0, currentModule)
      .reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  document.getElementById("thermoFill").style.width = progress + "%";
}

/* ===============================
   NAVEGACIÓN
=============================== */
function restart() {
  showSection("start");
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
