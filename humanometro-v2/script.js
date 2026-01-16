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

/* DATOS (NO TOCADOS) */
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
let week=0,q=0,currentScore=0;
let weeklyScores=[];
let allAnswers=[];
let mirrorLog=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[]; allAnswers=[]; mirrorLog=[];
  show("test"); loadQuestion();
}

function loadQuestion(){
  const w=WEEKS[week];
  weekTitle.textContent=w.title;
  questionText.textContent=w.questions[q][0];
  questionMeasure.textContent=w.questions[q][1];
  thermoFill.style.width=(q/4)*100+"%";
}

function answer(v){
  currentScore+=v;
  allAnswers.push({ block:WEEKS[week].title, q, v });
  q++;
  q>=4?showWeekly():loadQuestion();
}

/* DEVOLUCIONES INTRAPERSONALES – SEMANALES (LARGAS) */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(avg<0.8){
    weeklyText.textContent =
      "Durante este tramo se percibe una carga emocional intensa frente al entorno. "+
      "Las respuestas indican que los estímulos externos impactaron con fuerza, "+
      "generando reacciones difíciles de procesar en el momento. "+
      "Aun así, hubo registro del malestar, lo que muestra sensibilidad y conciencia incipiente.";
    weeklyAdvice.textContent =
      "No es un retroceso: es una señal de sobreexigencia. "+
      "Registrar este estado es el primer paso para recuperar eje.";
  } else if(avg<1.5){
    weeklyText.textContent =
      "El recorrido de esta semana muestra oscilaciones claras. "+
      "Hubo momentos de presencia y otros de respuesta automática. "+
      "Esto indica un proceso activo de ajuste entre lo que sentís, pensás y hacés.";
    weeklyAdvice.textContent =
      "La conciencia no es lineal. Observar cuándo aparece y cuándo se pierde "+
      "forma parte del aprendizaje humano.";
  } else {
    weeklyText.textContent =
      "Se sostuvo una coherencia emocional marcada. "+
      "Las respuestas reflejan integración entre emoción, pensamiento y acción. "+
      "Incluso frente a estímulos demandantes, hubo capacidad de elección.";
    weeklyAdvice.textContent =
      "Este estado no es permanente, pero sí disponible cuando hay presencia.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length?showMonthly():(show("test"),loadQuestion());
}

/* CIERRE BOSQUE */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

    monthlyLongText.textContent =
      "Este tramo integró tu vínculo con el mundo, la tecnología y los estímulos cotidianos. "+
      "No se observaron respuestas aisladas, sino un modo sostenido de habitar el contexto.";

    monthlyText.textContent =
      "El proceso no fue lineal. Hubo avances, pausas y reajustes.";
  });
}

/* =================================================
   ESPEJO – PREGUNTAS ORIGINALES (NO MODIFICADAS)
   ================================================= */
const MIRROR_QUESTIONS = [
  { t: "¿Cuánto enojo sentiste frente a situaciones del mundo que considerás injustas?" },
  { t: "¿Cuánta tristeza te generó el sufrimiento ajeno que registraste durante este tiempo?" },
  { t: "¿Cuánto miedo sentiste al pensar en el futuro, propio o colectivo?" },
  { t: "¿Cuánta ansiedad apareció cuando sentiste que no llegabas a todo o perdías control?" },
  { t: "¿Cuánta culpa sentiste por no actuar como hubieras querido?" },
  { t: "¿Cuánta desconexión emocional sentiste frente a lo que pasaba a tu alrededor?" },
  { t: "¿Cuánta alegría genuina sentiste en tu vida cotidiana durante este período?" },
  { t: "¿Cuánto evitaste sentir alguna emoción que sabías que estaba presente?" }
];

let mq=0,mirrorScore=0,mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0; mirrorLog=[];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

/* DEVOLUCIÓN FINAL – INTEGRADORA TOTAL */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    finalHumanText.textContent =
      "Desde el inicio del proceso hasta este cierre, tus respuestas muestran "+
      "cómo fuiste atravesando el mes a nivel humano. "+
      "Aparecen momentos de coherencia, instancias de tensión y espacios de ajuste.\n\n"+
      (avg>1.4
        ?"El estado actual refleja integración y congruencia. La sugerencia es continuar por este camino."
        :avg>0.9
          ?"El estado muestra transición. La sugerencia es reforzar espacios de registro personal."
          :"El estado refleja desgaste. La sugerencia es priorizar descanso y cuidado interno.")+
      "\n\nCuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";
  });
}

/* UTIL */
function animateGauge(el,target,done){
  el.style.height="0%";
  const start=performance.now(),dur=1800;
  function step(t){
    const p=Math.min(1,(t-start)/dur);
    el.style.height=p*target+"%";
    p<1?requestAnimationFrame(step):done&&done();
  }
  requestAnimationFrame(step);
}

function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s=>$(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}
