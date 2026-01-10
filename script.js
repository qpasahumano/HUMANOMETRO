/* ===== CONTEO SEMANAL + MENSUAL ===== */

let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "¿Actuás con empatía ante vínculos cercanos incluso cuando algo te incomoda?",
  "¿Respondés con calma ante tensiones cotidianas?",
  "¿Sostenés un trato respetuoso aunque no estés de acuerdo?",
  "¿Podés escuchar sin cerrarte completamente en tu postura?"
];

function startWeekly() {
  weeklyIndex = 0;
  weeklyScores = [];
  showSection("weekly");
  showWeeklyQuestion();
}

function showWeeklyQuestion() {
  document.getElementById("weeklyQuestion").innerText = WEEKLY_QUESTIONS[weeklyIndex];
  updateWeeklyThermo();
}

function weeklyAnswer(v) {
  weeklyScores.push(v);
  weeklyIndex++;
  if (weeklyIndex < WEEKLY_QUESTIONS.length) showWeeklyQuestion();
  else showWeeklyResult();
}

function showWeeklyResult() {
  document.getElementById("weeklyResult").classList.remove("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  document.getElementById("weeklyText").innerText =
    avg < 0.8 ? "Tendencia humana baja esta semana."
    : avg < 1.5 ? "Tendencia humana intermedia esta semana."
    : "Tendencia humana positiva esta semana.";

  document.getElementById("weeklyAdvice").innerText =
    "Registrar conscientemente tus vivencias permite observar tu evolución.";

  document.getElementById("weeklyFace").innerText =
    avg < 0.8 ? "😟" : avg < 1.5 ? "😐" : "🙂";

  updateWeeklyThermo(avg);
  showMonthlyIfReady();
}

function updateWeeklyThermo(val=null) {
  const p = val!==null ? Math.round((val/2)*100) :
    Math.round((weeklyIndex/WEEKLY_QUESTIONS.length)*100);
  document.getElementById("weeklyThermoFill").style.width = p+"%";
}

function saveWeekly() {
  const history = JSON.parse(localStorage.getItem("weeklyHistory")) || [];
  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  history.push(avg);
  localStorage.setItem("weeklyHistory", JSON.stringify(history));
  document.getElementById("weeklySaved").classList.remove("hidden");
}

function showMonthlyIfReady() {
  const history = JSON.parse(localStorage.getItem("weeklyHistory")) || [];
  if (history.length >= 4) {
    const m = history.slice(-4);
    const avg = m.reduce((a,b)=>a+b,0)/4;
    document.getElementById("monthlyResult").innerText =
      avg < 0.8 ? "Resultado mensual: humanidad en descenso."
      : avg < 1.5 ? "Resultado mensual: humanidad estable."
      : "Resultado mensual: humanidad en ascenso.";
  }
}
