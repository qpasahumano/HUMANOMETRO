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
    "¿Respetás a los animales?",
    "¿Cuidás el entorno?",
    "¿Reducís tu impacto ambiental?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Asumís tu impacto en otros?"
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

  currentModule >= modules.length ? showResults() : (showQuestion(), updateThermometer());
}

function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let percents = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push({ name: m.name, value: percent });

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(percents.reduce((s,p)=>s+p.value,0) / percents.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const values = percents.map(p=>p.value);
  const coherence = 100 - (Math.max(...values) - Math.min(...values));
  document.getElementById("coherenceResult").innerText = "Coherencia humana: " + coherence + "%";

  renderTips(percents);
}

function renderTips(percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const weak = percents.filter(p => p.value < 100);

  if (weak.length === 0) {
    tips.innerHTML = "<li>Estás en un muy buen camino. Sostené esta coherencia.</li>";
    return;
  }

  const areas = weak.map(w => w.name).join(", ");
  tips.innerHTML = `<li>Prestá mayor atención a las áreas: <strong>${areas}</strong>. Ahí está tu mayor oportunidad de crecimiento humano.</li>`;
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
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
    }
