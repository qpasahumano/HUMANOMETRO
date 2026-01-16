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

/* REGISTRO */
let week=0,q=0,currentScore=0;
let weeklyScores=[];

/* FLUJO */
function startV2(){
  week=0;q=0;currentScore=0;weeklyScores=[];
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
  q++;
  q>=4?showWeekly():loadQuestion();
}

/* ===== DEVOLUCIONES SEMANALES – TEXTO REFORMULADO ===== */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(week === 0){
    // Vos ante el mundo
    if(avg < 1.5){
      weeklyText.textContent =
        "Al observar lo que sucede a tu alrededor, aparece una sensibilidad que no siempre logra sostenerse. "+
        "Algunas situaciones externas pasan sin terminar de atravesarte, y la presencia frente a otros se vuelve intermitente. "+
        "Esto puede marcar una distancia entre lo que ocurre en el mundo y el lugar que eso ocupa en vos.";
      weeklyAdvice.textContent =
        "Registrar este punto abre la posibilidad de ampliar la mirada y recuperar sensibilidad frente al entorno humano.";
    } else {
      weeklyText.textContent =
        "La forma en que registrás el mundo muestra una sensibilidad activa. "+
        "Las situaciones externas logran atravesarte y hay disposición a estar presente frente a otros.";
      weeklyAdvice.textContent =
        "Sostener esta apertura fortalece el vínculo con la humanidad que te rodea.";
    }
  }

  if(week === 1){
    // Vos y la tecnología
    if(avg < 1.5){
      weeklyText.textContent =
        "En tu relación con la tecnología se percibe una presencia fragmentada. "+
        "El tiempo en pantalla y la atención dispersa parecen interferir en el contacto real con los vínculos y el momento presente.";
      weeklyAdvice.textContent =
        "Recuperar equilibrio no implica rechazar lo digital, sino volver a habitar el presente con mayor conciencia.";
    } else {
      weeklyText.textContent =
        "La tecnología aparece integrada como una herramienta y no como un centro. "+
        "Hay señales de presencia real y de atención disponible hacia los vínculos.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene una experiencia más humana y consciente.";
    }
  }

  if(week === 2){
    // Integración humana
    if(avg < 1.5){
      weeklyText.textContent =
        "Al unir pensamiento, emoción y acción surgen fricciones. "+
        "No todo lo que sentís encuentra coherencia en lo que hacés, y eso genera tensiones internas que quedan registradas.";
      weeklyAdvice.textContent =
        "Observar estas diferencias sin juicio es el primer paso hacia una integración más consciente.";
    } else {
      weeklyText.textContent =
        "Se percibe alineación entre lo que sentís, pensás y hacés. "+
        "Las decisiones muestran coherencia interna y una integración emocional estable.";
      weeklyAdvice.textContent =
        "Este estado indica un proceso humano que avanza con conciencia.";
    }
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length?showMonthly():(show("test"),loadQuestion());
}

/* ===== CIERRE BOSQUE ===== */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

    monthlyLongText.textContent =
      "Al mirar el recorrido completo aparecen patrones claros. "+
      "Hay momentos de coherencia y otros donde el ritmo interno y externo no coinciden. "+
      "Nada de esto es fijo: muestra un proceso en movimiento.";

    monthlyText.textContent =
      "El mes deja ver ajustes, pausas y aprendizajes que forman parte de tu experiencia humana.";
  });
}

/* ===== ESPEJO – SIN CAMBIOS ===== */
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

let mq=0,mirrorScore=0,mirrorCount=0;

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
  mq=0; mirrorScore=0; mirrorCount=0;
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent="⬤";
  mirrorQuestion.textContent=MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length?showFinal():loadMirror();
}

/* ===== DEVOLUCIÓN FINAL – FOCO EN GRISES ===== */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado en transición"
      :"Estado tensionado";

    finalHumanText.textContent =
      "Al recorrer todas tus respuestas, desde el inicio hasta este cierre, "+
      "se observa cómo fuiste atravesando el mes a nivel humano.\n\n"+
      "Aparecen zonas donde la conciencia estuvo presente y otras donde el decir, sentir y hacer no caminaron al mismo ritmo. "+
      "Estas diferencias no hablan de error, sino de puntos de ajuste que quedaron visibles.\n\n"+
      (avg>1.4
        ?"El proceso muestra coherencia narrativa y conciencia sostenida."
        :avg>0.9
          ?"El proceso revela avances mezclados con automatismos que aún se repiten."
          :"El proceso evidencia tensiones internas que piden revisión y cuidado.")+
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
