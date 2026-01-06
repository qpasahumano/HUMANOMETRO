const questions = [
  "¿Escuchás a una persona sin mirar el celular?",
  "¿Sentís empatía por el dolor ajeno?",
  "¿Ayudás sin esperar algo a cambio?",
  "¿Te detenés a reflexionar antes de reaccionar?",
  "¿Priorizás vínculos reales sobre lo digital?",
  "¿Respetás opiniones distintas a la tuya?"
];

let currentQuestion = 0;
let score = 0;
let maxScore = questions.length * 3;

const questionText = document.getElementById("question-text");
const thermoFill = document.getElementById("thermo-fill");

function showQuestion() {
  questionText.textContent = questions[currentQuestion];
}

function updateThermo() {
  const percent = (score / maxScore) * 100;
  thermoFill.style.width = percent + "%";
}

function answer(value) {
  score += value;
  currentQuestion++;

  updateThermo();

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionText.innerHTML = `
    <strong>Resultado final</strong><br><br>
    Tu nivel de humanidad se expresó en tus decisiones.<br>
    Reflexioná sobre tus elecciones.
  `;
}

showQuestion();
updateThermo();
