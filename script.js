/* ===============================
   REFERENCIAS DOM
================================ */
const sections = {
  start: document.getElementById("start"),
  test: document.getElementById("test"),
  results: document.getElementById("results"),
  weekly: document.getElementById("weekly"),
  weeklyResult: document.getElementById("weeklyResultScreen"),
  privacy: document.getElementById("privacy")
};

const areaTitle = document.getElementById("areaTitle");
const questionText = document.getElementById("questionText");
const questionNote = document.getElementById("questionNote");
const thermoFill = document.getElementById("thermoFill");

const circles = document.getElementById("circles");
const tips = document.getElementById("tips");
const globalResult = document.getElementById("globalResult");

/* ===============================
   DATOS DEL TEST
================================ */
const MODULES = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te conmueve el sufrimiento ajeno?", "Empatía humana"],
      ["¿Te afectan las injusticias?", "Sensibilidad social"],
      ["¿Te importa el impacto de tus actos?", "Responsabilidad"]
    ]
  },
  {
    title: "Vos con los demás",
    questions: [
      ["¿Escuchás con atención?", "Presencia"],
      ["¿Podés frenar antes de reaccionar?", "Autocontrol"],
      ["¿Reconocés errores?", "Humildad"]
    ]
  }
];

/* ===============================
   VARIABLES
================================ */
let currentModule = 0;
let currentQuestion = 0;
let score = 0;

/* ===============================
   FUNCIONES DE FLUJO
================================ */
function show(section) {
  Object.values(sections).forEach(s => s.classList.add("hidden"));
  sections[section].classList.remove("hidden");
}

function startTest() {
  currentModule = 0;
  currentQuestion = 0;
  score = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const mod = MODULES[currentModule];
  areaTitle.innerText = mod.title;
  questionText.innerText = mod.questions[currentQuestion][0];
  questionNote.innerText = mod.questions[currentQuestion][
