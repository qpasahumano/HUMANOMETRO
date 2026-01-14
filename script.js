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
   VARIABLES PRINCIPALES
================================ */
let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   CONTEO SEMANAL
================================ */
let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "Cuando viviste alguna incomodidad o tensión emocional esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
  "¿Lograste registrar alguna emoción intensa sin reaccionar automáticamente?",
  "¿Sentiste coherencia entre lo que pensaste, dijiste e hiciste esta semana?"
];

function weeklyAnswer(value) {
  weeklyScores.push(value);
  weeklyIndex++;

  weeklyThermoFill.style.width =
    (weeklyIndex / WEEKLY_QUESTIONS.length) * 100 + "%";

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    showWeeklyResult();
  } else {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function showWeeklyResult() {
  document.getElementById("weekly").classList.add("hidden");
  document.getElementById("weeklyResultScreen").classList.remove("hidden");

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  let text = "";
  let advice = "";

  if (avg < 0.8) {
    text = "Esta semana hubo baja conciencia emocional.";
    advice = "Registrar tus reacciones es el primer paso para transformarlas.";
  } else if (avg < 1.5) {
    text = "Tu conciencia emocional fue intermitente.";
    advice = "Pequeñas pausas pueden ayudarte a sostener presencia.";
  } else {
    text = "Mostraste buena coherencia emocional esta semana.";
    advice = "Sostener esta observación fortalece tu humanidad.";
  }

  weeklyText.innerText = text;
  weeklyAdvice.innerText = advice;
}

function saveWeekly() {
  weeklySaved.classList.remove("hidden");
}

function goToV2() {
  window.location.href = "v2/index.html";
}
