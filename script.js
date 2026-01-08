let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

// ===============================
// MÓDULOS
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
  { name: "Conciencia", questions: [
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
// MOSTRAR PREGUNTA
// ===============================
function showQuestion() {
  const mod = modules[currentModule];
  document.body.className = mod.name.toLowerCase();
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
  document.body.className = "";

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let details = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " +
      (percent < 40 ? "low" : percent < 70 ? "mid" : "high");

    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if (percent < 100) {
      details.push({ area: m.name, percent });
    }
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const values = details.map(d => d.percent);
  const coherence =
    details.length === 0
      ? 100
      : 100 - (Math.max(...values) - Math.min(...values));

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, details);
}

// ===============================
// DEVOLUCIONES (NO REPETIDAS)
// ===============================
function renderTips(global, details) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (details.length === 0) {
    tips.innerHTML =
      "<li>Estás transitando un proceso humano coherente y consciente. Seguí habitando tus decisiones desde este nivel de presencia.</li>";
    return;
  }

  details.forEach(d => {
    let text = "";

    switch (d.area) {
      case "Familia":
        text = "En el ámbito familiar, aparece la oportunidad de fortalecer la presencia emocional y la escucha genuina en los vínculos más cercanos.";
        break;
      case "Social":
        text = "En lo social, tus respuestas sugieren revisar cómo te posicionás frente al respeto, la empatía y la diversidad en los intercambios.";
        break;
      case "Amistad":
        text = "En la amistad, podría ser valioso observar cuánta disponibilidad real ofrecés y cómo acompañás a quienes te rodean.";
        break;
      case "Laboral":
        text = "En el plano laboral, se abre un espacio para reflexionar sobre coherencia, ética y trato humano en las responsabilidades diarias.";
        break;
      case "Planeta":
        text = "En relación al planeta, tus respuestas invitan a profundizar la conexión entre tus acciones cotidianas y el cuidado de lo vivo.";
        break;
      case "Conciencia":
        text = "En la conciencia personal, surge la oportunidad de alinear con mayor profundidad pensamiento, emoción y acción.";
        break;
    }

    const li = document.createElement("li");
    li.innerHTML = text;
    tips.appendChild(li);
  });
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  document.get
