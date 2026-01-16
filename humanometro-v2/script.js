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

let week=0,q=0,currentScore=0;
let weeklyScores=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;weeklyScores=[];
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
  currentScore+=v; q++;
  q>=4?showWeekly():loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);

  if(avg<0.8){
    weeklySymbol.textContent="🦇";
    weeklyText.textContent=
      "En este tramo tu respuesta estuvo marcada por una alta sensibilidad al contexto. "+
      "Las emociones emergieron con fuerza y no siempre encontraron un canal consciente.";
    weeklyAdvice.textContent=
      "Registrar esto no es un límite: es información valiosa para recuperar presencia.";
  }else if(avg<1.5){
    weeklySymbol.textContent="🐞";
    weeklyText.textContent=
      "Se observaron avances con alternancia. "+
      "Hubo momentos de conexión clara y otros de reacción automática.";
    weeklyAdvice.textContent=
      "La integración se construye justamente en esa oscilación.";
  }else{
    weeklySymbol.textContent="🐦";
    weeklyText.textContent=
      "Lograste sostener una coherencia emocional activa. "+
      "Pensamiento, emoción y acción dialogaron de forma consistente.";
    weeklyAdvice.textContent=
      "Este estado es una referencia, no una exigencia.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++;q=0;currentScore=0;
  week>=WEEKS.length?showMonthly():(show("test"),loadQuestion());
}

function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";
    monthlyLongText.textContent=
      "Este recorrido refleja cómo te vinculaste con el entorno, "+
      "los estímulos colectivos y la vida cotidiana.";
    monthlyText.textContent=
      "No muestra respuestas aisladas, sino un proceso sostenido.";
  });
}

/* ESPEJO */
const MIRROR_QUESTIONS=[
 {t:"¿Sentiste enojo que influyó en tu actuar?"},
 {t:"¿La tristeza condicionó tus decisiones?"},
 {t:"¿El miedo te frenó?"},
 {t:"¿La ansiedad te llevó a reaccionar en automático?"},
 {t:"¿Apareció culpa no resuelta?"},
 {t:"¿Hubo desconexión emocional?"},
 {t:"¿La alegría fue genuina y sostenida?"},
 {t:"¿Evitaste una emoción dominante?"}
];

let mq=0,mirrorScore=0,mirrorCount=0,mirrorLog=[];

function startMirror(){
  mq=0;mirrorScore=0;mirrorCount=0;mirrorLog=[];
  show("mirrorTest");loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){mirrorScore+=v;mirrorCount++;}
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;
  const evitadas=mirrorLog.filter(v=>v===0).length;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.className = "final-state " + (avg>1.4?"good":avg>0.9?"mid":"low");
    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    finalHumanText.textContent =
      "A lo largo de todo el recorrido se observa un patrón claro en tu forma de responder. "+
      "Desde tu vínculo con el mundo, el uso de la tecnología y la coherencia cotidiana, "+
      "hasta el registro emocional más íntimo del espejo, fuiste mostrando cómo te habitás.\n\n"+
      (avg>1.4
        ?"Predominó una integración emocional consciente. Supiste reconocer lo que sentías y actuar en consecuencia."
        :avg>0.9
          ?"Mostraste capacidad de registro con fluctuaciones. El contexto influyó, pero hubo conciencia."
          :"La reactividad tuvo un peso significativo. Las emociones guiaron muchas decisiones.")+
      (evitadas>2
        ?"\n\nAlgunas emociones tendieron a evitarse. Integrarlas puede abrir mayor claridad."
        :"\n\nLas emociones fueron mayormente reconocidas y transitadas.")+
      "\n\nLa sugerencia es simple: sostener la observación sin juicio. "+
      "La humanidad no se corrige, se acompaña.";
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
