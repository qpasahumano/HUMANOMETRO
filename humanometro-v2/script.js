/* =========================
   CONFIG
========================= */
const DEV_MODE = true;
const V2_STORAGE = "humanometro_v2";
const V2_DELAY_DAYS = 7;

/* =========================
   DATOS
========================= */
const V2_WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el dolor ajeno?", "Empatía global"],
      ["¿Te entristecen las guerras?", "Sensibilidad humana"],
      ["¿Sentís responsabilidad colectiva?", "Conciencia social"],
      ["¿Te importa lo que pasa lejos?", "Humanidad expandida"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular?", "Presencia real"],
      ["¿La pantalla te absorbe?", "Dependencia digital"],
      ["¿Escuchás sin mirar el teléfono?", "Atención humana"],
      ["¿Elegís contacto real?", "Prioridad humana"]
    ]
  },
  {
    title: "Vínculos cotidianos",
    questions: [
      ["¿Escuchás sin interrumpir?", "Respeto"],
      ["¿Respondés con empatía?", "Conciencia emocional"],
      ["¿Cuidás el vínculo?", "Intención afectiva"],
      ["¿Evitás reaccionar?", "Autorregulación"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia interna?", "Alineación"],
      ["¿Te observás sin juzgar?", "Conciencia"],
      ["¿Asumís tu impacto?", "Responsabilidad"],
      ["¿Sentís evolución humana?", "Integración"]
    ]
  }
];

/* =========================
   ESTADO
========================= */
let v2State = JSON.parse(localStorage.getItem(V2_STORAGE)) || {
  week: 0,
  scores: [],
  lastDate: null
};

let v2Q = 0;
let v2WeekScore = 0;

/* =========================
   INICIO
========================= */
function startV2Monthly() {
  if (!DEV_MODE && !canAccessV2()) return;
  v2Q = 0;
  v2WeekScore = 0;
  showV2("v2-monthly");
  loadV2Question();
}

/* =========================
   PREGUNTAS
========================= */
function loadV2Question() {
  const w = V2_WEEKS[v2State.week];
  document.getElementById("v2-week-title").innerText = w.title;
  document.getElementById("v2-question").innerText = w.questions[v2Q][0];
  document.getElementById("v2-note").innerText = w.questions[v2Q][1];
}

function v2Answer(value) {
  v2WeekScore += value;
  v2Q++;

  document.getElementById("v2-thermo-fill").style.width =
    (v2Q / 4) * 100 + "%";

  if (v2Q >= 4) finishV2Week();
  else loadV2Question();
}

/* =========================
   CIERRE SEMANA
========================= */
function finishV2Week() {
  v2State.scores.push(v2WeekScore / 4);
  v2State.week++;
  v2State.lastDate = Date.now();
  localStorage.setItem(V2_STORAGE, JSON.stringify(v2State));

  if (v2State.week >= 4) showV2Result();
  else restartV2();
}

/* =========================
   RESULTADO FINAL
========================= */
function showV2Result() {
  showV2("v2-result");

  const avg =
    v2State.scores.reduce((a, b) => a + b, 0) / v2State.scores.length;

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

  document.getElementById("v2-symbol").innerText = symbol;
  document.getElementById("v2-result-text").innerText = text;
  document.getElementById("v2-advice").innerText = advice;
}

/* =========================
   BLOQUEO
========================= */
function canAccessV2() {
  if (v2State.week === 0) return true;
  const days =
    (Date.now() - v2State.lastDate) / (1000 * 60 * 60 * 24);
  return days >= V2_DELAY_DAYS;
}

/* =========================
   UI
========================= */
function showV2(id) {
  ["start", "v2-monthly", "v2-result"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restartV2() {
  showV2("start");
}
