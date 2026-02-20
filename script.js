/* ===============================
   REFERENCIAS DOM
================================ */
const areaTitle = document.getElementById("areaTitle");
const questionText = document.getElementById("questionText");
const questionNote = document.getElementById("questionNote");
const thermoFill = document.getElementById("thermoFill");

const circles = document.getElementById("circles");
const tips = document.getElementById("tips");
const globalResult = document.getElementById("globalResult");
const weeklyAccess = document.getElementById("weeklyAccess");

const weeklyQuestion = document.getElementById("weeklyQuestion");
const weeklyThermoFill = document.getElementById("weeklyThermoFill");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");
const weeklySaved = document.getElementById("weeklySaved");

/* ===============================
   BLOQUEO CONFIG
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const BLOCK_RECorrido = "hm_block_recorrido";
const BLOCK_VOLVE = "hm_block_volve";

/* ===============================
   VARIABLES PRINCIPALES
================================ */
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   PERFIL RESPUESTAS
================================ */
let responseProfile = {
  no: 0,
  maybe: 0,
  yes: 0,
  total: 0
};

/* ===============================
   CONTEO SEMANAL
================================ */
let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "Cuando viviste alguna incomodidad o tensión emocional esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
  "Ante diferencias o tensiones con alguna persona esta semana, ¿intentaste comprender lo que el otro podía estar sintiendo?",
  "Frente a emociones densas surgidas en la semana con algún vínculo, ¿lograste soltarlas sin quedarte atrapado en ellas?"
];

/* ===============================
   TEST PRINCIPAL
================================ */
const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estuviste emocionalmente presente con tu familia?", n: "Aquí se mide presencia, no perfección." },
    { q: "¿Escuchaste sin juzgar?", n: "Se mide apertura." },
    { q: "¿Expresaste afecto sin que te lo pidan?", n: "Se mide intención." }
  ]},
  { name: "Social", questions: [
    { q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchaste opiniones distintas a la tuya?", n: "Se mide tolerancia." },
    { q: "¿Actuaste con empatía en espacios públicos?", n: "Conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estuviste presente para tus amistades?", n: "Presencia real." },
    { q: "¿Cuidaste el vínculo aun sin coincidir?", n: "Cuidado del lazo." },
    { q: "¿Escuchaste sin imponer tu visión?", n: "Respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generaste buen clima laboral aun sin estar cómodo?", n: "Responsabilidad humana." },
    { q: "¿Respetaste a tus compañeros?", n: "Trato consciente." },
    { q: "¿Evitaste sobrecargar a otros?", n: "Conciencia colectiva." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconociste a los animales como seres sensibles?", n: "Empatía." },
    { q: "¿Cuidaste el entorno donde vivís?", n: "Conciencia cotidiana." },
    { q: "¿Reduciste tu impacto cuando estuvo a tu alcance?", n: "Intención posible." }
  ]}
];

function startTest() {
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  scores = {};
  modules.forEach(m => scores[m.name] = 0);

  currentModule = 0;
  currentQuestion = 0;
  responseProfile = { no:0, maybe:0, yes:0, total:0 };

  showSection("test");
  showQuestion();
  updateThermometer();
}

function showQuestion() {
  const m = modules[currentModule];
  areaTitle.innerText = m.name;
  questionText.innerText = m.questions[currentQuestion].q;
  questionNote.innerText = m.questions[currentQuestion].n;
}

function answer(v) {
  scores[modules[currentModule].name] += v;

  if (v === 0) responseProfile.no++;
  else if (v === 1) responseProfile.maybe++;
  else if (v === 2) responseProfile.yes++;
  responseProfile.total++;

  currentQuestion++;

  if (currentQuestion >= modules[currentModule].questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  currentModule >= modules.length ? showResults() : showQuestion();
  updateThermometer();
}

/* ===============================
   RESULTADOS
================================ */
function showResults() {
  showSection("results");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const p = Math.round(scores[m.name] / max * 100);
    total += p;

    circles.innerHTML += `
      <div class="circle ${p < 40 ? "low" : p < 70 ? "mid" : "high"}">
        <strong>${p}%</strong>
        <small>${m.name}</small>
      </div>`;
  });

  const avg = Math.round(total / modules.length);
  globalResult.innerText = "Humanidad global: " + avg + "%";
  tips.innerHTML = `<li>${commonFeedback(avg)}</li>`;
}

/* ===============================
   DEVOLUCIÓN
================================ */
function commonFeedback(avg) {
  if (avg < 40)
    return "Se observa una desconexión entre intención y acción. Reconocerlo abre un proceso de conciencia.";
  if (avg < 70)
    return "Tu humanidad está presente, aunque con fluctuaciones. La observación consciente puede estabilizarla.";
  return "Existe coherencia entre lo que sentís, pensás y hacés. Tu humanidad se expresa con claridad.";
}

/* ===============================
   RECORRIDO MENSUAL (BLOQUEO 7 DÍAS)
================================ */
function weeklyWithDonation() {
  const last = localStorage.getItem(BLOCK_RECorrido);
  if (last && Date.now() - Number(last) < WEEK_MS) {
    alert("No seas ansioso. Todavía no pasó la semana.");
    return;
  }
  localStorage.setItem(BLOCK_RECorrido, Date.now());
  startWeekly();
}

function startWeekly() {
  weeklyIndex = 0;
  weeklyScores = [];
  weeklyThermoFill.style.width = "0%";
  showSection("weekly");
  weeklyQuestion.innerText = WEEKLY_QUESTIONS[0];
}

function weeklyAnswer(value) {
  weeklyScores.push(value);
  weeklyIndex++;

  weeklyThermoFill.style.width =
    Math.round((weeklyScores.length / WEEKLY_QUESTIONS.length) * 100) + "%";

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    showWeeklyResultScreen();
  } else {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function showWeeklyResultScreen() {
  const avg = weeklyScores.reduce((a,b)=>a+b,0) / WEEKLY_QUESTIONS.length;

  if (avg < 0.8) {
    weeklyText.innerText =
      "Esta semana mostró una desconexión entre intención y acción.";
    weeklyAdvice.innerText =
      "Observar tus reacciones sin juzgar puede ayudarte a recuperar coherencia.";
  } else if (avg < 1.5) {
    weeklyText.innerText =
      "Tu humanidad estuvo presente, pero de forma fluctuante.";
    weeklyAdvice.innerText =
      "Sostener la atención consciente puede estabilizar tu respuesta emocional.";
  } else {
    weeklyText.innerText =
      "Mostraste coherencia humana y presencia consciente esta semana.";
    weeklyAdvice.innerText =
      "Continuar actuando desde la empatía refuerza tu equilibrio interno.";
  }

  saveWeekly();
  showSection("weeklyResultScreen");
}

function saveWeekly() {
  const history = JSON.parse(localStorage.getItem("humanometro_semanal") || "[]");
  const avg = weeklyScores.reduce((a,b)=>a+b,0) / WEEKLY_QUESTIONS.length;

  history.push({
    date: new Date().toISOString().slice(0,10),
    score: avg
  });

  localStorage.setItem("humanometro_semanal", JSON.stringify(history));
  weeklySaved.classList.remove("hidden");
}

/* ===============================
   UTIL
================================ */
function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  thermoFill.style.width =
    Math.round((answered/totalQ)*100)+"%";
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","weekly","weeklyResultScreen","privacy"]
  .forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goToV2(){
  const last = localStorage.getItem(BLOCK_VOLVE);
  if (last && Date.now() - Number(last) < WEEK_MS) {
    alert("Todavía no pasó la semana.");
    return;
  }
  localStorage.setItem(BLOCK_VOLVE, Date.now());
  window.location.href="./humanometro-v2/";
}
