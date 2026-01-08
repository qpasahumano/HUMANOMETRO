let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

// ===============================
// MÓDULOS
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

const PREMIUM_MODULES = [
  {
    name: "Conciencia",
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
  document.body.className = mod.name.toLowerCase();
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
  let results = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    results.push({
      area: m.name,
      percent
    });

    const div = document.createElement("div");
    div.className =
      "circle " +
      (percent < 40 ? "low" : percent < 70 ? "mid" : "high");

    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const values = results.map(r => r.percent);
  const coherence =
    100 - (Math.max(...values) - Math.min(...values));

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, results);

  if (mode === "premium") {
    const note = document.getElementById("premiumNote");
    if (note) note.classList.remove("hidden");
  }
}

// ===============================
// DEVOLUCIONES (BASE OFICIAL – NO REPETITIVAS)
// ===============================
function renderTips(global, results) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  // CASO: TODO 100%
  if (results.every(r => r.percent === 100)) {
    tips.innerHTML =
      "<li>Estás en un proceso humano coherente y consciente. Seguí habitando tus decisiones desde este nivel de presencia.</li>";
    return;
  }

  // DEVOLUCIÓN ESPECÍFICA POR ÁREA (SIN REPETIR TEXTO)
  results.forEach(r => {
    if (r.percent < 100) {
      let text = "";

      switch (r.area) {
        case "Familia":
          text =
            "En el plano familiar, tus respuestas sugieren que podrías fortalecer la presencia emocional y la escucha genuina en los vínculos más cercanos.";
          break;
        case "Social":
          text =
            "En lo social, aparece un margen para revisar cómo te posicionás frente a la diversidad y el respeto cotidiano.";
          break;
        case "Amistad":
          text =
            "En la amistad, podría ser valioso observar cuánta disponibilidad real ofrecés en los momentos compartidos.";
          break;
        case "Laboral":
          text =
            "En el ámbito laboral, tus respuestas invitan a reflexionar sobre coherencia, ética y trato humano en el día a día.";
          break;
        case "Planeta":
          text =
            "En relación al planeta y lo vivo, hay espacio para una conexión más consciente entre acciones y cuidado del entorno.";
          break;
        case "Conciencia":
          text =
            "En la conciencia personal, emerge la oportunidad de alinear más profundamente pensamiento, emoción y acción.";
          break;
      }

      const li = document.createElement("li");
      li.innerHTML = text;
      tips.appendChild(li);
    }
  });
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const totalQ = modules.reduce(
    (s, m) => s + m.questions.length,
    0
  );
  const answered =
    modules
      .slice(0, currentModule)
      .reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  document.getElementById("thermoFill").style.width =
    progress + "%";
}

// ===============================
// NAVEGACIÓN
// ===============================
function restart() {
  document.body.className = "";
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
