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
  } else if (
