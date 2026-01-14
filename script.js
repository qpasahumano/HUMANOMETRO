/* ===============================
   ESTADO GENERAL
================================ */
let mode = "common";
let currentQuestion = 0;
let score = 0;

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

function restart() {
  show("start");
}

/* ===============================
   PREGUNTAS (ejemplo base)
================================ */
const QUESTIONS = [
  "¿Te detenés a escuchar cuando alguien habla?",
  "¿Sos consciente de tus reacciones?",
  "¿Podés reconocer tus emociones?"
];

function loadQuestion() {
  document.getElementById("questionText").innerText =
    QUESTIONS[currentQuestion] || "";
}

function answer(v) {
  score += v;
  currentQuestion++;

  if (currentQuestion >= QUESTIONS.length) {
    finishTest();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADO
================================ */
function finishTest() {
  show("results");
  document.getElementById("globalResult").innerText =
    "Tu humanidad fue registrada.";

  // habilita acceso a conteo semanal
  localStorage.setItem("humanometro_v1_done", Date.now().toString());
}

/* ===============================
   PRIVACIDAD
================================ */
function showPrivacy() {
  show("privacy");
}

/* ===============================
   UI
================================ */
function show(id) {
  [
    "start",
    "test",
    "results",
    "weekly",
    "weeklyResultScreen",
    "privacy"
  ].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
}
