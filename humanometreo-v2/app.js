/* ===============================
   ESTADO GENERAL
================================ */
let currentWeek = 1;
let questionIndex = 0;
let answers = [];

const STORAGE_KEY = "humanometro_v2";

/* ===============================
   BLOQUES SEMANALES
================================ */
const WEEKS = {
  1: {
    title: "Vos ante el mundo",
    questions: [
      { q: "Cuando ves noticias de conflictos o guerras, ¿te genera tristeza?", n: "Mide sensibilidad y empatía global." },
      { q: "Cuando alguien te habla, ¿mirás a los ojos sin distraerte con el celular?", n: "Mide presencia humana real." },
      { q: "¿Sentís impulso de involucrarte cuando ves una injusticia?", n: "Mide compromiso humano." },
      { q: "¿Te afecta emocionalmente el sufrimiento ajeno?", n: "Mide apertura emocional." }
    ]
  }
};

/* ===============================
   INICIO
================================ */
function startWeek(week) {
  if (!canAccessWeek(week)) {
    alert("Este bloque se habilita cuando corresponde.");
    return;
  }
  currentWeek = week;
  questionIndex = 0;
  answers = [];
  showSection("test");
  loadQuestion();
}

/* ===============================
   PREGUNTAS
================================ */
function loadQuestion() {
  const q = WEEKS[currentWeek].questions[questionIndex];
  document.getElementById("weekTitle").innerText = WEEKS[currentWeek].title;
  document.getElementById("questionText").innerText = q.q;
  document.getElementById("questionNote").innerText = q.n;
}

function answer(value) {
  answers.push(value);
  questionIndex++;
  updateThermo();

  if (questionIndex >= WEEKS[currentWeek].questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADO
================================ */
function showResult() {
  const avg = answers.reduce((a,b)=>a+b,0) / answers.length;

  let text, advice, animal, color;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Tu humanidad está en repliegue.";
    advice = "Volver a registrar al otro puede reactivar tu sensibilidad.";
    color = "0%";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantiene estable.";
    advice = "Pequeños actos conscientes pueden impulsarte.";
    color = "50%";
  } else {
    animal = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta apertura fortalece tu coherencia.";
    color = "100%";
  }

  document.getElementById("animalSymbol").innerText = animal;
  document.getElementById("resultText").innerText = text;
  document.getElementById("resultAdvice").innerText = advice;
  document.getElementById("thermoFill").style.height = color;

  saveWeek();
  showSection("result");
}

/* ===============================
   BLOQUEO SEMANAL
================================ */
function saveWeek() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  data[currentWeek] = {
    date: Date.now(),
    done: true
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function canAccessWeek(week) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  if (week === 1) return true;
  if (!data[week-1]) return false;

  const lastDate = data[week-1].date;
  const diffDays = (Date.now() - lastDate) / (1000*60*60*24);
  return diffDays >= 7;
}

/* ===============================
   NAVEGACIÓN
================================ */
function continueFlow() {
  showSection("start");
}

function showSection(id) {
  ["start","test","result"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function updateThermo() {
  const pct = (answers.length / WEEKS[currentWeek].questions.length) * 100;
  document.getElementById("thermoFill").style.height = pct + "%";
}
