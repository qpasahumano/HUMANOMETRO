const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Mide empatía global."],
      ["Cuando alguien te habla, ¿dejás el celular?", "Mide presencia humana."],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Mide compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Mide sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Mide uso consciente."],
      ["¿Controlás el tiempo en pantallas?", "Mide autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Mide empatía digital."],
      ["¿La tecnología acompaña sin absorberte?", "Mide equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Mide alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Mide autoconciencia."],
      ["¿Asumís tu impacto en otros?", "Mide responsabilidad."],
      ["¿Sentís que tu humanidad evolucionó?", "Mide integración global."]
    ]
  }
];

let week = 0;
let q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2() {
  week = 0;
  q = 0;
  weeklyScores = [];
  currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  document.getElementById("questionMeasure").innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();

  if (q >= 4) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = currentScore / 4;

  let symbol = "🐞";
  let text = "";
  let advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu humanidad mostró una retracción consciente.";
    advice =
      "No como falla, sino como señal. Cuando la sensibilidad baja, suele ser momento de pausa y revisión interna.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad se mantuvo presente, aunque con fluctuaciones.";
    advice =
      "Hubo conciencia en algunos momentos y automatismo en otros. Observar esas variaciones es parte del proceso.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad mostró coherencia y expansión.";
    advice =
      "Existe alineación entre lo que sentís, pensás y hacés. Sostener esta apertura requiere cuidado y descanso.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  weeklyScores.push(avg);
}

function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) {
    showFinalResult();
  } else {
    show("test");
    loadQuestion();
  }
}

function showFinalResult() {
  show("monthlyResult");

  const avg =
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  // Termómetro vivo
  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 300);

  // Devolución después de la bajada
  setTimeout(() => {
    let text = "";

    if (avg < 0.8) {
      text =
        "Este recorrido mostró una desconexión entre intención y acción. No es un error: es información. La conciencia empieza cuando algo se hace visible.";
    } else if (avg < 1.5) {
      text =
        "Tu recorrido mostró presencia humana intermitente. Hubo momentos de claridad y otros de respuesta automática. Reconocerlos abre profundidad.";
    } else {
      text =
        "Este recorrido reflejó coherencia interna. No perfección, sino conciencia activa. La sensibilidad está viva y en movimiento.";
    }

    document.getElementById("monthlyText").innerText = text;
    document.getElementById("monthlyAdvice").innerHTML = `
      <button class="primary" onclick="goToMirror()">
        Verte al espejo
      </button>
    `;
  }, 2500);
}

function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q / 4) * 100 + "%";
}

function show(id) {
  ["start", "test", "weeklyResult", "monthlyResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}

function goToMirror() {
  // Enganche preparado a Volumen 3
  window.location.href = "./humanometro-v3/";
}
