/* ===============================
   CONFIGURACIÓN DESARROLLADOR
================================ */
// 🔓 SOLO PARA VOS – desactivar cuando lances la app
const DEV_MODE = true;

/* ===============================
   DATOS DEL VOLUMEN 2
================================ */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Mide empatía global."],
      ["Cuando alguien te habla, ¿dejás el celular?", "Mide presencia humana."],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Mide compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Mide sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Mide uso consciente."],
      ["¿Controlás el tiempo en pantallas?", "Mide autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Mide empatía digital."],
      ["¿La tecnología acompaña sin absorberte?", "Mide equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Mide alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Mide autoconciencia."],
      ["¿Asumís tu impacto en otros?", "Mide responsabilidad."],
      ["¿Sentís que tu humanidad evolucionó?", "Mide integración global."]
    ]
  }
];

let week = 0;
let q = 0;
let weeklyScores = [];
let currentScore = 0;

/* ===============================
   INICIO
================================ */
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
  document.getElementById("questionMeasure").innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();

  if (q >= 4) showWeeklyResult();
  else loadQuestion();
}

/* ===============================
   RESULTADO SEMANAL
================================ */
function showWeeklyResult() {
  show("weeklyResult");

  const avg = currentScore / 4;
  let symbol = "🐞", text = "", advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Esta semana mostró una desconexión humana.";
    advice = "Detenerte y observar puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños gestos conscientes pueden impulsarte.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta coherencia fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  weeklyScores.push(avg);
  saveWeekProgress();
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

/* ===============================
   RESULTADO MENSUAL
================================ */
function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 500);
}

/* ===============================
   ENGANCHE → VOLUMEN 3 (ESPEJO)
================================ */
function goToMirrorV3() {
  window.location.href = "./humanometro-v3/";
}

/* ===============================
   BLOQUEO SEMANAL (REAL)
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function saveWeekProgress() {
  localStorage.setItem("week_" + week + "_done", Date.now().toString());
}

function canAccessWeek(targetWeek) {
  if (DEV_MODE) return true; // 🔓 DESBLOQUEO PARA VOS

  if (targetWeek === 0) return true;

  const lastDone = localStorage.getItem("week_" + (targetWeek - 1) + "_done");
  if (!lastDone) return false;

  const diff = Date.now() - parseInt(lastDone, 10);
  return diff >= WEEK_MS;
}

/* ===============================
   UTILIDADES
================================ */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
