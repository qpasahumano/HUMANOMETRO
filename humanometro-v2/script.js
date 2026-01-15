const weekTitle = document.getElementById("weekTitle");
const questionText = document.getElementById("questionText");
const questionMeasure = document.getElementById("questionMeasure");
const thermoFill = document.getElementById("thermoFill");

const weeklySymbol = document.getElementById("weeklySymbol");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");

const monthlyFill = document.getElementById("monthlyFill");
const monthlyGauge = document.getElementById("monthlyGauge");
const monthlyTextWrap = document.getElementById("monthlyTextWrap");
const monthlySymbol = document.getElementById("monthlySymbol");
const monthlyLongText = document.getElementById("monthlyLongText");
const monthlyText = document.getElementById("monthlyText");

const mirrorEmoji = document.getElementById("mirrorEmoji");
const mirrorQuestion = document.getElementById("mirrorQuestion");
const mirrorFill = document.getElementById("mirrorFill");
const mirrorGauge = document.getElementById("mirrorGauge");
const mirrorTextWrap = document.getElementById("mirrorTextWrap");
const mirrorFullText = document.getElementById("mirrorFullText");

/* ---------- DATOS ---------- */

const WEEKS = [
  { title:"Vos ante el mundo", questions:[
    ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
    ["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
    ["¿Sentís impulso de involucrarte ante injusticias?","Compromiso"],
    ["¿Te afecta el sufrimiento ajeno?","Sensibilidad"]
  ]},
  { title:"Vos y la tecnología", questions:[
    ["¿Podés soltar el celular al compartir?","Uso consciente"],
    ["¿Controlás el tiempo en pantallas?","Autocontrol"],
    ["¿Recordás que hay personas reales detrás de una pantalla?","Empatía digital"],
    ["¿La tecnología acompaña sin absorberte?","Equilibrio"]
  ]},
  { title:"Integración humana", questions:[
    ["¿Hay coherencia entre lo que pensás y hacés?","Coherencia"],
    ["¿Podés observarte sin juzgarte?","Autoconciencia"],
    ["¿Asumís tu impacto en otros?","Responsabilidad"],
    ["¿Sentís evolución humana?","Integración"]
  ]}
];

let week=0, q=0, weeklyScores=[], currentScore=0;

/* ---------- VOLUMEN 2 ---------- */

function startV2(){ week=0; q=0; weeklyScores=[]; currentScore=0; show("test"); loadQuestion(); }

function loadQuestion(){
  const w=WEEKS[week];
  weekTitle.innerText=w.title;
  questionText.innerText=w.questions[q][0];
  questionMeasure.innerText=w.questions[q][1];
  thermoFill.style.width=(q/4)*100+"%";
}

function answer(v){ currentScore+=v; q++; q>=4?showWeeklyResult():loadQuestion(); }

function showWeeklyResult(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);

  if(avg<0.8){
    weeklySymbol.innerText="🦇";
    weeklyText.innerText="La semana mostró desconexión emocional.";
    weeklyAdvice.innerText="Registrar lo que sentís es el primer paso para integrarlo.";
  }else if(avg<1.5){
    weeklySymbol.innerText="🐞";
    weeklyText.innerText="Hubo conciencia parcial.";
    weeklyAdvice.innerText="La presencia apareció, pero no fue constante.";
  }else{
    weeklySymbol.innerText="🐦";
    weeklyText.innerText="Se sostuvo una coherencia creciente.";
    weeklyAdvice.innerText="Cuando emoción y acción dialogan, la humanidad se expande.";
  }
}

function nextWeek(){ week++; q=0; currentScore=0; week>=WEEKS.length?showMonthly(): (show("test"),loadQuestion()); }

function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");
  monthlyGauge.classList.remove("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  monthlyFill.style.height=Math.round((avg/2)*100)+"%";

  setTimeout(()=>{
    monthlyGauge.classList.add("hidden");
    monthlyTextWrap.classList.remove("hidden");

    if(avg<0.8){
      monthlySymbol.innerText="🦇";
      monthlyLongText.innerText="El mes reflejó una dificultad para sostener coherencia emocional en el tiempo.";
    }else if(avg<1.5){
      monthlySymbol.innerText="🐞";
      monthlyLongText.innerText="El recorrido mostró avances intermitentes y momentos de automatismo.";
    }else{
      monthlySymbol.innerText="🐦";
      monthlyLongText.innerText="El proceso mensual evidenció una integración progresiva de tu humanidad.";
    }

    monthlyText.innerText =
      "Esta lectura no define quién sos, sino cómo habitaste tus emociones, decisiones y acciones durante este período.";
  },2000);
}

/* ---------- ESPEJO ---------- */

const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?",e:"angry"},
 {t:"¿La tristeza condicionó tus decisiones?",e:"sad"},
 {t:"¿El miedo te frenó?",e:"fear"},
 {t:"¿Actuaste desde ansiedad?",e:"anx"},
 {t:"¿Apareció culpa no resuelta?",e:"guilt"},
 {t:"¿Hubo desconexión emocional?",e:"flat"},
 {t:"¿La alegría fue genuina?",e:"joy"},
 {t:"¿Evitaste alguna emoción?",e:"q"}
];

let mq=0, mirrorScore=0, mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }
function startMirror(){ mq=0; mirrorScore=0; mirrorCount=0; show("mirrorTest"); loadMirrorQ(); }

function loadMirrorQ(){
  mirrorEmoji.className="emoji3d float "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length?showMirror():loadMirrorQ();
}

function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");
  mirrorGauge.classList.remove("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  mirrorFill.style.height=Math.round((avg/2)*100)+"%";

  setTimeout(()=>{
    mirrorGauge.classList.add("hidden");
    mirrorTextWrap.classList.remove("hidden");

    mirrorFullText.innerText =
      "El espejo integró todo tu recorrido mensual. A partir de una base inicial, "+
      "se observaron variaciones en tu nivel de conciencia, momentos de mayor presencia "+
      "y otros de reacción automática. Esta lectura no juzga: refleja cómo habitaste tus "+
      "emociones, cómo influyeron en tus decisiones y qué grado de coherencia sostuviste "+
      "a lo largo del tiempo. La humanidad no se pierde, pero se apaga cuando no se la habita conscientemente.";
  },2000);
}

/* ---------- UTIL ---------- */
function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","mirrorResult"]
    .forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
