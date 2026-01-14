/* ===============================
   CONFIG
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* ===============================
   DATA
================================ */
const WEEKS = [
  { title: "Primera semana", questions: ["Pregunta 1", "Pregunta 2", "Pregunta 3"] },
  { title: "Segunda semana", questions: ["Pregunta 1", "Pregunta 2", "Pregunta 3"] },
  { title: "Tercera semana", questions: ["Pregunta 1", "Pregunta 2", "Pregunta 3"] }
];

let week = 0;
let q = 0;

/* ===============================
   INICIO
================================ */
function startV2() {
  week = 0;
  q = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("weekTitle").innerText = WEEKS[week].title;
  document.getElementById("questionText").innerText =
    WEEKS[week].questions[q];
}

/* ===============================
   RESPUESTAS
================================ */
function answer() {
  q++;
  if (q >= WEEKS[week].questions.length) {
    saveWeek();
  } else {
    loadQuestion();
  }
}

/* ===============================
   GUARDADO AUTOMÁTICO
================================ */
function saveWeek() {
  localStorage.setItem(
    "week_" + week + "_done",
    Date.now().toString()
  );

  alert("✔ Análisis guardado (local)");

  show("weeklyResult");
}

/* ===============================
   AVANCE CON BLOQUEO
================================ */
function nextWeek() {
  const lastDone = localStorage.getItem("week_" + week + "_done");
  if (!lastDone) return;

  const diff = Date.now() - Number(lastDone);
  if (diff < WEEK_MS) {
    alert(
      "Este proceso es consecutivo.\n\n" +
      "Viví una semana de experiencias antes de continuar."
    );
    return;
  }

  week++;
  q = 0;

  if (week >= WEEKS.length) {
    show("monthlyResult");
  } else {
    show("test");
    loadQuestion();
  }
}

/* ===============================
   UI
================================ */
function show(id) {
  ["start","test","weeklyResult","monthlyResult","monthlyFull"]
    .forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.add("hidden");
    });

  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
}
