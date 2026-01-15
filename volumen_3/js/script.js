const QUESTIONS = [
  "¿Sentís coherencia entre lo que mostrás y lo que sos?",
  "¿Actuás igual cuando nadie te observa?",
  "¿Sostenés tus valores incluso cuando incomodan?",
  "¿Reconocés cuándo traicionás lo que sentís?",
  "¿Escuchás tus emociones o las evadís?",
  "¿Te hacés responsable de tu impacto en otros?",
  "¿Vivís desde elección o desde reacción?",
  "¿Te sentís en paz con la persona que sos hoy?"
];

let index = 0;

function startMirror() {
  index = 0;
  show("question");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("questionText").innerText = QUESTIONS[index];
}

function answer() {
  index++;
  if (index >= QUESTIONS.length) showResult();
  else loadQuestion();
}

function showResult() {
  show("result");
  document.getElementById("finalText").innerText =
    "Este espejo no devuelve respuestas.\nDevuelve conciencia.\n\nLo que viste no es un resultado,\nes un reflejo del momento que estás habitando.\n\nLa congruencia no se mide.\nSe siente.";
}

function closeMirror() {
  window.location.href = "../";
}

function show(id) {
  ["start","question","result"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
