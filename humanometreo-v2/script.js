const DEV_MODE = true;
const WEEK_DELAY_DAYS = 7;
const STORAGE_KEY = "humanometro_v2_state";

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
      { q:"¿Controlás el tiempo frente a pantallas?", n:"Mide autocontrol digital." },
      { q:"¿Recordás que hay personas detrás de cada pantalla?", n:"Mide empatía digital." },
      { q:"¿La tecnología acompaña sin absorberte?", n:"Mide equilibrio tecnológico." }
    ]
  },
  {
    title: "Integración humana",
    questions: [
      { q:"¿Sentís coherencia entre lo que pensás y hacés?", n:"Mide alineación interna." },
      { q:"¿Podés observarte sin juzgarte?", n:"Mide autoconciencia." },
      { q:"¿Te sentís responsable de tu impacto?", n:"Mide madurez humana." },
      { q:"¿Sentís evolución en tu humanidad este mes?", n:"Mide integración global." }
    ]
  }
];

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  weekIndex: 0,
  lastDate: null,
  scores: []
};

let qIndex = 0;
let weekScores = [];

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
  animateThermo();

  if (qIndex >= WEEKS[state.weekIndex].questions.length) {
    setTimeout(showWeeklyResult, 1200);
  } else {
    setTimeout(loadQuestion, 400);
  }
}

function animateThermo() {
  const pct = (weekScores.length / WEEKS[state.weekIndex].questions.length) * 100;
  document.getElementById("thermoFill").style.width = pct + "%";
}

function showWeeklyResult() {
  const avg = weekScores.reduce((a,b)=>a+b,0) / weekScores.length;

  let animal, text, advice, motivation;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Esta semana tu humanidad estuvo más cerrada.";
    advice = "Detenerte a registrar lo que evitás puede abrir un nuevo movimiento.";
    motivation = "Toda conciencia empieza por notar lo que hoy cuesta.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños gestos conscientes pueden generar grandes cambios.";
    motivation = "No subestimes lo simple: ahí vive la coherencia.";
  } else {
    animal = "🐦";
    text = "Tu humanidad mostró crecimiento.";
    advice = "Sostener esta apertura fortalece tu equilibrio interno.";
    motivation = "Cuando hay presencia, el camino se vuelve más liviano.";
  }

  document.getElementById("animalSymbol").innerText = animal;
  document.getElementById("resultText").innerText = text;
  document.getElementById("resultAdvice").innerText = advice;
  document.getElementById("resultMotivation").innerText = motivation;

  saveWeek(avg);
  showSection("result");
}

function continueFlow() {
  state.weekIndex++;
  if (!DEV_MODE) state.lastDate = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  if (state.weekIndex >= WEEKS.length) {
    showMonthlyResult();
  } else {
    showSection("start");
  }
}

function showMonthlyResult() {
  showSection("monthly");
  const avg = state.scores.reduce((a,b)=>a+b,0) / state.scores.length;
  document.getElementById("monthlyFill").style.height = Math.round((avg/2)*100) + "%";

  setTimeout(()=>{
    document.getElementById("monthlyText").innerText =
      avg < 0.8 ? "Este mes pide pausa y revisión."
      : avg < 1.5 ? "Tu humanidad estuvo activa, aunque fluctuante."
      : "Tu humanidad se expresó con coherencia y crecimiento.";
  }, 3000);
}

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

function showSection(id) {
  ["start","week","result","monthly"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}
