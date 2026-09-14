const $ = id => document.getElementById(id);

/* ===============================
   BLOQUEO SEMANAL — CONFIG
================================ */
const DEV_MODE = false;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const V2_BLOCK_KEY = "hm_v2_last_week";
const V2_STATE_KEY = "hm_v2_progress_state";

/* ===============================
   UTILIDADES Y PERSISTENCIA
================================ */
function now(){ return Date.now(); }

function pasoUnaSemana(){
  if (DEV_MODE) return true;
  const last = localStorage.getItem(V2_BLOCK_KEY);
  if (!last) return true;
  return (now() - Number(last)) >= WEEK_MS;
}

function marcarSemana(){
  localStorage.setItem(V2_BLOCK_KEY, now());
}

function saveV2State(extra = {}) {
  const state = {
    week,
    q,
    currentScore,
    weeklyScores,
    allAnswers,
    mirrorLog,
    mq,
    mirrorScore,
    lastSection: document.querySelector("section:not(.hidden)")?.id || "start",
    timestamp: now(),
    ...extra
  };
  localStorage.setItem(V2_STATE_KEY, JSON.stringify(state));
}

function loadV2State() {
  const raw = localStorage.getItem(V2_STATE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function finalizarYReiniciar() {
  localStorage.removeItem(V2_BLOCK_KEY);
  localStorage.removeItem(V2_STATE_KEY);
  localStorage.removeItem("hm_v1_block_recorrido");
  localStorage.removeItem("hm_v1_block_volve_pronto");
  localStorage.removeItem("hm_v1_state");
  window.location.href = "../";
}

/* ===============================
   BLOQUEO VISUAL UNIFICADO
================================ */
function showWeeklyBlockFlash(){
  const d = document.createElement("div");
  d.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    pointer-events:none;
    font-size:1.35rem;
    color:#eaffff;
    background:
      radial-gradient(circle, rgba(180,255,255,.28), transparent 60%),
      rgba(6,18,40,.45);
    text-shadow:
      0 0 12px rgba(140,255,240,1),
      0 0 26px rgba(140,255,240,.85);
    z-index:9999;
    animation: blockFade 1.3s ease-out forwards;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1300);
}

/* ===============================
   CACHE DOM Y DATOS BASE
================================ */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const weeklyTextWrap = $("weeklyTextWrap");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");

const finalFill = $("finalFill");
const finalTextWrap = $("finalTextWrap");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍🌫️","😊","🫥"];

const WEEKS = [
  { title:"Vos ante el mundo", questions:[
    ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
    ["Когда alguien te habla, ¿dejás el celular?","Presencia humana"],
    ["¿Sentís impulso de involucrarte ante injusticias?","Compromiso humano"],
    ["¿Te afecta el sufrimiento ajeno?","Sensibilidad emocional"]
  ]},
  { title:"Vos y la tecnología", questions:[
    ["¿Podés soltar el celular al compartir?","Uso consciente"],
    ["¿Controlás el tiempo en pantallas?","Autocontrol digital"],
    ["¿Recordás que hay personas reales detrás de una pantalla?","Empatía digital"],
    ["¿La tecnología acompaña sin absorberte?","Equilibrio tecnológico"]
  ]},
  { title:"Integración humana", questions:[
    ["¿Hay coherencia entre lo que pensás y hacés?","Coherencia"],
    ["¿Podés observarte sin juzgarte?","Autoconciencia"],
    ["¿Asumís tu impacto en otros?","Responsabilidad"],
    ["¿Sentís evolución humana?","Integración"]
  ]}
];

const MIRROR_QUESTIONS = [
  { t:"Cuando algo en la calle, en una conversación o en una situación cotidiana no sale como esperabas, ¿cuánto enojo sentís internamente, más allá de lo que muestres hacia afuera?" },
  { t:"Cuando te enterás de una situación difícil, injusta o dolorosa —ya sea propia o ajena—, ¿cuánta tristeza aparece en vos de forma real, aunque no la expreses?" },
  { t:"Cuando tenés que tomar una decisión importante o enfrentar una situación incierta, ¿cuánto miedo sentís antes de actuar, incluso si seguís avanzando igual?" },
  { t:"Cuando recordás algo que dijiste, hiciste o dejaste de hacer, ¿cuánto culpa aparece después, aunque intentes justificarte o seguir adelante?" },
  { t:"Cuando se acumulan responsabilidades, demandas externas o presiones internas, ¿cuánta ansiedad sentís en tu cuerpo o en tu mente, aunque continúes funcionando?" },
  { t:"Cuando estás con personas importantes para vos, ¿cuánta desconexión emocional sentís, aun estando físicamente presente?" },
  { t:"Cuando vivís un momento simple, sin exigencias ni expectativas, ¿cuánta alegría genuina sentís, sin necesidad de estímulos externos?" },
  { t:"Cuando aparece una emoción incómoda que no sabés nombrar del todo, ¿cuánto tendés a evitarla, minimizarla o distraerte para no sentirla?" }
];

let week = 0, q = 0, currentScore = 0;
let weeklyScores = [], allAnswers = [], mirrorLog = [];
let mq = 0, mirrorScore = 0;

/* ===============================
   REANUDACIÓN AUTOMÁTICA EN V2
================================ */
(function resumeV2() {
  const saved = loadV2State();
  if (!saved) return;

  week = saved.week || 0;
  q = saved.q || 0;
  currentScore = saved.currentScore || 0;
  weeklyScores = saved.weeklyScores || [];
  allAnswers = saved.allAnswers || [];
  mirrorLog = saved.mirrorLog || [];
  mq = saved.mq || 0;
  mirrorScore = saved.mirrorScore || 0;

  if (saved.lastSection) {
    if (
      (saved.lastSection === "mirrorIntro" ||
       saved.lastSection === "mirrorTest" ||
       saved.lastSection === "finalResult") &&
      !pasoUnaSemana()
    ) {
      show("monthlyResult");
      updateThermometer(calculateHistoricalPercentage());
      saveV2State({ lastSection: "monthlyResult" });
      return;
    }

    show(saved.lastSection);

    if (saved.lastSection === "test") {
      loadQuestion();
    } else if (saved.lastSection === "weeklyResult") {
      updateThermometer(calculateCurrentPercentage());
    } else if (saved.lastSection === "monthlyResult" || saved.lastSection === "mirrorIntro") {
      updateThermometer(calculateHistoricalPercentage());
    } else if (saved.lastSection === "mirrorTest") {
      loadMirror();
    } else if (saved.lastSection === "finalResult") {
      showFinalResults();
    }
  }
})();

/* ===============================
   FLUJO PRINCIPAL V2
================================ */
function startV2(){
  const saved = loadV2State();

  if (saved && (saved.week > 0 || (saved.lastSection && saved.lastSection !== "start"))) {
    show(saved.lastSection || "test");
    if (saved.lastSection === "test" || !saved.lastSection) {
      loadQuestion();
    } else if (saved.lastSection === "weeklyResult") {
      updateThermometer(calculateCurrentPercentage());
    } else if (saved.lastSection === "monthlyResult" || saved.lastSection === "mirrorIntro") {
      if (!pasoUnaSemana()) {
        showWeeklyBlockFlash();
        show("monthlyResult");
        updateThermometer(calculateHistoricalPercentage());
        saveV2State({ lastSection: "monthlyResult" });
        return;
      }
      updateThermometer(calculateHistoricalPercentage());
    } else if (saved.lastSection === "mirrorTest") {
      if (!pasoUnaSemana()) {
        showWeeklyBlockFlash();
        show("monthlyResult");
        updateThermometer(calculateHistoricalPercentage());
        saveV2State({ lastSection: "monthlyResult" });
        return;
      }
      loadMirror();
    } else if (saved.lastSection === "finalResult") {
      showFinalResults();
    }
    return;
  }

  document.body.classList.remove("mirror-bg");
  week = 0;
  q = 0;
  currentScore = 0;
  weeklyScores = [];
  allAnswers = [];
  mirrorLog = [];
  mq = 0;
  mirrorScore = 0;

  saveV2State({ lastSection: "test" });
  show("test");
  loadQuestion();
}

function loadQuestion(){
  const w = WEEKS[week];
  if (!w) return;

  weekTitle.textContent = w.title;
  questionText.textContent = w.questions[q][0];
  questionMeasure.textContent = w.questions[q][1];
  
  const totalQIndex = (week * 4) + q;
  const pct = Math.round((totalQIndex / (WEEKS.length * 4)) * 100);
  updateThermometer(pct);
}

function answer(v){
  currentScore += v;
  allAnswers.push({ block: WEEKS[week].title, q, v });
  q++;

  saveV2State({ q, currentScore, allAnswers });
  q >= 4 ? showWeekly() : loadQuestion();
}

/* ===============================
   DEVOLUCIONES SEMANALES
================================ */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");
  
  const avg = currentScore / 4;
  weeklyScores.push(avg);
  
  updateThermometer(calculateCurrentPercentage());

  const range = avg <= 0.6 ? "low" : avg <= 0.9 ? "midLow" : avg <= 1.4 ? "mid" : "high";
  weeklySymbol.textContent = range === "low" || range === "midLow" ? "🦇" : range === "mid" ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent = "Lo que ocurre en el mundo no siempre logra atravesarte.\n\nEl dolor ajeno, las injusticias o los conflictos pueden aparecer como información lejana, sin generar un impacto emocional sostenido.\n\nEsto no habla de falta de humanidad, sino de posibles mecanismos de defensa, cansancio o saturación emocional.";
      weeklyAdvice.textContent = "Observar cuándo te cerrás y cuándo te abrís al otro puede ser el primer gesto de reconexión humana.";
    } else {
      weeklyText.textContent = "El mundo no pasa desapercibido.\n\nHay registro del dolor, de la injusticia y de lo que afecta a otros seres humanos.";
      weeklyAdvice.textContent = "Sostener esta sensibilidad sin que te abrume es parte de un equilibrio humano maduro.";
    }
  } else if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent = "La atención aparece fragmentada.\n\nLa tecnología tiende a absorber momentos que podrían ser habitados con mayor presencia.\n\nNo como error, sino como hábito automatizado.";
      weeklyAdvice.textContent = "Pequeños cortes conscientes pueden devolver densidad a la experiencia cotidiana.";
    } else {
      weeklyText.textContent = "Lo digital acompaña sin dominar.\n\nHay uso consciente y registro del presente.";
      weeklyAdvice.textContent = "Este equilibrio sostiene vínculos más reales y una experiencia más encarnada.";
    }
  } else if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent = "Se perciben fisuras entre pensamiento, emoción y acción.\n\nNo siempre lo que sentís logra expresarse ni lo que pensás logra sostenerse en el hacer.";
      weeklyAdvice.textContent = "Nombrar estas incongruencias no es debilidad: es el inicio del proceso de integración.";
    } else {
      weeklyText.textContent = "Las respuestas muestran una percepción de coherencia interna.\n\nEsta lectura se limita a cómo te pensás y te observás a vos mismo.\n\nCómo esta coherencia se expresa en el vínculo con el mundo y la tecnología se observa en el siguiente tramo.";
      weeklyAdvice.textContent = "";
    }
  }

  saveV2State({ lastSection: "weeklyResult", weeklyScores });
  setTimeout(() => weeklyTextWrap.classList.remove("hidden"), 900);
}

function nextWeek(){
  week++;
  q = 0;
  currentScore = 0;

  const isFinished = week >= WEEKS.length;

  if (isFinished) {
    marcarSemana();
    saveV2State({ week, q, currentScore, lastSection: "monthlyResult" });
    showMonthly();
    return;
  }

  saveV2State({ week, q, currentScore, lastSection: "test" });
  show("test");
  loadQuestion();
}

function showMonthly(){
  show("monthlyResult");
  updateThermometer(calculateHistoricalPercentage());
  saveV2State({ lastSection: "monthlyResult" });
}

/* ===============================
   FASE ESPEJO ("TU REFLEJO")
================================ */
function gateMirrorIntro(){
  if(!pasoUnaSemana()){
    showWeeklyBlockFlash();
    return;
  }
  show("mirrorIntro");
  updateThermometer(calculateHistoricalPercentage());
  saveV2State({ lastSection: "mirrorIntro" });
}

function startMirror(){
  if(!pasoUnaSemana()){
    showWeeklyBlockFlash();
    return;
  }

  document.body.classList.add("mirror-bg");
  mq = 0;
  mirrorScore = 0;
  mirrorLog = [];

  saveV2State({ lastSection: "mirrorTest", mq, mirrorScore });
  show("mirrorTest");
  loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent = MIRROR_EMOJIS[mq] || "🫥";
  mirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
  
  const pct = Math.round((mq / MIRROR_QUESTIONS.length) * 100);
  updateThermometer(pct);
}

function answerMirror(v){
  mirrorScore += v;
  mirrorLog.push({ q: mq, v });
  mq++;

  saveV2State({ mq, mirrorScore, mirrorLog });

  if (mq >= MIRROR_QUESTIONS.length) {
    showFinalResults();
  } else {
    loadMirror();
  }
}

/* ===============================
   RESULTADOS FINALES Y CÁLCULOS
================================ */
function showFinalResults(){
  show("finalResult");
  document.body.classList.add("mirror-bg");
  finalTextWrap.classList.remove("hidden");

  const finalPct = calculateFinalPercentage();
  updateThermometer(finalPct);

  if (finalFill) finalFill.style.height = finalPct + "%";

  if (finalPct < 40) {
    finalState.textContent = "Desconexión interna profunda";
    finalHumanText.textContent = "Las respuestas reflejan una tendencia a evitar o reprimir la intensidad emocional. El sistema se protege del impacto, pero esto genera aislamiento interno.";
  } else if (finalPct < 70) {
    finalState.textContent = "Sensibilidad en transición";
    finalHumanText.textContent = "Existe registro de las emociones, aunque con fluctuaciones en la aceptación y la integración. Hay un puente activo entre lo que sentís y cómo lo gestionás.";
  } else {
    finalState.textContent = "Alta integración y presencia";
    finalHumanText.textContent = "Se observa una conexión sincera con la propia emocionalidad. Hay disponibilidad interna para transitar la intensidad sin evadirla.";
  }

  saveV2State({ lastSection: "finalResult" });
}

function calculateCurrentPercentage() {
  if (weeklyScores.length === 0) return 0;
  const currentSum = weeklyScores[weeklyScores.length - 1];
  return Math.round((currentSum / 2) * 100);
}

function calculateHistoricalPercentage() {
  if (weeklyScores.length === 0) return 50;
  const total = weeklyScores.reduce((a, b) => a + b, 0);
  const avg = total / weeklyScores.length;
  return Math.round((avg / 2) * 100);
}

function calculateFinalPercentage() {
  const v2Avg = weeklyScores.length ? (weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length) : 1;
  const mirrorAvg = mirrorLog.length ? (mirrorScore / (mirrorLog.length * 2)) : 0.5;
  const combined = (v2Avg + mirrorAvg) / 2;
  return Math.round((combined / 2) * 100);
}

function updateThermometer(percent) {
  const fills = document.querySelectorAll('.thermo-bar .thermo-fill');
  fills.forEach(fill => {
    if (fill) {
      fill.style.width = percent + '%';
      if (percent <= 33.3) {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 100%)";
      } else if (percent <= 66.6) {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 33.3%, #ffc107 100%)";
      } else {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 33.3%, #ffc107 66.6%, #10b981 100%)";
      }
    }
  });

  const percentageTexts = document.querySelectorAll('.thermo-percentage-val');
  percentageTexts.forEach(txt => {
    txt.textContent = percent + '%';
  });
}

function show(id){
  ["start", "test", "weeklyResult", "monthlyResult", "mirrorIntro", "mirrorTest", "finalResult"]
    .forEach(sec => $(sec)?.classList.add("hidden"));
  $(id)?.classList.remove("hidden");
     }
