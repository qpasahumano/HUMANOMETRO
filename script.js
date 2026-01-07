// ===============================
// ESTADO GLOBAL (INAMOVIBLE)
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
// INICIO DEL TEST (INAMOVIBLE)
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
// MOSTRAR PREGUNTA (INAMOVIBLE)
// ===============================
function showQuestion() {
  const mod = modules[currentModule];

  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
}

// ===============================
// RESPUESTA (INAMOVIBLE)
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
// RESULTADOS + CUALIDADES SUMADAS
// ===============================
function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let weakAreas = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    if (percent < 80) {
      weakAreas.push({ name: m.name, percent });
    }

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

  renderTips(global, weakAreas);
}

// ===============================
// COHERENCIA HUMANA (INAMOVIBLE)
// ===============================
function calculateCoherence() {
  const values = modules.map(m => {
    const max = m.questions.length * 2;
    return Math.round((scores[m.name] / max) * 100);
  });

  return Math.max(0, 100 - (Math.max(...values) - Math.min(...values)));
}

// ===============================
// CONSEJOS + DIFERENCIA PREMIUM
// ===============================
function renderTips(global, weakAreas) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const intro = document.createElement("p");

  if (global >= 85) {
    intro.innerText =
      "Tu humanidad general es alta. Hay coherencia entre lo que pensás, sentís y hacés.";
  } else if (global >= 60) {
    intro.innerText =
      "Tu humanidad está activa, pero se expresa de forma irregular según el área de tu vida.";
  } else {
    intro.innerText =
      "Hay una desconexión marcada entre valores, acciones y vínculos. Este resultado no juzga: señala.";
  }

  tips.appendChild(intro);

  if (weakAreas.length > 0) {
    const title = document.createElement("h4");
    title.innerText = "Áreas donde tu humanidad está más baja:";
    tips.appendChild(title);

    weakAreas.forEach(a => {
      const li = document.createElement("li");
      li.innerText =
        a.name +
        " (" +
        a.percent +
        "%): mayor presencia, escucha y coherencia en este ámbito.";
      tips.appendChild(li);
    });
  }

  // 🔥 EXTRA SOLO PREMIUM
  if (mode === "premium") {
    const premiumBlock = document.createElement("p");
    premiumBlock.innerText =
      "Lectura Premium: la incoherencia no suele estar en lo que pensás, sino en lo que sostenés cuando nadie te observa. El trabajo profundo empieza ahí.";
    tips.appendChild(premiumBlock);
  }
}

// ===============================
// TERMÓMETRO (INAMOVIBLE)
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

  if (humanity < 40) bar.style.background = "#e74c3c";
  else if (humanity < 70) bar.style.background = "#f1c40f";
  else bar.style.background = "#2ecc71";
}

// ===============================
// NAVEGACIÓN (INAMOVIBLE)
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
