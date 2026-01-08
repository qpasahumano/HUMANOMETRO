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
  { name: "Conciencia", questions: [
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
  let details = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if (percent < 100) {
      details.push({ area: m.name, percent });
    }
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  renderTips(details);
}

function renderTips(details) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (details.length === 0) {
    tips.innerHTML =
      "<li>Estás en un proceso humano sólido y coherente. Seguí por este camino.</li>";
    return;
  }

  details.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML =
      `En <strong>${d.area}</strong>, podrías observar con más conciencia cómo estás actuando y qué impacto tienen tus decisiones.`;
    tips.appendChild(li);
  });
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

function restart() {
  showSection("start");
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
/* ========= REVISIÓN SEMANAL PREMIUM (AISLADA) ========= */

const WEEKLY_KEY = "humanometro_weekly_last";
const WEEKLY_DELAY = 7 * 24 * 60 * 60 * 1000;

const WEEKLY_QUESTIONS = [
  "Esta semana, ¿estuviste más presente con los demás?",
  "¿Actuaste con coherencia entre lo que pensás y hacés?",
  "¿Elegiste conscientemente respuestas más humanas?",
  "¿Te escuchaste antes de reaccionar?",
  "¿Cuidaste tu impacto emocional en otros?"
];

let weeklyIndex = 0;
let weeklyScore = 0;

function injectWeeklyButton() {
  if (mode !== "premium") return;
  if (document.getElementById("weeklyBtn")) return;

  const btn = document.createElement("button");
  btn.id = "weeklyBtn";
  btn.innerText = "Revisión semanal (Premium)";
  btn.onclick = startWeeklyReview;
  btn.style.marginTop = "20px";

  document.getElementById("results").appendChild(btn);
}

function startWeeklyReview() {
  const last = localStorage.getItem(WEEKLY_KEY);
  if (last && Date.now() - Number(last) < WEEKLY_DELAY) {
    alert("La revisión semanal se habilita cada 7 días.");
    return;
  }

  weeklyIndex = 0;
  weeklyScore = 0;
  showWeekly();
}

function showWeekly() {
  hideAllSections();

  let sec = document.getElementById("weekly");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "weekly";
    sec.innerHTML = `
      <h2>Revisión semanal</h2>
      <p id="weeklyQ"></p>
      <div class="answers">
        <button onclick="weeklyAnswer(2)">Sí</button>
        <button onclick="weeklyAnswer(1)">A veces</button>
        <button onclick="weeklyAnswer(0)">No</button>
      </div>
    `;
    document.getElementById("app").appendChild(sec);
  }

  sec.classList.remove("hidden");
  renderWeeklyQ();
}

function renderWeeklyQ() {
  document.getElementById("weeklyQ").innerText =
    WEEKLY_QUESTIONS[weeklyIndex];
}

function weeklyAnswer(val) {
  weeklyScore += val;
  weeklyIndex++;

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    finishWeekly();
  } else {
    renderWeeklyQ();
  }
}

function finishWeekly() {
  localStorage.setItem(WEEKLY_KEY, Date.now());

  const max = WEEKLY_QUESTIONS.length * 2;
  const percent = Math.round((weeklyScore / max) * 100);

  document.getElementById("weekly").innerHTML = `
    <h2>Resultado semanal</h2>
    <p>Tu coherencia humana esta semana fue del <strong>${percent}%</strong>.</p>
    <p>Esto es una lectura de tendencia, no un juicio.</p>
    <button onclick="restart()">Volver</button>
  `;
}

function hideAllSections() {
  ["start","test","results","privacy","weekly"].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

const _showResultsOriginal = showResults;
showResults = function() {
  _showResultsOriginal();
  injectWeeklyButton();
};
