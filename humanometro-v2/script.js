/* ===============================
   DATOS
================================ */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Empatía global."],
      ["Cuando alguien te habla, ¿dejás el celular?", "Presencia humana."],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Uso consciente."],
      ["¿Controlás el tiempo en pantallas?", "Autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Empatía digital."],
      ["¿La tecnología acompaña sin absorberte?", "Equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia."],
      ["¿Asumís tu impacto en otros?", "Responsabilidad."],
      ["¿Sentís que tu humanidad evolucionó?", "Integración global."]
    ]
  }
];

/* ===============================
   VARIABLES
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

  if (q >= 4) {
    showWeeklyResult();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADO SEMANAL
================================ */
function showWeeklyResult() {
  show("weeklyResult");

  const avg
