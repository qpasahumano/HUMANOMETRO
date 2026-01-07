// ===============================
// ESTADO GLOBAL
// ===============================
let currentQuestion = 0;
let score = 0;

const questions = [
  "¿Escuchás con atención a las personas?",
  "¿Actuás con empatía incluso cuando estás cansado?",
  "¿Reconocés tus errores?",
  "¿Cuidás el impacto de tus palabras?",
  "¿Te hacés responsable de tus actos?"
];

// ===============================
// INICIO
// ===============================
function startTest() {
  currentQuestion = 0;
  score = 0;

  document.getElementById("start").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");

  showQuestion();
}

// ===============================
// MOSTRAR PREGUNTA
// ===============================
function showQuestion() {
  document.getElementById("questionText").innerText =
    questions[currentQuestion];
}

// ===============================
// RESPUESTA
// ===============================
function answer(value) {
  score += value;
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

// ===============================
// RESULTADOS
// ===============================
function showResults() {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");

  const percent = Math.round((score / (questions.length * 2)) * 100);
  document.getElementById("globalResult").innerText =
    "Resultado: " + percent + "%";
}

// ===============================
// REINICIAR
// ===============================
function restart() {
  document.getElementById("results").classList.add("hidden");
  document.getElementById("start").classList.remove("hidden");
}
