// ===============================
// ESTADO GLOBAL
// ===============================
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;

let modules = [];
let scores = {};

// ===============================
// MÓDULOS BASE (COMÚN)
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
// MÓDULOS PREMIUM
// ===============================
const PREMIUM_MODULES = [
  {
    name: "Incongruencias Personales",
    questions: [
      "¿Decís que sos honesto pero ocultás lo que sentís?",
      "¿Mostrás versiones distintas de vos según el contexto?",
      "¿Preferís caer bien antes que ser auténtico?"
    ]
  },
  {
    name: "Conciencia Profunda",
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
// MOSTRAR PREGUNTA
// ===============================
function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
}

// ===============================
// RESPUESTA
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
    div.className = "circle";
    div.innerHTML = `<strong>${percent}%</strong><br><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + calculateCoherence() + "%";
}

// ===============================
// COHERENCIA
// ===============================
function calculateCoherence() {
  const values = modules.map(m => {
    const max = m.questions.length * 2;
    return Math.round((scores[m.name] / max) * 100);
  });
  return 100 - (Math.max(...values) - Math.min(...values));
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  const bar = document.getElementById("thermoFill");
  bar.style.width = progress + "%";
}

// ===============================
// NAVEGACIÓN
// ===============================
function restart() {
  showSection("start");
}

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
      }
