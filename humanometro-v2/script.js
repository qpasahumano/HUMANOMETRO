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

/* REGISTRO GLOBAL */
let week=0,q=0,currentScore=0;
let weeklyScores=[];
let allAnswers=[];
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
  allAnswers.push({ block: WEEKS[week].title, q, v });
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
      ?"En esta semana predominó una reactividad emocional sostenida frente al entorno."
      :avg<1.5
        ?"La conciencia apareció con oscilaciones según las demandas del contexto."
        :"Se sostuvo una coherencia emocional activa en la mayoría de las situaciones.";

  weeklyAdvice.textContent =
    "Este registro describe un momento del proceso humano, no un juicio.";

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
      "Este tramo integró tu relación con el mundo, la tecnología y el entorno cotidiano.";
    monthlyText.textContent =
      "El proceso fue dinámico, con ajustes reales en el tiempo.";
  });
}

/* =========================
   ESPEJO – PREGUNTAS FINALES
   ========================= */

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

    finalHumanText.textContent =
      "A lo largo de todo el recorrido se observa cómo fuiste habitando tu humanidad. "+
      "Las respuestas reflejan momentos de coherencia, zonas de tensión y ajustes reales.\n\n"+
      (avg>1.4
        ?"Predomina una integración emocional sostenida y consciente."
        :avg>0.9
          ?"El proceso muestra avances con oscilaciones propias del contexto."
          :"Se detecta desgaste emocional que pide pausa y registro.")+
      "\n\nLa sugerencia es observar sin juzgar y volver cuando lo necesites.";
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
