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
   DEVOLUCIONES SEMANALES — EXTENDIDAS
   =============================== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);

  const range =
    avg <= 0.6 ? "low" :
    avg <= 0.9 ? "midLow" :
    avg <= 1.4 ? "mid" : "high";

  weeklySymbol.textContent =
    range === "low" ? "🦇" :
    range === "midLow" ? "🦇" :
    range === "mid" ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Lo que ocurre en el mundo no siempre logra atravesarte.\n\n"+
        "El dolor ajeno, las injusticias o los conflictos pueden aparecer "+
        "como información lejana, sin generar un impacto emocional sostenido.\n\n"+
        "Esto no habla de falta de humanidad, sino de posibles mecanismos "+
        "de defensa, cansancio o saturación emocional.";
      weeklyAdvice.textContent =
        "Observar cuándo te cerrás y cuándo te abrís al otro "+
        "puede ser el primer gesto de reconexión humana.";
    } else {
      weeklyText.textContent =
        "El mundo no pasa desapercibido.\n\n"+
        "Hay registro del dolor, de la injusticia y de lo que afecta "+
        "a otros seres humanos.";
      weeklyAdvice.textContent =
        "Sostener esta sensibilidad sin que te abrume "+
        "es parte de un equilibrio humano maduro.";
    }
  }

  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent =
        "La atención aparece fragmentada.\n\n"+
        "La tecnología tiende a absorber momentos que podrían "+
        "ser habitados con mayor presencia.\n\n"+
        "No como error, sino como hábito automatizado.";
      weeklyAdvice.textContent =
        "Pequeños cortes conscientes pueden devolver densidad "+
        "a la experiencia cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo digital acompaña sin dominar.\n\n"+
        "Hay uso consciente y registro del presente.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene vínculos más reales "+
        "y una experiencia más encarnada.";
    }
  }

  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Se perciben fisuras entre pensamiento, emoción y acción.\n\n"+
        "No siempre lo que sentís logra expresarse "+
        "ni lo que pensás logra sostenerse en el hacer.";
      weeklyAdvice.textContent =
        "Nombrar estas incongruencias no es debilidad: "+
        "es el inicio del proceso de integración.";
    } else {
      weeklyText.textContent =
        "Hay coherencia interna.\n\n"+
        "Lo que pensás, sentís y hacés tiende a alinearse.";
      weeklyAdvice.textContent =
        "Habitar esta congruencia consolida tu proceso humano.";
    }
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===============================
   CIERRE VOLUMEN 2
   TU HUMANIDAD EN MOVIMIENTO
   =============================== */
function showMonthly(){
  show("monthlyResult");

  monthlyTextWrap.classList.add("glass-sheet","scroll-sheet");
  monthlyTextWrap.classList.add("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  const range =
    avg <= 0.6 ? "low" :
    avg <= 0.9 ? "midLow" :
    avg <= 1.4 ? "mid" : "high";

  animateGauge(monthlyFill, (avg/2)*100, ()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent =
      range === "low" ? "🦇" :
      range === "midLow" ? "🦇" :
      range === "mid" ? "🐞" : "🐦";

    if(avg <= 0.6){
      monthlyLongText.textContent =
        "En éstos días apareció una constante:\n"+
        "muchas situaciones que, en otros contextos, suelen generar impacto emocional,\n"+
        "en vos pasaron sin dejar huella clara.\n\n"+
        "No como falta ni como error,\n"+
        "sino como una forma de protección.\n\n"+
        "El “no” reiterado no habla de ausencia de humanidad,\n"+
        "sino de una humanidad que aprendió a cerrarse\n"+
        "para poder seguir funcionando.\n\n"+
        "Cuando el mundo duele,\n"+
        "a veces la forma de sostenerse\n"+
        "es no sentir del todo.\n\n"+
        "Este resultado no señala frialdad:\n"+
        "señala distancia.\n\n"+
        "Y toda distancia, si se observa con honestidad,\n"+
        "puede empezar a acortarse.";
      monthlyText.textContent = "";
    } 
    else if(avg <= 0.9){
      monthlyLongText.textContent =
        "Tus respuestas estos días muestran una humanidad que aparece y se retira.\n\n"+
        "Hay momentos de registro, sensibilidad y presencia,\n"+
        "seguidos por momentos de automatismo, duda o repliegue.\n\n"+
        "El “tal vez” no es indecisión superficial:\n"+
        "es señal de una tensión interna\n"+
        "entre lo que sentís\n"+
        "y lo que te permitís sentir.\n\n"+
        "Parte de vos percibe,\n"+
        "parte de vos se protege.\n\n"+
        "Esta oscilación no es contradicción moral,\n"+
        "es un proceso en tránsito.\n\n"+
        "La integración no llega forzando respuestas,\n"+
        "llega cuando dejás de pelearte\n"+
        "con lo que aparece a medias.";
      monthlyText.textContent = "";
    } 
    else if(avg <= 1.4){
      monthlyLongText.textContent =
        "Al observar el recorrido por éstos días\n"+
        "aparece una diferencia clara\n"+
        "entre lo que expresaste al inicio\n"+
        "y lo que fue emergiendo después.\n\n"+
        "Algunas respuestas muestran sensibilidad y compromiso,\n"+
        "mientras que otras señalan distancia, evitación o desconexión.\n\n"+
        "Esto no es incoherencia intelectual,\n"+
        "es incongruencia emocional.\n\n"+
        "Distintas partes tuyas responden desde lugares distintos:\n"+
        "una se adapta,\n"+
        "otra se protege,\n"+
        "otra observa.\n\n"+
        "El espejo no busca unificarte a la fuerza,\n"+
        "sino mostrarte dónde no estás siendo el mismo\n"+
        "en todos los planos.\n\n"+
        "La integración comienza\n"+
        "cuando dejás de elegir qué parte mostrar\n"+
        "y empezás a escuchar a todas.";
      monthlyText.textContent = "";
    } 
    else {
      monthlyLongText.textContent =
        "A lo largo de todo el recorrido aparece una misma línea:\n"+
        "coherencia entre lo que sentís, lo que pensás y lo que hacés.\n\n"+
        "Las respuestas no muestran fisuras marcadas\n"+
        "ni contradicciones defensivas,\n"+
        "sino una humanidad que registra, procesa\n"+
        "y responde con presencia.\n\n"+
        "Esto no habla de perfección,\n"+
        "habla de conciencia.\n\n"+
        "Integrar no es llegar a un punto final,\n"+
        "es mantener abierta la posibilidad\n"+
        "de seguir siendo humano\n"+
        "incluso cuando sería más fácil cerrarse.";
      monthlyText.textContent = "";
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

  /* === AJUSTE SEMÁNTICO (ÚNICA ADICIÓN) === */
  if(mq === MIRROR_QUESTIONS.length){
    let semanticDelta = 0;
    const evitacion = mirrorLog[7] ?? 0;
    const desconexion = mirrorLog[5] ?? 0;
    const alegria = mirrorLog[6] ?? 0;
    semanticDelta -= (evitacion + desconexion) * 0.1;
    semanticDelta += alegria * 0.1;
    mirrorScore += semanticDelta;
  }

  mq >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* ===============================
   DEVOLUCIÓN FINAL INTEGRATIVA
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
        "Analizando el mes completo, aparece un patrón claro:\n"+
        "muchas situaciones que implican dolor ajeno, conflicto o malestar externo\n"+
        "no generan en vos una respuesta emocional significativa.\n\n"+
        "No como falta moral,\n"+
        "sino como señal de distancia.\n\n"+
        "Esta distancia no habla de frialdad consciente,\n"+
        "habla de un mecanismo de protección:\n"+
        "una forma de no involucrarte para no sentir.\n\n"+
        "El problema no es no sentir,\n"+
        "sino normalizar ese apagamiento como estado estable.\n\n"+
        "Cuando el dolor del otro no resuena,\n"+
        "la humanidad se vuelve funcional,\n"+
        "pero pierde profundidad.\n\n"+
        "Este resultado no acusa,\n"+
        "señala un punto ciego:\n"+
        "allí donde la empatía podría desarrollarse\n"+
        "y hoy no está ocurriendo.";
    }
    else if(avg <= 0.9){
      finalState.textContent = "Ambivalencia emocional";
      finalHumanText.textContent =
        "Tus respuestas muestran una humanidad que aparece y se retira.\n\n"+
        "Hay momentos de registro, sensibilidad y presencia,\n"+
        "seguidos por momentos de automatismo, duda o repliegue.\n\n"+
        "El “tal vez” no es indecisión superficial:\n"+
        "es señal de una tensión interna\n"+
        "entre lo que sentís\n"+
        "y lo que te permitís sentir.\n\n"+
        "La integración no llega forzando respuestas,\n"+
        "llega cuando dejás de pelearte\n"+
        "con lo que aparece a medias.";
    }
    else if(avg <= 1.4){
      finalState.textContent = "Incongruencia marcada";
      finalHumanText.textContent =
        "Al medir el recorrido completo,\n"+
        "aparece una incompatibilidad marcada entre tus respuestas.\n\n"+
        "Hay registros de conciencia en ciertos planos,\n"+
        "pero neutralidad o ausencia emocional\n"+
        "frente a situaciones donde la empatía humana es clave.\n\n"+
        "Esto no es incoherencia intelectual.\n"+
        "Es incongruencia emocional.\n\n"+
        "Distintas partes tuyas responden desde lugares opuestos:\n"+
        "una se muestra consciente,\n"+
        "otra evita implicarse,\n"+
        "otra racionaliza.\n\n"+
        "El resultado es una humanidad fragmentada:\n"+
        "funcional, adaptada,\n"+
        "pero no integrada.\n\n"+
        "La evolución no comienza corrigiendo respuestas,\n"+
        "comienza reconociendo\n"+
        "dónde no estás siendo el mismo\n"+
        "en todos los planos.";
    }
    else {
      finalState.textContent = "Congruencia humana";
      finalHumanText.textContent =
        "A lo largo de todo el recorrido aparece una misma línea:\n"+
        "coherencia entre lo que sentís, lo que pensás y lo que hacés.\n\n"+
        "No hay fisuras marcadas\n"+
        "ni contradicciones defensivas,\n"+
        "sino una humanidad que registra, procesa\n"+
        "y responde con presencia.\n\n"+
        "Esto no habla de perfección,\n"+
        "habla de conciencia.\n\n"+
        "Integrar no es llegar a un punto final,\n"+
        "es mantener abierta la posibilidad\n"+
        "de seguir siendo humano.";
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
