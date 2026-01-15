/* CACHE */
const weekTitle = weekTitle=document.getElementById("weekTitle");
const questionText=document.getElementById("questionText");
const questionMeasure=document.getElementById("questionMeasure");
const thermoFill=document.getElementById("thermoFill");
const weeklySymbol=document.getElementById("weeklySymbol");
const weeklyText=document.getElementById("weeklyText");
const weeklyAdvice=document.getElementById("weeklyAdvice");
const monthlyFill=document.getElementById("monthlyFill");
const monthlyTextWrap=document.getElementById("monthlyTextWrap");
const monthlySymbol=document.getElementById("monthlySymbol");
const monthlyLongText=document.getElementById("monthlyLongText");
const monthlyText=document.getElementById("monthlyText");
const mirrorEmoji=document.getElementById("mirrorEmoji");
const mirrorQuestion=document.getElementById("mirrorQuestion");
const mirrorFill=document.getElementById("mirrorFill");
const mirrorTextWrap=document.getElementById("mirrorTextWrap");
const mirrorFullText=document.getElementById("mirrorFullText");

/* DATOS */
const WEEKS=[{title:"Vos ante el mundo",questions:[
["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
["¿Sentís impulso de involucrarte ante injusticias?","Compromiso humano"],
["¿Te afecta el sufrimiento ajeno?","Sensibilidad emocional"]
]}];

let week=0,q=0,weeklyScores=[],currentScore=0;

/* FLUJO */
function startV2(){week=0;q=0;weeklyScores=[];currentScore=0;show("test");loadQuestion();}
function loadQuestion(){
  const w=WEEKS[week];
  weekTitle.innerText=w.title;
  questionText.innerText=w.questions[q][0];
  questionMeasure.innerText=w.questions[q][1];
  thermoFill.style.width=(q/4)*100+"%";
}
function answer(v){currentScore+=v;q++;q>=4?showWeeklyResult():loadQuestion();}
function showWeeklyResult(){
  show("weeklyResult");
  const avg=currentScore/4;weeklyScores.push(avg);
  weeklySymbol.innerText=avg<1?"🦇":"🐦";
  weeklyText.innerText="La semana reflejó tu forma real de habitar las emociones.";
  weeklyAdvice.innerText="Registrar sin juzgar es parte del proceso.";
}
function nextWeek(){showMonthly();}

/* MENSUAL */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");
  animateGauge(monthlyFill,70,()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");
      monthlySymbol.innerText="🐦";
      monthlyLongText.innerText="El proceso mensual mostró una evolución en tu forma de responder emocionalmente.";
      monthlyText.innerText="No es un punto final, es una fotografía del movimiento humano.";
    },2000);
  });
}

/* ESPEJO */
const MIRROR_QUESTIONS=[
{t:"¿Sentiste enojo que influyó en tu actuar?",c:"angry"},
{t:"¿La tristeza condicionó tus decisiones?",c:"sad"},
{t:"¿El miedo te frenó?",c:"fear"},
{t:"¿La ansiedad te llevó al automatismo?",c:"anx"},
{t:"¿Apareció culpa no resuelta?",c:"guilt"},
{t:"¿Hubo desconexión emocional?",c:"flat"},
{t:"¿La alegría fue genuina?",c:"joy"},
{t:"¿Evitaste una emoción dominante?",c:"frozen"}
];

let mq=0,mirrorScore=0,mirrorCount=0;
function openMirror(){show("mirrorIntro");}
function startMirror(){mq=0;mirrorScore=0;mirrorCount=0;show("mirrorTest");loadMirror();}
function loadMirror(){
  mirrorEmoji.className="emoji3d "+MIRROR_QUESTIONS[mq].c;
  mirrorQuestion.innerText=MIRROR_QUESTIONS[mq].t;
}
function answerMirror(v){
  if(v!==null){mirrorScore+=v;mirrorCount++;}
  mq++;mq>=MIRROR_QUESTIONS.length?showMirror():loadMirror();
}
function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");
  animateGauge(mirrorFill,80,()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");
      mirrorFullText.innerText=
      "Esta devolución integra todo tu recorrido dentro de Humanómetro. "+
      "Desde la base inicial hasta las variaciones emocionales semanales, "+
      "el espejo refleja cómo fuiste habitando tus emociones, decisiones y acciones. "+
      "No hubo juicio, solo registro. La congruencia no es permanente, "+
      "pero la conciencia aparece cuando te mirás sin huir.";
    },3000);
  });
}

/* UTIL */
function animateGauge(el,target,done){
  el.style.height="0%";
  const s=performance.now(),d=2000;
  function step(t){
    const p=Math.min(1,(t-s)/d);
    el.style.height=Math.round(p*target)+"%";
    p<1?requestAnimationFrame(step):done&&done();
  }
  requestAnimationFrame(step);
}
function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","mirrorResult"]
  .forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
