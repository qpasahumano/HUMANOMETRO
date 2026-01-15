const QUESTIONS = [
  "¿Sentís coherencia entre lo que pensás y lo que hacés últimamente?",
  "¿Tus decisiones reflejan lo que decís valorar?",
  "¿Pudiste sostener tu humanidad incluso en tensión?",
  "¿Te reconocés en la forma en que actuaste estos días?",
  "¿Sentís claridad o confusión interna?",
  "¿Escuchaste tus límites?",
  "¿Hubo congruencia emocional?",
  "¿Sentís evolución respecto al inicio del proceso?"
];

let i = 0;
let score = 0;

function startMirror() {
  i = 0;
  score = 0;
  show("mirrorTest");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("mirrorTitle").innerText =
    `Pregunta ${i + 1} de ${QUESTIONS.length}`;
  document.getElementById("mirrorQuestion").innerText = QUESTIONS[i];
}

function answerMirror(v) {
  score += v;
  i++;

  if (i >= QUESTIONS.length) showResult();
  else loadQuestion();
}

function showResult() {
  show("mirrorResult");

  const avg = score / QUESTIONS.length;

  let text = "";
  let visual = "";

  if (avg < 0.8) {
    visual = "⬛";
    text = "El reflejo muestra desconexión y opacidad interna.";
  } else if (avg < 1.5) {
    visual = "⬜";
    text = "El reflejo es intermedio. Hay conciencia, pero inestable.";
  } else {
    visual = "✨";
    text = "El reflejo es claro. Existe coherencia y alineación.";
  }

  document.getElementById("mirrorVisual").innerText = visual;
  document.getElementById("mirrorText").innerText = text;
}

function show(id) {
  ["mirrorStart","mirrorTest","mirrorResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("mirrorStart");
}
