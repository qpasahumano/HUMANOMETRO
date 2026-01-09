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
  const tips = document.getElementById("tips");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;
  let percents = [];

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push({ name: m.name, value: percent });
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...percents.map(p => p.value)) - Math.min(...percents.map(p => p.value)));
  document.getElementById("coherenceResult").innerText = "Coherencia humana: " + coherence + "%";

  if (mode === "common") {
    // 👉 UNA sola devolución general
    tips.innerHTML = `
      <li>
        Tu resultado refleja cómo estás habitando tu humanidad en este momento.
        Observá tu coherencia entre lo que sentís, pensás y hacés.
        Este valor no te define: te orienta.
      </li>`;
  } else {
    // 👉 PREMIUM: devoluciones por área
    percents
      .filter(p => p.value < 100)
      .forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
          En el área <strong>${p.name}</strong>, tus respuestas muestran un espacio
          donde podés profundizar tu presencia y coherencia cotidiana.
        `;
        tips.appendChild(li);
      });

    document.getElementById("premiumNote").classList.remove("hidden");
  }
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  document.getElementById("thermoFill").style.width = Math.round((answered/totalQ)*100)+"%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
