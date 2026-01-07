// ===============================
// ESTADO GLOBAL
// ===============================
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;

let modules = [];
let scores = {};

// ===============================
// MÓDULOS BASE
// ===============================
const BASE_MODULES = [
  {
    name: "Familia",
    class: "familia",
    questions: [
      "¿Estás emocionalmente presente con tu familia?",
      "¿Escuchás sin juzgar?",
      "¿Expresás afecto sin que te lo pidan?"
    ]
  },
  {
    name: "Social",
    class: "social",
    questions: [
      "¿Tratás a las personas con respeto?",
      "¿Escuchás opiniones distintas a la tuya?",
      "¿Actuás con empatía en espacios públicos?"
    ]
  },
  {
    name: "Amistad",
    class: "amistad",
    questions: [
      "¿Estás presente para tus amistades?",
      "¿Sos leal incluso cuando no estás de acuerdo?",
      "¿Escuchás sin imponer tu visión?"
    ]
  },
  {
    name: "Laboral",
    class: "laboral",
    questions: [
      "¿Actuás con ética en tu trabajo?",
      "¿Respetás a tus compañeros?",
      "¿Sos justo cuando nadie te observa?"
    ]
  },
  {
    name: "Planeta",
    class: "planeta",
    questions: [
      "¿Respetás a los animales como seres vivos?",
      "¿Cuidás el entorno donde vivís?",
      "¿Reducís tu impacto ambiental cuando podés?"
    ]
  }
];

// ===============================
// MÓDULOS PREMIUM
// ===============================
const PREMIUM_MODULES = [
  {
    name: "Conciencia Profunda",
    class: "premium",
    questions: [
      "¿Vivís desde el amor o desde el miedo?",
      "¿Sos coherente entre lo que pensás y hacés?",
      "¿Te responsabilizás de tu impacto en otros?"
    ]
  }
];

// ===============================
// INICIO
// ===============================
function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") {
    modules = modules.concat(JSON.parse(JSON.stringify(PREMIUM_MODULES)));
  }

  scores = {};
  modules.forEach(m => scores[m.name] = 0);

  currentModule = 0;
  currentQuestion = 0;

  showSection("test");
  showQuestion();
  updateThermometer();
}

// ===============================
function showQuestion() {
  const mod = modules[currentModule];
  document.body.className = mod.class;
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
}

// ===============================
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

// ===============================
function showResults() {
  showSection("results");
  document.body.className = "";

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let values = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    values.push(percent);
    total += percent;

    const div = document.createElement("div");
    div.className =
      "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><br><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...values) - Math.min(...values));
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, coherence);
}

// ===============================
function renderTips(global, coherence) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  let text = "";

  if (global >= 85 && coherence >= 80) {
    text = "Tu humanidad está integrada. Sigue por este camino.";
  } else if (global >= 60) {
    text =
      "Hay humanidad presente, pero no se expresa de manera pareja en todos los ámbitos.";
  } else {
    text =
      "El resultado indica desconexión con lo humano esencial. Volver a la presencia puede marcar un cambio.";
  }

  tips.innerText = text;
}

// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  const bar = document.getElementById("thermoFill");
  bar.style.width = progress + "%";

  let score = 0, max = 0;
  modules.forEach(m => {
    score += scores[m.name];
    max += m.questions.length * 2;
  });

  const humanity = max ? Math.round((score / max) * 100) : 100;

  if (humanity < 40) bar.style.background = "#e74c3c";
  else if (humanity < 70) bar.style.background = "#f1c40f";
  else bar.style.background = "#2ecc71";
}

// ===============================
function restart() {
  document.body.className = "";
  showSection("start");
}

// ===============================
function showPrivacy() {
  showSection("privacy");
}

// ===============================
function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

