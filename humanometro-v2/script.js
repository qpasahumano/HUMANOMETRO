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

/* DEVOLUCIONES INTRAPERSONALES – SEMANALES */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(avg<0.8){
    weeklyText.textContent =
      "Durante este tramo se observa una carga emocional elevada. "+
      "Las respuestas indican reactividad frente al entorno y dificultad para sostener presencia.";
    weeklyAdvice.textContent =
      "Registrar este estado no es un error: es una señal de sobreexigencia.";
  } else if(avg<1.5){
    weeklyText.textContent =
      "El proceso mostró oscilaciones entre conciencia y automatismo. "+
      "Hubo intentos de regulación, aunque no siempre sostenidos.";
    weeklyAdvice.textContent =
      "Observar cuándo aparece la reacción automática es parte del aprendizaje.";
  } else {
    weeklyText.textContent =
      "Se sostuvo una coherencia emocional activa. "+
      "Las respuestas reflejan integración entre sentir, pensar y actuar.";
    weeklyAdvice.textContent =
      "Este estado es disponible cuando hay presencia, no permanente.";
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
      "Este tramo integró tu vínculo con el mundo, la tecnología y el entorno cotidiano.";
    monthlyText.textContent =
      "El proceso no fue lineal: hubo avances, pausas y reajustes.";
  });
}

/* ESPEJO – PREGUNTAS ORIGINALES */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?"},
 {t:"¿La tristeza condicionó tus decisiones?"},
 {t:"¿El miedo te frenó?"},
 {t:"¿La ansiedad te llevó a reaccionar en automático?"},
 {t:"¿Apareció culpa no resuelta?"},
 {t:"¿Hubo desconexión emocional?"},
 {t:"¿La alegría fue genuina y sostenida?"},
 {t:"¿Evitaste una emoción dominante?"}
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

/* DEVOLUCIÓN FINAL – INTEGRADORA, CRÍTICA Y NO COMPLACIENTE */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    let texto =
      "Este resultado integra todo tu recorrido mensual en el Humanómetro. "+
      "Desde las primeras respuestas hasta el cierre del espejo, se observan patrones "+
      "en la forma en que sentís, reaccionás y tomás decisiones.\n\n";

    if(avg<=0.9){
      texto +=
        "Predominan respuestas automáticas y zonas de desconexión emocional. "+
        "Aparecen incongruencias entre lo que sentís y cómo actuás, lo que suele indicar "+
        "funcionamiento en piloto automático. Este estado no habla de incapacidad, "+
        "sino de conciencia aún no integrada.\n\n"+
        "El punto clave aquí es registrar dónde reaccionás sin elegir.";
    } else if(avg<=1.4){
      texto +=
        "El proceso muestra claros grises. Hay momentos de presencia y otros de reacción. "+
        "La conciencia aparece de forma intermitente, lo que indica un proceso activo, "+
        "aunque todavía inestable.\n\n"+
        "El desafío es sostener la observación antes de actuar.";
    } else {
      texto +=
        "Se observa congruencia sostenida entre sentir, pensar y actuar. "+
        "Las respuestas muestran registro emocional y capacidad de elección. "+
        "Este estado no es definitivo, pero sí un indicador de integración.";
    }

    texto +=
      "\n\nEste resultado no define quién sos, sino cómo estuviste habitando este mes.\n\n"+
      "Cuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";

    finalHumanText.textContent = texto;
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
