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
  weeklyScores.push(avg);

  let symbol = "🐞", text = "", advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Semana con desconexión humana.";
    advice = "Observar tus reacciones puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Humanidad estable esta semana.";
    advice = "Pequeños gestos conscientes pueden fortalecerla.";
  } else {
    symbol = "🐦";
    text = "Humanidad en crecimiento.";
    advice = "Sostener esta coherencia fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  localStorage.setItem("week_" + week + "_done", Date.now().toString());
}

function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) {
    showFinalResult();
  } else {
    show("test");
    loadQuestion();
  }
}

function showFinalResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  document.getElementById("monthlyFill").style.height =
    Math.round((avg / 2) * 100) + "%";

  let text = "", advice = "", symbol = "🐞";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad estuvo retraída.";
    advice = "No como error, sino como mensaje.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Humanidad presente pero inestable.";
    advice = "La conciencia sostenida puede estabilizarla.";
  } else {
    symbol = "🐦";
    text = "Humanidad integrada y consciente.";
    advice = "Coherencia entre sentir, pensar y actuar.";
  }

  document.getElementById("monthlySymbol").innerText = symbol;
  document.getElementById("monthlyText").innerText = text;
  document.getElementById("monthlyAdvice").innerText = advice;
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
  show("monthlyFull");
}
