/* ================= CACHE DOM ================= */

const weekTitle = document.getElementById("weekTitle");
const questionText = document.getElementById("questionText");
const questionMeasure = document.getElementById("questionMeasure");
const thermoFill = document.getElementById("thermoFill");

const weeklySymbol = document.getElementById("weeklySymbol");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");

const monthGaugeWrap = document.getElementById("monthGaugeWrap");
const monthTextWrap = document.getElementById("monthTextWrap");
const monthlyFill = document.getElementById("monthlyFill");
const monthlyLongText = document.getElementById("monthlyLongText");
const monthlyText = document.getElementById("monthlyText");

const mirrorEmoji = document.getElementById("mirrorEmoji");
const mirrorQuestion = document.getElementById("mirrorQuestion");
const mirrorGaugeWrap = document.getElementById("mirrorGaugeWrap");
const mirrorTextWrap = document.getElementById("mirrorTextWrap");
const mirrorFill = document.getElementById("mirrorFill");
const mirrorFullText = document.getElementById("mirrorFullText");

/* ================= VOLUMEN 2 ================= */

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Empatía global"],
      ["Cuando alguien te habla, ¿dejás el celular?", "Presencia humana"],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Compromiso humano"],
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad emocional"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Uso consciente"],
      ["¿Controlás el tiempo en pantallas?", "Autocontrol digital"],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Empatía digital"],
      ["¿La tecnología acompaña sin absorberte?", "Equilibrio tecnológico"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Coherencia"],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"],
      ["¿Sentís evolución humana?", "Integración"]
    ]
  }
];

let week = 0, q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2() {
  week = 0;
  q = 0;
  weeklyScores = [];
  currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  weekTitle.innerText = w.title;
  questionText.innerText = w.questions[q][0];
  questionMeasure.innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();
  if (q >= 4) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = currentScore / 4;
  weeklyScores.push(avg);

  if (avg < 0.8) {
    weeklySymbol.innerText = "🦇";
    weeklyText.innerText = "Desconexión entre emoción y acción.";
    weeklyAdvice.innerText = "Observar sin juicio ayuda a integrar.";
  } else if (avg < 1.5) {
    weeklySymbol.innerText = "🐞";
    weeklyText.innerText = "Presencia intermitente.";
    weeklyAdvice.innerText = "Sostener pequeños gestos consolida coherencia.";
  } else {
    weeklySymbol.innerText = "🐦";
    weeklyText.innerText = "Crecimiento sostenido.";
    weeklyAdvice.innerText = "La coherencia fortalece el proceso humano.";
  }
}

function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;
  if (week >= WEEKS.length) showMonthlyResult();
  else {
    show("test");
    loadQuestion();
  }
}

/* ================= TERMÓMETRO MENSUAL ================= */

function showMonthlyResult() {
  show("monthlyResult");
  monthTextWrap.classList.add("hidden");
  monthGaugeWrap.classList.remove("hidden");

  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  animateGauge(monthlyFill, Math.round((avg / 2) * 100), () => {
    setTimeout(() => {
      monthGaugeWrap.classList.add("hidden");
      monthTextWrap.classList.remove("hidden");

      monthlyLongText.innerText =
        "Este recorrido integró tus respuestas como un proceso continuo. " +
        "No midió hechos aislados, sino cómo habitaste tus emociones, " +
        "tus decisiones y su impacto en el entorno.";

      monthlyText.innerText =
        "La humanidad aparece cuando emoción, pensamiento y acción dialogan.";
    }, 2000);
  });
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  { t: "En estos días, ¿sentiste enojo que influyó en tu forma de actuar?", e: "angry" },
  { t: "¿Sentiste tristeza que condicionó decisiones o energía?", e: "sad" },
  { t: "¿Sentiste miedo que te frenó?", e: "fear" },
  { t: "¿Apareció culpa no resuelta?", e: "guilt" },
  { t: "¿Hubo ansiedad que llevó a automatismo?", e: "anx" },
  { t: "¿Indiferencia o desconexión emocional?", e: "flat" },
  { t: "¿Alegría coherente con lo vivido?", e: "joy" },
  { t: "¿Alguna emoción dominante evitada?", e: "q" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror() {
  show("mirrorIntro");
}

function startMirror() {
  mq = 0;
  mirrorScore = 0;
  mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  mirrorEmoji.className = "emoji3d float " + MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v) {
  if (v !== null) {
    mirrorScore += v;
    mirrorCount++;
  }
  mq++;
  if (mq >= MIRROR_QUESTIONS.length) showMirrorResult();
  else loadMirrorQuestion();
}

/* ================= TERMÓMETRO FINAL ================= */

function showMirrorResult() {
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");
  mirrorGaugeWrap.classList.remove("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  animateGauge(mirrorFill, Math.round((avg / 2) * 100), () => {
    setTimeout(() => {
      mirrorGaugeWrap.classList.add("hidden");
      mirrorTextWrap.classList.remove("hidden");

      mirrorFullText.innerText =
        "Esta lectura integra todo tu recorrido en Humanómetro. " +
        "Refleja cómo reconociste, sostuviste o evitaste tus emociones " +
        "y de qué modo influyeron en tus decisiones.\n\n" +
        "La humanidad no se pierde, pero se apaga cuando no se la habita conscientemente.";
    }, 3000);
  });
}

/* ================= UTILIDADES ================= */

function updateThermo() {
  thermoFill.style.width = (q / 4) * 100 + "%";
}

function animateGauge(el, target, done) {
  el.style.height = "0%";
  const dur = 1400;
  const start = performance.now();

  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(now) {
    const t = Math.min(1, (now - start) / dur);
    el.style.height = Math.round(ease(t) * target) + "%";
    if (t < 1) requestAnimationFrame(step);
    else if (done) done();
  }
  requestAnimationFrame(step);
}

function show(id) {
  [
    "start",
    "test",
    "weeklyResult",
    "monthlyResult",
    "mirrorIntro",
    "mirrorTest",
    "mirrorResult"
  ].forEach(s => document.getElementById(s).classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");
}
