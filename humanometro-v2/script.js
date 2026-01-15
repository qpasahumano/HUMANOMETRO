/* ================= FIX BOTÓN INICIO ================= */
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(
    '#start button[onclick="startV2()"]'
  );
  if (startBtn) startBtn.addEventListener("click", startV2);
});

/* ================= CACHE ================= */
const weekTitle = document.getElementById("weekTitle");
const questionText = document.getElementById("questionText");
const questionMeasure = document.getElementById("questionMeasure");
const thermoFill = document.getElementById("thermoFill");

const weeklySymbol = document.getElementById("weeklySymbol");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");

const monthlyFill = document.getElementById("monthlyFill");
const monthlyTextWrap = document.getElementById("monthlyTextWrap");
const monthlySymbol = document.getElementById("monthlySymbol");
const monthlyLongText = document.getElementById("monthlyLongText");
const monthlyText = document.getElementById("monthlyText");

const mirrorEmoji = document.getElementById("mirrorEmoji");
const mirrorQuestion = document.getElementById("mirrorQuestion");
const mirrorFill = document.getElementById("mirrorFill");
const mirrorTextWrap = document.getElementById("mirrorTextWrap");
const mirrorFullText = document.getElementById("mirrorFullText");

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

let week=0, q=0;
let weeklyScores=[], weeklyRaw=[];
let currentScore=0;

/* ================= FLUJO ================= */
function startV2(){
  week=0; q=0;
  weeklyScores=[]; weeklyRaw=[];
  currentScore=0;
  show("test"); loadQuestion();
}

function loadQuestion(){
  const w=WEEKS[week];
  weekTitle.innerText=w.title;
  questionText.innerText=w.questions[q][0];
  questionMeasure.innerText=w.questions[q][1];
  thermoFill.style.width=(q/4)*100+"%";
}

function answer(v){
  currentScore+=v; q++;
  q>=4 ? showWeeklyResult() : loadQuestion();
}

function showWeeklyResult(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklyRaw.push(currentScore);

  if(avg<0.8){
    weeklySymbol.innerText="🦇";
    weeklyText.innerText="Predominó la reacción automática.";
    weeklyAdvice.innerText="Las emociones se activaron sin lograr traducirse en acciones conscientes.";
  }else if(avg<1.5){
    weeklySymbol.innerText="🐞";
    weeklyText.innerText="Conciencia intermitente.";
    weeklyAdvice.innerText="Alternaste presencia con respuestas condicionadas.";
  }else{
    weeklySymbol.innerText="🐦";
    weeklyText.innerText="Coherencia activa.";
    weeklyAdvice.innerText="Emoción, pensamiento y acción dialogaron de forma sostenida.";
  }
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"),loadQuestion());
}

/* ================= MENSUAL ================= */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  const delta=weeklyScores.at(-1)-weeklyScores[0];

  animateGauge(monthlyFill,Math.round((avg/2)*100),()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");

      monthlyLongText.innerText =
        avg>1.4
          ? "El recorrido mostró una integración progresiva y mayor coherencia sostenida."
          : avg>0.9
            ? "El proceso fue oscilante, con avances y retrocesos según el contexto."
            : "Predominó la reactividad emocional y el desgaste acumulado.";

      monthlyText.innerText =
        delta>0
          ? "El cierre del mes evidencia crecimiento respecto del inicio."
          : delta<0
            ? "El cierre del mes refleja mayor carga reactiva."
            : "El nivel de conciencia se mantuvo estable.";
    },2000);
  });
}

/* ================= ESPEJO ================= */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?",e:"angry"},
 {t:"¿La tristeza condicionó tus decisiones?",e:"sad"},
 {t:"¿El miedo te frenó?",e:"fear"},
 {t:"¿La ansiedad te llevó a automatismos?",e:"anx"},
 {t:"¿Apareció culpa no resuelta?",e:"guilt"},
 {t:"¿Hubo desconexión emocional?",e:"flat"},
 {t:"¿La alegría fue genuina y sostenida?",e:"joy"},
 {t:"¿Evitaste alguna emoción dominante?",e:"q"}
];

let mq=0, mirrorScore=0, mirrorCount=0, mirrorLog=[];

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0; mirrorLog=[];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showMirror() : loadMirror();
}

/* ================= FINAL ================= */
function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  const evitadas=mirrorLog.filter(v=>v===0).length;

  mirrorTextWrap.className =
    "result-text "+
    (avg>1.4?"led-green":avg>0.9?"led-yellow":"led-red");

  animateGauge(mirrorFill,Math.round((avg/2)*100),()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");

      mirrorFullText.innerText =
        "Esta lectura integra todo tu recorrido en Humanómetro.\n\n"+
        (avg>1.4
          ? "Predominó coherencia emocional y autorregulación consciente."
          : avg>0.9
            ? "La conciencia fue intermitente, con avances y retrocesos."
            : "La reactividad emocional influyó de forma significativa.")+
        (evitadas>2
          ? "\n\nSe detectaron emociones evitadas, señalando zonas no integradas."
          : "\n\nLas emociones fueron mayormente reconocidas y transitadas.")+
        "\n\nEsto no juzga. Refleja cómo te estuviste habitando.";
    },2000); // ⬅ medio segundo menos
  });
}

/* ================= UTIL ================= */
function animateGauge(el,target,done){
  el.style.height="0%";
  const start=performance.now(), dur=1800;
  function step(t){
    const p=Math.min(1,(t-start)/dur);
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
