const WEEKS = [
  {
    title: "Semana 1 · Vos ante el mundo",
    questions: [
      ["¿Te afecta el dolor ajeno?", "Mide empatía global."],
      ["¿Te entristecen las guerras?", "Mide sensibilidad humana."],
      ["¿Sentís responsabilidad colectiva?", "Mide conciencia social."],
      ["¿Te importa lo que pasa lejos?", "Mide humanidad expandida."]
    ]
  },
  {
    title: "Semana 2 · Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular cuando estás con otros?", "Mide presencia real."],
      ["¿La pantalla te absorbe emocionalmente?", "Mide dependencia digital."],
      ["¿Escuchás sin mirar el teléfono?", "Mide atención humana."],
      ["¿Elegís contacto real cuando podés?", "Mide prioridad humana."]
    ]
  },
  {
    title: "Semana 3 · Vínculos cotidianos",
    questions: [
      ["¿Escuchás sin interrumpir?", "Mide respeto."],
      ["¿Respondés con empatía?", "Mide conciencia emocional."],
      ["¿Cuidás el vínculo aun en conflicto?", "Mide intención afectiva."],
      ["¿Evitás reaccionar impulsivamente?", "Mide autorregulación."]
    ]
  },
  {
    title: "Semana 4 · Integración humana",
    questions: [
      ["¿Sentís coherencia interna?", "Mide alineación."],
      ["¿Te observás sin juzgarte?", "Mide conciencia."],
      ["¿Asumís tu impacto en otros?", "Mide responsabilidad."],
      ["¿Percibís evolución humana?", "Mide integración."]
    ]
  }
];

let week = 0;
let q = 0;
let score = 0;
let monthlyScores = [];

function startV2() {
  week = 0;
  q = 0;
  score = 0;
  monthlyScores = [];
  show("weekly");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  document.getElementById("questionMeasure").innerText = w.questions[q][1];
  updateThermo();
}

function answerV2(v) {
  score += v;
  q++;
  updateThermo();

  if (q >= 4) {
    showWeeklyResult();
  } else {
    loadQuestion();
  }
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = score / 4;

  let text, advice;

  if (avg < 0.8) {
    text = "Esta semana mostró desconexión interna.";
    advice = "Observar sin juzgar es el primer paso.";
  } else if (avg < 1.5) {
    text = "Tu humanidad estuvo presente con fluctuaciones.";
    advice = "Sostener atención consciente puede estabilizarla.";
  } else {
    text = "Mostraste coherencia humana esta semana.";
    advice = "Seguir así fortalece tu equilibrio interno.";
  }

  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

function continueV2() {
  monthlyScores.push(score / 4);
  score = 0;
  q = 0;
  week++;

  if (week >= 4) {
    showMonthlyResult();
  } else {
    show("weekly");
    loadQuestion();
  }
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg =
    monthlyScores.reduce((a, b) => a + b, 0) / monthlyScores.length;

  let symbol, text, advice;

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad estuvo retraída este mes.";
    advice = "Detenerte y observar puede reactivar tu sensibilidad.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños actos conscientes pueden impulsarte.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad está en expansión.";
    advice = "Sostener esta coherencia fortalece tu camino humano.";
  }

  document.getElementById("monthlySymbol").innerText = symbol;
  document.getElementById("monthlyText").innerText = text;
  document.getElementById("monthlyAdvice").innerText = advice;
}

function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

function show(id) {
  ["start","weekly","weeklyResult","monthlyResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
