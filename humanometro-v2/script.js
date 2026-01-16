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

/* =======================
   DATOS – NO SE TOCAN
   ======================= */
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

/* =======================
   REGISTROS GLOBALES
   ======================= */
let week=0, q=0, currentScore=0;
let weeklyScores=[];
let carenciasGlobales=[];
let mirrorLog=[];

/* =======================
   FLUJO PRINCIPAL
   ======================= */
function startV2(){
  week=0; q=0; currentScore=0;
  weeklyScores=[]; carenciasGlobales=[]; mirrorLog=[];
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

  // detección de carencias por pregunta
  if(v <= 1){
    registrarCarencia(WEEKS[week].title, q);
  }

  q++;
  q>=4 ? showWeekly() : loadQuestion();
}

/* =======================
   LÓGICA DE CARENCIAS
   ======================= */
function registrarCarencia(bloque, index){
  const mapa = {
    "Vos ante el mundo": [
      "empatía frente al dolor colectivo",
      "presencia real en los vínculos",
      "compromiso ante la injusticia",
      "sensibilidad frente al sufrimiento ajeno"
    ],
    "Vos y la tecnología": [
      "presencia existencial al compartir",
      "gestión del tiempo y ansiedad digital",
      "registro de la humanidad detrás de la pantalla",
      "equilibrio entre tecnología y vida real"
    ],
    "Integración humana": [
      "coherencia entre pensar y actuar",
      "autoobservación sin juicio",
      "responsabilidad emocional",
      "sensación de evolución personal"
    ]
  };

  carenciasGlobales.push(mapa[bloque][index]);
}

/* =======================
   DEVOLUCIÓN SEMANAL
   ======================= */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg=currentScore/4;
  weeklyScores.push(avg);
  weeklySymbol.textContent = avg<0.8?"🦇":avg<1.5?"🐞":"🐦";

  if(avg < 1.5){
    weeklyText.textContent =
      "Las respuestas de este tramo muestran carencias concretas: "+
      carenciasGlobales.slice(-4).join(", ") + ". "+
      "Estas zonas grises indican desconexiones entre lo que sucede afuera "+
      "y la forma en que lo estás registrando internamente.";
    weeklyAdvice.textContent =
      "Tomar conciencia de estas carencias es el primer paso para transformarlas.";
  } else {
    weeklyText.textContent =
      "En este tramo se sostuvo mayor coherencia entre percepción, emoción y acción. "+
      "Las respuestas reflejan un nivel de presencia que permite atravesar el contexto "+
      "con mayor conciencia.";
    weeklyAdvice.textContent =
      "Sostener esta observación es clave para no volver al automatismo.";
  }

  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; q=0; currentScore=0;
  week>=WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

/* =======================
   CIERRE BLOQUE BOSQUE
   ======================= */
function showMonthly(){
  show("monthlyResult");
  monthlyTextWrap.classList.add("hidden");

  const avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  animateGauge(monthlyFill,(avg/2)*100,()=>{
    monthlyTextWrap.classList.remove("hidden");
    monthlySymbol.textContent=avg<0.8?"🦇":avg<1.5?"🐞":"🐦";
    monthlyLongText.textContent =
      "A lo largo de este recorrido aparecieron patrones claros de conducta, "+
      "momentos de conciencia y también reiteradas zonas de desconexión.";
    monthlyText.textContent =
      "El proceso muestra avances, pero también estancamientos que vale la pena observar.";
  });
}

/* =======================
   ESPEJO – PREGUNTAS EXACTAS
   ======================= */
const MIRROR_QUESTIONS=[
 {t:"En estos días, ¿sentiste enojo en algún momento que haya influido en tu forma de actuar?"},
 {t:"En estos días, ¿sentiste tristeza que haya condicionado tus decisiones o tu energía?"},
 {t:"¿Sentiste miedo (a perder, a equivocarte, a confrontar) que te haya limitado o frenado?"},
 {t:"¿Apareció culpa por algo dicho o hecho, que haya quedado sin resolver internamente?"},
 {t:"¿Sentiste ansiedad o inquietud que te haya llevado a reaccionar de forma automática?"},
 {t:"¿Percibiste momentos de indiferencia o desconexión emocional frente a personas o situaciones importantes?"},
 {t:"¿Experimentaste alegría o bienestar genuino que haya sido coherente con lo que estabas viviendo?"},
 {t:"Mirando estos días en conjunto, ¿hubo alguna emoción dominante que no supiste nombrar o preferiste evitar?"}
];

let mq=0, mirrorScore=0, mirrorCount=0;

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
  mirrorLog.push(v??0);
  if(v!==null){ mirrorScore+=v; mirrorCount++; }
  mq++;
  mq>=MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* =======================
   DEVOLUCIÓN FINAL TOTAL
   ======================= */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg=mirrorCount?mirrorScore/mirrorCount:0;

  animateGauge(finalFill,(avg/2)*100,()=>{
    finalTextWrap.classList.remove("hidden");

    finalState.textContent =
      avg>1.4?"Estado integrado"
      :avg>0.9?"Estado inestable"
      :"Estado reactivo";

    finalHumanText.textContent =
      "A lo largo de todo el proceso se evidencian incoherencias entre lo que sentís, "+
      "lo que pensás y cómo actuás. Las respuestas muestran carencias reiteradas en áreas como "+
      carenciasGlobales.slice(0,6).join(", ") + ".\n\n"+
      "Estos grises no son fallas, pero sí señales claras de aspectos no integrados. "+
      (avg>1.4
        ?"Actualmente hay mayor congruencia interna, señal de un proceso evolutivo activo."
        :avg>0.9
          ?"El estado actual es de transición, con avances y retrocesos visibles."
          :"Predomina el automatismo y la desconexión, indicando estancamiento emocional.")+
      "\n\nEl foco no está en juzgar, sino en registrar. "+
      "Cuando necesites volver a medir tu humanidad, el Humanómetro está para eso.";
  });
}

/* =======================
   UTILIDADES
   ======================= */
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
