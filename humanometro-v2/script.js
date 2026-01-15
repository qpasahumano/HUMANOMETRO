const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afectó el sufrimiento ajeno?", "Empatía emocional"],
      ["¿Escuchaste con presencia?", "Atención consciente"],
      ["¿Evitaste reaccionar en automático?", "Autoregulación"],
      ["¿Sentiste conexión humana real?", "Vínculo"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Pudiste soltar la pantalla?", "Desapego digital"],
      ["¿Usaste la tecnología con conciencia?", "Uso consciente"],
      ["¿Priorizaste lo humano?", "Presencia"],
      ["¿Te sentiste absorbido?", "Equilibrio"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hubo coherencia entre sentir y hacer?", "Congruencia"],
      ["¿Te observaste sin juzgar?", "Autoconciencia"],
      ["¿Asumiste tu impacto?", "Responsabilidad"],
      ["¿Sentís evolución interna?", "Integración"]
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
  weeklyScores.push(currentScore / 4);
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) showFinalResult();
  else loadQuestion();
}

function showFinalResult() {
  show("monthlyResult");

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 300);

  let symbol = "🐞";
  let text = "";
  let advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad apareció de forma intermitente.";
    advice = "No como falla, sino como señal de cansancio o desconexión.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad estuvo presente con altibajos.";
    advice = "La conciencia aparece cuando la recordás.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad se expresó con coherencia.";
    advice = "Sostenerla requiere cuidado y pausa.";
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
  ["start", "test", "monthlyResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ✅ BOTÓN ESPEJO – SIN 404 */
function goToMirror() {
  window.location.href = "../volumen_3/index.html";
    }
