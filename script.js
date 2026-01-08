let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let deferredPrompt = null;

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name: "Social", questions: [
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas?",
    "¿Actuás con empatía?"
  ]},
  { name: "Amistad", questions: [
    "¿Estás presente para tus amistades?",
    "¿Sos leal?",
    "¿Escuchás sin imponer?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuás con ética?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo?"
  ]},
  { name: "Planeta", questions: [
    "¿Respetás a los animales?",
    "¿Cuidás el entorno?",
    "¿Reducís tu impacto?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia", questions: [
    "¿Vivís desde el amor?",
    "¿Sos coherente?",
    "¿Asumís responsabilidad?"
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
    percents.push(percent);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...percents) - Math.min(...percents));
  document.getElementById("coherenceResult").innerText = "Coherencia humana: " + coherence + "%";

  renderTips(global, percents);
}

function renderTips(global, percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const weakest = modules[percents.indexOf(Math.min(...percents))].name;
  tips.innerHTML = `<li>Observá con más presencia el área <strong>${weakest}</strong>.</li>`;
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100)+"%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start","test","results","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* INSTALL */
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("installBtn");
  btn.classList.remove("hidden");
  btn.onclick = async () => {
    deferredPrompt.prompt();
    deferredPrompt = null;
    btn.classList.add("hidden");
  };
});
