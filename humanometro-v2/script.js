/* ================= FIX BOTÓN INICIO ================= */
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(
    '#start button[onclick="startV2()"]'
  );
  if (startBtn) {
    startBtn.addEventListener("click", startV2);
  }
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

let week=0, q=0, weeklyScores=[], currentScore=0;

/* ================= FLUJO V2 ================= */
function startV2(){
  week=0;
  q=0;
  weeklyScores=[];
  currentScore=0;
  show("test");
  loadQuestion();
}

function loadQuestion(){
  const w=WEEKS[week];
  weekTitle.innerText=w.title;
  questionText.innerText=w.questions[q][0];
  questionMeasure.innerText=w.questions[q][1];
  thermoFill.style.width=(q/4)*100+"%";
}

function answer(v){
  currentScore+=v;
  q++;
  q>=4 ? showWeeklyResult() : loadQuestion();
}

function showWeeklyResult(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);

  if(avg<0.8){
    weeklySymbol.innerText="🦇";
    weeklyText.innerText="La semana evidenció desconexión entre emoción y acción.";
    weeklyAdvice.innerText="Registrar lo sentido sin juzgar permite iniciar la integración.";
  }else if(avg<1.5){
    weeklySymbol.innerText="🐞";
    weeklyText.innerText="La presencia apareció de forma intermitente.";
    weeklyAdvice.innerText="Hubo momentos de conciencia y otros de reacción automática.";
  }else{
    weeklySymbol.innerText="🐦";
    weeklyText.innerText="Se sostuvo una coherencia creciente.";
    weeklyAdvice.innerText="Cuando emoción y acción dialogan, la humanidad se fortalece.";
  }
}

function nextWeek(){
  week++;
  q=0;
  currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* ================= TERMÓMETRO MENSUAL ================= */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  animateGauge(monthlyFill, Math.round((avg/2)*100), ()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");

      if(avg<0.8){
        monthlySymbol.innerText="🦇";
        monthlyLongText.innerText =
          "El recorrido mensual mostró reactividad sostenida y dificultad para integrar emoción y acción.";
      }else if(avg<1.5){
        monthlySymbol.innerText="🐞";
        monthlyLongText.innerText =
          "El proceso evidenció avances y retrocesos, con momentos de conciencia intermitente.";
      }else{
        monthlySymbol.innerText="🐦";
        monthlyLongText.innerText =
          "A lo largo del mes se observó una integración progresiva y mayor coherencia sostenida.";
      }

      monthlyText.innerText =
        "Esta lectura no define quién sos: refleja cómo te estuviste habitando en el tiempo.";
    },2000);
  });
}

/* ================= ESPEJO ================= */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?",e:"angry"},
 {t:"¿La tristeza condicionó tus decisiones o energía?",e:"sad"},
 {t:"¿El miedo te frenó?",e:"fear"},
 {t:"¿La ansiedad te llevó a reaccionar en automático?",e:"anx"},
 {t:"¿Apareció culpa no resuelta?",e:"guilt"},
 {t:"¿Hubo desconexión emocional?",e:"flat"},
 {t:"¿La alegría fue genuina?",e:"joy"},
 {t:"¿Evitaste alguna emoción dominante?",e:"q"}
];

let mq=0, mirrorScore=0, mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0;
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d float "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showMirror() : loadMirror();
}

/* ================= TERMÓMETRO FINAL ================= */
function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  animateGauge(mirrorFill, Math.round((avg/2)*100), ()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");
      mirrorFullText.innerText =
        "El espejo integra todo tu recorrido: la base inicial, las variaciones del mes y tu forma de habitar las emociones. "+
        "No juzga, refleja.";
    },3000);
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
