/* ===============================
   HUMANÓMETRO – JS VOLUMEN 2
   FLUJO FINAL CORREGIDO
================================ */

/* ===============================
   DATOS
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

/* ===============================
   ESTADO
================================ */
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

/* ===============================
   PREGUNTAS
================================ */
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
}

/* ===============================
   AVANZAR SEMANA
================================ */
function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) showMonthlyResult();
  else {
    show("test");
    loadQuestion();
  }
}

/* ===============================
   RESULTADO FINAL – TERMÓMETRO VIVO + DEVOLUCIÓN DIFERIDA
================================ */
function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  const fill = document.getElementById("monthlyFill");
  fill.style.transition = "none";
  fill.style.height = "0%";

  setTimeout(() => {
    fill.style.transition = "height 2.2s linear";
    fill.style.height = Math.round((avg / 2) * 100) + "%";
  }, 100);

  setTimeout(() => {
    let symbol = "🐞", text = "", advice = "";

    if (avg < 0.8) {
      symbol = "🦇";
      text = "Se observó una retracción en tu respuesta humana.";
      advice = "No como error, sino como señal de cansancio o desconexión.";
    } else if (avg < 1.5) {
      symbol = "🐞";
      text = "Tu humanidad se sostuvo, aunque de forma irregular.";
      advice = "La conciencia aparece cuando la recordás.";
    } else {
      symbol = "🐦";
      text = "Tu humanidad mostró coherencia y presencia.";
      advice = "Estás habitando tus decisiones con conciencia.";
    }

    document.getElementById("monthlySymbol").innerText = symbol;
    document.getElementById("monthlyText").innerText = text;
    document.getElementById("monthlyAdvice").innerText = advice;

  }, 2600);
}

/* ===============================
   DEVOLUCIÓN FINAL (NO “LECTURA MENSUAL”)
================================ */
function openMonthlyFull() {
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  let text = "";

  if (avg < 0.8) {
    text = `
Esta devolución refleja una baja en la sensibilidad sostenida.
No como juicio, sino como espejo.

La humanidad no se pierde:
se apaga cuando no se la cuida.
`;
  } else if (avg < 1.5) {
    text = `
Esta devolución muestra una humanidad activa,
aunque intermitente.

La conciencia aparece cuando la traés al presente.
`;
  } else {
    text = `
Esta devolución refleja coherencia interna
entre sentir, pensar y actuar.

No es perfección.
Es presencia.
`;
  }

  document.getElementById("monthlyFullText").innerText = text;
  show("monthlyFull");
}

/* ===============================
   ESPEJO (VOLUMEN 3)
================================ */
function goToMirror() {
  window.location.href = "./humanometro-espejo/";
}

/* ===============================
   TERMÓMETRO SEMANAL
================================ */
function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

/* ===============================
   NAVEGACIÓN
================================ */
function show(id) {
  ["start", "test", "weeklyResult", "monthlyResult", "monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}

/* ===============================
   BLOQUEO REAL 7 DÍAS
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function canAccessWeek(targetWeek) {
  if (targetWeek === 0) return true;

  const lastDone = localStorage.getItem("week_" + (targetWeek - 1) + "_done");
  if (!lastDone) return false;

  return Date.now() - parseInt(lastDone, 10) >= WEEK_MS;
}

const _originalShowWeeklyResult = showWeeklyResult;
showWeeklyResult = function () {
  localStorage.setItem("week_" + week + "_done", Date.now().toString());
  _originalShowWeeklyResult();
};

const _originalNextWeek = nextWeek;
nextWeek = function () {
  if (!canAccessWeek(week + 1)) {
    alert(
      "Este proceso es consecutivo.\n\n" +
      "Para medir tu humanidad de forma real,\n" +
      "necesitás vivir una semana de experiencias (7 días)."
    );
    restart();
    return;
  }
  _originalNextWeek();
};
