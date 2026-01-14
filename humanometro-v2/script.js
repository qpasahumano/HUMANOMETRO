const WEEKS = [
  {
    title: "Integración humana",
    questions: [
      ["¿Observaste tus reacciones antes de actuar?", "Conciencia emocional"],
      ["¿Fuiste coherente entre lo que sentiste y lo que hiciste?", "Coherencia interna"],
      ["¿Asumiste responsabilidad por tu impacto?", "Responsabilidad humana"],
      ["¿Sentís que algo cambió en vos esta semana?", "Integración"]
    ]
  }
];

let q = 0;
let score = 0;

function startV2() {
  q = 0;
  score = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("weekTitle").innerText = WEEKS[0].title;
  document.getElementById("questionText").innerText = WEEKS[0].questions[q][0];
  document.getElementById("questionMeasure").innerText = WEEKS[0].questions[q][1];
  updateThermo();
}

function answer(v) {
  score += v;
  q++;
  updateThermo();

  if (q >= WEEKS[0].questions.length) {
    showFinal();
  } else {
    loadQuestion();
  }
}

function updateThermo() {
  document.getElementById("thermoFill").style.height =
    Math.round((q / 4) * 100) + "%";
}

function showFinal() {
  show("finalResult");

  let thermo = document.getElementById("finalThermo");
  thermo.style.height = "0%";

  setTimeout(() => thermo.style.height = "100%", 50);

  setTimeout(() => {
    document.getElementById("shortFeedback").innerText =
      score < 4
        ? "Hubo desconexión esta semana."
        : score < 7
        ? "Tu humanidad estuvo presente."
        : "Tu humanidad se expresó con claridad.";
  }, 2000);

  setTimeout(() => {
    document.getElementById("fullFeedback").innerText =
      "Esta devolución integra lo observado en esta etapa del proceso. No es un cierre, es un puente.";
  }, 3500);
}

function goToMirror() {
  window.location.href = "./humanometro-v3/";
}

function show(id) {
  ["start","test","finalResult"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
