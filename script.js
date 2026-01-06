let areas = [];
let currentArea = 0;
let currentQuestion = 0;
let scores = {};
let isPremium = false;
let totalAnswers = 0;
let maxAnswers = 0;

// ===== ÁREAS COMUNES (6 PREGUNTAS)
const baseAreas = [
  {
    name: "Vínculos",
    questions: [
      "¿Escuchás sin pensar en responder?",
      "¿Estás presente cuando alguien te habla?",
      "¿Pedís perdón sin justificarte?",
      "¿Respetás silencios ajenos?",
      "¿Elegís comprender antes que reaccionar?",
      "¿Cuidás vínculos aunque nadie mire?"
    ]
  },
  {
    name: "Conciencia",
    questions: [
      "¿Reconocés tus emociones?",
      "¿Escuchás tu cuerpo?",
      "¿Vivís el presente?",
      "¿Aceptás tus sombras?",
      "¿Sos coherente entre pensar y actuar?",
      "¿Elegís crecer aunque incomode?"
    ]
  }
];

// ===== PREMIUM (NO REPITE)
const premiumExtra = [
  {
    name: "Verdad Incómoda",
    questions: [
      "¿Vivís desde el miedo o desde el amor?",
      "¿Preferís comodidad antes que verdad?",
      "¿Te mentís para evitar cambiar?",
      "¿Sos coherente cuando perdés?",
      "¿Asumís tu impacto en otros?",
      "¿Vivís o sobrevivís?"
    ]
  }
];

// ===== INICIO
function startTest(premium) {
  isPremium = premium;
  areas = JSON.parse(JSON.stringify(baseAreas));
  if (premium) areas = areas.concat(premiumExtra);

  scores = {};
  areas.forEach(a => scores[a.name] = 0);

  currentArea = 0;
  currentQuestion = 0;
  totalAnswers = 0;
  maxAnswers = areas.length * 6 * 2;

  document.getElementById("start").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");
  document.getElementById("thermoContainer").classList.remove("hidden");

  updateThermo();
  showQuestion();
}

function showQuestion() {
  const area = areas[currentArea];
  document.getElementById("areaTitle").innerText = area.name;
  document.getElementById("questionText").innerText =
    area.questions[currentQuestion];
}

// ===== RESPUESTA
function answer(value) {
  const area = areas[currentArea];
  scores[area.name] += value;
  totalAnswers += value;
  currentQuestion++;

  updateThermo();

  if (currentQuestion >= area.questions.length) {
    currentQuestion = 0;
    currentArea++;
  }

  if (currentArea >= areas.length) {
    showResults();
  } else {
    showQuestion();
  }
}

// ===== TERMÓMETRO
function updateThermo() {
  const percent = Math.round((totalAnswers / maxAnswers) * 100);
  const bar = document.getElementById("thermoBar");
  bar.style.width = percent + "%";

  if (percent < 40) bar.style.background = "#ff5252";
  else if (percent < 70) bar.style.background = "#ffd54f";
  else bar.style.background = "#66ffa6";
}

// ===== RESULTADOS
function showResults() {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("thermoContainer").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");

  const percent = Math.round((totalAnswers / maxAnswers) * 100);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + percent + "%";

  const bar = document.getElementById("thermoResultBar");
  bar.style.width = percent + "%";
  bar.style.background =
    percent < 40 ? "#ff5252" : percent < 70 ? "#ffd54f" : "#66ffa6";

  if (isPremium) {
    document.getElementById("premiumAnalysis").innerHTML =
      "<p><strong>Análisis Premium:</strong> Tu humanidad no depende del entorno, depende de tu presencia. Este resultado marca dónde estás eligiendo conscientemente y dónde estás reaccionando.</p>";
  }

  showTips(percent);
}

function showTips(global) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const list = global < 40
    ? ["Reducí estímulos", "Volvé al cuerpo", "Menos pantalla"]
    : global < 70
    ? ["Escuchá más", "Elegí presencia", "Cuidá vínculos"]
    : ["Sostené este estado", "No te automatices"];

  list.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tips.appendChild(li);
  });
}

function restart() {
  document.getElementById("results").classList.add("hidden");
  document.getElementById("start").classList.remove("hidden");
}

function showPrivacy() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("privacy").classList.remove("hidden");
}
