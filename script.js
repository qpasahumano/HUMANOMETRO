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
// MÓDULOS PREMIUM (EXCLUSIVOS)
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
// INICIO DEL TEST
// ===============================
function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";

  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") {
    modules = modules.concat(JSON.parse(JSON.stringify(PREMIUM_MODULES)));
  }

  scores = {};
  modules.forEach(m => (scores[m.name] = 0));

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
  const percents = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push(percent);
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

  const coherence = calculateCoherence(percents);
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, coherence);
}

// ===============================
// COHERENCIA HUMANA
// ===============================
function calculateCoherence(values) {
  return Math.max(0, 100 - (Math.max(...values) - Math.min(...values)));
}

// ===============================
// CONSEJOS (COMÚN vs PREMIUM)
// ===============================
function renderTips(global, coherence) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  let text = "";

  if (mode === "common") {
    if (global >= 85) {
      text =
        "Tu humanidad está activa. El desafío es sostenerla en la vida cotidiana.";
    } else if (global >= 60) {
      text =
        "Hay humanidad presente, pero aparece de forma irregular según el contexto.";
    } else {
      text =
        "Este resultado señala una desconexión con lo humano esencial. Es una señal, no un juicio.";
    }
  } else {
    // PREMIUM: análisis más profundo
    if (global >= 85 && coherence >= 80) {
      text =
        "Tu humanidad es consistente. Pensamiento, emoción y acción se alinean incluso bajo presión.";
    } else if (global >= 60) {
      text =
        "Tu humanidad está activa, pero fragmentada. El entorno define más que tu conciencia.";
    } else {
      text =
        "Existe una ruptura entre valores, decisiones y vínculos. El trabajo es interno y profundo.";
    }
  }

  const li = document.createElement("li");
  li.innerText = text;
  tips.appendChild(li);
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules
      .slice(0, currentModule)
      .reduce((s, m) => s + m.questions.length, 0) + currentQuestion;

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

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
