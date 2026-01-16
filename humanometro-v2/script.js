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

/* DATOS */
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

/* REGISTRO GLOBAL DE RESPUESTAS */
let week=0,q=0,currentScore=0;
let weeklyScores=[];
let allAnswers=[]; // guarda TODAS las respuestas del test
let mirrorLog=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;weeklyScores=[];
  allAnswers=[]; mirrorLog=[];
  show("test");loadQuestion();
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
  allAnswers.push({ block: WEEKS[week].title, q: q, v });
  q++;
  q>=4?showWeekly():loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);

  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  weeklyText.textContent =
    avg<0.8
      ? "En esta semana se observa una mayor carga reactiva. Las respuestas muestran que el entorno tuvo un peso considerable en tu estado interno, generando tensiones que no siempre pudieron ser procesadas en el momento. Aun así, hubo registro emocional."
      :avg<1.5
        ? "La semana mostró oscilaciones claras. Hubo momentos de presencia y otros de automatismo, lo que indica un proceso activo de ajuste entre lo que sentís y lo que hacés."
        : "Durante esta semana se sostuvo una coherencia emocional marcada. Las respuestas reflejan integración entre pensamiento, emoción y acción en la mayoría de las situaciones.";

  weeklyAdvice.textContent =
    "Esta lectura no señala fallas ni aciertos: describe un momento del proceso y deja ver hacia dónde se está moviendo tu humanidad.";

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++;q=0;currentScore=0;
  week>=WEEKS.length?showMonthly():(show("test"),loadQuestion());
}

function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";
    monthlyLongText.textContent =
      "Este tramo integró tu relación con el mundo, la tecnología y los estímulos cotidianos. Las respuestas muestran cómo fuiste atravesando situaciones externas y qué lugar ocupó tu regulación interna a lo largo del tiempo.";
    monthlyText.textContent =
      "El recorrido no fue lineal: aparecen avances, pausas y ajustes que forman parte de un proceso humano real.";
  });
}

/* ESPEJO */
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
  mq=0;mirrorScore=0;mirrorCount=0;mirrorLog=[];
  show("mirrorTest");loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){mirrorScore+=v;mirrorCount++;}
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

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

    // DEVOLUCIÓN FINAL PERSONALIZADA (integradora)
    finalHumanText.textContent =
      "A lo largo de todo el recorrido, tus respuestas muestran cómo fuiste habitando tu humanidad mes a mes. Se observan patrones de respuesta que hablan tanto de momentos de coherencia como de zonas donde la exigencia externa generó tensión.\n\n"+
      (avg>1.4
        ? "Predomina una integración emocional clara. Hay señales de congruencia entre lo que sentís, pensás y hacés, incluso cuando el contexto presenta desafíos. Esto sugiere un proceso de maduración sostenido."
        :avg>0.9
          ? "El proceso muestra avances con oscilaciones. Aparecen momentos de claridad alternados con reacciones automáticas, lo que indica que la conciencia está activa, aunque todavía en ajuste."
          : "La reactividad emocional tuvo un peso significativo. Se detectan señales de desgaste y sobrecarga que pueden estar pidiendo una pausa consciente.")+
      "\n\n"+
      "No hay un resultado correcto o incorrecto. Este estado refleja cómo estuviste atravesando este período. "+
      (avg>1.4
        ? "La sugerencia es continuar por este camino, sosteniendo la observación y el cuidado interno."
        :avg>0.9
          ? "La sugerencia es bajar el ritmo cuando sea posible y reforzar los espacios de registro personal."
          : "La sugerencia es priorizar descanso, límites y observación sin juicio.") ;
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
