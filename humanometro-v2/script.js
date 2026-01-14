/* ===============================
   HUMANÓMETRO – VOLUMEN 2
   SCRIPT ÚNICO, LIMPIO Y ESTABLE
=============================== */

/* ===== DATOS ===== */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el sufrimiento ajeno?", "Empatía humana"],
      ["¿Te genera tristeza la injusticia?", "Sensibilidad emocional"],
      ["¿Sentís compromiso ante lo que pasa?", "Implicación humana"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿La tecnología te absorbe?", "Dependencia digital"],
      ["¿Te cuesta desconectarte?", "Autocontrol"],
      ["¿Postergás vínculos por pantallas?", "Prioridades humanas"]
    ]
  }
];

/* ===== ESTADO ===== */
let week = 0;
let question = 0;
let score = 0;
let weeklyScores = [];

/* ===== INICIO ===== */
function startV2() {
  week = 0;
  question = 0;
  score = 0;
  weeklyScores = [];
  show("test");
  loadQuestion();
}

/* ===== PREGUNTAS ===== */
function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[question][0];
  document.getElementById("questionMeasure").innerText = w.questions[question][1];
  updateThermo();
}

function answer(value) {
  score += value;
  question++;

  if (question >= WEEKS[week].questions.length) {
    showWeeklyResult();
  } else {
    loadQuestion();
  }
}

/* ===== RESULTADO SEMANAL ===== */
function showWeeklyResult() {
  show("weeklyResult");

  const avg = score / WEEKS[week].questions.length;
  weeklyScores.push(avg);

  let symbol = "🐞";
  let text = "Tu humanidad se mantuvo estable.";
  let advice = "Observarte ya es un acto de conciencia.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Se detectó desconexión humana.";
    advice = "Pausar puede ayudarte a reconectar.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu humanidad mostró coherencia.";
    advice = "Sostener esta actitud fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

/* ===== AVANZAR ===== */
function nextWeek() {
  week++;
  question = 0;
  score = 0;

  if (week >= WEEKS.length) {
    showMonthlyResult();
  } else {
    show("test");
    loadQuestion();
  }
}

/* ===== RESULTADO MENSUAL ===== */
function showMonthlyResult() {
  show("monthlyResult");

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  document.getElementById("monthlyFill").style.height =
    Math.round((avg / 2) * 100) + "%";

  let symbol = "🐞";
  let text = "Tu humanidad se mantuvo estable este mes.";
  let advice = "Pequeños actos sostienen grandes cambios.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad estuvo retraída.";
    advice = "Escucharte es el primer paso.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu humanidad está en expansión.";
    advice = "Hay coherencia entre sentir y actuar.";
  }

  document.getElementById("monthlySymbol").innerText = symbol;
  document.getElementById("monthlyText").innerText = text;
  document.getElementById("monthlyAdvice").innerText = advice;
}

/* ===== LECTURA COMPLETA ===== */
function openMonthlyFull() {
  document.getElementById("monthlyFullText").innerText =
`Esta lectura surge de tu continuidad en Humanómetro.
No se midieron ideas ni opiniones,
sino reacciones emocionales sostenidas en el tiempo.

La humanidad no se define por lo que pensás,
sino por cómo las vivencias impactan en vos.`;

  show("monthlyFull");
}

/* ===== UI ===== */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    ((question + 1) / WEEKS[week].questions.length) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
      }
