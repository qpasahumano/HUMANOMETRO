let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* =========================
   MÓDULOS PRINCIPALES
========================= */
const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estuviste emocionalmente presente con tu familia?", n: "Se mide presencia, no perfección." },
    { q: "¿Escuchaste sin juzgar?", n: "Se mide apertura, no acuerdo." },
    { q: "¿Expresaste afecto sin que te lo pidan?", n: "Se mide intención genuina." }
  ]},
  { name: "Social", questions: [
    { q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchaste opiniones distintas a la tuya?", n: "Se mide tolerancia." },
    { q: "¿Actuaste con empatía en espacios públicos?", n: "Se mide conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estuviste presente para tus amistades?", n: "Presencia real." },
    { q: "¿Cuidaste el vínculo aun sin coincidir?", n: "Se mide cuidado del lazo." },
    { q: "¿Escuchaste sin imponer tu visión?", n: "Se mide respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generaste buen clima laboral aun estando incómodo?", n: "Se mide responsabilidad humana." },
    { q: "¿Respetaste a tus compañeros?", n: "Se mide trato." },
    { q: "¿Evitaste sobrecargar a otros con tu función?", n: "Se mide equidad." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconociste a los animales como seres sensibles?", n: "Se mide empatía." },
    { q: "¿Cuidaste tu entorno inmediato?", n: "Se mide conciencia cotidiana." },
    { q: "¿Reduciste tu impacto ambiental cuando pudiste?", n: "Se mide intención." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Tomaste decisiones con conciencia?", n: "Se mide atención interna." },
    { q: "¿Fuiste coherente entre pensamiento y acción?", n: "Se mide alineación." },
    { q: "¿Asumiste tu impacto en otros?", n: "Se mide madurez emocional." }
  ]}
];

/* =========================
   CONTEO SEMANAL
========================= */
const WEEKLY_QUESTIONS = [
  "¿Cómo gestionaste tus emociones ante tensiones cotidianas esta semana?",
  "¿Pudiste empatizar con alguien aun cuando te resultó difícil?",
  "¿Cómo reaccionaste ante una situación incómoda o injusta?",
  "¿Tuviste conciencia de tu forma de comunicarte con otros?",
  "¿Actuaste con humanidad aun estando cansado o saturado?",
  "¿Pudiste soltar rencor o enojo cuando apareció?"
];

let weeklyIndex = 0;
let weeklyScores = [];

/* =========================
   INICIO TEST
========================= */
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
  document.getElementById("questionText").innerText = mod.questions[currentQuestion].q;
  document.getElementById("questionNote").innerText = mod.questions[currentQuestion].n;
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

/* =========================
   RESULTADOS
========================= */
function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  const tips = document.getElementById("tips");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if (mode === "premium") {
      const li = document.createElement("li");
      li.innerText =
        percent < 40
          ? `En ${m.name}, hay desconexión interna. Observá sin juzgar.`
          : percent < 70
          ? `En ${m.name}, hay intención pero falta sostén.`
          : `En ${m.name}, hay coherencia y presencia humana.`;
      tips.appendChild(li);
    }
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  if (mode === "common") {
    const li = document.createElement("li");
    li.innerText =
      avg < 40
        ? "Predomina desconexión entre intención y acción."
        : avg < 70
        ? "Hay sensibilidad humana, pero es inestable."
        : "Hay coherencia entre lo que sentís, pensás y hacés.";
    tips.appendChild(li);
  }

  if (mode === "premium") {
    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Conteo semanal (versión paga / donación)";
    btn.onclick = startWeekly;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Registro consciente de vivencias semanales. Donación a voluntad.";

    document.getElementById("results").appendChild(btn);
    document.getElementById("results").appendChild(note);
  }
}

/* =========================
   CONTEO SEMANAL
========================= */
function startWeekly() {
  weeklyIndex = 0;
  weeklyScores = [];
  renderWeeklyQuestion();
}

function renderWeeklyQuestion() {
  const results = document.getElementById("results");
  results.innerHTML = `
    <h3>Conteo semanal</h3>
    <p class="legal">Respondé con sinceridad para conocer tu tendencia humana actual.</p>
    <p>${WEEKLY_QUESTIONS[weeklyIndex]}</p>
    <div class="answers">
      <button onclick="weeklyAnswer(2)">Sí</button>
      <button onclick="weeklyAnswer(1)">Tal vez / A veces</button>
      <button onclick="weeklyAnswer(0)">No</button>
    </div>
  `;
}

function weeklyAnswer(val) {
  weeklyScores.push(val);
  weeklyIndex++;

  if (weeklyIndex < WEEKLY_QUESTIONS.length) {
    renderWeeklyQuestion();
  } else {
    finishWeekly();
  }
}

function finishWeekly() {
  const sum = weeklyScores.reduce((a, b) => a + b, 0);
  const avg = sum / weeklyScores.length;

  let msg =
    avg < 0.8
      ? "Semana de baja coherencia. Hay tensiones internas."
      : avg < 1.5
      ? "Semana intermedia. Hay conciencia parcial."
      : "Semana coherente. Presencia humana sostenida.";

  document.getElementById("results").innerHTML = `
    <h3>Resultado semanal</h3>
    <p>${msg}</p>
    <button onclick="saveWeekly()">Grabar semana</button>
    <p class="legal">El registro semanal permite luego una lectura mensual.</p>
  `;
}

function saveWeekly() {
  let data = JSON.parse(localStorage.getItem("weeklyHumanity") || "[]");
  data.push({ date: Date.now(), score: weeklyScores });
  localStorage.setItem("weeklyHumanity", JSON.stringify(data));

  const p = document.createElement("p");
  p.className = "legal";
  p.innerText = "Conteo semanal guardado.";
  document.getElementById("results").appendChild(p);
}

/* =========================
   UTILIDADES
========================= */
function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
