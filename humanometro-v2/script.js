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

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 500);

  setTimeout(() => {
    let symbol = "🐞", text = "", advice = "";

    if (avg < 0.8) {
      symbol = "🦇";
      text = "Tu humanidad estuvo retraída en estos días.";
      advice = "Pausar y observar puede reactivar tu sensibilidad.";
    } else if (avg < 1.5) {
      symbol = "🐞";
      text = "Tu humanidad se mantuvo estable en estos días.";
      advice = "Pequeños cambios conscientes pueden impulsarte.";
    } else {
      symbol = "🐦";
      text = "Tu humanidad está en expansión.";
      advice = "Sostener esta coherencia fortalece tu humanidad.";
    }

    document.getElementById("monthlySymbol").innerText = symbol;
    document.getElementById("monthlyText").innerText = text;
    document.getElementById("monthlyAdvice").innerText = advice;
  }, 3500);
}

function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

function show(id) {
  ["start", "test", "weeklyResult", "monthlyResult", "monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}

/* ===============================
   👉 BOTÓN DEFINITIVO: VERTE AL ESPEJO
   =============================== */
function goToMirror() {
  window.location.href = "./volumen3/index.html";
      }
/* ===============================
   BLOQUE ESPEJO – CONTINUIDAD V2
================================ */

const MIRROR_QUESTIONS = [
  "¿Fuiste coherente entre lo que sentiste y lo que hiciste?",
  "¿Reconociste tus emociones sin reprimirlas?",
  "¿Sostuviste empatía aun cuando fue incómodo?",
  "¿Evitaste reaccionar de forma automática?",
  "¿Pudiste observarte sin juzgarte?",
  "¿Te hiciste cargo de tu impacto emocional?",
  "¿Sentís continuidad entre tus semanas?",
  "¿Tu humanidad se sostuvo en el tiempo?"
];

let mirrorIndex = 0;
let mirrorScores = [];

/* BOTÓN DESDE VOLUMEN 2 */
function openMirror() {
  mirrorIndex = 0;
  mirrorScores = [];
  document.getElementById("mirrorThermoFill").style.height = "0%";
  show("mirror");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  document.getElementById("mirrorQuestion").innerText =
    MIRROR_QUESTIONS[mirrorIndex];
}

function mirrorAnswer(v) {
  mirrorScores.push(v);
  mirrorIndex++;

  document.getElementById("mirrorThermoFill").style.height =
    Math.round((mirrorScores.length / MIRROR_QUESTIONS.length) * 100) + "%";

  if (mirrorIndex >= MIRROR_QUESTIONS.length) {
    showMirrorResult();
  } else {
    loadMirrorQuestion();
  }
}

function showMirrorResult() {
  show("mirrorResult");

  const avg =
    mirrorScores.reduce((a, b) => a + b, 0) / mirrorScores.length;

  const thermo = document.getElementById("finalMirrorThermo");
  thermo.style.height = Math.round((avg / 2) * 100) + "%";

  let text = "";

  if (avg < 0.8) {
    text =
      "El espejo refleja una incongruencia sostenida.\n\n" +
      "No como juicio, sino como señal de desconexión entre lo que sentís y lo que hacés.\n\n" +
      "La conciencia comienza cuando el reflejo deja de ser cómodo.";
  } else if (avg < 1.5) {
    text =
      "El reflejo muestra una humanidad presente pero inestable.\n\n" +
      "Hay momentos de conciencia y otros de automatismo.\n\n" +
      "Sostener la observación puede integrar tu coherencia.";
  } else {
    text =
      "El espejo refleja congruencia humana sostenida.\n\n" +
      "Tu sensibilidad, acción y conciencia se alinean en el tiempo.\n\n" +
      "La humanidad se vuelve visible cuando se la habita.";
  }

  document.getElementById("mirrorFinalText").innerText = text;
    }
