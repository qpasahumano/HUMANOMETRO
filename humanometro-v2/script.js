/* ===== CONFIG ===== */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const isDev = new URLSearchParams(window.location.search).has("dev");

/* ===== DATA ===== */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el sufrimiento ajeno?", ""],
      ["¿Sentís tristeza ante injusticias?", ""],
      ["¿Te conmueven situaciones humanas?", ""]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿La tecnología te absorbe?", ""],
      ["¿Te cuesta desconectarte?", ""],
      ["¿Postergás vínculos por pantallas?", ""]
    ]
  }
];

let week = 0;
let q = 0;
let weeklyScores = [];
let currentScore = 0;

/* ===== TEST PRINCIPAL ===== */
function startV2() {
  week = 0;
  q = 0;
  weeklyScores = [];
  currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();

  if (q >= 3) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");

  const avg = currentScore / 3;
  weeklyScores.push(avg);

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
}

function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) {
    localStorage.setItem("humanometro_main_done_at", Date.now());
    showMonthlyResult();
  } else {
    show("test");
    loadQuestion();
  }
}

/* ===== RESULTADOS ===== */
function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 500);
}

function openMonthlyFull() {
  document.getElementById("monthlyFullText").innerText =
`Esta lectura surge de tu continuidad en Humanómetro.
No se midieron opiniones, sino reacciones emocionales sostenidas en el tiempo.

La humanidad no se define por ideas,
sino por cómo las vivencias impactan en vos.`;

  show("monthlyFull");
}

/* ===== BLOQUEOS ===== */
document.addEventListener("DOMContentLoaded", () => {
  const weeklyBtn = document.getElementById("weeklyBtn");
  const lockText = document.getElementById("weeklyLockText");
  const mirrorBtn = document.getElementById("mirrorBtn");

  if (isDev) {
    weeklyBtn.disabled = false;
    mirrorBtn.disabled = false;
    if (lockText) lockText.style.display = "none";
    return;
  }

  const doneAt = localStorage.getItem("humanometro_main_done_at");
  if (!doneAt) return;

  const elapsed = Date.now() - Number(doneAt);

  if (elapsed >= WEEK_MS) {
    weeklyBtn.disabled = false;
    if (lockText) lockText.style.display = "none";
  }

  if (elapsed >= WEEK_MS * 4) {
    mirrorBtn.disabled = false;
  }
});

/* ===== UI ===== */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 3) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function startWeekly() {
  startV2();
}

function goToMirror() {
  alert("Acá arranca Volumen 3 – Espejo");
}
