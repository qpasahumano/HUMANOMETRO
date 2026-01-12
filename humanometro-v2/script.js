/* CONFIG */
const DEV_MODE = true; // cambiar a false al publicar
const DELAY_DAYS = 7;
const STORAGE = "humanometro_v2";

/* PREGUNTAS (CONGELADAS) */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras u conflictos, ¿te genera tristeza?", "Mide empatía global."],
      ["Cuando alguien te habla, ¿le prestás atención sin mirar el celular?", "Mide presencia humana."],
      ["¿Sentís impulso de involucrarte ante una injusticia?", "Mide compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Mide sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés dejar el celular cuando compartís con otros?", "Mide uso consciente."],
      ["¿Controlás el tiempo que pasás en pantallas?", "Mide autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Mide empatía digital."],
      ["¿La tecnología te acompaña sin absorberte?", "Mide equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Sentís coherencia entre lo que pensás y hacés?", "Mide alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Mide autoconciencia."],
      ["¿Te sentís responsable de tu impacto?", "Mide madurez humana."],
      ["¿Sentís que tu humanidad evolucionó este mes?", "Mide integración global."]
    ]
  }
];

/* ESTADO */
let state = JSON.parse(localStorage.getItem(STORAGE)) || {
  week: 0,
  scores: [],
  lastDate: null
};

let qIndex = 0;
let weekScore = 0;

/* INICIO */
function startV2() {
  if (!DEV_MODE && !canAccess()) return alert("Bloque aún no habilitado.");
  qIndex = 0;
  weekScore = 0;
  show("week");
  loadQuestion();
}

/* PREGUNTAS */
function loadQuestion() {
  const w = WEEKS[state.week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[qIndex][0];
  document.getElementById("questionNote").innerText = w.questions[qIndex][1];
}

function answer(v) {
  weekScore += v;
  qIndex++;
  document.getElementById("thermoFill").style.width = (qIndex / 4) * 100 + "%";

  if (qIndex >= 4) showWeeklyResult();
  else loadQuestion();
}

/* RESULTADO SEMANAL */
function showWeeklyResult() {
  const avg = weekScore / 4;
  let animal, text, advice;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Tu humanidad mostró un repliegue esta semana.";
    advice = "Detenerte y observar puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños actos conscientes pueden impulsarte.";
  } else {
    animal = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta apertura fortalece tu coherencia.";
  }

  document.getElementById("animal").innerText = animal;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  state.scores.push(avg);
  state.lastDate = Date.now();
  localStorage.setItem(STORAGE, JSON.stringify(state));

  show("weeklyResult");
}

/* CONTINUIDAD */
function continueFlow() {
  state.week++;
  localStorage.setItem(STORAGE, JSON.stringify(state));

  if (state.week >= WEEKS.length) showMonthlyResult();
  else show("start");
}

/* RESULTADO MENSUAL */
function showMonthlyResult() {
  show("monthlyResult");

  const avg = state.scores.reduce((a,b)=>a+b,0) / state.scores.length;
  document.getElementById("monthlyFill").style.height = Math.round((avg/2)*100) + "%";

  setTimeout(()=>{
    document.getElementById("monthlyText").innerText =
      avg < 0.8 ? "Tu humanidad necesita pausa y revisión."
      : avg < 1.5 ? "Tu humanidad estuvo activa, aunque inestable."
      : "Tu humanidad mostró integración y crecimiento.";
  }, 3000);
}

/* BLOQUEO */
function canAccess() {
  if (state.week === 0) return true;
  if (!state.lastDate) return true;
  const days = (Date.now() - state.lastDate) / (1000*60*60*24);
  return days >= DELAY_DAYS;
}

/* UI */
function show(id) {
  ["start","week","weeklyResult","monthlyResult"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
       }
