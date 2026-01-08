let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

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
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

const AREA_MESSAGES = {
  Familia: "Tus respuestas en el plano familiar muestran que hay vínculos donde podrías estar más presente emocionalmente. La cercanía consciente fortalece la raíz humana.",
  Social: "En lo social, tus elecciones indican margen para ampliar empatía y escucha. La convivencia se construye en los gestos cotidianos.",
  Amistad: "El área de amistades sugiere que podrías revisar cómo acompañás y sostenés los vínculos cuando hay diferencias.",
  Laboral: "En el ámbito laboral, aparece la oportunidad de alinear más tus acciones con valores internos, incluso cuando no hay observadores.",
  Planeta: "Tu relación con el entorno muestra espacios donde pequeños actos conscientes pueden generar un impacto más amplio.",
  "Conciencia Profunda": "Las respuestas profundas invitan a observar con más honestidad desde dónde actuás y qué huella dejás."
};

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

  let percents = [];
  let total = 0;

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
    document.getElementById("premiumNote").classList.remove("hidden");
  }
}

function renderTips(global, percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (global >= 99) {
    tips.innerHTML = "<li>Estás en un muy buen camino. Tu forma de habitar el mundo refleja coherencia y presencia consciente.</li>";
    return;
  }

  percents
    .filter(p => p.value < 100)
    .forEach(p => {
      const li = document.createElement("li");
      li.innerText = AREA_MESSAGES[p.name] || "";
      tips.appendChild(li);
    });
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  const progress = Math.round((answered/totalQ)*100);
  document.getElementById("thermoFill").style.width = progress+"%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start","test","results","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
