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
  { name: "Conciencia Profunda", questions: [
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

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let areas = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    areas.push({ name: m.name, value: percent });

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  const coherence =
    100 - (Math.max(...areas.map(a => a.value)) - Math.min(...areas.map(a => a.value)));
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderTips(global, areas);
}

function renderTips(global, areas) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  // CASO TODO 100%
  if (areas.every(a => a.value === 100)) {
    tips.innerHTML =
      "<li>Estás en un proceso humano íntegro y coherente. No hay áreas críticas que revisar en este momento.</li>";
    return;
  }

  areas
    .filter(a => a.value < 100)
    .forEach(a => {
      const li = document.createElement("li");

      if (a.name === "Familia") {
        li.innerHTML =
          "En <strong>Familia</strong>, tus respuestas sugieren que podrías fortalecer la presencia emocional y la escucha consciente en los vínculos más cercanos.";
      }

      if (a.name === "Social") {
        li.innerHTML =
          "En el plano <strong>Social</strong>, aparece una oportunidad para revisar cómo te vinculás con la diferencia y la empatía cotidiana.";
      }

      if (a.name === "Amistad") {
        li.innerHTML =
          "En <strong>Amistad</strong>, se abre un espacio para profundizar la lealtad emocional y la disponibilidad genuina hacia el otro.";
      }

      if (a.name === "Laboral") {
        li.innerHTML =
          "En el ámbito <strong>Laboral</strong>, tus respuestas invitan a observar la coherencia entre valores, acciones y decisiones cuando nadie observa.";
      }

      if (a.name === "Planeta") {
        li.innerHTML =
          "En relación al <strong>Planeta</strong>, podrías reforzar la conciencia sobre el impacto cotidiano de tus hábitos en el entorno y los seres vivos.";
      }

      if (a.name === "Conciencia Profunda") {
        li.innerHTML =
          "En <strong>Conciencia Profunda</strong>, se refleja un llamado a alinear pensamiento, emoción y acción desde un lugar más consciente.";
      }

      tips.appendChild(li);
    });
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

function restart() {
  showSection("start");
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
