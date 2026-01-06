
let areas = [];
let currentArea = 0;
let currentQuestion = 0;
let scores = {};
let isPremium = false;

const baseAreas = [
  { name: "Familiar", questions: [
    "¿Estás emocionalmente presente?",
    "¿Escuchás sin juzgar?",
    "¿Compartís tiempo real?"
  ]},
  { name: "Social", questions: [
    "¿Tratás con respeto?",
    "¿Ayudás cuando podés?",
    "¿Escuchás al otro?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuás con ética?",
    "¿Respetás a colegas?",
    "¿Sos justo?"
  ]},
  { name: "Conciencia", questions: [
    "¿Reconocés tus errores?",
    "¿Buscás crecer?",
    "¿Actuás con coherencia?"
  ]},
  { name: "Naturaleza", questions: [
    "¿Cuidás el entorno?",
    "¿Reducís tu impacto?",
    "¿Respetás la vida?"
  ]}
];

const premiumExtra = [
  { name: "Profundidad", questions: [
    "¿Vivís desde el amor?",
    "¿Te mentís?",
    "¿Te hacés cargo de tu impacto?"
  ]}
];

function startTest(premium) {
  isPremium = premium;
  areas = JSON.parse(JSON.stringify(baseAreas));
  if (premium) areas = areas.concat(premiumExtra);

  scores = {};
  areas.forEach(a => scores[a.name] = 0);

  currentArea = 0;
  currentQuestion = 0;

  hideAll();
  document.getElementById("test").classList.remove("hidden");
  updateThermo();
  showQuestion();
}

function showQuestion() {
  const area = areas[currentArea];
  document.getElementById("areaTitle").innerText = area.name;
  document.getElementById("questionText").innerText =
    area.questions[currentQuestion];
}

function answer(value) {
  const area = areas[currentArea];
  scores[area.name] += value;
  currentQuestion++;

  if (currentQuestion >= area.questions.length) {
    currentQuestion = 0;
    currentArea++;
  }

  updateThermo();

  if (currentArea >= areas.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  hideAll();
  document.getElementById("results").classList.remove("hidden");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;

  areas.forEach(a => {
    const max = a.questions.length * 2;
    const percent = Math.round((scores[a.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `${percent}%<br>${a.name}`;
    circles.appendChild(div);
  });

  const global = Math.round(total / areas.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + Math.max(0, 100 - Math.abs(global - 70)) + "%";

  showTips(global);
}

function showTips(global) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (global >= 90) {
    tips.innerHTML = "<li>Sigue por este camino.</li>";
    return;
  }

  ["Reducí el ritmo", "Más presencia", "Menos pantalla"].forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tips.appendChild(li);
  });
}

function updateThermo() {
  const totalQuestions = areas.reduce((a,b)=>a+b.questions.length,0);
  const answered = areas.slice(0,currentArea)
    .reduce((a,b)=>a+b.questions.length,0) + currentQuestion;
  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQuestions) * 100) + "%";
}

function restart() {
  hideAll();
  document.getElementById("start").classList.remove("hidden");
}

function showPrivacy() {
  hideAll();
  document.getElementById("privacy").classList.remove("hidden");
}

function hideAll() {
  ["start","test","results","privacy"].forEach(id=>{
    document.getElementById(id).classList.add("hidden");
  });
}
