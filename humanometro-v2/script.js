/* ===============================
   CONFIGURACIÓN DESARROLLADOR
================================ */
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
  let symbol = "🐞", shortText = "", advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    shortText = "Esta semana mostró una desconexión humana.";
    advice = "Detenerte y observar puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    shortText = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños gestos conscientes pueden impulsarte.";
  } else {
    symbol = "🐦";
    shortText = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta coherencia fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = shortText;
  document.getElementById("weeklyAdvice").innerText = advice;

  weeklyScores.push(avg);
  saveWeekProgress();
}

/* ===============================
   RESULTADO FINAL → DEVOLUCIÓN
================================ */
function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  // Termómetro
  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 500);

  // DEVOLUCIÓN CORTA
  setTimeout(() => {
    let shortText = "";

    if (avg < 0.8)
      shortText = "Tu humanidad mostró una retracción este ciclo.";
    else if (avg < 1.5)
      shortText = "Tu humanidad se mantuvo activa con fluctuaciones.";
    else
      shortText = "Tu humanidad mostró integración y expansión.";

    document.getElementById("monthlyText").innerText = shortText;
  }, 1200);

  // DEVOLUCIÓN COMPLETA
  setTimeout(() => {
    document.getElementById("monthlyAdvice").innerText = buildFullDevolution(avg);
  }, 2500);
}

function buildFullDevolution(avg) {
  if (avg < 0.8) {
    return `
Esta devolución no señala un error, sino un estado.
Cuando la sensibilidad baja, suele ser señal de cansancio,
sobrecarga emocional o desconexión con lo que sentís.

Observar sin juzgar es el primer paso para volver a habitarte.
`;
  } else if (avg < 1.5) {
    return `
Este resultado muestra una humanidad presente,
aunque con oscilaciones entre conciencia y automatismo.

Pequeños actos cotidianos pueden estabilizar ese equilibrio.
`;
  } else {
    return `
Esta devolución refleja coherencia entre lo que sentís,
pensás y hacés.

No habla de perfección, sino de alineación consciente.
Sostenerla requiere cuidado y descanso.
`;
  }
}

/* ===============================
   ENGANCHE → VOLUMEN 3
================================ */
function goToMirrorV3() {
  window.location.href = "./humanometro-v3/";
}

/* ===============================
   BLOQUEO SEMANAL
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function saveWeekProgress() {
  localStorage.setItem("week_" + week + "_done", Date.now().toString());
}

function canAccessWeek(targetWeek) {
  if (DEV_MODE) return true;

  if (targetWeek === 0) return true;

  const lastDone = localStorage.getItem("week_" + (targetWeek - 1) + "_done");
  if (!lastDone) return false;

  return Date.now() - parseInt(lastDone, 10) >= WEEK_MS;
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
