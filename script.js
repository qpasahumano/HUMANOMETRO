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

  if (currentModule >= modules.length) {
    showResults();
  } else {
    showQuestion();
    updateThermometer();
  }
}

function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;
  let percents = {};

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents[m.name] = percent;
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const values = Object.values(percents);
  const coherence = 100 - (Math.max(...values) - Math.min(...values));
  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: " + coherence + "%";

  renderPersonalizedReading(percents);
}

function renderPersonalizedReading(percents) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  const areasBajas = Object.entries(percents)
    .filter(([_, v]) => v < 99);

  // CASO: todo excelente
  if (areasBajas.length === 0) {
    tips.innerHTML = `
      <li>
        Estás transitando un camino de alta coherencia humana.
        Mantené esta conciencia viva en tus decisiones cotidianas.
      </li>`;
    return;
  }

  // DEVOLUCIONES PERSONALIZADAS POR ÁREA
  areasBajas.forEach(([area, valor]) => {
    let mensaje = "";

    switch (area) {
      case "Familia":
        mensaje = "Revisá cómo estás estando emocionalmente presente con las personas más cercanas. Pequeños gestos diarios pueden transformar vínculos.";
        break;
      case "Social":
        mensaje = "Observá tu forma de vincularte en espacios compartidos. La empatía cotidiana construye impacto humano.";
        break;
      case "Amistad":
        mensaje = "Tal vez sea momento de escuchar más y sostener vínculos desde la presencia real, no solo desde la costumbre.";
        break;
      case "Laboral":
        mensaje = "Reflexioná si tus acciones laborales reflejan tus valores internos, incluso cuando nadie observa.";
        break;
      case "Planeta":
        mensaje = "Tu relación con el entorno puede fortalecerse con decisiones conscientes que respeten la vida en todas sus formas.";
        break;
      case "Conciencia Profunda":
        mensaje = "Profundizar en tu coherencia interna puede ayudarte a alinear pensamiento, emoción y acción.";
        break;
    }

    const li = document.createElement("li");
    li.innerHTML = `<strong>${area}:</strong> ${mensaje}`;
    tips.appendChild(li);
  });
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  const progress = Math.round((answered / totalQ) * 100);
  document.getElementById("thermoFill").style.width = progress + "%";
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
