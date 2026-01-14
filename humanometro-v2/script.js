/* ===== CONFIG ===== */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* ===== DATA ===== */
const WEEKS = [
  {
    title: "Primera semana",
    questions: [
      "¿Te afectó el sufrimiento ajeno?",
      "¿Te detuviste a escuchar a otros?",
      "¿Actuaste con coherencia?"
    ]
  },
  {
    title: "Semana 2",
    questions: [
      "¿La tecnología te absorbió?",
      "¿Postergaste vínculos por pantallas?",
      "¿Pudiste desconectarte?"
    ]
  },
  {
    title: "Semana 3",
    questions: [
      "¿Fuiste consciente de tus emociones?",
      "¿Evitaste reaccionar en automático?",
      "¿Elegiste cómo actuar?"
    ]
  },
  {
    title: "Semana 4",
    questions: [
      "¿Sostuviste coherencia?",
      "¿Sentís evolución humana?",
      "¿Te observaste con honestidad?"
    ]
  }
];

let week = 0;
let q = 0;
let currentScore = 0;
let scores = [];

/* ===== FLOW ===== */
function startV2() {
  week = 0;
  q = 0;
  currentScore = 0;
  scores = [];
  show("test");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("weekTitle").innerText = WEEKS[week].title;
  document.getElementById("questionText").innerText = WEEKS[week].questions[q];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();

  if (q >= 3) showStageResult();
  else loadQuestion();
}

function showStageResult() {
  show("weeklyResult");

  const avg = currentScore / 3;
  scores.push(avg);

  let symbol = "🐞";
  let text = "Tu humanidad se mantuvo estable.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Se detectó desconexión humana.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu humanidad mostró coherencia.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;

  const btn = document.getElementById("continueBtn");
  btn.innerText = week === 0 ? "Primera semana" : `Semana ${week + 1}`;
}

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

function showMonthlyResult() {
  show("monthlyResult");

  const avg = scores.reduce((a,b)=>a+b,0) / scores.length;

  document.getElementById("monthlyFill").style.height =
    Math.round((avg / 2) * 100) + "%";

  document.getElementById("monthlySymbol").innerText =
    avg > 1.5 ? "🐦" : avg > 0.8 ? "🐞" : "🦇";

  document.getElementById("monthlyText").innerText =
    "Esta medición refleja tu humanidad a lo largo del mes.";
}

function openMonthlyFull() {
  document.getElementById("monthlyFullText").innerText =
`Esta lectura surge de tu continuidad en Humanómetro.
No se midieron opiniones, sino reacciones emocionales sostenidas en el tiempo.
La humanidad no se define por ideas,
sino por cómo las vivencias impactan en vos.`;

  show("monthlyFull");
}

function goToMirror() {
  alert("Acá comienza Volumen 3 – Espejo");
}

/* ===== UI ===== */
function updateThermo() {
  document.getElementById("thermoFill").style.width = (q / 3) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
