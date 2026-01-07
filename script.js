// ===============================
// ESTADO GLOBAL (BASE OFICIAL)
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
    key: "familia",
    name: "Familia",
    questions: [
      "¿Estás emocionalmente presente con tu familia?",
      "¿Escuchás sin juzgar?",
      "¿Expresás afecto sin que te lo pidan?"
    ]
  },
  {
    key: "social",
    name: "Social",
    questions: [
      "¿Tratás a las personas con respeto?",
      "¿Escuchás opiniones distintas a la tuya?",
      "¿Actuás con empatía en espacios públicos?"
    ]
  },
  {
    key: "amistad",
    name: "Amistad",
    questions: [
      "¿Estás presente para tus amistades?",
      "¿Sos leal incluso cuando no estás de acuerdo?",
      "¿Escuchás sin imponer tu visión?"
    ]
  },
  {
    key: "laboral",
    name: "Laboral",
    questions: [
      "¿Actuás con ética en tu trabajo?",
      "¿Respetás a tus compañeros?",
      "¿Sos justo cuando nadie te observa?"
    ]
  },
  {
    key: "planeta",
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
    key: "premium",
    name: "Conciencia Profunda",
    questions: [
      "¿Sos coherente entre lo que pensás, sentís y hacés?",
      "¿Asumís el impacto emocional que generás en otros?",
      "¿Elegís crecer incluso cuando incomoda?"
    ]
  }
];

// ===============================
// INICIO DEL TEST
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
  applyModuleTheme();
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
    applyModuleTheme();
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
  let lowAreas = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    if (percent < 80) lowAreas.push(m.name);

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

  renderUnifiedAdvice(global, lowAreas);
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
// CONSEJO ÚNICO (SIN REPETICIONES)
// ===============================
function renderUnifiedAdvice(global, lowAreas) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  let text = "";

  if (global >= 85) {
    text =
      "Tu humanidad se expresa de forma integrada. El desafío ahora es sostener esta coherencia incluso cuando el entorno presiona en sentido contrario.";
  } else if (lowAreas.length > 0) {
    text =
      "Se observan tensiones humanas principalmente en estas áreas: " +
      lowAreas.join(", ") +
      ". Trabajar la presencia, la escucha y la coherencia en estos espacios puede elevar tu equilibrio humano.";
  } else {
    text =
      "Tu humanidad está activa, aunque aún fragmentada. Integrar pensamiento, emoción y acción es la clave para estabilizarla.";
  }

  const li = document.createElement("li");
  li.innerText = text;
  tips.appendChild(li);
}

// ===============================
// TERMÓMETRO (PROGRESO)
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
// FONDO SEGÚN MÓDULO
// ===============================
function applyModuleTheme() {
  const app = document.getElementById("app");
  app.className = "";

  if (modules[currentModule]) {
    app.classList.add(modules[currentModule].key);
  }

  if (mode === "premium") {
    app.classList.add("premium");
  }
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
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}


