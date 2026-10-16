Const $ = id => document.getElementById(id);

/* ===============================
   BLOQUEO SEMANAL — CONFIG
================================ */
const DEV_MODE = false;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const V2_BLOCK_KEY = "hm_v2_last_week";
const V2_STATE_KEY = "hm_v2_progress_state";

/* ===============================
   BLOQUEO Y PERSISTENCIA — UTILIDADES
================================ */
function now(){ return Date.now(); }

// 1. EL GUARDADO SOLO GUARDA (Registra la marca de tiempo sin alterar ni bloquear)
function registrarMarcaFinCiclo(){
  if (!localStorage.getItem(V2_BLOCK_KEY)) {
    localStorage.setItem(V2_BLOCK_KEY, now());
  }
}

function saveV2State(extra = {}) {
  const state = {
    week,
    q,
    currentScore,
    weeklyScores,
    allAnswers,
    mirrorLog,
    lastSection: document.querySelector("section:not(.hidden)")?.id || "start",
    timestamp: now(),
    ...extra
  };
  localStorage.setItem(V2_STATE_KEY, JSON.stringify(state));
}

function loadV2State() {
  const raw = localStorage.getItem(V2_STATE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/* ===============================
   BLOQUEO VISUAL UNIFICADO
================================ */
function showWeeklyBlockFlash(){
  const d = document.createElement("div");
  d.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    pointer-events:none;
    font-size:1.35rem;
    color:#eaffff;
    background:
      radial-gradient(circle, rgba(180,255,255,.28), transparent 60%),
      rgba(6,18,40,.45);
    text-shadow:
      0 0 12px rgba(140,255,240,1),
      0 0 26px rgba(140,255,240,.85);
    z-index:9999;
    animation: blockFade 1.3s ease-out forwards;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1300);
}

/* CACHE DOM */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const weeklyTextWrap = $("weeklyTextWrap");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");

const finalFill = $("finalFill");
const finalTextWrap = $("finalTextWrap");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

/* EMOJIS ESPEJO */
const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍🌫️","😊","🫥"];

/* DATOS BASE */
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
let week = 0, q = 0, currentScore = 0;
let weeklyScores = [], allAnswers = [], mirrorLog = [];

/* REANUDACIÓN AUTOMÁTICA EN V2 */
(function resumeV2() {
  const saved = loadV2State();
  if (!saved) return;

  week = saved.week || 0;
  q = saved.q || 0;
  currentScore = saved.currentScore || 0;
  weeklyScores = saved.weeklyScores || [];
  allAnswers = saved.allAnswers || [];
  mirrorLog = saved.mirrorLog || [];

  if (saved.lastSection) {
    show(saved.lastSection);
    if (saved.lastSection === "test") {
      loadQuestion();
    } else if (saved.lastSection === "weeklyResult") {
      updateThermometer(calculateCurrentPercentage());
    } else if (saved.lastSection === "monthlyResult" || saved.lastSection === "mirrorIntro") {
      updateThermometer(calculateHistoricalPercentage());
    } else if (saved.lastSection === "mirrorTest") {
      loadMirror();
    } else if (saved.lastSection === "finalResult") {
      updateThermometer(calculateFinalPercentage());
    }
  }
})();

/* FLUJO */
function startV2(){
  const saved = loadV2State();
  if (saved && (saved.week > 0 || (saved.lastSection && saved.lastSection !== "start"))) {
    show(saved.lastSection || "test"); 
    if (saved.lastSection === "test" || !saved.lastSection) loadQuestion();
    return;
  }

  document.body.classList.remove("mirror-bg");
  week = 0; q = 0; currentScore = 0;
  weeklyScores = []; allAnswers = []; mirrorLog = [];
  saveV2State({ lastSection: "test" });
  show("test"); loadQuestion();
}

function loadQuestion(){
  const w = WEEKS[week];
  if (!w) return;
  weekTitle.textContent = w.title;
  questionText.textContent = w.questions[q][0];
  questionMeasure.textContent = w.questions[q][1];
  
  updateThermometer();
}

function answer(v){
  currentScore += v;
  allAnswers.push({ block: WEEKS[week].title, q, v });
  q++;
  saveV2State({ q, currentScore, allAnswers });
  q >= 4 ? showWeekly() : loadQuestion();
}

/* ===============================
   DEVOLUCIONES SEMANALES
================================ */
function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");
  
  const avg = currentScore / 4;
  weeklyScores.push(avg);
  
  updateThermometer();

  const range =
    avg <= 0.6 ? "low" :
    avg <= 0.9 ? "midLow" :
    avg <= 1.4 ? "mid" : "high";

  weeklySymbol.textContent =
    range === "low" ? "🦇" :
    range === "midLow" ? "🦇" :
    range === "mid" ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Lo que ocurre en el mundo no siempre logra atravesarte.\n\n"+
        "El dolor ajeno, las injusticias o los conflictos pueden aparecer "+
        "como información lejana, sin generar un impacto emocional sostenido.\n\n"+
        "Esto no habla de falta de humanidad, sino de posibles mecanismos "+
        "de defensa, cansancio o saturación emocional.";
      weeklyAdvice.textContent =
        "Observar cuándo te cerrás y cuándo te abrís al otro "+
        "puede ser el primer gesto de reconexión humana.";
    } else {
      weeklyText.textContent =
        "El mundo no pasa desapercibido.\n\n"+
        "Hay registro del dolor, de la injusticia y de lo que afecta "+
        "a otros seres humanos.";
      weeklyAdvice.textContent =
        "Sostener esta sensibilidad sin que te abrume "+
        "es parte de un equilibrio humano maduro.";
    }
  }

  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent =
        "La atención aparece fragmentada.\n\n"+
        "La tecnología tiende a absorber momentos que podrían "+
        "ser habitados con mayor presencia.\n\n"+
        "No como error, sino como hábito automatizado.";
      weeklyAdvice.textContent =
        "Pequeños cortes conscientes pueden devolver densidad "+
        "a la experiencia cotidiana.";
    } else {
      weeklyText.textContent =
        "Lo digital acompaña sin dominar.\n\n"+
        "Hay uso consciente y registro del presente.";
      weeklyAdvice.textContent =
        "Este equilibrio sostiene vínculos más reales "+
        "y una experiencia más encarnada.";
    }
  }

  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent =
        "Se perciben fisuras entre pensamiento, emoción y acción.\n\n"+
        "No siempre lo que sentís logra expresarse "+
        "ni lo que pensás logra sostenerse en el hacer.";
      weeklyAdvice.textContent =
        "Nombrar estas incongruencias no es debilidad: "+
        "es el inicio del proceso de integración.";
    } else {
      weeklyText.textContent =
        "Las respuestas muestran una percepción de coherencia interna.\n\n"+
        "Esta lectura se limita a cómo te pensás y te observás a vos mismo.\n\n"+
        "Cómo esta coherencia se expresa en el vínculo con el mundo y la tecnología\n"+
        "se observa en el siguiente tramo.";
      weeklyAdvice.textContent = "";
    }
  }

  saveV2State({ lastSection: "weeklyResult", weeklyScores });
  setTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

function nextWeek(){
  week++; 
  q = 0; 
  currentScore = 0;
  
  const isFinished = week >= WEEKS.length;

  if (isFinished) {
    registrarMarcaFinCiclo(); // EL GUARDADO SOLO REGISTRA EL TIEMPO SIN BLOQUEAR
    saveV2State({ week, q, currentScore, lastSection: "monthlyResult" });
    showMonthly();
  } else {
    saveV2State({ week, q, currentScore, lastSection: "test" });
    show("test"); 
    loadQuestion();
  }
}

/* ===============================
   CIERRE DE CICLO VOLUMEN 2
================================ */
function showMonthly(){
  show("monthlyResult");
  updateThermometer();
  saveV2State({ lastSection: "monthlyResult" });
}

/* ===============================
   TU REFLEJO — PREGUNTAS COMPLETAS
================================ */
const MIRROR_QUESTIONS = [
  { t:"Cuando algo en la calle, en una conversación o en una situación cotidiana no sale como esperabas, ¿cuánto enojo sentís internamente, más allá de lo que muestres hacia afuera?" },
  { t:"Cuando te enterás de una situación difícil, injusta o dolorosa —ya sea propia o ajena—, ¿cuánta tristeza aparece en vos de forma real, aunque no la expreses?" },
  { t:"Cuando tenés que tomar una decisión importante o enfrentar una situación incierta, ¿cuánto miedo sentís antes de actuar, incluso si seguís advancing igual?" },
  { t:"Cuando recordás algo que dijiste, hiciste o dejaste de hacer, ¿cuánta culpa aparece después, aunque intentes justificarte o seguir adelante?" },
  { t:"Cuando se acumulan responsabilidades, demandas externas o presiones internas, ¿cuánta ansiedad sentís en tu cuerpo o en tu mente, aunque continúes funcionando?" },
  { t:"Cuando estás con personas importantes para vos, ¿cuánta desconexión emocional sentís, aun estando físicamente presente?" },
  { t:"Cuando vivís un momento simple, sin exigencias ni expectativas, ¿cuánta alegría genuina sentís, sin necesidad de estímulos externos?" },
  { t:"Cuando aparece una emoción incómoda que no sabés nombrar del todo, ¿cuánto tendés a evitarla, minimizarla o distraerte para no sentirla?" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

// EL BLOQUEO Y DESBLOQUEO ESTÁN CONCENTRADOS EXCLUSIVAMENTE EN ESTE BOTÓN
function gateMirrorIntro(){
  if (DEV_MODE) {
    openMirror();
    return;
  }

  const lastTime = localStorage.getItem(V2_BLOCK_KEY);
  
  if (!lastTime || isNaN(Number(lastTime))) {
    openMirror();
    return;
  }

  const transcurrido = now() - Number(lastTime);

  if (transcurrido < WEEK_MS) {
    showWeeklyBlockFlash(); // BLOQUEO
  } else {
    openMirror();           // DESBLOQUEO
  }
}

function openMirror(){
  show("mirrorIntro");
  updateThermometer();
  saveV2State({ lastSection: "mirrorIntro" });
}

function startMirror(){
  if (!DEV_MODE) {
    const lastTime = localStorage.getItem(V2_BLOCK_KEY);
    if (lastTime && !isNaN(Number(lastTime))) {
      if ((now() - Number(lastTime)) < WEEK_MS) {
        showWeeklyBlockFlash();
        return;
      }
    }
  }

  document.body.classList.add("mirror-bg");
  mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  saveV2State({ lastSection: "mirrorTest" });
  show("mirrorTest"); loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent = MIRROR_EMOJIS[mq] || "⬤";
  mirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
  updateThermometer();
}

function answerMirror(v){
  mirrorLog.push(v ?? 0);
  if(v !== null){ mirrorScore += v; mirrorCount++; }
  mq++;

  if(mq === MIRROR_QUESTIONS.length){
    let semanticDelta = 0;
    const evitacion = mirrorLog[7] ?? 0;
    const desconexion = mirrorLog[5] ?? 0;
    const alegria = mirrorLog[6] ?? 0;
    semanticDelta -= (evitacion + desconexion) * 0.1;
    semanticDelta += alegria * 0.1;
    mirrorScore += semanticDelta;
  }

  saveV2State({ mq, mirrorScore, mirrorCount, mirrorLog });
  mq >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* ===============================
   DEVOLUCIÓN FINAL INTEGRATIVA Y CIERRE (TEXTOS EXTENDIDOS RESTAURADOS)
================================ */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");
  updateThermometer();
  saveV2State({ lastSection: "finalResult" });

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;

  const tristezaAjena = mirrorLog[1] ?? 0;
  const desconexion = mirrorLog[5] ?? 0;
  const evitacion = mirrorLog[7] ?? 0;

  const bajaEmpatia = tristezaAjena <= 0.5;
  const desconexionActiva = desconexion >= 1;
  const evitacionActiva = evitacion >= 1;

  let semanticPenalty = 0;
  if(bajaEmpatia) semanticPenalty++;
  if(desconexionActiva) semanticPenalty++;
  if(evitacionActiva) semanticPenalty++;

  let range =
    avg <= 0.6 ? 0 :
    avg <= 0.9 ? 1 :
    avg <= 1.4 ? 2 : 3;

  if(range >= 2 && semanticPenalty >= 2){
    range -= 1;
  }

  animateGauge(finalFill, (avg / 2) * 100, ()=>{
    finalTextWrap.classList.remove("hidden");

    if(range === 0){
      finalState.textContent = "Predominio de NO";
      finalHumanText.textContent =
        "Analizando el ciclo completo, aparece un patrón claro y sostenido:\n"+
        "muchas situaciones cotidianas que implican dolor ajeno, conflicto o malestar externo\n"+
        "no generan en vos una respuesta emocional significativa o visible.\n\n"+
        "Esta observación no constituye un juicio moral ni una acusación de frialdad;\n"+
        "señala la presencia de un mecanismo de distancia adaptativa.\n\n"+
        "Esta distancia actúa frecuentemente como un escudo de protección inconsciente:\n"+
        "una estrategia para resguardar la propia energía no involucrándose afectivamente.\n\n"+
        "El riesgo latente no radica en no sentir en un instante puntual,\n"+
        "sino en normalizar e institucionalizar ese apagamiento emocional como un estado estable e permanente.\n\n"+
        "Cuando las vivencias y dolores de los demás dejan de resonar internamente,\n"+
        "la humanidad se vuelve puramente funcional y operativa, pero pierde su profundidad y su impacto real.\n\n"+
        "Esta devolución no busca juzgarte, sino iluminar un punto ciego fundamental:\n"+
        "aquel espacio donde la empatía y la conexión genuina podrían desarrollarse,\n"+
        "pero donde hoy prima el repliegue y la desconexión.";
    }
    else if(range === 1){
      finalState.textContent = "Ambivalencia emocional";
      finalHumanText.textContent =
        "Tus respuestas a lo largo del recorrido reflejan una humanidad oscilante, que se manifiesta y luego se retira.\n\n"+
        "Existen momentos claros de registro sensible, presencia y empatía genuina,\n"+
        "seguidos inmediatamente por tramos de automatismo, duda o replegamiento defensivo.\n\n"+
        "La recurrencia del 'tal vez' o de las respuestas intermedias no representa una simple indecisión superficial:\n"+
        "es el síntoma directo de una tensión interna constante entre lo que sentís internamente\n"+
        "y lo que efectivamente te permitís experimentar y expresar hacia afuera.\n\n"+
        "La integración emocional no se alcanza forzando certidumbres o respuestas perfectas;\n"+
        "comienza a construirse cuando dejás de luchar contra la contradicción\n"+
        "y aceptás habitar con honestidad lo que surge en vos, incluso cuando se presenta de forma incompleta.";
    }
    else if(range === 2){
      finalState.textContent = "Incongruencia marcada";
      finalHumanText.textContent =
        "Al integrar la totalidad de tus respuestas en los distintos bloques,\n"+
        "se evidencia una incompatibilidad estructural entre las diversas dimensiones de tu experiencia.\n\n"+
        "Se observan registros de alta conciencia y lucidez en ciertos planos teóricos o reflexivos,\n"+
        "que conviven con estados de neutralidad, indiferencia o ausencia emocional frente a situaciones donde la sensibilidad humana es determinante.\n\n"+
        "No se trata de una incoherencia puramente intelectual o de pensamiento.\n"+
        "Se trata de una incongruencia emocional profunda:\n"+
        "diferentes facetas de tu ser responden desde lugares opuestos y no coordinados.\n"+
        "Mientras una parte se percibe plenamente consciente,\n"+
        "otra evita activamente implicarse y otra busca racionalizar el proceso.\n\n"+
        "El resultado es una vivencia fragmentada: altamente funcional y adaptada en lo social,\n"+
        "pero desintegrada en su núcleo interno.\n\n"+
        "La verdadera evolución no comienza corrigiendo intelectualmente las respuestas,\n"+
        "sino reconociendo con transparencia dónde no estás siendo el mismo en todos los aspectos de tu vida.";
    }
    else{
      finalState.textContent = "Congruencia humana";
      finalHumanText.textContent =
        "A lo largo de todo el recorrido evaluado se sostiene una misma línea directora:\n"+
        "una marcada coherencia entre lo que sentís, lo que pensás y el modo en que actuás frente al entorno.\n\n"+
        "No se detectan fisuras defensivas ni contradicciones severas entre tus planos internos,\n"+
        "sino la manifestación de una humanidad que registra el entorno, procesa las emociones con madurez\n"+
        "y responde con presencia auténtica.\n\n"+
        "Este estado no representa un logro estático ni una condición de perfección inalterable;\n"+
        "es el reflejo de un ejercicio constante de conciencia activa.\n\n"+
        "Integrar la propia humanidad no significa llegar a un destino final definitivo,\n"+
        "sino mantener viva y abierta la capacidad cotidiana de seguir sintiendo y conectando con la realidad.";
    }
  });
}

/* ===============================
   CIERRE Y LIMPIEZA TOTAL DE CICLO (REINICIO REFORZADO)
================================ */
function finalizarYReiniciar() {
  const overlay = document.getElementById("cubeOverlay");
  if (overlay) overlay.classList.add("active");

  setTimeout(() => {
    localStorage.removeItem(V2_STATE_KEY);
    localStorage.removeItem(V2_BLOCK_KEY);

    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("mirror-bg");
    
    // REINICIO COMPLETO Y LIMPIO DE LA PWA
    window.location.reload();
  }, 3000);
}

/* ===============================
   CÁLCULOS DE PORCENTAJE DE TERMÓMETRO ACUMULATIVO (1-100)
================================ */
function calculateCurrentPercentage() {
  let totalQuestionsCount = 0;
  WEEKS.forEach(w => { totalQuestionsCount += w.questions.length; });

  let answeredCount = 0;
  if (week < WEEKS.length) {
    answeredCount = (week * 4) + q;
  } else {
    answeredCount = totalQuestionsCount;
  }

  const activeSec = document.querySelector("section:not(.hidden)")?.id;
  if (activeSec === "mirrorTest") {
    answeredCount = totalQuestionsCount + (mq > 0 ? mq : 0);
    totalQuestionsCount += MIRROR_QUESTIONS.length;
  }

  if (totalQuestionsCount === 0 || answeredCount === 0) {
    return 5;
  }

  let totalEarned = 0;
  let maxPossibleSoFar = 0;

  for (let i = 0; i < weeklyScores.length; i++) {
    maxPossibleSoFar += 4 * 2;
    totalEarned += weeklyScores[i] * 4;
  }

  if (activeSec === "test" && week < WEEKS.length) {
    maxPossibleSoFar += q * 2;
    totalEarned += currentScore;
  } else if (activeSec === "mirrorTest") {
    maxPossibleSoFar += mirrorScore;
    totalEarned += mirrorScore;
  }

  const qualityRatio = maxPossibleSoFar > 0 ? (totalEarned / maxPossibleSoFar) : 0;
  const progressFraction = answeredCount / totalQuestionsCount;
  const baseProgress = Math.max(5, Math.round(progressFraction * 100));
  
  let targetPct = Math.round(baseProgress * (0.3 + (qualityRatio * 0.7)));
  return Math.min(100, Math.max(5, Math.round(targetPct)));
}

function calculateHistoricalPercentage() {
  if (weeklyScores.length === 0) return 30;
  let sum = weeklyScores.reduce((a, b) => a + b, 0);
  let avg = sum / weeklyScores.length;
  return Math.min(100, Math.max(5, Math.round((avg / 2) * 100)));
}

function calculateFinalPercentage() {
  const hist = calculateHistoricalPercentage();
  const mirrorAvg = mirrorCount ? (mirrorScore / mirrorCount) : 1;
  const mirrorPct = (mirrorAvg / 2) * 100;
  return Math.min(100, Math.max(5, Math.round((hist * 0.4) + (mirrorPct * 0.6))));
}

/* ===============================
   TERMÓMETRO GLOBAL INTEGRADO V2
================================ */
function updateThermometer(explicitPercent) {
  let targetPercent = explicitPercent;
  
  if (targetPercent === undefined) {
    const activeSec = document.querySelector("section:not(.hidden)")?.id;
    if (activeSec === "monthlyResult" || activeSec === "mirrorIntro") {
      targetPercent = calculateHistoricalPercentage();
    } else if (activeSec === "finalResult") {
      targetPercent = calculateFinalPercentage();
    } else {
      targetPercent = calculateCurrentPercentage();
    }
  }

  const fills = document.querySelectorAll('.thermo-fill');
  fills.forEach(fill => {
    if (fill) {
      fill.style.width = targetPercent + '%';
      
      if (targetPercent <= 50) {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 100%)";
      } else if (targetPercent <= 75) {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 50%, #ffc107 100%)";
      } else {
        fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 33%, #ffc107 66%, #10b981 100%)";
      }
    }
  });

  const valSpans = document.querySelectorAll('.thermo-percentage-val');
  valSpans.forEach(span => {
    span.textContent = targetPercent + '%';
  });
}

/* UTIL */
function animateGauge(el, target, done){
  if (!el) {
    done && done();
    return;
  }
  el.style.height="0%";
  const start = performance.now(), dur = 1800;
  
  function step(t){
    const p = Math.min(1,(t-start)/dur);
    el.style.height = p * target + "%";
    p < 1 ? requestAnimationFrame(step) : done && done();
  }
  requestAnimationFrame(step);
}

function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s => {
      const el = $(s);
      if (el) el.classList.toggle("hidden", s !== id);
    });
}
