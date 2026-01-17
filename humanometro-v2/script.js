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

/* ===============================
   DEVOLUCIONES SEMANALES
   =============================== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    weeklyText.textContent =
      avg < 1.5
        ? "Lo que ocurre en el mundo no siempre logra atravesarte.\n\nEl dolor ajeno puede aparecer como información lejana."
        : "El mundo no pasa desapercibido.\n\nHay registro del dolor y de la injusticia.";
    weeklyAdvice.textContent =
      avg < 1.5
        ? "Observar cuándo te cerrás y cuándo te abrís es el primer gesto humano."
        : "Sostener esta sensibilidad sin desbordarte es parte del equilibrio.";
  }

  if(block === "Vos y la tecnología"){
    weeklyText.textContent =
      avg < 1.5
        ? "La atención aparece fragmentada.\n\nLa tecnología absorbe presencia."
        : "La tecnología acompaña sin dominar.";
    weeklyAdvice.textContent =
      avg < 1.5
        ? "Pequeños cortes conscientes devuelven densidad."
        : "Este equilibrio fortalece vínculos reales.";
  }

  if(block === "Integración humana"){
    weeklyText.textContent =
      avg < 1.5
        ? "Se perciben fisuras entre pensamiento, emoción y acción."
        : "Hay coherencia entre lo que pensás, sentís y hacés.";
    weeklyAdvice.textContent =
      avg < 1.5
        ? "Nombrar incongruencias inicia la integración."
        : "Habitar esta congruencia consolida tu proceso humano.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===============================
   TU HUMANIDAD EN MOVIMIENTO
   (DEVOLUCIONES INTEGRATIVAS)
   =============================== */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  animateGauge(monthlyFill, (avg/2)*100, ()=>{
    monthlyTextWrap.classList.remove("hidden");

    /* Laminado con scroll SOLO aquí */
    monthlyTextWrap.classList.add("glass-sheet","scroll-sheet");

    monthlySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";

    if(avg <= 0.6){
      monthlyLongText.textContent =
        "A lo largo del recorrido apareció una constante:\n"+
        "muchas situaciones que suelen generar impacto emocional\n"+
        "en vos pasaron sin dejar huella clara.\n\n"+
        "No como error,\n"+
        "sino como una forma de protección.\n\n"+
        "Cuando el mundo duele,\n"+
        "a veces la forma de sostenerse\n"+
        "es no sentir del todo.\n\n"+
        "Esto no señala frialdad,\n"+
        "señala distancia.";
    } else if(avg <= 0.9){
      monthlyLongText.textContent =
        "Tus respuestas muestran una humanidad que aparece y se retira.\n\n"+
        "Hay registro y repliegue,\n"+
        "sensibilidad y protección.\n\n"+
        "No es indecisión:\n"+
        "es tensión interna entre sentir y permitir sentir.\n\n"+
        "La integración no llega forzando,\n"+
        "llega aceptando lo que aparece a medias.";
    } else if(avg <= 1.4){
      monthlyLongText.textContent =
        "Aparecen diferencias claras entre lo que expresaste al inicio\n"+
        "y lo que emergió después.\n\n"+
        "No es incoherencia,\n"+
        "es incongruencia emocional.\n\n"+
        "Distintas partes responden desde lugares distintos.\n\n"+
        "La integración empieza cuando las escuchás a todas.";
    } else {
      monthlyLongText.textContent =
        "A lo largo del recorrido aparece una misma línea:\n"+
        "coherencia entre lo que sentís, pensás y hacés.\n\n"+
        "Hay empatía sin desborde,\n"+
        "sensibilidad con eje\n"+
        "y presencia sostenida.\n\n"+
        "No es perfección,\n"+
        "es conciencia en crecimiento.";
    }
  });
}

/* ===============================
   ESPEJO — PREGUNTAS COMPLETAS
   =============================== */
const MIRROR_QUESTIONS = [
  { t:"Cuando algo en la calle, en una conversación o en una situación cotidiana no sale como esperabas, ¿cuánto enojo sentís internamente, más allá de lo que muestres hacia afuera?" },
  { t:"Cuando te enterás de una situación difícil, injusta o dolorosa —ya sea propia o ajena—, ¿cuánta tristeza aparece en vos de forma real, aunque no la expreses?" },
  { t:"Cuando tenés que tomar una decisión importante o enfrentar una situación incierta, ¿cuánto miedo sentís antes de actuar, incluso si seguís avanzando igual?" },
  { t:"Cuando recordás algo que dijiste, hiciste o dejaste de hacer, ¿cuánta culpa aparece después, aunque intentes justificarte o seguir adelante?" },
  { t:"Cuando se acumulan responsabilidades, demandas externas o presiones internas, ¿cuánta ansiedad sentís en tu cuerpo o en tu mente, aunque continúes funcionando?" },
  { t:"Cuando estás con personas importantes para vos, ¿cuánta desconexión emocional sentís, aun estando físicamente presente?" },
  { t:"Cuando vivís un momento simple, sin exigencias ni expectativas, ¿cuánta alegría genuina sentís, sin necesidad de estímulos externos?" },
  { t:"Cuando aparece una emoción incómoda que no sabés nombrar del todo, ¿cuánto tendés a evitarla, minimizarla o distraerte para no sentirla?" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  document.body.classList.add("mirror-bg");
  mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  show("mirrorTest"); loadMirror();
}

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
   DEVOLUCIÓN FINAL INTEGRATIVA
   (INAMOVIBLE)
   =============================== */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  animateGauge(finalFill, (avg/2)*100, ()=>{
    finalTextWrap.classList.remove("hidden");

    if(avg <= 0.6){
      finalState.textContent = "Predominio de NO";
      finalHumanText.textContent =
        "A lo largo del recorrido apareció una constante:\n"+
        "muchas situaciones que suelen generar impacto emocional,\n"+
        "en vos pasaron sin dejar huella clara.\n\n"+
        "No como falta,\n"+
        "sino como una forma de protección.\n\n"+
        "Este resultado no señala frialdad,\n"+
        "señala distancia.";
    } else if(avg <= 0.9){
      finalState.textContent = "Ambivalencia emocional";
      finalHumanText.textContent =
        "Tu humanidad aparece y se repliega.\n\n"+
        "La integración llega cuando dejás de pelearte\n"+
        "con lo que aparece a medias.";
    } else if(avg <= 1.4){
      finalState.textContent = "Incongruencia marcada";
      finalHumanText.textContent =
        "Distintas partes responden desde lugares distintos.\n\n"+
        "La integración empieza cuando las escuchás a todas.";
    } else {
      finalState.textContent = "Congruencia humana";
      finalHumanText.textContent =
        "Hay coherencia entre sentir, pensar y hacer.\n\n"+
        "No es perfección:\n"+
        "es conciencia.";
    }
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
