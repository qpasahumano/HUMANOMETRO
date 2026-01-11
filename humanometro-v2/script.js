/* ======================
   DATOS MENSUALES
====================== */

const V2_WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afectó emocionalmente el dolor ajeno?", "Sensibilidad humana."],
      ["¿Te impactan las injusticias aunque no te toquen directo?", "Conciencia colectiva."],
      ["¿Evitaste anestesiarte emocionalmente?", "Presencia interna."],
      ["¿Sentiste responsabilidad por lo común?", "Humanidad expandida."]
    ]
  },
  {
    title: "Tecnología y presencia",
    questions: [
      ["¿Pudiste soltar la pantalla conscientemente?", "Dominio atencional."],
      ["¿Elegiste presencia real?", "Prioridad humana."],
      ["¿Escuchaste sin mirar el teléfono?", "Disponibilidad real."],
      ["¿Notaste saturación digital?", "Autopercepción."]
    ]
  },
  {
    title: "Vínculos cotidianos",
    questions: [
      ["¿Escuchaste sin interrumpir?", "Respeto vincular."],
      ["¿Regulaste tu reacción emocional?", "Autorregulación."],
      ["¿Cuidaste el vínculo incluso en tensión?", "Conciencia afectiva."],
      ["¿Elegiste empatía antes que defensa?", "Madurez humana."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Sentiste coherencia interna?", "Alineación."],
      ["¿Te observaste sin juzgar?", "Conciencia plena."],
      ["¿Asumiste tu impacto?", "Responsabilidad."],
      ["¿Percibís evolución personal?", "Integración."]
    ]
  }
];

let week = 0;
let qIndex = 0;
let scores = [];

/* ======================
   INICIO
====================== */

function startV2Monthly() {
  week = 0;
  qIndex = 0;
  scores = [];
  show("v2-test");
  loadQuestion();
}

/* ======================
   PREGUNTAS
====================== */

function loadQuestion() {
  const w = V2_WEEKS[week];
  document.getElementById("v2-week-title").innerText = w.title;
  document.getElementById("v2-question").innerText = w.questions[qIndex][0];
  document.getElementById("v2-note").innerText = w.questions[qIndex][1];

  document.getElementById("v2-thermo-fill").style.width =
    ((qIndex) / 4) * 100 + "%";
}

function v2Answer(value) {
  scores.push(value);
  qIndex++;

  document.getElementById("v2-thermo-fill").style.width =
    (qIndex / 4) * 100 + "%";

  if (qIndex >= 4) {
    week++;
    qIndex = 0;

    if (week >= 4) {
      showResult();
    } else {
      loadQuestion();
    }
  } else {
    loadQuestion();
  }
}

/* ======================
   RESULTADO
====================== */

function showResult() {
  show("v2-result");

  const avg = scores.reduce((a,b)=>a+b,0) / scores.length;

  let symbol = "🐞";
  let text = "Tu humanidad se sostuvo en equilibrio.";
  let advice = "Observarte sin exigencia fortalece tu proceso.";

  if (avg < 0.8) {
    symbol = "🦇";
    text = "Tu sensibilidad estuvo retraída este mes.";
    advice = "Detenerte y sentir puede reactivar tu humanidad.";
  } else if (avg > 1.5) {
    symbol = "🐦";
    text = "Tu conciencia humana está en expansión.";
    advice = "Sostener coherencia refuerza tu camino interno.";
  }

  document.getElementById("v2-symbol").innerText = symbol;
  document.getElementById("v2-result-text").innerText = text;
  document.getElementById("v2-advice").innerText = advice;
}

/* ======================
   NAVEGACIÓN
====================== */

function restartV2() {
  show("v2-start");
}

function show(id) {
  ["v2-start","v2-test","v2-result"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
       }
