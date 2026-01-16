/* ================= CACHE ================= */
const ids = id => document.getElementById(id);

const weekTitle = ids("weekTitle");
const questionText = ids("questionText");
const questionMeasure = ids("questionMeasure");
const thermoFill = ids("thermoFill");

const weeklySymbol = ids("weeklySymbol");
const weeklyText = ids("weeklyText");
const weeklyAdvice = ids("weeklyAdvice");

const monthlyFill = ids("monthlyFill");
const monthlyTextWrap = ids("monthlyTextWrap");
const monthlySymbol = ids("monthlySymbol");
const monthlyLongText = ids("monthlyLongText");
const monthlyText = ids("monthlyText");

const mirrorEmoji = ids("mirrorEmoji");
const mirrorQuestion = ids("mirrorQuestion");
const mirrorFill = ids("mirrorFill");
const mirrorTextWrap = ids("mirrorTextWrap");
const mirrorFullText = ids("mirrorFullText");
const mirrorAlert = ids("mirrorAlert");

/* ================= DATOS ================= */
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
let weeklyScores=[], weeklyRaw=[];

/* ================= FLUJO ================= */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[];weeklyRaw=[];
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
  currentScore+=v;q++;
  q>=4?showWeekly():loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklyRaw.push(currentScore);

  if(avg<0.8){
    weeklySymbol.textContent="🦇";
    weeklyText.textContent="Predominó la reacción emocional automática.";
    weeklyAdvice.textContent="Hubo dificultad para traducir emoción en acción consciente.";
  }else if(avg<1.5){
    weeklySymbol.textContent="🐞";
    weeklyText.textContent="Conciencia intermitente.";
    weeklyAdvice.textContent="Alternaste registro y automatismo.";
  }else{
    weeklySymbol.textContent="🐦";
    weeklyText.textContent="Coherencia sostenida.";
    weeklyAdvice.textContent="Emoción, pensamiento y acción dialogaron.";
  }
}

function nextWeek(){
  week++;q=0;currentScore=0;
  week>=WEEKS.length?showMonthly(): (show("test"),loadQuestion());
}

/* ================= MENSUAL ================= */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  const delta=weeklyScores.at(-1)-weeklyScores[0];

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");

      monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";
      monthlyLongText.textContent=
        "Esta lectura integra cómo te posicionaste semana a semana. "+
        "No mide hechos aislados, sino tu forma de habitar emociones y decisiones.";
      monthlyText.textContent=
        delta>0?"Hubo crecimiento de conciencia."
        :delta<0?"Se detecta desgaste emocional."
        :"El nivel de conciencia se mantuvo estable.";
    },2000);
  });
}

/* ================= ESPEJO ================= */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?",e:"angry"},
 {t:"¿La tristeza condicionó tus decisiones?",e:"sad"},
 {t:"¿El miedo te frenó?",e:"fear"},
 {t:"¿La ansiedad te llevó a reaccionar?",e:"anx"},
 {t:"¿Apareció culpa no resuelta?",e:"guilt"},
 {t:"¿Hubo desconexión emocional?",e:"flat"},
 {t:"¿La alegría fue genuina?",e:"joy"},
 {t:"¿Evitaste una emoción dominante?",e:"q"}
];

let mq=0,mirrorScore=0,mirrorCount=0,mirrorLog=[];

function openMirror(){show("mirrorIntro");}

function startMirror(){
  mq=0;mirrorScore=0;mirrorCount=0;mirrorLog=[];
  show("mirrorTest");loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d float "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){mirrorScore+=v;mirrorCount++;}
  mq++;mq>=MIRROR_QUESTIONS.length?showMirror():loadMirror();
}

/* ================= FINAL ================= */
function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  const evitadas=mirrorLog.filter(v=>v===0).length;

  animateGauge(mirrorFill,(avg/2)*100,()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");

      mirrorAlert.textContent=
        avg>1.4?"🟢 Estado integrado"
        :avg>0.9?"🟡 Estado inestable"
        :"🔴 Alerta emocional";

      mirrorFullText.textContent=
        "La devolución final integra todo tu recorrido mensual. "+
        "Mostró cómo respondiste ante el mundo, la tecnología y vos mismo. "+
        (avg>1.4?"Predominó la coherencia."
        :avg>0.9?"Hubo avances con retrocesos."
        :"La reactividad tuvo peso.")+
        (evitadas>2?" Se detectaron emociones evitadas."
        :" Las emociones fueron mayormente reconocidas.")+
        " No juzga: refleja.";
    },2500);
  });
}

/* ================= UTIL ================= */
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
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","mirrorResult"]
    .forEach(s=>ids(s).classList.add("hidden"));
  ids(id).classList.remove("hidden");
    }
