let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   CONTEO SEMANAL (INAMOVIBLE)
================================ */
let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  "Cuando viviste alguna incomodidad o tensión emocional esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
  "Ante diferencias o tensiones con alguna persona esta semana, ¿intentaste comprender lo que el otro podía estar sintiendo?",
  "Frente a emociones densas surgidas en la semana con algún vínculo, ¿lograste soltarlas sin quedarte atrapado en ellas?"
];

function startWeekly() {
  weeklyIndex = 0;
  weeklyScores = [];
  showSection("weekly");
  weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  weeklyThermoFill.style.width = "0%";
  weeklyResult.classList.add("hidden");
  weeklySaved.classList.add("hidden");
}

function weeklyAnswer(value) {
  weeklyScores.push(value);
  weeklyIndex++;

  weeklyThermoFill.style.width =
    Math.round((weeklyScores.length / WEEKLY_QUESTIONS.length) * 100) + "%";

  if (weeklyIndex >= WEEKLY_QUESTIONS.length) {
    showWeeklyResult();
  } else {
    weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function showWeeklyResult() {
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  let text = "";
  let advice = "";

  if (avg < 0.8) {
    text = "Esta semana mostró una desconexión entre intención y acción.";
    advice = "Observar tus reacciones sin juzgar puede ayudarte a recuperar coherencia.";
  } else if (avg < 1.5) {
    text = "Tu humanidad estuvo presente, pero de forma fluctuante.";
    advice = "Sostener la atención consciente puede estabilizar tu respuesta emocional.";
  } else {
    text = "Mostraste coherencia humana y presencia consciente esta semana.";
    advice = "Continuar actuando desde la empatía refuerza tu equilibrio interno.";
  }

  weeklyText.innerText = text;
  weeklyAdvice.innerText = advice;
  weeklyResult.classList.remove("hidden");
}

function saveWeekly() {
  const history = JSON.parse(localStorage.getItem("humanometro_semanal") || "[]");
  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  history.push({
    date: new Date().toISOString().slice(0, 10),
    score: avg
  });

  localStorage.setItem("humanometro_semanal", JSON.stringify(history));
  weeklySaved.classList.remove("hidden");
}

/* ===============================
   TEST PRINCIPAL
================================ */

const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estuviste emocionalmente presente con tu familia?", n: "Aquí se mide presencia, no perfección." },
    { q: "¿Escuchaste sin juzgar?", n: "No se mide acuerdo, se mide apertura." },
    { q: "¿Expresaste afecto sin que te lo pidan?", n: "Se observa intención genuina." }
  ]},
  { name: "Social", questions: [
    { q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchaste opiniones distintas a la tuya?", n: "Se mide tolerancia." },
    { q: "¿Actuaste con empatía en espacios públicos?", n: "Conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estuviste presente para tus amistades?", n: "Presencia real." },
    { q: "¿Cuidaste el vínculo aun sin coincidir?", n: "Cuidado del lazo." },
    { q: "¿Escuchaste sin imponer tu visión?", n: "Respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generaste buen clima laboral aun sin estar cómodo?", n: "Responsabilidad humana." },
    { q: "¿Respetaste a tus compañeros?", n: "Trato consciente." },
    { q: "¿Evitaste sobrecargar a otros?", n: "Conciencia colectiva." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconociste a los animales como seres sensibles?", n: "Empatía." },
    { q: "¿Cuidaste el entorno donde vivís?", n: "Conciencia cotidiana." },
    { q: "¿Reduciste tu impacto cuando estuvo a tu alcance?", n: "Intención posible." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Tomaste decisiones desde la conciencia?", n: "Atención interna." },
    { q: "¿Fuiste coherente entre pensamiento y acción?", n: "Alineación." },
    { q: "¿Asumiste responsabilidad por tu impacto?", n: "Madurez emocional." }
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
  const m = modules[currentModule];
  areaTitle.innerText = m.name;
  questionText.innerText = m.questions[currentQuestion].q;
  questionNote.innerText = m.questions[currentQuestion].n;
}

function answer(v) {
  scores[modules[currentModule].name] += v;
  currentQuestion++;

  if (currentQuestion >= modules[currentModule].questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  currentModule >= modules.length ? showResults() : showQuestion();
  updateThermometer();
}

function showResults() {
  showSection("results");
  circles.innerHTML = "";
  tips.innerHTML = "";
  weeklyAccess.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const p = Math.round(scores[m.name] / max * 100);
    total += p;

    circles.innerHTML += `
      <div class="circle ${p < 40 ? "low" : p < 70 ? "mid" : "high"}">
        <strong>${p}%</strong>
        <small>${m.name}</small>
      </div>`;
  });

  const avg = Math.round(total / modules.length);
  globalResult.innerText = "Humanidad global: " + avg + "%";

  if (mode === "premium") {
    weeklyAccess.innerHTML = `
      <button class="premium" onclick="weeklyWithDonation()">Conteo semanal</button>
      <p class="legal">
        Conteo semanal – versión Premium.<br>
        Este espacio se sostiene a través de aportes conscientes y donaciones a voluntad.
      </p>`;
  } else {
    tips.innerHTML = `
      <li>
        ${avg < 40
          ? "Hay una desconexión interna. Observar sin juzgar es el primer paso."
          : avg < 70
            ? "Existe intención humana, pero de forma inestable."
            : "Hay coherencia y presencia humana sostenida."
        }
      </li>`;
  }
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0) +
    currentQuestion;

  thermoFill.style.width = Math.round((answered / totalQ) * 100) + "%";
}

function restart() {
  showSection("start");
}

function showPrivacy() {
  showSection("privacy");
}

function showSection(id) {
  ["start", "test", "results", "weekly", "privacy"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   DONACIÓN VOLUNTARIA – FINAL
================================ */

function weeklyWithDonation() {
  const donated = localStorage.getItem("humanometro_donacion");

  if (!donated) {
    window.open("https://mpago.la/1eCGrKX", "_blank");
    localStorage.setItem("humanometro_donacion", "true");
  }

  startWeekly();
}

/* ===============================
   PWA – SERVICE WORKER
================================ */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
                       }
