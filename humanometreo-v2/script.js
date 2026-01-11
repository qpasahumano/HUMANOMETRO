const QUESTIONS = [
  "¿Te afectó emocionalmente alguna noticia reciente?",
  "¿Escuchaste con atención a alguien esta semana?",
  "¿Actuaste con empatía ante una situación difícil?",
  "¿Sentís coherencia entre lo que pensás y hacés?"
];

let index = 0;
let score = 0;

function startTest() {
  index = 0;
  score = 0;
  show("test");
  loadQuestion();
  updateThermo();
}

function loadQuestion() {
  document.getElementById("title").innerText = "Pregunta " + (index + 1);
  document.getElementById("question").innerText = QUESTIONS[index];
}

function answer(value) {
  score += value;
  index++;
  updateThermo();

  if (index >= QUESTIONS.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function showResult() {
  show("result");
  const avg = score / QUESTIONS.length;

  let text = "Humanidad estable esta semana.";
  if (avg < 0.8) text = "Tu humanidad estuvo baja esta semana.";
  else if (avg < 1.5) text = "Tu humanidad se mantuvo estable.";
  else text = "Tu humanidad mostró crecimiento.";

  document.getElementById("resultText").innerText = text;
}

function restart() {
  show("start");
}

function show(id) {
  ["start","test","result"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

function updateThermo() {
  const pct = (index / QUESTIONS.length) * 100;
  document.getElementById("thermoFill").style.width = pct + "%";
}
/* =========================
   HUMANÓMETRO V2 – MENSUAL
========================= */

const DEV_MODE = true; // ← vos
const V2_DELAY_DAYS = 7;
const V2_STORAGE = "humanometro_v2";

const V2_WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["¿Te afecta el dolor ajeno?", "Mide empatía global."],
      ["¿Te entristecen las guerras?", "Mide sensibilidad humana."],
      ["¿Sentís responsabilidad colectiva?", "Mide conciencia social."],
      ["¿Te importa lo que pasa lejos?", "Mide humanidad expandida."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular?", "Mide presencia real."],
      ["¿La pantalla te absorbe?", "Mide dependencia digital."],
      ["¿Escuchás sin mirar el teléfono?", "Mide atención humana."],
      ["¿Elegís contacto real?", "Mide prioridad humana."]
    ]
  },
  {
    title: "Vínculos cotidianos",
    questions: [
      ["¿Escuchás sin interrumpir?", "Mide respeto."],
      ["¿Respondés con empatía?", "Mide conciencia emocional."],
      ["¿Cuidás el vínculo?", "Mide intención afectiva."],
      ["¿Evitás reaccionar?", "Mide autorregulación."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia interna?", "Mide alineación."],
      ["¿Te observás sin juzgar?", "Mide conciencia."],
      ["¿Asumís tu impacto?", "Mide responsabilidad."],
      ["¿Sentís evolución humana?", "Mide integración."]
    ]
  }
];

let v2State = JSON.parse(localStorage.getItem(V2_STORAGE)) || {
  week: 0,
  scores: [],
  lastDate: null
};

let v2Q = 0;
let v2WeekScore = 0;

/* INICIO V2 */
function startV2Monthly() {
  if (!DEV_MODE && !v2CanAccess()) return;
  v2Q = 0;
  v2WeekScore = 0;
  showSection("v2-monthly");
  v2LoadQuestion();
}

/* CARGA */
function v2LoadQuestion() {
  const w = V2_WEEKS[v2State.week];
  document.getElementById("v2-week-title").innerText = w.title;
  document.getElementById("v2-question").innerText = w.questions[v2Q][0];
  document.getElementById("v2-note").innerText = w.questions[v2Q][1];
}

/* RESPUESTA */
function v2Answer(v) {
  v2WeekScore += v;
  v2Q++;
  document.getElementById("v2-thermo-fill").style.width =
    (v2Q / 4) * 100 + "%";

  if (v2Q >= 4) v2FinishWeek();
  else v2LoadQuestion();
}

/* FIN SEMANA */
function v2FinishWeek() {
  v2State.scores.push(v2WeekScore / 4);
  v2State.week++;
  v2State.lastDate = Date.now();
  localStorage.setItem(V2_STORAGE, JSON.stringify(v2State));

  if (v2State.week >= 4) v2MonthlyResult();
  else restart();
}

/* RESULTADO FINAL */
function v2MonthlyResult() {
  showSection("v2-result");
  const avg =
    v2State.scores.reduce((a,b)=>a+b,0) / v2State.scores.length;

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

/* BLOQUEO */
function v2CanAccess() {
  if (v2State.week === 0) return true;
  const days =
    (Date.now() - v2State.lastDate) / (1000*60*60*24);
  return days >= V2_DELAY_DAYS;
       }
