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
   DEVOLUCIONES SEMANALES – POÉTICAS Y DIFERENTES
   ===================================================== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  /* ---- VOS ANTE EL MUNDO ---- */
  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent =
        "En el contacto con lo que sucede afuera aparece una distancia sostenida. "+
        "Las respuestas indican que el dolor ajeno, las injusticias y los conflictos "+
        "no siempre logran atravesar tu registro emocional. "+
        "Esto no habla de indiferencia absoluta, sino de un modo selectivo de sentir, "+
        "donde el mundo puede volverse ruido de fondo.";
      weeklyAdvice.textContent =
        "Tal vez sea momento de revisar qué lugar ocupa el otro en tu percepción cotidiana.";
    } else {
      weeklyText.textContent =
        "El entorno no pasa desapercibido. Las respuestas reflejan una sensibilidad activa "+
        "frente a lo que sucede más allá de tu experiencia personal. "+
        "Hay registro del sufrimiento, de la injusticia y del impacto colectivo.";
      weeklyAdvice.textContent =
        "Sostener esta apertura fortalece el vínculo con lo humano compartido.";
    }
  }

  /* ---- VOS Y LA TECNOLOGÍA ---- */
  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent =
        "El vínculo con la tecnología aparece como un espacio de dispersión. "+
        "La atención se fragmenta y el presente se ve interrumpido por estímulos constantes. "+
        "Las respuestas sugieren dificultad para sostener presencia plena en los vínculos.";
      weeklyAdvice.textContent =
        "Recuperar el aquí y ahora devuelve profundidad a la experiencia cotidiana.";
    } else {
      weeklyText.textContent =
        "La tecnología se muestra integrada sin absorber por completo tu atención. "+
        "Hay uso consciente y capacidad de volver al presente cuando es necesario.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene una forma más humana de habitar lo digital.";
    }
  }

  /* ---- INTEGRACIÓN HUMANA ---- */
  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Al mirarte hacia adentro emergen tensiones. "+
        "Pensar, sentir y actuar no siempre avanzan alineados, "+
        "y aparecen contradicciones que generan ruido interno. "+
        "Las respuestas muestran un proceso aún en ajuste.";
      weeklyAdvice.textContent =
        "Reconocer estas disonancias es parte del camino de integración.";
    } else {
      weeklyText.textContent =
        "Se percibe mayor coherencia interna. "+
        "Las decisiones reflejan alineación entre emoción, pensamiento y acción. "+
        "Hay congruencia en la manera de habitarte.";
      weeklyAdvice.textContent =
        "Habitar esta coherencia consolida el proceso personal.";
    }
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===============================
   CIERRE MENSUAL (SIN CAMBIOS)
   =============================== */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  animateGauge(monthlyFill, (avg/2)*100, ()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent = avg < 0.8 ? "🦇" : avg < 1.5 ? "🐞" : "🐦";
    monthlyLongText.textContent =
      "Este tramo refleja cómo te vinculaste con el mundo, la tecnología y el ritmo cotidiano.";
    monthlyText.textContent =
      "El proceso muestra ajustes, avances y pausas propias de un recorrido humano real.";
  });
}

/* =====================================================
   ESPEJO – PREGUNTAS COMPLETAS (AJUSTE 2)
   ===================================================== */
const MIRROR_QUESTIONS = [
  { t:"Estás en la calle, necesitás avanzar y una situación externa te lo impide durante varios minutos. No podés hacer nada para cambiarlo y sentís que el tiempo se pierde.\n\nEsa situación te generó enojo:" },
  { t:"Te enterás de una situación difícil que está atravesando otra persona o un grupo, y no podés intervenir ni ayudar de forma directa. La información queda dando vueltas en tu cabeza durante el día.\n\nEsa situación te generó tristeza:" },
  { t:"Tenés que tomar una decisión importante y sentís que, si sale mal, podría traer consecuencias para vos o para otros. Dudás, postergás o evitás avanzar.\n\nEsa situación te generó miedo:" },
  { t:"Recordás algo que dijiste o hiciste (o dejaste de hacer) con alguien cercano, y notás que quedó sin resolver. La escena vuelve a aparecer en tu mente.\n\nEsa situación te generó culpa:" },
  { t:"Durante el día sentís que las demandas se acumulan, el tiempo no alcanza y reaccionás de manera automática, sin detenerte a pensar demasiado.\n\nEsa situación te generó ansiedad:" },
  { t:"Estás con personas o en situaciones que antes te importaban, pero notás que algo no conecta. Escuchás, respondés, pero por dentro te sentís distante.\n\nEsa situación te generó desconexión emocional:" },
  { t:"Vivís un momento simple del día —una charla, una actividad, un logro pequeño— y sentís bienestar sin necesidad de justificarlo.\n\nEsa situación te generó alegría genuina:" },
  { t:"A lo largo de estos días aparece una emoción que preferís no pensar demasiado, distraerte o correr de foco para no sentirla del todo.\n\nEsa situación estuvo presente en vos:" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent = "⬤";
  mirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v ?? 0);
  if(v !== null){ mirrorScore += v; mirrorCount++; }
  mq++;
  mq >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* ===============================
   DEVOLUCIÓN FINAL (SIN CAMBIOS)
   =============================== */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  animateGauge(finalFill, (avg/2)*100, ()=>{
    finalTextWrap.classList.remove("hidden");
    finalState.textContent =
      avg > 1.4 ? "Estado integrado" :
      avg > 0.9 ? "Estado inestable" :
      "Estado reactivo";

    finalHumanText.textContent =
      "El recorrido completo muestra cómo fuiste habitando este período. "+
      "Aparecen zonas de coherencia y otras de tensión que dialogan entre sí. "+
      "Este estado no define quién sos, sino cómo estuviste estando.\n\n"+
      "Cuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";
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
