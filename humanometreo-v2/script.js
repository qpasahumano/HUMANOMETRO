const QUESTIONS = [
  "¿Te afectó emocionalmente alguna noticia reciente?",
  "¿Escuchaste con atención a alguien esta semana?",
  "¿Actuaste con empatía ante una situación difícil?",
  "¿Sentís coherencia entre lo que pensás y hacés?"
];

let index = 0;
let score = 0;

function startTest() {
  index = 0;
  score = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("title").innerText = "Pregunta " + (index + 1);
  document.getElementById("question").innerText = QUESTIONS[index];
}

function answer(value) {
  score += value;
  index++;

  if (index >= QUESTIONS.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function showResult() {
  show("result");
  const avg = score / QUESTIONS.length;

  let text = "Resultado neutro.";
  if (avg < 0.8) text = "Humanidad baja esta semana.";
  else if (avg < 1.5) text = "Humanidad estable esta semana.";
  else text = "Humanidad en crecimiento.";

  document.getElementById("resultText").innerText = text;
}

function restart() {
  show("start");
}

function show(id) {
  ["start","test","result"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
