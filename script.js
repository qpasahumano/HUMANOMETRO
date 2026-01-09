let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

// === BANCO SEMANAL PREMIUM (ROTATIVO – 1 MES) ===
const WEEKLY_BANK = {
  familia: [
    "¿Estuviste realmente presente para tu familia esta semana?",
    "¿Hubo algún gesto concreto de cuidado hacia tu familia?",
    "¿Escuchaste más de lo que hablaste en tu entorno familiar?"
  ],
  pareja: [
    "¿Cuidaste el vínculo de pareja con actos y no solo palabras?",
    "¿Fuiste honesto emocionalmente con tu pareja esta semana?",
    "¿Escuchaste a tu pareja sin intentar corregirla?"
  ],
  laboral: [
    "¿Trabajaste con coherencia entre valores y acciones?",
    "¿Tu actitud laboral fue respetuosa incluso bajo presión?",
    "¿Aportaste algo positivo al clima de trabajo?"
  ],
  social: [
    "¿Tu trato social fue empático y consciente?",
    "¿Evitaste juzgar automáticamente a los demás?",
    "¿Tu presencia social fue genuina?"
  ],
  planeta: [
    "¿Tomaste decisiones conscientes respecto al consumo?",
    "¿Cuidaste el entorno más allá de lo obligatorio?",
    "¿Fuiste coherente con el respeto por otras formas de vida?"
  ]
};
const WEEKLY_QUESTION_BANK = [
  "¿Esta semana actuaste con coherencia aunque nadie te mirara?",
  "¿Elegiste escuchar antes que reaccionar?",
  "¿Cuidaste tu energía emocional?",
  "¿Fuiste responsable con tus palabras?",
  "¿Elegiste el respeto incluso en desacuerdo?",
  "¿Reconociste un error propio?",
  "¿Ayudaste sin esperar nada a cambio?",
  "¿Fuiste honesto con vos mismo?",
  "¿Te hiciste cargo de tus decisiones?",
  "¿Cuidaste tu vínculo con otros?",
  "¿Frenaste una reacción automática?",
  "¿Elegiste el bien común sobre el beneficio propio?",
  "¿Actuaste desde la empatía?",
  "¿Sostuviste un valor aunque fuera incómodo?",
  "¿Tomaste conciencia de tu impacto?"
];
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

function getWeeklyQuestions() {
  const used = JSON.parse(localStorage.getItem("weekly_used") || "[]");
  const available = [];

  Object.entries(WEEKLY_BANK).forEach(([area, questions]) => {
    questions.forEach(q => {
      if (!used.includes(q)) {
        available.push({ area, text: q });
      }
    });
  });

  // Mezcla y toma 3
  const selected = available.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Guardar usadas
  const newUsed = used.concat(selected.map(q => q.text));
  localStorage.setItem("weekly_used", JSON.stringify(newUsed));

  return selected;
}
const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

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

function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(value) {
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let percents = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push({ name: m.name, value: percent });
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...percents.map(p=>p.value)) - Math.min(...percents.map(p=>p.value)));
  document.getElementById("coherenceResult").innerText = "Coherencia humana: " + coherence + "%";

  renderTips(global, percents);

  if (mode === "premium") {
    const note = document.getElementById("premiumNote");
    if (note) note.classList.remove("hidden");
  }
}

function renderTips(global, percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  // COMÚN → UNA SOLA DEVOLUCIÓN GENERAL
  if (mode === "common") {
    if (global >= 90) {
      tips.innerHTML = "<li>Tu nivel de humanidad es alto y consistente. Seguí sosteniendo este equilibrio.</li>";
    } else if (global >= 60) {
      tips.innerHTML = "<li>Hay una base humana presente, con áreas que pueden fortalecerse si les prestás más conciencia.</li>";
    } else {
      tips.innerHTML = "<li>Tu humanidad está en tensión. Este resultado invita a frenar, observarte y reconectar con lo esencial.</li>";
    }
    return;
  }

  // PREMIUM → DEVOLUCIONES DIFERENTES POR ÁREA
  percents.forEach(p => {
    if (p.value >= 100) return;

    let text = "";

    switch (p.name) {
      case "Familia":
        text = "En el ámbito familiar, tus respuestas sugieren que podrías estar funcionando más desde la inercia que desde la presencia consciente.";
        break;
      case "Social":
        text = "En lo social, aparece una distancia entre tu intención y tu impacto. Revisar tu forma de vincularte puede abrir nuevas posibilidades.";
        break;
      case "Amistad":
        text = "En tus amistades, se percibe una posible desconexión emocional. Estar más disponible puede transformar esos vínculos.";
        break;
      case "Laboral":
        text = "En el plano laboral, tus respuestas indican tensión entre valores y acciones. Ordenar prioridades puede traer mayor coherencia.";
        break;
      case "Planeta":
        text = "En tu relación con el entorno, hay margen para una conciencia más activa sobre tu impacto cotidiano.";
        break;
      case "Conciencia Profunda":
        text = "En tu conciencia interna, aparece una brecha entre lo que sentís y lo que encarnás. Integrarlo es el próximo paso evolutivo.";
        break;
      default:
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = text;
    tips.appendChild(li);
  });
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  const progress = Math.round((answered/totalQ)*100);
  document.getElementById("thermoFill").style.width = progress + "%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

// ===============================
// REVISIÓN SEMANAL PREMIUM
// ===============================

const WEEKLY_CONFIG = {
  questionsPerWeek: 3,
  maxWeeks: 4
};

function getWeeklyState() {
  return JSON.parse(localStorage.getItem("weeklyState")) || {
    week: 1,
    usedQuestions: [],
    history: []
  };
}

function saveWeeklyState(state) {
  localStorage.setItem("weeklyState", JSON.stringify(state));
}

function canDoWeeklyCheck() {
  const state = getWeeklyState();
  return state.week <= WEEKLY_CONFIG.maxWeeks;
}

function getWeeklyQuestions() {
  const state = getWeeklyState();

  const available = WEEKLY_QUESTION_BANK.filter(
    q => !state.usedQuestions.includes(q)
  );

  const selected = available.slice(0, WEEKLY_CONFIG.questionsPerWeek);

  state.usedQuestions.push(...selected);
  saveWeeklyState(state);

  return selected;
}

function submitWeeklyAnswers(score) {
  const state = getWeeklyState();

  state.history.push(score);
  state.week += 1;

  saveWeeklyState(state);
}

function getWeeklyTrend() {
  const { history } = getWeeklyState();

  if (history.length < 2) return "tendencia inicial";

  const last = history[history.length - 1];
  const prev = history[history.length - 2];

  if (last > prev) return "tu humanidad está en ascenso";
  if (last < prev) return "tu humanidad está en descenso";
  return "tu humanidad se mantiene estable";
}


