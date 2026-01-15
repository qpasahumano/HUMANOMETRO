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

let week = 0, q = 0;
let weeklyScores = [];
let weeklyRaw = [];
let currentScore = 0;

/* ================= FLUJO V2 ================= */
function startV2(){
  week=0; q=0;
  weeklyScores=[];
  weeklyRaw=[];
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
  currentScore += v;
  q++;
  q>=4 ? showWeeklyResult() : loadQuestion();
}

function showWeeklyResult(){
  show("weeklyResult");
  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklyRaw.push(currentScore);

  if(avg<0.8){
    weeklySymbol.innerText="🦇";
    weeklyText.innerText="Durante esta semana predominó la reacción automática.";
    weeklyAdvice.innerText="Hubo emociones activadas que no lograron traducirse en acciones conscientes.";
  }else if(avg<1.5){
    weeklySymbol.innerText="🐞";
    weeklyText.innerText="La presencia apareció de forma intermitente.";
    weeklyAdvice.innerText="Alternaste momentos de conciencia con respuestas condicionadas.";
  }else{
    weeklySymbol.innerText="🐦";
    weeklyText.innerText="Se sostuvo una coherencia activa.";
    weeklyAdvice.innerText="Emoción, pensamiento y acción mostraron alineación creciente.";
  }
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"),loadQuestion());
}

/* ================= TERMÓMETRO MENSUAL ================= */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  const delta = weeklyScores[weeklyScores.length-1] - weeklyScores[0];

  animateGauge(monthlyFill, Math.round((avg/2)*100), ()=>{
    setTimeout(()=>{
      monthlyTextWrap.classList.remove("hidden");

      if(avg<0.8){
        monthlySymbol.innerText="🦇";
        monthlyLongText.innerText =
          "El proceso mensual mostró una base inicial frágil y sostenida dificultad para integrar emoción y acción.";
      }else if(avg<1.5){
        monthlySymbol.innerText="🐞";
        monthlyLongText.innerText =
          "El recorrido evidenció avances parciales, con oscilaciones entre presencia y automatismo.";
      }else{
        monthlySymbol.innerText="🐦";
        monthlyLongText.innerText =
          "A lo largo del mes se consolidó una integración progresiva, con mayor coherencia sostenida.";
      }

      monthlyText.innerText =
        delta > 0
          ? "Comparando el inicio con el cierre del mes, se observa un aumento de conciencia y regulación emocional."
          : delta < 0
            ? "El cierre del mes mostró desgaste respecto del inicio, señalando reactividad acumulada."
            : "El nivel de conciencia se mantuvo estable durante todo el mes.";
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
 {t:"¿La alegría fue genuina y sostenida?",e:"joy"},
 {t:"¿Evitaste alguna emoción dominante?",e:"q"}
];

let mq=0, mirrorScore=0, mirrorCount=0;
let mirrorLog = [];

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0; mirrorLog=[];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.className="emoji3d float "+MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){
    mirrorScore+=v;
    mirrorCount++;
    mirrorLog.push(v);
  } else {
    mirrorLog.push(0);
  }
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showMirror() : loadMirror();
}

/* ================= DEVOLUCIÓN FINAL ================= */
function showMirror(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore/mirrorCount : 0;
  const evitadas = mirrorLog.filter(v=>v===0).length;

  animateGauge(mirrorFill, Math.round((avg/2)*100), ()=>{
    setTimeout(()=>{
      mirrorTextWrap.classList.remove("hidden");

      mirrorFullText.innerText =
        "La lectura final integra todo tu recorrido en Humanómetro. " +
        "Partiste de una base inicial que fue puesta a prueba a lo largo del mes. " +
        "Las respuestas semanales mostraron cómo reaccionaste ante distintos contextos, " +
        "y el espejo reveló qué emociones lograste sostener y cuáles tendiste a evitar.\n\n" +

        (avg>1.4
          ? "Predominó la coherencia emocional y una capacidad activa de autorregulación."
          : avg>0.9
            ? "Hubo conciencia intermitente, con avances y retrocesos según el contexto."
            : "La reactividad emocional tuvo un peso significativo en tus decisiones."
        ) +

        (evitadas>2
          ? "\n\nSe observaron emociones evitadas, lo que indica zonas que aún no fueron integradas."
          : "\n\nLa mayoría de las emociones fueron reconocidas y transitadas."
        ) +

        "\n\nEsta devolución no juzga. Refleja cómo te estuviste habitando.";
    },2500);
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
