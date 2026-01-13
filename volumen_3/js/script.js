// VOLUMEN 3 – HUMANÓMETRO
// Estado inicial

let currentStep = 0;

// Pantallas
const screens = [
  "v3-start",
  "v3-q1",
  "v3-q2",
  "v3-q3",
  "v3-q4",
  "v3-q5",
  "v3-q6",
  "v3-q7",
  "v3-q8",
  "v3-result"
];

function showScreen(id) {
  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

// Botón comenzar
function startV3() {
  currentStep = 1;
  showScreen("v3-q1");
}

// Responder pregunta
function answerV3() {
  currentStep++;
  if (currentStep <= 8) {
    showScreen("v3-q" + currentStep);
  } else {
    showResult();
  }
}

// Resultado final
function showResult() {
  showScreen("v3-result");

  const thermo = document.getElementById("v3-thermo-fill");
  if (thermo) {
    thermo.style.height = "70%"; // valor provisorio
  }
}

// Exponer funciones
window.startV3 = startV3;
window.answerV3 = answerV3;
