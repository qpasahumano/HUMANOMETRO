/* ===============================
   ESTADO GLOBAL
================================ */
let mode = "common";
let currentQuestion = 0;
let score = 0;

/* ===============================
   PREGUNTAS V1 (BASE)
================================ */
const QUESTIONS = [
  ["¿Te detuviste hoy a escuchar de verdad a alguien?", "Presencia humana"],
  ["¿Actuaste en coherencia con lo que sentías?", "Congruencia interna"],
  ["¿Fuiste consciente del impacto de tus actos?", "Responsabilidad humana"],
  ["¿Sentiste conexión con otros?", "Empatía"]
];

/* ===============================
   INICIO
================================ */
function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";
  currentQuestion = 0;
  score = 0;
  show("test");
  loadQuestion();
}

function showPrivacy() {
  show("privacy");
}

/* ===============================
   TEST
================================ */
function loadQuestion() {
  const q = QUESTIONS[currentQuestion];
  document.getElementById("areaTitle").innerText =
    `Pregunta ${currentQuestion + 1} de ${QUESTIONS.length}`;
  document.getElementById("questionText").innerText = q[0];
  document.getElementById("questionNote").innerText = q[1];
  updateThermo();
}

function answer(val) {
  score += val;
  currentQuestion++;

  if (currentQuestion >= QUESTIONS.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADOS
================================ */
function showResults() {
  show("results");
  document.getElementById("globalResult").innerText =
    "Tu humanidad fue observada, no juzgada.";
}

/* ===============================
   TERMÓMETRO
================================ */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (currentQuestion / QUESTIONS.length) * 100 + "%";
}

/* ===============================
   NAVEGACIÓN
================================ */
function show(id) {
  ["start","test","results","weekly","weeklyResultScreen","privacy"]
    .forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.add("hidden");
    });
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
