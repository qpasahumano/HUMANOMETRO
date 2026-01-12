const DEV_MODE = true;
const STORAGE = "humanometro_v2";

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras u conflictos, ¿te genera tristeza?", "Mide empatía global."],
      ["Cuando alguien te habla, ¿le prestás atención sin mirar el celular?", "Mide presencia humana."],
      ["¿Sentís impulso de involucrarte ante una injusticia?", "Mide compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Mide sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés dejar el celular cuando compartís con otros?", "Mide uso consciente."],
      ["¿Controlás el tiempo que pasás en pantallas?", "Mide autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Mide empatía digital."],
      ["¿La tecnología te acompaña sin absorberte?", "Mide equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Sentís coherencia entre lo que pensás y hacés?", "Mide alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Mide autoconciencia."],
      ["¿Te sentís responsable de tu impacto?", "Mide madurez humana."],
      ["¿Sentís que tu humanidad evolucionó este mes?", "Mide integración global."]
    ]
  }
];

let state = JSON.parse(localStorage.getItem(STORAGE)) || {
  week: 0,
  scores: []
};

let qIndex = 0;
let weekScore = 0;

function startV2() {
  qIndex = 0;
  weekScore = 0;
  show("week");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[state.week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[qIndex][0];
  document.getElementById("questionNote").innerText = w.questions[qIndex][1];
}

function answer(v) {
  weekScore += v;
  qIndex++;
  document.getElementById("thermoFill").style.width = (qIndex / 4) * 100 + "%";

  if (qIndex >= 4) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  const avg = weekScore / 4;
  let animal, text, advice;

  if (avg < 0.8) {
    animal = "🦇";
    text = "Tu humanidad mostró un repliegue esta semana.";
    advice = "Observá dónde te cerraste y elegí un gesto consciente.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Un pequeño acto más puede inclinar la balanza.";
  } else {
    animal = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta apertura fortalece tu coherencia.";
  }

  document.getElementById("animal").innerText = animal;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  state.scores.push(avg);
  localStorage.setItem(STORAGE, JSON.stringify(state));
  show("weeklyResult");
}

function continueFlow() {
  state.week++;
  localStorage.setItem(STORAGE, JSON.stringify(state));

  if (state.week < WEEKS.length) show("start");
  else showMonthlyResult();
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg = state.scores.reduce((a,b)=>a+b,0) / state.scores.length;
  const fill = document.getElementById("monthlyFill");

  let current = 0;
  const target = Math.round((avg / 2) * 100);

  const interval = setInterval(() => {
    current++;
    fill.style.height = current + "%";
    if (current >= target) clearInterval(interval);
  }, 25);

  setTimeout(() => {
    document.getElementById("monthlyText").innerText =
      avg < 0.8 ? "Tu humanidad necesita pausa y revisión."
      : avg < 1.5 ? "Tu humanidad estuvo activa, aunque inestable."
      : "Tu humanidad mostró integración y crecimiento.";

    document.getElementById("monthlyAdvice").innerText =
      avg < 0.8 ? "Reducí estímulos y priorizá presencia real."
      : avg < 1.5 ? "Elegí conscientemente un vínculo a cuidar."
      : "Continuá sosteniendo actos coherentes día a día.";
  }, 3500);
}

function show(id) {
  ["start","week","weeklyResult","monthlyResult"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}
