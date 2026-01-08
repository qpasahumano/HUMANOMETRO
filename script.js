let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name: "Social", questions: [
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas a la tuya?",
    "¿Actuás con empatía en espacios públicos?"
  ]},
  { name: "Amistad", questions: [
    "¿Estás presente para tus amistades?",
    "¿Sos leal incluso cuando no estás de acuerdo?",
    "¿Escuchás sin imponer tu visión?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name: "Planeta", questions: [
    "¿Respetás a los animales como seres vivos?",
    "¿Cuidás el entorno donde vivís?",
    "¿Reducís tu impacto ambiental cuando podés?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

function startTest(isPremium) {
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m => scores[m.name] = 0);
  currentModule = 0;
  currentQuestion = 0;

  showSection("test");
  showQuestion();
  updateThermometer();
}

function showQuestion() {
  const mod = modules[currentModule];
  document.body.className = mod.name.toLowerCase();
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(value) {
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

function showResults() {
  showSection("results");
  document.body.className = "";

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let details = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if (percent < 100) details.push({ area: m.name, percent });
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  renderTips(global, details);
}

function renderTips(global, details) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (details.length === 0) {
    tips.innerHTML = "<li>Estás en un proceso humano sólido y coherente. Seguí por este camino.</li>";
    return;
  }

  details.forEach(d => {
    const li = document.createElement("li");

    switch (d.area) {
      case "Familia":
        li.innerHTML = "En <strong>Familia</strong>, tus respuestas muestran que podrías fortalecer la presencia emocional y la escucha genuina en los vínculos más cercanos.";
        break;

      case "Social":
        li.innerHTML = "En el área <strong>Social</strong>, aparece margen para actuar con mayor empatía y conciencia en los espacios compartidos con otras personas.";
        break;

      case "Amistad":
        li.innerHTML = "En <strong>Amistad</strong>, podrías revisar qué tan disponible estás emocionalmente y cómo acompañás a quienes te rodean.";
        break;

      case "Laboral":
        li.innerHTML = "En lo <strong>Laboral</strong>, tus respuestas sugieren observar la coherencia entre valores personales y acciones cotidianas en el trabajo.";
        break;

      case "Planeta":
        li.innerHTML = "En <strong>Planeta</strong>, hay una invitación a profundizar el cuidado del entorno y la responsabilidad con la vida que te rodea.";
        break;

      case "Conciencia":
        li.innerHTML = "En <strong>Conciencia</strong>, se abre un espacio para alinear más profundamente pensamiento, emoción y acción.";
        break;
    }

    tips.appendChild(li);
  });
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered = modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0) + currentQuestion;
  document.getElementById("thermoFill").style.width = Math.round((answered / totalQ) * 100) + "%";
}

function restart() {
  showSection("start");
  document.body.className = "";
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
