let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

// ===============================
// MÓDULOS BASE
// ===============================
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

// ===============================
// INICIO
// ===============================
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

// ===============================
// PREGUNTAS
// ===============================
function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
}

function answer(value) {
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

// ===============================
// RESULTADOS
// ===============================
function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let percents = {};

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents[m.name] = percent;
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " +
      (percent < 40 ? "low" : percent < 70 ? "mid" : "high");

    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence = calculateCoherence(percents);
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(percents);
}

// ===============================
// COHERENCIA
// ===============================
function calculateCoherence(percents) {
  const values = Object.values(percents);
  return 100 - (Math.max(...values) - Math.min(...values));
}

// ===============================
// DEVOLUCIONES INTELIGENTES
// ===============================
function renderTips(percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const lowAreas = Object.keys(percents).filter(a => percents[a] < 100);

  // Caso: todo alto
  if (lowAreas.length === 0) {
    tips.innerHTML =
      "<li>Estás en un buen camino de coherencia humana. El desafío es sostener esta conciencia en el tiempo.</li>";
    return;
  }

  lowAreas.forEach(area => {
    const li = document.createElement("li");
    li.innerHTML = getAreaFeedback(area);
    tips.appendChild(li);
  });
}

function getAreaFeedback(area) {
  switch (area) {
    case "Familia":
      return "En el plano familiar, puede ser valioso revisar tu nivel de presencia emocional y escucha. Los vínculos cercanos suelen reflejar con claridad cómo estamos internamente.";
    case "Social":
      return "En lo social, aparece la oportunidad de ejercitar más empatía y respeto por las diferencias. Tu forma de vincularte impacta más de lo que parece.";
    case "Amistad":
      return "En tus amistades, prestar atención a la disponibilidad y la escucha genuina puede fortalecer vínculos que requieren más cuidado.";
    case "Laboral":
      return "En el ámbito laboral, revisar la coherencia entre valores y acciones, especialmente bajo presión, puede ayudarte a crecer con mayor integridad.";
    case "Planeta":
      return "Tu relación con el entorno y los seres vivos invita a una mayor conciencia sobre el impacto cotidiano de tus decisiones.";
    case "Conciencia Profunda":
      return "A nivel interno, aparece la invitación a alinear más lo que sentís, pensás y hacés. La coherencia personal es la base de toda transformación.";
    default:
      return "";
  }
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  document.getElementById("thermoFill").style.width = progress + "%";
}

// ===============================
// NAVEGACIÓN
// ===============================
function restart() {
  showSection("start");
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
