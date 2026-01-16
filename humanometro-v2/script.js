const $ = id => document.getElementById(id);

/* CACHE */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");
const thermoFill = $("thermoFill");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");

const monthlyFill = $("monthlyFill");
const monthlyTextWrap = $("monthlyTextWrap");
const monthlySymbol = $("monthlySymbol");
const monthlyLongText = $("monthlyLongText");
const monthlyText = $("monthlyText");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");
const finalHumanText = $("finalHumanText");

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

let week=0, q=0, currentScore=0;
let weeklyScores=[];

/* FLUJO */
function startV2(){
  week=0; q=0; currentScore=0; weeklyScores=[];
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
  currentScore+=v; q++;
  q>=4 ? showWeekly() : loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);

  if(avg<0.8){
    weeklySymbol.textContent="🦇";
    weeklyText.textContent="Durante esta semana predominó la reacción automática.";
    weeklyAdvice.textContent="Las emociones se activaron sin lograr transformarse en acción consciente sostenida.";
  }else if(avg<1.5){
    weeklySymbol.textContent="🐞";
    weeklyText.textContent="La conciencia apareció de forma intermitente.";
    weeklyAdvice.textContent="Hubo momentos de registro combinados con respuestas condicionadas.";
  }else{
    weeklySymbol.textContent="🐦";
    weeklyText.textContent="Se sostuvo una coherencia activa.";
    weeklyAdvice.textContent="Emoción, pensamiento y acción lograron mayor alineación.";
  }
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"),loadQuestion());
}

function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  const delta=weeklyScores.at(-1)-weeklyScores[0];

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

    monthlyLongText.textContent =
      "Este tramo mostró cómo fuiste habitando tu humanidad en movimiento. "+
      "No se midieron respuestas aisladas, sino la forma en que sostuviste presencia, "+
      "empatía y coherencia a lo largo del tiempo.";

    monthlyText.textContent =
      delta>0
      ? "Se observa un aumento de conciencia respecto del inicio."
      : delta<0
      ? "El cierre del proceso muestra desgaste emocional acumulado."
      : "El nivel de conciencia se mantuvo estable durante todo el recorrido.";
  });
}

function showIntra(){
  show("intraResult");
  $("intraText").textContent =
    "Esta lectura intrapersonal refleja patrones internos sostenidos a lo largo del proceso. "+
    "Muestra cómo dialogaron emoción, pensamiento y acción en tu vida cotidiana, "+
    "y qué nivel de coherencia lograste mantener frente a los estímulos del entorno.";
}

/* ESPEJO */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?",e:"angry"},
 {t:"¿La tristeza condicionó tus decisiones?",e:"sad"},
 {t:"¿El miedo te frenó?",e:"fear"},
 {t:"¿La ansiedad te llevó a reaccionar en automático?",e:"anx"},
 {t:"¿Apareció culpa no resuelta?",e:"guilt"},
 {t:"¿Hubo desconexión emocional?",e:"flat"},
 {t:"¿La alegría fue genuina y sostenida?",e:"joy"},
 {t:"¿Evitaste una emoción dominante?",e:"q"}
];

let mq=0, mirrorScore=0, mirrorCount=0, mirrorLog=[];

function openMirror(){
  document.body.classList.add("mirror-transition");
  setTimeout(()=>show("mirrorIntro"),200);
}

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0; mirrorLog=[];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){mirrorScore+=v; mirrorCount++;}
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

function showFinal(){
  show("finalResult");

  const avg = mirrorCount ? mirrorScore/mirrorCount : 0;
  const evitadas = mirrorLog.filter(v=>v===0).length;

  finalHumanText.textContent =
    "Esta devolución integra todo tu recorrido en el Humanómetro. "+
    "Partiste de una base inicial que fue puesta a prueba por el contexto, "+
    "el tiempo y tus propias emociones.\n\n"+

    (avg>1.4
      ? "Predominó una coherencia emocional activa, con capacidad de autorregulación."
      : avg>0.9
        ? "Se observaron avances con oscilaciones según el contexto."
        : "La reactividad emocional tuvo un peso significativo en tus decisiones."
    )+

    (evitadas>2
      ? "\n\nSe detectaron emociones evitadas, señalando zonas aún no integradas."
      : "\n\nLas emociones fueron mayormente reconocidas y transitadas."
    )+

    "\n\nEsta lectura no juzga. Refleja cómo te estuviste habitando.";
}

/* UTIL */
function animateGauge(el,target,done){
  el.style.height="0%";
  const start=performance.now(), dur=1800;
  function step(t){
    const p=Math.min(1,(t-start)/dur);
    el.style.height=p*target+"%";
    p<1?requestAnimationFrame(step):done&&done();
  }
  requestAnimationFrame(step);
}

function show(id){
  ["start","test","weeklyResult","monthlyResult","intraResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s=>$(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}
