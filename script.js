// ================================
// ESTADO GLOBAL
// ================================
let areas = [];
let currentArea = 0;
let currentQuestion = 0;
let scores = {};
let isPremium = false;

// ================================
// ÁREAS BASE (VERSIÓN COMÚN)
// ================================
const baseAreas = [
  {
    name: "Vínculos Humanos",
    questions: [
      "¿Escuchás sin interrumpir realmente?",
      "¿Abrazás con presencia o solo por costumbre?",
      "¿Respondés con empatía incluso cuando estás cansado?",
      "¿Te interesa genuinamente lo que el otro siente?",
      "¿Sos capaz de pedir perdón sin justificarte?",
      "¿Evitás usar al otro para tu beneficio emocional?",
      "¿Respetás silencios ajenos?",
      "¿Estás disponible sin mirar el celular?",
      "¿Elegís comprender antes que reaccionar?",
      "¿Cuidás el vínculo aun cuando nadie te ve?"
    ]
  },
  {
    name: "Familia",
    questions: [
      "¿Estás emocionalmente disponible para tu familia?",
      "¿Perdonás errores pasados sin recordarlos luego?",
      "¿Expresás afecto sin que te lo pidan?",
      "¿Decís lo que sentís con honestidad?",
      "¿Escuchás sin juzgar?",
      "¿Asumís tus errores familiares?",
      "¿Respetás procesos ajenos?",
      "¿Elegís el diálogo antes que el silencio?",
      "¿Estás presente más allá de lo material?",
      "Si tenés animales, ¿compartís tiempo con ellos más allá de sus necesidades básicas?"
    ]
  },
  {
    name: "Trabajo y Sociedad",
    questions: [
      "¿Tratás a todas las personas con el mismo respeto?",
      "¿Elegís la ética aun cuando nadie controla?",
      "¿Sos justo cuando tenés poder?",
      "¿Respetás tiempos y límites ajenos?",
      "¿Reconocés errores laborales propios?",
      "¿Evitás humillar o minimizar a otros?",
      "¿Priorizás el bien común sobre el beneficio personal?",
      "¿Escuchás opiniones distintas sin descalificar?",
      "¿Cuidás el clima humano?",
      "¿Actuás con coherencia entre valores y acciones?"
    ]
  },
  {
    name: "Naturaleza y Vida",
    questions: [
      "¿Respetás a todos los seres vivos?",
      "¿Sentís conexión real con la naturaleza?",
      "¿Cuidás el entorno donde vivís?",
      "¿Consumís de forma consciente?",
      "¿Evitás el desperdicio innecesario?",
      "¿Valorás el agua y los recursos?",
      "¿Reducís tu impacto ambiental?",
      "¿Observás la naturaleza con presencia?",
      "¿Elegís prácticas más sustentables?",
      "¿Reconocés que no sos dueño de la vida?"
    ]
  },
  {
    name: "Conciencia Interna",
    questions: [
      "¿Reconocés tus emociones sin negarlas?",
      "¿Escuchás las señales de tu cuerpo?",
      "¿Vivís el presente sin huir?",
      "¿Te hacés responsable de tus actos?",
      "¿Aceptás tus sombras?",
      "¿Te observás sin juzgarte?",
      "¿Sos coherente entre pensamiento y acción?",
      "¿Te permitís sentir vulnerabilidad?",
      "¿Actuás desde la conciencia y no desde el miedo?",
      "¿Elegís crecer aunque incomode?"
    ]
  }
];

// ================================
// CONTENIDO PREMIUM
// ================================
const premiumExtra = [
  {
    name: "Preguntas Incómodas",
    questions: [
      "¿Vivís desde el amor o desde el miedo?",
      "¿Preferís comodidad antes que verdad?",
      "¿Sos coherente incluso cuando perdés?",
      "¿Te animás a cambiar lo que sabés que está mal?",
      "¿Te responsabilizás de tus decisiones?",
      "¿Usás máscaras según el contexto?",
      "¿Elegís el camino fácil o el correcto?",
      "¿Te mentís para evitar incomodarte?",
      "¿Vivís o simplemente sobrevivís?",
      "¿Te hacés cargo de tu impacto en otros?"
    ]
  }
];

// ================================
// INICIO DEL TEST
// ================================
function startTest(premium) {
  isPremium = premium;

  areas = JSON.parse(JSON.stringify(baseAreas));
  if (premium) areas = areas.concat(premiumExtra);

  scores = {};
  areas.forEach(a => scores[a.name] = 0);

  currentArea = 0;
  currentQuestion = 0;

  document.getElementById("start").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");

  showQuestion();
}

// ================================
// MOSTRAR PREGUNTA
// ================================
function showQuestion() {
  const area = areas[currentArea];
  document.getElementById("areaTitle").innerText = area.name;
  document.getElementById("questionText").innerText =
    area.questions[currentQuestion];
}

// ================================
// RESPUESTA
// ================================
function answer(value) {
  const area = areas[currentArea];
  scores[area.name] += value;
  currentQuestion++;

  if (currentQuestion >= area.questions.length) {
    currentQuestion = 0;
    currentArea++;
  }

  if (currentArea >= areas.length) {
    showResults();
  } else {
    showQuestion();
  }
}

// ================================
// RESULTADOS
// ================================
function showResults() {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  // ?? LIMPIEZA CLAVE (CORRIGE EL BUG)
  const resultsSection = document.getElementById("results");
  resultsSection.querySelectorAll(".extra-result").forEach(e => e.remove());

  let totalPercent = 0;
  const percents = [];

  areas.forEach(a => {
    const maxScore = a.questions.length * 2;
    const percent = Math.round((scores[a.name] / maxScore) * 100);
    percents.push(percent);
    totalPercent += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<div>${percent}%</div><small>${a.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(totalPercent / areas.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + global + "%";

  showAdvancedReadings(global, percents);
  showTips(global);
}

// ================================
// COHERENCIA HUMANA
// ================================
function calculateCoherenceIndex(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return Math.max(0, 100 - (max - min));
}

// ================================
// LECTURAS AVANZADAS
// ================================
function showAdvancedReadings(global, values) {
  const coherence = calculateCoherenceIndex(values);

  const results = document.getElementById("results");

  const coherenceText = document.createElement("p");
  coherenceText.className = "extra-result";
  coherenceText.innerHTML = `<strong>Coherencia humana:</strong> ${coherence}%`;
  results.appendChild(coherenceText);

  const stateText = document.createElement("p");
  stateText.className = "extra-result";
  stateText.innerHTML = `<em>${getHumanState(global, coherence)}</em>`;
  results.appendChild(stateText);

  const closing = document.createElement("p");
  closing.className = "extra-result";
  closing.style.marginTop = "20px";
  closing.innerHTML = `<strong>${getRandomClosingPhrase()}</strong>`;
  results.appendChild(closing);
}

// ================================
// ESTADO HUMANO
// ================================
function getHumanState(global, coherence) {
  if (global >= 90 && coherence >= 85) {
    return "Tu humanidad está activa, integrada y en equilibrio.";
  }
  if (global >= 70 && coherence < 70) {
    return "Hay humanidad presente, pero no se expresa de forma pareja.";
  }
  if (global >= 50) {
    return "Tu humanidad está activa, aunque en tensión con el entorno.";
  }
  return "Estás funcionando más desde la adaptación que desde la presencia humana.";
}

// ================================
// FRASES FINALES
// ================================
const closingPhrases = [
  "Ser humano también es una decisión.",
  "No todo crecimiento es progreso.",
  "La conciencia no se automatiza.",
  "Lo humano se cultiva, no se programa.",
  "La presencia es una forma de resistencia."
];

function getRandomClosingPhrase() {
  return closingPhrases[Math.floor(Math.random() * closingPhrases.length)];
}

// ================================
// CONSEJOS
// ================================
function showTips(global) {
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if (global >= 90) {
    const li = document.createElement("li");
    li.innerText = "Sigue por este camino.";
    tips.appendChild(li);
    return;
  }

  const list = global < 40
    ? ["Reducí el ritmo", "Volvé al cuerpo", "Menos pantalla, más presencia"]
    : ["Profundizá vínculos", "Elegí actos conscientes", "Escuchá más"];

  list.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tips.appendChild(li);
  });
}

// ================================
// REINICIO
// ================================
function restart() {
  document.getElementById("results").classList.add("hidden");
  document.getElementById("test").classList.add("hidden");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("start").classList.remove("hidden");
}

// ================================
// PRIVACIDAD
// ================================
function showPrivacy() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("privacy").classList.remove("hidden");
}
