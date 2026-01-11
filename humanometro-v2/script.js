/* =========================
   CONFIG
========================= */
const DEV_MODE = true;
const V2_STORAGE = "humanometro_v2";
const V2_DELAY_DAYS = 7;

/* =========================
   SEMANAS
========================= */
const V2_WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el dolor ajeno?", "Mide empatía global."],
      ["¿Te entristecen las guerras?", "Mide sensibilidad humana."],
      ["¿Sentís responsabilidad colectiva?", "Mide conciencia social."],
      ["¿Te importa lo que pasa lejos?", "Mide humanidad expandida."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular?", "Mide presencia real."],
      ["¿La pantalla te absorbe?", "Mide dependencia digital."],
      ["¿Escuchás sin mirar el teléfono?", "Mide atención humana."],
      ["¿Elegís contacto real?", "Mide prioridad humana."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia interna?", "Mide alineación."],
      ["¿Te observás sin juzgar?", "Mide conciencia."],
      ["¿Asumís tu impacto?", "Mide responsabilidad."],
      ["¿Sentís evolución humana?", "Mide integración."]
    ]
  }
];

/* =========================
   ESTADO
========================= */
let v2State = JSON.parse(localStorage.getItem(V2_STORAGE)) || {
  week: 0,
  scores: [],
  lastDate: null
};

let qIndex = 0;
let weekScore = 0;

/* =========================
   INICIO
========================= */
function startV2Monthly() {
  if (!DEV_MODE && !canAccessWeek()) return;
  qIndex = 0;
  weekScore = 0;
  showSection("v2-monthly");
  loadQuestion();
  updateThermo();
}

/* =========================
   PREGUNTAS
========================= */
function loadQuestion() {
  const w = V2_WEEKS[v2State.week];
  document.getElementById("v2-week-title").innerText = w.title;
  document.getElementById("v2-question").innerText = w.questions[qIndex][0];
  document.getElementById("v2-note").innerText = w.questions[qIndex][1];
}

function v2Answer(v) {
  weekScore += v;
  qIndex++;
  updateThermo();

  if (qIndex >= 4) finishWeek();
  else loadQuestion();
}

/* =========================
   FIN SEMANA
========================= */
function finishWeek() {
  v2State.scores.push(weekScore / 4);
  v2State.week++;
  v2State.lastDate = Date.now();
  localStorage.setItem(V2_STORAGE, JSON.stringify(v2State));

  if (v2State.week >= V2_WEEKS.length) showMonthlyResult();
  else showSection("start");
}

/* =========================
   RESULTADO FINAL
========================= */
function showMonthlyResult() {
  showSection("v2-result");

  const avg =
    v2State.scores.reduce((a,b)=>a+b,0) / v2State.scores.length;

  let symbol = "🐞";
  let text = "Humanidad estable.";
  let advice = "Pequeños actos conscientes pueden impulsarte.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Humanidad retraída.";
    advice = "Detenerte y observar puede ayudarte.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Humanidad en expansión.";
    advice = "Sostener esta coherencia fortalece tu camino.";
  }

  document.getElementById("v2-symbol").innerText = symbol;
  document.getElementById("v2-result-text").innerText = text;
  document.getElementById("v2-advice").innerText = advice;
}

/* =========================
   BLOQUEO
========================= */
function canAccessWeek() {
  if (v2State.week === 0) return true;
  const days =
    (Date.now() - v2State.lastDate) / (1000*60*60*24);
  return days >= V2_DELAY_DAYS;
}

/* =========================
   UI / NAVEGACIÓN
========================= */
function showSection(id) {
  ["start","v2-monthly","v2-result"].forEach(s=>{
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function updateThermo() {
  document.getElementById("v2-thermo-fill").style.width =
    (qIndex / 4) * 100 + "%";
}

function restart() {
  showSection("start");
}
