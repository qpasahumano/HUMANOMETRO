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
  weeklyScores.push(avg);

  let symbol = "🐞";
  let text = "";
  let advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Esta semana mostró una desconexión humana.";
    advice = "Puede indicar cansancio emocional, automatismo o distancia de lo que sentís.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Hubo momentos de presencia y otros de dispersión. Estás en proceso.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Se observa mayor coherencia entre sentir, pensar y actuar.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

function nextWeek() {
  week++;
  q = 0;
  currentScore = 0;

  if (week >= WEEKS.length) showFinalResult();
  else {
    show("test");
    loadQuestion();
  }
}

function showFinalResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  const fill = document.getElementById("monthlyFill");
  fill.style.height = "0%";

  setTimeout(() => {
    fill.style.height = Math.round((avg / 2) * 100) + "%";
  }, 300);

  setTimeout(() => {
    let symbol = "🐞";
    let text = "";
    let advice = "";

    if (avg < 0.8) {
      symbol = "🦇";
      text = "Tu humanidad estuvo retraída en estos días.";
      advice =
        "No como un fallo, sino como una señal. Puede haber sobrecarga, cierre emocional o desconexión con lo que sentís. Detenerte y observar es el primer paso para reordenarte.";
    } else if (avg < 1.5) {
      symbol = "🐞";
      text = "Tu humanidad se expresó de forma intermitente.";
      advice =
        "Hubo momentos de presencia real y otros de automatismo. Este estado habla de una conciencia activa, aunque aún inestable. Pequeños gestos diarios pueden ordenar ese equilibrio.";
    } else {
      symbol = "🐦";
      text = "Tu humanidad muestra coherencia y expansión.";
      advice =
        "Se observa alineación entre lo que sentís, pensás y hacés. No es perfección, es congruencia. Este estado fortalece tu vínculo con vos y con los demás.";
    }

    document.getElementById("monthlySymbol").innerText = symbol;
    document.getElementById("monthlyText").innerText = text;
    document.getElementById("monthlyAdvice").innerText = advice;

    document.getElementById("monthlyAdvice").insertAdjacentHTML(
      "afterend",
      `<button class="primary" onclick="goToMirror()">Verte al espejo</button>`
    );

  }, 1800);
}

function goToMirror() {
  window.location.href = "../volumen3/index.html";
}

function updateThermo() {
  document.getElementById("thermoFill").style.width = (q / 4) * 100 + "%";
}

function show(id) {
  ["start", "test", "weeklyResult", "monthlyResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
