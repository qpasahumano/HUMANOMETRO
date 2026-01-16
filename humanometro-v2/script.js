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

/* DATOS – NO TOCADOS */
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

/* REGISTRO GLOBAL */
let week=0,q=0,currentScore=0;
let weeklyScores=[];
let allAnswers=[];
let mirrorLog=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;
  weeklyScores=[]; allAnswers=[]; mirrorLog=[];
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
  currentScore+=v;
  allAnswers.push({ block:WEEKS[week].title, q, v });
  q++;
  q>=4?showWeekly():loadQuestion();
}

/* DEVOLUCIONES SEMANALES (YA TRABAJADAS – NO SE TOCAN) */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(avg<0.8){
    weeklyText.textContent =
      "A lo largo de estos días, el entorno pareció tener más peso que tu eje interno. "+
      "Las respuestas muestran reacciones frecuentes frente a estímulos externos, "+
      "con dificultad para sostener presencia cuando la situación se vuelve demandante.";
    weeklyAdvice.textContent =
      "Registrar este punto no es un error: es una señal de dónde volver a mirar.";
  } else if(avg<1.5){
    weeklyText.textContent =
      "El recorrido de la semana fue irregular. "+
      "Se alternaron momentos de presencia con respuestas automáticas, "+
      "lo que indica un proceso activo de ajuste.";
    weeklyAdvice.textContent =
      "La conciencia aparece por contraste. Notarlo ya es parte del camino.";
  } else {
    weeklyText.textContent =
      "Se observa una coherencia sostenida entre lo que sentís, pensás y hacés. "+
      "Incluso ante estímulos externos, hubo margen de elección.";
    weeklyAdvice.textContent =
      "Este estado no es permanente, pero sí accesible cuando hay registro.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length?showMonthly():(show("test"),loadQuestion());
}

/* CIERRE BLOQUE BOSQUE */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

    monthlyLongText.textContent =
      "Este tramo reflejó cómo te moviste en el mundo cotidiano, "+
      "en el vínculo con otros y con la tecnología. "+
      "Las respuestas muestran patrones sostenidos más que hechos aislados.";

    monthlyText.textContent =
      "Aparecen avances, pausas y tensiones propias de un proceso humano real.";
  });
}

/* =================================================
   ESPEJO – PREGUNTAS CONTEXTUALIZADAS (ÚNICO AJUSTE)
   ================================================= */
const MIRROR_QUESTIONS = [
  {
    t: "Vas por la calle y una situación externa te impide avanzar o seguir con tu rutina durante varios minutos. ¿Cuánto enojo apareció en vos en ese momento?"
  },
  {
    t: "Al enterarte de una situación difícil que afecta a otras personas, notaste que tu energía o tus decisiones cambiaron. ¿Cuánto impacto emocional tuvo en vos?"
  },
  {
    t: "Ante una decisión importante o una posible pérdida, sentiste una tensión interna que te hizo dudar o frenar. ¿Cuánto influyó ese miedo?"
  },
  {
    t: "Después de decir o hacer algo, quedó una sensación interna sin resolver que volvió varias veces a tu mente. ¿Cuánto peso tuvo eso en vos?"
  },
  {
    t: "Durante el día, sentiste inquietud o urgencia interna que te llevó a reaccionar sin pensar demasiado. ¿Cuánto predominó ese estado?"
  },
  {
    t: "En situaciones donde había personas o momentos importantes, notaste que estabas emocionalmente distante o desconectado. ¿Cuánto te pasó esto?"
  },
  {
    t: "En medio de lo cotidiano, hubo momentos de bienestar que se sintieron coherentes con lo que estabas viviendo. ¿Cuánto los registraste?"
  },
  {
    t: "Mirando el período en conjunto, hubo alguna emoción presente que evitaste mirar o nombrar. ¿Cuánto sentís que eso ocurrió?"
  }
];

let mq=0,mirrorScore=0,mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0; mirrorLog=[];
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v??0);
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

/* DEVOLUCIÓN FINAL – NO TOCADA */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado en ajuste"
      :"Estado reactivo";

    finalHumanText.textContent =
      "Este resultado integra todo tu recorrido: cómo actuaste hacia afuera "+
      "y cómo lo viviste internamente. Aparecen zonas de coherencia y también "+
      "espacios donde sentir, pensar y actuar no siempre estuvieron alineados.\n\n"+
      "Nada de esto es un juicio. Es un reflejo del momento que atravesás.\n\n"+
      (avg>1.4
        ?"La congruencia fue predominante. El camino es sostener la observación consciente."
        :avg>0.9
          ?"El proceso muestra grises. Ahí es donde hay mayor potencial de transformación."
          :"La reactividad tuvo peso. Escuchar estos signos puede ser el primer gesto de cuidado.")+
      "\n\nCuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";
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
