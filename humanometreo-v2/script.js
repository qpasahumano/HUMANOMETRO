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
  updateThermo();
}

function loadQuestion() {
  document.getElementById("title").innerText = "Pregunta " + (index + 1);
  document.getElementById("question").innerText = QUESTIONS[index];
}

function answer(value) {
  score += value;
  index++;
  updateThermo();

  if (index >= QUESTIONS.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function showResult() {
  show("result");
  const avg = score / QUESTIONS.length;

  let text = "Humanidad estable esta semana.";
  if (avg < 0.8) text = "Tu humanidad estuvo baja esta semana.";
  else if (avg < 1.5) text = "Tu humanidad se mantuvo estable.";
  else text = "Tu humanidad mostró crecimiento.";

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

function updateThermo() {
  const pct = (index / QUESTIONS.length) * 100;
  document.getElementById("thermoFill").style.width = pct + "%";
}
