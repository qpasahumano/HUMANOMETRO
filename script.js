// ===============================
// ESTADO GLOBAL
// ===============================
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;

let modules = [];
let scores = {};

// ===============================
// MÓDULOS COMUNES
// ===============================
const BASE_MODULES = [
  {
    name: "Familia",
    questions: [
      "¿Estás emocionalmente presente con tu familia?",
      "¿Escuchás sin juzgar?",
      "¿Expresás afecto sin que te lo pidan?"
    ]
  },
  {
    name: "Social",
    questions: [
      "¿Tratás a las personas con respeto?",
      "¿Escuchás opiniones distintas a la tuya?",
      "¿Actuás con empatía en espacios públicos?"
    ]
  },
  {
    name: "Amistad",
    questions: [
      "¿Estás presente para tus amistades?",
      "¿Sos leal incluso cuando no estás de acuerdo?",
      "¿Escuchás sin imponer tu visión?"
    ]
  },
  {
    name: "Laboral",
    questions: [
      "¿Actuás con ética en tu trabajo?",
      "¿Respetás a tus compañeros?",
      "¿Sos justo cuando nadie te observa?"
    ]
  },
  {
    name: "Planeta",
    questions: [
      "¿Respetás a los animales como seres vivos?",
      "¿Cuidás el entorno donde vivís?",
      "¿Reducís tu impacto ambiental cuando podés?"
    ]
  }
];

// ===============================
// MÓDULOS PREMIUM (EXCLUSIVOS)
// ===============================
const PREMIUM_MODULES = [
  {
    name: "Incongruencias Personales",
    questions: [
      "¿Decís una cosa y hacés otra?",
      "¿Evitás decir verdades para quedar bien?",
      "¿Te justificás cuando sabés que actuaste mal?"
    ]
  },
  {
    name: "Conciencia Profunda",
    questions: [
      "¿Vivís desde el miedo o desde la coherencia?",
      "¿Tu discurso coincide con tus actos?",
      "¿Asumís el impacto que generás en otros?"
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
// MOSTRAR PREGUNTA
// ===============================
function showQuestion() {
  const mod = modules[currentModule];

  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
}

// ===============================
// RESPONDER
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
// RESULTADOS
// ===============================
function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
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

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + calculateCoherence() + "%";

  renderTips(global);
}

// ===============================
// COHERENCIA HUMANA
// ===============================
function calculateCoherence() {
  const values = modules.map(m => {
    const max = m.questions.length * 2;
    return Math.round((scores[m.name] / max) * 100);
  });

  return Math.max(0, 100 - (Math.max(...values) - Math.min(...values)));
}

// ===============================
// CONSEJOS (MEJORADOS)
// ===============================
function renderTips(global) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  let text = "";

  if (global >= 85) {
    text =
      "Alta humanidad. Hay coherencia real entre lo que pensás, sentís y hacés.";
  } else if (global >= 60) {
    text =
      "Humanidad intermedia. Hay conciencia, pero se fragmenta según el contexto.";
  } else {
    text =
      "Humanidad baja. No es juicio: es una señal de desconexión interna.";
  }

  const p = document.createElement("p");
  p.innerText = text;
  tips.appendChild(p);
}

// ===============================
// TERMÓMETRO (COLOR SEGÚN HUMANIDAD)
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  const bar = document.getElementById("thermoFill");
  bar.style.width = progress + "%";

  let score = 0;
  let max = 0;
  modules.forEach(m => {
    score += scores[m.name];
    max += m.questions.length * 2;
  });

  const humanity = max ? Math.round((score / max) * 100) : 100;

  if (humanity < 40) bar.style.background = "#ff3b3b";
  else if (humanity < 70) bar.style.background = "#ffd93b";
  else bar.style.background = "#3bff8f";
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
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
                  }
