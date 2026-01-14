document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     REFERENCIAS DOM
  ================================ */
  const areaTitle = document.getElementById("areaTitle");
  const questionText = document.getElementById("questionText");
  const questionNote = document.getElementById("questionNote");
  const thermoFill = document.getElementById("thermoFill");

  const circles = document.getElementById("circles");
  const tips = document.getElementById("tips");
  const globalResult = document.getElementById("globalResult");
  const weeklyAccess = document.getElementById("weeklyAccess");

  const weeklyQuestion = document.getElementById("weeklyQuestion");
  const weeklyThermoFill = document.getElementById("weeklyThermoFill");
  const weeklyText = document.getElementById("weeklyText");
  const weeklyAdvice = document.getElementById("weeklyAdvice");
  const weeklySaved = document.getElementById("weeklySaved");

  /* ===============================
     VARIABLES
  ================================ */
  let mode = "common";
  let currentModule = 0;
  let currentQuestion = 0;
  let modules = [];
  let scores = {};

  /* ===============================
     DATOS
  ================================ */
  const MODULES_COMMON = [{
    title: "Vos y el mundo",
    questions: [
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad emocional"],
      ["¿Escuchás cuando alguien habla?", "Presencia humana"],
      ["¿Sentís empatía ante injusticias?", "Empatía social"]
    ]
  }];

  const MODULES_PREMIUM = [{
    title: "Conciencia humana",
    questions: [
      ["¿Observás tus reacciones antes de actuar?", "Autoconciencia"],
      ["¿Hay coherencia entre lo que pensás y hacés?", "Coherencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"]
    ]
  }];

  /* ===============================
     TEST PRINCIPAL
  ================================ */
  window.startTest = function(isPremium) {
    mode = isPremium ? "premium" : "common";
    modules = isPremium ? MODULES_PREMIUM : MODULES_COMMON;
    currentModule = 0;
    currentQuestion = 0;
    scores = {};
    show("test");
    loadQuestion();
  };

  function loadQuestion() {
    const mod = modules[currentModule];
    areaTitle.innerText = mod.title;
    questionText.innerText = mod.questions[currentQuestion][0];
    questionNote.innerText = mod.questions[currentQuestion][1];
    updateThermo();
  }

  window.answer = function(value) {
    const key = modules[currentModule].title;
    scores[key] = (scores[key] || 0) + value;
    currentQuestion++;

    if (currentQuestion >= modules[currentModule].questions.length) {
      currentModule++;
      currentQuestion = 0;
      if (currentModule >= modules.length) showResults();
      else loadQuestion();
    } else {
      loadQuestion();
    }
  };

  function updateThermo() {
    thermoFill.style.width =
      (currentQuestion / modules[currentModule].questions.length) * 100 + "%";
  }

  /* ===============================
     RESULTADOS
  ================================ */
  function showResults() {
    show("results");
    circles.innerHTML = "";
    tips.innerHTML = "";

    Object.keys(scores).forEach(key => {
      const score = scores[key];
      const div = document.createElement("div");
      div.className = "circle " + (score < 2 ? "low" : score < 4 ? "mid" : "high");
      div.innerText = key;
      circles.appendChild(div);
    });

    globalResult.innerText =
      mode === "premium"
        ? "Lectura profunda de tu humanidad"
        : "Lectura inicial de tu humanidad";

    weeklyAccess.innerHTML =
      mode === "premium"
        ? `<button class="premium" onclick="startWeekly()">Iniciar conteo semanal</button>`
        : "";
  }

  /* ===============================
     CONTEO SEMANAL
  ================================ */
