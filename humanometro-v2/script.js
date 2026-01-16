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
      "Durante este tramo predominó una respuesta emocional reactiva. "+
      "Los estímulos externos tuvieron mayor peso que la autorregulación interna. "+
      "Hubo registro del impacto emocional, pero dificultad para transformarlo "+
      "en acción consciente sostenida a lo largo del tiempo.";
    weeklyAdvice.textContent=
      "Esto no habla de error, sino de sobrecarga emocional. "+
      "Observarlo es parte del proceso de recuperación de presencia.";
  }else if(avg<1.5){
    weeklySymbol.textContent="🐞";
    weeklyText.textContent=
      "La conciencia apareció de forma intermitente. "+
      "Alternaste momentos de presencia con respuestas automáticas "+
      "según el contexto y el nivel de demanda emocional.";
    weeklyAdvice.textContent=
      "El proceso está activo: reconocer cuándo te perdés "+
      "es parte del camino de integración.";
  }else{
    weeklySymbol.textContent="🐦";
    weeklyText.textContent=
      "Se sostuvo una coherencia emocional activa. "+
      "Lograste integrar emoción, pensamiento y acción "+
      "en la mayoría de las situaciones observadas.";
    weeklyAdvice.textContent=
      "Este nivel de presencia no es permanente, "+
      "pero sí disponible cuando hay conciencia.";
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
      "Este bloque integró tu vínculo con el mundo, "+
      "los estímulos colectivos y el entorno cotidiano. "+
      "No midió hechos aislados, sino la forma en que "+
      "habitaste emocionalmente el contexto.";
    monthlyText.textContent=
      "La lectura refleja un proceso sostenido, "+
      "no una respuesta puntual.";
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

function openMirror(){ show("mirrorIntro"); }

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

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    finalHumanText.textContent=
      "Esta devolución integra todo tu recorrido en el Humanómetro, "+
      "desde los primeros registros hasta las variaciones observadas "+
      "a lo largo del tiempo.\n\n"+
      "Refleja cómo habitaste tu vínculo con el mundo, "+
      "la tecnología y tu mundo interno.\n\n"+
      (avg>1.4
        ?"Predominó una coherencia emocional activa, con capacidad de autorregulación."
        :avg>0.9
          ?"Se observaron avances con oscilaciones según el contexto."
          :"La reactividad emocional tuvo un peso significativo.")+
      (evitadas>2
        ?"\n\nSe detectaron emociones evitadas, señalando zonas aún no integradas."
        :"\n\nLas emociones fueron mayormente reconocidas y transitadas.")+
      "\n\nEsta lectura no juzga. Refleja.";
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
