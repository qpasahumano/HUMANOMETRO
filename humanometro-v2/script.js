const $ = id => document.getElementById(id);

/* CACHE */
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

/* ===============================
   NUEVO – EMOJIS DEL ESPEJO
   (NO ALTERA LÓGICA)
   =============================== */
const MIRROR_EMOJIS = [
  "😡", // enojo
  "😢", // tristeza
  "😨", // miedo
  "😔", // culpa
  "😰", // ansiedad
  "😶‍🌫️", // desconexión emocional
  "😊", // alegría genuina
  "🫥"  // emoción evitada / difusa
];

/* DATOS – NO TOCADOS */
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

/* REGISTRO GLOBAL */
let week = 0, q = 0, currentScore = 0;
let weeklyScores = [];
let allAnswers = [];
let mirrorLog = [];

/* FLUJO */
function startV2(){
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

/* =====================================================
   DEVOLUCIONES SEMANALES – POÉTICAS (SELLADAS)
   ===================================================== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Algo del mundo parece pasar sin dejar huella. El dolor ajeno, las injusticias y los conflictos "+
        "no siempre logran atravesar tu registro.";
      weeklyAdvice.textContent =
        "Tal vez sea momento de preguntarte qué lugar ocupa el otro en tu mirada cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo que sucede afuera resuena. Hay registro del sufrimiento y de la injusticia.";
      weeklyAdvice.textContent =
        "Sostener esta apertura fortalece el lazo con lo humano compartido.";
    }
  }

  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent =
        "La atención se dispersa y el presente se fragmenta.";
      weeklyAdvice.textContent =
        "Volver al ahora puede devolver densidad a la experiencia cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo digital acompaña sin absorber.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene una vivencia más consciente del día a día.";
    }
  }

  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Aparecen fisuras entre lo que pensás, sentís y hacés.";
      weeklyAdvice.textContent =
        "Nombrar estas disonancias es parte del camino de integración.";
    } else {
      weeklyText.textContent =
        "Hay coherencia interna entre pensamiento, emoción y acción.";
      weeklyAdvice.textContent =
        "Habitar esta congruencia consolida el proceso personal.";
    }
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===============================
   CIERRE MENSUAL
   =============================== */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  animateGauge(monthlyFill, (avg/2)*100, ()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";
    monthlyLongText.textContent =
      "Este tramo refleja cómo te vinculaste con el mundo y la tecnología.";
    monthlyText.textContent =
      "El proceso muestra ajustes propios de un recorrido humano real.";
  });
}

/* ===============================
   ESPEJO – PREGUNTAS
   =============================== */
const MIRROR_QUESTIONS = [
  { t:"Estás en la calle... Esa situación te generó enojo:" },
  { t:"Te enterás de una situación difícil... Esa situación te generó tristeza:" },
  { t:"Tenés que tomar una decisión importante... Esa situación te generó miedo:" },
  { t:"Recordás algo sin resolver... Esa situación te generó culpa:" },
  { t:"Las demandas se acumulan... Esa situación te generó ansiedad:" },
  { t:"Estás con personas importantes pero sentís distancia...:" },
  { t:"Vivís un momento simple... Esa situación te generó alegría genuina:" },
  { t:"Aparece una emoción que preferís no mirar del todo:" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  document.body.classList.add("mirror-bg");
  mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  show("mirrorTest"); loadMirror();
}

/* ===== AJUSTE REAL AQUÍ ===== */
function loadMirror(){
  mirrorEmoji.textContent = MIRROR_EMOJIS[mq] || "⬤";
  mirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v ?? 0);
  if(v !== null){ mirrorScore += v; mirrorCount++; }
  mq++;
  mq >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* ===============================
   DEVOLUCIÓN FINAL
   =============================== */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  animateGauge(finalFill, (avg/2)*100, ()=>{
    finalTextWrap.classList.remove("hidden");
    finalState.textContent =
      avg > 1.4 ? "Estado estable alto" :
      avg > 0.9 ? "Estado estable medio" :
      avg > 0.6 ? "Estado estable inferior" :
      "Estado inestable";
  });
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
