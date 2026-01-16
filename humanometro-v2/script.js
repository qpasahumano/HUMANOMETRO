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

let week=0,q=0,currentScore=0;
let weeklyScores=[];
let globalScores=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[]; globalScores=[];
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
  globalScores.push(v);
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
    ? "Durante este período, las respuestas muestran una fuerte influencia del contexto externo sobre tu mundo emocional. Hubo registro de lo que sucede, pero con dificultad para sostener presencia interna frente a la demanda."
    : avg<1.5
    ? "Este tramo refleja una oscilación entre momentos de conciencia y respuestas automáticas. Se percibe intención de registro, aunque no siempre sostenida."
    : "Las respuestas indican una integración activa entre lo que sentís, pensás y hacés. Se observa mayor elección consciente frente a los estímulos.";

  weeklyAdvice.textContent =
    "Cada registro forma parte del proceso humano, no de una evaluación.";

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
      "Este recorrido integró cómo estuviste habitando el mundo, la tecnología y los vínculos cotidianos. No se trata de hechos aislados, sino de una dinámica sostenida en el tiempo.";
    monthlyText.textContent =
      avg<0.8
      ? "El proceso muestra desgaste emocional acumulado."
      : avg<1.5
      ? "Se observa un equilibrio inestable con momentos de presencia."
      : "El trayecto refleja una evolución hacia mayor coherencia.";
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
  mq=0;mirrorScore=0;mirrorCount=0;
  show("mirrorTest");loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){mirrorScore+=v;mirrorCount++; globalScores.push(v);}
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = globalScores.reduce((a,b)=>a+b,0)/globalScores.length;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    finalHumanText.textContent =
      "A lo largo de todo el recorrido se observa cómo fuiste atravesando distintas capas de tu humanidad. Tus respuestas reflejan momentos de presencia, zonas de tensión y también intentos de integración.\n\n"+
      (avg>1.4
        ?"El proceso muestra una coherencia creciente entre emoción, pensamiento y acción. Hay señales claras de integración y evolución sostenida."
        :avg>0.9
        ?"El recorrido evidencia avances con oscilaciones. La conciencia aparece, aunque no siempre logra sostenerse frente al contexto."
        :"Las respuestas indican un período de sobrecarga emocional, donde el entorno tuvo más peso que la autorregulación interna.")+
      "\n\nEste resultado no define quién sos, sino cómo estuviste estando este mes. Registrar esto es parte del camino humano.";
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
