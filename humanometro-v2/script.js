const ids = id => document.getElementById(id);

/* ===== CACHE ===== */
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

/* ===== DATOS ===== */
const WEEKS = [
  { title:"Vos ante el mundo", questions:[
    ["¿Te afectan noticias de guerras?","Empatía global"],
    ["¿Dejás el celular al hablar?","Presencia"],
    ["¿Te involucrás ante injusticias?","Compromiso"],
    ["¿Sentís el dolor ajeno?","Sensibilidad"]
  ]},
  { title:"Vos y la tecnología", questions:[
    ["¿Soltás el celular al compartir?","Uso consciente"],
    ["¿Controlás pantallas?","Autocontrol"],
    ["¿Hay empatía digital?","Empatía"],
    ["¿Hay equilibrio?","Balance"]
  ]},
  { title:"Integración humana", questions:[
    ["¿Coherencia interna?","Coherencia"],
    ["¿Te observás sin juzgar?","Conciencia"],
    ["¿Asumís impacto?","Responsabilidad"],
    ["¿Evolución?","Integración"]
  ]}
];

let week=0,q=0,currentScore=0;
let weeklyScores=[];

/* ===== FLUJO ===== */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[];
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
  weeklySymbol.textContent=avg>1.4?"🐦":avg>0.8?"🐞":"🦇";
  weeklyText.textContent="Lectura semanal registrada.";
  weeklyAdvice.textContent="Continuar observando.";
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ===== MENSUAL ===== */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");
  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");
      monthlySymbol.textContent=avg>1.4?"🐦":avg>0.8?"🐞":"🦇";
      monthlyLongText.textContent="Tu humanidad en movimiento.";
      monthlyText.textContent="Proceso integrado.";
    },2000);
  });
}

/* ===== ESPEJO ===== */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo?",e:"angry"},
 {t:"¿Tristeza influyó?",e:"sad"},
 {t:"¿El miedo frenó?",e:"fear"},
 {t:"¿Ansiedad?",e:"anx"},
 {t:"¿Culpa?",e:"guilt"},
 {t:"¿Desconexión?",e:"flat"},
 {t:"¿Alegría genuina?",e:"joy"},
 {t:"¿Evitaste emoción?",e:"q"}
];

let mq=0,mirrorScore=0,mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  document.body.classList.add("mirror-active");
  mq=0; mirrorScore=0; mirrorCount=0;
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showMirror() : loadMirror();
}

function showMirror(){
  document.body.classList.remove("mirror-active");
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  animateGauge(mirrorFill,(avg/2)*100,()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");
      mirrorAlert.textContent=avg>1.4?"🟢 Integrado":avg>0.9?"🟡 Inestable":"🔴 Alerta";
      mirrorFullText.textContent="El espejo no juzga. Refleja.";
    },2500);
  });
}

/* ===== UTIL ===== */
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
