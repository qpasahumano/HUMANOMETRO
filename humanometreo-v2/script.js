/* ===============================
   CONFIGURACIÓN
================================ */
const DEV_MODE = true; // ⚠️ CAMBIAR A false AL PUBLICAR

const WEEK_DELAY_DAYS = 7;
const STORAGE_KEY = "humanometro_v2_state";

/* ===============================
   SEMANAS
================================ */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      { q:"Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", n:"Mide empatía global." },
      { q:"Cuando alguien te habla, ¿le prestás atención sin mirar el celular?", n:"Mide presencia humana." },
      { q:"¿Sentís impulso de involucrarte ante una injusticia?", n:"Mide compromiso humano." },
      { q:"¿Te afecta el sufrimiento ajeno?", n:"Mide sensibilidad emocional." }
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      { q:"¿Podés dejar el celular cuando compartís con otros?", n:"Mide uso consciente." },
      { q:"¿Controlás el tiempo que pasás en pantallas?", n:"Mide autocontrol digital." },
      { q:"¿Recordás que hay personas reales detrás de una pantalla?", n:"Mide empatía digital." },
      { q:"¿La tecnología te acompaña sin absorberte?", n:"Mide equilibrio tecnológico." }
    ]
  },
  {
    title: "Integración humana",
    questions: [
      { q:"¿Sentís coherencia entre lo que pensás y hacés?", n:"Mide alineación interna." },
      { q:"¿Podés observarte sin juzgarte?", n:"Mide autoconciencia." },
      { q:"¿Te sentís responsable de tu impacto?", n:"Mide madurez humana." },
      { q:"¿Sentís que tu humanidad evolucionó este mes?", n:"Mide integración global." }
    ]
  }
];

/* ===============================
   ESTADO
================================ */
let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  weekIndex: 0,
  lastDate: null,
  scores: []
};

let qIndex = 0;
let weekScores = [];

/* ===============================
   INICIO
================================ */
function startV2() {
  if (!DEV_MODE && !canAccessWeek()) {
    alert("Este bloque se habilita cuando corresponda.");
    return;
  }
  qIndex = 0;
  weekScores = [];
  showSection("week");
  loadQuestion();
}

/* ===============================
   PREGUNTAS
================================ */
function loadQuestion() {
  const w = WEEKS[state.weekIndex];
  const q = w.questions[qIndex];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = q.q;
  document.getElementById("questionNote").innerText = q.n;
}

function answer(v) {
  weekScores.push(v);
  qIndex++;
  updateThermo();

  if (qIndex >= WEEKS[state.weekIndex].questions.length) {
    showWeeklyResult();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADO SEMANAL
================================ */
function showWeeklyResult() {
  const avg = weekScores.reduce((a,b)=>a+b,0) / weekScores.length;

  let animal, text, advice;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Tu humanidad mostró señales de repliegue.";
    advice = "Observar sin huir puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños actos conscientes pueden impulsarte.";
  } else {
    animal = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta apertura fortalece tu coherencia.";
  }

  document.getElementById("animalSymbol").innerText = animal;
  document.getElementById("resultText").innerText = text;
  document.getElementById("resultAdvice").innerText = advice;

  saveWeek(avg);
  showSection("result");
}

/* ===============================
   CONTINUIDAD
================================ */
function continueFlow() {
  state.weekIndex++;

  if (state.weekIndex >= WEEKS.length) {
    showMonthlyResult();
    return;
  }

  if (!DEV_MODE) state.lastDate = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  showSection("start");
}

/* ===============================
   RESULTADO MENSUAL
================================ */
function showMonthlyResult() {
  showSection("monthly");

  const avg = state.scores.reduce((a,b)=>a+b,0) / state.scores.length;
  document.getElementById("monthlyFill").style.height = Math.round((avg/2)*100) + "%";

  setTimeout(()=>{
    document.getElementById("monthlyText").innerText =
      avg < 0.8 ? "Tu humanidad necesita pausa y revisión."
      : avg < 1.5 ? "Tu humanidad estuvo activa, aunque inestable."
      : "Tu humanidad mostró integración y crecimiento.";
  }, 3000);
}

/* ===============================
   BLOQUEO
================================ */
function canAccessWeek() {
  if (state.weekIndex === 0) return true;
  if (!state.lastDate) return true;
  const diff = (Date.now() - state.lastDate) / (1000*60*60*24);
  return diff >= WEEK_DELAY_DAYS;
}

function saveWeek(score) {
  state.scores.push(score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ===============================
   UI
================================ */
function showSection(id) {
  ["start","week","result","monthly"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function updateThermo() {
  const pct = (weekScores.length / WEEKS[state.weekIndex].questions.length) * 100;
  document.getElementById("thermoFill").style.width = pct + "%";
}
