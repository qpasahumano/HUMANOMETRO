const QUESTIONS = [
  "En estos días, ¿sentiste enojo que influyó en tu forma de actuar?",
  "¿Sentiste tristeza que condicionó decisiones o energía?",
  "¿Sentiste miedo que te frenó?",
  "¿Apareció culpa no resuelta?",
  "¿Hubo ansiedad que llevó a automatismo?",
  "¿Indiferencia o desconexión emocional?",
  "¿Alegría coherente con lo vivido?",
  "¿Alguna emoción dominante evitada?"
];

let q = 0;
let score = 0;
let count = 0;

function answerMirror(v) {
  if (v !== null) {
    score += v;
    count++;
  }
  q++;

  if (q >= QUESTIONS.length) {
    showFinalGauge();
  } else {
    loadQuestion();
  }
}

function loadQuestion() {
  document.getElementById("mirrorQuestion").innerText = QUESTIONS[q];
}

loadQuestion();

/* ================= TERMÓMETRO FINAL ================= */

function showFinalGauge() {
  document.getElementById("mirrorTest").classList.add("hidden");
  document.getElementById("finalGauge").classList.remove("hidden");

  const fill = document.getElementById("finalFill");
  const avg = count ? score / count : 0;
  const target = Math.min(100, Math.round((avg / 3) * 100));

  let start = null;
  function animate(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / 3000, 1);
    fill.style.height = (progress * target) + "%";

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(showFinalReading, 1000);
    }
  }
  requestAnimationFrame(animate);
}

function showFinalReading() {
  document.getElementById("finalGauge").classList.add("hidden");
  document.getElementById("finalReading").classList.remove("hidden");
  updateHint();
}

function updateHint() {
  const content = document.querySelector(".sheet-content");
  const hint = document.getElementById("sheetHint");
  if (content.scrollHeight > content.clientHeight) {
    hint.style.opacity = "1";
  }
}
