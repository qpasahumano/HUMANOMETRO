
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

  if (week >= WEEKS.length) showMonthlyResult();
  else {
    show("test");
    loadQuestion();
  }
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg =
    weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 500);

  setTimeout(() => {
    let symbol="🐞", text="", advice="";

    if (avg < 0.8) {
      symbol="🦇";
      text="Tu humanidad estuvo retraída este mes.";
      advice="Pausar y observar puede reactivar tu sensibilidad.";
    } else if (avg < 1.5) {
      symbol="🐞";
      text="Tu humanidad se mantuvo estable.";
      advice="Pequeños cambios conscientes pueden impulsarte.";
    } else {
      symbol="🐦";
      text="Tu humanidad está en expansión.";
      advice="Sostener esta coherencia fortalece tu humanidad.";
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
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}

function openMonthlyFull() {
  const avg =
    weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  let text = "";

  if (avg < 0.8) {
    text = `
Este mes muestra una retracción de tu humanidad consciente.
No como un error, sino como un mensaje.

Cuando la sensibilidad baja, suele ser señal de cansancio,
sobrecarga emocional o desconexión con lo que sentís.

Revisar tus tiempos, tus vínculos y tus límites puede ser
el primer paso para volver a habitarte con más presencia.

La humanidad no se pierde: se apaga cuando no se la cuida.
`;
  } else if (avg < 1.5) {
    text = `
Tu humanidad se mantuvo activa, aunque de forma irregular.
Hubo momentos de presencia y otros de automatismo.

Este resultado habla de una conciencia en proceso,
que aparece cuando la recordás y se diluye cuando
las exigencias externas toman el mando.

Pequeños actos diarios —escuchar, pausar, sentir—
pueden estabilizar ese equilibrio interno.
`;
  } else {
    text = `
Este mes refleja una humanidad integrada y en expansión.
Tus respuestas muestran coherencia entre lo que sentís,
pensás y hacés.

No significa perfección, sino alineación.
Estás habitando tus decisiones con conciencia
y eso se traduce en impacto humano real.

Sostener esta apertura requiere cuidado,
porque la sensibilidad también necesita descanso.
`;
  }

  text += `
\n\nEste proceso es consecutivo.
Para medir tu humanidad de forma real,
necesitás vivir una semana de experiencias (siete días).

Cuando sientas que algo cambió en vos,
Humanómetro va a estar acá para volver a medirlo.
`;

  document.getElementById("monthlyFullText").innerText = text;
  show("monthlyFull");
}

/* 🔒 FUNCIÓN DEFINITIVA DEL BOTÓN VOLVER */
function goBack() {
  show("monthlyResult");
}
// ================================
// BLOQUEO SEMANAL REAL (7 DÍAS)
// ================================

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function canAccessWeek(targetWeek) {
  if (targetWeek === 0) return true;

  const lastDone = localStorage.getItem("week_" + (targetWeek - 1) + "_done");
  if (!lastDone) return false;

  const diff = Date.now() - parseInt(lastDone, 10);
  return diff >= WEEK_MS;
}

// Guardar cierre de semana
const _originalShowWeeklyResult = showWeeklyResult;
showWeeklyResult = function () {
  localStorage.setItem("week_" + week + "_done", Date.now().toString());
  _originalShowWeeklyResult();
};

// Bloquear avance si no pasaron 7 días
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
