// ===============================
// ESTADO GLOBAL
// ===============================
let mode = "common"; // common | premium
let currentModule = 0;
let currentQuestion = 0;

let modules = [];
let scores = {};

// ===============================
// MÓDULOS BASE
// ===============================
const BASE_MODULES = [
  {// ================================
// BLOQUES PREMIUM (EXCLUSIVOS)
// ================================
const premiumModules = [
  {
    name: "Incongruencias Personales",
    questions: [
      "¿Decís que sos honesto pero ocultás lo que sentís para evitar conflictos?",
      "¿Sostenés tus valores cuando nadie te observa?",
      "¿Mostrás versiones distintas de vos según el contexto?",
      "¿Defendés ideas que no practicás bajo presión?",
      "¿Preferís caer bien antes que ser auténtico?",
      "¿Te justificás cuando sabés que actuaste mal?",
      "¿Elegís el silencio para no asumir verdades incómodas?",
      "¿Te reconocés incoherente bajo presión?",
      "¿Te alejás de personas que te confrontan?",
      "¿Decís “soy así” para no cambiar?"
    ]
  },
  {
    name: "Sombras Vinculares",
    questions: [
      "¿Retirás afecto cuando no te dan lo que esperás?",
      "¿Usás el silencio como castigo?",
      "¿Confundís amor con necesidad?",
      "¿Exigís comprensión que no ofrecés?",
      "¿Manipulás emocionalmente sin admitirlo?",
      "¿Generás culpa para obtener algo?",
      "¿Evitás conversaciones profundas?",
      "¿Te victimizás para no asumir responsabilidad?",
      "¿Te cuesta pedir perdón sin justificarte?",
      "¿Dejás heridas sin reparar?"
    ]
  },
  {
    name: "Autoengaño Consciente",
    questions: [
      "¿Sabés qué deberías cambiar y no lo hacés?",
      "¿Postergás decisiones importantes?",
      "¿Culpás al contexto para no mirarte?",
      "¿Elegís comodidad antes que verdad?",
      "¿Te mentís para no incomodarte?",
      "¿Evitás decisiones necesarias?",
      "¿Minimizás lo que sabés que duele?",
      "¿Justificás lo que criticás en otros?",
      "¿Confundís entender con transformar?",
      "¿Te escondés en el discurso?"
    ]
  },
  {
    name: "Impacto en Otros",
    questions: [
      "¿Tu presencia calma o tensa?",
      "¿Cómo se sienten los demás después de hablar con vos?",
      "¿Asumís el impacto de tus palabras?",
      "¿Escuchás feedback sin defenderte?",
      "¿Reconocés cuando herís?",
      "¿Reparás vínculos dañados?",
      "¿Dejás espacio emocional?",
      "¿Cuidás tu tono y gestos?",
      "¿Aceptás que podés ser parte del problema?",
      "¿Tu humanidad se nota en hechos?"
    ]
  }
];
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
      "¿Escuchás sin intentar imponer tu visión?"
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
// MÓDULO PREMIUM
// ===============================
const PREMIUM_MODULE = {
  name: "Conciencia Profunda",
  questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]
};

// ===============================
// INICIO
// ===============================
function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";

  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") {
    modules.push(JSON.parse(JSON.stringify(PREMIUM_MODULE)));
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
    div.className = "circle " +
      (percent < 40 ? "low" : percent < 70 ? "mid" : "high");

    div.innerHTML = `<strong>${percent}%</strong><br><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence = calculateCoherence();
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

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
// CONSEJOS
// ===============================
function renderTips(global) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (global >= 90) {
    tips.innerHTML = "<li>Sigue por este camino.</li>";
    return;
  }

  const list =
    global < 40
      ? ["Reducí el ritmo", "Volvé a la presencia", "Reconectá con lo vivo"]
      : ["Escuchá más", "Elegí coherencia", "Cuidá tus vínculos"];

  list.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tips.appendChild(li);
  });
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

