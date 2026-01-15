/* ================= VOLUMEN 2 ================= */

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Empatía global"],
      ["Cuando alguien te habla, ¿dejás el celular?", "Presencia humana"],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Compromiso"],
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Uso consciente"],
      ["¿Controlás el tiempo en pantallas?", "Autocontrol"],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Empatía digital"],
      ["¿La tecnología acompaña sin absorberte?", "Equilibrio"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Coherencia"],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"],
      ["¿Sentís evolución humana?", "Integración"]
    ]
  }
];

let week = 0, q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2() {
  week = 0; q = 0; weeklyScores = []; currentScore = 0;
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

  let symbol = "🐞", text = "", advice = "";
  if (avg < 0.8) {
    symbol = "🦇";
    text = "Desconexión humana esta semana.";
    advice = "Detenerte puede ayudarte a integrar.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Humanidad estable.";
    advice = "Pequeños gestos suman.";
  } else {
    symbol = "🐦";
    text = "Humanidad en crecimiento.";
    advice = "Sostené esta coherencia.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

function nextWeek() {
  week++; q = 0; currentScore = 0;
  if (week >= WEEKS.length) showMonthlyResult();
  else { show("test"); loadQuestion(); }
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  setTimeout(()=>{
    document.getElementById("monthlyFill").style.height =
      Math.round((avg/2)*100)+"%";
  },300);

  setTimeout(()=>{
    document.getElementById("monthlyText").innerText =
      "Este recorrido refleja tu humanidad en movimiento.";
    document.getElementById("monthlyAdvice").innerHTML =
      `<button class="primary" onclick="openMirror()">Entrar al espejo</button>`;
  },1500);
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  "¿Qué emoción predominó realmente ante una situación significativa?",
  "¿Cuánto tiempo permaneciste en esa emoción?",
  "¿Tomaste conciencia después de haber reaccionado?",
  "¿Lo que hiciste fue coherente con lo que sentías?",
  "¿Esa reacción impactó en vínculos cercanos?",
  "¿Actuaste en automático o con presencia?",
  "¿Asumiste responsabilidad emocional?",
  "¿Integraste lo vivido en estas semanas?"
];

let mq = 0;
let mirrorScore = 0;
let mirrorCount = 0;

function openMirror() {
  show("mirrorIntro");
}

function startMirror() {
  mq = 0; mirrorScore = 0; mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  document.getElementById("mirrorQuestion").innerText =
    MIRROR_QUESTIONS[mq];
}

function answerMirror(v) {
  if (v !== null) {
    mirrorScore += v;
    mirrorCount++;
  }
  mq++;
  if (mq >= MIRROR_QUESTIONS.length) showMirrorResult();
  else loadMirrorQuestion();
}

function showMirrorResult() {
  show("mirrorResult");

  const avg = mirrorCount === 0 ? 0 : mirrorScore / mirrorCount;

  let state = "", shortText = "", fullText = "";

  if (avg < 0.8) {
    state = "Opaco";
    shortText =
      "El reflejo aparece distorsionado. No porque falte humanidad, sino porque las emociones no están siendo integradas.";
    fullText =
      "La incongruencia no apaga tu humanidad, pero la vuelve inestable. Cuando la emoción no se integra al pensamiento y la acción, la experiencia no deja aprendizaje.";
  } else if (avg < 1.5) {
    state = "Intermedio";
    shortText =
      "El reflejo es inestable. Hay conciencia, pero aún no se sostiene en el tiempo.";
    fullText =
      "Hay momentos de presencia y momentos de automatismo. La clave no es forzar el cambio, sino habitar lo que sentís con mayor continuidad.";
  } else {
    state = "Lúcido";
    shortText =
      "El reflejo es claro. Lo que sentís, pensás y hacés empieza a alinearse.";
    fullText =
      "La congruencia sostenida no es perfección: es presencia. Cuando emoción, pensamiento y acción dialogan, la humanidad se expande y se vuelve consciente.";
  }

  document.getElementById("mirrorState").innerText = state;
  document.getElementById("mirrorShortText").innerText = shortText;
  document.getElementById("mirrorFullText").innerText =
    fullText +
    "\n\nLa humanidad no se pierde, pero se apaga cuando no se la habita conscientemente.";

  setTimeout(()=>{
    document.getElementById("mirrorFill").style.height =
      Math.round((avg/2)*100)+"%";
  },300);
}

/* ================= UTILIDADES ================= */

function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q/4)*100+"%";
}

function show(id) {
  [
    "start","test","weeklyResult","monthlyResult",
    "mirrorIntro","mirrorTest","mirrorResult"
  ].forEach(s=>{
    const el=document.getElementById(s);
    if(el) el.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
