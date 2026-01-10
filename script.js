/* ===============================
   REFERENCIAS DOM (CRÍTICO)
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
const weeklyResult = document.getElementById("weeklyResult");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");
const weeklySaved = document.getElementById("weeklySaved");

/* ===============================
   ESTADO GENERAL
================================ */
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   CONTEO SEMANAL (INAMOVIBLE)
================================ */
let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "Cuando surgieron tensiones emocionales esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
  "Ante diferencias o incomodidades con alguna persona esta semana, ¿intentaste comprender lo que el otro podía estar sintiendo?",
  "Frente a emociones intensas surgidas esta semana con algún vínculo, ¿lograste soltarlas sin quedarte atrapado en ellas?"
];

function startWeekly() {
  weeklyIndex = 0;
  weeklyScores = [];
  showSection("weekly");
  weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  weeklyThermoFill.style.width = "0%";
  weeklyResult.classList.add("hidden");
  weeklySaved.classList.add("hidden");
}

function weeklyAnswer(value) {
  weeklyScores.push(value);
  weeklyIndex++;

  weeklyThermoFill.style.width =
    Math.round((weeklyScores.length / WEEKLY_QUESTIONS.length) * 100) + "%";

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    showWeeklyResult();
  } else {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function showWeeklyResult() {
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  if (avg < 0.8) {
    weeklyText.innerText =
      "Esta semana se observa una desconexión entre intención y acción.";
    weeklyAdvice.innerText =
      "Tomar conciencia de tus reacciones es el primer paso para rehumanizar el vínculo.";
  } else if (avg < 1.5) {
    weeklyText.innerText =
      "La semana mostró una conciencia humana intermedia.";
    weeklyAdvice.innerText =
      "Sostener la atención consciente puede ayudarte a estabilizar tu respuesta emocional.";
  } else {
    weeklyText.innerText =
      "La semana reflejó una coherencia humana positiva.";
    weeklyAdvice.innerText =
      "Seguir actuando desde la empatía fortalece tu equilibrio interno.";
  }

  weeklyResult.classList.remove("hidden");
}

function saveWeekly() {
  const history = JSON.parse(
    localStorage.getItem("humanometro_semanal") || "[]"
  );
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  history.push({
    date: new Date().toISOString().slice(0, 10),
    score: avg
  });

  localStorage.setItem("humanometro_semanal", JSON.stringify(history));
  weeklySaved.classList.remove("hidden");
}

/* ===============================
   TEST PRINCIPAL
================================ */
const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estás emocionalmente presente con tu familia?", n: "Se mide presencia consciente." },
    { q: "¿Escuchás sin juzgar?", n: "Se mide apertura emocional." },
    { q: "¿Expresás afecto sin que te lo pidan?", n: "Se observa intención genuina." }
  ]},
  { name: "Social", questions: [
    { q: "¿Tratás a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchás opiniones distintas a la tuya?", n: "Se mide tolerancia." },
    { q: "¿Actuás con empatía en espacios públicos?", n: "Conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estás presente para tus amistades?", n: "Presencia real." },
    { q: "¿Cuidás el vínculo aun sin coincidir?", n: "Cuidado del lazo." },
    { q: "¿Escuchás sin imponer tu visión?", n: "Respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generás buen clima laboral aun sin estar cómodo?", n: "Responsabilidad humana." },
    { q: "¿Respetás a tus compañeros?", n: "Trato consciente." },
    { q: "¿Evitás sobrecargar a otros?", n: "Conciencia colectiva." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconocés a los animales como seres sensibles?", n: "Empatía." },
    { q: "¿Cuidás tu entorno inmediato?", n: "Conciencia cotidiana." },
    { q: "¿Reducís tu impacto ambiental cuando podés?", n: "Intención posible." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Tomás decisiones desde la conciencia?", n: "Atención interna." },
    { q: "¿Sos coherente entre pensamiento y acción?", n: "Alineación interna." },
    { q: "¿Asumís responsabilidad por tu impacto en otros?", n: "Madurez emocional." }
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
  const m = modules[currentModule];
  areaTitle.innerText = m.name;
  questionText.innerText = m.questions[currentQuestion].q;
  questionNote.innerText = m.questions[currentQuestion].n;
}

function answer(v) {
  scores[modules[currentModule].name] += v;
  currentQuestion++;

  if (currentQuestion >= modules[currentModule].questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  currentModule >= modules.length ? showResults() : showQuestion();
  updateThermometer();
}

function showResults() {
  showSection("results");
  circles.innerHTML = "";
  tips.innerHTML = "";
  weeklyAccess.innerHTML = "";

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

  if (mode === "premium") {
    tips.innerHTML = modules.map(m =>
      `<li>En ${m.name}, tu coherencia refleja tu nivel actual de conciencia.</li>`
    ).join("");

    weeklyAccess.innerHTML = `
      <button class="premium" onclick="weeklyWithDonation()">Conteo semanal</button>
      <p class="legal">
        Conteo semanal – versión Premium.<br>
        Sostenido mediante aportes conscientes y donaciones a voluntad.
      </p>`;
  } else {
    tips.innerHTML = `
      <li>
        ${avg < 40
          ? "Predomina una desconexión entre intención y acción."
          : avg < 70
            ? "Existe sensibilidad humana, aunque fluctuante."
            : "Hay coherencia entre lo que sentís, pensás y hacés."
        }
      </li>`;
  }
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  thermoFill.style.width = Math.round((answered / totalQ) * 100) + "%";
}

/* ===============================
   NAVEGACIÓN
================================ */
function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start", "test", "results", "weekly", "privacy"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   DONACIÓN
================================ */
function weeklyWithDonation() {
  startWeekly();
}
