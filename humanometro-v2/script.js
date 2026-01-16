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
const mirrorFullText = ids("mirrorFullText");

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
let weeklyScores=[];

/* ================= FLUJO ================= */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[];
  show("test");
  loadQuestion();
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
  q++;
  q>=4 ? showWeekly() : loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);

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
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"),loadQuestion());
}

function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";
    monthlyLongText.textContent="Esta lectura integra tu recorrido semanal.";
    monthlyText.textContent="No mide hechos aislados sino proceso.";
  });
}

function showIntra(){
  show("intraResult");
  ids("intraText").textContent=
    "Esta lectura intrapersonal refleja tu coherencia interna a lo largo del proceso. "+
    "No juzga respuestas, observa patrones emocionales sostenidos.";
}

function openMirror(){
  document.body.classList.add("mirror-transition");
  setTimeout(()=>show("mirrorIntro"),200);
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

let mq=0,mirrorScore=0,mirrorCount=0;

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0;
  show("mirrorTest");
  loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){mirrorScore+=v;mirrorCount++;}
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showMirror() : loadMirror();
}

function showMirror(){
  show("finalResult");
  ids("finalHumanText").textContent=
    "La devolución final integra todo tu recorrido en el Humanómetro. "+
    "No señala errores ni aciertos. Refleja cómo habitaste tus emociones, "+
    "tus decisiones y tu vínculo con el mundo.";
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
  ["start","test","weeklyResult","monthlyResult","intraResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s=>ids(s).classList.add("hidden"));
  ids(id).classList.remove("hidden");
      }
