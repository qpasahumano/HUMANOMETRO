/* ===============================
   ESTADO
================================ */
let currentQuestion = 0;
let answers = [];

/* ===============================
   SEMANA 2 – VOS ANTE EL MUNDO
================================ */
const WEEK = {
  title: "Vos ante el mundo",
  questions: [
    {
      q: "Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?",
      n: "Mide empatía y sensibilidad humana."
    },
    {
      q: "Cuando alguien te habla, ¿le prestás atención sin mirar el celular?",
      n: "Mide presencia humana."
    },
    {
      q: "¿Sentís impulso de involucrarte cuando ves una injusticia?",
      n: "Mide compromiso humano."
    },
    {
      q: "¿Te afecta emocionalmente el sufrimiento ajeno?",
      n: "Mide apertura emocional."
    }
  ]
};

/* ===============================
   INICIO
================================ */
function startV2() {
  showSection("week");
  loadQuestion();
}

/* ===============================
   PREGUNTAS
================================ */
function loadQuestion() {
  const q = WEEK.questions[currentQuestion];
  document.getElementById("weekTitle").innerText = WEEK.title;
  document.getElementById("questionText").innerText = q.q;
  document.getElementById("questionNote").innerText = q.n;
}

function answer(value) {
  answers.push(value);
  currentQuestion++;
  updateThermo();

  if (currentQuestion >= WEEK.questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

/* ===============================
   RESULTADO
================================ */
function showResult() {
  const avg = answers.reduce((a,b)=>a+b,0) / answers.length;

  let animal, text, advice;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Tu humanidad se mostró en repliegue.";
    advice = "Detenerte a registrar al otro puede reactivar tu sensibilidad.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños gestos conscientes pueden impulsarte.";
  } else {
    animal = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta apertura fortalece tu coherencia.";
  }

  document.getElementById("animalSymbol").innerText = animal;
  document.getElementById("resultText").innerText = text;
  document.getElementById("resultAdvice").innerText = advice;

  showSection("result");
}

/* ===============================
   NAVEGACIÓN
================================ */
function backToStart() {
  currentQuestion = 0;
  answers = [];
  document.getElementById("thermoFill").style.width = "0%";
  showSection("start");
}

function showSection(id) {
  ["start","week","result"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function updateThermo() {
  const pct = (answers.length / WEEK.questions.length) * 100;
  document.getElementById("thermoFill").style.width = pct + "%";
}
