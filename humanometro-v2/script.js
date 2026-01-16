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

function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(avg<0.8){
    weeklyText.textContent =
      "En lo vivido durante estos días aparece una distancia entre el entorno y tu registro interno. "+
      "Las respuestas sugieren menor implicancia emocional frente a lo que sucede alrededor.";
    weeklyAdvice.textContent =
      "Observar esto abre la posibilidad de volver a conectar con lo que sucede más allá de uno mismo.";
  } else if(avg<1.5){
    weeklyText.textContent =
      "El recorrido muestra alternancia entre presencia y automatismo. "+
      "Hay registro, aunque no siempre sostenido.";
    weeklyAdvice.textContent =
      "Reconocer estas oscilaciones permite ajustar sin exigencia.";
  } else {
    weeklyText.textContent =
      "Se observa una presencia emocional activa y una relación más consciente con el entorno.";
    weeklyAdvice.textContent =
      "Este estado es dinámico y se fortalece con continuidad.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q=0; currentScore=0;
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
      "Este tramo refleja cómo te vinculaste con el mundo, la tecnología y el ritmo cotidiano.";
    monthlyText.textContent =
      "El proceso muestra ajustes, avances y pausas propias de un recorrido humano real.";
  });
}

/* =========================
   ESPEJO – PREGUNTAS FIJAS
   ========================= */
const MIRROR_QUESTIONS = [
  { t:"En estos días, ¿sentiste enojo en algún momento que haya influido en tu forma de actuar?" },
  { t:"En estos días, ¿sentiste tristeza que haya condicionado tus decisiones o tu energía?" },
  { t:"¿Sentiste miedo (a perder, a equivocarte, a confrontar) que te haya limitado o frenado?" },
  { t:"¿Apareció culpa por algo dicho o hecho, que haya quedado sin resolver internamente?" },
  { t:"¿Sentiste ansiedad o inquietud que te haya llevado a reaccionar de forma automática?" },
  { t:"¿Percibiste momentos de indiferencia o desconexión emocional frente a personas o situaciones importantes?" },
  { t:"¿Experimentaste alegría o bienestar genuino que haya sido coherente con lo que estabas viviendo?" },
  { t:"Mirando estos días en conjunto, ¿hubo alguna emoción dominante que no supiste nombrar o preferiste evitar?" }
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
      "El recorrido completo muestra cómo fuiste habitando este período. "+
      "Aparecen zonas de coherencia y otras de tensión que dialogan entre sí. "+
      "Este estado no define quién sos, sino cómo estuviste estando.\n\n"+
      "Cuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";
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
