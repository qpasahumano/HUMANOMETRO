// ===============================
// ESTADO GLOBAL
// ===============================
let mode = "common"; // common | premium
let currentModule = 0;
let currentQuestion = 0;

let modules = [];
let scores = {};
let totalAnswers = 0;

// ===============================
// MÓDULOS BASE (COMÚN)
// ===============================
const BASE_MODULES = [
  {
    name: "Familia",
    key: "familia",
    questions: [
      "¿Escuchás a tu familia cuando piensa distinto a vos?",
      "¿Acompañás emocionalmente a tu familia cuando lo necesita?",
      "¿Reconocés errores frente a tu familia?",
      "¿Evitás dañar vínculos por orgullo?",
      "¿Priorizás el bienestar familiar sobre tu comodidad?"
    ]
  },
  {
    name: "Social",
    key: "social",
    questions: [
      "¿Tratás con respeto a personas que no te aportan nada?",
      "¿Ayudás sin esperar reconocimiento?",
      "¿Escuchás opiniones distintas sin atacar?",
      "¿Te solidarizás con quien sufre injusticias?",
      "¿Cuidás tu impacto en la sociedad?"
    ]
  },
  {
    name: "Amistad",
    key: "amistad",
    questions: [
      "¿Sos leal a tus amistades cuando no están presentes?",
      "¿Decís la verdad aunque incomode?",
      "¿Acompañás en los malos momentos?",
      "¿Respetás los límites del otro?",
      "¿Celebrás los logros ajenos?"
    ]
  },
  {
    name: "Laboral",
    key: "laboral",
    questions: [
      "¿Actuás con honestidad en tu trabajo?",
      "¿Cumplís responsabilidades aunque nadie controle?",
      "¿Respetás a tus compañeros?",
      "¿Evitás sacar ventaja injusta?",
      "¿Reconocés errores laborales?"
    ]
  },
  {
    name: "Naturaleza",
    key: "naturaleza",
    questions: [
      "¿Cuidás el ambiente en acciones cotidianas?",
      "¿Respetás a los animales?",
      "¿Reducís tu impacto ambiental?",
      "¿Evitás el desperdicio?",
      "¿Tomás conciencia de tu huella en el planeta?"
    ]
  }
];

// ===============================
// MÓDULOS PREMIUM (EXCLUSIVOS)
// ===============================
const PREMIUM_MODULES = [
  {
    name: "Incongruencias Personales",
    key: "incongruencias",
    questions: [
      "¿Decís que sos honesto pero ocultás lo que sentís?",
      "¿Sostenés tus valores cuando nadie te observa?",
      "¿Mostrás versiones distintas de vos según el contexto?",
      "¿Defendés ideas que no practicás bajo presión?",
      "¿Preferís caer bien antes que ser auténtico?"
    ]
  },
  {
    name: "Sombras Vinculares",
    key: "sombras",
    questions: [
      "¿Manipulás emocionalmente para no perder vínculos?",
      "¿Te victimizás para evitar responsabilidad?",
      "¿Usás el afecto como forma de control?",
      "¿Evitás compromisos profundos?",
      "¿Confundís apego con amor?"
    ]
  }
];

// ===============================
// INICIO
// ===============================
function startTest(selectedMode) {
  mode = selectedMode;
  currentModule = 0;
  currentQuestion = 0;
  totalAnswers = 0;
  scores = {};

  modules = [...BASE_MODULES];
  if (mode === "premium") {
    modules = modules.concat(PREMIUM_MODULES);
  }

  modules.forEach(m => scores[m.key] = 0);

  document.getElementById("start").classList.add("hidden");
  document.getElementById("question").classList.remove("hidden");
  updateQuestion();
}

// ===============================
// MOSTRAR PREGUNTA
// ===============================
function updateQuestion() {
  const module = modules[currentModule];
  const question = module.questions[currentQuestion];

  document.getElementById("module-title").innerText = module.name;
  document.getElementById("question-text").innerText = question;
  updateThermometer();
}

// ===============================
// RESPUESTA
// ===============================
function answer(value) {
  const module = modules[currentModule];
  scores[module.key] += value;
  totalAnswers++;

  currentQuestion++;

  if (currentQuestion >= module.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) {
    showResults();
  } else {
    updateQuestion();
  }
}

// ===============================
// TERMÓMETRO
// ===============================
function updateThermometer() {
  const progress = totalAnswers / (modules.reduce((a, m) => a + m.questions.length, 0));
  const percent = Math.round(progress * 100);

  const bar = document.getElementById("thermo-bar");
  bar.style.width = percent + "%";

  if (percent < 35) bar.style.background = "#e74c3c";
  else if (percent < 70) bar.style.background = "#f1c40f";
  else bar.style.background =
