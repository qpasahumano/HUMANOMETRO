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

// ===============================
// MÓDULOS PREMIUM
// ===============================
const PREMIUM_MODULES = [
  { name: "Incongruencias Personales", questions: [
    "¿Decís que sos honesto pero ocultás lo que sentís?",
    "¿Mostrás versiones distintas de vos según el contexto?",
    "¿Preferís caer bien antes que ser auténtico?"
  ]},
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sentís que, en general, lo que pensás y lo que hacés suelen estar alineados?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

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
function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];

  document.getElementById("app").className = mod.name.toLowerCase();
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
  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let values = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;
    values.push(percent);

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><br><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...values) - Math.min(...values));
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, values);
}

// ===============================
function renderTips(global, values) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (global >= 90) {
    tips.innerHTML = "<li>Sigue por este camino.</li>";
    return;
  }

  modules.forEach((m, i) => {
    if (values[i] < 80) {
      const li = document.createElement("li");
      li.innerText = `Área ${m.name}: podés mejorar con más presencia y coherencia en este aspecto.`;
      tips.appendChild(li);
    }
  });
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
  bar.className = humanity < 40 ? "low" : humanity < 70 ? "mid" : "high";
}

// ===============================
function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
