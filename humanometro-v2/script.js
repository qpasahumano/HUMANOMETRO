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
  document.body.classList.remove("mirror-bg"); // ← AJUSTE ÚNICO

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
        "no siempre logran atravesar tu registro. No es ausencia total de sensibilidad, sino una forma "+
        "selectiva de sentir, donde lo externo queda amortiguado.";
      weeklyAdvice.textContent =
        "Tal vez sea momento de preguntarte qué lugar ocupa el otro en tu mirada cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo que sucede afuera resuena. Hay registro del sufrimiento y de la injusticia, "+
        "y eso genera una respuesta interna que no se apaga.";
      weeklyAdvice.textContent =
        "Sostener esta apertura fortalece el lazo con lo humano compartido.";
    }
  }

  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent =
        "La atención se dispersa y el presente se fragmenta. La tecnología aparece como ruido constante, "+
        "interrumpiendo la profundidad de los vínculos y del estar.";
      weeklyAdvice.textContent =
        "Volver al ahora puede devolver densidad a la experiencia cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo digital acompaña sin absorber. Hay capacidad de usar la tecnología sin perder presencia.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene una vivencia más consciente del día a día.";
    }
  }

  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Aparecen fisuras entre lo que pensás, sentís y hacés. No todo avanza en la misma dirección, "+
        "y esa desalineación genera tensión interna.";
      weeklyAdvice.textContent =
        "Nombrar estas disonancias es parte del camino de integración.";
    } else {
      weeklyText.textContent =
        "Hay coherencia interna. Pensamiento, emoción y acción se acompañan con mayor claridad.";
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

/* ===============================
   ESPEJO – PREGUNTAS (NO TOCADAS)
   =============================== */
const MIRROR_QUESTIONS = [
  { t:"Estás en la calle, necesitás avanzar y una situación externa te lo impide durante varios minutos. No podés hacer nada para cambiarlo y sentís que el tiempo se pierde.\n\nEsa situación te generó enojo:" },
  { t:"Te enterás de una situación difícil que está atravesando otra persona o un grupo, y no podés intervenir ni ayudar de forma directa.\n\nEsa situación te generó tristeza:" },
  { t:"Tenés que tomar una decisión importante y sentís que, si sale mal, podría traer consecuencias.\n\nEsa situación te generó miedo:" },
  { t:"Recordás algo dicho o hecho con alguien cercano que quedó sin resolver.\n\nEsa situación te generó culpa:" },
  { t:"Durante el día sentís que las demandas se acumulan y reaccionás de manera automática.\n\nEsa situación te generó ansiedad:" },
  { t:"Estás con personas importantes pero notás una distancia interna.\n\nEsa situación te generó desconexión emocional:" },
  { t:"Vivís un momento simple y sentís bienestar sin justificarlo.\n\nEsa situación te generó alegría genuina:" },
  { t:"Aparece una emoción que preferís no mirar del todo.\n\nEsa situación estuvo presente en vos:" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  document.body.classList.add("mirror-bg"); // ← AJUSTE ÚNICO

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

/* =====================================================
   DEVOLUCIÓN FINAL – INTEGRATIVA TOTAL
   ===================================================== */
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

    finalHumanText.innerHTML =
      "<strong>Lectura integrativa del mes</strong><br><br>" +
      "Al inicio del recorrido, tus respuestas mostraron el punto de partida desde el que te estabas "+
      "relacionando con el mundo y con vos mismo. A lo largo del proceso aparecieron patrones que se "+
      "repiten: momentos de presencia alternados con zonas donde el sentir se atenúa y la reacción "+
      "toma el lugar de la elección.<br><br>" +
      "En el tránsito del mes se observan incongruencias entre lo que pensás, lo que sentís y lo que "+
      "terminás haciendo. No como fallas aisladas, sino como grises sostenidos que indican una humanidad "+
      "en tensión: empatía selectiva, presencia intermitente y dificultad para sostener coherencia "+
      "cuando el contexto exige más conciencia.<br><br>" +
      "El segmento de espejo expone con claridad este contraste. Las emociones aparecen, pero no siempre "+
      "son habitadas del todo. A veces se evitan, a veces se racionalizan, y otras se expresan de manera "+
      "automática. Esto define una tendencia que puede crecer o profundizarse, según cómo se la observe.<br><br>" +
      "<em>Sugerencia:</em> registrar sin juicio esos puntos donde el sentir se apaga o se posterga. "+
      "La integración comienza cuando se deja de esquivar lo incómodo y se lo mira con presencia.<br><br>" +
      "<small>Cuando quieras volver a medir tu humanidad, el Humanómetro está para eso.</small><br>" +
      "<button onclick=\"show('mirrorIntro')\" style=\"margin-top:8px;font-size:12px;\">Cómo se obtuvo tu reflejo</button>";
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
