/* ========= HUMANÓMETRO v2 – SCRIPT ESTABLE ========= */

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el sufrimiento ajeno?", ""],
      ["¿Sentís tristeza ante injusticias?", ""],
      ["¿Te conmueven situaciones humanas?", ""],
      ["¿Podés ignorar el dolor de otros?", ""]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿La tecnología te absorbe?", ""],
      ["¿Te cuesta desconectarte?", ""],
      ["¿Postergás vínculos por pantallas?", ""],
      ["¿Usás la tecnología con conciencia?", ""]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que sentís y hacés?", ""],
      ["¿Podés observarte sin juzgarte?", ""],
      ["¿Asumís tu impacto en otros?", ""],
      ["¿Sentís evolución personal?", ""]
    ]
  }
];

let week = 0;
let q = 0;
let currentScore = 0;
let weeklyScores = [];

/* ====== INICIO ====== */
function startV2() {
  week = 0;
  q = 0;
  currentScore = 0;
  weeklyScores = [];
  show("test");
  loadQuestion();
}

/* ====== PREGUNTAS ====== */
function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  updateThermo();
}

function answer(value) {
  currentScore += value;
  q++;
  updateThermo();

  if (q >= 4) {
    showWeeklyResult();
  } else {
    loadQuestion();
  }
}

/* ====== RESULTADO SEMANAL ====== */
function showWeeklyResult() {
  show("weeklyResult");

  const avg = currentScore / 4;
  weeklyScores.push(avg);

  let symbol = "🐞";
  let text = "Tu humanidad se mantuvo estable.";
  let advice = "Podés observar pequeños gestos cotidianos.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Se detectó desconexión humana.";
    advice = "Detenerte y observar puede ayudarte a reconectar.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu humanidad mostró coherencia.";
    advice = "Sostener esta conciencia fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

/* ====== SIGUIENTE BLOQUE ====== */
function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) {
    showMonthlyResult();
  } else {
    show("test");
    loadQuestion();
  }
}

/* ====== RESULTADO MENSUAL ====== */
function showMonthlyResult() {
  show("monthlyResult");

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 300);

  let symbol = "🐞";
  let text = "Tu humanidad se mantuvo estable este mes.";
  let advice = "Pequeños actos conscientes pueden impulsarte.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad estuvo retraída este mes.";
    advice = "Pausar y observar puede reactivar tu sensibilidad.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu humanidad está en expansión.";
    advice = "Sostener esta coherencia fortalece tu humanidad.";
  }

  document.getElementById("monthlySymbol").innerText = symbol;
  document.getElementById("monthlyText").innerText = text;
  document.getElementById("monthlyAdvice").innerText = advice;
}

/* ====== LECTURA COMPLETA ====== */
function openMonthlyFull() {
  document.getElementById("monthlyFullText").innerText =
`Esta lectura surge de tu continuidad en Humanómetro.
No se midieron opiniones, sino reacciones emocionales sostenidas en el tiempo.

La humanidad no se evalúa por ideas,
sino por cómo las vivencias impactan en vos.`;

  show("monthlyFull");
}

/* ====== UI ====== */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
