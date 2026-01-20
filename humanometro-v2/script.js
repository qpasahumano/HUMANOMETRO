const $ = id => document.getElementById(id);

/* ===============================
   BLOQUEO SEMANAL — CONFIG
   =============================== */
const DEV_MODE = true; // en producción false
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const V2_BLOCK_KEY = "hm_v2_last_week";

/* ===============================
   BLOQUEO — UTILIDADES
   =============================== */
function now(){ return Date.now(); }

function pasoUnaSemana(){
  if(DEV_MODE) return true;
  const last = localStorage.getItem(V2_BLOCK_KEY);
  if(!last) return true;
  return (now() - Number(last)) >= WEEK_MS;
}

function marcarSemana(){
  localStorage.setItem(V2_BLOCK_KEY, now());
}

function textoBloqueo(){
  const d = document.createElement("div");
  d.innerHTML = "No seas ansioso.<br>Tiene que pasar una semana.";
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    pointer-events:none;
    font-size:1.3rem;
    color:white;
    background:radial-gradient(circle,rgba(255,255,255,.18),transparent);
    z-index:9999;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1200);
}

/* ===============================
   CACHE
   =============================== */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");
const thermoFill = $("thermoFill");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const weeklyTextWrap = $("weeklyTextWrap");

const monthlyFill = $("monthlyFill");
const monthlyTextWrap = $("monthlyTextWrap");
const monthlySymbol = $("monthlySymbol");
const monthlyLongText = $("monthlyLongText");
const monthlyText = $("monthlyText");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");

const finalFill = $("finalFill");
const finalTextWrap = $("finalTextWrap");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

/* EMOJIS ESPEJO */
const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍🌫️","😊","🫥"];

/* DATOS BASE */
const WEEKS = [
  { title:"Vos ante el mundo", questions:[
    ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
    ["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
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

/* REGISTRO */
let week = 0, q = 0, currentScore = 0;
let weeklyScores = [], allAnswers = [], mirrorLog = [];

/* ===============================
   FLUJO
   =============================== */
function startV2(){
  if(!pasoUnaSemana()){
    textoBloqueo();
    return;
  }
  document.body.classList.remove("mirror-bg");
  week = 0; q = 0; currentScore = 0;
  weeklyScores = []; allAnswers = []; mirrorLog = [];
  show("test"); loadQuestion();
}

function loadQuestion(){
  const w = WEEKS[week];
  weekTitle.textContent = w.title;
  questionText.textContent = w.questions[q][0];
  questionMeasure.textContent = w.questions[q][1];
  thermoFill.style.width = (q/4)*100 + "%";
}

function answer(v){
  currentScore += v;
  allAnswers.push({ block: WEEKS[week].title, q, v });
  q++;
  q >= 4 ? showWeekly() : loadQuestion();
}

/* ===============================
   DEVOLUCIONES SEMANALES
   =============================== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  if(!pasoUnaSemana()){
    textoBloqueo();
    return;
  }
  marcarSemana();
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===============================
   CIERRE MENSUAL
   =============================== */
function showMonthly(){
  show("monthlyResult");
  marcarSemana();
  monthlyTextWrap.classList.add("hidden");
  setTimeout(()=>monthlyTextWrap.classList.remove("hidden"),900);
}

/* ===============================
   ESPEJO
   =============================== */
function openMirror(){
  if(!pasoUnaSemana()){
    textoBloqueo();
    return;
  }
  show("mirrorIntro");
}

function startMirror(){
  if(!pasoUnaSemana()){
    textoBloqueo();
    return;
  }
  document.body.classList.add("mirror-bg");
  mirrorLog = [];
  show("mirrorTest");
}

/* ===============================
   FINAL
   =============================== */
function showFinal(){
  show("finalResult");
}

/* UTIL */
function animateGauge(el,target,done){
  el.style.height="0%";
  const start = performance.now(), dur = 1800;
  function step(t){
    const p = Math.min(1,(t-start)/dur);
    el.style.height = p*target + "%";
    p < 1 ? requestAnimationFrame(step) : done && done();
  }
  requestAnimationFrame(step);
}

function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}
